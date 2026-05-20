import React, { useState, useRef } from "react";
import useStore from "../store";

const commonStyles = {
  clear: "both",
  float: "left",
  padding: "8px 16px",
  borderRadius: "8px",
  color: "#fff",
  maxWidth: "400px",
  textAlign: "left",
  marginBottom: "16px",
  marginTop: "8px",
};

const botStyles = {
  ...commonStyles,
  background: "#2196f3",
};
const userStyles = {
  ...commonStyles,
  background: "#009688",
  float: "right",
};

const ChatComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const messages = useStore((state) => state.messages);
  const addMessage = useStore((state) => state.addMessage);
  const updateLastMessage = useStore((state) => state.updateLastMessage);
  // ↑建议你在 store 里加这个方法

  const eventSourceRef = useRef<EventSource | null>(null);

  function handleUserInput(input: string) {
    // 1. 先写入 user 消息
    addMessage(input, "user");

    // 2. 先创建一个 bot 占位消息（关键）
    addMessage("", "Bot");

    // 3. 关闭旧连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // 4. SSE 连接（注意：GET + query 参数）
    // const es = new EventSource(`http://localhost:3001/api/messages/stream`);
    const es = new EventSource(
      `http://localhost:3001/api/messages/stream?text=${encodeURIComponent(input)}`,
    );

    eventSourceRef.current = es;

    let fullText = "";

    es.onmessage = (event) => {
      if (event.data === "[DONE]") {
        es.close();
        return;
      }

      try {
        const data = JSON.parse(event.data);

        // 假设后端返回：{ delta: "xxx" }
        const chunk = data.delta ?? "";

        fullText += chunk;
        console.log("-----data", fullText);

        // 更新最后一条 Bot 消息
        updateLastMessage(fullText);
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    es.onerror = (err) => {
      console.error("SSE error:", err);
      es.close();
    };
  }

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    handleUserInput(inputValue);
    setInputValue("");
  };

  return (
    <div>
      <div
        style={{
          height: "calc(100vh - 70px)",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={
              message.sender === "user"
                ? {
                    ...userStyles,
                    background: undefined,
                    color: "#000",
                  }
                : { ...botStyles, background: undefined, color: "#000" }
            }
          >
            <div style={message.sender === "user" ? { float: "right" } : {}}>
              {message.sender === "user" ? "You" : "Bot"}
            </div>
            <div style={message.sender === "user" ? userStyles : botStyles}>
              {message.text}
            </div>
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
          style={{ flex: 1, marginRight: "5px", border: "2px solid #009688" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              e.preventDefault(); // 防止表单提交刷新
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
