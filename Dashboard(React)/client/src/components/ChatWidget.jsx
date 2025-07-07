 import React from "react";

export default function ChatWidget() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "300px",
        height: "400px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        background: "#fff",
        zIndex: 9999,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        overflow: "hidden"
      }}
    >
      <iframe
  title="Chatbot"
  src="about:blank"
  style={{ width: "100%", height: "100%", border: "none" }}
/>

    </div>
  );
} 