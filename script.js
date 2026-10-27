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

startButton.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    searchDialog.showModal();
});

searchCancel.addEventListener("click", () => {
    searchDialog.close();
    revokeSearchAgreement();
});
searchDialog.addEventListener("cancel", revokeSearchAgreement);

searchConfirm.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    searchDialog.close();
    searchFlow.hidden = false;
    showStep(0);
    searchFlow.scrollIntoView({ behavior: "smooth" });
    titleInput.focus();
});

function validateTitle() {
    const value = titleInput.value.trim();
    if (!value) {
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

titleNext.addEventListener("click", () => {
    if (!validateTitle()) return;
    showStep(1);
});

optionPrev.addEventListener("click", () => {
    showStep(0);
});

optionNext.addEventListener("click", () => {
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

summaryPrev.addEventListener("click", () => {
    showStep(1);
});

finishButton.addEventListener("click", () => {
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

restartButton.addEventListener("click", () => {
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

// --- [신작 게임 입점 신청 폼 제어 로직] ---

const regForm = document.querySelector("#game-reg-form");
const regTitleInput = document.querySelector("#reg-game-title");
const regTitleError = document.querySelector("#reg-title-error");
const isPaidCheckbox = document.querySelector("#is-paid-game");
const priceContainer = document.querySelector("#price-container");
const regPriceInput = document.querySelector("#reg-price");
const regSubmitBtn = document.querySelector("#reg-submit-btn");
const regResetBtn = document.querySelector("#reg-reset-btn");
const regFeedbackMessage = document.querySelector("#reg-feedback-message");
const regDeveloperInput = document.querySelector("#reg-developer");
const regDeveloperError = document.querySelector("#reg-developer-error");
const regPlatformError = document.querySelector("#reg-platform-error");



// 1. 조건부 입력 구현 (유료 게임 체크 시 가격 입력창 표시 및 활성화, 해제 시 비활성화 및 숨김)
isPaidCheckbox.addEventListener("change", () => {
    if (isPaidCheckbox.checked) {
        priceContainer.hidden = false;
        regPriceInput.disabled = false; // 입력 가능 상태로 변경
        regPriceInput.focus();
    } else {
        priceContainer.hidden = true;
        regPriceInput.disabled = true;  // 비활성화 처리
        regPriceInput.value = "";       // 값 초기화
    }
});

// 2. 실시간 입력 검증 (글자 수 조건)
regTitleInput.addEventListener("input", () => {
    const val = regTitleInput.value.trim();
    if (val.length > 0 && val.length < 2) {
        regTitleError.textContent = "게임 이름은 최소 2글자 이상 입력해야 합니다.";
        regTitleInput.classList.add("has-error");
    } else {
        regTitleError.textContent = "";
        regTitleInput.classList.remove("has-error");
    }
});

// 3. 폼 제출(submit) 이벤트 및 중복 제출 방지 처리
regForm.addEventListener("submit", (event) => {
    event.preventDefault(); // 기본 새로고침 제출 방지

    const titleVal = regTitleInput.value.trim();
    const developerVal = regDeveloperInput.value.trim();

    regFeedbackMessage.textContent = "";
    regFeedbackMessage.className = "";
    regTitleError.textContent = "";
    regDeveloperError.textContent = "";
    regPlatformError.textContent = "";

    if (!titleVal || titleVal.length < 2) {
        regTitleError.textContent = "게임 이름은 필수이며 최소 2글자 이상이어야 합니다.";
        regTitleInput.classList.add("has-error");
        regTitleInput.focus();
        return;
    }
    regTitleInput.classList.remove("has-error");

    if (!developerVal) {
        regDeveloperError.textContent = "개발사 / 팀명을 입력해주세요.";
        regDeveloperInput.classList.add("has-error");
        regDeveloperInput.focus();
        return;
    }
    regDeveloperInput.classList.remove("has-error");

    const checkedPlatforms = document.querySelectorAll('input[name="platform"]:checked');
    if (checkedPlatforms.length === 0) {
        regPlatformError.textContent = "지원 플랫폼을 최소 1개 이상 선택해주세요.";
        return;
    }

    if (titleVal.includes("금지")) {
        regFeedbackMessage.textContent = "실패: 허용되지 않는 금지어가 포함되어 있습니다. 내용을 수정해주세요.";
        regFeedbackMessage.className = "error";
        return;
    }

    // 제출 중 상태 처리 (중복 제출 방지)
    regSubmitBtn.disabled = true;
    regSubmitBtn.textContent = "등록 심사 중...";
    regFeedbackMessage.textContent = "서버에 입점 신청 정보를 전송하고 있습니다. 잠시만 기다려주세요.";
    regFeedbackMessage.className = "error"; 

    setTimeout(() => {
        regFeedbackMessage.textContent = `성공: "${titleVal}" 게임의 입점 신청이 완료되었습니다! 심사 후 등록됩니다.`;
        regFeedbackMessage.className = "success";

        regSubmitBtn.disabled = false;
        regSubmitBtn.textContent = "입점 신청하기";
    }, 1500);
});

// 4. 작성 초기화 버튼 기능
regResetBtn.addEventListener("click", () => {
    regForm.reset();
    priceContainer.hidden = true;
    regPriceInput.disabled = true;
    regTitleError.textContent = "";
    regTitleInput.classList.remove("has-error");
    regFeedbackMessage.textContent = "";
    regFeedbackMessage.className = "";
    regTitleInput.focus();
});