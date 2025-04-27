import io from "socket.io-client";
const CON_PORT = "http://localhost:8080/";
const socket = io(CON_PORT);

export default socket;
