const express = require("express");
const messagesRouter = require("./messages/messagesRouter.js");

const server = express();
server.use(express.json());

server.use("/api/posts", messagesRouter);

server.listen(3000, () => {
     console.log("It\'s Working!")
});
