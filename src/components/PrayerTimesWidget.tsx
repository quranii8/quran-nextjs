"use client";

import { useEffect, useState } from "react";
import { MapPin, Loader2, AlertCircle, Clock, Settings } from "lucide-react";
import {
  fetchPrayerTimes,
  PrayerTimesResponse,
  PRAYER_NAMES_AR,
  PRAYER_ICONS,
  FIVE_PRAYERS,
  getNextPrayer,
  CALCULATION_METHODS,
} from "@/lib/prayer-times";
import { toArabicNum } from "@/lib/utils";

type LocationState =
  | { status: "idle" }
  | { status: "loading"; message: string }
  | { status: "denied" }
  | { status: "ready"; lat: number; lng: number; city?: string };

export function PrayerTimesWidget() {
  const [location, setLocation] = useState<LocationState>({ status: "idle" });
  const [data, setData] = useState<PrayerTimesResponse | null>(null);
  const [method, setMethod] = useState(5);
  const [tick, setTick] = useState(0); // لإعادة حساب الصلاة القادمة كل دقيقة
  const [showSettings, setShowSettings] = useState(false);

  // Update every 60s
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation({ status: "denied" });
      return;
    }
    setLocation({ status: "loading", message: "جاري تحديد موقعك..." });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // محاولة جلب اسم المدينة من Reverse Geocoding (BigDataCloud مجاني وبدون مفتاح)
        let city: string | undefined;
        try {
          const r = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`
          );
          const j = await r.json();
          city = j.city || j.locality || j.principalSubdivision || j.countryName;
        } catch {}
        setLocation({ status: "ready", lat, lng, city });
      },
      (err) => {
        console.error(err);
        setLocation({ status: "denied" });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  };

  // طلب الموقع تلقائياً عند الفتح
  useEffect(() => {
    requestLocation();
  }, []);

  // جلب المواقيت عند توفر الموقع
  useEffect(() => {
    if (location.status !== "ready") return;
    setData(null);
    fetchPrayerTimes(location.lat, location.lng, method).then(setData);
  }, [location, method]);

  const next = data ? getNextPrayer(data.timings) : null;

  // Loading
  if (location.status === "loading" || location.status === "idle") {
    return (
      <div className="card p-10 text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin" style={{ color: "var(--primary)" }} />
        <p style={{ color: "var(--text-muted)" }}>
          {location.status === "loading" ? location.message : "جاري التحضير..."}
        </p>
      </div>
    );
  }

  // Permission denied
  if (location.status === "denied") {
    return (
      <div className="card p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--gold-dark)" }} />
        <h3 className="font-bold text-lg mb-2">يرجى السماح بالوصول للموقع</h3>
        <p className="mb-5 text-sm" style={{ color: "var(--text-muted)" }}>
          نحتاج إذن الموقع لحساب مواقيت الصلاة الدقيقة. لن نحفظ موقعك أو نشاركه مع أي طرف ثالث.
        </p>
        <button onClick={requestLocation} className="btn btn-primary">
          <MapPin className="w-4 h-4" />
          إعادة طلب الموقع
        </button>
      </div>
    );
  }

  return (
    <>
      {/* الموقع */}
      <div className="card p-4 mb-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="w-5 h-5" style={{ color: "var(--primary)" }} />
          <div>
            <div className="font-bold text-sm">
              {location.city || "الموقع الحالي"}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn btn-outline !py-1.5 !px-3 !text-xs"
        >
          <Settings className="w-3.5 h-3.5" />
          طريقة الحساب
        </button>
      </div>

      {/* إعدادات الحساب */}
      {showSettings && (
        <div className="card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">طريقة حساب المواقيت:</div>
          <select
            value={method}
            onChange={(e) => setMethod(parseInt(e.target.value))}
            className="w-full p-2 rounded-lg text-sm outline-none"
            style={{
              background: "var(--bg-soft)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            {CALCULATION_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {!data ? (
        <div className="card p-10 text-center">
          <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin" style={{ color: "var(--primary)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>جاري تحميل المواقيت...</p>
        </div>
      ) : (
        <>
          {/* الصلاة القادمة */}
          {next && (
            <div
              className="rounded-3xl p-8 text-white text-center mb-5 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))" }}
            >
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 80% 20%, white, transparent 50%)",
                }}
              />
              <div className="relative">
                <div className="text-sm opacity-90 mb-1">الصلاة القادمة</div>
                <div className="text-5xl mb-2">{PRAYER_ICONS[next.name]}</div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {PRAYER_NAMES_AR[next.name]}
                </div>
                <div className="text-2xl font-bold tabular-nums" dir="ltr">
                  {next.time}
                </div>
                <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur text-sm">
                  <Clock className="w-4 h-4 inline ml-1" />
                  {next.minutesLeft >= 60
                    ? `بعد ${toArabicNum(Math.floor(next.minutesLeft / 60))} ساعة و ${toArabicNum(next.minutesLeft % 60)} دقيقة`
                    : `بعد ${toArabicNum(next.minutesLeft)} دقيقة`}
                </div>
              </div>
            </div>
          )}

          {/* جميع المواقيت */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {FIVE_PRAYERS.map((p) => {
              const isNext = next?.name === p;
              return (
                <div
                  key={p}
                  className="card p-5 flex items-center justify-between transition-all"
                  style={{
                    borderColor: isNext ? "var(--primary)" : undefined,
                    borderWidth: isNext ? "2px" : "1px",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{PRAYER_ICONS[p]}</span>
                    <div>
                      <div className="font-bold">{PRAYER_NAMES_AR[p]}</div>
                      {isNext && (
                        <div
                          className="text-xs font-semibold"
                          style={{ color: "var(--primary)" }}
                        >
                          ⬅ الصلاة القادمة
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="text-xl font-bold tabular-nums"
                    dir="ltr"
                    style={{ color: isNext ? "var(--primary)" : "var(--text)" }}
                  >
                    {data.timings[p].split(" ")[0]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* مواقيت إضافية */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {(["Sunrise", "Imsak", "Midnight"] as const).map((p) => (
              <div key={p} className="card p-3 text-center">
                <div className="text-xl mb-1">{PRAYER_ICONS[p]}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {PRAYER_NAMES_AR[p]}
                </div>
                <div className="font-bold text-sm tabular-nums" dir="ltr">
                  {data.timings[p].split(" ")[0]}
                </div>
              </div>
            ))}
          </div>

          {/* التاريخ */}
          <div
            className="card p-4 text-center text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <strong>{data.date.hijri.weekday.ar}</strong>،{" "}
            {toArabicNum(data.date.hijri.day)} {data.date.hijri.month.ar}{" "}
            {toArabicNum(data.date.hijri.year)} هـ
            <span className="mx-2">•</span>
            {data.date.gregorian.date}
          </div>
        </>
      )}
    </>
  );
}
