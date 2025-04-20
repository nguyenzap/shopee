// script.js

// 1) Clock
function updateTime() {
  document.getElementById("datetime").innerText = new Date().toLocaleString();
}
updateTime();
setInterval(updateTime, 1000);

// 2) Send & receive via n8n webhook (All Incoming Items)
async function sendChat() {
  const inputEl = document.getElementById("chat-input");
  const output  = document.getElementById("chat-output");
  const text    = inputEl.value.trim();
  inputEl.value = "";
  if (!text) return;

  // render user message
  const userMsg = document.createElement("div");
  userMsg.className = "message user-message";
  userMsg.innerText = text;
  output.appendChild(userMsg);

  try {
    // POST user text as plain text
    const resp = await fetch(
      "https://nguyenzap.app.n8n.cloud/webhook-test/3c610538-a318-4b0a-bcd4-f12e17dc4b48",
      {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: text
      }
    );

    // parse full JSON array of incoming items
    const data = await resp.json();

    // render raw JSON response
    const botMsg = document.createElement("div");
    botMsg.className = "message sof-message";
    // show nicely formatted JSON
    const pre = document.createElement("pre");
    pre.style.whiteSpace = "pre-wrap";
    pre.style.wordBreak  = "break-word";
    pre.innerText = JSON.stringify(data, null, 2);
    botMsg.appendChild(pre);
    output.appendChild(botMsg);

  } catch (err) {
    console.error(err);
    const errMsg = document.createElement("div");
    errMsg.className = "message sof-message";
    errMsg.innerText = "Đã có lỗi, vui lòng thử lại.";
    output.appendChild(errMsg);
  }

  // scroll & refocus
  output.scrollTop = output.scrollHeight;
  inputEl.focus();
}

// 3) Send on Enter
document.getElementById("chat-input")
  .addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChat();
    }
  });

// 4) Zoom handlers
function zoomImage(src) {
  document.getElementById("zoomed-img").src = src;
  document.getElementById("zoom-overlay").style.display = "flex";
}
function hideZoom() {
  document.getElementById("zoom-overlay").style.display = "none";
}

// 5) Drag & drop window
const chatbotBox    = document.getElementById("chatbot-box");
const chatbotHeader = document.getElementById("chatbot-header");
let isDragging = false, offsetX = 0, offsetY = 0;

chatbotHeader.addEventListener("mousedown", e => {
  isDragging = true;
  offsetX    = e.clientX - chatbotBox.offsetLeft;
  offsetY    = e.clientY - chatbotBox.offsetTop;
  chatbotHeader.style.cursor = "grabbing";
});
document.addEventListener("mouseup", () => {
  isDragging = false;
  chatbotHeader.style.cursor = "grab";
});
document.addEventListener("mousemove", e => {
  if (isDragging) {
    chatbotBox.style.left = `${e.clientX - offsetX}px`;
    chatbotBox.style.top  = `${e.clientY - offsetY}px`;
  }
});

// 6) Minimize / Restore
function minimizeChat() {
  chatbotBox.style.display = "none";
  document.getElementById("chatbot-circle").style.display = "flex";
}
function restoreChat() {
  chatbotBox.style.display = "flex";
  document.getElementById("chatbot-circle").style.display = "none";
}
