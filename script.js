let lives = 3;
let currentQuestion = 0;
let evasionCount = 0;
let secretClicks = 0;
let historyLog = [];

// Mật đạo Admin
document.getElementById("secret-trigger").addEventListener("click", function(e) {
    e.stopPropagation(); 
    secretClicks++;
    if(secretClicks === 3) { showHistory(); secretClicks = 0; }
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

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showModal(text, visual = "😡", callback = null) {
    document.getElementById("popup-text").innerText = text;
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
    if(cb === "goMenu") { lives = 3; showScreen("screen-menu"); }
    else if(cb === "startGame") { startGame(); }
    else if(cb === "firstQ") { loadQuestion(); } 
    else if(cb === "nextQ") { currentQuestion++; loadQuestion(); }
    else if(cb === "resetClaw") { resetClaw(); }
}

function startGatekeeper() {
    evasionCount = 0;
    document.getElementById("btn-yes").style.position = "static";
    document.getElementById("btn-no").style.display = "inline-block";
    showScreen("screen-gatekeeper");
}

function evadeButton(btn) {
    evasionCount++;
    if(evasionCount > 7) { showModal("Biết anh iu tui òi! Hihi", "😋", startGame); return; }
    btn.style.position = "absolute";
    btn.style.top = Math.random() * 80 + "%";
    btn.style.left = Math.random() * 80 + "%";
}

function handleGatekeeperNo() {
    document.getElementById("btn-no").style.display = "none";
    showModal("AI CHO!!!! 😡 Tới số rồi!", "🤬", goMenu);
}

function goMenu() { showScreen("screen-menu"); }
function startGame() { 
    lives = 3; currentQuestion = 0; updateLives(); 
    showModal("Luật chơi: Anh có 3 mạng. Trả lời sai mất 1 mạng. Hết mạng chơi lại từ đầu!", "📜", firstQ); 
    showScreen("screen-quiz");
}
function firstQ() {} function nextQ() {}  

function updateLives() { document.getElementById("lives-display").innerText = "❤️".repeat(lives) + "🖤".repeat(3 - lives); }
function shakeScreen() {
    const container = document.getElementById("main-container");
    container.classList.add("shake");
    setTimeout(() => container.classList.remove("shake"), 500);
}

function loadQuestion() {
    if (currentQuestion >= questions.length) { return; }
    let q = questions[currentQuestion];
    document.getElementById("quiz-question").innerText = q.q;
    let optionsHTML = "";

    if (q.type === 'choice') {
        q.opts.forEach((opt, idx) => { optionsHTML += `<button class="btn" onclick="checkChoice(${idx})">${opt}</button>`; });
    } else if (q.type === 'choice-text') {
        optionsHTML += `<button class="btn" onclick="wrongAnswer('${q.opts[0]}')">${q.opts[0]}</button>`;
        optionsHTML += `<button class="btn" onclick="wrongAnswer('${q.opts[1]}')">${q.opts[1]}</button>`;
        optionsHTML += `<button class="btn" onclick="showInputC()">Khác</button>`;
        optionsHTML += `<div id="input-c-div" style="display:none; margin-top:10px;"><input type="text" id="ans-text-c" placeholder="Ghi rõ ra..."><button class="btn green" onclick="submitTextC()">Gửi</button></div>`;
    } else if (q.type === 'text') {
        optionsHTML += `<input type="text" id="ans-text" placeholder="Phại nói thiệt lòng đóo..."><button class="btn" onclick="submitText()">Gửi</button>`;
    } else if (q.type === 'info') {
        optionsHTML += `<button class="btn green" onclick="finishLevel1()">Hoàn thành Ải 1!</button>`;
    }
    document.getElementById("quiz-options").innerHTML = optionsHTML;
}

function finishLevel1() {
    unlockNextLevels(); 
    showModal("Hoàn thành thử thách! Giỏiii hế!", "🥳", goMenu);
}

function checkChoice(idx) {
    let q = questions[currentQuestion]; logAnswer(q.q, q.opts[idx]);
    if(idx === q.ans) { event.target.classList.add("green"); showModal(q.popT, "😡", nextQ); } 
    else { wrongAnswer(); }
}
function wrongAnswer(answeredText = "") {
    if(answeredText) logAnswer(questions[currentQuestion].q, answeredText);
    event.target.classList.add("red"); shakeScreen(); lives--; updateLives();
    if(lives <= 0) { showModal("HẾT MẠNG!!! QUAY LẠI TỪ ĐẦU LIỀN!!!", "☠️", goMenu); } 
    else { showModal(questions[currentQuestion].popF, "😡"); }
}

function showInputC() { document.getElementById("input-c-div").style.display = "block"; }
function submitTextC() {
    let text = document.getElementById("ans-text-c").value; if(!text) return;
    logAnswer(questions[currentQuestion].q, "Khác: " + text); showModal(questions[currentQuestion].popT, "😡", nextQ);
}
function submitText() {
    let text = document.getElementById("ans-text").value; if(!text) { alert("Nhập đàng hoàng vô!"); return; }
    logAnswer(questions[currentQuestion].q, text); showModal(questions[currentQuestion].popT, "😡", nextQ);
}

function logAnswer(question, answer) { historyLog.push(`<b>${question}</b><br>Hoàng đáp: <span style="color:#0288d1">${answer}</span>`); }
function showHistory() {
    let html = (historyLog.length === 0) ? "<p>Chưa có dữ liệu nào bị bắt quả tang...</p>" : historyLog.map(h => `<div class="history-item" style="padding:10px;">${h}</div>`).join("");
    document.getElementById("history-content").innerHTML = html; document.getElementById("history-modal").style.display = "flex";
}
function closeHistory() { document.getElementById("history-modal").style.display = "none"; }


// --- LOGIC MỞ KHÓA ẢI 2 VÀ ẢI 3 ---
let levelsUnlocked = false; 

function unlockNextLevels() {
    levelsUnlocked = true;
    
    let l2 = document.getElementById("level-2-icon");
    l2.style.filter = "none"; l2.style.opacity = "1"; l2.style.cursor = "pointer"; l2.classList.add("pulse");
    document.getElementById("level-2-text").innerText = "Ải 2: Gắp quà!";
    document.getElementById("level-2-text").style.color = "#0277bd";
    
    let l3 = document.getElementById("level-3-icon");
    l3.style.filter = "none"; l3.style.opacity = "1"; l3.style.cursor = "pointer"; l3.classList.add("pulse");
    document.getElementById("level-3-text").innerText = "Ải 3: Mở thư!";
    document.getElementById("level-3-text").style.color = "#0277bd";
}

// --- LOGIC ẢI 2: MÁY GẮP THÚ ---
function startLevel2() {
    if(!levelsUnlocked) { showModal("Phải qua Ải 1 mới được gắp quà nhaaa!", "🔒", goMenu); return; }
    showScreen("screen-level2");
}

const clawPrizes = [
    { file: "1.png", text: "thương anh lắm!" },
    { file: "2.png", text: "may mắn cả ngày nhaa bạn ơii" },
    { file: "3.png", text: "yêu anh" },
    { file: "4.png", text: "mỗi ngày đều mong anh hạnh phúc" },
    { file: "5.png", text: "Em nhớ anh lắmmm" },
    { file: "6.png", text: "ĂN ĐẦY ĐỦ KHÔNG ĐÓ!!!!" },
    { file: "7.png", text: "Nhớ em hông? 😡" },
    { file: "8.png", text: "Em ở đây với anh mà!" },
    { file: "9.png", text: "Mất lượt! Gắp lại đi lêu lêu!" },
    { file: "10.png", text: "Anh là số 1!" },
    { file: "11.png", text: "Ai làm anh buồn thì chan người đó luôn!!!" },
    { file: "12.png", text: "Em thương anh nhiều lắm" },
    { file: "13.png", text: "Anh ngoan nhất!" },
    { file: "14.png", text: "Yêu bản thân nhiều lên rồi mới được thương em" },
    { file: "15.png", text: "Hôm nay anh đẹp trai lắm!" },
    { file: "16.png", text: "Meo Meo" },
    { file: "17.png", text: "Nghỉ ngơi nhiều 1 chút!" },
    { file: "18.png", text: "Chưa nhớ tui hả???" },
    { file: "19.png", text: "Hình như nay chưa có người nói yêu Dâu hay sao í" },
    { file: "20.png", text: "Đừng tủi thân 1 mình nha (em lo lắm) " }
];

function triggerFireworks() {
    if (typeof confetti === "function") {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#ffb7b2', '#e2f0cb', '#b5ead7', '#c7ceea', '#ff9aa2'] });
    }
}

function playClaw() {
    const claw = document.getElementById("claw");
    const btn = document.getElementById("btn-gap");
    btn.disabled = true;
    btn.innerText = "Đang gắp...";

    claw.style.top = "110px";

    setTimeout(() => {
        claw.style.top = "-15px";

        setTimeout(() => {
            let prize = clawPrizes[Math.floor(Math.random() * clawPrizes.length)];
            showModal(prize.text, prize.file, resetClaw);
            triggerFireworks();
        }, 1000); 

    }, 1200); 
}

function resetClaw() {
    const btn = document.getElementById("btn-gap");
    btn.disabled = false;
    btn.innerText = "Gắp ngay!";
}

// --- LOGIC ẢI 3: GỬI THƯ (BẢO MẬT PASSWORD) ---
function startLevel3() {
    if(!levelsUnlocked) { showModal("Phải qua Ải 1 mới được mở thư nhaaa!", "🔒", goMenu); return; }
    
    // Reset lại màn hình nhập pass mỗi khi vào lại
    document.getElementById("password-area").style.display = "block";
    document.getElementById("envelope-container").style.display = "none";
    document.getElementById("letter-content").style.display = "none";
    document.getElementById("btn-send-letter").style.display = "none";
    document.getElementById("hoang-reply").value = "";
    document.getElementById("letter-password").value = "";
    document.getElementById("level3-subtitle").innerText = "Tụi mìn kỷ niệm ngày nào ấy nhỉiii";
    document.getElementById("level3-subtitle").style.color = "#0288d1";
    
    showScreen("screen-level3");
}

function checkPassword() {
    let pass = document.getElementById("letter-password").value.trim();
    
    // Chấp nhận nhiều kiểu nhập ngày 18/6
    if (pass === "18/6" || pass === "18/06" || pass === "18-6" || pass === "18-06") {
        document.getElementById("password-area").style.display = "none";
        document.getElementById("level3-subtitle").innerText = "Mật khẩu chính xác!";
        document.getElementById("level3-subtitle").style.color = "#43a047"; // Đổi màu xanh lá
        document.getElementById("envelope-container").style.display = "block";
        
        // Khôi phục lại icon phong bì ban đầu
        document.getElementById("envelope-container").innerText = "✉️";
        document.getElementById("envelope-container").style.fontSize = "100px";
        document.getElementById("envelope-container").classList.add("pulse");
        document.getElementById("envelope-container").onclick = openLetter;
        
        showModal("Ting ting! Giỏiii hế", "🥳");
    } else {
        shakeScreen(); // Rung màn hình khi sai
        showModal("Sai bét! Ngày quan trọng mà cũng quên hả???", "😡");
    }
}

function openLetter() {
    document.getElementById("envelope-container").innerText = "💌";
    document.getElementById("envelope-container").style.fontSize = "70px"; 
    document.getElementById("envelope-container").classList.remove("pulse");
    document.getElementById("envelope-container").onclick = null; 
    
    document.getElementById("letter-content").style.display = "block";
    document.getElementById("btn-send-letter").style.display = "inline-block";
    
    triggerFireworks();
}

function sendReply() {
    let reply = document.getElementById("hoang-reply").value;
    if(!reply.trim()) {
        showModal("Hăm gửi cũng hăm saoo", "😡");
        return;
    }
    
    // Lưu thư trả lời vào lịch sử bí mật
    historyLog.push(`<b>💌 THƯ PHẢN HỒI TỪ HOÀNG:</b><br><span style="color:#d84315; font-style: italic;">"${reply}"</span>`);
    
    showModal("Đã nhận được tâm thư của anh! Yêu anh! 💙", "🥰", goMenu);
}
