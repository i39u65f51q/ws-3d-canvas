import { io } from "socket.io-client";

const socket = io("http://localhost:3200")

// user's socket
socket.on("connect", () => {
    console.log("client", socket.id);
    socket.emit("paint", {x:1, y:1, color: "#ddd"})

    socket.on("on-paint", res => {
        console.log('on-paint', res);
    })
})


console.log("run client")