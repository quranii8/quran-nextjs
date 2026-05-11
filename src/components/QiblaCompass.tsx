"use client";

import { useEffect, useState, useRef } from "react";
import { MapPin, Loader2, AlertCircle, Compass, Navigation, Smartphone } from "lucide-react";
import {
  calculateQiblaBearing,
  calculateDistanceToKaaba,
  bearingToDirection,
} from "@/lib/qibla";
import { toArabicNum } from "@/lib/utils";

type LocState =
  | { status: "loading" }
  | { status: "denied" }
  | { status: "ready"; lat: number; lng: number; city?: string };

export function QiblaCompass() {
  const [loc, setLoc] = useState<LocState>({ status: "loading" });
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [orientationActive, setOrientationActive] = useState(false);
  const [orientationError, setOrientationError] = useState<string | null>(null);
  const compassRef = useRef<HTMLDivElement>(null);

  // طلب الموقع
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoc({ status: "denied" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let city: string | undefined;
        try {
          const r = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`
          );
          const j = await r.json();
          city = j.city || j.locality || j.principalSubdivision || j.countryName;
        } catch {}
        setLoc({ status: "ready", lat, lng, city });
      },
      () => setLoc({ status: "denied" }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // تفعيل البوصلة (يحتاج إذن خاص على iOS 13+)
  const enableCompass = async () => {
    setOrientationError(null);

    // iOS 13+ requires permission
    const DeviceOrientationEventAny = (window as any).DeviceOrientationEvent;
    if (
      DeviceOrientationEventAny &&
      typeof DeviceOrientationEventAny.requestPermission === "function"
    ) {
      try {
        const perm = await DeviceOrientationEventAny.requestPermission();
        if (perm !== "granted") {
          setOrientationError("لم يتم منح إذن البوصلة");
          return;
        }
      } catch (e) {
        setOrientationError("تعذّر طلب إذن البوصلة");
        return;
      }
    }

    // أحداث Orientation
    const handler = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      let heading: number | null = null;

      // iOS: webkitCompassHeading (مباشر، صحيح)
      if (typeof e.webkitCompassHeading === "number") {
        heading = e.webkitCompassHeading;
      }
      // Android: alpha (يحتاج عكس)
      else if (e.alpha !== null && e.alpha !== undefined) {
        heading = 360 - e.alpha;
      }

      if (heading !== null) {
        setDeviceHeading(heading);
      }
    };

    const event = "ondeviceorientationabsolute" in window
      ? "deviceorientationabsolute"
      : "deviceorientation";

    window.addEventListener(event as any, handler as any, true);
    setOrientationActive(true);
  };

  // Loading
  if (loc.status === "loading") {
    return (
      <div className="card p-10 text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin" style={{ color: "var(--primary)" }} />
        <p style={{ color: "var(--text-muted)" }}>جاري تحديد موقعك...</p>
      </div>
    );
  }

  if (loc.status === "denied") {
    return (
      <div className="card p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--gold-dark)" }} />
        <h3 className="font-bold text-lg mb-2">يلزم الوصول للموقع</h3>
        <p className="mb-5 text-sm" style={{ color: "var(--text-muted)" }}>
          لحساب اتجاه القبلة بدقة، نحتاج إلى معرفة موقعك الحالي.
        </p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          <MapPin className="w-4 h-4" />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const qiblaBearing = calculateQiblaBearing(loc.lat, loc.lng);
  const distance = calculateDistanceToKaaba(loc.lat, loc.lng);
  const direction = bearingToDirection(qiblaBearing);

  // الزاوية النسبية بين القبلة واتجاه الجهاز
  const relativeBearing =
    deviceHeading !== null ? (qiblaBearing - deviceHeading + 360) % 360 : qiblaBearing;

  // هل الجهاز يشير للقبلة؟ (ضمن ±10 درجات)
  const isAligned = deviceHeading !== null && Math.abs(((relativeBearing + 180) % 360) - 180) < 10;

  return (
    <>
      {/* معلومات الموقع */}
      <div className="card p-4 mb-5 flex items-center gap-3 flex-wrap">
        <MapPin className="w-5 h-5" style={{ color: "var(--primary)" }} />
        <div className="flex-1">
          <div className="font-bold text-sm">{loc.city || "موقعك الحالي"}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            {loc.lat.toFixed(4)}°, {loc.lng.toFixed(4)}°
          </div>
        </div>
      </div>

      {/* البوصلة الرئيسية */}
      <div className="card p-6 md:p-10 text-center mb-5 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, var(--primary-soft) 0%, transparent 70%)`,
          }}
        />

        <div className="relative">
          {/* البوصلة */}
          <div
            ref={compassRef}
            className="relative mx-auto mb-6"
            style={{ width: "min(320px, 80vw)", height: "min(320px, 80vw)" }}
          >
            {/* حلقة خارجية ثابتة (الجهات) */}
            <div
              className="absolute inset-0 rounded-full border-4 transition-transform"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-soft)",
                boxShadow: "inset 0 0 30px rgba(0,0,0,.05)",
                transform: `rotate(${-(deviceHeading || 0)}deg)`,
                transition: orientationActive ? "transform 0.2s ease-out" : "none",
              }}
            >
              {/* علامات الجهات الأربع */}
              {[
                { label: "ش", angle: 0, color: "#dc2626" },
                { label: "شرق", angle: 90, color: "var(--text-muted)" },
                { label: "ج", angle: 180, color: "var(--text-muted)" },
                { label: "غرب", angle: 270, color: "var(--text-muted)" },
              ].map((d) => (
                <div
                  key={d.angle}
                  className="absolute font-bold text-base"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${d.angle}deg) translateY(-43%) rotate(${-d.angle}deg)`,
                    color: d.color,
                  }}
                >
                  {d.label}
                </div>
              ))}

              {/* علامات الدرجات */}
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "2px",
                    height: i % 6 === 0 ? "12px" : "6px",
                    background: i % 6 === 0 ? "var(--primary)" : "var(--text-muted)",
                    transform: `translate(-50%, -50%) rotate(${i * 15}deg) translateY(-46%)`,
                  }}
                />
              ))}
            </div>

            {/* الكعبة في الاتجاه الصحيح */}
            <div
              className="absolute inset-0 transition-transform"
              style={{
                transform: `rotate(${relativeBearing}deg)`,
                transition: orientationActive ? "transform 0.2s ease-out" : "transform 0.5s ease-out",
              }}
            >
              <div
                className="absolute"
                style={{
                  top: "12%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {/* رمز الكعبة */}
                <div
                  className="rounded-lg flex items-center justify-center text-2xl shadow-lg transition-all"
                  style={{
                    width: "52px",
                    height: "52px",
                    background: isAligned
                      ? "linear-gradient(135deg, var(--gold), #ffd700)"
                      : "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
                    color: isAligned ? "#000" : "var(--gold)",
                    border: `3px solid ${isAligned ? "var(--gold-light)" : "var(--gold-dark)"}`,
                    boxShadow: isAligned
                      ? "0 0 30px var(--gold), 0 0 60px var(--gold)"
                      : "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  🕋
                </div>

                {/* خط من المركز للكعبة */}
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    top: "100%",
                    width: "3px",
                    height: "calc(min(160px, 40vw) - 26px)",
                    background: `linear-gradient(to bottom, ${isAligned ? "var(--gold)" : "var(--primary)"}, transparent)`,
                  }}
                />
              </div>
            </div>

            {/* النقطة المركزية */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4"
              style={{
                background: "var(--primary)",
                borderColor: "var(--bg-elev)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />

            {/* مؤشر السهم لاتجاه الجهاز */}
            {orientationActive && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: "0", height: "0" }}
              >
                <div
                  className="absolute"
                  style={{
                    bottom: "12px",
                    left: "-8px",
                    width: "0",
                    height: "0",
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderBottom: "20px solid #dc2626",
                  }}
                />
              </div>
            )}
          </div>

          {/* المعلومات */}
          <div className="space-y-2">
            {isAligned && orientationActive ? (
              <div
                className="text-2xl font-bold animate-pulse"
                style={{ color: "var(--gold-dark)" }}
              >
                ✦ أنت تواجه القبلة الآن ✦
              </div>
            ) : orientationActive ? (
              <div className="text-base font-semibold" style={{ color: "var(--primary)" }}>
                وجّه جهازك حتى يصبح المؤشر الأحمر مع رمز الكعبة
              </div>
            ) : (
              <div className="text-base font-semibold">
                القبلة في اتجاه: <strong>{direction}</strong>
              </div>
            )}

            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              زاوية القبلة من الشمال:{" "}
              <strong style={{ color: "var(--primary)" }} dir="ltr">
                {qiblaBearing.toFixed(1)}°
              </strong>
            </div>
            {orientationActive && deviceHeading !== null && (
              <div className="text-xs" style={{ color: "var(--text-soft)" }} dir="ltr">
                Device: {deviceHeading.toFixed(0)}° • Qibla: {qiblaBearing.toFixed(0)}°
              </div>
            )}
          </div>
        </div>
      </div>

      {/* تفعيل البوصلة (للموبايل) */}
      {!orientationActive && (
        <div className="card p-5 mb-5 text-center">
          <Smartphone className="w-10 h-10 mx-auto mb-2" style={{ color: "var(--primary)" }} />
          <h3 className="font-bold mb-2">تفعيل البوصلة على الجوال</h3>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            للحصول على بوصلة تفاعلية تتبع حركة جهازك، اضغط أدناه (يعمل فقط على الموبايل).
          </p>
          <button onClick={enableCompass} className="btn btn-primary">
            <Compass className="w-4 h-4" />
            تفعيل البوصلة
          </button>
          {orientationError && (
            <div
              className="mt-3 text-xs p-2 rounded"
              style={{ background: "rgba(220,38,38,.1)", color: "#dc2626" }}
            >
              {orientationError}
            </div>
          )}
        </div>
      )}

      {/* معلومات إضافية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <div className="font-bold text-sm">المسافة إلى الكعبة</div>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
            {toArabicNum(Math.round(distance).toLocaleString("ar-EG"))} كم
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🕋</span>
            <div className="font-bold text-sm">إحداثيات الكعبة</div>
          </div>
          <div className="text-sm" style={{ color: "var(--text-muted)" }} dir="ltr">
            21.4225° N, 39.8262° E
          </div>
        </div>
      </div>

      {/* تنبيه الدقة */}
      <div
        className="mt-5 p-4 rounded-xl text-xs leading-relaxed"
        style={{
          background: "var(--bg-soft)",
          color: "var(--text-muted)",
          borderRight: "3px solid var(--gold)",
        }}
      >
        💡 <strong>ملاحظة:</strong> دقة البوصلة تعتمد على معايرة جهازك. للمعايرة على الموبايل، حرّك الجهاز على شكل رقم 8 في الهواء عدة مرات. تجنب وجود الجهاز قرب المعادن أو الأجهزة الكهربائية.
      </div>
    </>
  );
}
