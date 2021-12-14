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

io.on('connection', socket => {
  console.log(socket.id);
  socket.join("room");
  io.to("room").emit('message', socket.id);

  socket.on("buzzer", id => {
    io.to("room").emit('message', `${id} has pressed the buzzer`);
  })
  //Logic and API calls to populate board with categories and clues
  socket.on('initialize', async () => {
    const seed = Math.floor(1000 + Math.random() * 15000);
    console.log(seed);
    //Grab 6 random categories based on seed number
    try {
        const categories = await axios.get(`https://jservice.io/api/categories?count=6&offset=${seed}`);
        io.emit('categories', categories.data);
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
})


http.listen(4000, function() {
  console.log('listening on port 4000')
})