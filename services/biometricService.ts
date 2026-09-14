import { Capacitor } from '@capacitor/core';
import { NativeBiometric } from 'capacitor-native-biometric';

export class BiometricError extends Error {}

export async function isBiometricAvailable(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const result = await NativeBiometric.isAvailable();
    return result.isAvailable;
  } catch {
    return false;
  }
}

/**
 * Prompts for a fingerprint/biometric scan before an attendance action is recorded.
 * On the web (dev/testing outside an Android device) there is no fingerprint sensor,
 * so we fall back to a confirmation step instead of failing outright.
 */
export async function verifyBiometric(reason: string): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return window.confirm(`محاكاة بصمة الإصبع (وضع المتصفح):\n${reason}\n\nمتابعة؟`);
  }

  const available = await isBiometricAvailable();
  if (!available) {
    throw new BiometricError('جهازك لا يدعم بصمة الإصبع أو لم يتم تسجيل أي بصمة بعد');
  }

  try {
    await NativeBiometric.verifyIdentity({
      reason,
      title: 'تأكيد الهوية',
      subtitle: 'استخدم بصمة الإصبع لتسجيل الحضور',
      description: reason,
    });
    return true;
  } catch {
    throw new BiometricError('فشل التحقق من بصمة الإصبع');
  }
}
