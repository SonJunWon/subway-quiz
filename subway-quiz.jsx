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

/* ==================== REDUCER ==================== */
const initialState = {
  phase: 'lineSelect',
  selectedLine: null,
  currentStation: '',
  stationIndex: 0,
  direction: null,
  correctAnswer: '',
  score: 0,
  combo: 0,
  userInput: '',
  timeLeft: 10,
  resultType: null,
  showMC: false,
  mcOptions: [],
  mcResult: null,
  mcSelectedOption: null,
  rouletteHL: null,
  lastPoints: 0,
  songBeat: -1,
  rouletteDone: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_LINE': {
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
      };
    }
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
    case 'TO_INPUT':
      return { ...state, phase: 'input', timeLeft: 10, userInput: '' };

    case 'SET_INPUT':
      return { ...state, userInput: action.value };

    case 'TIMER_TICK':
      if (state.phase !== 'input') return state;
      return { ...state, timeLeft: Math.max(0, +(state.timeLeft - 0.1).toFixed(1)) };

    case 'SUBMIT_ANSWER': {
      if (state.phase !== 'input') return state;
      const norm = normalizeStation(state.userInput);
      const normAns = normalizeStation(state.correctAnswer);
      if (norm === normAns) {
        const newCombo = state.combo + 1;
        const mult = getComboMultiplier(newCombo);
        const pts = Math.floor(100 * mult);
        return {
          ...state, phase: 'result', resultType: 'correct',
          combo: newCombo, score: state.score + pts, lastPoints: pts, showMC: false,
        };
      }
      const ld = LINES_DATA[state.selectedLine];
      const opts = generateMC(ld, state.correctAnswer, state.currentStation);
      return {
        ...state, phase: 'result', resultType: 'wrong',
        combo: 0, mcOptions: opts, showMC: false,
      };
    }
    case 'TIMEOUT': {
      if (state.phase !== 'input') return state;
      const ld = LINES_DATA[state.selectedLine];
      const opts = generateMC(ld, state.correctAnswer, state.currentStation);
      return {
        ...state, phase: 'result', resultType: 'wrong',
        combo: 0, mcOptions: opts, showMC: false,
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
    case 'RESET':
      return {
        ...state, phase: 'lineSelect', resultType: null, showMC: false,
        mcResult: null, mcOptions: [], mcSelectedOption: null,
        direction: null, rouletteHL: null, selectedLine: null,
        songBeat: -1, rouletteDone: false,
      };
    default:
      return state;
  }
}

/* ==================== COMPONENT ==================== */
export default function SubwayQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const toneReady = useRef(false);
  const synthsRef = useRef({});
  const inputRef = useRef(null);
  const lastTickSecond = useRef(10);

  const {
    phase, selectedLine, currentStation, direction, score, combo,
    userInput, timeLeft, resultType, showMC, mcOptions, mcResult,
    correctAnswer, rouletteHL, lastPoints, mcSelectedOption,
    songBeat, rouletteDone
  } = state;

  const lineData = selectedLine ? LINES_DATA[selectedLine] : null;
  const lineColor = selectedLine ? LINE_COLORS[selectedLine] : null;

  // Keep mutedRef synced
  useEffect(() => { mutedRef.current = muted; }, [muted]);

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
        pitchDecay: 0.008,
        octaves: 6,
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

  // Cleanup synths on unmount
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
      const notes = ['C4', 'E4', 'G4', 'C5'];
      notes.forEach((note, i) => {
        melody.triggerAttackRelease(note, '8n', now + i * 0.4);
        membrane.triggerAttackRelease('C1', '16n', now + i * 0.4);
      });
    } catch {}
  }, []);

  const playRouletteTick = useCallback(() => {
    if (!toneReady.current || mutedRef.current) return;
    try {
      synthsRef.current.membrane?.triggerAttackRelease('G2', '32n');
    } catch {}
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

  const playTimerWarn = useCallback((sec) => {
    if (!toneReady.current || mutedRef.current) return;
    try {
      const notes = { 3: 'G5', 2: 'A5', 1: 'B5' };
      synthsRef.current.tick?.triggerAttackRelease(notes[sec] || 'G5', '32n');
    } catch {}
  }, []);

  /* ==================== EFFECTS ==================== */

  // LINE SONG — melody + beat animation
  useEffect(() => {
    if (phase !== 'lineSong') return;
    let cancelled = false;

    playLineSong();

    const timers = [0, 400, 800, 1200].map((delay, i) =>
      setTimeout(() => {
        if (!cancelled) dispatch({ type: 'SONG_BEAT', beat: i });
      }, delay)
    );
    timers.push(
      setTimeout(() => {
        if (!cancelled) dispatch({ type: 'TO_SHOW_STATION' });
      }, 2000)
    );

    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [phase, playLineSong]);

  // showStation → roulette
  useEffect(() => {
    if (phase !== 'showStation') return;
    const id = setTimeout(() => dispatch({ type: 'TO_ROULETTE' }), 1000);
    return () => clearTimeout(id);
  }, [phase]);

  // Roulette animation + sound
  useEffect(() => {
    if (phase !== 'roulette') return;
    const finalDir = Math.random() < 0.5 ? 'forward' : 'backward';
    let cancelled = false;
    let interval = 100;
    let step = 0;

    const tick = () => {
      if (cancelled) return;
      step++;
      const side = step % 2 === 0 ? 'left' : 'right';
      dispatch({ type: 'ROULETTE_TICK', side });
      playRouletteTick();

      interval *= 1.18;
      if (interval > 450) {
        dispatch({ type: 'ROULETTE_DONE', finalDir });
        playRouletteFinish();
        setTimeout(() => {
          if (!cancelled) dispatch({ type: 'TO_INPUT' });
        }, 700);
        return;
      }
      setTimeout(tick, interval);
    };
    setTimeout(tick, interval);
    return () => { cancelled = true; };
  }, [phase, playRouletteTick, playRouletteFinish]);

  // Timer
  useEffect(() => {
    if (phase !== 'input') return;
    const id = setInterval(() => dispatch({ type: 'TIMER_TICK' }), 100);
    return () => clearInterval(id);
  }, [phase]);

  // Timeout check
  useEffect(() => {
    if (phase === 'input' && timeLeft <= 0.05) {
      dispatch({ type: 'TIMEOUT' });
    }
  }, [phase, timeLeft]);

  // Timer warning sounds
  useEffect(() => {
    if (phase !== 'input') {
      lastTickSecond.current = 10;
      return;
    }
    const sec = Math.ceil(timeLeft);
    if (sec <= 3 && sec > 0 && sec !== lastTickSecond.current) {
      lastTickSecond.current = sec;
      playTimerWarn(sec);
    }
  }, [phase, timeLeft, playTimerWarn]);

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
  }, [resultType, playCorrect, playWrong]);

  // Result → show MC / reset
  useEffect(() => {
    if (phase !== 'result') return;
    if (resultType === 'correct') {
      const id = setTimeout(() => dispatch({ type: 'RESET' }), 1500);
      return () => clearTimeout(id);
    }
    if (resultType === 'wrong' && !showMC) {
      const id = setTimeout(() => dispatch({ type: 'SHOW_MC' }), 800);
      return () => clearTimeout(id);
    }
  }, [phase, resultType, showMC]);

  // MC result → reset
  useEffect(() => {
    if (!mcResult) return;
    if (mcResult === 'correct') playCorrect();
    if (mcResult === 'wrong') playWrong();
    const delay = mcResult === 'correct' ? 1500 : 2000;
    const id = setTimeout(() => dispatch({ type: 'RESET' }), delay);
    return () => clearTimeout(id);
  }, [mcResult, playCorrect, playWrong]);

  /* ==================== HANDLERS ==================== */
  const handleLineSelect = useCallback(async (lineNum) => {
    await initTone();
    dispatch({ type: 'SELECT_LINE', lineNum });
  }, [initTone]);

  const handleSubmit = useCallback((e) => {
    e?.preventDefault?.();
    dispatch({ type: 'SUBMIT_ANSWER' });
  }, []);

  const getDirectionLabel = (dir) => {
    if (!lineData) return '';
    return dir === 'backward' ? lineData.terminals[0] : lineData.terminals[1];
  };

  /* ==================== RENDER ==================== */
  const circumference = 2 * Math.PI * 42;

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%,45%,75% { transform: translateX(-8px); }
          30%,60%,90% { transform: translateX(8px); }
        }
        @keyframes songBounce {
          0% { transform: scale(1); }
          25% { transform: scale(1.25); }
          55% { transform: scale(0.93); }
          100% { transform: scale(1); }
        }
        @keyframes bgFlash {
          from { opacity: 0.3; }
          to { opacity: 0; }
        }
        @keyframes rouletteSelect {
          0% { transform: scale(1.05); }
          40% { transform: scale(1.35); }
          100% { transform: scale(1.08); }
        }
        @keyframes flashRed {
          0% { background-color: rgba(239,68,68,0.25); }
          100% { background-color: transparent; }
        }
        @keyframes scoreUp {
          from { transform: translateY(8px) scale(0.8); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes comboPop {
          0% { transform: scale(1); }
          40% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        @keyframes timerPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes dotPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .fade-up { animation: fadeUp 0.35s ease-out; }
        .pop-in { animation: popIn 0.3s ease-out; }
        .shake-anim { animation: shake 0.45s ease-in-out; }
        .song-bounce { animation: songBounce 0.35s ease-out; }
        .roulette-select { animation: rouletteSelect 0.4s ease-out forwards; }
        .score-up { animation: scoreUp 0.4s ease-out; }
        .combo-pop { animation: comboPop 0.35s ease-out; }
        .timer-pulse { animation: timerPulse 0.5s ease-in-out infinite; }
        .dot-pop { animation: dotPop 0.3s ease-out forwards; }
      `}</style>

      <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* ===== HEADER ===== */}
        <header className="text-center mb-6 relative">
          {/* Mute toggle */}
          <button
            onClick={() => setMuted(m => !m)}
            className="absolute right-0 top-0 w-10 h-10 rounded-full bg-gray-800
              flex items-center justify-center text-lg hover:bg-gray-700
              active:scale-90 transition-all"
            aria-label={muted ? '소리 켜기' : '소리 끄기'}
          >
            {muted ? '🔇' : '🔊'}
          </button>

          <h1 className="text-3xl font-black tracking-tight mb-2">
            🚇 지하철 지하철
          </h1>
          <div className="flex justify-center items-center gap-3 text-base">
            <span key={score} className="bg-gray-800 px-3 py-1 rounded-full score-up">
              점수 <span className="text-yellow-400 font-bold">{score}</span>
            </span>
            {combo > 0 && (
              <span key={`c${combo}`} className="bg-gray-800 px-3 py-1 rounded-full combo-pop">
                🔥 {combo}콤보
                {getComboMultiplier(combo) > 1 && (
                  <span className="text-orange-400 font-bold"> ×{getComboMultiplier(combo)}</span>
                )}
              </span>
            )}
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="flex-1 flex flex-col items-center justify-center">

          {/* ===== LINE SELECT ===== */}
          {phase === 'lineSelect' && (
            <div className="w-full fade-up">
              <p className="text-center text-gray-400 mb-5 text-lg">노선을 선택하세요</p>
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <button
                    key={num}
                    onClick={() => handleLineSelect(num)}
                    style={{ backgroundColor: LINE_COLORS[num] }}
                    className="p-4 rounded-2xl text-white font-bold text-lg
                      hover:brightness-110 active:scale-90 transition-all duration-150
                      shadow-lg hover:shadow-xl"
                  >
                    {num}호선
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== LINE SONG ===== */}
          {phase === 'lineSong' && lineData && (
            <div className="w-full text-center fade-up">
              <div className="relative py-16 rounded-3xl overflow-hidden">
                {/* Background base */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{ backgroundColor: lineColor, opacity: 0.12 }}
                />
                {/* Beat flash overlay */}
                {songBeat >= 0 && (
                  <div
                    key={`flash-${songBeat}`}
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      backgroundColor: lineColor,
                      animation: 'bgFlash 0.35s ease-out forwards',
                    }}
                  />
                )}
                {/* Song text */}
                <div className="relative z-10">
                  <div className="text-lg text-gray-400 mb-3">🎵</div>
                  <div
                    key={`song-${songBeat}`}
                    className={`text-5xl font-black ${songBeat >= 0 ? 'song-bounce' : ''}`}
                    style={{ color: lineColor }}
                  >
                    {lineData.name}~
                  </div>
                  <div className="text-2xl mt-2 text-gray-300 font-bold">
                    {songBeat >= 0 ? `${lineData.name}~` : ''}
                  </div>
                  {/* Beat dots */}
                  <div className="flex justify-center gap-3 mt-6">
                    {[0,1,2,3].map(i => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all duration-200
                          ${songBeat >= i ? 'dot-pop' : 'opacity-20 scale-75'}`}
                        style={{
                          backgroundColor: lineColor,
                          animationDelay: songBeat === i ? '0s' : undefined,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== SHOW STATION ===== */}
          {phase === 'showStation' && lineData && (
            <div className="w-full text-center fade-up">
              <div
                className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6"
                style={{ backgroundColor: lineColor }}
              >
                {lineData.name}
              </div>
              <div
                className="text-5xl font-black mb-4 pop-in"
                style={{ color: lineColor }}
              >
                {currentStation}
              </div>
              <p className="text-gray-400 fade-up">방향을 선택하는 중...</p>
            </div>
          )}

          {/* ===== ROULETTE ===== */}
          {phase === 'roulette' && lineData && (
            <div className="w-full text-center fade-up">
              <div
                className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4"
                style={{ backgroundColor: lineColor }}
              >
                {lineData.name}
              </div>
              <div className="text-4xl font-black mb-8" style={{ color: lineColor }}>
                {currentStation}
              </div>
              <div className="flex items-center justify-center gap-3">
                {/* Left — backward */}
                <div
                  className={`flex-1 p-4 rounded-xl text-center transition-all duration-75 cursor-default relative overflow-hidden
                    ${rouletteHL === 'left'
                      ? (rouletteDone ? 'roulette-select ring-2 ring-white opacity-100' : 'scale-110 opacity-100 ring-2 ring-white')
                      : 'scale-90 opacity-25'
                    }`}
                  style={{
                    backgroundColor: rouletteHL === 'left' ? lineColor : '#1f2937',
                  }}
                >
                  {rouletteDone && rouletteHL === 'left' && (
                    <div className="absolute inset-0 flex items-center justify-center pop-in text-3xl">
                      💥
                    </div>
                  )}
                  <div className="text-2xl mb-1 relative z-10">←</div>
                  <div className="text-sm font-bold truncate relative z-10">
                    {lineData.terminals[0]} 방향
                  </div>
                </div>
                {/* Right — forward */}
                <div
                  className={`flex-1 p-4 rounded-xl text-center transition-all duration-75 cursor-default relative overflow-hidden
                    ${rouletteHL === 'right'
                      ? (rouletteDone ? 'roulette-select ring-2 ring-white opacity-100' : 'scale-110 opacity-100 ring-2 ring-white')
                      : 'scale-90 opacity-25'
                    }`}
                  style={{
                    backgroundColor: rouletteHL === 'right' ? lineColor : '#1f2937',
                  }}
                >
                  {rouletteDone && rouletteHL === 'right' && (
                    <div className="absolute inset-0 flex items-center justify-center pop-in text-3xl">
                      💥
                    </div>
                  )}
                  <div className="text-2xl mb-1 relative z-10">→</div>
                  <div className="text-sm font-bold truncate relative z-10">
                    {lineData.terminals[1]} 방향
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== INPUT ===== */}
          {phase === 'input' && lineData && (
            <div className="w-full text-center fade-up">
              <div
                className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-3"
                style={{ backgroundColor: lineColor }}
              >
                {lineData.name}
              </div>

              <div className="text-xl text-gray-300 mb-1">{currentStation}에서</div>
              <div className="text-2xl font-bold mb-6" style={{ color: lineColor }}>
                {getDirectionLabel(direction)} 방향 다음 역은?
              </div>

              {/* Timer */}
              <div className={`flex justify-center mb-6 ${timeLeft <= 3 ? 'timer-pulse' : ''}`}>
                <svg viewBox="0 0 100 100" className="w-20 h-20">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#374151" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={timeLeft > 3 ? '#10B981' : '#EF4444'}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - timeLeft / 10)}
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s' }}
                  />
                  <text
                    x="50" y="54" textAnchor="middle" dominantBaseline="central"
                    fill={timeLeft > 3 ? 'white' : '#EF4444'}
                    fontSize="28" fontWeight="bold"
                  >
                    {Math.ceil(timeLeft)}
                  </text>
                </svg>
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={e => dispatch({ type: 'SET_INPUT', value: e.target.value })}
                  placeholder="역 이름을 입력하세요"
                  className="w-full text-center text-xl p-4 rounded-xl bg-gray-800
                    border-2 border-gray-600 focus:border-white focus:outline-none
                    transition-colors placeholder-gray-500"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  className="w-full p-4 rounded-xl text-lg font-bold transition-all
                    active:scale-95 hover:brightness-110"
                  style={{ backgroundColor: lineColor }}
                >
                  제출
                </button>
              </form>
            </div>
          )}

          {/* ===== RESULT ===== */}
          {phase === 'result' && (
            <div className="w-full text-center">
              {/* Red flash overlay on wrong */}
              {resultType === 'wrong' && !showMC && (
                <div
                  className="fixed inset-0 pointer-events-none z-50"
                  style={{ animation: 'flashRed 0.5s ease-out forwards' }}
                />
              )}

              {/* Correct */}
              {resultType === 'correct' && (
                <div className="pop-in">
                  <div className="text-7xl mb-4">🎉</div>
                  <div className="text-4xl font-black text-green-400 mb-3">정답!</div>
                  <div className="text-3xl font-bold text-white mb-2">{correctAnswer}</div>
                  <div key={`pts-${lastPoints}`} className="text-xl text-yellow-400 font-bold score-up">
                    +{lastPoints}점
                  </div>
                  {combo >= 3 && (
                    <div key={`combo-${combo}`} className="text-lg text-orange-400 mt-2 combo-pop">
                      🔥 {combo}콤보 ×{getComboMultiplier(combo)}
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

              {/* Multiple Choice */}
              {resultType === 'wrong' && showMC && (
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
                        <button
                          key={opt}
                          onClick={() => dispatch({ type: 'MC_SELECT', option: opt })}
                          disabled={!!mcResult}
                          className={`p-4 rounded-xl text-lg font-bold transition-all duration-200 ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {mcResult === 'correct' && (
                    <div className="mt-4 text-green-400 text-xl font-bold pop-in">
                      정답! +30점
                    </div>
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
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-600 text-xs mt-8 pb-4">
          서울 지하철 1~9호선 퀴즈
        </footer>
      </div>
    </div>
  );
}
