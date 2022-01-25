const http = require("http").createServer()
const io = require("socket.io")({
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    },
});
const axios = require("axios");

const rooms = new Map();

io.attach(http, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});
 
const generateRoomID = () => {
  let roomID = '';
  for (let i = 0; i < 4; i++) {
    roomID += String.fromCharCode(65 + Math.random() * 26);
  }
  return roomID;
}

const findQuestion = (questions, questionID) => {
  for (const category of questions) {
    for (const question of category) {
      if (question.id === questionID) return question;
    }
  }
}

const compareAnswer = (playerAnswer, correctAnswer) => {
  return playerAnswer.toUpperCase() === correctAnswer.toUpperCase();
}

io.on("connection", socket => {

  /*
    Socket listener for generating room for players to join

    @params name: name of the user who initialized the room creation
    @emit joined: intial room instance sent to client reflecting room has been created
  */
  socket.on("create_room", (name) => {
    const roomID = generateRoomID();
    socket.join(roomID);
    const room = {
      "roomID": roomID,
      "players": [
        {
          "id": socket.id,
          "name": name,
          "money": 0,
        }
      ],
      "hostID": socket.id,
      "questions": [],
      "timer": null
    }
    rooms.set(roomID, room);
    io.to(roomID).emit("joined", room);
  })
  /*
    Socket listener, waiting for clients to join an existing room if room size is less than 3. 

    @params roomID: ID of room client is attempting to join.
    @params name: name of the client who is attempting to join room.
    @emit joined: updated room instance is sent to all clients in room reflecting who has joined
  */
  socket.on("join_room", (roomID, name) => {
    const room = rooms.get(roomID);
    if (!room) return io.to(socket.id).emit("error", "Room ID does not exist.");
    const roomSize = room.players.length;
    if (roomSize < 3) {
      socket.join(roomID);
      const newPlayer = {
        "id": socket.id,
        "name": name,
        "money": 0,
      }
      const updatedRoom = {...room, players: [...room.players, newPlayer ]};
      rooms.set(roomID, updatedRoom);
      io.to(roomID).emit("joined", updatedRoom);
    } else {
      io.to(socket.id).emit("error", "Room is full. Please create or join a new room.");
    }
  })

  /*
    Socket listener initializing the game instance for all players of a given room. 
    Server makes API calls to jservice API endpoint to grab questions and categories to be populated for client. 
    A random seed is used to randomly grab the questions from the endpoint. Once all questions are loaded, the room
    instance is updated and emitted to each client.

    @params roomID: ID of the room for the game instance to be populated.
    @emit questions: emit to client room updated with questions, grabbed from API
  */
  socket.on("initialize", async (roomID) => {
    const room = rooms.get(roomID);
    const roomSize = room.players.length;
    if (roomSize < 1) return;
    const seed = Math.floor(1000 + Math.random() * 15000);
    try {
        const url = `https://jservice.io/api/categories?count=6&offset=${seed}`
        const categories = await axios.get(url);
        let questions = [];
        await Promise.all(categories.data.map(async (category) => {
          const url = `https://jservice.io/api/clues?category=${category.id}`
          const categoryQuestions = await axios.get(url);
          let row = 1;
          questions.push(categoryQuestions.data.slice(0, 5).map((question) => {
            question.answered = false;
            question.value = 200 * row++;
            return question;
          }));
        }))
        const updatedRoom = {...room, questions: questions };
        rooms.set(roomID, updatedRoom);
        io.to(roomID).emit("questions", updatedRoom);
    } catch(e) {
        console.log(e);
    }
  })

  /*
    Socket listener for when a user click on a question to be answered. Timeout is set to end the question if 
    no player chooses to answer, given that they haven't attempted to anwser already. The listener is also for 
    if a player answered incorrectly, so other players have an opportunity to answer the question as well. 

    @params roomID: ID of the room which the question selection took place
    @params questionID: ID of the question to be referenced in room object
    @emit question_sent: update to clients that a question has been selected
    @emit message: if answer not provided by timeout, message will be sent displaying correct answer. It will
    update the client to disable buzzer so they can no longer answer the question.
    @emit question_end: notifies clients that the question is ended so they can update their state accordingly
    @emit update_room: sends updated room reflecting current game state
  */

  socket.on("question_selected", (roomID, questionID) => {
    const room = rooms.get(roomID);
    const question = findQuestion(room.questions, questionID);
    clearTimeout(room.timer);
    io.to(roomID).emit("question_sent", question);
    room.timer = setTimeout(() => {
      const message = `The correct answer is ${question.answer}.`
      io.to(roomID).emit("message", message, "disable_buzzer");
      setTimeout(() => {
        question.answered = true;
        io.to(roomID).emit("question_end");
        io.to(roomID).emit("update_room", room);
      }, 3000)
    }, 5000);
  })

  /*
    Socket listener for when a user presses buzzer in order to attempt to answer the question. A timeout is 
    given for if the answer is provided too late, which will count as an incorrect answer.

    @params roomID: ID of the room which the event took place
    @params socketID: ID of the client who attempted to answer the question
    @params questionID: ID of the question to be answered
    @emit message: updates all clients in room that someone is attempting to answer the question
    @emit message: updates all clients that the player who pressed the buzzer is unable to answer the question. 
    @emit incorrect_answer: updates all clients that the incorrect answer was provided
  */
  socket.on("buzzer_pressed", (roomID, socketID, questionID) => {
    const room = rooms.get(roomID);
    clearTimeout(room.timer);
    const question = findQuestion(room.questions, questionID);
    const player = room.players.find(player => player.id === socketID);
    const message = `${player.name} is answering...`;
    io.to(roomID).emit("message", message);
    io.to(roomID).emit("buzzer_pressed", player.id);
    room.timer = setTimeout(() => {
      const message = `Time is up. ${player.name} was not able to answer.`;
      io.to(roomID).emit("message", message, "disable_input");
      setTimeout(() => {
        player.money -= question.value;
        io.to(roomID).emit("incorrect_answer");
      }, 2000)
    }, 10000);
  })

  /*
    Socket listener for when an answer is provided. The answer is matched against the actual answer. The player's points are
    updated accordingly.

    @params roomID: ID of the room which the event took place
    @params socketID: ID of the client who attempted to answer the question
    @params questionID: ID of the question to be answered
    @params answer: Attempted answer provided by the client
    @emit message: notify all clients whether the provided answer was correct or incorrect
    @emit question_end: notifies clients that the question is ended so they can update their state accordingly
    @emit update_room: sends updated room reflecting current game state
  */
  socket.on("player_answered", (roomID, socketID, questionID, answer) => {
    const room = rooms.get(roomID);
    clearTimeout(room.timer);
    const question = findQuestion(room.questions, questionID);
    const player = room.players.find(player => player.id === socketID);
    if (compareAnswer(question.answer, answer)) {
      room.timer = setTimeout(() => {
        const message = `${player.name} answered ${answer}. This is the correct answer!`
        io.to(roomID).emit("message", message, "disable_input");
        setTimeout(() => {
          question.answered = true;
          player.money += question.value;
          room.hostID = socketID;
          io.to(roomID).emit("question_end");
          io.to(roomID).emit("update_room", room);
        }, 3000)
      }, 3000);
    } else {
      room.timer = setTimeout(() => {
        const message = `${player.name} answered ${answer}. This is incorrect.`;
        io.to(roomID).emit("message", message, "disable_input");
        setTimeout(() => {
          player.money -= question.value;
          io.to(roomID).emit("incorrect_answer");
        }, 2000)
      }, 5000);
    }
  })
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})