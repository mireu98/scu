const serviceName = "GameHub";
let isSubscribed = false;
let submitCount = 0;
let subscriberEmail = "";

function makeSubscribeMessage(email, subscribe) {
    if (subscribe) {
        return email + "로 신청이 완료되었습니다.";
    }
    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribe-button");
const subscribeMessage = document.querySelector("#subscribe-message");

function handleSubscribe(event) {
    event.preventDefault();

    const subscriberEmail = emailInput.value.trim();
    if (subscriberEmail === "") {
        subscribeMessage.textContent = "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount++;
    subscribeMessage.textContent = makeSubscribeMessage(subscriberEmail, isSubscribed);
    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
    const isDark = document.body.classList.toggle("dark");
    themeButton.textContent = isDark ? "라이트 모드" : "다크 모드";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput() {
    const maxLength = nicknameInput.maxLength;
    const currentLength = Math.min(nicknameInput.value.length, maxLength);
    nicknameCount.textContent = currentLength + " / 10";
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    const agreed = agreeCheck.checked;

    startButton.disabled = !agreed;
    agreeMessage.textContent = agreed ? "참여할 수 있습니다." : "동의 후 참여할 수 있습니다.";

    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });
    panels.forEach(function (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab) {
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});

const searchFlow = document.querySelector("#search-flow");
const flowSteps = searchFlow.querySelectorAll(".step");
const progressItems = searchFlow.querySelectorAll(".progress-item");
const titleInput = document.querySelector("#game-name");
const titleError = document.querySelector("#name-error");
const titleNext = document.querySelector("#name-next");

const optionPrev = document.querySelector("#game-prev");
const optionNext = document.querySelector("#game-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryType = document.querySelector("#summary-type");

// 4단계용
const resultGameTitle = document.querySelector("#result-game-title");
const resultGameDesc = document.querySelector("#result-game-desc");
const wishlistBtn = document.querySelector("#wishlist-btn");

const formData = {
    title: "", 
    type: ""
};

// [장르별 가상 게임]
const mockGameData = {
    action: { title: "네온 대쉬", desc: "화려한 콤보 액션과 손에 땀을 쥐는 보스 전투가 특징인 게임입니다." },
    adventure: { title: "던전 이스케이프", desc: "넓은 던전를 탐험하며 비밀을 파헤치는 어드벤처 게임입니다." },
    rpg: { title: "더 라스트 워리어", desc: "캐릭터를 육성하며 플레이를 즐기는 정통 RPG입니다." },
    strategy: { title: "그로우 히어로 어드밴쳐", desc: "자원을 관리하고 부대를 배치해 적의 진영을 함락시키는 전략 게임입니다." }
};

function showStep(index) {
    flowSteps.forEach((step, i) => {
        step.hidden = (i !== index);
    });
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });
}

const searchDialog = document.querySelector("#search-dialog");
const searchCancel = document.querySelector("#search-cancel");
const searchConfirm = document.querySelector("#search-confirm");

function revokeSearchAgreement() {
    agreeCheck.checked = false;
    searchFlow.hidden = true;
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click", ()=> {
    if(!agreeCheck.checked) return;
    searchDialog.showModal();
});

searchCancel.addEventListener("click", ()=>{
    searchDialog.close();
    revokeSearchAgreement();
});
searchDialog.addEventListener("cancel", revokeSearchAgreement);

searchConfirm.addEventListener("click", ()=>{
    if(!agreeCheck.checked) return;
    searchDialog.close();
    searchFlow.hidden = false;
    showStep(0);
    searchFlow.scrollIntoView({ behavior: "smooth" });
    titleInput.focus();
});

function validateTitle(){
    const value = titleInput.value.trim();
    if(!value) {
        titleError.textContent = "게임 제목을 입력해주세요.";
        titleInput.classList.add("has-error");
        titleInput.focus();
        return false;
    }
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    formData.title = value;
    return true;
}

titleNext.addEventListener("click", ()=>{
    if(!validateTitle()) return;
    showStep(1); 
});

optionPrev.addEventListener("click", ()=>{
    showStep(0);
});

optionNext.addEventListener("click", ()=>{
    const checkedRadio = document.querySelector('input[name="game-type"]:checked');
    
    if (checkedRadio) {
        formData.type = checkedRadio.value; 
    } else {
        formData.type = "선택 안 함";
    }

    summaryTitle.textContent = formData.title;
    summaryType.textContent = formData.type;
    
    showStep(2); 
});

summaryPrev.addEventListener("click", ()=>{
    showStep(1);
});

finishButton.addEventListener("click", ()=>{
    const sample = mockGameData[formData.type] || { title: formData.title, desc: "사용자 맞춤형 추천 게임입니다." };

    resultGameTitle.textContent = `[검색 결과] "${formData.title}" (추천 연동: ${sample.title})`;
    resultGameDesc.textContent = sample.desc;
    wishlistBtn.textContent = "❤️ 위시리스트 찜하기";
    wishlistBtn.style.backgroundColor = "#635bff";
    
    showStep(3); 
});

// 4단계 토글
let isWishlisted = false;
wishlistBtn.addEventListener("click", () => {
    isWishlisted = !isWishlisted;
    if (isWishlisted) {
        wishlistBtn.textContent = "💖 위시리스트 찜 완료!";
        wishlistBtn.style.backgroundColor = "#245c3a";
    } else {
        wishlistBtn.textContent = "❤️ 위시리스트 찜하기";
        wishlistBtn.style.backgroundColor = "#635bff";
    }
});

restartButton.addEventListener("click", ()=>{
    formData.title = "";
    formData.type = "";
    titleInput.value = "";
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    isWishlisted = false;
    
    const defaultRadio = document.querySelector('input[name="game-type"][value="rpg"]');
    if (defaultRadio) defaultRadio.checked = true;

    summaryTitle.textContent = "";
    summaryType.textContent = "";
    showStep(0);
    searchFlow.hidden = true;
});