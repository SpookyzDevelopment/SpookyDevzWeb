// Global interactions shared across pages
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector("[data-nav-toggle]");
    const primaryNav = document.querySelector("[data-primary-nav]");
    const header = document.querySelector(".site-header");

    if (navToggle && primaryNav) {
        const closeNav = () => {
            navToggle.setAttribute("aria-expanded", "false");
            primaryNav.classList.remove("is-open");
            document.body.classList.remove("nav-open");
        };

        navToggle.addEventListener("click", () => {
            const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!isExpanded));
            primaryNav.classList.toggle("is-open", !isExpanded);
            document.body.classList.toggle("nav-open", !isExpanded);
        });

        primaryNav.addEventListener("click", (event) => {
            if (event.target instanceof Element && event.target.closest("a")) {
                closeNav();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 992) {
                closeNav();
            }
        });
    }

    if (header) {
        const handleScroll = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 16);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
    }
});
