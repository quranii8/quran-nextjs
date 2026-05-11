/** بناء avatar SVG أنيق لكل قارئ بألوان مختلفة (deterministic بناءً على الاسم) */

const ARABIC_COLORS = [
  ["#1B5E20", "#C8A951"], // أخضر/ذهبي
  ["#0D9488", "#F59E0B"], // tealر/كهرماني
  ["#7C3AED", "#FBBF24"], // بنفسجي/أصفر
  ["#0EA5E9", "#FB923C"], // سماوي/برتقالي
  ["#DC2626", "#FCD34D"], // أحمر/ذهبي
  ["#059669", "#A78BFA"], // زمردي/ليلكي
  ["#9333EA", "#34D399"], // بنفسجي/zümru
  ["#0891B2", "#FBBF24"], // فيروزي/أصفر
  ["#BE185D", "#F0ABFC"], // وردي/فوشيا
  ["#7C2D12", "#FED7AA"], // بنّي/خوخي
];

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * يُرجع SVG data URI لـ avatar إسلامي أنيق
 * - دائرة بتدرج لوني فريد لكل قارئ
 * - زخرفة هندسية إسلامية في الخلفية
 * - الحرف الأول من الاسم في المنتصف
 */
export function getReciterAvatar(name: string, size: number = 200): string {
  const seed = hashCode(name);
  const palette = ARABIC_COLORS[seed % ARABIC_COLORS.length];
  const [c1, c2] = palette;
  const initial = name.trim().charAt(0);
  const fontSize = size * 0.45;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <pattern id="p${seed}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.06)"/>
    </pattern>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#g${seed})"/>
  <rect width="${size}" height="${size}" fill="url(#p${seed})"/>
  <!-- نجمة ثمانية إسلامية -->
  <g opacity="0.12" transform="translate(${size / 2}, ${size / 2})">
    <path d="M0,-${size * 0.42} L${size * 0.13},-${size * 0.13} L${size * 0.42},0 L${size * 0.13},${size * 0.13} L0,${size * 0.42} L-${size * 0.13},${size * 0.13} L-${size * 0.42},0 L-${size * 0.13},-${size * 0.13} Z" fill="white"/>
    <path d="M0,-${size * 0.42} L${size * 0.42},0 L0,${size * 0.42} L-${size * 0.42},0 Z" fill="none" stroke="white" stroke-width="2" transform="rotate(22.5)"/>
  </g>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        font-family="'Amiri', 'Noto Naskh Arabic', serif"
        font-size="${fontSize}" fill="white" font-weight="700"
        style="text-shadow: 0 2px 4px rgba(0,0,0,0.2)">${initial}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * يحاول إرجاع صورة القارئ الحقيقية، وعند الفشل يستخدم avatar SVG
 */
export function getReciterImageOrAvatar(name: string, customImage?: string, size: number = 200): string {
  return customImage || getReciterAvatar(name, size);
}
