import { useReducer, useEffect, useRef, useCallback, useState } from 'react';
import * as Tone from 'tone';

/* ==================== CONSTANTS ==================== */
const LINE_COLORS = {
  1: '#003DA5', 2: '#3CB44A', 3: '#EF7C1C', 4: '#00A2D1',
  5: '#996CAC', 6: '#CD7C2F', 7: '#747F00', 8: '#E6186C', 9: '#BDB092'
};

const LINES_DATA = {
  1: {
    name: '1호선', terminals: ['소요산', '인천'], isCircular: false,
    stations: [
      '소요산','동두천','보산','동두천중앙','지행','덕정','덕계','양주',
      '녹양','가능','의정부','회룡','망월사','도봉산','도봉','방학',
      '창동','녹천','월계','광운대','석계','신이문','외대앞','회기',
      '청량리','제기동','신설동','동묘앞','동대문','종로5가','종로3가',
      '종각','시청','서울역','남영','용산','노량진','대방','신길',
      '영등포','신도림','구로','구일','개봉','오류동','온수','역곡',
      '소사','부천','중동','송내','부개','부평','백운','동암',
      '간석','주안','도화','제물포','도원','동인천','인천'
    ]
  },
  2: {
    name: '2호선', terminals: ['외선순환', '내선순환'], isCircular: true,
    stations: [
      '시청','을지로입구','을지로3가','을지로4가','동대문역사문화공원',
      '신당','상왕십리','왕십리','한양대','뚝섬','성수','건대입구',
      '구의','강변','잠실나루','잠실','잠실새내','종합운동장','삼성',
      '선릉','역삼','강남','교대','서초','방배','사당','낙성대',
      '서울대입구','봉천','신림','신대방','구로디지털단지','대림',
      '신도림','문래','영등포구청','당산','합정','홍대입구','신촌',
      '이대','아현','충정로'
    ]
  },
  3: {
    name: '3호선', terminals: ['대화', '오금'], isCircular: false,
    stations: [
      '대화','주엽','정발산','마두','백석','대곡','화정','원당',
      '원흥','삼송','지축','구파발','연신내','불광','녹번','홍제',
      '무악재','독립문','경복궁','안국','종로3가','을지로3가','충무로',
      '동대입구','약수','금호','옥수','압구정','신사','잠원',
      '고속터미널','교대','남부터미널','양재','매봉','도곡','대치',
      '학여울','대청','일원','수서','가락시장','경찰병원','오금'
    ]
  },
  4: {
    name: '4호선', terminals: ['당고개', '오이도'], isCircular: false,
    stations: [
      '당고개','상계','노원','창동','쌍문','수유','미아','미아사거리',
      '길음','성신여대입구','한성대입구','혜화','동대문',
      '동대문역사문화공원','충무로','명동','회현','서울역','숙대입구',
      '삼각지','신용산','이촌','동작','총신대입구','사당','남태령',
      '선바위','경마공원','대공원','과천','정부과천청사','인덕원',
      '평촌','범계','금정','산본','수리산','대야미','반월','상록수',
      '한대앞','중앙','고잔','초지','안산','신길온천','정왕','오이도'
    ]
  },
  5: {
    name: '5호선', terminals: ['방화', '하남검단산'], isCircular: false,
    stations: [
      '방화','개화산','김포공항','송정','마곡','발산','우장산','화곡',
      '까치산','신정','목동','오목교','양평','영등포구청','영등포시장',
      '신길','여의도','여의나루','마포','공덕','애오개','충정로',
      '서대문','광화문','종로3가','을지로4가','동대문역사문화공원',
      '청구','신금호','행당','왕십리','마장','답십리','장한평',
      '군자','아차산','광나루','천호','강동','길동','굽은다리',
      '명일','고덕','상일동','강일','미사','하남풍산','하남시청',
      '하남검단산'
    ]
  },
  6: {
    name: '6호선', terminals: ['응암', '신내'], isCircular: false,
    stations: [
      '응암','역촌','불광','독바위','연신내','구산','새절','증산',
      '디지털미디어시티','월드컵경기장','마포구청','망원','합정','상수',
      '광흥창','대흥','공덕','효창공원앞','삼각지','녹사평','이태원',
      '한강진','버티고개','약수','청구','신당','동묘앞','창신',
      '보문','안암','고려대','월곡','상월곡','돌곶이','석계',
      '태릉입구','화랑대','봉화산','신내'
    ]
  },
  7: {
    name: '7호선', terminals: ['장암', '부평구청'], isCircular: false,
    stations: [
      '장암','도봉산','수락산','마들','노원','중계','하계','공릉',
      '태릉입구','먹골','중화','상봉','면목','사가정','용마산',
      '중곡','군자','어린이대공원','건대입구','뚝섬유원지','청담',
      '강남구청','학동','논현','반포','고속터미널','내방','이수',
      '남성','숭실대입구','상도','장승배기','신대방삼거리','보라매',
      '신풍','대림','남구로','가산디지털단지','철산','광명사거리',
      '천왕','온수','까치울','부천종합운동장','춘의','신중동',
      '부천시청','상동','삼산체육관','굴포천','부평구청'
    ]
  },
  8: {
    name: '8호선', terminals: ['암사', '모란'], isCircular: false,
    stations: [
      '암사','천호','강동구청','몽촌토성','잠실','석촌','송파',
      '가락시장','문정','장지','복정','산성','남한산성입구',
      '단대오거리','신흥','수진','모란'
    ]
  },
  9: {
    name: '9호선', terminals: ['개화', '중앙보훈병원'], isCircular: false,
    stations: [
      '개화','김포공항','공항시장','신방화','마곡나루','양천향교',
      '가양','증미','등촌','염창','신목동','선유도','당산',
      '국회의사당','여의도','샛강','노량진','노들','흑석','동작',
      '구반포','신반포','고속터미널','사평','신논현','언주',
      '선정릉','삼성중앙','봉은사','종합운동장','삼전','석촌고분',
      '석촌','송파나루','한성백제','올림픽공원','둔촌오륜','중앙보훈병원'
    ]
  }
};

const DIFFICULTY_LEVELS = [
  { level: 1, icon: '🐢', name: '시민',     inputTime: 18, transferBtnDur: 2.0, transferSelectTime: 16, questionCount: 5 },
  { level: 2, icon: '🚶', name: '승객',     inputTime: 15, transferBtnDur: 1.8, transferSelectTime: 13, questionCount: 7 },
  { level: 3, icon: '🏃', name: '출퇴근러', inputTime: 12, transferBtnDur: 1.5, transferSelectTime: 10, questionCount: 9 },
  { level: 4, icon: '🚄', name: '급행',     inputTime: 9,  transferBtnDur: 1.2, transferSelectTime: 7,  questionCount: 11 },
  { level: 5, icon: '⚡', name: '기관사',   inputTime: 6,  transferBtnDur: 1.0, transferSelectTime: 4,  questionCount: 13 },
];

const TRANSFERS = {
  '시청': [1,2], '동대문': [1,4], '종로3가': [1,3,5], '서울역': [1,4],
  '신도림': [1,2], '노량진': [1,9], '석계': [1,6], '도봉산': [1,7],
  '동묘앞': [1,6], '신길': [1,5], '온수': [1,7], '창동': [1,4],
  '을지로3가': [2,3], '을지로4가': [2,5], '동대문역사문화공원': [2,4,5],
  '신당': [2,6], '왕십리': [2,5], '건대입구': [2,7], '잠실': [2,8],
  '종합운동장': [2,9], '교대': [2,3], '사당': [2,4], '대림': [2,7],
  '영등포구청': [2,5], '당산': [2,9], '합정': [2,6], '충정로': [2,5],
  '충무로': [3,4], '약수': [3,6], '고속터미널': [3,7,9], '가락시장': [3,8],
  '연신내': [3,6], '불광': [3,6], '노원': [4,7], '동작': [4,9],
  '삼각지': [4,6], '총신대입구': [4,7], '이수': [4,7], '공덕': [5,6],
  '청구': [5,6], '천호': [5,8], '군자': [5,7], '김포공항': [5,9],
  '여의도': [5,9], '태릉입구': [6,7], '석촌': [8,9],
};

/* ==================== HELPERS ==================== */
function loadFromStorage(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function makeEmptyLineStats() {
  const stats = {};
  for (let i = 1; i <= 9; i++) stats[i] = { total: 0, freeCorrect: 0, mcCorrect: 0, transferAttempts: 0, transferCorrect: 0 };
  return stats;
}

function getComboMultiplier(combo) {
  if (combo >= 10) return 3.0;
  if (combo >= 5) return 2.0;
  if (combo >= 3) return 1.5;
  return 1.0;
}

function normalizeStation(name) {
  let s = name.trim();
  if (s.endsWith('역')) s = s.slice(0, -1);
  return s;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateMC(lineData, correctAnswer, currentStation) {
  const stations = lineData.stations;
  const correctIdx = stations.indexOf(correctAnswer);
  const candidates = [];
  for (let offset = -4; offset <= 4; offset++) {
    if (offset === 0) continue;
    let idx = correctIdx + offset;
    if (lineData.isCircular) {
      idx = (idx + stations.length) % stations.length;
    } else {
      if (idx < 0 || idx >= stations.length) continue;
    }
    const s = stations[idx];
    if (s !== correctAnswer && s !== currentStation && !candidates.includes(s)) {
      candidates.push(s);
    }
  }
  while (candidates.length < 3) {
    const s = stations[Math.floor(Math.random() * stations.length)];
    if (s !== correctAnswer && s !== currentStation && !candidates.includes(s)) {
      candidates.push(s);
    }
  }
  return shuffleArray([correctAnswer, ...shuffleArray(candidates).slice(0, 3)]);
}

function getTransferLines(station, currentLine) {
  const lines = TRANSFERS[station];
  if (!lines) return [];
  return lines.filter(l => l !== currentLine);
}

/* ==================== REDUCER ==================== */
const initialState = {
  phase: 'title',
  // Title
  nickname: '익명의 승객',
  startDifficulty: 1,
  // Game progress
  difficultyLevel: 1,
  questionsAnswered: 0,
  correctInSet: 0,
  totalQuestionsPlayed: 0,
  totalCorrect: 0,
  maxCombo: 0,
  transferAttempts: 0,
  transferSuccesses: 0,
  // Line roulette
  lineRouletteHL: null,
  // Current question
  selectedLine: null,
  currentStation: '',
  stationIndex: 0,
  direction: null,
  correctAnswer: '',
  // Scoring
  score: 0,
  combo: 0,
  lastPoints: 0,
  // Input
  userInput: '',
  timeLeft: 10,
  // Result
  resultType: null,
  showMC: false,
  mcOptions: [],
  mcResult: null,
  mcSelectedOption: null,
  // Visual
  rouletteHL: null,
  songBeat: -1,
  rouletteDone: false,
  levelChangeMsg: null,
  // Transfer
  transferPhase: null,
  transferLines: [],
  transferSelected: [],
  transferResult: null,
  transferBtnVisible: true,
  // Navigation
  returnTo: 'title',
  currentRecordIdx: -1,
};

function reducer(state, action) {
  switch (action.type) {
    // ===== TITLE & GAME MANAGEMENT =====
    case 'SET_NICKNAME':
      return { ...state, nickname: action.value };
    case 'SET_START_DIFFICULTY':
      return { ...state, startDifficulty: action.value };
    case 'START_GAME':
      return {
        ...initialState,
        phase: 'gameStart',
        nickname: state.nickname || '익명의 승객',
        startDifficulty: state.startDifficulty,
        difficultyLevel: state.startDifficulty,
      };
    case 'GAME_START_DONE':
      return { ...state, phase: 'lineRoulette', lineRouletteHL: null };
    case 'END_GAME':
      return { ...state, phase: 'gameComplete', currentRecordIdx: -1 };
    case 'SET_RECORD_IDX':
      return { ...state, currentRecordIdx: action.idx };
    case 'BACK_TO_TITLE':
      return { ...initialState };
    case 'SHOW_LEADERBOARD':
      return { ...state, phase: 'leaderboard', returnTo: action.from || 'title' };
    case 'SHOW_STATS':
      return { ...state, phase: 'stats', returnTo: action.from || 'title' };
    case 'GO_BACK':
      return { ...state, phase: state.returnTo, currentRecordIdx: -1 };
    case 'REPLAY':
      return {
        ...initialState,
        phase: 'gameStart',
        nickname: state.nickname || '익명의 승객',
        startDifficulty: state.startDifficulty,
        difficultyLevel: state.startDifficulty,
      };

    // ===== LINE ROULETTE =====
    case 'LINE_ROULETTE_TICK':
      return { ...state, lineRouletteHL: action.line };
    case 'LINE_ROULETTE_DONE': {
      const { lineNum } = action;
      const ld = LINES_DATA[lineNum];
      const avail = ld.isCircular
        ? ld.stations.map((_, i) => i)
        : ld.stations.map((_, i) => i).filter(i => i > 0 && i < ld.stations.length - 1);
      const idx = avail[Math.floor(Math.random() * avail.length)];
      return {
        ...state, phase: 'lineSong', selectedLine: lineNum,
        currentStation: ld.stations[idx], stationIndex: idx,
        direction: null, resultType: null, showMC: false, mcResult: null,
        mcSelectedOption: null, userInput: '', rouletteHL: null,
        songBeat: -1, rouletteDone: false,
        transferPhase: null, transferLines: [], transferSelected: [],
        transferResult: null, transferBtnVisible: true,
        lineRouletteHL: lineNum,
      };
    }

    // ===== GAMEPLAY =====
    case 'SONG_BEAT':
      return { ...state, songBeat: action.beat };
    case 'TO_SHOW_STATION':
      return { ...state, phase: 'showStation' };
    case 'TO_ROULETTE':
      return { ...state, phase: 'roulette', rouletteDone: false };
    case 'ROULETTE_TICK':
      return { ...state, rouletteHL: action.side };
    case 'ROULETTE_DONE': {
      const { finalDir } = action;
      const ld = LINES_DATA[state.selectedLine];
      const len = ld.stations.length;
      const ansIdx = ld.isCircular
        ? (finalDir === 'forward' ? (state.stationIndex + 1) % len : (state.stationIndex - 1 + len) % len)
        : (finalDir === 'forward' ? state.stationIndex + 1 : state.stationIndex - 1);
      return {
        ...state, direction: finalDir,
        correctAnswer: ld.stations[ansIdx],
        rouletteHL: finalDir === 'backward' ? 'left' : 'right',
        rouletteDone: true,
      };
    }
    case 'TO_INPUT': {
      const diff = DIFFICULTY_LEVELS[state.difficultyLevel - 1];
      return { ...state, phase: 'input', timeLeft: diff.inputTime, userInput: '' };
    }
    case 'SET_INPUT':
      return { ...state, userInput: action.value };
    case 'TIMER_TICK':
      if (state.phase !== 'input' && state.transferPhase !== 'select') return state;
      return { ...state, timeLeft: Math.max(0, +(state.timeLeft - 0.1).toFixed(1)) };

    case 'SUBMIT_ANSWER': {
      if (state.phase !== 'input') return state;
      const norm = normalizeStation(state.userInput);
      const normAns = normalizeStation(state.correctAnswer);
      if (norm === normAns) {
        const newCombo = state.combo + 1;
        const mult = getComboMultiplier(newCombo);
        const pts = Math.floor(100 * mult);
        const tLines = getTransferLines(state.correctAnswer, state.selectedLine);
        return {
          ...state, phase: 'result', resultType: 'correct',
          combo: newCombo, score: state.score + pts, lastPoints: pts, showMC: false,
          correctInSet: state.correctInSet + 1,
          totalQuestionsPlayed: state.totalQuestionsPlayed + 1,
          totalCorrect: state.totalCorrect + 1,
          maxCombo: Math.max(state.maxCombo, newCombo),
          transferPhase: tLines.length > 0 ? 'button' : null,
          transferLines: tLines,
          transferSelected: [],
          transferResult: null,
          transferBtnVisible: true,
        };
      }
      const ld = LINES_DATA[state.selectedLine];
      const opts = generateMC(ld, state.correctAnswer, state.currentStation);
      return {
        ...state, phase: 'result', resultType: 'wrong',
        combo: 0, mcOptions: opts, showMC: false,
        totalQuestionsPlayed: state.totalQuestionsPlayed + 1,
      };
    }
    case 'TIMEOUT': {
      if (state.phase !== 'input') return state;
      const ld = LINES_DATA[state.selectedLine];
      const opts = generateMC(ld, state.correctAnswer, state.currentStation);
      return {
        ...state, phase: 'result', resultType: 'timeout',
        combo: 0, mcOptions: opts, showMC: false,
        totalQuestionsPlayed: state.totalQuestionsPlayed + 1,
      };
    }
    case 'SHOW_MC':
      return { ...state, showMC: true };
    case 'MC_SELECT': {
      if (state.mcResult) return state;
      const { option } = action;
      const ok = normalizeStation(option) === normalizeStation(state.correctAnswer);
      return {
        ...state, mcResult: ok ? 'correct' : 'wrong',
        mcSelectedOption: option, score: ok ? state.score + 30 : state.score,
      };
    }

    // ===== TRANSFER =====
    case 'TRANSFER_BTN_EXPIRED':
      return { ...state, transferPhase: null, transferBtnVisible: false };
    case 'TRANSFER_BTN_CLICK': {
      const diff = DIFFICULTY_LEVELS[state.difficultyLevel - 1];
      return {
        ...state, transferPhase: 'select', transferBtnVisible: false,
        timeLeft: diff.transferSelectTime,
        transferAttempts: state.transferAttempts + 1,
      };
    }
    case 'TRANSFER_SELECT_LINE': {
      const { line } = action;
      const sel = state.transferSelected.includes(line)
        ? state.transferSelected.filter(l => l !== line)
        : [...state.transferSelected, line];
      return { ...state, transferSelected: sel };
    }
    case 'TRANSFER_SUBMIT': {
      const correct = [...state.transferLines].sort().join(',');
      const selected = [...state.transferSelected].sort().join(',');
      const isCorrect = correct === selected;
      const bonus = isCorrect ? state.lastPoints : 0;
      return {
        ...state, transferPhase: 'result',
        transferResult: isCorrect ? 'correct' : 'wrong',
        score: state.score + bonus,
        transferSuccesses: isCorrect ? state.transferSuccesses + 1 : state.transferSuccesses,
      };
    }
    case 'TRANSFER_TIMEOUT':
      return { ...state, transferPhase: 'result', transferResult: 'wrong' };

    // ===== QUESTION FLOW =====
    case 'NEXT_QUESTION': {
      const diff = DIFFICULTY_LEVELS[state.difficultyLevel - 1];
      const newAnswered = state.questionsAnswered + 1;
      if (newAnswered >= diff.questionCount) {
        const accuracy = state.correctInSet / diff.questionCount;
        if (state.difficultyLevel === 5 && accuracy >= 0.8) {
          return { ...state, phase: 'gameComplete', questionsAnswered: newAnswered };
        }
        let newLevel = state.difficultyLevel;
        let msg = 'same';
        if (accuracy >= 0.8 && state.difficultyLevel < 5) {
          newLevel = state.difficultyLevel + 1;
          msg = 'up';
        } else if (accuracy <= 0.3 && state.difficultyLevel > 1) {
          newLevel = state.difficultyLevel - 1;
          msg = 'down';
        }
        return {
          ...state, phase: 'levelTransition',
          difficultyLevel: newLevel, levelChangeMsg: msg,
          questionsAnswered: 0, correctInSet: 0,
          resultType: null, showMC: false, mcResult: null, mcOptions: [],
          mcSelectedOption: null, direction: null, rouletteHL: null,
          selectedLine: null, songBeat: -1, rouletteDone: false,
          transferPhase: null, transferLines: [], transferSelected: [],
          transferResult: null, transferBtnVisible: true,
        };
      }
      return {
        ...state, phase: 'lineRoulette',
        questionsAnswered: newAnswered,
        resultType: null, showMC: false, mcResult: null, mcOptions: [],
        mcSelectedOption: null, direction: null, rouletteHL: null,
        selectedLine: null, songBeat: -1, rouletteDone: false,
        transferPhase: null, transferLines: [], transferSelected: [],
        transferResult: null, transferBtnVisible: true, levelChangeMsg: null,
        lineRouletteHL: null,
      };
    }
    case 'LEVEL_TRANSITION_DONE':
      return { ...state, phase: 'lineRoulette', levelChangeMsg: null, lineRouletteHL: null };

    default:
      return state;
  }
}

/* ==================== COMPONENT ==================== */
export default function SubwayQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [muted, setMuted] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState(() => loadFromStorage('leaderboard', []));
  const [lineStats, setLineStats] = useState(() => loadFromStorage('lineStats', makeEmptyLineStats()));
  const mutedRef = useRef(false);
  const toneReady = useRef(false);
  const synthsRef = useRef({});
  const inputRef = useRef(null);
  const lastTickSecond = useRef(20);

  const {
    phase, selectedLine, currentStation, direction, score, combo,
    userInput, timeLeft, resultType, showMC, mcOptions, mcResult,
    correctAnswer, rouletteHL, lastPoints, mcSelectedOption,
    songBeat, rouletteDone, levelChangeMsg,
    difficultyLevel, questionsAnswered,
    nickname, startDifficulty, lineRouletteHL,
    totalQuestionsPlayed, totalCorrect, maxCombo,
    transferAttempts, transferSuccesses,
    transferPhase, transferLines, transferSelected, transferResult, transferBtnVisible,
    returnTo, currentRecordIdx,
  } = state;

  const difficulty = DIFFICULTY_LEVELS[difficultyLevel - 1];
  const lineData = selectedLine ? LINES_DATA[selectedLine] : null;
  const lineColor = selectedLine ? LINE_COLORS[selectedLine] : null;
  const showGameHUD = !['title', 'gameStart', 'gameComplete', 'leaderboard', 'stats'].includes(phase);
  const circumference = 2 * Math.PI * 48;

  // Derive timer colors
  const getTimerColor = (tl, maxT) => {
    if (tl > maxT / 2) return '#10B981';
    if (tl > 5) return '#F59E0B';
    return '#EF4444';
  };

  useEffect(() => { mutedRef.current = muted; }, [muted]);

  // Score count-up animation for results screen
  useEffect(() => {
    if (phase !== 'gameComplete') { setDisplayScore(0); return; }
    let current = 0;
    const target = score;
    if (target === 0) { setDisplayScore(0); return; }
    const step = Math.max(1, Math.ceil(target / 45));
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayScore(current);
      if (current >= target) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [phase, score]);

  /* ==================== TONE.JS SETUP ==================== */
  const initTone = useCallback(async () => {
    if (toneReady.current) return;
    try {
      await Tone.start();
      synthsRef.current.melody = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.02, decay: 0.2, sustain: 0.15, release: 0.4 },
        volume: -6,
      }).toDestination();
      synthsRef.current.membrane = new Tone.MembraneSynth({
        pitchDecay: 0.008, octaves: 6,
        envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.08 },
        volume: -12,
      }).toDestination();
      synthsRef.current.fx = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.15, sustain: 0.05, release: 0.3 },
        volume: -8,
      }).toDestination();
      synthsRef.current.tick = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
        volume: -18,
      }).toDestination();
      toneReady.current = true;
    } catch (e) {
      console.warn('Tone.js init failed:', e);
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(synthsRef.current).forEach(s => {
        try { s?.dispose(); } catch {}
      });
      synthsRef.current = {};
    };
  }, []);

  /* ==================== SOUND FUNCTIONS ==================== */
  const playLineSong = useCallback(() => {
    if (!toneReady.current || mutedRef.current) return;
    const { melody, membrane } = synthsRef.current;
    if (!melody || !membrane) return;
    try {
      const now = Tone.now();
      ['C4', 'E4', 'G4', 'C5'].forEach((note, i) => {
        melody.triggerAttackRelease(note, '8n', now + i * 0.4);
        membrane.triggerAttackRelease('C1', '16n', now + i * 0.4);
      });
    } catch {}
  }, []);

  const playRouletteTick = useCallback(() => {
    if (!toneReady.current || mutedRef.current) return;
    try { synthsRef.current.membrane?.triggerAttackRelease('G2', '32n'); } catch {}
  }, []);

  const playRouletteFinish = useCallback(() => {
    if (!toneReady.current || mutedRef.current) return;
    try {
      const now = Tone.now();
      synthsRef.current.membrane?.triggerAttackRelease('C3', '8n', now);
      synthsRef.current.fx?.triggerAttackRelease('G4', '16n', now + 0.05);
      synthsRef.current.fx?.triggerAttackRelease('C5', '8n', now + 0.15);
    } catch {}
  }, []);

  const playCorrect = useCallback(() => {
    if (!toneReady.current || mutedRef.current) return;
    try {
      const s = synthsRef.current.fx;
      const now = Tone.now();
      s?.triggerAttackRelease('C5', '16n', now);
      s?.triggerAttackRelease('E5', '16n', now + 0.1);
      s?.triggerAttackRelease('G5', '8n', now + 0.2);
    } catch {}
  }, []);

  const playWrong = useCallback(() => {
    if (!toneReady.current || mutedRef.current) return;
    try {
      const s = synthsRef.current.fx;
      const now = Tone.now();
      s?.triggerAttackRelease('E4', '16n', now);
      s?.triggerAttackRelease('Bb3', '8n', now + 0.18);
    } catch {}
  }, []);

  const playTimeout = useCallback(() => {
    if (!toneReady.current || mutedRef.current) return;
    try {
      const m = synthsRef.current.membrane;
      const s = synthsRef.current.fx;
      const now = Tone.now();
      m?.triggerAttackRelease('C2', '8n', now);
      s?.triggerAttackRelease('C4', '8n', now + 0.1);
      s?.triggerAttackRelease('G3', '4n', now + 0.25);
    } catch {}
  }, []);

  const playTimerWarn = useCallback((sec) => {
    if (!toneReady.current || mutedRef.current) return;
    try {
      const notes = { 5: 'C5', 4: 'D5', 3: 'E5', 2: 'F#5', 1: 'G#5' };
      const dur = sec <= 3 ? '16n' : '32n';
      synthsRef.current.tick?.triggerAttackRelease(notes[sec] || 'C5', dur);
    } catch {}
  }, []);

  const playLevelUp = useCallback(() => {
    if (!toneReady.current || mutedRef.current) return;
    try {
      const s = synthsRef.current.fx;
      const now = Tone.now();
      s?.triggerAttackRelease('C5', '16n', now);
      s?.triggerAttackRelease('E5', '16n', now + 0.12);
      s?.triggerAttackRelease('G5', '16n', now + 0.24);
      s?.triggerAttackRelease('C6', '8n', now + 0.36);
    } catch {}
  }, []);

  const playLevelDown = useCallback(() => {
    if (!toneReady.current || mutedRef.current) return;
    try {
      const s = synthsRef.current.fx;
      const now = Tone.now();
      s?.triggerAttackRelease('E4', '8n', now);
      s?.triggerAttackRelease('C4', '8n', now + 0.2);
    } catch {}
  }, []);

  const playTransferBonus = useCallback(() => {
    if (!toneReady.current || mutedRef.current) return;
    try {
      const s = synthsRef.current.fx;
      const m = synthsRef.current.melody;
      const now = Tone.now();
      s?.triggerAttackRelease('G5', '16n', now);
      m?.triggerAttackRelease('C6', '16n', now + 0.1);
      s?.triggerAttackRelease('E6', '8n', now + 0.2);
    } catch {}
  }, []);

  /* ==================== EFFECTS ==================== */

  // Game start → line roulette
  useEffect(() => {
    if (phase !== 'gameStart') return;
    const id = setTimeout(() => dispatch({ type: 'GAME_START_DONE' }), 1500);
    return () => clearTimeout(id);
  }, [phase]);

  // Line roulette animation
  useEffect(() => {
    if (phase !== 'lineRoulette') return;
    const finalLine = Math.floor(Math.random() * 9) + 1;
    let cancelled = false;
    let interval = 80;
    let step = 0;

    const tick = () => {
      if (cancelled) return;
      step++;
      dispatch({ type: 'LINE_ROULETTE_TICK', line: ((step - 1) % 9) + 1 });
      playRouletteTick();

      interval *= 1.2;
      if (interval > 500) {
        setTimeout(() => {
          if (cancelled) return;
          dispatch({ type: 'LINE_ROULETTE_TICK', line: finalLine });
          playRouletteFinish();
          setTimeout(() => {
            if (!cancelled) dispatch({ type: 'LINE_ROULETTE_DONE', lineNum: finalLine });
          }, 800);
        }, 250);
        return;
      }
      setTimeout(tick, interval);
    };
    setTimeout(tick, 80);
    return () => { cancelled = true; };
  }, [phase, playRouletteTick, playRouletteFinish]);

  // Line song
  useEffect(() => {
    if (phase !== 'lineSong') return;
    let cancelled = false;
    playLineSong();
    const timers = [0, 400, 800, 1200].map((delay, i) =>
      setTimeout(() => { if (!cancelled) dispatch({ type: 'SONG_BEAT', beat: i }); }, delay)
    );
    timers.push(setTimeout(() => { if (!cancelled) dispatch({ type: 'TO_SHOW_STATION' }); }, 2000));
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [phase, playLineSong]);

  // showStation → roulette
  useEffect(() => {
    if (phase !== 'showStation') return;
    const id = setTimeout(() => dispatch({ type: 'TO_ROULETTE' }), 1000);
    return () => clearTimeout(id);
  }, [phase]);

  // Direction roulette
  useEffect(() => {
    if (phase !== 'roulette') return;
    const finalDir = Math.random() < 0.5 ? 'forward' : 'backward';
    let cancelled = false;
    let interval = 100;
    let step = 0;
    const tick = () => {
      if (cancelled) return;
      step++;
      dispatch({ type: 'ROULETTE_TICK', side: step % 2 === 0 ? 'left' : 'right' });
      playRouletteTick();
      interval *= 1.18;
      if (interval > 450) {
        dispatch({ type: 'ROULETTE_DONE', finalDir });
        playRouletteFinish();
        setTimeout(() => { if (!cancelled) dispatch({ type: 'TO_INPUT' }); }, 700);
        return;
      }
      setTimeout(tick, interval);
    };
    setTimeout(tick, interval);
    return () => { cancelled = true; };
  }, [phase, playRouletteTick, playRouletteFinish]);

  // Input timer
  useEffect(() => {
    if (phase !== 'input') return;
    const id = setInterval(() => dispatch({ type: 'TIMER_TICK' }), 100);
    return () => clearInterval(id);
  }, [phase]);

  // Timeout check
  useEffect(() => {
    if (phase === 'input' && timeLeft <= 0.05) dispatch({ type: 'TIMEOUT' });
  }, [phase, timeLeft]);

  // Timer warning sounds (5s countdown)
  useEffect(() => {
    if (phase !== 'input' && transferPhase !== 'select') {
      lastTickSecond.current = 20;
      return;
    }
    const sec = Math.ceil(timeLeft);
    if (sec <= 5 && sec > 0 && sec !== lastTickSecond.current) {
      lastTickSecond.current = sec;
      playTimerWarn(sec);
    }
  }, [phase, transferPhase, timeLeft, playTimerWarn]);

  // Auto-focus input
  useEffect(() => {
    if (phase === 'input' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [phase]);

  // Result sounds
  useEffect(() => {
    if (resultType === 'correct') playCorrect();
    if (resultType === 'wrong') playWrong();
    if (resultType === 'timeout') playTimeout();
  }, [resultType, playCorrect, playWrong, playTimeout]);

  // Result → show MC / next question
  useEffect(() => {
    if (phase !== 'result') return;
    if (resultType === 'correct' && !transferPhase) {
      const id = setTimeout(() => dispatch({ type: 'NEXT_QUESTION' }), 1500);
      return () => clearTimeout(id);
    }
    if ((resultType === 'wrong' || resultType === 'timeout') && !showMC) {
      const delay = resultType === 'timeout' ? 1500 : 800;
      const id = setTimeout(() => dispatch({ type: 'SHOW_MC' }), delay);
      return () => clearTimeout(id);
    }
  }, [phase, resultType, showMC, transferPhase]);

  // MC result → next question
  useEffect(() => {
    if (!mcResult) return;
    if (mcResult === 'correct') playCorrect();
    if (mcResult === 'wrong') playWrong();
    const delay = mcResult === 'correct' ? 1500 : 2000;
    const id = setTimeout(() => dispatch({ type: 'NEXT_QUESTION' }), delay);
    return () => clearTimeout(id);
  }, [mcResult, playCorrect, playWrong]);

  // Transfer button timer
  useEffect(() => {
    if (transferPhase !== 'button') return;
    const dur = DIFFICULTY_LEVELS[difficultyLevel - 1].transferBtnDur * 1000;
    const id = setTimeout(() => dispatch({ type: 'TRANSFER_BTN_EXPIRED' }), dur);
    return () => clearTimeout(id);
  }, [transferPhase, difficultyLevel]);

  // Transfer button expired → next question
  useEffect(() => {
    if (phase === 'result' && resultType === 'correct' && transferPhase === null && !transferBtnVisible) {
      const id = setTimeout(() => dispatch({ type: 'NEXT_QUESTION' }), 500);
      return () => clearTimeout(id);
    }
  }, [phase, resultType, transferPhase, transferBtnVisible]);

  // Transfer select timer
  useEffect(() => {
    if (transferPhase !== 'select') return;
    const id = setInterval(() => dispatch({ type: 'TIMER_TICK' }), 100);
    return () => clearInterval(id);
  }, [transferPhase]);

  // Transfer select timeout
  useEffect(() => {
    if (transferPhase === 'select' && timeLeft <= 0.05) dispatch({ type: 'TRANSFER_TIMEOUT' });
  }, [transferPhase, timeLeft]);

  // Transfer result → next question
  useEffect(() => {
    if (transferPhase !== 'result') return;
    if (transferResult === 'correct') playTransferBonus();
    else playWrong();
    const id = setTimeout(() => dispatch({ type: 'NEXT_QUESTION' }), 2000);
    return () => clearTimeout(id);
  }, [transferPhase, transferResult, playTransferBonus, playWrong]);

  // Level transition
  useEffect(() => {
    if (phase !== 'levelTransition') return;
    if (levelChangeMsg === 'up') playLevelUp();
    if (levelChangeMsg === 'down') playLevelDown();
    const id = setTimeout(() => dispatch({ type: 'LEVEL_TRANSITION_DONE' }), 2500);
    return () => clearTimeout(id);
  }, [phase, levelChangeMsg, playLevelUp, playLevelDown]);

  // Save leaderboard on game complete
  useEffect(() => {
    if (phase !== 'gameComplete') return;
    const record = {
      nickname: nickname || '익명의 승객',
      score,
      accuracy: totalQuestionsPlayed ? Math.round(totalCorrect / totalQuestionsPlayed * 100) : 0,
      level: difficultyLevel,
      date: new Date().toLocaleDateString('ko-KR'),
    };
    setLeaderboard(prev => {
      const updated = [...prev, record].sort((a, b) => b.score - a.score).slice(0, 10);
      const idx = updated.findIndex(r => r === record);
      saveToStorage('leaderboard', updated);
      dispatch({ type: 'SET_RECORD_IDX', idx });
      return updated;
    });
  }, [phase]);

  // Update line stats on result
  const prevResultRef = useRef(null);
  const prevMcRef = useRef(null);
  const prevTransferRef = useRef(null);

  useEffect(() => {
    if (phase !== 'result' || !selectedLine) return;
    // Free input result
    if (resultType && resultType !== prevResultRef.current) {
      prevResultRef.current = resultType;
      setLineStats(prev => {
        const line = prev[selectedLine] || { total: 0, freeCorrect: 0, mcCorrect: 0, transferAttempts: 0, transferCorrect: 0 };
        const updated = {
          ...prev,
          [selectedLine]: {
            ...line,
            total: line.total + 1,
            freeCorrect: resultType === 'correct' ? line.freeCorrect + 1 : line.freeCorrect,
          },
        };
        saveToStorage('lineStats', updated);
        return updated;
      });
    }
  }, [phase, resultType, selectedLine]);

  useEffect(() => {
    if (!mcResult || mcResult === prevMcRef.current || !selectedLine) return;
    prevMcRef.current = mcResult;
    if (mcResult === 'correct') {
      setLineStats(prev => {
        const line = prev[selectedLine] || { total: 0, freeCorrect: 0, mcCorrect: 0, transferAttempts: 0, transferCorrect: 0 };
        const updated = { ...prev, [selectedLine]: { ...line, mcCorrect: line.mcCorrect + 1 } };
        saveToStorage('lineStats', updated);
        return updated;
      });
    }
  }, [mcResult, selectedLine]);

  useEffect(() => {
    if (transferPhase !== 'result' || transferResult === prevTransferRef.current || !selectedLine) return;
    prevTransferRef.current = transferResult;
    setLineStats(prev => {
      const line = prev[selectedLine] || { total: 0, freeCorrect: 0, mcCorrect: 0, transferAttempts: 0, transferCorrect: 0 };
      const updated = {
        ...prev,
        [selectedLine]: {
          ...line,
          transferAttempts: line.transferAttempts + 1,
          transferCorrect: transferResult === 'correct' ? line.transferCorrect + 1 : line.transferCorrect,
        },
      };
      saveToStorage('lineStats', updated);
      return updated;
    });
  }, [transferPhase, transferResult, selectedLine]);

  // Reset tracking refs when starting new question
  useEffect(() => {
    if (phase === 'lineRoulette' || phase === 'gameStart') {
      prevResultRef.current = null;
      prevMcRef.current = null;
      prevTransferRef.current = null;
    }
  }, [phase]);

  /* ==================== HANDLERS ==================== */
  const handleSubmit = useCallback((e) => {
    e?.preventDefault?.();
    dispatch({ type: 'SUBMIT_ANSWER' });
  }, []);

  const getDirectionLabel = (dir) => {
    if (!lineData) return '';
    return dir === 'backward' ? lineData.terminals[0] : lineData.terminals[1];
  };

  /* ==================== TIMER COMPONENT ==================== */
  const TimerCircle = ({ tl, maxT, size = 'w-28 h-28', color }) => {
    const timerColor = color || getTimerColor(tl, maxT);
    const sec = Math.ceil(tl);
    const showPulse = tl <= 5 && tl > 0;
    const pulseClass = tl <= 3 ? 'countdown-pulse-fast' : 'countdown-pulse';
    return (
      <div className="relative">
        {/* Red flash overlay per second */}
        {tl <= 5 && tl > 0 && (
          <div
            key={`tflash-${sec}`}
            className="absolute inset-0 rounded-full z-0"
            style={{ backgroundColor: '#EF4444', animation: 'timerFlash 0.3s ease-out forwards' }}
          />
        )}
        <svg viewBox="0 0 120 120" className={`${size} relative z-10`}>
          {/* Glow ring when urgent */}
          {tl <= 5 && tl > 0 && (
            <circle cx="60" cy="60" r="54" fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.4">
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur={tl <= 3 ? '0.3s' : '0.5s'} repeatCount="indefinite" />
            </circle>
          )}
          <circle cx="60" cy="60" r="48" fill="none" stroke="#374151" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="48" fill="none"
            stroke={timerColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - tl / maxT)}
            transform="rotate(-90 60 60)"
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s' }}
          />
        </svg>
        {/* Center number */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div
            key={`num-${sec}`}
            className={`text-4xl font-black ${showPulse ? pulseClass : ''}`}
            style={{ color: tl <= 5 ? '#EF4444' : 'white' }}
          >
            {sec}
          </div>
        </div>
      </div>
    );
  };

  /* ==================== RENDER ==================== */
  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
        @keyframes shake { 0%,100% { transform: translateX(0); } 15%,45%,75% { transform: translateX(-8px); } 30%,60%,90% { transform: translateX(8px); } }
        @keyframes songBounce { 0% { transform: scale(1); } 25% { transform: scale(1.25); } 55% { transform: scale(0.93); } 100% { transform: scale(1); } }
        @keyframes bgFlash { from { opacity: 0.3; } to { opacity: 0; } }
        @keyframes rouletteSelect { 0% { transform: scale(1.05); } 40% { transform: scale(1.35); } 100% { transform: scale(1.08); } }
        @keyframes flashRed { 0% { background-color: rgba(239,68,68,0.25); } 100% { background-color: transparent; } }
        @keyframes scoreUp { from { transform: translateY(8px) scale(0.8); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes comboPop { 0% { transform: scale(1); } 40% { transform: scale(1.4); } 100% { transform: scale(1); } }
        @keyframes dotPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.8); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes transferPop { 0% { opacity: 0; transform: scale(0.5) rotate(-5deg); } 60% { transform: scale(1.15) rotate(2deg); } 100% { opacity: 1; transform: scale(1) rotate(0deg); } }
        @keyframes countdownPulse { 0% { transform: scale(1); } 30% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes timerFlash { 0% { opacity: 0.15; } 100% { opacity: 0; } }
        @keyframes explode { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.5); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes lineGlow { 0%,100% { box-shadow: 0 0 15px var(--glow-color); } 50% { box-shadow: 0 0 30px var(--glow-color); } }
        @keyframes countUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease-out; }
        .pop-in { animation: popIn 0.3s ease-out; }
        .shake-anim { animation: shake 0.45s ease-in-out; }
        .song-bounce { animation: songBounce 0.35s ease-out; }
        .roulette-select { animation: rouletteSelect 0.4s ease-out forwards; }
        .score-up { animation: scoreUp 0.4s ease-out; }
        .combo-pop { animation: comboPop 0.35s ease-out; }
        .dot-pop { animation: dotPop 0.3s ease-out forwards; }
        .fade-out-btn { animation: fadeOut var(--fade-dur) ease-in forwards; }
        .slide-down { animation: slideDown 0.4s ease-out; }
        .transfer-pop { animation: transferPop 0.4s ease-out; }
        .countdown-pulse { animation: countdownPulse 0.5s ease-out; }
        .countdown-pulse-fast { animation: countdownPulse 0.3s ease-out; }
        .explode-anim { animation: explode 0.6s ease-out; }
        .count-up { animation: countUp 0.5s ease-out; }
        .line-glow { animation: lineGlow 0.6s ease-in-out infinite; }
        @keyframes highlightRow { 0%,100% { background-color: rgba(234,179,8,0.15); } 50% { background-color: rgba(234,179,8,0.3); } }
        .highlight-row { animation: highlightRow 1.5s ease-in-out infinite; }
        @keyframes barGrow { from { width: 0%; } }
        .bar-grow { animation: barGrow 0.6s ease-out; }
      `}</style>

      {/* ===== TITLE SCREEN ===== */}
      {phase === 'title' && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
          {/* Color stripe top */}
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <div key={n} className="flex-1" style={{ backgroundColor: LINE_COLORS[n] }} />
            ))}
          </div>
          {/* Color stripe bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-2 flex">
            {[9,8,7,6,5,4,3,2,1].map(n => (
              <div key={n} className="flex-1" style={{ backgroundColor: LINE_COLORS[n] }} />
            ))}
          </div>

          <div className="text-6xl mb-2 pop-in">🚇</div>
          <h1 className="text-4xl font-black tracking-tight mb-8 fade-up">지하철 지하철</h1>

          <div className="w-full max-w-xs space-y-5">
            {/* Nickname */}
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={e => dispatch({ type: 'SET_NICKNAME', value: e.target.value })}
                placeholder="익명의 승객"
                className="w-full text-center text-lg p-3 rounded-xl bg-gray-800
                  border-2 border-gray-700 focus:border-white focus:outline-none transition-colors"
                maxLength={12}
              />
            </div>

            {/* Difficulty select */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">시작 난이도</label>
              <div className="flex gap-2">
                {DIFFICULTY_LEVELS.map(d => (
                  <button
                    key={d.level}
                    onClick={() => dispatch({ type: 'SET_START_DIFFICULTY', value: d.level })}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-150
                      ${startDifficulty === d.level
                        ? 'bg-white text-gray-900 scale-105 shadow-lg'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    <div className="text-lg">{d.icon}</div>
                    <div className="text-xs mt-0.5">{d.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={async () => { await initTone(); dispatch({ type: 'START_GAME' }); }}
              className="w-full p-5 rounded-2xl text-2xl font-black
                bg-gradient-to-r from-blue-600 to-purple-600
                hover:brightness-110 active:scale-95 transition-all shadow-xl
                shadow-purple-900/40"
            >
              🚇 게임 시작
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => dispatch({ type: 'SHOW_LEADERBOARD', from: 'title' })}
                className="flex-1 p-3 rounded-xl text-base font-bold bg-gray-800 hover:bg-gray-700 transition-all active:scale-95"
              >
                🏆 순위
              </button>
              <button
                onClick={() => dispatch({ type: 'SHOW_STATS', from: 'title' })}
                className="flex-1 p-3 rounded-xl text-base font-bold bg-gray-800 hover:bg-gray-700 transition-all active:scale-95"
              >
                📊 통계
              </button>
            </div>

            <p className="text-gray-500 text-sm text-center leading-relaxed">
              지하철 노선의 다음 역을 맞혀보세요!<br/>환승역에서는 보너스 찬스!
            </p>
          </div>
        </div>
      )}

      {/* ===== GAME START SPLASH ===== */}
      {phase === 'gameStart' && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center pop-in">
            <div className="text-8xl mb-6">🚇</div>
            <div className="text-4xl font-black mb-4">게임 시작!</div>
            <div className="text-lg text-gray-400">
              {difficulty.icon} Lv.{difficulty.level} {difficulty.name}
            </div>
            <div className="text-sm text-gray-500 mt-2">{difficulty.questionCount}문제</div>
          </div>
        </div>
      )}

      {/* ===== GAME HUD ===== */}
      {showGameHUD && (
        <div className="max-w-md mx-auto px-4 py-4 min-h-screen flex flex-col">
          {/* Header */}
          <header className="text-center mb-4 relative">
            {/* Mute toggle */}
            <button
              onClick={() => setMuted(m => !m)}
              className="absolute left-0 top-0 w-9 h-9 rounded-full bg-gray-800
                flex items-center justify-center text-base hover:bg-gray-700
                active:scale-90 transition-all"
              aria-label={muted ? '소리 켜기' : '소리 끄기'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
            {/* End button */}
            <button
              onClick={() => setShowEndConfirm(true)}
              className="absolute right-0 top-0 px-3 py-1.5 rounded-full bg-gray-800
                text-sm font-bold hover:bg-gray-700 active:scale-90 transition-all"
            >
              🏁 종료
            </button>

            <h1 className="text-xl font-black tracking-tight mb-2">🚇 지하철 지하철</h1>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="text-xs text-gray-400 mb-1">
                문제 {Math.min(questionsAnswered + 1, difficulty.questionCount)} / {difficulty.questionCount}
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(questionsAnswered / difficulty.questionCount) * 100}%`,
                    backgroundColor: lineColor || '#6366F1',
                  }}
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="flex justify-center items-center gap-2 text-sm flex-wrap">
              <span className="bg-gray-800 px-2.5 py-1 rounded-full">
                {difficulty.icon} Lv.{difficulty.level}
              </span>
              <span key={score} className="bg-gray-800 px-2.5 py-1 rounded-full score-up">
                <span className="text-yellow-400 font-bold">{score}</span>점
              </span>
              {combo > 0 && (
                <span key={`c${combo}`} className="bg-gray-800 px-2.5 py-1 rounded-full combo-pop">
                  🔥{combo}
                  {getComboMultiplier(combo) > 1 && (
                    <span className="text-orange-400 font-bold"> x{getComboMultiplier(combo)}</span>
                  )}
                </span>
              )}
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center">

            {/* ===== LINE ROULETTE ===== */}
            {phase === 'lineRoulette' && (
              <div className="w-full text-center fade-up">
                <p className="text-gray-400 mb-5 text-lg">호선 선택 중...</p>
                <div className="grid grid-cols-3 gap-3">
                  {[1,2,3,4,5,6,7,8,9].map(num => {
                    const isHL = lineRouletteHL === num;
                    return (
                      <div
                        key={num}
                        className={`p-4 rounded-2xl text-white font-bold text-lg transition-all duration-75
                          ${isHL ? 'scale-110 ring-2 ring-white line-glow' : 'scale-90 opacity-25'}`}
                        style={{
                          backgroundColor: LINE_COLORS[num],
                          '--glow-color': `${LINE_COLORS[num]}80`,
                        }}
                      >
                        {num}호선
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===== LINE SONG ===== */}
            {phase === 'lineSong' && lineData && (
              <div className="w-full text-center fade-up">
                <div className="relative py-16 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 rounded-3xl" style={{ backgroundColor: lineColor, opacity: 0.12 }} />
                  {songBeat >= 0 && (
                    <div key={`flash-${songBeat}`} className="absolute inset-0 rounded-3xl"
                      style={{ backgroundColor: lineColor, animation: 'bgFlash 0.35s ease-out forwards' }} />
                  )}
                  <div className="relative z-10">
                    <div className="text-lg text-gray-400 mb-3">🎵</div>
                    <div key={`song-${songBeat}`}
                      className={`text-5xl font-black ${songBeat >= 0 ? 'song-bounce' : ''}`}
                      style={{ color: lineColor }}>
                      {lineData.name}~
                    </div>
                    <div className="text-2xl mt-2 text-gray-300 font-bold">
                      {songBeat >= 0 ? `${lineData.name}~` : ''}
                    </div>
                    <div className="flex justify-center gap-3 mt-6">
                      {[0,1,2,3].map(i => (
                        <div key={i}
                          className={`w-3 h-3 rounded-full transition-all duration-200
                            ${songBeat >= i ? 'dot-pop' : 'opacity-20 scale-75'}`}
                          style={{ backgroundColor: lineColor }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== SHOW STATION ===== */}
            {phase === 'showStation' && lineData && (
              <div className="w-full text-center fade-up">
                <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6"
                  style={{ backgroundColor: lineColor }}>
                  {lineData.name}
                </div>
                <div className="text-5xl font-black mb-4 pop-in" style={{ color: lineColor }}>
                  {currentStation}
                </div>
                <p className="text-gray-400 fade-up">방향을 선택하는 중...</p>
              </div>
            )}

            {/* ===== DIRECTION ROULETTE ===== */}
            {phase === 'roulette' && lineData && (
              <div className="w-full text-center fade-up">
                <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4"
                  style={{ backgroundColor: lineColor }}>{lineData.name}</div>
                <div className="text-4xl font-black mb-8" style={{ color: lineColor }}>{currentStation}</div>
                <div className="flex items-center justify-center gap-3">
                  {[['left','backward',0,'←'], ['right','forward',1,'→']].map(([side,,ti,arrow]) => (
                    <div key={side}
                      className={`flex-1 p-4 rounded-xl text-center transition-all duration-75 cursor-default relative overflow-hidden
                        ${rouletteHL === side
                          ? (rouletteDone ? 'roulette-select ring-2 ring-white opacity-100' : 'scale-110 opacity-100 ring-2 ring-white')
                          : 'scale-90 opacity-25'}`}
                      style={{ backgroundColor: rouletteHL === side ? lineColor : '#1f2937' }}>
                      {rouletteDone && rouletteHL === side && (
                        <div className="absolute inset-0 flex items-center justify-center pop-in text-3xl">💥</div>
                      )}
                      <div className="text-2xl mb-1 relative z-10">{arrow}</div>
                      <div className="text-sm font-bold truncate relative z-10">{lineData.terminals[ti]} 방향</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== INPUT ===== */}
            {phase === 'input' && lineData && (
              <div className="w-full text-center fade-up">
                <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-3"
                  style={{ backgroundColor: lineColor }}>{lineData.name}</div>
                <div className="text-xl text-gray-300 mb-1">{currentStation}에서</div>
                <div className="text-2xl font-bold mb-5" style={{ color: lineColor }}>
                  {getDirectionLabel(direction)} 방향 다음 역은?
                </div>

                {/* Red bg flash per second during countdown */}
                {timeLeft <= 5 && timeLeft > 0 && (
                  <div key={`bgfl-${Math.ceil(timeLeft)}`}
                    className="fixed inset-0 pointer-events-none z-40"
                    style={{ animation: 'flashRed 0.3s ease-out forwards' }} />
                )}

                {/* Timer */}
                <div className="flex justify-center mb-5">
                  <TimerCircle tl={timeLeft} maxT={difficulty.inputTime} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input ref={inputRef} type="text" value={userInput}
                    onChange={e => dispatch({ type: 'SET_INPUT', value: e.target.value })}
                    placeholder="역 이름을 입력하세요"
                    className="w-full text-center text-xl p-4 rounded-xl bg-gray-800
                      border-2 border-gray-600 focus:border-white focus:outline-none
                      transition-colors placeholder-gray-500"
                    autoComplete="off" autoCorrect="off" spellCheck={false} />
                  <button type="submit"
                    className="w-full p-4 rounded-xl text-lg font-bold transition-all
                      active:scale-95 hover:brightness-110"
                    style={{ backgroundColor: lineColor }}>
                    제출
                  </button>
                </form>
              </div>
            )}

            {/* ===== RESULT ===== */}
            {phase === 'result' && (
              <div className="w-full text-center">
                {/* Red flash overlay on wrong/timeout */}
                {(resultType === 'wrong' || resultType === 'timeout') && !showMC && (
                  <div className="fixed inset-0 pointer-events-none z-50"
                    style={{ animation: 'flashRed 0.5s ease-out forwards' }} />
                )}

                {/* Timeout */}
                {resultType === 'timeout' && !showMC && (
                  <div className="pop-in">
                    <div className="text-7xl mb-4 explode-anim">⏰</div>
                    <div className="text-4xl font-black text-red-400 shake-anim">시간 초과!</div>
                  </div>
                )}

                {/* Correct */}
                {resultType === 'correct' && (
                  <div>
                    {!transferPhase && (
                      <div className="pop-in">
                        <div className="text-7xl mb-4">🎉</div>
                        <div className="text-4xl font-black text-green-400 mb-3">정답!</div>
                        <div className="text-3xl font-bold text-white mb-2">{correctAnswer}</div>
                        <div key={`pts-${lastPoints}`} className="text-xl text-yellow-400 font-bold score-up">
                          +{lastPoints}점
                        </div>
                        {combo >= 3 && (
                          <div key={`combo-${combo}`} className="text-lg text-orange-400 mt-2 combo-pop">
                            🔥 {combo}콤보 x{getComboMultiplier(combo)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Transfer: Button */}
                    {transferPhase === 'button' && (
                      <div className="pop-in">
                        <div className="text-5xl mb-3">🎉</div>
                        <div className="text-2xl font-black text-green-400 mb-2">정답! +{lastPoints}점</div>
                        <div className="text-xl font-bold text-white mb-4">{correctAnswer}</div>
                        <div className="mt-4">
                          <p className="text-gray-400 text-sm mb-3">환승역입니다!</p>
                          <button
                            onClick={() => dispatch({ type: 'TRANSFER_BTN_CLICK' })}
                            className="fade-out-btn px-8 py-4 rounded-2xl text-xl font-black
                              bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110
                              active:scale-95 transition-transform shadow-lg shadow-purple-500/30"
                            style={{ '--fade-dur': `${difficulty.transferBtnDur}s` }}>
                            🚃 환승 챌린지!
                          </button>
                          <div className="mt-3 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full"
                              style={{ animation: `fadeOut ${difficulty.transferBtnDur}s linear forwards`, transformOrigin: 'left' }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Transfer: Select */}
                    {transferPhase === 'select' && (
                      <div className="w-full fade-up">
                        <div className="text-2xl font-bold mb-2">🚃 환승 챌린지</div>
                        <p className="text-gray-300 mb-1">
                          <span className="font-bold text-white">{correctAnswer}</span>역
                        </p>
                        <p className="text-gray-400 mb-3 text-sm">환승 노선을 모두 선택! ({selectedLine}호선 제외)</p>

                        {/* Red bg flash during transfer countdown */}
                        {timeLeft <= 5 && timeLeft > 0 && (
                          <div key={`tfl-${Math.ceil(timeLeft)}`}
                            className="fixed inset-0 pointer-events-none z-40"
                            style={{ animation: 'flashRed 0.3s ease-out forwards' }} />
                        )}

                        <div className="flex justify-center mb-4">
                          <TimerCircle tl={timeLeft} maxT={difficulty.transferSelectTime} size="w-20 h-20" color="#A855F7" />
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 mb-4">
                          {[1,2,3,4,5,6,7,8,9].filter(l => l !== selectedLine).map(l => {
                            const isSel = transferSelected.includes(l);
                            return (
                              <button key={l}
                                onClick={() => dispatch({ type: 'TRANSFER_SELECT_LINE', line: l })}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150
                                  ${isSel ? 'ring-2 ring-white scale-105 shadow-lg' : 'opacity-50 hover:opacity-80'}`}
                                style={{
                                  backgroundColor: isSel ? LINE_COLORS[l] : '#374151',
                                  color: isSel ? 'white' : '#9CA3AF',
                                }}>
                                {l}호선
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => dispatch({ type: 'TRANSFER_SUBMIT' })}
                          disabled={transferSelected.length === 0}
                          className="w-full p-3 rounded-xl text-base font-bold transition-all
                            active:scale-95 hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed
                            bg-gradient-to-r from-purple-600 to-pink-500">
                          제출 ({transferSelected.length}개)
                        </button>
                      </div>
                    )}

                    {/* Transfer: Result */}
                    {transferPhase === 'result' && (
                      <div className="transfer-pop">
                        {transferResult === 'correct' ? (
                          <>
                            <div className="text-7xl mb-4">🎊</div>
                            <div className="text-3xl font-black text-purple-400 mb-2">환승 성공!</div>
                            <div className="text-xl text-yellow-400 font-bold score-up">+{lastPoints}점 보너스!</div>
                            <div className="text-sm text-gray-400 mt-2">
                              {correctAnswer}: {transferLines.map(l => `${l}호선`).join(', ')}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-7xl mb-4">😅</div>
                            <div className="text-3xl font-black text-gray-400 mb-2">아쉽!</div>
                            <div className="text-base text-gray-300">
                              정답: {transferLines.map(l => (
                                <span key={l} className="inline-block mx-1 px-2 py-0.5 rounded-full text-sm font-bold"
                                  style={{ backgroundColor: LINE_COLORS[l] }}>{l}호선</span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Wrong */}
                {resultType === 'wrong' && !showMC && (
                  <div className="shake-anim">
                    <div className="text-7xl mb-4">❌</div>
                    <div className="text-4xl font-black text-red-400">오답!</div>
                  </div>
                )}

                {/* Multiple Choice (for wrong & timeout) */}
                {(resultType === 'wrong' || resultType === 'timeout') && showMC && (
                  <div className="w-full fade-up">
                    <p className="text-lg text-gray-300 mb-2">
                      {currentStation}에서 {getDirectionLabel(direction)} 방향
                    </p>
                    <p className="text-xl font-bold mb-5">다음 역을 골라주세요!</p>
                    <div className="grid grid-cols-2 gap-3">
                      {mcOptions.map(opt => {
                        const isCorrectOpt = normalizeStation(opt) === normalizeStation(correctAnswer);
                        let cls = 'bg-gray-700 hover:bg-gray-600 active:scale-95';
                        if (mcResult) {
                          if (isCorrectOpt) cls = 'bg-green-600 scale-105 ring-2 ring-green-400';
                          else if (opt === mcSelectedOption) cls = 'bg-red-600 shake-anim';
                          else cls = 'bg-gray-800 opacity-40';
                        }
                        return (
                          <button key={opt}
                            onClick={() => dispatch({ type: 'MC_SELECT', option: opt })}
                            disabled={!!mcResult}
                            className={`p-4 rounded-xl text-lg font-bold transition-all duration-200 ${cls}`}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {mcResult === 'correct' && (
                      <div className="mt-4 text-green-400 text-xl font-bold pop-in">정답! +30점</div>
                    )}
                    {mcResult === 'wrong' && (
                      <div className="mt-4 text-red-400 text-lg font-bold pop-in">
                        정답은 <span className="text-green-400 text-xl">{correctAnswer}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ===== LEVEL TRANSITION ===== */}
            {phase === 'levelTransition' && (
              <div className="text-center pop-in">
                {levelChangeMsg === 'up' && (
                  <>
                    <div className="text-7xl mb-4">🎊</div>
                    <div className="text-3xl font-black text-yellow-400 mb-3">난이도 UP!</div>
                    <div className="text-xl font-bold">
                      {difficulty.icon} Lv.{difficultyLevel} {difficulty.name}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">{difficulty.questionCount}문제</div>
                  </>
                )}
                {levelChangeMsg === 'down' && (
                  <>
                    <div className="text-7xl mb-4">📉</div>
                    <div className="text-2xl font-bold text-gray-300 mb-3">난이도 조정</div>
                    <div className="text-xl font-bold">
                      {difficulty.icon} Lv.{difficultyLevel} {difficulty.name}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">{difficulty.questionCount}문제</div>
                  </>
                )}
                {levelChangeMsg === 'same' && (
                  <>
                    <div className="text-7xl mb-4">💪</div>
                    <div className="text-2xl font-bold text-gray-300 mb-3">다시 도전!</div>
                    <div className="text-xl font-bold">
                      {difficulty.icon} Lv.{difficultyLevel} {difficulty.name}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">{difficulty.questionCount}문제</div>
                  </>
                )}
                <div className="text-sm text-gray-600 mt-6">다음 세트 준비 중...</div>
              </div>
            )}
          </main>

          <footer className="text-center text-gray-600 text-xs pb-4">
            서울 지하철 1~9호선 퀴즈
          </footer>
        </div>
      )}

      {/* ===== GAME COMPLETE ===== */}
      {phase === 'gameComplete' && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <div className="text-6xl mb-3 pop-in">🏆</div>
          <h2 className="text-3xl font-black mb-1 fade-up">게임 완료!</h2>
          <div className="text-sm text-gray-400 mb-6">{nickname}</div>

          <div className="text-6xl font-black text-yellow-400 mb-8 count-up">
            {displayScore}점
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8">
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-xs text-gray-400">도달 난이도</div>
              <div className="text-lg font-bold">{difficulty.icon} {difficulty.name}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-xs text-gray-400">총 문제</div>
              <div className="text-lg font-bold">{totalQuestionsPlayed}문제</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-xs text-gray-400">정답률</div>
              <div className="text-lg font-bold">
                {totalQuestionsPlayed ? Math.round(totalCorrect / totalQuestionsPlayed * 100) : 0}%
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-xs text-gray-400">최고 콤보</div>
              <div className="text-lg font-bold">🔥 {maxCombo}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-3 col-span-2">
              <div className="text-xs text-gray-400">환승 성공률</div>
              <div className="text-lg font-bold">
                {transferAttempts > 0
                  ? `${Math.round(transferSuccesses / transferAttempts * 100)}% (${transferSuccesses}/${transferAttempts})`
                  : '- (도전 없음)'}
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-xs mb-3">
            <button
              onClick={() => dispatch({ type: 'BACK_TO_TITLE' })}
              className="flex-1 p-4 rounded-xl text-lg font-bold bg-gray-700 hover:bg-gray-600 transition-all active:scale-95">
              🏠 홈으로
            </button>
            <button
              onClick={async () => { await initTone(); dispatch({ type: 'REPLAY' }); }}
              className="flex-1 p-4 rounded-xl text-lg font-bold bg-blue-600 hover:brightness-110 transition-all active:scale-95">
              🔄 다시 하기
            </button>
          </div>
          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={() => dispatch({ type: 'SHOW_LEADERBOARD', from: 'gameComplete' })}
              className="flex-1 p-3 rounded-xl text-sm font-bold bg-gray-800 hover:bg-gray-700 transition-all active:scale-95">
              🏆 순위 보기
            </button>
            <button
              onClick={() => dispatch({ type: 'SHOW_STATS', from: 'gameComplete' })}
              className="flex-1 p-3 rounded-xl text-sm font-bold bg-gray-800 hover:bg-gray-700 transition-all active:scale-95">
              📊 통계 보기
            </button>
          </div>
        </div>
      )}

      {/* ===== LEADERBOARD ===== */}
      {phase === 'leaderboard' && (
        <div className="min-h-screen flex flex-col items-center px-4 py-8">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-black text-center mb-6 fade-up">🏆 리더보드</h2>
            {leaderboard.length === 0 ? (
              <div className="text-center text-gray-400 py-12 fade-up">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-lg">아직 기록이 없습니다.</p>
                <p className="text-sm mt-1">첫 번째 기록을 남겨보세요!</p>
              </div>
            ) : (
              <div className="space-y-2 mb-6">
                {/* Header */}
                <div className="flex items-center text-xs text-gray-500 px-3 py-1">
                  <span className="w-8">#</span>
                  <span className="flex-1">닉네임</span>
                  <span className="w-16 text-right">점수</span>
                  <span className="w-14 text-right">정답률</span>
                  <span className="w-20 text-right">날짜</span>
                </div>
                {leaderboard.map((r, i) => {
                  const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
                  const isMe = i === currentRecordIdx;
                  return (
                    <div key={i}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm transition-all
                        ${isMe ? 'highlight-row ring-1 ring-yellow-500/40' : 'bg-gray-800/50'}`}>
                      <span className="w-8 font-bold">{medal}</span>
                      <span className="flex-1 font-bold truncate">
                        {r.nickname}
                        {isMe && <span className="text-yellow-400 text-xs ml-1">← YOU</span>}
                      </span>
                      <span className="w-16 text-right font-bold text-yellow-400">{r.score}</span>
                      <span className="w-14 text-right text-gray-400">{r.accuracy}%</span>
                      <span className="w-20 text-right text-gray-500 text-xs">{r.date}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  if (confirm('리더보드를 초기화하시겠습니까?')) {
                    setLeaderboard([]);
                    saveToStorage('leaderboard', []);
                  }
                }}
                className="flex-1 p-3 rounded-xl text-sm font-bold bg-red-900/40 text-red-400
                  hover:bg-red-900/60 transition-all active:scale-95"
              >
                초기화
              </button>
              <button
                onClick={() => dispatch({ type: 'GO_BACK' })}
                className="flex-1 p-3 rounded-xl text-sm font-bold bg-gray-700 hover:bg-gray-600 transition-all active:scale-95"
              >
                돌아가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== STATS ===== */}
      {phase === 'stats' && (() => {
        const totals = { total: 0, freeCorrect: 0, mcCorrect: 0, transferAttempts: 0, transferCorrect: 0 };
        for (let i = 1; i <= 9; i++) {
          const s = lineStats[i] || {};
          totals.total += s.total || 0;
          totals.freeCorrect += s.freeCorrect || 0;
          totals.mcCorrect += s.mcCorrect || 0;
          totals.transferAttempts += s.transferAttempts || 0;
          totals.transferCorrect += s.transferCorrect || 0;
        }
        const pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;
        const pctColor = (v) => v >= 80 ? '#10B981' : v >= 50 ? '#F59E0B' : '#EF4444';
        return (
          <div className="min-h-screen flex flex-col items-center px-4 py-8">
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-black text-center mb-6 fade-up">📊 노선별 통계</h2>
              <div className="space-y-3 mb-6">
                {[1,2,3,4,5,6,7,8,9].map(num => {
                  const s = lineStats[num] || { total: 0, freeCorrect: 0, mcCorrect: 0, transferAttempts: 0, transferCorrect: 0 };
                  const freeRate = pct(s.freeCorrect, s.total);
                  const transferRate = pct(s.transferCorrect, s.transferAttempts);
                  return (
                    <div key={num} className="bg-gray-800/50 rounded-xl p-3 fade-up">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                          style={{ backgroundColor: LINE_COLORS[num] }}>
                          {num}
                        </div>
                        <span className="font-bold">{LINES_DATA[num].name}</span>
                        <span className="text-xs text-gray-400 ml-auto">{s.total}문제</span>
                      </div>
                      {s.total > 0 ? (
                        <>
                          <div className="mb-1">
                            <div className="flex justify-between text-xs mb-0.5">
                              <span className="text-gray-400">자유입력 정답률</span>
                              <span style={{ color: pctColor(freeRate) }}>{freeRate}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
                              <div className="h-full rounded-full bar-grow" style={{
                                width: `${freeRate}%`, backgroundColor: pctColor(freeRate),
                              }} />
                            </div>
                          </div>
                          {s.transferAttempts > 0 && (
                            <div className="text-xs text-gray-400">
                              환승 성공률: <span className="text-white font-bold">{transferRate}%</span>
                              <span className="text-gray-500"> ({s.transferCorrect}/{s.transferAttempts})</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-xs text-gray-500">기록 없음</div>
                      )}
                    </div>
                  );
                })}
                {/* Total summary */}
                <div className="bg-gray-700/50 rounded-xl p-3 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black bg-white text-gray-900">
                      Σ
                    </div>
                    <span className="font-bold">전체 합산</span>
                    <span className="text-xs text-gray-400 ml-auto">{totals.total}문제</span>
                  </div>
                  {totals.total > 0 ? (
                    <>
                      <div className="mb-1">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-gray-400">자유입력 정답률</span>
                          <span style={{ color: pctColor(pct(totals.freeCorrect, totals.total)) }}>
                            {pct(totals.freeCorrect, totals.total)}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
                          <div className="h-full rounded-full bar-grow" style={{
                            width: `${pct(totals.freeCorrect, totals.total)}%`,
                            backgroundColor: pctColor(pct(totals.freeCorrect, totals.total)),
                          }} />
                        </div>
                      </div>
                      {totals.transferAttempts > 0 && (
                        <div className="text-xs text-gray-400">
                          환승 성공률: <span className="text-white font-bold">{pct(totals.transferCorrect, totals.transferAttempts)}%</span>
                          <span className="text-gray-500"> ({totals.transferCorrect}/{totals.transferAttempts})</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-gray-500">기록 없음</div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (confirm('통계를 초기화하시겠습니까?')) {
                      const empty = makeEmptyLineStats();
                      setLineStats(empty);
                      saveToStorage('lineStats', empty);
                    }
                  }}
                  className="flex-1 p-3 rounded-xl text-sm font-bold bg-red-900/40 text-red-400
                    hover:bg-red-900/60 transition-all active:scale-95"
                >
                  통계 초기화
                </button>
                <button
                  onClick={() => dispatch({ type: 'GO_BACK' })}
                  className="flex-1 p-3 rounded-xl text-sm font-bold bg-gray-700 hover:bg-gray-600 transition-all active:scale-95"
                >
                  돌아가기
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== END CONFIRM MODAL ===== */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center pop-in">
            <p className="text-xl font-bold mb-6">게임을 종료하시겠습니까?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 p-3 rounded-xl bg-gray-600 font-bold hover:bg-gray-500 transition-all active:scale-95">
                계속하기
              </button>
              <button
                onClick={() => { setShowEndConfirm(false); dispatch({ type: 'END_GAME' }); }}
                className="flex-1 p-3 rounded-xl bg-red-600 font-bold hover:brightness-110 transition-all active:scale-95">
                종료하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
