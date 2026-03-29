const texts = {
  easy: [
    { display: "いぬが にわで あそんでいます", romaji: "inuga niwade asondeimasu" },
    { display: "あおい そらに しろい くもが うかんでいます", romaji: "aoi sorani shiroi kumoga ukandeimasu" },
    { display: "きょうは いい てんきです", romaji: "kyouha ii tenkidesu" },
    { display: "おかあさんが ごはんを つくっています", romaji: "okaasanga gohanwo tsukutteimasu" },
    { display: "こどもたちが こうえんで あそんでいます", romaji: "kodomotachiga kouende asondeimasu" },
    { display: "ねこが まどべで ひなたぼっこを しています", romaji: "nekoga madobede hinatabokkowo shiteimasu" },
    { display: "はるに なると さくらが さきます", romaji: "haruni naruto sakuraga sakimasu" },
    { display: "まいにち うんどうを するのは たいせつです", romaji: "mainichi undouwo surunoha taisetsudesu" },
  ],
  normal: [
    { display: "プログラミングは現代社会において重要なスキルです", romaji: "puroguraminguha gendaishakai nioite juuyouna sukirudesu" },
    { display: "日本語のタイピングは練習すればするほど上達します", romaji: "nihongono taipinguha renshuusureba suruhodo joutatsushimasu" },
    { display: "インターネットの普及により情報へのアクセスが容易になりました", romaji: "intaanettono fukyuuniyori jouhouheno akusesuga youininarimashita" },
    { display: "健康的な生活を送るためには適度な運動と栄養バランスが大切です", romaji: "kenkoutekina seikatsuwo okuru tameniha tekidona undouto eiyoubaransuga taisetsudesu" },
    { display: "読書は知識を広げ想像力を豊かにする素晴らしい習慣です", romaji: "dokushoha chishikiwo hiroge souzouryokuwo yutakanisuru subarashii shuukandesu" },
    { display: "テクノロジーの進化は私たちの生活を大きく変えてきました", romaji: "tekunorojiino shinkaha watashitachino seikatsuwo ookiku kaetekimashita" },
    { display: "チームワークは目標を達成するうえで欠かせない要素です", romaji: "chiimuwaakuha mokuhyouwo tasseisuru uede kakasenai yousodesu" },
    { display: "継続的な学習こそが成長の鍵となります", romaji: "keizokutekina gakushuukosoga seichouno kagito narimasu" },
  ],
  hard: [
    { display: "人工知能の発展により産業構造が根本的に変革されつつあり、新たな職業形態が生まれています", romaji: "jinkouchinouno hattenniyori sangyoukouzouga konpontekini henkakusaretsutsuari aratana shokugyoukeitaiga umareteimasu" },
    { display: "持続可能な社会を実現するためには再生可能エネルギーへの転換と消費行動の見直しが急務です", romaji: "jizokukanouna shakaiwo jitsugensurutameniha saiseikanouenerugiiheno tenkanto shouhikoudouno minaoshiga kyuumudesu" },
    { display: "グローバル化が進む現代において異文化理解と多様性の尊重はますます重要になっています", romaji: "guroobarukaga susumu gendai nioite ibunkarikai to tayouseino sonchou ha masumasu juuyou ninarutteimasu" },
    { display: "量子コンピュータの実用化は暗号技術や創薬分野に革命的な変化をもたらすと期待されています", romaji: "ryoushi konpyuutano jitsuyouka wa angou gijutsu ya souyaku bunya ni kakumeiteki na henka wo motarasu to kitai sareteimasu" },
    { display: "デジタルトランスフォーメーションを推進するには技術導入だけでなく組織文化の変革も不可欠です", romaji: "dejitaru toransufoomeeshon wo suishin suru ni ha gijutsu dounyuu dake denaku soshiki bunka no henkaku mo fukaketsudesu" },
    { display: "気候変動への対応は一国だけでは解決できない複雑な国際協調を必要とする問題です", romaji: "kikouhedono no taiou wa ikkoku dake de ha kaiketsudekina i fukuzatsuna kokusai kyouchou wo hitsuyou to suru mondaidesu" },
    { display: "メタバースとリアル空間の融合によって人々のコミュニケーションや経済活動の形が変わりつつあります", romaji: "metabaasuto riairu kuukan no yuugou niyotte hitobito no komyunikeeshon ya keizai katsudou no katachi ga kawari tsutsu arimasu" },
    { display: "バイオテクノロジーの進歩により遺伝子編集技術が医療現場での応用段階に近づいています", romaji: "baio tekunorojii no shinpo niyori idenshi henshuu gijutsu ga iryou genba de no ouyou dankai ni chikazuiteimasu" },
  ],
};

let currentLevel = 'easy';
let currentText = '';
let currentRomaji = '';
let startTime = null;
let timerInterval = null;
let totalTyped = 0;
let correctTyped = 0;
let isRunning = false;

const textDisplay = document.getElementById('text-display');
const romajiDisplay = document.getElementById('romaji-display');
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
inputBox.addEventListener('input', handleInput);

function getRandomText(level) {
  const arr = texts[level];
  return arr[Math.floor(Math.random() * arr.length)];
}

function renderText() {
  textDisplay.textContent = currentText;
}

function renderRomaji(typed) {
  const chars = currentRomaji.split('');
  romajiDisplay.innerHTML = chars.map((char, i) => {
    let cls = 'romaji-char';
    if (i < typed.length) {
      cls += typed[i] === char ? ' correct' : ' incorrect';
    } else if (i === typed.length) {
      cls += ' current';
    }
    return `<span class="${cls}">${char === ' ' ? '&nbsp;' : char}</span>`;
  }).join('');
}

function startGame() {
  if (isRunning) return;
  isRunning = true;
  const textObj = getRandomText(currentLevel);
  currentText = textObj.display;
  currentRomaji = textObj.romaji;
  totalTyped = 0;
  correctTyped = 0;
  inputBox.value = '';
  inputBox.disabled = false;
  inputBox.focus();
  resultEl.classList.add('hidden');
  renderText();
  renderRomaji('');
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
  textDisplay.textContent = '';
  romajiDisplay.innerHTML = '';
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
  const expected = currentRomaji[typed.length - 1];
  if (last === expected) correctTyped++;

  renderRomaji(typed);

  const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;
  accuracyEl.textContent = accuracy;

  if (typed === currentRomaji) {
    finishGame();
  }
}

function updateWPM(elapsed) {
  if (elapsed === 0) return;
  const correctChars = inputBox.value.split('').filter((c, i) => c === currentRomaji[i]).length;
  const minutes = elapsed / 60;
  wpmEl.textContent = Math.round(correctChars / minutes);
}

function finishGame() {
  isRunning = false;
  clearInterval(timerInterval);
  inputBox.disabled = true;

  const elapsed = (Date.now() - startTime) / 1000;
  const minutes = elapsed / 60;
  const correctChars = inputBox.value.split('').filter((c, i) => c === currentRomaji[i]).length;
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
