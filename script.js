const flagRow = document.getElementById("flagRow");

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

const bankInitials = {
    "Acba Bank": "AC",
    "Ameriabank": "AM",
    "IDBank": "ID",
    "Fast Bank": "FA",
    "Inecobank": "IN",
    "Evocabank": "EV"
};

let direction = "toAMD";

const bankSelect = document.getElementById("bankSelect");
const currencySelect = document.getElementById("currencySelect");
const amountInput = document.getElementById("amountInput");
const resultOutput = document.getElementById("resultOutput");
const ratesDiv = document.getElementById("rates");
const bankLogo = document.getElementById("bankLogo");
const toAMDBtn = document.getElementById("toAMD");
const fromAMDBtn = document.getElementById("fromAMD");

function updateLogo() {
    const bank = bankSelect.value;
    bankLogo.textContent = bankInitials[bank] || "?";
}

function updateRates() {
    const bank = bankSelect.value;
    const currency = currencySelect.value;
    const r = rates[bank][currency];
    ratesDiv.innerHTML = `Buy: ${r.buy} | Sell: ${r.sell}`;
}

function convert() {
    const bank = bankSelect.value;
    const currency = currencySelect.value;
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount)) {
        resultOutput.value = "";
        return;
    }

    const r = rates[bank][currency];

    let result;
    if (direction === "toAMD") {
        // Foreign → AMD uses Buy rate
        result = amount * r.buy;
    } else {
        // AMD → Foreign uses Sell rate
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

bankSelect.onchange = () => {
    function updateLogo() {
    const bank = bankSelect.value;
    const logoPath = bankLogos[bank];
    if (logoPath) {
        bankLogo.src = logoPath;
    }
}
;
    updateRates();
    convert();
};

currencySelect.onchange = () => {
    updateRates();
    convert();
};

amountInput.oninput = convert;

function updateLogo() {
    const bank = bankSelect.value;
    const logoPath = bankLogos[bank];
    if (logoPath) {
        bankLogo.src = logoPath;
    }
}
updateFlags();
updateRates();
