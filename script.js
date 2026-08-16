// ===============================
//  DAILY EXCHANGE RATE FETCHER
// ===============================

async function fetchDailyRates() {
  const today = new Date().toISOString().split('T')[0];
  const url = `https://api.cba.am/exchangeRates?date=${today}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const rates = {};
    data.forEach(item => {
      rates[item.ISO] = item.Rate;
    });

    return rates;
  } catch (error) {
    console.error("Failed to fetch daily rates:", error);
    return null;
  }
}

// ===============================
//  CONVERSION LOGIC
// ===============================

async function convertCurrency(amount, fromCurrency, toCurrency) {
  const rates = await fetchDailyRates();
  if (!rates) return null;

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  if (!fromRate || !toRate) {
    console.error("Invalid currency code:", fromCurrency, toCurrency);
    return null;
  }

  // Convert: amount → AMD → target currency
  const amdValue = amount * fromRate;
  const result = amdValue / toRate;

  return result;
}

// ===============================
//  UI HANDLING
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("amount");
  const fromSelect = document.getElementById("fromCurrency");
  const toSelect = document.getElementById("toCurrency");
  const resultBox = document.getElementById("result");
  const updateBox = document.getElementById("updateTime");

  async function updateConversion() {
    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (isNaN(amount)) {
      resultBox.textContent = "Enter a valid number.";
      return;
    }

    const result = await convertCurrency(amount, from, to);

    if (result === null) {
      resultBox.textContent = "Unable to fetch rates.";
      return;
    }

    resultBox.textContent = `${result.toFixed(2)} ${to}`;
  }

  // Update when user interacts
  amountInput.addEventListener("input", updateConversion);
  fromSelect.addEventListener("change", updateConversion);
  toSelect.addEventListener("change", updateConversion);

  // Show last update time
  const now = new Date();
  updateBox.textContent = `Updated: ${now.toLocaleString()}`;

  // Initial conversion
  updateConversion();
});
