if (elements.loginForm) {
  elements.loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = elements.usernameInput.value.trim();

    if (!username) return;

    localStorage.setItem("currentUser", username);

    window.location.href = "dashboard.html";
  });
}

if (elements.logoutBtn) {
  elements.logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");

    window.location.href = "index.html";
  });
}

const currentUser = localStorage.getItem("currentUser");
const currentPage = window.location.pathname.split("/").pop();

if (
  ["dashboard.html", "transaksi.html"].includes(currentPage) &&
  !currentUser
) {
  window.location.href = "index.html";
}
