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

/* ---------------- YOUR TRACE (cross-room synthesis) ---------------- */
let lettersSentCount = 0;
let worksSignedCount = 0;
function updateTrace() {
  const el = document.getElementById('traceBox');
  if (!el) return;
  const parts = [];
  parts.push(dataMailed ? 'you traded a week of data in the data room.' : 'you haven\'t traded anything in the data room yet.');
  parts.push(lettersSentCount > 0 ? `you've sent ${lettersSentCount} letter${lettersSentCount===1?'':'s'} that took real time to write.` : 'you haven\'t written a letter yet.');
  parts.push(worksSignedCount > 0 ? `you've signed ${worksSignedCount} piece${worksSignedCount===1?'':'s'} of visible work.` : 'you haven\'t signed anything in the gallery yet.');
  const doneCount = [dataMailed, lettersSentCount > 0, worksSignedCount > 0].filter(Boolean).length;
  let closing = '';
  if (doneCount === 3) closing = 'you\'ve given something in every room. does it feel like one place, or three separate favors?';
  else if (doneCount === 0) closing = 'nothing yet — every room here asks for something before it gives something back.';
  el.innerHTML = parts.map(p => `<div class="trace-line">${p}</div>`).join('') + `<div style="margin-top:6px; font-style:italic; font-size:11px;">${closing}</div>`;
}

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
  updateTrace();
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
  lettersSentCount += 1;
  updateTrace();
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
  worksSignedCount += 1;
  updateTrace();
}
updateTrace();


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
  syncCompare();
}

/* ---- mode switching: your place / standardized profile / compare ---- */
const pageLoadTime = Date.now();
function setMode(m) {
  document.getElementById('tabPlace').classList.toggle('active', m==='place');
  document.getElementById('tabStandard').classList.toggle('active', m==='standard');
  document.getElementById('tabCompare').classList.toggle('active', m==='compare');
  document.getElementById('placeView').style.display = m==='place' ? 'block':'none';
  document.getElementById('standardView').style.display = m==='standard' ? 'block':'none';
  document.getElementById('compareView').style.display = m==='compare' ? 'block':'none';
  if (m === 'compare') syncCompare();
}

function renderStandardCard() {
  const name = document.getElementById('stdName').value || 'unnamed';
  const age = document.getElementById('stdAge').value;
  const cat = document.getElementById('stdCategory').value;
  const bio = document.getElementById('stdBio').value;
  document.getElementById('bioCount').textContent = bio.length + '/80';
  document.getElementById('standardCard').innerHTML = `
    <div class="gname">${name.replace(/</g,'&lt;')}</div>
    <div class="gmeta">${age || 'age range not set'} · ${cat || 'category not set'}</div>
    <div class="gbio">${bio ? bio.replace(/</g,'&lt;') : 'no bio provided'}</div>
  `;
  syncCompare();
}

function computeMachineProfile() {
  const used = Object.keys(blocks).filter(k => blocks[k] && blocks[k].trim());
  const totalChars = used.reduce((sum,k) => sum + blocks[k].length, 0);
  const minutes = Math.max(1, Math.round((Date.now() - pageLoadTime) / 60000));
  const traits = [];
  traits.push(totalChars > 150 ? 'expansive writer' : totalChars > 0 ? 'brief, economical' : 'has written nothing yet');
  traits.push(used.includes('guestbook') ? 'invites strangers in' : 'keeps visitors at a distance');
  traits.push(used.includes('freewrite') ? 'comfortable with open-ended self-description' : 'avoided open-ended self-description');
  traits.push(used.length >= 5 ? 'high engagement with the builder' : 'low engagement with the builder');
  traits.push(`spent about ${minutes} minute${minutes===1?'':'s'} on this page`);
  return traits;
}

function syncCompare() {
  const placeEl = document.getElementById('comparePlace');
  const stdEl = document.getElementById('compareStandard');
  const machineEl = document.getElementById('compareMachine');
  if (!placeEl) return;
  placeEl.innerHTML = document.getElementById('previewBody').innerHTML;
  stdEl.innerHTML = document.getElementById('standardCard').innerHTML;
  machineEl.innerHTML = computeMachineProfile().map(t => `<span class="trait">${t}</span>`).join('');
}


/* ===== unoptimized.html ===== */
let mode = 'optimized';
let startTime = null;
let clicks = 0;
const log = [];

const optimizedItems = [
  { title: 'The Lighthouse at the End of the Road', match:true, confidence: 61 },
  { title: 'Ten Tips for Faster Mornings', match:false, confidence: 24 },
  { title: 'A History of Bicycle Bells', match:false, confidence: 15 },
];

function setMode(m) {
  mode = m;
  document.getElementById('btnOpt').classList.toggle('active', m==='optimized');
  document.getElementById('btnSeamful').classList.toggle('active', m==='seamful');
  document.getElementById('btnUnopt').classList.toggle('active', m==='unoptimized');
  document.getElementById('optimizedView').style.display = m==='optimized' ? 'block':'none';
  document.getElementById('seamfulView').style.display = m==='seamful' ? 'block':'none';
  document.getElementById('unoptimizedView').style.display = m==='unoptimized' ? 'block':'none';
  document.getElementById('resultBox').classList.remove('show');
  document.getElementById('reflectBox').style.display = 'none';
  clicks = 0;
  startTime = Date.now();
  if (m === 'optimized') renderOptimized(optimizedItems);
  else if (m === 'seamful') renderSeamful();
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

function renderSeamful() {
  const q = (document.getElementById('seamfulSearchBox').value || '').toLowerCase();
  const pool = q ? optimizedItems.filter(i => i.title.toLowerCase().includes(q)) : optimizedItems;
  const el = document.getElementById('seamfulResult');
  if (pool.length === 0) { el.innerHTML = '<div class="uncertainty-box">nothing matches that. the system has no guess.</div>'; return; }
  const top = pool[0];
  const rest = pool.slice(1);
  el.innerHTML = `
    <div class="uncertainty-box">
      the system is <b>${top.confidence}% confident</b> this is what you want. it is showing you that number instead of hiding it.
    </div>
    <div class="items-optimized">
      <div class="item" onclick="found(${top.match})">${top.title} <span style="float:right; font-size:11px; color:#000080;">${top.confidence}%</span></div>
    </div>
    ${rest.length ? '<div style="font-size:11px; color:#666; margin:8px 0 4px;">other possibilities the system considered:</div>' : ''}
    <div class="items-optimized">
      ${rest.map(i => `<div class="item" onclick="found(${i.match})">${i.title} <span style="float:right; font-size:11px; color:#666;">${i.confidence}%</span></div>`).join('')}
    </div>
  `;
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

function tagFriction(tag, btn) {
  document.querySelectorAll('#frictionTags button').forEach(b => b.classList.remove('picked'));
  btn.classList.add('picked');
  const el = document.getElementById('reflectLog');
  el.innerHTML += `<div>${mode}: tagged as "${tag}"</div>`;
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
  { name:'Wren', tags:['javascript','code'], about:'shares an office with Sam. not really a coder, honestly.', weak:true },
];

const disagreePairs = [
  { a: 'Mina', b: 'Jon', topic: 'how to get into old websites' },
  { a: 'Aiko', b: 'Lucia', topic: 'how patient you need to be in the kitchen' },
];

const canned = {
  'Mina': "sure — start with a webring. don't overthink your homepage, just make it. (Jon disagrees with me on this, for what it's worth.)",
  'Jon': "honestly? I think Mina's wrong on this one — webrings are cute but they just slow you down. go straight to the wayback machine.",
  'Priya': "go out at dawn. bring coffee. don't expect much the first few times.",
  'Deshawn': "there's no right way to write about it. just start with one true detail.",
  'Aiko': "take your time — ferment it slow, taste it every day, let it tell you when it's ready. (Lucia will tell you this is overkill. it's not.)",
  'Sam': "depends what you're building. what are you actually trying to make?",
  'Okafor': "i'll send my reading list. read the introductions first, always.",
  'Mara': "i don't really have advice. i just keep making the thing.",
  'Theo': "start with one song you can't listen to yet. build outward from there.",
  'Lucia': "honestly, Aiko takes way too long with everything. taste it once, trust yourself, move on. butter, not oil, though — she's right about that part.",
  'Wren': "honestly, not really my area — ask Sam instead, they'll actually know."
};

let askedThisSearch = new Set();

function search() {
  const q = document.getElementById('q').value.toLowerCase().trim();
  const results = document.getElementById('results');
  askedThisSearch = new Set();
  if (!q) { results.innerHTML = '<div class="empty">ask about something.</div>'; return; }

  const scored = people.map(p => {
    const score = p.tags.reduce((acc,t) => acc + (q.includes(t) || t.includes(q) ? 1 : 0), 0);
    return { p, score };
  }).filter(s => s.score > 0).sort((a,b) => b.score - a.score);

  if (scored.length === 0) {
    results.innerHTML = `<div class="empty">no one here knows about "${q}" yet. that's honest, at least — better than a page of forced results.</div>`;
    return;
  }

  const intro = `<div class="uncertainty-box">I don't know for certain. here ${scored.length===1?'is one person':'are '+Math.min(scored.length,4)+' people'} who might — some of them may not agree with each other.</div>`;

  results.innerHTML = intro + scored.slice(0,4).map(s => `
    <div class="person-card">
      <div class="name">${s.p.name}${s.p.weak ? ' <span style="font-size:10px; color:#999;">(unsure this is a good match)</span>' : ''}</div>
      <div class="about">${s.p.about}</div>
      <div class="reason">reason: knows something about ${s.p.tags.filter(t=>q.includes(t)||t.includes(q)).join(', ')}</div>
      <button class="askbtn" onclick="ask('${s.p.name}', this)">ask ${s.p.name}</button>
      <div class="reply" id="reply-${s.p.name}">${canned[s.p.name]}</div>
    </div>
  `).join('') + '<div id="beliefChoiceArea"></div>';
}

function ask(name, btn) {
  document.getElementById('reply-' + name).classList.add('show');
  btn.disabled = true;
  askedThisSearch.add(name);
  checkForDisagreement();
}

function checkForDisagreement() {
  const area = document.getElementById('beliefChoiceArea');
  if (!area) return;
  for (const pair of disagreePairs) {
    if (askedThisSearch.has(pair.a) && askedThisSearch.has(pair.b) && !document.getElementById('belief-' + pair.a + '-' + pair.b)) {
      const div = document.createElement('div');
      div.className = 'disagree-box';
      div.id = 'belief-' + pair.a + '-' + pair.b;
      div.innerHTML = `
        <div style="margin-bottom:8px;">${pair.a} and ${pair.b} disagree about ${pair.topic}. there's no way to verify either from here — who do you believe?</div>
        <button class="askbtn" onclick="pickBelief('${pair.a}','${pair.b}', this)">${pair.a}</button>
        <button class="askbtn" onclick="pickBelief('${pair.b}','${pair.a}', this)">${pair.b}</button>
        <button class="askbtn" onclick="pickBelief('neither','', this)">genuinely not sure</button>
        <div class="belief-result" style="margin-top:8px; font-size:12px; font-style:italic;"></div>
      `;
      area.appendChild(div);
    }
  }
}

function pickBelief(chosen, other, btn) {
  const box = btn.closest('.disagree-box');
  box.querySelectorAll('button').forEach(b => b.disabled = true);
  const resultEl = box.querySelector('.belief-result');
  resultEl.textContent = chosen === 'neither'
    ? "you're staying uncertain. that's a legitimate place to land — not every disagreement needs resolving."
    : `you picked ${chosen}. that's not verified, just noted — worth noticing what made you trust them over ${other}.`;
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

  if (lower.includes("don't really know how to say this") || lower.includes("i guess") || lower.startsWith('um')) {
    const revised = "I want to be honest with you: I'm feeling upset and I think we should talk about it.";
    return {
      revised,
      removed: ['hesitation ("I don\'t really know how to say this")', 'the hedge "I think" softening your own feeling'],
      inferred: 'inferred you were nervous to bring this up, and that the underlying feeling was clear even if the wording wasn\'t.',
      predictedEffect: 'they will likely read this as direct and easy to respond to — clearer, but with no sign you were nervous.',
      giveUp: 'the visible hesitation itself — which may have told them something true about how hard this was to say.',
      revisedLabel: 'removed hesitation, increased confidence, clarified the emotion'
    };
  }
  if (lower.includes('no') || lower.includes("can't") || lower.includes('cant') || lower.includes('busy')) {
    return {
      revised: text.replace(/no\b/i, 'not right now, but').trim() + (text.endsWith('.') ? '' : '.'),
      removed: ['the flat "no"'],
      inferred: 'inferred a flat refusal here could be read as rejection rather than a simple scheduling conflict.',
      predictedEffect: 'they will likely feel less rejected and more like this is circumstantial, not personal.',
      giveUp: 'the directness of a plain "no" — the revised version asks a little more of them to read between the lines.',
      revisedLabel: 'softened the refusal'
    };
  }
  if (text.length > 0 && text === text.toUpperCase() && text.length > 4) {
    return {
      revised: text.charAt(0) + text.slice(1).toLowerCase(),
      removed: ['the all-caps emphasis'],
      inferred: 'inferred the capitalization would read as anger, whether or not that was intended.',
      predictedEffect: 'they will likely feel less confronted, and may not sense any urgency or intensity at all.',
      giveUp: 'whatever real intensity you meant to convey — the machine can\'t tell the difference between anger and just emphasis.',
      revisedLabel: 'lowered the intensity'
    };
  }
  if (lower.includes('fine')) {
    return {
      revised: text.replace(/fine/i, "okay, actually kind of frustrated"),
      removed: ['the word "fine" as a stand-in for an unstated feeling'],
      inferred: 'inferred "fine" was likely insincere, based on common patterns in how people use that word.',
      predictedEffect: 'they will likely take this more seriously and probably ask a follow-up question.',
      giveUp: 'the option to leave things vague — sometimes "fine" is doing real, deliberate work.',
      revisedLabel: 'named the feeling "fine" was covering for'
    };
  }
  // a genuinely low-stakes, hard-to-object-to edit — not every intervention should cost something real
  if (!/[.!?]\s*$/.test(text.trim()) && text.trim().length > 15) {
    const t = text.trim();
    const revised = t.charAt(0).toUpperCase() + t.slice(1) + (/[,]$/.test(t) ? '' : '.');
    return {
      revised,
      removed: ['a run-on, unpunctuated feel'],
      inferred: 'inferred you just typed quickly, with no particular intention behind the missing punctuation.',
      predictedEffect: 'no real difference — this is about as low-stakes as an edit gets.',
      giveUp: 'almost nothing. maybe a little of your actual, unpolished typing voice.',
      revisedLabel: 'added punctuation and capitalization',
      lowStakes: true
    };
  }
  return null;
}

let pendingText = null;
let tally = { accepted: 0, rejected: 0, modified: 0, unedited: 0 };
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
      document.getElementById('removedText').textContent = (edit.lowStakes ? '(low-stakes) ' : '') + edit.revisedLabel + ' — removed: ' + edit.removed.join('; ');
      document.getElementById('whyText').textContent = 'it ' + edit.inferred;
      document.getElementById('predictText').textContent = edit.predictedEffect;
      document.getElementById('giveupText').textContent = edit.giveUp;
      document.getElementById('editArea').value = edit.revised;
      document.getElementById('editArea').style.display = 'none';
      document.getElementById('sendEditedBtn').style.display = 'none';
      document.getElementById('editEditBtn').style.display = 'inline-block';
      document.getElementById('intercept').classList.add('show');
      input.value = '';
      return;
    }
  }
  tally.unedited += 1;
  sendFinal(text);
  input.value = '';
  renderTally();
}
function acceptEdit() {
  tally.accepted += 1;
  sendFinal(pendingText.revised, 'accepted');
  document.getElementById('intercept').classList.remove('show');
  renderTally();
}
function rejectEdit() {
  tally.rejected += 1;
  sendFinal(pendingText.original, 'rejected');
  document.getElementById('intercept').classList.remove('show');
  renderTally();
}
function startEditingEdit() {
  document.getElementById('editArea').style.display = 'block';
  document.getElementById('sendEditedBtn').style.display = 'inline-block';
  document.getElementById('editEditBtn').style.display = 'none';
}
function sendEditedVersion() {
  const text = document.getElementById('editArea').value.trim();
  if (!text) return;
  tally.modified += 1;
  sendFinal(text, 'modified');
  document.getElementById('intercept').classList.remove('show');
  renderTally();
}
function renderTally() {
  const total = tally.accepted + tally.rejected + tally.modified;
  const el = document.getElementById('tallyBox');
  if (total === 0) { el.textContent = ''; return; }
  let note = '';
  if (total >= 3) {
    const rate = tally.accepted / total;
    note = rate > 0.6 ? ' — you\'re accepting most of its edits as-is. worth asking why.'
         : tally.modified > tally.accepted && tally.modified > tally.rejected ? ' — you keep meeting it halfway rather than fully accepting or rejecting.'
         : rate < 0.3 ? ' — you\'re mostly overriding it. is it wrong, or just not you?'
         : ' — a mix of accepting, rejecting, and rewriting.';
  }
  el.textContent = `sent as machine wrote it: ${tally.accepted} · sent your own: ${tally.rejected} · sent your edit of its edit: ${tally.modified}${note}`;
}
function sendFinal(text, kind) {
  addBubble('me', text);
  if (kind === 'accepted') addAnnotation('(sent the machine\'s version, unchanged)');
  if (kind === 'rejected') addAnnotation('(you overrode the machine entirely)');
  if (kind === 'modified') addAnnotation('(you took the machine\'s suggestion and rewrote it yourself)');
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
const centerA = { x: 100, y: 130 };
const centerB = { x: 300, y: 130 };

const flavorText = {
  shared: ["you told them about your grandmother's garden.", "you shared a worry you hadn't said out loud yet.", "you told them how your day actually went, not the short version."],
  disagreed: ["you disagreed about whether the movie was any good.", "you pushed back on something they said and meant it.", "neither of you backed down, and that was okay."],
  introduced: ["you introduced them to a song you'd had on repeat.", "you showed them a place you used to go as a kid.", "you brought up something you'd never told anyone."],
  returned: ["you came back to a conversation from months ago.", "you finally answered a question they'd asked a while back.", "you remembered something they'd forgotten they said."]
};
function pickFlavor(kind) {
  const pool = flavorText[kind];
  return pool[Math.floor(Math.random() * pool.length)];
}

function logEvent(kind) {
  events.push({ kind, text: pickFlavor(kind) });
  render();
}

function render() {
  const svg = document.getElementById('svgStage');
  svg.innerHTML = '';
  svg.innerHTML += nodeCircle(centerA.x, centerA.y, 18, '#000080', 'A');
  svg.innerHTML += nodeCircle(centerB.x, centerB.y, 18, '#000080', 'B');

  events.forEach((e, i) => {
    const t = (i+1) / (events.length+1);
    const jitterY = 50 * Math.sin(i * 1.7);
    const x = centerA.x + (centerB.x - centerA.x) * t;
    const y = 130 + jitterY;
    svg.innerHTML += `<line x1="${centerA.x}" y1="${centerA.y}" x2="${x}" y2="${y}" stroke="${colors[e.kind]}" stroke-width="1.5" opacity="0.5"/>`;
    svg.innerHTML += `<line x1="${centerB.x}" y1="${centerB.y}" x2="${x}" y2="${y}" stroke="${colors[e.kind]}" stroke-width="1.5" opacity="0.5"/>`;
    svg.innerHTML += `<circle cx="${x}" cy="${y}" r="6" fill="${colors[e.kind]}"><title>${e.kind}</title></circle>`;
  });

  renderHumanLog();
  renderMetrics();
  renderReflectQuestion();
}

function nodeCircle(x,y,r,fill,label) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/><text x="${x}" y="${y+5}" text-anchor="middle" fill="#fff" font-family="Georgia" font-size="14">${label}</text>`;
}

function renderHumanLog() {
  const el = document.getElementById('humanLog');
  if (events.length === 0) { el.innerHTML = '<em>nothing yet.</em>'; return; }
  el.innerHTML = events.slice().reverse().map(e => `<div class="entry">${e.text}</div>`).join('');
}

// simple stable hash so "similarity" doesn't jump around randomly on every click
function stableHash(n) { return Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1; }

function renderMetrics() {
  const counts = { shared:0, disagreed:0, introduced:0, returned:0 };
  events.forEach(e => counts[e.kind]++);
  const total = events.length;
  const topics = Object.values(counts).filter(c => c > 0).length;
  const similarity = total === 0 ? '—' : Math.round(40 + stableHash(total) * 40) + '%';
  const engagement = Math.min(100, total * 12);

  document.getElementById('mInteractions').textContent = total;
  document.getElementById('mSimilarity').textContent = similarity;
  document.getElementById('mTopics').textContent = topics;
  document.getElementById('mDisagreements').textContent = counts.disagreed;
  document.getElementById('mEngagement').textContent = total === 0 ? '0' : engagement + '/100';
}

function renderReflectQuestion() {
  const el = document.getElementById('reflectQuestion');
  if (events.length === 0) { el.textContent = ''; return; }
  el.textContent = 'both views above describe the same events. which one would you rather have a platform show you — and which one would you rather it kept to itself?';
}

function setView(which) {
  document.getElementById('btnFelt').classList.toggle('active', which==='felt');
  document.getElementById('btnSystem').classList.toggle('active', which==='system');
  document.getElementById('feltView').style.display = which==='felt' ? 'block':'none';
  document.getElementById('systemView').style.display = which==='system' ? 'block':'none';
}

render();