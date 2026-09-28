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
