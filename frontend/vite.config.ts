import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  console.log("Running... ", command, mode);
  return {
    plugins: [react()],
    server: {
      port: 3000,
      cors: {
        origin: true,
        credentials: true,
        methods: ["GET", "PUT", "POST", "DEBUG", "DELETE", "UPGRADE", "OPTIONS"],
        preflightContinue: true,
      }
    },
    envPrefix: ["REVOICER", "ASPNETCORE"],
  };
});
