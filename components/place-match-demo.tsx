'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlaceData } from '@/lib/place-types';

// Pre-computed demo data (CORS blocks client-side fetching of Google Maps)
const demoPairs: {
  nameA: string;
  nameB: string;
  placesA: PlaceData[];
  placesB: PlaceData[];
  score: number;
  shared: string[];
}[] = [
  {
    nameA: 'Delhi Favorites',
    nameB: 'Gurgaon Foodie',
    placesA: [
      { name: 'Indian Accent', address: 'The Lodhi, New Delhi', latitude: 28.5930, longitude: 77.2270 },
      { name: 'Bukhara', address: 'ITC Maurya, New Delhi', latitude: 28.5975, longitude: 77.1723 },
      { name: 'Farzi Cafe', address: 'Connaught Place', latitude: 28.6328, longitude: 77.2197 },
      { name: 'SodaBottleOpenerWala', address: 'Cyber Hub, Gurgaon', latitude: 28.4942, longitude: 77.0888 },
      { name: 'Cafe Delhi Heights', address: 'DLF Place, Saket', latitude: 28.5245, longitude: 77.2149 },
      { name: 'Diggin', address: 'Anand Lok, New Delhi', latitude: 28.5594, longitude: 77.2237 },
    ],
    placesB: [
      { name: 'SodaBottleOpenerWala', address: 'Cyber Hub, Gurgaon', latitude: 28.4942, longitude: 77.0888 },
      { name: 'Farzi Cafe', address: 'Cyber Hub, Gurgaon', latitude: 28.4944, longitude: 77.0890 },
      { name: 'Burma Burma', address: 'Cyber Hub, Gurgaon', latitude: 28.4943, longitude: 77.0889 },
      { name: 'Cafe Delhi Heights', address: 'Cyber Hub, Gurgaon', latitude: 28.4941, longitude: 77.0887 },
      { name: 'Dhaba', address: 'DLF Cyber City', latitude: 28.4950, longitude: 77.0895 },
    ],
    score: 52.7,
    shared: ['SodaBottleOpenerWala', 'Farzi Cafe', 'Cafe Delhi Heights'],
  },
  {
    nameA: 'Tokyo Must-Visit',
    nameB: 'Kyoto Picks',
    placesA: [
      { name: 'Tsukiji Outer Market', address: 'Tsukiji, Tokyo', latitude: 35.6654, longitude: 139.7707 },
      { name: 'Ichiran Ramen', address: 'Shibuya, Tokyo', latitude: 35.6595, longitude: 139.7004 },
      { name: 'Meiji Shrine', address: 'Shibuya, Tokyo', latitude: 35.6764, longitude: 139.6993 },
      { name: 'TeamLab Borderless', address: 'Odaiba, Tokyo', latitude: 35.6257, longitude: 139.7839 },
    ],
    placesB: [
      { name: 'Fushimi Inari', address: 'Fushimi, Kyoto', latitude: 34.9671, longitude: 135.7727 },
      { name: 'Kinkaku-ji', address: 'Kita, Kyoto', latitude: 35.0394, longitude: 135.7292 },
      { name: 'Arashiyama Bamboo', address: 'Ukyo, Kyoto', latitude: 35.0170, longitude: 135.6713 },
      { name: 'Ichiran Ramen', address: 'Kawaramachi, Kyoto', latitude: 35.0040, longitude: 135.7690 },
    ],
    score: 18.5,
    shared: ['Ichiran Ramen'],
  },
];

export default function PlaceMatchDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const pair = demoPairs[activeIdx];

  return (
    <div className="my-8 rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary, #171717)' }}>
      <div className="p-4 pb-3" style={{ borderBottom: '1px solid var(--border, #262626)' }}>
        <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--fg)' }}>
          PlaceMatch Demo
        </h3>
        <div className="flex gap-2">
          {demoPairs.map((p, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor: i === activeIdx ? 'var(--accent, #fafafa)' : 'transparent',
                color: i === activeIdx ? 'var(--bg, #0a0a0a)' : 'var(--fg-muted, #888)',
                border: i === activeIdx ? 'none' : '1px solid var(--border, #333)',
              }}
            >
              {p.nameA} vs {p.nameB}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {/* Score */}
          <div className="text-center mb-4">
            <div className="text-3xl font-bold" style={{ color: 'var(--fg)' }}>
              {pair.score}%
            </div>
            <div className="text-xs" style={{ color: 'var(--fg-muted, #888)' }}>
              compatibility score
            </div>
          </div>

          {/* Shared places */}
          {pair.shared.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--fg-muted, #888)' }}>
                Shared places ({pair.shared.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {pair.shared.map((name) => (
                  <motion.span
                    key={name}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-2 py-1 rounded-md text-xs"
                    style={{
                      backgroundColor: 'var(--bg, #0a0a0a)',
                      color: 'var(--fg)',
                      border: '1px solid var(--border, #333)',
                    }}
                  >
                    {name}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Side by side lists */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--fg-muted, #888)' }}>
                {pair.nameA} ({pair.placesA.length})
              </div>
              {pair.placesA.map((p, i) => {
                const isShared = pair.shared.some(
                  (s) => s.toLowerCase() === p.name.toLowerCase()
                );
                return (
                  <div
                    key={i}
                    className="text-xs py-1 truncate"
                    style={{
                      color: isShared ? 'var(--fg)' : 'var(--fg-muted, #666)',
                      fontWeight: isShared ? 600 : 400,
                    }}
                  >
                    {isShared ? '\u2022 ' : '  '}{p.name}
                  </div>
                );
              })}
            </div>
            <div>
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--fg-muted, #888)' }}>
                {pair.nameB} ({pair.placesB.length})
              </div>
              {pair.placesB.map((p, i) => {
                const isShared = pair.shared.some(
                  (s) => s.toLowerCase() === p.name.toLowerCase()
                );
                return (
                  <div
                    key={i}
                    className="text-xs py-1 truncate"
                    style={{
                      color: isShared ? 'var(--fg)' : 'var(--fg-muted, #666)',
                      fontWeight: isShared ? 600 : 400,
                    }}
                  >
                    {isShared ? '\u2022 ' : '  '}{p.name}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div
            className="mt-4 pt-3 text-xs text-center"
            style={{ borderTop: '1px solid var(--border, #262626)', color: 'var(--fg-muted, #888)' }}
          >
            Want to try your own lists?{' '}
            <code
              className="px-1.5 py-0.5 rounded text-xs"
              style={{ backgroundColor: 'var(--bg, #0a0a0a)' }}
            >
              pip install gmaps-list
            </code>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
