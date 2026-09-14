import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { AttendanceLocation, TaskLocation } from '../types';

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

/** Great-circle distance between two coordinates, in meters (Haversine formula). */
export function distanceInMeters(a: AttendanceLocation, b: TaskLocation): number {
  const EARTH_RADIUS_M = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

export function isWithinTaskRadius(location: AttendanceLocation, task: TaskLocation): boolean {
  return distanceInMeters(location, task) <= task.radiusMeters;
}
