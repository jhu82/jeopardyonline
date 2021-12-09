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
  console.log(socket.id)
  socket.on('message', ({ name, message }) => {
    io.emit('message', { name, message })
    console.log(message);
  })

  socket.on('initialize', async () => {
    const seed = Math.floor(1000 + Math.random() * 15000);
    console.log(seed);
    //Grab 5 random categories based on seed number
    const url = `https://jservice.io/api/categories?count=5&offset=${seed}`
    try {
        console.log('hello');
        const categories = await axios.get(url);
        console.log(categories);
        io.emit('categories', categories.data);
    }catch(e) {
        console.log(e);
    }
  })
})


http.listen(4000, function() {
  console.log('listening on port 4000')
})