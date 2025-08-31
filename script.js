document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("payment-form");
  const overlay = document.getElementById("overlay");
  const loading = document.getElementById("loading");
  const success = document.getElementById("success");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Show overlay with loading first
    overlay.classList.remove("hidden");
    loading.classList.remove("hidden");
    success.classList.add("hidden");

    // After 3 seconds, hide loading and show success
    setTimeout(() => {
      loading.classList.add("hidden");
      success.classList.remove("hidden");
    }, 3000);

    // Hide overlay completely after 5 seconds
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 5000);
  });
});
