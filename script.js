// ===============================
// FETCH LIVE BANK RATES (ACBA ONLY)
// ===============================

async function fetchBankRates() {
    try {
        const response = await fetch("https://acba.am/api/exchange-rates");
        const data = await response.json();

        // Build the same structure your converter already expects
        const bankRates = {
            "Acba Bank": {
                USD: {
                    buy: data.rates.USD.buy,
                    sell: data.rates.USD.sell
                },
                EUR: {
                    buy: data.rates.EUR.buy,
                    sell: data.rates.EUR.sell
                },
                AMD: {
                    buy: 1,
                    sell: 1
                }
            },

            // Other banks remain present so your UI doesn't break,
            // but they return null so your converter won't crash.
            "Ameriabank": null,
            "IDBank": null,
            "Fast Bank": null,
            "Inecobank": null,
            "Evocabank": null
        };

        return bankRates;

    } catch (err) {
        console.error("Failed to fetch Acba rates:", err);
        return null;
    }
}

// ===============================
// BANK DROPDOWN
// ===============================

const bankSelected = document.getElementById("bankSelected");
const bankList = document.getElementById("bankList");
const bankSelectedName = document.getElementById("bankSelectedName");
const bankSelectedLogo = document.getElementById("bankSelectedLogo");

bankSelected.onclick = () => {
    bankList.classList.toggle("hidden");
};

document.querySelectorAll(".bank-item").forEach(item => {
    item.onclick = () => {
        const bank = item.dataset.bank;
        const logo = item.querySelector("img").src;

        bankSelectedName.textContent = bank;
        bankSelectedLogo.src = logo;

        bankList.classList.add("hidden");
        updateConversion();
    };
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

    const bank = bankSelectedName.textContent.trim();
    const from = currencyFrom.value;
    const to = currencyTo.value;

    const rates = bankRates[bank];

    if (!rates || !rates[from] || !rates[to]) {
        amountTo.textContent = "0.00";
        return;
    }

    let result;

    // Rate.am logic:
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
