'use client';

import { motion } from 'framer-motion';
import type { PlaceData } from '@/lib/place-types';

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
];

interface PlaceGridProps {
  places: PlaceData[];
  title?: string;
}

export default function PlaceGrid({ places, title }: PlaceGridProps) {
  return (
    <div className="my-8">
      {title && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--fg)' }}>
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place, i) => (
          <motion.div
            key={`${place.name}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary, #171717)' }}
          >
            <div
              className="h-28 flex items-end justify-end p-2"
              style={{ background: gradients[i % gradients.length] }}
            >
              {place.latitude != null && place.longitude != null && (
                <span className="text-xs font-mono text-white/70">
                  {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </span>
              )}
            </div>
            <div className="p-3">
              <h4
                className="text-sm font-medium mb-1 truncate"
                style={{ color: 'var(--fg)' }}
              >
                {place.name}
              </h4>
              <p
                className="text-xs mb-2 truncate min-h-[1.2em]"
                style={{ color: 'var(--fg-muted, #888)' }}
              >
                {place.address || '\u00A0'}
              </p>
              {place.google_maps_url && (
                <a
                  href={place.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:underline"
                  style={{ color: 'var(--accent, #4facfe)' }}
                >
                  Open in Maps &rarr;
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
