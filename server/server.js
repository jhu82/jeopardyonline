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
  for (let i = 0; i < 3; i++) {
    roomID += String.fromCharCode(60 + Math.random() * 26);
  }
  return roomID;
}

  io.on('connection', socket => {

  socket.on("create_room", () => {
    const roomID = generateRoomID();
    io.emit("room_created", roomID);
  })

  socket.on("join_room", (roomID, name) => {
    const roomSize = io.sockets.adapter.rooms.get(roomID).size;
    if (roomSize < 3) {
      socket.join(roomID);
      const successMessage = `${name} has joined the room.`;
      //Track roomSize so last to join calls initialize event, and generate the board.
      io.emit("joined", successMessage, roomSize + 1);
    } else {
      const errorMessage = "Room is full. Please create or join a new room.";
      io.emit("error", errorMessage);
    }
  })
  
  //Logic and API calls to populate board with categories and clues
  socket.on('initialize', async (roomID) => {
    const seed = Math.floor(1000 + Math.random() * 15000);
    //Grab 6 random categories based on seed number
    try {
        const categories = await axios.get(`https://jservice.io/api/categories?count=6&offset=${seed}`);
        io.to(roomID).emit('categories', categories.data);
        let questions = [];
        await Promise.all(categories.data.map(async (category) => {
          const categoryQuestions = await axios.get(`https://jservice.io/api/clues?category=${category.id}`);
          questions.push(categoryQuestions.data.slice(0, 5));
        }))
        io.emit('questions', questions);
    }catch(e) {
        console.log(e);
    }
  })

  socket.on("buzzer", (roomID, name) => {
    io.to(roomID).emit('message', `${name} has pressed the buzzer`);
  })

})



http.listen(4000, function() {
  console.log('listening on port 4000')
})