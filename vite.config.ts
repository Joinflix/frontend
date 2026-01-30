import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devtools()],
  server: {
    proxy: {
      // API 요청을 백엔드로 프록시 (쿠키 전송 문제 해결)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // SSE를 위한 설정
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // SSE 요청인 경우 버퍼링 방지
            if (req.url?.includes('/sse/')) {
              proxyReq.setHeader('X-Accel-Buffering', 'no');
            }
          });
        }
      }
    }
  }
});

