const bankLogos = {
    "Acba Bank": "icons/acba.png",
    "Ameriabank": "icons/ameria.png",
    "IDBank": "icons/idbank.png",
    "Fast Bank": "icons/fastbank.png",
    "Inecobank": "icons/ineco.png",
    "Evocabank": "icons/evoca.png"
};

const rates = {
    "Acba Bank": { USD: { buy: 385, sell: 392 }, EUR: { buy: 415, sell: 422 } },
    "Ameriabank": { USD: { buy: 386, sell: 393 }, EUR: { buy: 416, sell: 423 } },
    "IDBank": { USD: { buy: 384, sell: 391 }, EUR: { buy: 414, sell: 421 } },
    "Fast Bank": { USD: { buy: 387, sell: 394 }, EUR: { buy: 417, sell: 424 } },
    "Inecobank": { USD: { buy: 383, sell: 390 }, EUR: { buy: 413, sell: 420 } },
    "Evocabank": { USD: { buy: 382, sell: 389 }, EUR: { buy: 412, sell: 419 } }
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

function updateFlags() {
    flagFrom.src = currencyFrom.selectedOptions[0].dataset.flag;
    flagTo.src = currencyTo.selectedOptions[0].dataset.flag;
}

function updateRates() {
    const bank = bankSelectedName.textContent;
    const r = rates[bank];

    const from = currencyFrom.value;
    const to = currencyTo.value;

    ratesDiv.innerHTML =
        `${from}: Buy ${r[from]?.buy || "-"} / Sell ${r[from]?.sell || "-"} • ` +
        `${to}: Buy ${r[to]?.buy || "-"} / Sell ${r[to]?.sell || "-"}`;
}

function convertCurrencyPair() {
    const bank = bankSelectedName.textContent;

    const from = currencyFrom.value;
    const to = currencyTo.value;
    const amount = parseFloat(amountFrom.value);

    if (isNaN(amount)) {
        amountTo.textContent = "0.00";
        return;
    }

    const r = rates[bank];

    let result;

    if (from === to) {
        result = amount;
    }
    else if (to === "AMD") {
        result = amount * r[from].buy;
    }
    else if (from === "AMD") {
        result = amount / r[to].sell;
    }
    else {
        const amd = amount * r[from].buy;
        result = amd / r[to].sell;
    }

    amountTo.textContent = result.toFixed(2);
}

bankSelected.onclick = () => {
    bankList.classList.toggle("hidden");
};

bankItems.forEach(item => {
    item.onclick = () => {
        const bank = item.dataset.bank;

        bankSelectedName.textContent = bank;
        bankSelectedLogo.src = bankLogos[bank];

        bankList.classList.add("hidden");

        updateRates();
        convertCurrencyPair();
    };
});

currencyFrom.onchange = () => {
    updateFlags();
    updateRates();
    convertCurrencyPair();
};

currencyTo.onchange = () => {
    updateFlags();
    updateRates();
    convertCurrencyPair();
};

amountFrom.oninput = convertCurrencyPair;

reverseBtn.onclick = () => {
    const temp = currencyFrom.value;
    currencyFrom.value = currencyTo.value;
    currencyTo.value = temp;

    updateFlags();
    updateRates();
    convertCurrencyPair();
};

updateFlags();
updateRates();
convertCurrencyPair();
