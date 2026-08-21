/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserOrOrgSite = repoName.endsWith('.github.io');
const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true';
const customDomain = process.env.CUSTOM_DOMAIN?.trim() ?? '';
const hasCustomDomain = customDomain.length > 0;
const useBasePath = isGitHubPagesBuild && repoName.length > 0 && !isUserOrOrgSite && !hasCustomDomain;
const basePath = useBasePath ? `/${repoName}` : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath,
  assetPrefix: basePath || undefined,
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ['@stixmagic/ui', '@stixmagic/types', '@stixmagic/config']
};

export default nextConfig;
