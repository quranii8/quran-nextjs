/**
 * حساب اتجاه القبلة (الكعبة المشرفة في مكة المكرمة)
 * باستخدام صيغة Great Circle Bearing (الدائرة العظمى)
 */

// إحداثيات الكعبة المشرفة (مكة المكرمة)
export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * يحسب الزاوية (bearing) من الموقع الحالي إلى الكعبة
 * النتيجة: 0° = شمال، 90° = شرق، 180° = جنوب، 270° = غرب
 */
export function calculateQiblaBearing(lat: number, lng: number): number {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const Δλ = toRad(KAABA_LNG - lng);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360; // تطبيع إلى [0, 360)
}

/**
 * يحسب المسافة بالكيلومترات بين موقع المستخدم والكعبة
 * (Haversine formula)
 */
export function calculateDistanceToKaaba(lat: number, lng: number): number {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const Δφ = toRad(KAABA_LAT - lat);
  const Δλ = toRad(KAABA_LNG - lng);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * تحويل الزاوية إلى وصف عربي (الجهة الجغرافية)
 */
export function bearingToDirection(bearing: number): string {
  const directions = [
    "الشمال", "الشمال الشرقي", "الشرق", "الجنوب الشرقي",
    "الجنوب", "الجنوب الغربي", "الغرب", "الشمال الغربي",
  ];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}
