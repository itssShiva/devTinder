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
      origin: ["http://localhost:5173"], // add your frontend domains
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ New socket connection:", socket.id);

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined room: " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, newMessage }) => {
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(`${firstName} sent: ${newMessage}`);

        try {
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          const messageObj = {
            senderId: userId,
            newMessage,
          };

          chat.messages.push(messageObj);
          await chat.save();

          // 🔹 emit to frontend with senderId
          io.to(roomId).emit("messageReceived", {
            senderId: userId,
            firstName,
            lastName,
            newMessage,
          });
        } catch (err) {
          console.log("Socket sendMessage error:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("⚡ Socket disconnected:", socket.id);
    });
  });
};

module.exports = { socketInstance };
