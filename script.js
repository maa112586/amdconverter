// ===============================
// FETCH LIVE BANK RATES FROM RATE.AM (v3)
// ===============================

async function fetchBankRates() {
    const url = "https://rate.am/ws/mobile/v3/rates";

    try {
        const response = await fetch(url);
        const data = await response.json();

        const acba = data.banks.find(b => b.name === "Acba Bank");

        return {
            "Acba Bank": {
                USD: {
                    buy: acba.rates.USD.buy,
                    sell: acba.rates.USD.sell
                },
                EUR: {
                    buy: acba.rates.EUR.buy,
                    sell: acba.rates.EUR.sell
                },
                AMD: { buy: 1, sell: 1 }
            }
        };

    } catch (err) {
        console.error("Failed to fetch bank rates:", err);
        return null;
    }
}

// ===============================
// BANK DROPDOWN (VISUALLY SAME, FUNCTIONALLY DISABLED)
// ===============================

const bankSelected = document.getElementById("bankSelected");
const bankList = document.getElementById("bankList");
const bankSelectedName = document.getElementById("bankSelectedName");
const bankSelectedLogo = document.getElementById("bankSelectedLogo");

// Force Acba as the only bank
bankSelectedName.textContent = "Acba Bank";

// Disable dropdown opening
bankSelected.onclick = () => {};

// Disable clicking other banks
document.querySelectorAll(".bank-item").forEach(item => {
    item.onclick = () => {};
});

// ===============================
// FLAGS + DROPDOWNS
// ===============================

const currencyFrom = document.getElementById("currencyFrom");
const currencyTo = document.getElementById("currencyTo");
const flagFrom = document.getElementById("flagFrom");
const flagTo = document.getElementById("flagTo");

currencyFrom.onchange = () => {
    flagFrom.src = currencyFrom.selectedOptions[0].dataset.flag;
    updateConversion();
};

currencyTo.onchange = () => {
    flagTo.src = currencyTo.selectedOptions[0].dataset.flag;
    updateConversion();
};

// ===============================
// REVERSE BUTTON
// ===============================

document.getElementById("reverseBtn").onclick = () => {
    const tempCurrency = currencyFrom.value;
    currencyFrom.value = currencyTo.value;
    currencyTo.value = tempCurrency;

    const tempFlag = flagFrom.src;
    flagFrom.src = flagTo.src;
    flagTo.src = tempFlag;

    updateConversion();
};

// ===============================
// CONVERSION LOGIC
// ===============================

const amountFrom = document.getElementById("amountFrom");
const amountTo = document.getElementById("amountTo");

async function updateConversion() {
    const amount = parseFloat(amountFrom.value);
    if (isNaN(amount)) {
        amountTo.textContent = "0.00";
        return;
    }

    const bankRates = await fetchBankRates();
    if (!bankRates) {
        amountTo.textContent = "Error";
        return;
    }

    const bank = "Acba Bank"; // locked
    const from = currencyFrom.value;
    const to = currencyTo.value;

    const rates = bankRates[bank];

    if (!rates || !rates[from] || !rates[to]) {
        amountTo.textContent = "0.00";
        return;
    }

    let result;

    // Foreign → AMD = BUY
    // AMD → Foreign = SELL

    if (from === "AMD" && to !== "AMD") {
        result = amount / rates[to].sell;
    } else if (from !== "AMD" && to === "AMD") {
        result = amount * rates[from].buy;
    } else if (from !== "AMD" && to !== "AMD") {
        const amdValue = amount * rates[from].buy;
        result = amdValue / rates[to].sell;
    } else {
        result = amount;
    }

    amountTo.textContent = result.toFixed(2);
}

// ===============================
// INPUT LISTENER
// ===============================

amountFrom.oninput = updateConversion;

// Initial load
updateConversion();

