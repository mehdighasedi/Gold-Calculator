const newGoldBtn = document.getElementById("new-gold");
const usedGoldBtn = document.getElementById("used-gold");
const title = document.getElementById("title");
const wageInput = document.getElementById("wage-input");
const profitInput = document.getElementById("profit-input");
const weightInput = document.getElementById("weight-input");
const wageValue = document.getElementById("wage-value");
const newRate = document.getElementById("new-rate");
const goldPrices = document.getElementById("gold-price");
const dateOfPrice = document.getElementById("date");
const goldCalcPrice = document.getElementById("gold-calculate-price");
const goldCalcWage = document.getElementById("gold-calculate-wage");
const goldCalcProfit = document.getElementById("gold-calculate-profit");
const goldCalcTax = document.getElementById("gold-calculate-tax");
const marketCardTitle = document.getElementById("market-cart-title");
const talasiCartTitle = document.getElementById("talasi-cart-title");
const totalNew = document.getElementById("total-market");
const totalUsed = document.getElementById("total-talasi");
const usedCalcPrice = document.getElementById("talasi-total");
const usedCalcProfit = document.getElementById("talasi-profit");

console.log(usedCalcPrice);

let goldPrice = null;

function toPersianDigits(str) {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return str
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    .replace(/\d/g, (d) => persianDigits[d]);
}

function setActiveButton(activeBtn, inactiveBtn) {
  activeBtn.classList.add("bg-yellow-400");
  activeBtn.classList.remove("bg-yellow-400/50");
  inactiveBtn.classList.remove("bg-yellow-400");
  inactiveBtn.classList.add("bg-yellow-400/50");
}

newGoldBtn.addEventListener("click", () => {
  title.textContent = "محاسبه آنلاین قیمت طلا";
  setActiveButton(newGoldBtn, usedGoldBtn);
  wageInput.value = 18;
  wageValue.textContent = 18;
  marketCardTitle.textContent = "خرید طلا از بازار";
  talasiCartTitle.textContent = "خرید طلا از طلاسی";
});

usedGoldBtn.addEventListener("click", () => {
  title.textContent = "محاسبه آنلاین قیمت طلا دسته دوم";
  setActiveButton(usedGoldBtn, newGoldBtn);
  wageInput.value = 0;
  wageValue.textContent = 0;
  marketCardTitle.textContent = "خرید طلا دست دوم از بازار";
  talasiCartTitle.textContent = "خرید طلا آبشده از طلاسی";
});

wageInput.addEventListener("input", () => {
  // update when value availanbe
  if (wageInput.value.trim() !== "") {
    wageValue.textContent = toPersianDigits(wageInput.value);
  } else {
    wageValue.textContent = "0";
  }
  handleInputChange();
});

profitInput.addEventListener("input", () => {
  handleInputChange();
});

weightInput.addEventListener("input", () => {
  handleInputChange();
});

//clear zero when clicked
[wageInput, profitInput, weightInput].forEach((input) => {
  input.addEventListener("focus", () => {
    if (input.value === "0") {
      input.value = "";
    }
  });
});

// give zero when leaving inputs
[wageInput, profitInput, weightInput].forEach((input) => {
  input.addEventListener("blur", () => {
    if (input.value.trim() === "") {
      input.value = "0";
      // update wage value
      if (input === wageInput) {
        wageValue.textContent = "0";
      }
      handleInputChange();
    }
  });
});

function calculateNewGoldPrice() {
  const weight = parseFloat(weightInput.value);
  const rate = parseFloat(goldPrice);
  const wagePercent = parseFloat(wageInput.value || 12);
  const profitPercent = parseFloat(profitInput.value || 0);

  if (isNaN(weight) || isNaN(rate)) return;

  const productPrice = weight * rate;
  const wage = (wagePercent / 100) * productPrice;
  const profit = (profitPercent / 100) * (productPrice + wage);
  const tax = 0.09 * (productPrice + wage + profit);
  const total = productPrice + wage + profit + tax;

  goldCalcPrice.textContent = `${toPersianDigits(productPrice.toFixed(0))} تومان`;
  goldCalcWage.textContent = `${toPersianDigits(wage.toFixed(0))} تومان`;
  goldCalcProfit.textContent = `${toPersianDigits(profit.toFixed(0))} تومان`;
  goldCalcTax.textContent = `${toPersianDigits(tax.toFixed(0))} تومان`;
  totalNew.textContent = `${toPersianDigits(total.toFixed(0))} تومان`;
}

function calculateUsedGoldPrice() {
  const weight = parseFloat(weightInput.value);
  const rate = parseFloat(goldPrice);

  if (isNaN(weight) || isNaN(rate)) return;

  const productPrice = weight * rate;
  const profit = 0.01 * productPrice;
  const total = productPrice + profit;

  usedCalcPrice.textContent = `${toPersianDigits(productPrice.toFixed(0))} تومان`;
  usedCalcProfit.textContent = `${toPersianDigits(profit.toFixed(0))} تومان`;
  totalUsed.textContent = `${toPersianDigits(total.toFixed(0))} تومان`;
}

async function getGoldPrice() {
  const BASE_URL = "https://api.navasan.tech/latest";
  const API_KEY = "freeAkc8HYtISTb15Ivu7LTqqMxZC1Kx";
  try {
    const { data } = await axios.get(`${BASE_URL}/?api_key=${API_KEY}`);
    goldPrice = data["18ayar"].value;
    newRate.textContent = `${toPersianDigits(goldPrice)} تومان`;
    goldPrices.textContent = toPersianDigits(goldPrice);

    if (weightInput.value) {
      newGoldBtn.classList.contains("bg-yellow-400")
        ? calculateNewGoldPrice()
        : calculateUsedGoldPrice();
    }
  } catch (error) {
    console.error("خطا در دریافت قیمت طلا:", error.message);
  }
}

function changeDateOfTitle() {
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  const date = new Date().toLocaleDateString("fa-IR", options);
  dateOfPrice.textContent = `قیمت روز طلا ${date} :`;
}

window.addEventListener("DOMContentLoaded", async () => {
  changeDateOfTitle();
  await getGoldPrice();
});

function handleInputChange() {
  calculateNewGoldPrice();
  calculateUsedGoldPrice();
}
