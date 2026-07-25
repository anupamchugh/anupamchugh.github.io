export type FontPresetName = 'brian' | 'space' | 'plex' | 'work';

export const activeFontPreset: FontPresetName = 'plex';

export const fontPresets: Record<FontPresetName, { label: string }> = {
  brian: { label: 'brian lovin' },
  space: { label: 'space grotesk + source serif' },
  plex: { label: 'ibm plex sans + ibm plex serif' },
  work: { label: 'work sans + source serif' },
};
