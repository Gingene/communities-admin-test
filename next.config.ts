import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export",
  // 將 'your-repo-name' 換成你的 GitHub 儲存庫名稱
  basePath: isProd ? "/communities-admin-test" : "",
  assetPrefix: isProd ? "/communities-admin-test/" : "",
  images: { unoptimized: true },
};

export default nextConfig;
