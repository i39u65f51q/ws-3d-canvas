import { Server } from "socket.io";
import { createServer } from "http";
import { AI } from "./ai";

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
const aiImgs:string[] =["https://oaidalleapiprodscus.blob.core.windows.net/private/org-vYEu9p3AXsoCsmJGUPUdRt9C/user-mEzB1oTbQbOOrqQooMtzLUFu/img-n0SpM15qnEdthdbMrL8zap9O.png?st=2024-11-21T19%3A30%3A48Z&se=2024-11-21T21%3A30%3A48Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-11-21T19%3A05%3A55Z&ske=2024-11-22T19%3A05%3A55Z&sks=b&skv=2024-08-04&sig=x/3%2BzgPR1uuKeGEn%2BUjUHf0wUb/NWH8PbqPl6ltDzO0%3D"];
console.log('Launch Socket Server on ' + port)
const roomId = "painting-room"
io.on("connect", (socket) => {
    const ai = new AI();
    // console.log("connection", socket);
    socket.join(roomId)
    console.log("new Socket connected:", socket.id)

    // user into room
    socket.on("join", name  => {                  
        // io.to(roomId).except(socket.id).emit("on-join", res );
        members.push({name:name, socketId:socket.id});
        io.to(roomId).emit("on-join", {name:name, members:members.map((member) => member.name), img:img, aiImgs:aiImgs});        
    })
    
    socket.on("disconnect", () => {
        console.log('disconnected:', socket.id)
        members= members.filter((member) => member.socketId !== socket.id)
    })

    // user on painting
    socket.on("paint", imgUrl => {          
        img = imgUrl                    
        if(imgUrl === "" ||  imgUrl) io.to(roomId).emit("on-paint", imgUrl)            
        else io.to(roomId).except(socket.id).emit("on-paint", img)
    })

    socket.on("g-img-img", async(imgUrl:string) => {
        const res:{created:number, data:{url:string}[]} = await ai.generateByImg(imgUrl);
        console.log("g-img", res);
        aiImgs.push(res.data[0].url);
        io.to(roomId).emit("on-g-img-img", aiImgs);          
    })
    socket.on('g-img-prompt', async(prompt:string) => {
        const res = await ai.generateByPrompt(prompt);
        if(res[0].url )aiImgs.push(res[0].url )        
            console.log(res[0].url )
        io.to(roomId).emit("on-g-img-prompt", aiImgs);                  
    })

})

io.listen(port)