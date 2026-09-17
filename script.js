// --- DATA & STATE ---
let lives = 3;
let currentQuestion = 0;
let evasionCount = 0;
let secretClicks = 0;
let historyLog = [];

// Ẩn mật đạo: Ngăn click dâu tây lan ra ngoài icon
document.getElementById("secret-trigger").addEventListener("click", function(e) {
    e.stopPropagation(); 
    secretClicks++;
    if(secretClicks === 3) {
        showHistory();
        secretClicks = 0;
    }
});

const questions = [
    { type: 'choice', q: "1. Em có phải người anh thích nhất không?", opts: ["Đúng vậyyy", "Không!"], ans: 0, popT: "Vậy người xinh nhì, xinh ba là ai? 😡", popF: "Ê? 😡" },
    { type: 'choice', q: "2. Giờ em thành con gián anh có iu em hong?", opts: ["Yêu!!!!!!!!!!!!!!!!!!!", "Không!"], ans: 0, popT: "Sao anh để em biến thành con giản??? 😡", popF: "Alo???? 😡" },
    { type: 'choice', q: "3. Nếu anh có vợ rồi anh có quen em không?", opts: ["Có", "Không!"], ans: 0, popT: "Sao anh không cưới em? 😡", popF: "TUI GHÉC ANH!!! 😡" },
    { type: 'choice-text', q: "4. Nếu đang đi chơi với Ngọc thì có điện thoại từ Mai rồi Phương, gọi ai trước?", opts: ["Mai", "Phương", "Khác"], popT: "Đệ tui xem!!! 😡", popF: "TUI GHÉC ANH!!! 😡" },
    { type: 'choice', q: "5. Nếu em được đổi tên thành nyc của anh, anh có gọi không?", opts: ["Có", "Không!"], ans: 1, popT: "Sao anh còn nhớ tên nyc? 😡", popF: "TUI GHÉC ANH!!! 😡" },
    { type: 'text', q: "6. Miêu tả em bằng 3 từ.", popT: "Coi trừng tuiiii!!! 😡" },
    { type: 'text', q: "7. Nếu em không nói lời tạm biệt mà ngày càng xa anh, anh sẽ như thế nào?", popT: "Ghéc anh!!! 😡" },
    { type: 'text', q: "8. Có bao giờ em làm Hoàng buồn không? (TRẢ LỜI THẬT LÒNG!!!)", popT: "Ghéc anh!!! 😡" },
    { type: 'text', q: "9. Bạn nhớ điều gì ở em nhất nếu hai đứa không còn bên nhau?", popT: "Yêu anh!!! 😡" },
    { type: 'info', q: "10. Mong bạn mỗi ngày đều hạnh phúc! 🎉💙", popT: "" }
];

// --- NAVIGATION & MODALS ---
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showModal(text, visual = "😡", callback = null) {
    document.getElementById("popup-text").innerText = text;
    
    // Xử lý hiện ảnh nếu là gắp thú, hiện text emoji nếu là quiz
    if (visual.includes(".png") || visual.includes(".jpg")) {
        document.getElementById("popup-emoji").innerHTML = `<img src="${visual}" alt="sticker">`;
    } else {
        document.getElementById("popup-emoji").innerText = visual;
    }
    
    document.getElementById("popup-modal").style.display = "flex";
    document.getElementById("popup-modal").dataset.callback = callback ? callback.name : "";
}

function closePopup() {
    document.getElementById("popup-modal").style.display = "none";
    const cb = document.getElementById("popup-modal").dataset.callback;
    
    // Điều hướng các logic nút bấm
    if(cb === "goMenu") { lives = 3; showScreen("screen-menu"); }
    else if(cb === "startGame") { startGame(); }
    else if(cb === "firstQ") { loadQuestion(); } // Gọi thẳng vào câu 1
    else if(cb === "nextQ") { currentQuestion++; loadQuestion(); } // Sang câu tiếp theo
    else if(cb === "resetClaw") { resetClaw(); }
}

// --- GATEKEEPER ---
function startGatekeeper() {
    evasionCount = 0;
    document.getElementById("btn-yes").style.position = "static";
    document.getElementById("btn-no").style.display = "inline-block";
    showScreen("screen-gatekeeper");
}

function evadeButton(btn) {
    evasionCount++;
    if(evasionCount > 7) {
        showModal("Biết anh iu tui òi! Hihi", "🥰", startGame);
        return;
    }
    btn.style.position = "absolute";
    btn.style.top = Math.random() * 80 + "%";
    btn.style.left = Math.random() * 80 + "%";
}

function handleGatekeeperNo() {
    document.getElementById("btn-no").style.display = "none";
    showModal("AI CHO!!!! 😡 Tới số rồi!", "🤬", goMenu);
}

// --- QUIZ LOGIC ---
function goMenu() { showScreen("screen-menu"); }

function startGame() { 
    lives = 3; currentQuestion = 0; updateLives(); 
    showModal("Luật chơi: Anh có 3 mạng. Trả lời sai mất 1 mạng. Hết mạng chơi lại từ đầu!", "📜", firstQ); 
    showScreen("screen-quiz");
}

function firstQ() {} // Hàm giả định kích hoạt callback
function nextQ() {}  // Hàm giả định kích hoạt callback

function updateLives() {
    document.getElementById("lives-display").innerText = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
}

function shakeScreen() {
    const container = document.getElementById("main-container");
    container.classList.add("shake");
    setTimeout(() => container.classList.remove("shake"), 500);
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        unlockLevel2(); // Mở khóa ải 2
        showModal("Hoàn thành thử thách! Khá khen cho anh đó!", "🥳", goMenu);
        return;
    }
    let q = questions[currentQuestion];
    document.getElementById("quiz-question").innerText = q.q;
    let optionsHTML = "";

    if (q.type === 'choice') {
        q.opts.forEach((opt, idx) => {
            optionsHTML += `<button class="btn" onclick="checkChoice(${idx})">${opt}</button>`;
        });
    } else if (q.type === 'choice-text') {
        optionsHTML += `<button class="btn" onclick="wrongAnswer('${q.opts[0]}')">${q.opts[0]}</button>`;
        optionsHTML += `<button class="btn" onclick="wrongAnswer('${q.opts[1]}')">${q.opts[1]}</button>`;
        optionsHTML += `<button class="btn" onclick="showInputC()">Khác</button>`;
        optionsHTML += `<div id="input-c-div" style="display:none; margin-top:10px;">
                        <input type="text" id="ans-text-c" placeholder="Ghi rõ ra...">
                        <button class="btn green" onclick="submitTextC()">Gửi</button></div>`;
    } else if (q.type === 'text') {
        optionsHTML += `<input type="text" id="ans-text" placeholder="Trình bày đi...">
                        <button class="btn" onclick="submitText()">Gửi</button>`;
    } else if (q.type === 'info') {
        optionsHTML += `<button class="btn green" onclick="goMenu()">Quay lại Menu</button>`;
    }
    document.getElementById("quiz-options").innerHTML = optionsHTML;
}

function checkChoice(idx) {
    let q = questions[currentQuestion];
    logAnswer(q.q, q.opts[idx]);
    if(idx === q.ans) {
        event.target.classList.add("green");
        showModal(q.popT, "😡", nextQ);
    } else {
        wrongAnswer();
    }
}

function wrongAnswer(answeredText = "") {
    if(answeredText) logAnswer(questions[currentQuestion].q, answeredText);
    event.target.classList.add("red");
    shakeScreen();
    lives--;
    updateLives();
    if(lives <= 0) {
        showModal("HẾT MẠNG!!! QUAY LẠI TỪ ĐẦU NHA CON TRAI!", "☠️", goMenu);
    } else {
        showModal(questions[currentQuestion].popF, "😡");
    }
}

function showInputC() { document.getElementById("input-c-div").style.display = "block"; }
function submitTextC() {
    let text = document.getElementById("ans-text-c").value;
    if(!text) return;
    logAnswer(questions[currentQuestion].q, "Khác: " + text);
    showModal(questions[currentQuestion].popT, "😡", nextQ);
}

function submitText() {
    let text = document.getElementById("ans-text").value;
    if(!text) { alert("Nhập đàng hoàng vô!"); return; }
    logAnswer(questions[currentQuestion].q, text);
    showModal(questions[currentQuestion].popT, "😡", nextQ);
}

// --- ADMIN SECRET HISTORY ---
function logAnswer(question, answer) {
    historyLog.push(`<b>${question}</b><br>Hoàng đáp: <span style="color:#0288d1">${answer}</span>`);
}
function showHistory() {
    let html = "";
    if(historyLog.length === 0) html = "<p>Chưa có dữ liệu nào bị bắt quả tang...</p>";
    else html = historyLog.map(h => `<div class="history-item">${h}</div>`).join("");
    document.getElementById("history-content").innerHTML = html;
    document.getElementById("history-modal").style.display = "flex";
}
function closeHistory() { document.getElementById("history-modal").style.display = "none"; }


// --- LOGIC ẢI 2: MÁY GẮP THÚ ---
let level2Unlocked = false; 

function unlockLevel2() {
    level2Unlocked = true;
    document.getElementById("level-2-icon").style.filter = "none";
    document.getElementById("level-2-icon").style.opacity = "1";
    document.getElementById("level-2-icon").style.cursor = "pointer";
    document.getElementById("level-2-icon").classList.add("pulse");
    let text = document.getElementById("level-2-text");
    text.innerText = "Ải 2: Gắp quà!";
    text.style.color = "#0277bd";
}

function startLevel2() {
    if(!level2Unlocked) {
        showModal("Phải qua Ải 1 mới được gắp quà nhaaa!", "🔒", goMenu);
        return;
    }
    showScreen("screen-level2");
}

// Data của máy gắp (10 Hình ảnh & Thông báo)
const clawPrizes = [
    { file: "1.png", text: "thương anh lắm!" },
    { file: "2.png", text: "may mắn cả ngày nhaa bạn ơii" },
    { file: "3.png", text: "yêu anh" },
    { file: "4.png", text: "mỗi ngày đều mong anh hạnh phúc" },
    { file: "5.png", text: "Em ở đây!" },
    { file: "6.png", text: "Nhớ anh nhiều lắm" },
    { file: "7.png", text: "GHÉC ANHHHH" },
    { file: "8.png", text: "Yêu bản thân nhiều vào nhe chuaaaa" },
    { file: "9.png", text: "Mất lượt! Gắp lại đi lêu lêu!" },
    { file: "10.png", text: "Anh là số 1!" }
];

function playClaw() {
    const claw = document.getElementById("claw");
    const btn = document.getElementById("btn-gap");
    
    // Khóa nút
    btn.disabled = true;
    btn.innerText = "Đang gắp...";

    // Càng hạ xuống sát đáy
    claw.style.top = "150px";

    setTimeout(() => {
        // Càng kéo lên
        claw.style.top = "-15px";

        setTimeout(() => {
            // Random gắp 1 trong 10 ảnh
            let prize = clawPrizes[Math.floor(Math.random() * clawPrizes.length)];
            showModal(prize.text, prize.file, resetClaw);
        }, 1000); 

    }, 1200); 
}

function resetClaw() {
    const btn = document.getElementById("btn-gap");
    btn.disabled = false;
    btn.innerText = "Gắp ngay!";
}
