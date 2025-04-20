// update the clock
function updateTime() {
  document.getElementById("datetime").innerText = new Date().toLocaleString();
}
updateTime();
setInterval(updateTime, 1000);

// send chat message
async function sendChat() {
  const inputEl = document.getElementById("chat-input");
  const output = document.getElementById("chat-output");
  const input = inputEl.value.trim();
  inputEl.value = "";
  if (!input) return;

  // user message
  const userMsg = document.createElement("div");
  userMsg.className = "message user-message";
  userMsg.innerText = input;
  output.appendChild(userMsg);

  // fetch bot reply
  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });
    const data = await response.json();
    const sofMsg = document.createElement("div");
    sofMsg.className = "message sof-message";
    sofMsg.innerText = data.reply;
    output.appendChild(sofMsg);
  } catch (err) {
    console.error(err);
  }

  inputEl.focus();
  output.scrollTop = output.scrollHeight;
}

// submit on Enter
document.getElementById("chat-input").addEventListener("keypress", function(e) {
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
  document.getElementById("zoomed-img").src = "";
}

// drag & drop chat window
const chatbotBox = document.getElementById("chatbot-box");
const chatbotHeader = document.getElementById("chatbot-header");
let isDragging = false, offsetX = 0, offsetY = 0;

chatbotHeader.addEventListener("mousedown", function(e) {
  isDragging = true;
  offsetX = e.clientX - chatbotBox.offsetLeft;
  offsetY = e.clientY - chatbotBox.offsetTop;
  chatbotHeader.style.cursor = "grabbing";
});
document.addEventListener("mouseup", function() {
  isDragging = false;
  chatbotHeader.style.cursor = "grab";
});
document.addEventListener("mousemove", function(e) {
  if (isDragging) {
    chatbotBox.style.left = `${e.clientX - offsetX}px`;
    chatbotBox.style.top = `${e.clientY - offsetY}px`;
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
