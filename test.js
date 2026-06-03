const process = { env: { CF_PAGES: '1' } };
const isCloudflarePages = process.env.CF_PAGES === '1' || process.env.CLOUDFLARE_PAGES === '1' || !!process.env.CF_PAGES_BRANCH;
console.log(isCloudflarePages);
