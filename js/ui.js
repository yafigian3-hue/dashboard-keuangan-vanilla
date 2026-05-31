function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop();

  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.classList.remove("bg-blue-50", "text-blue-600");

    link.classList.add("text-gray-600");

    if (link.getAttribute("href") === currentPage) {
      link.classList.remove("text-gray-600");

      link.classList.add("bg-blue-50", "text-blue-600");
    }
  });
}

setActiveNav();

if (elements.toggleSidebar && elements.sidebar && elements.overlay) {
  elements.toggleSidebar.addEventListener("click", () => {
    elements.sidebar.classList.toggle("-translate-x-full");
    elements.overlay.classList.toggle("hidden");
  });

  elements.overlay.addEventListener("click", () => {
    elements.sidebar.classList.add("-translate-x-full");
    elements.overlay.classList.add("hidden");
  });
}
