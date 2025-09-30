// Global site configuration
const SiteConfig = {
    /**
     * Domain settings allow you to configure how the site builds absolute URLs
     * and how the canonical domain should appear in metadata.  When pointing a
     * Name.com domain at this site, update the `host` value to match the domain
     * or subdomain you have configured in DNS (for example: "play.example.com"
     * or "example.com").
     */
    domainSettings: {
        provider: "name.com",
        host: "spookydevz.org",
        enforceHttps: true,
        includeWWW: false
    },
    // `domain` is kept for backwards compatibility. When both are defined the
    // computed domain will prefer the more detailed domainSettings values.
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

const normalizeDomain = () => {
    const settings = SiteConfig.domainSettings || {};
    const { host, enforceHttps = true, includeWWW = false } = settings;

    let rawDomain = host || SiteConfig.domain;

    if (!rawDomain) {
        return "";
    }

    // Remove trailing slashes to avoid duplicate slashes later on.
    rawDomain = String(rawDomain).trim().replace(/\/+$/, "");

    // Allow passing protocol + domain directly for backwards compatibility.
    const hasProtocol = /^https?:\/\//i.test(rawDomain);
    const protocol = enforceHttps ? "https://" : "http://";

    let hostname = rawDomain.replace(/^https?:\/\//i, "");

    if (includeWWW && !hostname.startsWith("www.")) {
        hostname = `www.${hostname}`;
    }

    // If the incoming value already contained a protocol we respect it. When
    // enforceHttps is true we force https regardless of the incoming value.
    return enforceHttps || !hasProtocol ? `${protocol}${hostname}` : `${rawDomain}`;
};

const applyCanonicalUrl = () => {
    const domain = normalizeDomain();
    if (!domain) return;

    const canonical = document.querySelector("link[rel='canonical']") ||
        (() => {
            const link = document.createElement("link");
            link.setAttribute("rel", "canonical");
            document.head.appendChild(link);
            return link;
        })();

    canonical.setAttribute("href", domain + window.location.pathname + window.location.search);
};

const absoluteUrl = (path) => {
    if (!path || /^https?:/i.test(path) || path.startsWith("mailto:")) {
        return path;
    }

    if (path.startsWith("/")) {
        try {
            return new URL(path, normalizeDomain() || window.location.origin).href;
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

    applyCanonicalUrl();
};

document.addEventListener("DOMContentLoaded", applySiteConfig);
