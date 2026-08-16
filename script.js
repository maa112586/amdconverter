// ===============================
// FETCH LIVE ACBA RATES BY SCRAPING HTML
// ===============================

async function fetchBankRates() {
    try {
        const response = await fetch("https://acba.am");
        const html = await response.text();

        // Extract USD buy/sell
        const usdMatch = html.match(/USD\s+(\d+\.?\d*)\s+(\d+\.?\d*)/);
        const usdBuy = usdMatch ? parseFloat(usdMatch[1]) : null;
        const usdSell = usdMatch ? parseFloat(usdMatch[2]) : null;

        // Extract EUR buy/sell
        const eurMatch = html.match(/EUR\s+(\d+\.?\d*)\s+(\d+\.?\d*)/);
        const eurBuy = eurMatch ? parseFloat(eurMatch[1]) : null;
        const eurSell = eurMatch ? parseFloat(eurMatch[2]) : null;

        return {
            "Acba Bank": {
                USD: { buy: usdBuy, sell: usdSell },
                EUR: { buy: eurBuy, sell: eurSell },
                AMD: { buy: 1, sell: 1 }
            }
        };

    } catch (err) {
        console.error("Failed to fetch Acba rates:", err);
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
