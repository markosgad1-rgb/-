import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.company.attendance',
  appName: 'الحضور والانصراف',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
