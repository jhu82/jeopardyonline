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
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})