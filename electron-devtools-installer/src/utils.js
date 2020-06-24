import { app, net } from 'electron';
import fs from 'fs';
import path from 'path';
import https from 'https';

export const getPath = () => {
  const savePath = app.getPath('userData');
  return path.resolve(`${savePath}/extensions`);
};

// Use https.get fallback for Electron < 1.4.5
const request = net ? net.request : https.get;

export const downloadFile = (from, to) => {
  return new Promise((resolve, reject) => {
    const req = request(from);
    req.on('response', (res) => {
      // Shouldn't handle redirect with `electron.net`, this is for https.get fallback
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, to).then(resolve).catch(reject);
      }
      res.pipe(fs.createWriteStream(to)).on('close', resolve);
      res.on('error', reject);
    });
    req.on('error', reject);
    req.end();
  });
};

export const changePermissions = (dir, mode) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    fs.chmodSync(filePath, parseInt(mode, 8));
    if (fs.statSync(filePath).isDirectory()) {
      changePermissions(filePath, mode);
    }
  });
};
