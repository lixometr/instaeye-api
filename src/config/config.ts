import * as path from 'path';

const projectBasePath = path.join(__dirname, '..', '..');
export const config = {
  imageProxy: {
    host: process.env.IMAGE_PROXY_HOST || '83.171.235.39',
    port: process.env.IMAGE_PROXY_PORT || 30010,
    username: process.env.IMAGE_PROXY_USERNAME || 'lixometr_gmail_com',
    password: process.env.IMAGE_PROXY_PASSWORD || 'cc7a41a160',
  },
  allowNoAuthParse: true,
  cookiesPath: path.join(projectBasePath, 'cookies.json'),
  errorLogPath: path.join(projectBasePath, 'error.log'),
  infoLogPath: path.join(projectBasePath, 'info.log'),
  useClaster: process.env.USE_CLASTER ? JSON.parse(process.env.USE_CLASTER) : true,
  accountsQueueLimit: 500
};