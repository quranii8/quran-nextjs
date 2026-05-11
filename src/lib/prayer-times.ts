/**
 * مواقيت الصلاة عبر AlAdhan API
 * https://api.aladhan.com/v1/timings
 */

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface HijriDate {
  date: string;
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
}

export interface PrayerTimesResponse {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    gregorian: { date: string; weekday: { en: string }; month: { en: string } };
    hijri: HijriDate & { weekday: { en: string; ar: string } };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: { id: number; name: string };
  };
}

/** الحصول على مواقيت الصلاة لإحداثيات معينة */
export async function fetchPrayerTimes(
  lat: number,
  lng: number,
  method: number = 5 // 5 = Egyptian General Authority of Survey
): Promise<PrayerTimesResponse | null> {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=${method}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (e) {
    console.error("Failed to fetch prayer times:", e);
    return null;
  }
}

/** ترجمة أسماء الصلوات إلى العربية */
export const PRAYER_NAMES_AR: Record<keyof PrayerTimings, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
  Imsak: "الإمساك",
  Midnight: "منتصف الليل",
};

/** أيقونات الصلوات */
export const PRAYER_ICONS: Record<keyof PrayerTimings, string> = {
  Fajr: "🌌",
  Sunrise: "🌅",
  Dhuhr: "☀️",
  Asr: "🌤️",
  Maghrib: "🌇",
  Isha: "🌃",
  Imsak: "🍽️",
  Midnight: "🌙",
};

/** الصلوات الخمس فقط (الأهم) */
export const FIVE_PRAYERS: Array<keyof PrayerTimings> = [
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

/** يحدّد الصلاة القادمة بناءً على الوقت الحالي */
export function getNextPrayer(timings: PrayerTimings): {
  name: keyof PrayerTimings;
  time: string;
  minutesLeft: number;
} | null {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const name of FIVE_PRAYERS) {
    const timeStr = timings[name].split(" ")[0]; // remove timezone
    const [h, m] = timeStr.split(":").map(Number);
    const prayerMinutes = h * 60 + m;
    if (prayerMinutes > nowMinutes) {
      return { name, time: timeStr, minutesLeft: prayerMinutes - nowMinutes };
    }
  }
  // إذا فاتت كل صلوات اليوم → الفجر غداً
  const fajr = timings.Fajr.split(" ")[0];
  const [h, m] = fajr.split(":").map(Number);
  return {
    name: "Fajr",
    time: fajr,
    minutesLeft: 24 * 60 - nowMinutes + (h * 60 + m),
  };
}

/** طرق حساب مواقيت الصلاة المتاحة */
export const CALCULATION_METHODS = [
  { id: 1, name: "جامعة العلوم الإسلامية، كراتشي" },
  { id: 2, name: "ISNA - الجمعية الإسلامية لأمريكا الشمالية" },
  { id: 3, name: "MWL - رابطة العالم الإسلامي" },
  { id: 4, name: "أم القرى، مكة المكرمة" },
  { id: 5, name: "الهيئة المصرية العامة للمساحة" },
  { id: 8, name: "منطقة الخليج" },
  { id: 9, name: "الكويت" },
  { id: 10, name: "قطر" },
  { id: 11, name: "مجلس علماء سنغافورة" },
  { id: 12, name: "اتحاد المنظمات الإسلامية في فرنسا" },
  { id: 13, name: "تركيا - رئاسة الشؤون الدينية" },
  { id: 14, name: "الهيئة الإسلامية الروسية" },
];
