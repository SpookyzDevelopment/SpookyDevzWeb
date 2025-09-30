# SpookyDevz Web Configuration & Hosting Guide

This repository contains the static front-end for the Spooky Development website.
The project is intentionally lightweight and can be hosted on any static file
server or simple Node.js/NGINX container. This guide covers two key topics:

1. Pointing a Name.com domain at the site by configuring `config.js`.
2. Hosting the site on a Pterodactyl panel server.

## 1. Connecting a Name.com Domain

The site reads its canonical domain from `config.js`. Update the `domainSettings`
object to match the domain (or subdomain) you configure inside Name.com.

```js
const SiteConfig = {
    domainSettings: {
        provider: "name.com",      // purely informational, but documents intent
        host: "play.example.com",  // change this to your Name.com domain
        enforceHttps: true,         // toggle if you use HTTPS on your server
        includeWWW: false           // set to true if you want www.play.example.com
    },
    // ... other settings remain unchanged ...
};
```

### Name.com DNS Setup

1. Log in to [Name.com](https://www.name.com/) and open **My Domains**.
2. Choose the domain you want to use and open **DNS Management**.
3. Create or update records so that they point to the IP address or hostname of
your hosting environment (for Pterodactyl, this is usually the panel node or a
reverse proxy):
   - **A Record**: Set the host to `@` (for the apex domain) and the answer to
the IPv4 address of your server.
   - **CNAME Record** *(optional)*: If you want a subdomain such as
     `play.example.com`, create a CNAME with host `play` and answer pointing to
the server's hostname or the apex domain.
4. Save your changes. DNS propagation can take anywhere from a few minutes to
   24 hours depending on TTL values.
5. Once DNS resolves, update `domainSettings.host` in `config.js` to match the
   record you created (for example, `play.example.com`). If you configured an
   apex (`@`) record, use the bare domain like `example.com`.

When the page loads it automatically normalizes the configured domain,
constructs absolute URLs for navigation links, and injects a canonical link tag
to assist search engines.

## 2. Hosting on Pterodactyl

The site is static, so any lightweight web server container works. Below is one
approach using a simple Node.js server, but you can adapt it to NGINX or any
other stack that Pterodactyl supports.

### Prerequisites

- Access to a Pterodactyl panel with permissions to create or upload server
  files.
- A Node.js (or generic) egg. The default "Node.js" egg works well for a static
  site when combined with a simple HTTP server package.

### Steps

1. **Create the server**
   - In the Pterodactyl panel, create a new server using the Node.js egg.
   - Allocate enough storage for your static files (the site is small, so 200 MB
     is typically more than enough).

2. **Upload the site**
   - Clone or download this repository locally.
   - Upload all files (`index.html`, `shop.html`, `config.js`, assets, etc.) to
     the `/home/container` directory of the server. You can use the panel's file
     manager or SFTP.

3. **Add a lightweight server**
   - In the panel's file manager, create a new file named `server.js` with the
     following contents:

     ```js
     import express from "express";
     import path from "path";
     import { fileURLToPath } from "url";

     const __filename = fileURLToPath(import.meta.url);
     const __dirname = path.dirname(__filename);

     const app = express();
     const port = process.env.PORT || 8080;

     app.use(express.static(__dirname));

     app.listen(port, () => {
         console.log(`SpookyDevz site running on port ${port}`);
     });
     ```

   - Update or create a `package.json` file so Pterodactyl can install Express:

     ```json
     {
       "name": "spookydevz-web",
       "type": "module",
       "dependencies": {
         "express": "^4.19.2"
       }
     }
     ```

4. **Configure the startup command**
   - Set the start command in Pterodactyl to `node server.js`.
   - Restart the server so dependencies install and the server boots.

5. **Verify and secure**
   - Visit the server's allocation (IP and port) to ensure the site loads.
   - Use a reverse proxy or load balancer (NGINX, Traefik, etc.) if you need to
     serve HTTPS, or place the Pterodactyl allocation behind an existing proxy
     that terminates SSL.

6. **Connect the domain**
   - Once the server is reachable, return to Name.com and point your DNS records
     at the proxy or server IP as described earlier.
   - Update `config.js` with your final domain so the navigation links and
     canonical URL use the correct host.

## Troubleshooting

- **DNS not resolving**: Confirm that the A/CNAME records in Name.com point to
  the correct IP/hostname and wait for propagation. Tools like `nslookup` or
  `dig` can help verify the records.
- **Mixed content warnings**: Ensure `enforceHttps` remains `true` when serving
  the site over HTTPS. If you must serve over HTTP (not recommended), set it to
  `false` so URLs stay consistent.
- **White screen or broken links**: Check the browser console for errors. If
  assets fail to load, confirm that files were uploaded to the correct paths and
  that the Express static middleware (or your chosen server) is serving them.

With these steps you can manage the site's branding and navigation from
`config.js` and host it in a Pterodactyl-managed environment behind your
Name.com domain.
