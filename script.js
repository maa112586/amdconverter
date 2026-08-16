const bankLogos = {
    "Acba Bank": "icons/acba.png",
    "Ameriabank": "icons/ameria.png",
    "IDBank": "icons/idbank.png",
    "Fast Bank": "icons/fastbank.png",
    "Inecobank": "icons/ineco.png",
    "Evocabank": "icons/evoca.png"
};

const rates = {
    "Acba Bank": {
        USD: { buy: 385, sell: 392 },
        EUR: { buy: 415, sell: 422 },
        AMD: { buy: "-", sell: "-" }
    },
    "Ameriabank": {
        USD: { buy: 386, sell: 393 },
        EUR: { buy: 416, sell: 423 },
        AMD: { buy: "-", sell: "-" }
    },
    "IDBank": {
        USD: { buy: 384, sell: 391 },
        EUR: { buy: 414, sell: 421 },
        AMD: { buy: "-", sell: "-" }
    },
    "Fast Bank": {
        USD: { buy: 387, sell: 394 },
        EUR: { buy: 417, sell: 424 },
        AMD: { buy: "-", sell: "-" }
    },
    "Inecobank": {
        USD: { buy: 383, sell: 390 },
        EUR: { buy: 413, sell: 420 },
        AMD: { buy: "-", sell: "-" }
    },
    "Evocabank": {
        USD: { buy: 382, sell: 389 },
        EUR: { buy: 412, sell: 419 },
        AMD: { buy: "-", sell: "-" }
    }
};

const currencyFrom = document.getElementById("currencyFrom");
const currencyTo = document.getElementById("currencyTo");
const amountFrom = document.getElementById("amountFrom");
const amountTo = document.getElementById("amountTo");
const flagFrom = document.getElementById("flagFrom");
const flagTo = document.getElementById("flagTo");
const ratesDiv = document.getElementById("rates");

const bankSelected = document.getElementById("bankSelected");
const bankSelectedLogo = document.getElementById("bankSelectedLogo");
const bankSelectedName = document.getElementById("bankSelectedName");
const bankList = document.getElementById("bankList");
const bankItems = document.querySelectorAll(".bank-item");

const reverseBtn = document.getElementById("reverseBtn");


// ------------------------------
// BANK DROPDOWN
// ------------------------------
bankSelected.addEventListener("click", () => {
    bankList.classList.toggle("hidden");
});

bankItems.forEach(item => {
    item.addEventListener("click", () => {
        const bank = item.dataset.bank;
        bankSelectedName.textContent = bank;
        bankSelectedLogo.src = bankLogos[bank];
        bankList.classList.add("hidden");
        updateRates();
