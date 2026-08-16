function updateFlags() {
    const currency = currencySelect.value;
    if (currency === "USD") {
        flagRow.textContent = "USD ↔ AMD";
    } else {
        flagRow.textContent = "EUR ↔ AMD";
    }
}

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

let direction = "toAMD";

const currencySelect = document.getElementById("currencySelect");
const amountInput = document.getElementById("amountInput");
const resultOutput = document.getElementById("resultOutput");
const ratesDiv = document.getElementById("rates");
const flagRow = document.getElementById("flagRow");

const toAMDBtn = document.getElementById("toAMD");
const fromAMDBtn = document.getElementById("fromAMD");

const bankSelected = document.getElementById("bankSelected");
const bankSelectedLogo = document.getElementById("bankSelectedLogo");
const bankSelectedName = document.getElementById("bankSelectedName");
const bankList = document.getElementById("bankList");
const bankItems = document.querySelectorAll(".bank-item");

function updateRates() {
    const bank = bankSelectedName.textContent;
    const currency = currencySelect.value;
    const r = rates[bank][currency];
    ratesDiv.innerHTML = `Buy: ${r.buy} | Sell: ${r.sell}`;
}

function convert() {
    const bank = bankSelectedName.textContent;
    const currency = currencySelect.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount)) {
        resultOutput.value = "";
        return;
    }

    const r = rates[bank][currency];

    let result;
    if (direction === "toAMD") {
        result = amount * r.buy;
    } else {
        result = amount / r.sell;
    }

    resultOutput.value = result.toFixed(2);
}

toAMDBtn.onclick = () => {
    direction = "toAMD";
    toAMDBtn.classList.add("active");
    fromAMDBtn.classList.remove("active");
    convert();
};

fromAMDBtn.onclick = () => {
    direction = "fromAMD";
    fromAMDBtn.classList.add("active");
    toAMDBtn.classList.remove("active");
    convert();
};

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
        convert();
    };
});

currencySelect.onchange = () => {
    updateFlags();
    updateRates();
    convert();
};

amountInput.oninput = convert;

updateFlags();
updateRates();
convert();
