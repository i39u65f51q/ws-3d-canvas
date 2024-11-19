"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var http_1 = require("http");
var port = 3200;
var server = (0, http_1.createServer)();
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
var members = [];
var img = "";
console.log('Launch Socket Server on ' + port);
var roomId = "painting-room";
io.on("connect", function (socket) {
    // console.log("connection", socket);
    socket.join(roomId);
    console.log("new Socket connected:", socket.id);
    // user into room
    socket.on("join", function (name) {
        // io.to(roomId).except(socket.id).emit("on-join", res );
        members.push({ name: name, socketId: socket.id });
        io.to(roomId).emit("on-join", { name: name, members: members.map(function (member) { return member.name; }), img: img });
    });
    socket.on("disconnect", function () {
        console.log('disconnected:', socket.id);
        members = members.filter(function (member) { return member.socketId !== socket.id; });
    });
    // user on painting
    socket.on("paint", function (imgUrl) {
        img = imgUrl;
        io.to(roomId).except(socket.id).emit("on-paint", img), 500;
    });
    socket.on("mousemove", function (res) {
        // io.to(roomId).except(socket.id).emit("on-mousemove", {name:res.name, x:res.x, y:res.y})
        // io.to(roomId).emit("on-mousemove", {name:res.name, x:res.x, y:res.y})
    });
});
io.listen(port);
