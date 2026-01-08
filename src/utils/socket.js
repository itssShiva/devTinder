const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("***$$"))
    .digest("hex");
};

const socketInstance = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " has joined room with room id: " + roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId,lastName, targetUserId, newMessage }) => {
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(firstName + " " + newMessage);

        //Agar chat pehle ho chuki hai
        try {
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          //pehla message bheja hai
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            newMessage,
          });
          await chat.save();
        } catch (error) {
          console.log(error);
        }
       
       
        io.to(roomId).emit("messageReceived", {
          firstName,
          lastName,
          newMessage,
        });
      }
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = { socketInstance };