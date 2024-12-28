// depreciate

// // socketHandler.js
// export default function handleSocketEvents(socket, io) {
//     console.log(`Socket connected: ${socket.id}`);
  
//     // Handle incoming messages
//     socket.on("message", (data) => {
//       console.log("Received message:", data);
  
//       // Echo back the message to all connected clients
//       io.emit("message", data);
//     });
  
//     // Handle disconnection
//     socket.on("disconnect", () => {
//       console.log(`Socket disconnected: ${socket.id}`);
//     });
//   }
  