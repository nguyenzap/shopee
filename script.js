// update the clock
function updateTime() {
  document.getElementById("datetime").innerText = new Date().toLocaleString();
}
updateTime();
setInterval(updateTime, 1000);

// send chat message
async function sendChat() {
  const inputEl = document.getElementById("chat-input");
  const output   = document.getElementById("chat-output");
  const text     = inputEl.value.trim();
  inputEl.value  = "";
  if (!text) return;

  // show user's message
  const userMsg = document.createElement("div");
  userMsg.className = "message user-message";
  userMsg.innerText = text;
  output.appendChild(userMsg);

  try {
    // post plain‑text to your n8n webhook
    const resp = await fetch(
      "https://nguyenzap.app.n8n.cloud/webhook/3c610538-a318-4b0a-bcd4-f12e17dc4b48",
      {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: text
      }
    );

    // read back the agent's reply as plain text
    const replyText = await resp.text();

    const botMsg = document.createElement("div");
    botMsg.className = "message sof-message";
    botMsg.innerText = replyText;
    output.appendChild(botMsg);

  } catch (err) {
    console.error(err);
    const errMsg = document.createElement("div");
    errMsg.className = "message sof-message";
    errMsg.innerText = "Đã có lỗi, vui lòng thử lại.";
    output.appendChild(errMsg);
  }

  // scroll to bottom
  output.scrollTop = output.scrollHeight;
  inputEl.focus();
}

// support Enter key
document
  .getElementById("chat-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChat();
    }
  });

// image zoom
function zoomImage(src) {
  document.getElementById("zoomed-img").src = src;
  document.getElementById("zoom-overlay").style.display = "flex";
}
function hideZoom() {
  document.getElementById("zoom-overlay").style.display = "none";
}

// drag & drop chat window
const chatbotBox    = document.getElementById("chatbot-box");
const chatbotHeader = document.getElementById("chatbot-header");
let isDragging = false, offsetX = 0, offsetY = 0;

chatbotHeader.addEventListener("mousedown", function (e) {
  isDragging = true;
  offsetX    = e.clientX - chatbotBox.offsetLeft;
  offsetY    = e.clientY - chatbotBox.offsetTop;
  chatbotHeader.style.cursor = "grabbing";
});
document.addEventListener("mouseup", function () {
  isDragging = false;
  chatbotHeader.style.cursor = "grab";
});
document.addEventListener("mousemove", function (e) {
  if (isDragging) {
    chatbotBox.style.left = `${e.clientX - offsetX}px`;
    chatbotBox.style.top  = `${e.clientY - offsetY}px`;
  }
});

// minimize / restore
function minimizeChat() {
  chatbotBox.style.display = "none";
  document.getElementById("chatbot-circle").style.display = "flex";
}
function restoreChat() {
  chatbotBox.style.display = "flex";
  document.getElementById("chatbot-circle").style.display = "none";
}
