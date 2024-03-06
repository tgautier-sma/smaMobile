import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.smabtp.smaMobile',
  appName: 'sma-mobile',
  webDir: 'dist/sma-mobile/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
