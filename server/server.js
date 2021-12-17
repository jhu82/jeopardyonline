const app = require("express")()
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

  io.on("connection", socket => {
    console.log(socket.id);
    socket.on("create_room", () => {
      const roomID = generateRoomID();
      socket.join(roomID);
      const roomSize = 1;
      io.to(roomID).emit("joined", roomID, roomSize);
    })

    socket.on("join_room", (roomID) => {
      const room = io.sockets.adapter.rooms.get(roomID);
      if (!room) return io.emit("join_error", "Room ID does not exist.");
      const roomSize = room.size;
      if (roomSize < 3) {
        socket.join(roomID);
        //Track roomSize so last to join calls initialize event, and generate the board.
        console.log(roomSize);
        io.to(roomID).emit("joined", roomID, roomSize + 1);
      } else {
        io.emit("join_error", "Room is full. Please create or join a new room.");
      }
    })

    //Logic and API calls to populate board with categories and clues
    socket.on('initialize', async (roomID) => {
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
            questions.push(categoryQuestions.data.slice(0, 5));
          }))
          io.emit("questions", questions);
      } catch(e) {
          console.log(e);
      }
    })

    socket.on("buzzer", (roomID, name) => {
      io.to(roomID).emit("message", `${name} has pressed the buzzer`);
    })
})



http.listen(4000, function() {
  console.log('listening on port 4000')
})