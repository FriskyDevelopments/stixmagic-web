#!/usr/bin/env node

/**
 * Build a minimal redirect HTML page instead of the full Next.js app.
 * Usage: node scripts/build-redirect.js <target_url> [output_dir]
 * 
 * Example:
 *   node scripts/build-redirect.js https://preview.stixmagic.com ./out
 */

const fs = require('fs');
const path = require('path');

const targetUrl = process.argv[2];
const outputDir = process.argv[3] || './out';

if (!targetUrl) {
  console.error('Error: target URL is required');
  console.error('Usage: node scripts/build-redirect.js <target_url> [output_dir]');
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate a minimal redirect HTML page
const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redirecting...</title>
  <meta http-equiv="refresh" content="0; url=${targetUrl}" />
  <script>
    // Fallback for older browsers
    window.location.replace('${targetUrl}');
  </script>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #0d1222;
      color: #fff;
    }
    .container {
      text-align: center;
      max-width: 500px;
      padding: 2rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      margin: 0.5rem 0;
      opacity: 0.9;
    }
    a {
      display: inline-block;
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(to right, #00d4ff, #818cf8, #a855f7);
      color: #fff;
      text-decoration: none;
      border-radius: 0.75rem;
      font-weight: 500;
      transition: opacity 0.2s;
    }
    a:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Redirecting...</h1>
    <p>If you are not redirected automatically, <a href="${targetUrl}">click here</a>.</p>
  </div>
</body>
</html>`;

// Write the redirect page to index.html
const indexPath = path.join(outputDir, 'index.html');
fs.writeFileSync(indexPath, redirectHtml);

console.log(`✓ Redirect page created at ${indexPath}`);
console.log(`  Redirects to: ${targetUrl}`);
