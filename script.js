document.getElementById("purchaseBtn").addEventListener("click", () => {
  const loader = document.getElementById("loader");
  const success = document.getElementById("success");

  // Show loader
  loader.style.display = "flex";

  // After 2 seconds hide loader and show success
  setTimeout(() => {
    loader.style.display = "none";
    success.style.display = "flex";

    // Hide success after 2.5 seconds
    setTimeout(() => {
      success.style.display = "none";
    }, 2500);
  }, 2000);
});
