"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalContext = {
    updateFromStorage: function (key) {
        const value = sessionStorage.getItem(key);
        if (!value)
            return;
        const json = JSON.parse(value);
        this[key] = json;
    },
    set: function (key, value) {
        this[key] = value;
        sessionStorage.setItem(key, JSON.stringify(value));
    }
};
function renderPlayerName() {
    const welcomeHeader = document.getElementById("welcome-header");
    welcomeHeader.innerText = welcomeHeader.innerText.replace("$PLAYER_NAME", globalContext["Player-Info"].name);
}
function renderSessionId() {
    if (!globalContext["Session-Info"]?.id)
        return;
    const sessionText = document.getElementById("session-id");
    sessionText.innerText = sessionText.innerText.replace("$SESSION_ID", globalContext["Session-Info"]?.id);
}
function populateContext() {
    globalContext.updateFromStorage("Player-Info");
    globalContext.updateFromStorage("Session-Info");
}
function checkUser() {
    if (!globalContext["Player-Info"]) {
        globalThis.location.replace("/");
    }
}
function handleExitButton() {
    const button = document.getElementById("exit-button");
    button.addEventListener("click", () => {
        sessionStorage.removeItem("Player-Info");
        globalThis.location.replace("/");
    });
}
function init_page() {
    populateContext();
    checkUser();
    renderPlayerName();
    renderSessionId();
    handleExitButton();
}
init_page();
//# sourceMappingURL=platform.js.map