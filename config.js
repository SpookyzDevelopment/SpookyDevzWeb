// Global site configuration
const SiteConfig = {
    domain: "https://spookydevz.org",
    siteTitle: "Spooky Development",
    siteTagline: "Immersive experiences for daring players",
    logoPath: "images/SDEVZ-LOGO.png",
    faviconPath: "images/SDEVZ-LOGO.png",
    discordInvite: "https://discord.gg/spookydevz",
    contactEmail: "hello@spookydevz.org",
    navigation: {
        home: "index.html#top",
        projects: "index.html#projects",
        store: "shop.html",
        community: "index.html#community",
        contact: "index.html#contact",
        discord: "https://discord.gg/spookydevz"
    }
};

const absoluteUrl = (path) => {
    if (!path || /^https?:/i.test(path) || path.startsWith("mailto:")) {
        return path;
    }

    if (path.startsWith("/")) {
        try {
            return new URL(path, SiteConfig.domain || window.location.origin).href;
        } catch (error) {
            console.warn("SiteConfig: unable to create absolute URL", error);
            return path;
        }
    }

    return path;
};

const applySiteConfig = () => {
    const pageTitle = document.body?.dataset?.pageTitle || "";
    const baseTitle = SiteConfig.siteTitle;
    document.title = pageTitle ? `${baseTitle} • ${pageTitle}` : baseTitle;

    const favicon = document.querySelector("link[rel='icon']");
    if (favicon && SiteConfig.faviconPath) {
        favicon.href = SiteConfig.faviconPath;
    }

    document.querySelectorAll("[data-site-logo]").forEach((element) => {
        if (SiteConfig.logoPath) {
            element.setAttribute("src", SiteConfig.logoPath);
        }
    });

    document.querySelectorAll("[data-site-title]").forEach((element) => {
        element.textContent = SiteConfig.siteTitle;
    });

    document.querySelectorAll("[data-site-tagline]").forEach((element) => {
        if (SiteConfig.siteTagline) {
            element.textContent = SiteConfig.siteTagline;
        }
    });

    document.querySelectorAll("[data-contact-email]").forEach((element) => {
        if (SiteConfig.contactEmail) {
            element.textContent = SiteConfig.contactEmail;
            element.setAttribute("href", `mailto:${SiteConfig.contactEmail}`);
        }
    });

    const navLinks = document.querySelectorAll("[data-nav]");
    navLinks.forEach((link) => {
        const key = link.getAttribute("data-nav");
        const target = SiteConfig.navigation?.[key];
        if (!target) return;

        const href = absoluteUrl(target);
        if (href) {
            link.setAttribute("href", href);
        }

        if (key === "discord") {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
        }
    });

    document.querySelectorAll("[data-current-year]").forEach((element) => {
        element.textContent = new Date().getFullYear();
    });
};

document.addEventListener("DOMContentLoaded", applySiteConfig);
