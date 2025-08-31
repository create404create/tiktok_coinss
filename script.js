let selectedCoins = null;

document.querySelectorAll(".coin-option").forEach(option => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".coin-option").forEach(o => o.classList.remove("selected"));
    option.classList.add("selected");

    if (option.classList.contains("custom")) {
      selectedCoins = null; // custom option will be set later
    } else {
      selectedCoins = option.dataset.coins;
    }
  });
});

document.getElementById("purchaseBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const cardNumber = document.getElementById("cardNumber").value;
  const expiry = document.getElementById("expiry").value;
  const cvv = document.getElementById("cvv").value;
  const customCoins = document.getElementById("customCoins").value;

  if (!username || !cardNumber || !expiry || !cvv) {
    alert("Please fill in all details!");
    return;
  }

  if (!selectedCoins && !customCoins) {
    alert("Please select coins!");
    return;
  }

  if (customCoins) {
    selectedCoins = customCoins;
  }

  const message = document.getElementById("message");
  message.textContent = "Processing your purchase...";
  message.style.color = "blue";

  // Fake loading
  setTimeout(() => {
    message.textContent = "Purchase Successful!";
    message.style.color = "green";
  }, 3000); // 3 sec loading
});
