"use strict";

const standalone = matchMedia("(display-mode: standalone)");
const isAppleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
let installPrompt = null;
let installed = false;

function showInstalledState() {
  const button = document.querySelector("[data-install-app]");
  if (!button || !(standalone.matches || navigator.standalone || installed)) return;
  button.disabled = true;
  button.textContent = "Aplicativo instalado";
  const message = document.querySelector("[data-install-message]");
  if (message) message.hidden = true;
}

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  installPrompt = event;
});
window.addEventListener("appinstalled", () => {
  installed = true;
  installPrompt = null;
  showInstalledState();
});
standalone.addEventListener("change", showInstalledState);

// The application rebuilds its settings view on Firestore updates.
new MutationObserver(showInstalledState).observe(document.querySelector("#view"), { childList: true });

document.addEventListener("click", async event => {
  const button = event.target.closest("[data-install-app]");
  if (!button) return;
  const message = document.querySelector("[data-install-message]");
  if (!message) return;
  const prompt = installPrompt;
  if (prompt) {
    installPrompt = null;
    button.disabled = true;
    try {
      const { outcome } = await prompt.prompt();
      if (outcome === "accepted") {
        installed = true;
        showInstalledState();
        return;
      }
    } catch {
      // The browser menu remains available if the native prompt fails.
    } finally {
      button.disabled = installed;
    }
  }
  message.hidden = false;
  message.textContent = isAppleMobile
    ? "No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início."
    : "No Chrome ou Edge, abra o menu do navegador e procure Instalar aplicativo ou Adicionar à tela inicial. No computador, confira também o ícone de instalação na barra de endereços.";
});

if (window.isSecureContext && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("./partner-treinamentos-sw.js", { scope: "./" })
    .catch(error => console.warn("Instalação do Partner Treinamentos:", error));
}
