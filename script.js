let lives = 3;
let currentQuestionIndex = 0;
let evasionCount = 0;
let secretClicks = 0;
let historyLog = [];
let q14WrongCount = 0; // Đếm số lần sai câu Hóa Học
let currentQuizList = []; // Chứa 10 câu hỏi của lượt chơi hiện tại
let currentOptC = {}; // Lưu trữ dữ liệu khi chọn đáp án C

// --- ÂM THANH ---
const soundTada = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_success_fanfare.ogg');
const soundWrong = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');

function playSound(type) {
    try {
        if(type === 'tada') soundTada.play();
        if(type === 'wrong') soundWrong.play();
    } catch(e) {} // Bỏ qua nếu trình duyệt chặn tự phát âm thanh
}

function triggerFireworks() {
    if (typeof confetti === "function") {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#ffb7b2', '#e2f0cb', '#b5ead7', '#c7ceea', '#ff9aa2'] });
    }
}

// Mật đạo Admin
document.getElementById("secret-trigger").addEventListener("click", function(e) {
    e.stopPropagation(); 
    secretClicks++;
    if(secretClicks === 3) { showHistory(); secretClicks = 0; }
});

// --- DATA CÂU HỎI MỚI (TỪ 1 ĐẾN 15) ---
const dbMC = [
    { id: "q1", type: "mc", q: "Em có phải người anh thích nhất không?", opts: [
        { t: "Đúng vậyyy", act: "right", pT: "Vậy người xinh nhì, xinh ba là ai?", e: "😡" },
        { t: "Không!", act: "wrong", pF: "Ê?", e: "😡" }
    ]},
    { id: "q2", type: "mc", q: "Giờ em thành con gián anh có iu em hong?", opts: [
        { t: "Yêu!!!!!!!!!!!!!!!!!!!", act: "right", pT: "Sao anh để em biến thành con giản???", e: "😡" },
        { t: "Không!", act: "wrong", pF: "Alo????", e: "😡" }
    ]},
    { id: "q3", type: "mc", q: "Nếu anh có vợ rồi anh có quen em không?", opts: [
        { t: "Có", act: "right", pT: "Sao anh không cưới em?", e: "😡" },
        { t: "Không!", act: "wrong", pF: "TUI GHÉC ANH!!!", e: "😡" }
    ]},
    { id: "q4", type: "mc", q: "Nếu anh đang đi chơi với Ngọc thì có điện thoại từ Mai rồi tới Phương vậy anh sẽ gọi lại cho ai trước?", opts: [
        { t: "Mai", act: "wrong", pF: "TUI GHÉC ANH!!!", e: "😡" },
        { t: "Phương", act: "wrong", pF: "TUI GHÉC ANH!!!", e: "😡" },
        { t: "Khác", act: "input", pT: "Đệ tui xem!!!", e: "😡" }
    ]},
    { id: "q5", type: "mc", q: "Nếu em được đổi tên thành người yêu cũ của anh, anh có gọi không?", opts: [
        { t: "Có", act: "wrong", pF: "TUI GHÉC ANH!!!", e: "😡" },
        { t: "Không!", act: "right", pT: "sao anh còn nhớ tên nyc?", e: "😡" }
    ]},
    { id: "q10", type: "mc", q: "Nếu mình chia tay anh có làm bạn với em không?", opts: [
        { t: "Không", act: "wrong", pF: "TUI GHÉC ANH!!!", e: "😡" },
        { t: "Có", act: "wrong", pF: "TUI GHÉC ANH!!!", e: "😡" },
        { t: "Khác", act: "input", pT: "Anh đó nka!!!", e: "😡" }
    ]},
    { id: "q11", type: "mc", q: "Nếu em là người ngoài hành tinh, anh là con người, anh có giấu em khỏi mọi người không?", opts: [
        { t: "Không", act: "right", pT: "Á Đù??? Anh tày rồi!", e: "😡" },
        { t: "Có", act: "right", pT: "Mìnk khó công khai vậy hỏ ank???", e: "😡" },
        { t: "Khác", act: "input", pT: "Đệ tui xem ank nói rì!!!!", e: "😡" }
    ]},
    { id: "q12", type: "mc", q: "Ngoài nyc thì anh còn iu ai nữa không?", opts: [
        { t: "Không", act: "right", pT: "Sao anh có nyc?????????", e: "😡" },
        { t: "Có", act: "right", pT: "???", e: "😡" },
        { t: "Khác", act: "input", pT: "Đệ tui xem ank nói rì!!!!", e: "😡" }
    ]},
    { id: "q13", type: "mc", q: "Hoàng có 3 250 chiếc sticker. Hoàng cho Dâu 1 444 chiếc. Hỏi Hoàng còn lại bao nhiêu chiếc?", opts: [
        { t: "1806 chiếc", act: "right", pT: "Giỏi héeeee", e: "🥰" },
        { t: "1860 chiếc", act: "wrong", pF: "??????", e: "😡" },
        { t: "0 chiếc", act: "input", pT: "Yêu hế", e: "💖" }
    ]}
];

const dbText = [
    { id: "q6", type: "text", q: "Miêu tả em bằng 3 từ.", pT: "Coi trừng tuiiii!!!", e: "😡" },
    { id: "q7", type: "text", q: "Nếu em không nói lời tạm biệt mà ngày càng xa anh, anh sẽ như thế nào?", pT: "Ghéc anh!!!", e: "😡" },
    { id: "q8", type: "text", q: "Có bao giờ em làm Hoàng buồn không? (TRẢ LỜI THẬT LÒNG!!!)", pT: "Ghéc anh!!!", e: "😡" },
    { id: "q9", type: "text", q: "Bạn sẽ nhớ điều gì ở em nhất nếu hai đứa không còn bên nhau?", pT: "Yêu anh!!!", e: "💖" },
    { id: "q14", type: "text_custom", q: "Biết rằng mỗi số trong dãy là nguyên tử khối của một nguyên tố. Hãy xác định nguyên tố tương ứng, sau đó ghép kí hiệu hóa học của chúng theo thứ tự: 165 – 108 – 14" },
    { id: "q15", type: "text_custom", q: "Dâu sử dụng một thiết bị điện có công suất 301 W trong 6 giờ. Hỏi thiết bị đã tiêu thụ bao nhiêu điện năng?" }
];

const q16 = { id: "q16", type: "final", q: "Mong bạn mỗi ngày đều hạnh phúc! 💙" };

// --- HỆ THỐNG ĐIỀU CHUYỂN MÀN HÌNH ---
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
    else if(cb === "nextQ") { currentQuestionIndex++; loadQuestion(); }
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
    if(evasionCount > 9) { showModal("Biết anh iu tui òi! Hihi", "🥰", startGame); return; }
    btn.style.position = "absolute";
    btn.style.top = Math.random() * 80 + "%";
    btn.style.left = Math.random() * 80 + "%";
}

function handleGatekeeperNo() {
    document.getElementById("btn-no").style.display = "none";
    showModal("AI CHO!!!! 😡 Tới số rồi!", "🤬", goMenu);
}

// --- KHỞI TẠO ẢI 1 (RANDOM CÂU HỎI) ---
function goMenu() { showScreen("screen-menu"); }
function startGame() { 
    lives = 3; currentQuestionIndex = 0; q14WrongCount = 0; updateLives(); 
    
    let shuffledMC = [...dbMC].sort(() => 0.5 - Math.random());
    
    // Tách riêng câu "Có bao giờ em làm Hoàng buồn không?" (q8) ra để bắt buộc thêm vào
    let fixedQ8 = dbText.find(q => q.id === "q8");
    let remainingText = dbText.filter(q => q.id !== "q8").sort(() => 0.5 - Math.random());
    
    let numMC = Math.floor(Math.random() * 3) + 3; // 3 đến 5 câu Trắc nghiệm
    let selectedMC = shuffledMC.slice(0, numMC);
    
    let numText = 9 - numMC; // Số câu tự luận cần lấy
    // Gom câu q8 cố định và lấy thêm các câu tự luận khác cho đủ số lượng
    let selectedText = [fixedQ8, ...remainingText.slice(0, numText - 1)];
    
    // Gộp Trắc nghiệm và Tự luận, sau đó xáo trộn ngẫu nhiên để Q8 nằm ở vị trí bất kỳ
    currentQuizList = [...selectedMC, ...selectedText].sort(() => 0.5 - Math.random());
    currentQuizList.push(q16); // Luôn để câu chúc chốt sổ cuối cùng (Câu số 10)

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

// --- RENDER CÂU HỎI ---
function loadQuestion() {
    if (currentQuestionIndex >= currentQuizList.length) return;
    
    // Ẩn khung C
    document.getElementById("input-c-div").style.display = "none";
    document.getElementById("quiz-options").style.display = "block";

    let q = currentQuizList[currentQuestionIndex];
    document.getElementById("quiz-question").innerText = `Câu ${currentQuestionIndex + 1}: ${q.q}`;
    let optionsHTML = "";

    if (q.type === 'mc') {
        q.opts.forEach((opt, idx) => { 
            // Dùng nháy đơn bao bọc chuỗi JSON để truyền vào hàm
            let optData = JSON.stringify(opt).replace(/'/g, "\\'"); 
            optionsHTML += `<button class="btn" onclick='checkChoice(${idx}, ${optData}, this)'>${opt.t}</button>`; 
        });
    } else if (q.type === 'text' || q.type === 'text_custom') {
        optionsHTML += `<input type="text" id="ans-text" placeholder="...........">
                        <button class="btn green" onclick="submitText()">Gửi đi!</button>`;
    } else if (q.type === 'final') { // Câu 16
        triggerFireworks();
        playSound('tada');
        optionsHTML += `<button class="btn green" onclick="finishLevel1()">Hoàn thành Ải 1!</button>`;
    }
    document.getElementById("quiz-options").innerHTML = optionsHTML;
}

function finishLevel1() {
    unlockNextLevels(); 
    showModal("Hoàn thành thử thách!", "🥳", goMenu);
}

// --- KIỂM TRA TRẮC NGHIỆM ---
function checkChoice(idx, opt, btnEl) {
    let q = currentQuizList[currentQuestionIndex];
    logAnswer(q.q, opt.t);

    if (opt.act === 'right') {
        playSound('tada');
        triggerFireworks();
        btnEl.classList.add("green");
        showModal(opt.pT, opt.e, nextQ);
    } 
    else if (opt.act === 'wrong') {
        playSound('wrong');
        btnEl.classList.add("red");
        shakeScreen();
        lives--;
        updateLives();
        if(lives <= 0) { showModal("HẾT MẠNG!!! LÊU LÊU", "☠️", goMenu); } 
        else { showModal(opt.pF, opt.e); }
    } 
    else if (opt.act === 'input') {
        // Mở khung điền chữ
        currentOptC = opt; // Lưu lại để dùng popup
        document.getElementById("quiz-options").style.display = "none";
        document.getElementById("input-c-div").style.display = "block";
    }
}

function submitTextC() {
    let text = document.getElementById("ans-text-c").value; 
    if(!text) return;
    let q = currentQuizList[currentQuestionIndex];
    logAnswer(q.q, `[Khác] ${text}`);
    playSound('tada');
    triggerFireworks();
    showModal(currentOptC.pT, currentOptC.e, nextQ);
    document.getElementById("ans-text-c").value = "";
}

// --- KIỂM TRA ĐIỀN CHỮ CHUNG & CÂU HÓA/TOÁN ---
function submitText() {
    let val = document.getElementById("ans-text").value; 
    if(!val) { alert("Nhập đàng hoàng vô!"); return; }
    
    let q = currentQuizList[currentQuestionIndex];
    logAnswer(q.q, val);

    // Xử lý Hóa Học (Q14)
    if (q.id === "q14") {
        let v = val.toLowerCase().replace(/\s/g, '');
        // Xóa dấu tiếng việt
        let unaccented = v.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
        
        // Điều kiện: Bắt đầu bằng 'ho' VÀ có kí tự của Bạc(ag/a/g) VÀ Nito(n/ng)
        if (unaccented.startsWith('ho') && unaccented.length >= 4 && (unaccented.includes('a') || unaccented.includes('g')) && unaccented.includes('n')) {
            playSound('tada'); triggerFireworks();
            showModal("Yêu anh!!!", "💖", nextQ);
        } else {
            playSound('wrong'); shakeScreen(); lives--; updateLives();
            q14WrongCount++;
            if(lives <= 0) { showModal("HẾT MẠNG! HOÀNG OUT!!!", "☠️", goMenu); return; }
            
            if (q14WrongCount === 2) {
                showModal("Gợi ý: được phép tách các nguyên tố và tùy chỉnh thứ tự - liên quan đến ank á!!!!!!", "🥺");
            } else {
                showModal("Cố nhênnn", "💪");
            }
        }
    } 
    // Xử lý Toán Học (Q15)
    else if (q.id === "q15") {
        if (val.trim() === "1806") {
            playSound('tada'); triggerFireworks();
            showModal("Dữ dị chàiii", "💖", nextQ);
        } else {
            playSound('wrong'); shakeScreen(); lives--; updateLives();
            if(lives <= 0) { showModal("HẾT MẠNG!!! HOÀNG OUT!", "☠️", goMenu); } 
            else { showModal("Cố nhênnn", "💪"); }
        }
    } 
    // Các câu Text bình thường
    else {
        playSound('tada'); triggerFireworks();
        showModal(q.pT, q.e, nextQ);
    }
}

function logAnswer(question, answer) { historyLog.push(`<b>${question}</b><br>Hoàng đáp: <span style="color:#0288d1">${answer}</span>`); }
function showHistory() {
    let html = (historyLog.length === 0) ? "<p>Tò mò quó...</p>" : historyLog.map(h => `<div class="history-item" style="padding:10px;">${h}</div>`).join("");
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

function playClaw() {
    const claw = document.getElementById("claw");
    const btn = document.getElementById("btn-gap");
    btn.disabled = true; btn.innerText = "Đang gắp...";
    claw.style.top = "110px";
    setTimeout(() => {
        claw.style.top = "-15px";
        setTimeout(() => {
            let prize = clawPrizes[Math.floor(Math.random() * clawPrizes.length)];
            showModal(prize.text, prize.file, resetClaw);
            playSound('tada'); triggerFireworks();
        }, 1000); 
    }, 1200); 
}
function resetClaw() { const btn = document.getElementById("btn-gap"); btn.disabled = false; btn.innerText = "Gắp ngay!"; }

// --- LOGIC ẢI 3: GỬI THƯ (BẢO MẬT PASSWORD) ---
function startLevel3() {
    if(!levelsUnlocked) { showModal("Phải qua Ải 1 mới được mở thư nhaaa!", "🔒", goMenu); return; }
    document.getElementById("password-area").style.display = "block";
    document.getElementById("envelope-container").style.display = "none";
    document.getElementById("letter-content").style.display = "none";
    document.getElementById("btn-send-letter").style.display = "none";
    document.getElementById("hoang-reply").value = "";
    document.getElementById("letter-password").value = "";
    document.getElementById("level3-subtitle").innerText = "Kỷ niệm đầu tiên cụa tui mình là ngày, tháng nào ấy nhỉiiii";
    document.getElementById("level3-subtitle").style.color = "#0288d1";
    showScreen("screen-level3");
}

function checkPassword() {
    let pass = document.getElementById("letter-password").value.trim();
    if (pass === "18/6" || pass === "18/06" || pass === "18-6" || pass === "18-06") {
        document.getElementById("password-area").style.display = "none";
        document.getElementById("level3-subtitle").innerText = "Mật khẩu chính xác!";
        document.getElementById("level3-subtitle").style.color = "#43a047";
        document.getElementById("envelope-container").style.display = "block";
        document.getElementById("envelope-container").innerText = "✉️";
        document.getElementById("envelope-container").style.fontSize = "100px";
        document.getElementById("envelope-container").classList.add("pulse");
        document.getElementById("envelope-container").onclick = openLetter;
        playSound('tada'); triggerFireworks();
        showModal("Ting ting! Giỏi héeee", "🥳");
    } else {
        playSound('wrong'); shakeScreen(); showModal("Sai bét! Ngày quan trọng mà cũng quên hả???", "😡");
    }
}

function openLetter() {
    document.getElementById("envelope-container").innerText = "💌";
    document.getElementById("envelope-container").style.fontSize = "70px"; 
    document.getElementById("envelope-container").classList.remove("pulse");
    document.getElementById("envelope-container").onclick = null; 
    document.getElementById("letter-content").style.display = "block";
    document.getElementById("btn-send-letter").style.display = "inline-block";
    playSound('tada'); triggerFireworks();
}

function sendReply() {
    let reply = document.getElementById("hoang-reply").value;
    if(!reply.trim()) { playSound('wrong'); showModal("Hăm gửi cũng hăm saooo, iu nhắmm", "💙"); return; }
    historyLog.push(`<b>💌 THƯ PHẢN HỒI TỪ HOÀNG:</b><br><span style="color:#d84315; font-style: italic;">"${reply}"</span>`);
    playSound('tada'); triggerFireworks();
    showModal("Đã nhận được thư cụa anh! Yêu anh! 💙", "🥰", goMenu);
}
