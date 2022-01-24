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

io.on("connection", socket => {

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
    console.log(roomID);
    io.to(roomID).emit("joined", room);
  })

  socket.on("join_room", (roomID, name) => {
    const room = rooms.get(roomID);
    if (!room) return io.to(socket.id).emit("error", "Room ID does not exist.");
    const roomSize = room.players.length;
    if (roomSize < 3) {
      socket.join(roomID);
      console.log(roomID);
      console.log(roomSize);
      const newPlayer = {
        "id": socket.id,
        "name": name,
        "money": 0,
      }
      const updatedRoom = {...room, players: [...room.players, newPlayer ]};
      rooms.set(roomID, updatedRoom);
      console.log(updatedRoom);
      io.to(roomID).emit("joined", updatedRoom);
    } else {
      io.to(socket.id).emit("error", "Room is full. Please create or join a new room.");
    }
  })

  //Logic and API calls to populate board with categories and clues
  socket.on('initialize', async (roomID) => {
    const room = rooms.get(roomID);
    const roomSize = room.players.length;
    if (roomSize < 1) return;
    const seed = Math.floor(1000 + Math.random() * 15000);
    //Grab 6 random categories based on seed number
    try {
        const url = `https://jservice.io/api/categories?count=6&offset=${seed}`
        const categories = await axios.get(url);
        io.to(roomID).emit('categories', categories.data);
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

  socket.on('question_selected', (roomID, questionID) => {
    const room = rooms.get(roomID);
    const question = findQuestion(room.questions, questionID);
    clearTimeout(room.timer);
    io.to(roomID).emit("question_sent", question);
    room.timer = setTimeout(() => {
      const message = `The correct answer is ${question.answer}.`
      io.to(roomID).emit("message", message);
      setTimeout(() => {
        question.answered = true;
        io.to(roomID).emit("question_end");
        io.to(roomID).emit("update_room", room);
      }, 3000)
    }, 5000);
  })

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
      io.to(roomID).emit("message", message);
      setTimeout(() => {
        io.to(roomID).emit("incorrect_answer");
      }, 3000)
    }, 5000);
  })

  socket.on("answering", (roomID, socketID, question) => {

  })
})



http.listen(4000, function() {
  console.log('listening on port 4000')
})