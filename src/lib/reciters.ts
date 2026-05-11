/** القراء — مع خرائط لتشغيل السور كاملة من mp3quran.net + صور حقيقية */

export interface Reciter {
  id: string;              // معرف everyayah (للتشغيل آية بآية)
  name: string;
  country: string;
  style: string;
  bitrate: string;
  /** سيرفر mp3quran للسور الكاملة (مع / في النهاية). مثال: https://server8.mp3quran.net/afs/ */
  fullSurahServer?: string;
  /** صورة القارئ (URL مباشر) */
  image?: string;
}

/**
 * ملاحظة:
 * - كل قارئ له `fullSurahServer` يحتوي على ملفات MP3 لكل السور بصيغة "001.mp3" .. "114.mp3"
 *   (مصدر: mp3quran.net — موثوق ومجاني)
 * - عندما لا يتوفر السيرفر للقارئ، يتم fallback لتشغيل آية بآية من everyayah.com
 */
export const RECITERS: Reciter[] = [
  {
    id: "Alafasy_128kbps",
    name: "مشاري راشد العفاسي",
    country: "الكويت",
    style: "مرتل",
    bitrate: "128k",
    fullSurahServer: "https://server8.mp3quran.net/afs/",
    image: "https://www.mp3quran.net/api/_image/reciters/107.jpg",
  },
  {
    id: "Husary_128kbps",
    name: "محمود خليل الحصري",
    country: "مصر",
    style: "مرتل",
    bitrate: "128k",
    fullSurahServer: "https://server13.mp3quran.net/husr/",
    image: "https://www.mp3quran.net/api/_image/reciters/54.jpg",
  },
  {
    id: "Husary_Muallim_128kbps",
    name: "الحصري — المعلم",
    country: "مصر",
    style: "تعليمي",
    bitrate: "128k",
    fullSurahServer: "https://server13.mp3quran.net/husr/Almusshaf-Al-Mu-Allim/",
    image: "https://www.mp3quran.net/api/_image/reciters/54.jpg",
  },
  {
    id: "Abdul_Basit_Murattal_64kbps",
    name: "عبد الباسط عبد الصمد",
    country: "مصر",
    style: "مرتل",
    bitrate: "64k",
    fullSurahServer: "https://server7.mp3quran.net/basit/",
    image: "https://www.mp3quran.net/api/_image/reciters/3.jpg",
  },
  {
    id: "Abdul_Basit_Mujawwad_128kbps",
    name: "عبد الباسط — مجوّد",
    country: "مصر",
    style: "مجوّد",
    bitrate: "128k",
    fullSurahServer: "https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/",
    image: "https://www.mp3quran.net/api/_image/reciters/3.jpg",
  },
  {
    id: "Minshawi_Murattal_128kbps",
    name: "محمد صديق المنشاوي",
    country: "مصر",
    style: "مرتل",
    bitrate: "128k",
    fullSurahServer: "https://server10.mp3quran.net/minsh/",
    image: "https://www.mp3quran.net/api/_image/reciters/76.jpg",
  },
  {
    id: "Minshawi_Mujawwad_64kbps",
    name: "المنشاوي — مجوّد",
    country: "مصر",
    style: "مجوّد",
    bitrate: "64k",
    fullSurahServer: "https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/",
    image: "https://www.mp3quran.net/api/_image/reciters/76.jpg",
  },
  {
    id: "Abdurrahmaan_As-Sudais_192kbps",
    name: "عبد الرحمن السديس",
    country: "السعودية",
    style: "مرتل",
    bitrate: "192k",
    fullSurahServer: "https://server11.mp3quran.net/sds/",
    image: "https://www.mp3quran.net/api/_image/reciters/4.jpg",
  },
  {
    id: "Saood_ash-Shuraym_128kbps",
    name: "سعود الشريم",
    country: "السعودية",
    style: "مرتل",
    bitrate: "128k",
    fullSurahServer: "https://server7.mp3quran.net/shur/",
    image: "https://www.mp3quran.net/api/_image/reciters/14.jpg",
  },
  {
    id: "Maher_AlMuaiqly_64kbps",
    name: "ماهر المعيقلي",
    country: "السعودية",
    style: "مرتل",
    bitrate: "64k",
    fullSurahServer: "https://server12.mp3quran.net/maher/",
    image: "https://www.mp3quran.net/api/_image/reciters/35.jpg",
  },
  {
    id: "Hudhaify_128kbps",
    name: "علي بن عبد الرحمن الحذيفي",
    country: "السعودية",
    style: "مرتل",
    bitrate: "128k",
    fullSurahServer: "https://server8.mp3quran.net/hthifi/",
    image: "https://www.mp3quran.net/api/_image/reciters/22.jpg",
  },
  {
    id: "Ahmed_ibn_Ali_al-Ajamy_128kbps",
    name: "أحمد بن علي العجمي",
    country: "السعودية",
    style: "مرتل",
    bitrate: "128k",
    fullSurahServer: "https://server10.mp3quran.net/ajm/",
    image: "https://www.mp3quran.net/api/_image/reciters/16.jpg",
  },
  {
    id: "Yasser_Ad-Dussary_128kbps",
    name: "ياسر الدوسري",
    country: "السعودية",
    style: "مرتل",
    bitrate: "128k",
    fullSurahServer: "https://server11.mp3quran.net/yasser/",
    image: "https://www.mp3quran.net/api/_image/reciters/118.jpg",
  },
  {
    id: "Saad_al-Ghaamidi_40kbps",
    name: "سعد الغامدي",
    country: "السعودية",
    style: "مرتل",
    bitrate: "40k",
    fullSurahServer: "https://server7.mp3quran.net/s_gmd/",
    image: "https://www.mp3quran.net/api/_image/reciters/13.jpg",
  },
  {
    id: "Abu_Bakr_Ash-Shaatree_128kbps",
    name: "أبو بكر الشاطري",
    country: "السعودية",
    style: "مرتل",
    bitrate: "128k",
    fullSurahServer: "https://server11.mp3quran.net/shatri/",
    image: "https://www.mp3quran.net/api/_image/reciters/31.jpg",
  },
  {
    id: "Mohammad_al_Tablaway_128kbps",
    name: "محمد الطبلاوي",
    country: "مصر",
    style: "مرتل",
    bitrate: "128k",
    fullSurahServer: "https://server16.mp3quran.net/tblawi/",
    image: "https://www.mp3quran.net/api/_image/reciters/72.jpg",
  },
  {
    id: "Hani_Rifai_192kbps",
    name: "هاني الرفاعي",
    country: "السعودية",
    style: "مرتل",
    bitrate: "192k",
    fullSurahServer: "https://server8.mp3quran.net/rifai/",
    image: "https://www.mp3quran.net/api/_image/reciters/30.jpg",
  },
  {
    id: "Khalifa_Taniji_64kbps",
    name: "خليفة الطنيجي",
    country: "الإمارات",
    style: "مرتل",
    bitrate: "64k",
    fullSurahServer: "https://server16.mp3quran.net/tunaiji/",
    image: "https://www.mp3quran.net/api/_image/reciters/33.jpg",
  },
  {
    id: "Salaah_AbdulRahman_Bukhatir_128kbps",
    name: "صلاح بوخاطر",
    country: "الإمارات",
    style: "مرتل",
    bitrate: "128k",
    fullSurahServer: "https://server11.mp3quran.net/sabukhatir/",
    image: "https://www.mp3quran.net/api/_image/reciters/15.jpg",
  },
  {
    id: "Mishary_Rashid_al_Afasy_KFGQPC",
    name: "العفاسي — مصحف المدينة",
    country: "الكويت",
    style: "مرتل",
    bitrate: "—",
    fullSurahServer: "https://server8.mp3quran.net/afs/",
    image: "https://www.mp3quran.net/api/_image/reciters/107.jpg",
  },
];

export const getReciter = (id: string): Reciter | undefined =>
  RECITERS.find((r) => r.id === id);

export const DEFAULT_RECITER_ID = "Alafasy_128kbps";

/** يبني URL تشغيل السورة كاملة من mp3quran */
export function getFullSurahUrl(reciter: Reciter, surahNumber: number): string | null {
  if (!reciter.fullSurahServer) return null;
  const padded = String(surahNumber).padStart(3, "0");
  return `${reciter.fullSurahServer}${padded}.mp3`;
}
