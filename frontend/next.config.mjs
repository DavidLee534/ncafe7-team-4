/** @type {import('next').NextConfig} */
// 백엔드(Spring Boot) 주소. 기본은 로컬 8080
const API_URL = process.env.API_URL ?? "http://localhost:8080";

const nextConfig = {
  // 브라우저에서 보내는 /api/v1/... 요청을 백엔드로 넘긴다.
  // 주소가 같은 출처(localhost:3000)로 보여서 백엔드에 CORS 설정이 필요 없다
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${API_URL}/api/v1/:path*` }];
  },
};

export default nextConfig;
