/* ===== shared: taskbar clock (used by every page) ===== */

function tickClock() {
  const d = new Date(); let h = d.getHours(); const m = d.getMinutes().toString().padStart(2,'0');
  const ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
  document.getElementById('clock').textContent = `${h}:${m} ${ampm}`;
}
tickClock(); setInterval(tickClock, 15000);



/* ===== third_space.html ===== */
/* ---------------- GHOST FRAGMENTS ---------------- */
const ghostTexts = [
  "under construction", "sign my guestbook", "you are visitor #",
  "best viewed at 800x600", "webring: next site »", "this page last updated 1999",
  "🖼 image not found", "hit counter loading...", "netscape recommended",
  "click here to enter", "add me to your links page"
];
const desktop = document.getElementById('desktop');
for (let i = 0; i < 10; i++) {
  const g = document.createElement('div');
  g.className = 'ghost';
  g.textContent = ghostTexts[Math.floor(Math.random() * ghostTexts.length)];
  g.style.top = Math.random() * 85 + '%';
  g.style.left = Math.random() * 80 + '%';
  g.style.animationDelay = (Math.random() * 9) + 's';
  desktop.appendChild(g);
}

/* ---------------- DESKTOP ICONS ---------------- */
const icons = [
  { id: 'win-home', glyph: '🏠', label: 'welcome.htm', top: 24, left: 20 },
  { id: 'win-data', glyph: '🗃', label: 'the data room', top: 130, left: 20 },
  { id: 'win-mail', glyph: '✉', label: 'correspondence', top: 236, left: 20 },
  { id: 'win-gallery', glyph: '🖌', label: 'signed-work', top: 342, left: 20 },
];
icons.forEach(ic => {
  const div = document.createElement('div');
  div.className = 'icon';
  div.style.top = ic.top + 'px';
  div.style.left = ic.left + 'px';
  div.innerHTML = `<div class="glyph">${ic.glyph}</div><div class="label">${ic.label}</div>`;
  div.onclick = () => openWindow(ic.id);
  desktop.appendChild(div);
});

/* ---------------- WINDOW MANAGEMENT ---------------- */
let zTop = 10;
const windowTitles = {
  'win-home': 'welcome.htm',
  'win-data': 'the data room',
  'win-mail': 'correspondence',
  'win-gallery': 'signed-work',
  'win-about': 'about.htm'
};
const openTabsEl = document.getElementById('openTabs');

function refreshTabs() {
  openTabsEl.innerHTML = '';
  document.querySelectorAll('.window.open').forEach(w => {
    const tab = document.createElement('div');
    tab.className = 'tab' + (w.style.zIndex == zTop ? ' focused' : '');
    tab.textContent = windowTitles[w.id] || w.id;
    tab.onclick = () => { w.style.display = 'flex'; focusWindow(w.id); };
    openTabsEl.appendChild(tab);
  });
}

function openWindow(id) {
  const w = document.getElementById(id);
  w.classList.add('open');
  w.style.display = 'flex';
  focusWindow(id);
  refreshTabs();
}
function closeWindow(id) {
  const w = document.getElementById(id);
  w.classList.remove('open');
  w.style.display = 'none';
  refreshTabs();
}
function minimizeWindow(id) {
  document.getElementById(id).style.display = 'none';
  refreshTabs();
}
function focusWindow(id) {
  zTop += 1;
  document.getElementById(id).style.zIndex = zTop;
  refreshTabs();
}

/* dragging via pointer events */
let dragState = null;
function startDrag(e, id) {
  const w = document.getElementById(id);
  focusWindow(id);
  const rect = w.getBoundingClientRect();
  dragState = { id, offX: e.clientX - rect.left, offY: e.clientY - rect.top };
  e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId);
  window.addEventListener('pointermove', onDrag);
  window.addEventListener('pointerup', endDrag);
}
function onDrag(e) {
  if (!dragState) return;
  const w = document.getElementById(dragState.id);
  let left = e.clientX - dragState.offX;
  let top = e.clientY - dragState.offY;
  top = Math.max(0, Math.min(top, window.innerHeight - 40));
  left = Math.max(-100, Math.min(left, window.innerWidth - 60));
  w.style.left = left + 'px';
  w.style.top = top + 'px';
}
function endDrag() {
  dragState = null;
  window.removeEventListener('pointermove', onDrag);
  window.removeEventListener('pointerup', endDrag);
}

/* ---------------- START MENU ---------------- */
function toggleStart(force) {
  const m = document.getElementById('startMenu');
  const btn = document.getElementById('menubtn');
  const willOpen = force !== undefined ? force : !m.classList.contains('open');
  m.classList.toggle('open', willOpen);
  btn.classList.toggle('active', willOpen);
}
document.addEventListener('click', (e) => {
  const m = document.getElementById('startMenu');
  if (!m.contains(e.target) && e.target.id !== 'menubtn') {
    m.classList.remove('open');
    document.getElementById('menubtn').classList.remove('active');
  }
});

/* ---------------- CLOCK ---------------- */

/* ---------------- DATA ROOM ---------------- */
const myGrid = document.getElementById('myGrid');
const myLevels = new Array(28).fill(0);
for (let i = 0; i < 28; i++) {
  const cell = document.createElement('div');
  cell.className = 'datacell';
  cell.onclick = () => {
    myLevels[i] = (myLevels[i] + 1) % 5;
    cell.className = 'datacell' + (myLevels[i] ? ' lvl' + myLevels[i] : '');
  };
  myGrid.appendChild(cell);
}
let dataMailed = false;
function mailData() {
  if (dataMailed) return;
  const colored = myLevels.filter(l => l > 0).length;
  if (colored === 0) {
    document.getElementById('dataStatus').textContent = 'color in at least one square first.';
    return;
  }
  dataMailed = true;
  document.getElementById('mailDataBtn').disabled = true;
  document.getElementById('dataStatus').textContent = 'sent. unlocking...';
  document.getElementById('lockedMsg').style.display = 'none';
  const reveal = document.getElementById('partnerReveal');
  const pg = document.getElementById('partnerGrid');
  pg.innerHTML = '';
  for (let i = 0; i < 28; i++) {
    const lvl = Math.floor(Math.random() * 5);
    const cell = document.createElement('div');
    cell.className = 'datacell' + (lvl ? ' lvl' + lvl : '');
    pg.appendChild(cell);
  }
  reveal.style.display = 'block';
}

/* ---------------- CORRESPONDENCE ROOM ---------------- */
const voices = [
  "still writing?",
  "you can slow down. no one's waiting on a timer but you.",
  "once this goes, it's gone. that's the whole point.",
  "there's no read receipt coming, either way.",
  "say the true thing, not the fast thing."
];
let mailUnlockTimer = null;
function onMailInput() {
  const text = document.getElementById('mailText').value;
  const btn = document.getElementById('sendBtn');
  const voiceEl = document.getElementById('mailVoice');
  const timerEl = document.getElementById('mailTimer');
  clearTimeout(mailUnlockTimer);
  btn.disabled = true;

  if (text.trim().length === 0) {
    voiceEl.textContent = '';
    timerEl.textContent = '';
    return;
  }
  voiceEl.textContent = voices[Math.floor(Math.random() * voices.length)];
  const waitMs = Math.min(1000 + text.length * 60, 8000);
  let remaining = Math.ceil(waitMs / 1000);
  timerEl.textContent = `still forming... ${remaining}s`;
  const iv = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(iv);
      timerEl.textContent = 'ready when you are.';
      btn.disabled = false;
    } else {
      timerEl.textContent = `still forming... ${remaining}s`;
    }
  }, 1000);
}
function sendMail() {
  const textEl = document.getElementById('mailText');
  const text = textEl.value.trim();
  if (!text) return;
  const list = document.getElementById('sentList');
  const div = document.createElement('div');
  div.className = 'sentmsg';
  div.innerHTML = `<div>${text.replace(/</g,'&lt;')}</div>
    <div class="meta">sent · unread status unknown · cannot be edited</div>`;
  list.prepend(div);
  textEl.value = '';
  document.getElementById('sendBtn').disabled = true;
  document.getElementById('mailVoice').textContent = 'it\'s on its way now.';
  document.getElementById('mailTimer').textContent = '';
}

/* ---------------- SIGNED-WORK ROOM ---------------- */
let draftCount = 0;
let firstDraftTime = null;
function saveDraft() {
  const text = document.getElementById('workText').value;
  if (!text.trim()) return;
  if (!firstDraftTime) firstDraftTime = new Date();
  draftCount += 1;
  const log = document.getElementById('draftLog');
  const entry = document.createElement('div');
  const t = new Date();
  entry.textContent = `draft ${draftCount} · ${t.toLocaleTimeString()} · ${text.length} characters`;
  log.appendChild(entry);
}
function signWork() {
  const text = document.getElementById('workText').value;
  if (!text.trim()) {
    alert('write something first.');
    return;
  }
  const minutes = firstDraftTime ? Math.max(1, Math.round((new Date() - firstDraftTime) / 60000)) : 1;
  const container = document.getElementById('finalPiece');
  container.innerHTML = `
    <div class="final-piece">
      <div>${text.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
      <div class="signature">
        hand-signed · ${draftCount || 1} draft${draftCount === 1 ? '' : 's'} over ~${minutes} minute${minutes===1?'':'s'} of visible work
      </div>
      <div class="not-for-sale">not for sale — provenance only</div>
    </div>`;
}


/* ===== personal_web.html ===== */
const available = [
  { id:'title', label:'page title', kind:'input', placeholder:'name this place' },
  { id:'listening', label:'currently listening to', kind:'input', placeholder:'a song, an album, silence' },
  { id:'thinking', label:'currently thinking about', kind:'textarea', placeholder:'whatever is on your mind' },
  { id:'freewrite', label:'a free-write', kind:'textarea', placeholder:'no prompt. just write.' },
  { id:'links', label:'links you like', kind:'textarea', placeholder:'one per line' },
  { id:'now', label:'what "now" looks like', kind:'input', placeholder:'a mood, a weather, a status' },
  { id:'guestbook', label:'a note to whoever visits', kind:'textarea', placeholder:'say something to a stranger' }
];
let blocks = {};
const addRow = document.getElementById('addRow');
available.forEach(b => {
  const btn = document.createElement('button');
  btn.className = 'addbtn';
  btn.textContent = '+ ' + b.label;
  btn.onclick = () => addBlock(b.id);
  btn.id = 'add-' + b.id;
  addRow.appendChild(btn);
});

function addBlock(id) {
  if (blocks[id] !== undefined) return;
  blocks[id] = '';
  document.getElementById('add-' + id).style.display = 'none';
  renderBuild();
}
function removeBlock(id) {
  delete blocks[id];
  document.getElementById('add-' + id).style.display = 'inline-block';
  renderBuild();
}
function updateBlock(id, val) { blocks[id] = val; renderFindings(); }

function renderBuild() {
  const c = document.getElementById('blocksContainer');
  c.innerHTML = '';
  Object.keys(blocks).forEach(id => {
    const meta = available.find(a => a.id === id);
    const div = document.createElement('div');
    div.className = 'block';
    const field = meta.kind === 'textarea'
      ? `<textarea class="field" rows="3" placeholder="${meta.placeholder}" oninput="updateBlock('${id}', this.value)">${blocks[id]}</textarea>`
      : `<input class="field" placeholder="${meta.placeholder}" value="${blocks[id]}" oninput="updateBlock('${id}', this.value)">`;
    div.innerHTML = `<div class="blocklabel">${meta.label}</div>${field}<button class="remove" onclick="removeBlock('${id}')">remove</button>`;
    c.appendChild(div);
  });
  renderFindings();
}

function renderFindings() {
  const used = Object.keys(blocks).filter(k => blocks[k] && blocks[k].trim());
  const el = document.getElementById('findings');
  if (used.length === 0) { el.textContent = ''; return; }
  el.textContent = `you filled in ${used.length} of ${available.length} possible blocks. is that authorship, or just enough effort for it to feel like yours? worth asking yourself honestly.`;
}

function setTab(which) {
  document.getElementById('tabBuild').classList.toggle('active', which==='build');
  document.getElementById('tabPreview').classList.toggle('active', which==='preview');
  document.getElementById('buildView').style.display = which==='build' ? 'block':'none';
  document.getElementById('previewView').style.display = which==='preview' ? 'block':'none';
  if (which === 'preview') renderPreview();
}

function renderPreview() {
  const used = Object.keys(blocks).filter(k => blocks[k] && blocks[k].trim());
  const el = document.getElementById('previewBody');
  if (used.length === 0) { el.innerHTML = '<em>nothing here yet.</em>'; return; }
  el.innerHTML = used.map(id => {
    const meta = available.find(a => a.id === id);
    const val = blocks[id].replace(/</g,'&lt;').replace(/\n/g,'<br>');
    if (id === 'title') return `<h2 style="font-family:Georgia,serif;">${val}</h2>`;
    return `<p><b>${meta.label}:</b><br>${val}</p>`;
  }).join('');
}


/* ===== unoptimized.html ===== */
let mode = 'optimized';
let startTime = null;
let clicks = 0;
const log = [];

const optimizedItems = [
  { title: 'The Lighthouse at the End of the Road', match:true },
  { title: 'Ten Tips for Faster Mornings', match:false },
  { title: 'A History of Bicycle Bells', match:false },
];

function setMode(m) {
  mode = m;
  document.getElementById('btnOpt').classList.toggle('active', m==='optimized');
  document.getElementById('btnUnopt').classList.toggle('active', m==='unoptimized');
  document.getElementById('optimizedView').style.display = m==='optimized' ? 'block':'none';
  document.getElementById('unoptimizedView').style.display = m==='unoptimized' ? 'block':'none';
  document.getElementById('resultBox').classList.remove('show');
  document.getElementById('reflectBox').style.display = 'none';
  clicks = 0;
  startTime = Date.now();
  if (m === 'optimized') renderOptimized(optimizedItems);
  else renderMaze();
}

function renderOptimized(items) {
  const el = document.getElementById('optList');
  el.innerHTML = items.map(i =>
    `<div class="item" onclick="found(${i.match})">${i.title}</div>`
  ).join('');
}
function filterOptimized() {
  const q = document.getElementById('searchBox').value.toLowerCase();
  const filtered = optimizedItems.filter(i => i.title.toLowerCase().includes(q));
  renderOptimized(q ? filtered : optimizedItems);
}

let mazeStage = 0;
const mazeStages = [
  [ {label:'archive', dead:false}, {label:'notes', dead:true}, {label:'misc.', dead:true} ],
  [ {label:'older things', dead:false}, {label:'unsorted', dead:true} ],
  [ {label:'???', dead:false}, {label:'go back', dead:true} ],
];
function renderMaze() {
  mazeStage = 0;
  document.getElementById('loadingMsg').style.display = 'none';
  drawMazeStage();
}
function drawMazeStage() {
  const el = document.getElementById('mazeGrid');
  const stage = mazeStages[mazeStage];
  if (!stage) { found(true); return; }
  el.innerHTML = stage.map((d,i) =>
    `<div class="door" onclick="mazeClick(${i})">${d.label}</div>`
  ).join('');
}
function mazeClick(i) {
  clicks += 1;
  const stage = mazeStages[mazeStage];
  const door = stage[i];
  const loading = document.getElementById('loadingMsg');
  loading.style.display = 'block';
  setTimeout(() => {
    loading.style.display = 'none';
    if (door.dead) { return; }
    mazeStage += 1;
    drawMazeStage();
  }, 700 + Math.random()*600);
}

function found(match) {
  clicks += 1;
  const elapsed = ((Date.now() - startTime)/1000).toFixed(1);
  const box = document.getElementById('resultBox');
  if (match) {
    box.innerHTML = `<b>found it.</b><br>"The Lighthouse at the End of the Road" — a short story about a keeper who stayed after the light was automated.`;
  } else {
    box.innerHTML = `<b>not quite.</b> that wasn't the lighthouse story. try again.`;
  }
  box.classList.add('show');
  if (match) {
    log.push({ mode, clicks, seconds: elapsed });
    document.getElementById('statsBox').innerHTML =
      `this attempt (${mode}): ${clicks} clicks, ${elapsed}s.` +
      (log.length > 1 ? `<br>compare: ` + log.map(l => `${l.mode}: ${l.clicks} clicks / ${l.seconds}s`).join(' · ') : '');
    document.getElementById('reflectBox').style.display = 'block';
  }
}

function logReflection() {
  const val = document.getElementById('engageVal').textContent;
  const el = document.getElementById('reflectLog');
  el.innerHTML += `<div>${mode}: rated ${val}/5 for engagement</div>`;
}

setMode('optimized');


/* ===== human_search_engine.html ===== */
const people = [
  { name:'Mina', tags:['old websites','net art','web 1.0','geocities'], about:'makes weird personal websites, has opinions about webrings.' },
  { name:'Jon', tags:['old websites','archives','collecting','net art'], about:'collects net art and dead links like other people collect stamps.' },
  { name:'Priya', tags:['birds','birdwatching','nature','patience'], about:'has seen 214 species. will talk about herons unprompted.' },
  { name:'Deshawn', tags:['grief','memory','writing','loss'], about:'writes about the people he\'s lost. slow to answer, worth the wait.' },
  { name:'Aiko', tags:['cooking','fermentation','patience','family'], about:'ferments everything. learned most of it from her grandmother.' },
  { name:'Sam', tags:['javascript','code','disagreement','web development'], about:'writes clean code and disagrees with almost everyone about frameworks.' },
  { name:'Okafor', tags:['research','books','archives','citations'], about:'keeps a public bibliography. answers questions like footnotes.' },
  { name:'Mara', tags:['drawing','music','diaries','old websites'], about:'draws the same bus stop over and over. has a page, barely updates it.' },
  { name:'Theo', tags:['grief','music','memory','mixtapes'], about:'makes a mixtape every time someone he loves dies. there are twelve so far.' },
  { name:'Lucia', tags:['cooking','disagreement','family','tradition'], about:'will fight you about the correct way to make rice. she is usually right.' },
];

const canned = {
  'Mina': "sure — start with a webring. don't overthink your homepage, just make it.",
  'Jon': "the wayback machine has more than you'd think. i can send you a few starting points.",
  'Priya': "go out at dawn. bring coffee. don't expect much the first few times.",
  'Deshawn': "there's no right way to write about it. just start with one true detail.",
  'Aiko': "start with something forgiving, like sauerkraut. it's hard to mess up.",
  'Sam': "depends what you're building. what are you actually trying to make?",
  'Okafor': "i'll send my reading list. read the introductions first, always.",
  'Mara': "i don't really have advice. i just keep making the thing.",
  'Theo': "start with one song you can't listen to yet. build outward from there.",
  'Lucia': "butter, not oil. i don't care what the recipe says."
};

function search() {
  const q = document.getElementById('q').value.toLowerCase().trim();
  const results = document.getElementById('results');
  if (!q) { results.innerHTML = '<div class="empty">ask about something.</div>'; return; }

  const scored = people.map(p => {
    const score = p.tags.reduce((acc,t) => acc + (q.includes(t) || t.includes(q) ? 1 : 0), 0);
    return { p, score };
  }).filter(s => s.score > 0).sort((a,b) => b.score - a.score);

  if (scored.length === 0) {
    results.innerHTML = `<div class="empty">no one here knows about "${q}" yet. that's honest, at least — better than a page of forced results.</div>`;
    return;
  }

  results.innerHTML = scored.slice(0,4).map(s => `
    <div class="person-card">
      <div class="name">${s.p.name}</div>
      <div class="about">${s.p.about}</div>
      <div class="reason">reason: knows something about ${s.p.tags.filter(t=>q.includes(t)||t.includes(q)).join(', ')}</div>
      <button class="askbtn" onclick="ask('${s.p.name}', this)">ask ${s.p.name}</button>
      <div class="reply" id="reply-${s.p.name}">${canned[s.p.name]}</div>
    </div>
  `).join('');
}

function ask(name, btn) {
  document.getElementById('reply-' + name).classList.add('show');
  btn.disabled = true;
}


/* ===== machine_between_us.html ===== */
let aiOn = true;
const thread = document.getElementById('thread');

function setAI(on) {
  aiOn = on;
  document.getElementById('aiOn').classList.toggle('active', on);
  document.getElementById('aiOff').classList.toggle('active', !on);
}

function addBubble(who, text) {
  const b = document.createElement('div');
  b.className = 'bubble ' + who;
  b.textContent = text;
  thread.appendChild(b);
  thread.scrollTop = thread.scrollHeight;
}
function addAnnotation(text) {
  const a = document.createElement('div');
  a.className = 'annotation';
  a.textContent = text;
  thread.appendChild(a);
}

function machineEdit(text) {
  const lower = text.toLowerCase();
  if (lower.includes('no') || lower.includes("can't") || lower.includes('cant') || lower.includes('busy')) {
    return {
      revised: text.replace(/no\b/i, 'not right now, but').trim() + (text.endsWith('.') ? '' : '.'),
      why: 'softened this because it predicted the other person might read a flat "no" as rejection.'
    };
  }
  if (text.length > 0 && text === text.toUpperCase() && text.length > 4) {
    return {
      revised: text.charAt(0) + text.slice(1).toLowerCase(),
      why: 'lowered the intensity — it predicted this might read as anger, intended or not.'
    };
  }
  if (lower.includes('fine')) {
    return {
      revised: text.replace(/fine/i, "okay, actually kind of frustrated"),
      why: 'flagged "fine" as likely insincere and offered a more direct alternative.'
    };
  }
  return null;
}

let pendingText = null;
function trySend() {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if (!text) return;

  if (aiOn) {
    const edit = machineEdit(text);
    if (edit) {
      pendingText = { original: text, revised: edit.revised };
      document.getElementById('origText').textContent = text;
      document.getElementById('revText').textContent = edit.revised;
      document.getElementById('whyText').textContent = 'AI changed this because it ' + edit.why;
      document.getElementById('intercept').classList.add('show');
      input.value = '';
      return;
    }
  }
  sendFinal(text);
  input.value = '';
}
function acceptEdit() {
  sendFinal(pendingText.revised, true);
  document.getElementById('intercept').classList.remove('show');
}
function rejectEdit() {
  sendFinal(pendingText.original, false);
  document.getElementById('intercept').classList.remove('show');
}
function sendFinal(text, wasEdited) {
  addBubble('me', text);
  if (wasEdited === true) addAnnotation('(sent the machine\'s version)');
  if (wasEdited === false) addAnnotation('(you overrode the machine)');
  setTimeout(() => replyFrom(text), 500 + Math.random()*500);
}
function replyFrom(lastText) {
  const replies = [
    "okay, that makes sense.",
    "oh — I wasn't expecting that, but thank you for saying it plainly.",
    "got it. appreciate you telling me directly.",
    "hm, can we talk about this more?"
  ];
  addBubble('them', replies[Math.floor(Math.random()*replies.length)]);
}

addBubble('them', "hey, are we still on for saturday?");


/* ===== social_data.html ===== */
const events = [];
const colors = { shared:'#000080', disagreed:'#a0522d', introduced:'#2f5b3e', returned:'#6b2fa0' };
const centerA = { x: 100, y: 150 };
const centerB = { x: 300, y: 150 };

function logEvent(kind) {
  events.push(kind);
  render();
}

function render() {
  const svg = document.getElementById('svgStage');
  svg.innerHTML = '';
  svg.innerHTML += nodeCircle(centerA.x, centerA.y, 18, '#000080', 'A');
  svg.innerHTML += nodeCircle(centerB.x, centerB.y, 18, '#000080', 'B');

  events.forEach((kind, i) => {
    const t = (i+1) / (events.length+1);
    const jitterY = 55 * Math.sin(i * 1.7);
    const x = centerA.x + (centerB.x - centerA.x) * t;
    const y = 150 + jitterY;
    svg.innerHTML += `<line x1="${centerA.x}" y1="${centerA.y}" x2="${x}" y2="${y}" stroke="${colors[kind]}" stroke-width="1.5" opacity="0.5"/>`;
    svg.innerHTML += `<line x1="${centerB.x}" y1="${centerB.y}" x2="${x}" y2="${y}" stroke="${colors[kind]}" stroke-width="1.5" opacity="0.5"/>`;
    svg.innerHTML += `<circle cx="${x}" cy="${y}" r="6" fill="${colors[kind]}"><title>${kind}</title></circle>`;
  });

  document.getElementById('summaryLine').textContent = buildSummary();
  renderNumbers();
}

function nodeCircle(x,y,r,fill,label) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/><text x="${x}" y="${y+5}" text-anchor="middle" fill="#fff" font-family="Georgia" font-size="14">${label}</text>`;
}

function buildSummary() {
  if (events.length === 0) return 'nothing has happened between you yet.';
  const counts = {};
  events.forEach(e => counts[e] = (counts[e]||0) + 1);
  const parts = [];
  if (counts.shared) parts.push(`${counts.shared} thing${counts.shared>1?'s':''} shared`);
  if (counts.disagreed) parts.push(`${counts.disagreed} disagreement${counts.disagreed>1?'s':''}`);
  if (counts.introduced) parts.push(`${counts.introduced} new thing${counts.introduced>1?'s':''} introduced`);
  if (counts.returned) parts.push(`${counts.returned} old topic${counts.returned>1?'s':''} returned to`);
  return `between A and B: ` + parts.join(', ') + ' — a shape, not a score.';
}

function toggleNumbers() {
  document.getElementById('numbersBox').classList.toggle('show');
}
function renderNumbers() {
  const counts = { shared:0, disagreed:0, introduced:0, returned:0 };
  events.forEach(e => counts[e]++);
  document.getElementById('numbersBox').innerHTML =
    `shared: ${counts.shared} · disagreed: ${counts.disagreed} · introduced: ${counts.introduced} · returned: ${counts.returned}
     <br><span style="font-size:11px; color:#666;">notice how much flatter this feels than the shape above, for the exact same events.</span>`;
}

render();