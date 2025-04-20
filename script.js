// script.js

// 1) Update the clock every second
function updateTime() {
  document.getElementById("datetime").innerText = new Date().toLocaleString();
}
updateTime();
setInterval(updateTime, 1000);

// 2) Send the user’s message to your n8n webhook and handle JSON response
async function sendChat() {
  const inputEl = document.getElementById("chat-input");
  const output  = document.getElementById("chat-output");
  const text    = inputEl.value.trim();
  inputEl.value = "";
  if (!text) return;

  // 2a) Render the user’s message
  const userMsg = document.createElement("div");
  userMsg.className = "message user-message";
  userMsg.innerText = text;
  output.appendChild(userMsg);

  try {
    // 2b) POST the plain text to n8n
    const resp = await fetch(
      "https://nguyenzap.app.n8n.cloud/webhook-test/3c610538-a318-4b0a-bcd4-f12e17dc4b48",
      {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: text
      }
    );

    // 2c) Parse the JSON reply
    const data = await resp.json();

    // 2d) Extract your agent’s text. Adjust these lines to match your n8n field name.
    let answer = "";
    if (Array.isArray(data)) {
      // if "All Incoming Items" → array of items
      answer = data[0]?.json?.reply || "";
    } else if (data.json && data.json.reply) {
      // if "First Incoming Item"
      answer = data.json.reply;
    } else if (data.reply) {
      // if you custom‑return { reply: "..." }
      answer = data.reply;
    } else {
      // fallback: stringify whole JSON
      answer = JSON.stringify(data, null, 2);
    }

    // 2e) Render the agent’s response
    const botMsg = document.createElement("div");
    botMsg.className = "message sof-message";
    // If you want to support **bold**, you can do a quick replace here:
    botMsg.innerHTML = answer.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    output.appendChild(botMsg);

  } catch (err) {
    console.error(err);
    const errMsg = document.createElement("div");
    errMsg.className = "message sof-message";
    errMsg.innerText = "Đã có lỗi, vui lòng thử lại.";
    output.appendChild(errMsg);
  }

  // 2f) Scroll to bottom and refocus input
  output.scrollTop = output.scrollHeight;
  inputEl.focus();
}

// 3) Send on Enter key
document
  .getElementById("chat-input")
  .addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChat();
    }
  });

// 4) Image zoom handlers
function zoomImage(src) {
  document.getElementById("zoomed-img").src = src;
  document.getElementById("zoom-overlay").style.display = "flex";
}
function hideZoom() {
  document.getElementById("zoom-overlay").style.display = "none";
}

// 5) Drag & drop chatbot window
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

// 6) Minimize & restore
function minimizeChat() {
  chatbotBox.style.display = "none";
  document.getElementById("chatbot-circle").style.display = "flex";
}
function restoreChat() {
  chatbotBox.style.display = "flex";
  document.getElementById("chatbot-circle").style.display = "none";
}
