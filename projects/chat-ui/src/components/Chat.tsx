import React, { useState } from "react";
import useStore from "../store";

const ChatComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const messages = useStore((state) => state.messages);
  const addMessage = useStore((state) => state.addMessage);

  async function handleUserInput(input: string) {
    try {
      const result = await fetch("http://localhost:3001/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });
      const json = await result.json();

      //   const response = await fetch("http://localhost:3001/api/messages");
      //   const messages = await response.json();
      console.log(json);
      addMessage(json.message[json.message.length - 1].kwargs.content, "Bot");
      // 处理 messages 并执行其他操作
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  const sendMessage = () => {
    if (inputValue.trim()) {
      addMessage(inputValue, "user");
      handleUserInput(inputValue);
      setInputValue("");
    }
  };

  return (
    <div>
      <div
        style={{
          height: "calc(100vh - 60px)",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: "5px" }}>
            <strong>{message.sender === "user" ? "You:" : "Bot:"}</strong>{" "}
            {message.text}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderTop: "1px solid #ccc",
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, marginRight: "5px" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
