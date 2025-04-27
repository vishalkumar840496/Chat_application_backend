import React, { useEffect, useState } from "react";
import socket from "./ioserver";
export const Home = () => {
  const [fullname, setFullName] = useState("");
  const [roomid, setRoomid] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const [newUser, setNewUser] = useState([]);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  });
  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (fullname !== "" && roomid !== "") {
      setIsChatting(true);
      socket.emit("join_room", roomid);
      socket.emit("send_message", {
        name: fullname,
        room: roomid,
        message: message,
        newUser: true,
      });
      setMessageList([
        ...messageList,
        { name: fullname, room: roomid, message: message, newUser: true },
      ]);
    }
  };

  const sendMessage = async () => {
    await socket.emit("send_message", {
      name: fullname,
      room: roomid,
      message: message,
    });
    setMessageList([
      ...messageList,
      { name: fullname, room: roomid, message: message },
    ]);
    setMessage("");
  };
  return (
    <>
      <div className="App">
        <header className="App-header">
          <div className="card-container">
            <div className="container">
              <h2 className="title">Mini Messenger</h2>
              {isChatting ? (
                <div className="chat-container">
                  <div className="roomid-text">Room Id - {roomid}</div>
                  <div>
                    <div className="message-box">
                      {messageList.map((data) => {
                        if (data.newUser) {
                          return (
                            <>
                              <div className="new-user-text">
                                <label>{data.name} joined in room</label>
                              </div>
                            </>
                          );
                        }
                        return (
                          <>
                            <div className="message-text">
                              <label className="sender-name">{data.name}</label>
                              <label className="sender-message">
                                {data.message}
                              </label>
                            </div>
                          </>
                        );
                      })}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Enter message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <label>
                        <button onClick={sendMessage}>send</button>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmitHandler}>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      value={fullname}
                      onChange={(e) => {
                        setFullName(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Create or enter room id"
                      value={roomid}
                      onChange={(e) => {
                        setRoomid(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <button>Join</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
};
