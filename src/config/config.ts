import * as path from 'path';
const projectBasePath = path.join(__dirname, '..', '..');
export const config = {
  imageProxy: {
    host: '130.255.172.127',
    port: 30010,
    username: 'lixometr_gmail_com',
    password: 'cc7a41a160',
  },
  allowNoAuthParse: true,
  cookiesPath: path.join(projectBasePath, 'cookies.json'),
  errorLogPath: path.join(projectBasePath, 'error.log'),
  infoLogPath: path.join(projectBasePath, 'info.log'),
};
