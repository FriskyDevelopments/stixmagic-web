/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserOrOrgSite = repoName.endsWith('.github.io');
const useBasePath = process.env.GITHUB_PAGES === 'true' && repoName.length > 0 && !isUserOrOrgSite;
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
