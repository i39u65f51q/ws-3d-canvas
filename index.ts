import { Server } from "socket.io";
import { createServer } from "http";

const port = 3200;

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],       
        credentials: true,              
      },
})

let members:{name:string, socketId:string}[] = []
let img:string = "";
console.log('Launch Socket Server on ' + port)
const roomId = "painting-room"
io.on("connect", (socket) => {
    // console.log("connection", socket);
    socket.join(roomId)
    console.log("new Socket connected:", socket.id)

    // user into room
    socket.on("join", name  => {                  
        // io.to(roomId).except(socket.id).emit("on-join", res );
        members.push({name:name, socketId:socket.id});
        io.to(roomId).emit("on-join", {name:name, members:members.map((member) => member.name), img:img});        
    })
    
    socket.on("disconnect", () => {
        console.log('disconnected:', socket.id)
        members= members.filter((member) => member.socketId !== socket.id)
    })

    // user on painting
    socket.on("paint", imgUrl => {          
        img = imgUrl         
        io.to(roomId).except(socket.id).emit("on-paint", img), 500
    })

    socket.on("mousemove", (res) => {        
        // io.to(roomId).except(socket.id).emit("on-mousemove", {name:res.name, x:res.x, y:res.y})
        // io.to(roomId).emit("on-mousemove", {name:res.name, x:res.x, y:res.y})
    })
})

io.listen(port)