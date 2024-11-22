"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var http_1 = require("http");
var ai_1 = require("./ai");
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
var aiImgs = ["https://oaidalleapiprodscus.blob.core.windows.net/private/org-vYEu9p3AXsoCsmJGUPUdRt9C/user-mEzB1oTbQbOOrqQooMtzLUFu/img-n0SpM15qnEdthdbMrL8zap9O.png?st=2024-11-21T19%3A30%3A48Z&se=2024-11-21T21%3A30%3A48Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-11-21T19%3A05%3A55Z&ske=2024-11-22T19%3A05%3A55Z&sks=b&skv=2024-08-04&sig=x/3%2BzgPR1uuKeGEn%2BUjUHf0wUb/NWH8PbqPl6ltDzO0%3D"];
console.log('Launch Socket Server on ' + port);
var roomId = "painting-room";
io.on("connect", function (socket) {
    var ai = new ai_1.AI();
    // console.log("connection", socket);
    socket.join(roomId);
    console.log("new Socket connected:", socket.id);
    // user into room
    socket.on("join", function (name) {
        // io.to(roomId).except(socket.id).emit("on-join", res );
        members.push({ name: name, socketId: socket.id });
        io.to(roomId).emit("on-join", { name: name, members: members.map(function (member) { return member.name; }), img: img, aiImgs: aiImgs });
    });
    socket.on("disconnect", function () {
        console.log('disconnected:', socket.id);
        members = members.filter(function (member) { return member.socketId !== socket.id; });
    });
    // user on painting
    socket.on("paint", function (imgUrl) {
        img = imgUrl;
        if (imgUrl === "" || imgUrl)
            io.to(roomId).emit("on-paint", imgUrl);
        else
            io.to(roomId).except(socket.id).emit("on-paint", img);
    });
    socket.on("g-img-img", function (imgUrl) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ai.generateByImg(imgUrl)];
                case 1:
                    res = _a.sent();
                    console.log("g-img", res);
                    aiImgs.push(res.data[0].url);
                    io.to(roomId).emit("on-g-img-img", aiImgs);
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on('g-img-prompt', function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ai.generateByPrompt(prompt)];
                case 1:
                    res = _a.sent();
                    if (res[0].url)
                        aiImgs.push(res[0].url);
                    console.log(res[0].url);
                    io.to(roomId).emit("on-g-img-prompt", aiImgs);
                    return [2 /*return*/];
            }
        });
    }); });
});
io.listen(port);
