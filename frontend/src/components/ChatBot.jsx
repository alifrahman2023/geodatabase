import React, { useState, useRef } from "react";
import "../styles/ChatBot.css"; // Ensure this path is correct

function ChatBot() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const inputRef = useRef(null);
  const Backend = import.meta.env.VITE_BACKEND;

  // Dynamically adjust the height of the textarea
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  // Handle submit: add user message and start a dummy bot response
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setAlert("");
    const userMessage = { type: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
   
    let response = "";
    const socket = new WebSocket(`${Backend}/ask`);

    socket.onopen = () => {
      socket.send(JSON.stringify({ query }));
      // Add an initial empty bot message to update later
      setMessages((prev) => [...prev, { type: "bot", text: "..."}]);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.done) {
        if (data.error) {
          setAlert(data.error);
        }
        socket.close();
      } else {
        // Append new data to the response string and update the last message
        
        response += data.response;
        setMessages((prevMessages) => {
            const messagesCopy = [...prevMessages];
            if (
            messagesCopy.length > 0 &&
            messagesCopy[messagesCopy.length - 1].type === "bot"
            ) {
            messagesCopy[messagesCopy.length - 1] = {
                type: "bot",
                text: response,
            };
            }
            return messagesCopy;
        });
      }
    };

    socket.onclose = () => {
      setLoading(false);
      setQuery("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    };

    // Clear query immediately
    setQuery("");
  };
  const renderFormattedMessage = (text) => {
    // Split text by newline characters
    const lines = text.split("\n");
    return lines.map((line, lineIndex) => {
      // Split each line on ** markers
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={lineIndex}>
          {parts.map((part, partIndex) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              // Render bold text (remove the ** markers)
              return <b key={partIndex}>{part.slice(2, -2)}</b>;
            }
            return <span key={partIndex}>{part}</span>;
          })}
        </div>
      );
    });
  };
  return (
    <div className="page-container">
      <div className="Chat">
        <div className="Chatbox">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.type === "user" ? "user-message" : "bot-message"}
            >
              {msg.text.split("\n").map((para, i) => (
                <p key={i} style={{ margin: "0 0 0.5rem 0" }}>
                  {renderFormattedMessage(para)}
                </p>
              ))}
            </div>
          ))}
          {loading && <div className="bot-message">...</div>}
          {alert && <div className="bot-message">{alert}</div>}
        </div>
        <form className="Chat__form" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="Chat__input"
            value={query}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <div className="Chat__button__submit_container">
            <button className="Chat__button__submit" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;
