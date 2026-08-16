// ===============================
// FETCH GLOBAL FX RATES (Frankfurter API)
// ===============================

async function fetchFxRates() {
    try {
        // Fetch USD and EUR relative to AMD
        const usdRes = await fetch("https://api.frankfurter.app/latest?from=USD&to=AMD");
        const eurRes = await fetch("https://api.frankfurter.app/latest?from=EUR&to=AMD");

        const usdData = await usdRes.json();
        const eurData = await eurRes.json();

        return {
            USD: {
                buy: usdData.rates.AMD,   // USD → AMD
                sell: usdData.rates.AMD   // same for global FX
            },
            EUR: {
                buy: eurData.rates.AMD,   // EUR → AMD
                sell: eurData.rates.AMD
            },
            AMD: {
                buy: 1,
                sell: 1
            }
        };

    } catch (err) {
        console.error("Failed to fetch FX rates:", err);
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

// Force Acba as the only bank (visual only)
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

    const rates = await fetchFxRates();
    if (!rates) {
        amountTo.textContent = "Error";
        return;
    }

    const from = currencyFrom.value;
    const to = currencyTo.value;

    let result;

    // Global FX logic (simple direct conversion)
    if (from === "AMD" && to !== "AMD") {
        result = amount / rates[to].buy;
    } else if (from !== "AMD" && to === "AMD") {
        result = amount * rates[from].buy;
    } else if (from !== "AMD" && to !== "AMD") {
        const amdValue = amount * rates[from].buy;
        result = amdValue / rates[to].buy;
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
