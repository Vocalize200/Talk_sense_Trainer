// HTML 요소들을 가져옵니다.
const trainingSelector = document.getElementById('training-selector');
const trainingGround = document.getElementById('training-ground');

// 단어 데이터를 저장할 변수
let wordsData = {};

// 1. words.json 파일 비동기적으로 불러오기
async function loadWords() {
    try {
        const response = await fetch('data/words.json');
        wordsData = await response.json();
        console.log('단어 데이터 로드 완료!');
    } catch (error) {
        console.error('단어 데이터 로드 실패:', error);
        trainingGround.innerHTML = '<p>단어 데이터를 불러오는 데 실패했습니다. 파일을 확인해주세요.</p>';
    }
}

// 2. 랜덤 단어 뽑는 헬퍼 함수
function getRandomWord(type) {
    if (!wordsData[type] || wordsData[type].length === 0) {
        return "단어없음";
    }
    const words = wordsData[type];
    return words[Math.floor(Math.random() * words.length)];
}


// 3. 훈련 선택 버튼에 이벤트 리스너 추가
trainingSelector.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const trainingType = e.target.dataset.training;
        switch (trainingType) {
            case '1':
                setupTraining1();
                break;
            case '2':
                setupTraining2();
                break;
            case '3':
                setupTraining3();
                break;
        }
    }
});

// 타이머 변수 (전역으로 관리하여 중지 가능하게)
let timerInterval;

// 타이머 함수
function startTimer(duration, displayElement, onComplete) {
    let timer = duration;
    displayElement.textContent = timer;
    
    clearInterval(timerInterval); // 기존 타이머가 있다면 중지

    timerInterval = setInterval(() => {
        timer--;
        displayElement.textContent = timer;
        if (timer <= 0) {
            clearInterval(timerInterval);
            if (onComplete) onComplete(); // 타이머 종료 후 실행할 콜백 함수
        }
    }, 1000);
}


// --- 각 훈련별 설정 함수 ---

// 훈련 1: 유사성, 차이점 찾기
function setupTraining1() {
    let round = 1;
    const totalRounds = 20;

    function nextRound() {
        if (round > totalRounds) {
            trainingGround.innerHTML = `<h2>훈련 1 완료! (총 20회)</h2><p>수고하셨습니다. 창의력이 한층 상승했습니다!</p>`;
            return;
        }

        const word1 = getRandomWord('nouns');
        const word2 = getRandomWord('nouns');

        trainingGround.innerHTML = `
            <h2>훈련 1: 유사성/차이점 찾기 (${round}/${totalRounds})</h2>
            <div class="word-display">${word1} vs ${word2}</div>
            <p class="instructions" id="instruction">아래 버튼을 눌러 시작하세요.</p>
            <div class="timer" id="timer-display">60</div>
            <button class="btn start-btn" id="start-btn">시작</button>
        `;

        const startBtn = document.getElementById('start-btn');
        const instruction = document.getElementById('instruction');
        const timerDisplay = document.getElementById('timer-display');

        startBtn.addEventListener('click', () => {
            startBtn.style.display = 'none'; // 시작 버튼 숨기기
            instruction.textContent = '두 단어의 [공통점]을 30초간 말하세요!';
            startTimer(30, timerDisplay, () => {
                // 30초 후 차이점 훈련 시작
                instruction.textContent = '두 단어의 [차이점]을 30초간 말하세요!';
                startTimer(30, timerDisplay, () => {
                    // 1분 훈련 종료 후 다음 라운드 준비
                    round++;
                    nextRound();
                });
            });
        });
    }
    nextRound();
}

// 훈련 2: A보다 B가 좋은 점
function setupTraining2() {
    let set = 1;
    const totalSets = 5;

    function nextSet() {
        if (set > totalSets) {
            trainingGround.innerHTML = `<h2>훈련 2 완료! (총 5세트)</h2><p>수고하셨습니다. 이제 어떤 것이든 옹호할 수 있습니다!</p>`;
            return;
        }

        const wordA = getRandomWord('nouns');
        const wordB = getRandomWord('nouns');

        trainingGround.innerHTML = `
            <h2>훈련 2: A vs B (${set}/${totalSets})</h2>
            <div class="word-display">${wordA} vs ${wordB}</div>
            <p class="instructions" id="instruction">준비되셨나요?</p>
            <div class="timer" id="timer-display">60</div>
            <button class="btn start-btn" id="start-btn">시작</button>
        `;

        const startBtn = document.getElementById('start-btn');
        const instruction = document.getElementById('instruction');
        const timerDisplay = document.getElementById('timer-display');
        const wordDisplay = document.querySelector('.word-display');

        startBtn.addEventListener('click', () => {
            startBtn.style.display = 'none';
            instruction.textContent = `[${wordA}](이)가 [${wordB}](이)보다 나은 점을 1분간 말하세요!`;
            wordDisplay.textContent = `${wordA} > ${wordB}`;
            
            startTimer(60, timerDisplay, () => {
                instruction.textContent = `[${wordB}](이)가 [${wordA}](이)보다 나은 점을 1분간 말하세요!`;
                wordDisplay.textContent = `${wordB} > ${wordA}`;
                
                startTimer(60, timerDisplay, () => {
                    set++;
                    nextSet();
                });
            });
        });
    }
    nextSet();
}


// 훈련 3: "A"가 "B"라면?
function setupTraining3() {
    const wordA = getRandomWord('nouns');
    const wordTypeB = ['nouns', 'verbs', 'adjectives'][Math.floor(Math.random() * 3)];
    const wordB = getRandomWord(wordTypeB);

    trainingGround.innerHTML = `
        <h2>훈련 3: "A"가 "B"라면?</h2>
        <div class="word-display">"${wordA}"(이)가 "${wordB}"라면?</div>
        <p class="instructions">꼬리에 꼬리를 물고 이야기를 이어가세요. <br>타이머는 스스로 시간을 재는 용도입니다.</p>
        <div class="timer" id="timer-display">0</div>
        <button class="btn start-btn" id="start-stop-btn">시작</button>
        <button class="btn" id="next-topic-btn">다른 주제</button>
    `;

    const startStopBtn = document.getElementById('start-stop-btn');
    const nextTopicBtn = document.getElementById('next-topic-btn');
    const timerDisplay = document.getElementById('timer-display');
    let isRunning = false;
    let seconds = 0;

    startStopBtn.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            startStopBtn.textContent = '중지';
            startStopBtn.style.backgroundColor = 'var(--secondary-color)';
            timerInterval = setInterval(() => {
                seconds++;
                timerDisplay.textContent = seconds;
            }, 1000);
        } else {
            isRunning = false;
            startStopBtn.textContent = '다시 시작';
            startStopBtn.style.backgroundColor = '#4CAF50';
            clearInterval(timerInterval);
        }
    });

    nextTopicBtn.addEventListener('click', setupTraining3); // 새 주제 버튼 클릭 시 함수 재실행
}


// 페이지가 처음 로드될 때 단어 데이터를 불러옵니다.
loadWords();