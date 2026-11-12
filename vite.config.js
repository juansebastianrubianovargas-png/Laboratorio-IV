import { defineConfig } from 'vite';

// El navegador usa /api. Vite reenvía las peticiones a json-server.
// Así funciona también en Codespaces sin publicar el puerto de la API.
const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:3001',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
};

const codespaceHost = process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
  ? `${process.env.CODESPACE_NAME}-5173.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
  : null;

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: codespaceHost ? [codespaceHost] : [],
    proxy: apiProxy,
  },
  preview: { host: '0.0.0.0', port: 5173, strictPort: true, proxy: apiProxy },
});
