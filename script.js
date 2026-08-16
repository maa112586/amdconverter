// ===============================
// CENTRAL BANK DAILY RATES
// ===============================

async function fetchDailyRates() {
    const today = new Date().toISOString().split("T")[0];
    const url = `https://api.cba.am/exchangeRates?date=${today}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const rates = {};
        data.forEach(item => {
            rates[item.ISO] = item.Rate;
        });

        // FIX: AMD is the base currency, so define it manually
        rates["AMD"] = 1;

        return rates;
    } catch (err) {
        console.error("Rate fetch failed:", err);
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

    const rates = await fetchDailyRates();
    if (!rates) {
        amountTo.textContent = "Error";
        return;
    }

    const from = currencyFrom.value;
    const to = currencyTo.value;

    const fromRate = rates[from];
    const toRate = rates[to];

    if (!fromRate || !toRate) {
        amountTo.textContent = "0.00";
        return;
    }

    // Convert: FROM → AMD → TO
    const amdValue = amount * fromRate;
    const result = amdValue / toRate;

    amountTo.textContent = result.toFixed(2);
}

// ===============================
// INPUT LISTENER
// ===============================

amountFrom.oninput = updateConversion;

// Initial load
updateConversion();
