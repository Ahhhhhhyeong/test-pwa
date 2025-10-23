// next.config.ts
import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  //...
};

// next-pwa 설정 추가
const pwaConfig = withPWA({
  dest: 'public', // Service Worker와 관련된 파일이 생성될 위치 지정
  register: true, // 브라우저에 Service Worker를 자동으로 등록
  skipWaiting: true, // 업데이트 시 바로 활성화
  disable: false, // 개발 환경에서도 PWA 활성화
  buildExcludes: [/middleware-manifest\.json$/], // 특정 파일 제외 (Next.js 관련 파일 캐싱 제외)
});

// next-pwa와 기존 nextConfig 병합
export default pwaConfig(nextConfig);
// export default nextConfig;
