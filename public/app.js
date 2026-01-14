const chat = document.getElementById('chat');
const msg = document.getElementById('msg');
const send = document.getElementById('send');
const debug = document.getElementById('debug');

const userId = 'demo-user';
const sessionId = 'demo-session';

function add(role, text) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function run() {
  const text = msg.value.trim();
  if (!text) return;
  msg.value = '';

  add('user', text);

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, sessionId, message: text }),
  });

  const data = await res.json();
  add('assistant', data.reply);

  debug.innerText = JSON.stringify(
    {
      extractedMemories: data.extractedMemories,
      memoriesUsed: data.memoriesUsed,
    },
    null,
    2
  );
}

send.onclick = run;
msg.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') run();
});
