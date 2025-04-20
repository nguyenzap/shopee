// TODO: replace with your real n8n webhook URL
const N8N_WEBHOOK_URL = 'https://nguyenzap.app.n8n.cloud/webhook/ec52427b-8233-425e-ab5a-def5a852ea13';

// TODO: replace with your Teenshop public API base
const API_BASE_URL = 'https://teenshop.vn';

const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const loadProductsBtn = document.getElementById('load-products');
const productList = document.getElementById('product-list');

chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  appendMessage(text, 'user');
  messageInput.value = '';
  try {
    const resp = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await resp.json();
    appendMessage(data.reply || 'No response', 'bot');
  } catch (err) {
    appendMessage('Error contacting agent', 'bot');
    console.error(err);
  }
});

loadProductsBtn.addEventListener('click', async () => {
  productList.innerHTML = '<li>Loading…</li>';
  try {
    const resp = await fetch(`${API_BASE_URL}/api/products`);
    const products = await resp.json();
    productList.innerHTML = '';
    products.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.name} — ${p.sale_price || p.price}₫`;
      productList.appendChild(li);
    });
  } catch (err) {
    productList.innerHTML = '<li>Error loading products</li>';
    console.error(err);
  }
});

/**
 * Append a chat message to the chat box.
 * @param {string} text 
 * @param {'user'|'bot'} sender 
 */
function appendMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `chat-message ${sender}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
