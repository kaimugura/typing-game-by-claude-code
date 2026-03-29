const texts = {
  easy: [
    "いぬが にわで あそんでいます",
    "あおい そらに しろい くもが うかんでいます",
    "きょうは いい てんきです",
    "おかあさんが ごはんを つくっています",
    "こどもたちが こうえんで あそんでいます",
    "ねこが まどべで ひなたぼっこを しています",
    "はるに なると さくらが さきます",
    "まいにち うんどうを するのは たいせつです",
  ],
  normal: [
    "プログラミングは現代社会において重要なスキルです",
    "日本語のタイピングは練習すればするほど上達します",
    "インターネットの普及により情報へのアクセスが容易になりました",
    "健康的な生活を送るためには適度な運動と栄養バランスが大切です",
    "読書は知識を広げ想像力を豊かにする素晴らしい習慣です",
    "テクノロジーの進化は私たちの生活を大きく変えてきました",
    "チームワークは目標を達成するうえで欠かせない要素です",
    "継続的な学習こそが成長の鍵となります",
  ],
  hard: [
    "人工知能の発展により産業構造が根本的に変革されつつあり、新たな職業形態が生まれています",
    "持続可能な社会を実現するためには再生可能エネルギーへの転換と消費行動の見直しが急務です",
    "グローバル化が進む現代において異文化理解と多様性の尊重はますます重要になっています",
    "量子コンピュータの実用化は暗号技術や創薬分野に革命的な変化をもたらすと期待されています",
    "デジタルトランスフォーメーションを推進するには技術導入だけでなく組織文化の変革も不可欠です",
    "気候変動への対応は一国だけでは解決できない複雑な国際協調を必要とする問題です",
    "メタバースとリアル空間の融合によって人々のコミュニケーションや経済活動の形が変わりつつあります",
    "バイオテクノロジーの進歩により遺伝子編集技術が医療現場での応用段階に近づいています",
  ],
};

let currentLevel = 'easy';
let currentText = '';
let startTime = null;
let timerInterval = null;
let totalTyped = 0;
let correctTyped = 0;
let isRunning = false;
let isComposing = false;

const textDisplay = document.getElementById('text-display');
const inputBox = document.getElementById('input-box');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const timerEl = document.getElementById('timer');
const resultEl = document.getElementById('result');

document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (isRunning) return;
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLevel = btn.dataset.level;
    resetGame();
  });
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

inputBox.addEventListener('compositionstart', () => { isComposing = true; });
inputBox.addEventListener('compositionend', () => {
  isComposing = false;
  handleInput();
});
inputBox.addEventListener('input', () => {
  if (!isComposing) handleInput();
});

function getRandomText(level) {
  const arr = texts[level];
  return arr[Math.floor(Math.random() * arr.length)];
}

function renderText(typed) {
  const chars = currentText.split('');
  textDisplay.innerHTML = chars.map((char, i) => {
    let cls = 'char';
    if (i < typed.length) {
      cls += typed[i] === char ? ' correct' : ' incorrect';
    } else if (i === typed.length) {
      cls += ' current';
    }
    return `<span class="${cls}">${char}</span>`;
  }).join('');
}

function startGame() {
  if (isRunning) return;
  isRunning = true;
  currentText = getRandomText(currentLevel);
  totalTyped = 0;
  correctTyped = 0;
  inputBox.value = '';
  inputBox.disabled = false;
  inputBox.focus();
  resultEl.classList.add('hidden');
  renderText('');
  startTime = Date.now();

  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = elapsed;
    updateWPM(elapsed);
  }, 500);
}

function resetGame() {
  isRunning = false;
  clearInterval(timerInterval);
  inputBox.disabled = true;
  inputBox.value = '';
  textDisplay.innerHTML = '';
  wpmEl.textContent = '0';
  accuracyEl.textContent = '100';
  timerEl.textContent = '0';
  resultEl.classList.add('hidden');
  startTime = null;
}

function handleInput() {
  if (!isRunning) return;
  const typed = inputBox.value;
  totalTyped++;

  const last = typed[typed.length - 1];
  const expected = currentText[typed.length - 1];
  if (last === expected) correctTyped++;

  renderText(typed);

  const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;
  accuracyEl.textContent = accuracy;

  if (typed === currentText) {
    finishGame();
  }
}

function updateWPM(elapsed) {
  if (elapsed === 0) return;
  // 日本語は1文字=1単語として計算（文字数/分）
  const correctChars = inputBox.value.split('').filter((c, i) => c === currentText[i]).length;
  const minutes = elapsed / 60;
  const wpm = Math.round(correctChars / minutes);
  wpmEl.textContent = wpm;
}

function finishGame() {
  isRunning = false;
  clearInterval(timerInterval);
  inputBox.disabled = true;

  const elapsed = (Date.now() - startTime) / 1000;
  const minutes = elapsed / 60;
  const correctChars = inputBox.value.split('').filter((c, i) => c === currentText[i]).length;
  const finalWPM = Math.round(correctChars / minutes);
  const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;

  timerEl.textContent = Math.round(elapsed);
  wpmEl.textContent = finalWPM;
  accuracyEl.textContent = accuracy;

  resultEl.innerHTML = `
    <p>完了！</p>
    <p>WPM: <strong>${finalWPM}</strong> &nbsp; 正確率: <strong>${accuracy}%</strong> &nbsp; タイム: <strong>${Math.round(elapsed)}秒</strong></p>
    <p style="margin-top:12px; color:#aaa; font-size:0.95rem;">リセットして再挑戦しよう！</p>
  `;
  resultEl.classList.remove('hidden');
}
