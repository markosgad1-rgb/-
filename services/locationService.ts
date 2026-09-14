import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { AttendanceLocation } from '../types';

export class LocationError extends Error {}

export async function getCurrentLocation(): Promise<AttendanceLocation> {
  if (Capacitor.isNativePlatform()) {
    const permission = await Geolocation.checkPermissions();
    if (permission.location !== 'granted') {
      const requested = await Geolocation.requestPermissions();
      if (requested.location !== 'granted') {
        throw new LocationError('لم يتم منح إذن الوصول إلى الموقع');
      }
    }
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
    } catch (err) {
      throw new LocationError('تعذر تحديد الموقع الحالي، تأكد من تفعيل خدمة الموقع');
    }
  }

  // Web fallback (for local dev/testing in a browser)
  if (!('geolocation' in navigator)) {
    throw new LocationError('المتصفح لا يدعم تحديد الموقع');
  }

  return new Promise<AttendanceLocation>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      () => reject(new LocationError('تعذر تحديد الموقع الحالي، تأكد من تفعيل خدمة الموقع')),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  });
}

export function formatLocation(location: AttendanceLocation | null): string {
  if (!location) return 'غير متاح';
  return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
}

export function mapsLinkFor(location: AttendanceLocation | null): string | null {
  if (!location) return null;
  return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
}
