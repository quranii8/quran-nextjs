"use client";

import { create } from "zustand";

export interface AudioQueueItem {
  surah: number;
  verse?: number;       // غير موجود في وضع "السورة الكاملة"
  url: string;
  title: string;
  subtitle: string;
  /** نوع الملف:
   * - "full": ملف صوتي للسورة كاملة (mp3quran)
   * - "ayah": ملف صوتي لآية واحدة (everyayah)
   */
  type: "full" | "ayah";
}

interface AudioState {
  queue: AudioQueueItem[];
  index: number;
  isPlaying: boolean;
  isVisible: boolean;
  currentTime: number;
  duration: number;
  /** تكرار: off | one | all */
  repeat: "off" | "one" | "all";

  setQueue: (q: AudioQueueItem[], startIndex?: number) => void;
  setIndex: (i: number) => void;
  setPlaying: (p: boolean) => void;
  setVisible: (v: boolean) => void;
  setProgress: (cur: number, dur: number) => void;
  toggleRepeat: () => void;
  next: () => void;
  prev: () => void;
  close: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  queue: [],
  index: 0,
  isPlaying: false,
  isVisible: false,
  currentTime: 0,
  duration: 0,
  repeat: "off",

  setQueue: (q, startIndex = 0) =>
    set({ queue: q, index: startIndex, isVisible: true, isPlaying: true, currentTime: 0, duration: 0 }),
  setIndex: (i) => set({ index: i, currentTime: 0 }),
  setPlaying: (p) => set({ isPlaying: p }),
  setVisible: (v) => set({ isVisible: v }),
  setProgress: (cur, dur) => set({ currentTime: cur, duration: dur }),
  toggleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    })),
  next: () => {
    const { queue, index, repeat } = get();
    if (index < queue.length - 1) set({ index: index + 1, isPlaying: true, currentTime: 0 });
    else if (repeat === "all") set({ index: 0, isPlaying: true, currentTime: 0 });
  },
  prev: () => {
    const { index } = get();
    if (index > 0) set({ index: index - 1, isPlaying: true, currentTime: 0 });
  },
  close: () => set({ isVisible: false, isPlaying: false, queue: [], currentTime: 0, duration: 0 }),
}));
