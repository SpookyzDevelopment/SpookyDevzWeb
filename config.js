// Website Configuration File
const SiteConfig = {
    domain: "https://spookydevz.org",   // 🔧 Change your domain here
    siteTitle: "Spooky Development",
    logoPath: "/images/SDEVZ-LOGO.png",
    faviconPath: "/images/SDEVZ-LOGO.png",
    discordInvite: "https://discord.gg/spookydevz"
};

// Apply configuration to the page
document.addEventListener("DOMContentLoaded", () => {
    // Logo
    const logo = document.getElementById("site-logo");
    if (logo) logo.src = SiteConfig.logoPath;

    // Site Title
    const title = document.getElementById("site-title");
    if (title) title.textContent = SiteConfig.siteTitle;

    // Browser Tab Title
    document.title = SiteConfig.siteTitle;

    // Favicon
    let favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
        favicon.href = SiteConfig.faviconPath;
    }

    // Navbar links (use domain for internal pages)
    const homeLink = document.getElementById("nav-home");
    const storeLink = document.getElementById("nav-store");
    const discordLink = document.getElementById("nav-discord");

    if (homeLink) homeLink.href = SiteConfig.domain + "/home";
    if (storeLink) storeLink.href = SiteConfig.domain + "/store";
    if (discordLink) discordLink.href = SiteConfig.discordInvite;
});
