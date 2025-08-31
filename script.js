/* =========================
   CONFIG: bundles (edit prices here)
   ========================= */
const COIN_BUNDLES = [
  { coins: 30,   price: 0.34, note: "Popular" },
  { coins: 65,   price: 0.74 },
  { coins: 100,  price: 1.15, note: "Best value" },
  { coins: 200,  price: 2.30 },
  { coins: 350,  price: 3.99 },
  { coins: 700,  price: 7.99 },
  { coins: 1000, price: 11.99 },
  { coins: 2000, price: 23.98 },
  { coins: "custom", price: 0 } // custom entry (keeps last)
];

/* Use your provided logo for coin cards */
const COIN_LOGO = "https://i.ibb.co/pr0Ww3nZ/image-1.png";

/* ============ helpers ============ */
function computePerCoinRate() {
  const real = COIN_BUNDLES.filter(b => typeof b.coins === "number");
  const rates = real.map(b => b.price / b.coins);
  if (!rates.length) return 0.01;
  const avg = rates.reduce((a,b) => a+b, 0) / rates.length;
  return avg;
}
function fmtPrice(n){ return `$${n.toFixed(2)}`; }

/* ============ DOM refs ============ */
const usernameInput  = document.getElementById("username");
const startBtn       = document.getElementById("startBtn");
const usernameHint   = document.getElementById("usernameHint");

const coinsSection   = document.getElementById("coinsSection");
const coinGrid       = document.getElementById("coinGrid");
const customBox      = document.getElementById("customBox");
const customCoinsInp = document.getElementById("customCoins");

const checkoutSection= document.getElementById("checkoutSection");
const summaryCoinsEl = document.getElementById("summaryCoins");
const summaryPriceEl = document.getElementById("summaryPrice");
const checkoutForm   = document.getElementById("checkoutForm");
const formHint       = document.getElementById("formHint");

const modal          = document.getElementById("modal");
const modalLoading   = document.getElementById("modalLoading");
const modalSuccess   = document.getElementById("modalSuccess");
const closeModalBtn  = document.getElementById("closeModal");
const successUserEl  = document.getElementById("successUser");

const cardName = document.getElementById("cardName");
const cardNumber = document.getElementById("cardNumber");
const expMonth = document.getElementById("expMonth");
const expYear = document.getElementById("expYear");
const cvv = document.getElementById("cvv");
const buyBtn = document.getElementById("buyBtn");

/* ============ state ============ */
let selectedBundle = null;
let perCoinRate = computePerCoinRate();

/* ============ render / UI ============ */
function createCoinCard(bundle, idx){
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "coin";
  btn.dataset.idx = idx;

  const isCustom = bundle.coins === "custom";
  const title = isCustom ? "Custom" : `${bundle.coins} Coins`;
  const priceText = isCustom ? "—" : fmtPrice(bundle.price);

  btn.innerHTML = `
    <div class="coin-top">
      <img class="coin-icon" src="${COIN_LOGO}" alt="Coin" />
      <div class="coin-title">${title}</div>
      <div class="coin-price">${priceText}</div>
    </div>
    ${bundle.note ? `<div class="badge">${bundle.note}</div>` : ""}
    ${isCustom ? `<div class="coin-note">Enter your own amount</div>` : ""}
  `;

  btn.addEventListener("click", () => handleCoinSelect(idx));
  return btn;
}

function renderCoinGrid(){
  coinGrid.innerHTML = "";
  COIN_BUNDLES.forEach((b, i) => coinGrid.appendChild(createCoinCard(b, i)));
}

function handleCoinSelect(idx){
  // mark UI
  [...coinGrid.children].forEach(c => c.classList.remove("selected"));
  const el = coinGrid.querySelector(`[data-idx="${idx}"]`);
  if (el) el.classList.add("selected");

  const bundle = COIN_BUNDLES[idx];
  if (bundle.coins === "custom") {
    customBox.classList.remove("hidden");
    selectedBundle = { coins: 0, price: 0, custom: true };
    customCoinsInp.focus();
  } else {
    customBox.classList.add("hidden");
    selectedBundle = { coins: bundle.coins, price: bundle.price, custom: false };
  }

  checkoutSection.classList.remove("hidden");
  updateSummary();
}

function updateSummary(){
  if (!selectedBundle) {
    summaryCoinsEl.textContent = "—";
    summaryPriceEl.textContent = "$0.00";
    return;
  }

  let coins = selectedBundle.coins;
  let price = selectedBundle.price;

  if (selectedBundle.custom) {
    const n = parseInt(customCoinsInp.value || "0", 10);
    coins = isNaN(n) ? 0 : Math.max(0, n);
    price = +(coins * perCoinRate).toFixed(2);
    selectedBundle.coins = coins;
    selectedBundle.price = price;
  }

  summaryCoinsEl.textContent = (typeof coins === "number" && coins > 0) ? `${coins} Coins` : "Custom";
  summaryPriceEl.textContent = fmtPrice(price || 0);
}

/* ============ validation ============ */
function requireUsername(){
  const u = usernameInput.value.trim();
  if (!u) {
    usernameHint.classList.add("show");
    return false;
  }
  usernameHint.classList.remove("show");
  return true;
}
function simpleCardOk(){
  // require non-empty fields (demo)
  return [cardName.value.trim(), cardNumber.value.trim(), expMonth.value.trim(), expYear.value.trim(), cvv.value.trim()].every(Boolean);
}

/* ============ events ============ */
startBtn.addEventListener("click", () => {
  if (!requireUsername()) return;
  // show coins section
  coinsSection.classList.remove("hidden");
  coinsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

customCoinsInp.addEventListener("input", updateSummary);

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // checks
  if (!requireUsername()) return;
  if (!selectedBundle) { formHint.textContent = "Please select a coin bundle."; formHint.classList.add("show"); return; }
  if (selectedBundle.custom && (!selectedBundle.coins || selectedBundle.coins <= 0)) { formHint.textContent = "Enter custom coin amount."; formHint.classList.add("show"); return; }
  if (!simpleCardOk()) { formHint.textContent = "Please complete all card fields."; formHint.classList.add("show"); return; }

  formHint.classList.remove("show");

  // show modal with loading
  successUserEl.textContent = usernameInput.value.trim();
  modal.classList.remove("hidden");
  modalLoading.classList.remove("hidden");
  modalSuccess.classList.add("hidden");

  // fake loading then success
  setTimeout(() => {
    modalLoading.classList.add("hidden");
    modalSuccess.classList.remove("hidden");
  }, 2000); // change time if you want longer/shorter

  // (optional) auto hide overlay after a bit — keep it until user closes.
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");

  // light reset: clear card inputs, clear selection but keep username
  checkoutForm.reset();
  selectedBundle = null;
  updateSummary();
  [...coinGrid.children].forEach(c => c.classList.remove("selected"));
  customBox.classList.add("hidden");
  checkoutSection.classList.add("hidden"); // hide checkout until next selection
});

/* initialize */
document.addEventListener("DOMContentLoaded", () => {
  renderCoinGrid();
  updateSummary();
});
