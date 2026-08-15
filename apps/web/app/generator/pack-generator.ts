export type AssetKind = 'sticker' | 'emoji';
export type PackTheme = { id: string; name: string; signal: string; description: string; colors: [string, string, string]; marks: string[]; phrases: string[] };
export type GeneratedAsset = { id: string; label: string; svg: string; filename: string };

export const packThemes: PackTheme[] = [
  { id: 'neon', name: 'Neon Reactions', signal: 'LOUD / SOCIAL', description: 'Electric reactions with vivid edges and punchy type.', colors: ['#9d5cff', '#ff4fc8', '#39e7ff'], marks: ['⚡', '🔥', '💥', '✨', '👀', '🫶', '🚀', '🎉', '💜', '😈', '✅', '‼'], phrases: ["LET'S GO", 'ICONIC', 'NO WAY', 'BIG MOOD', 'OBSESSED', 'MAGIC', 'YES!', 'WILD', 'GLOW UP', 'CHAOS', 'DONE', 'LOUDER'] },
  { id: 'pup', name: 'Pup Energy', signal: 'CUTE / CHAOTIC', description: 'Chunky forms, mascot charm and maximum frisky energy.', colors: ['#ffb23f', '#ff5b7f', '#6d5cff'], marks: ['🐾', '🐶', '🦴', '🎾', '💨', '💛', '😎', '🥳', '😴', '🤩', '🙌', '⭐'], phrases: ['WOOF', 'GOOD VIBES', 'ZOOMIES', 'PLAY?', 'ON MY WAY', 'BESTIE', 'COOL PUP', 'PARTY', 'NAP MODE', 'WOW', 'HIGH FIVE', 'GOOD JOB'] },
  { id: 'runes', name: 'Mystic Runes', signal: 'ARCANE / LORE', description: 'Ritual circles, cosmic gradients and mysterious signals.', colors: ['#6b4cff', '#00d7c7', '#ffc857'], marks: ['☾', '✦', '◉', '△', '∞', '☼', '◇', '✧', '⚶', '◌', '✺', '⬡'], phrases: ['AWAKEN', 'ALIGNED', 'SIGNAL', 'ENTER', 'BOUND', 'SEEN', 'REVEAL', 'ASCEND', 'CAST', 'OPEN', 'ORACLE', 'AURA'] },
  { id: 'soft', name: 'Soft Moods', signal: 'CALM / EVERYDAY', description: 'Gentle gradients for daily feelings and check-ins.', colors: ['#7dd9c7', '#9aa7ff', '#ff94bd'], marks: ['☺', '♡', '☁', '🌱', '🫧', '🌈', '🧸', '🌸', '☕', '🫠', '🥹', '💌'], phrases: ['HI', 'LOVE YOU', 'REST', 'GROWING', 'BREATHE', 'YAY', 'COMFY', 'SWEET', 'COFFEE?', 'MELTING', 'THANK YOU', 'MISS YOU'] }
];

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]!);

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) { result ^= value.charCodeAt(index); result = Math.imul(result, 16777619); }
  return Math.abs(result);
}

export function generatePack(theme: PackTheme, kind: AssetKind, count: number, packName: string, seed: number): GeneratedAsset[] {
  const size = kind === 'sticker' ? 512 : 100;
  return Array.from({ length: count }, (_, index) => {
    const slot = (index + seed) % theme.marks.length;
    const mark = theme.marks[slot];
    const label = theme.phrases[slot];
    const rotation = (hash(`${packName}-${seed}-${index}`) % 17) - 8;
    const [a, b, c] = [theme.colors[slot % 3], theme.colors[(slot + 1) % 3], theme.colors[(slot + 2) % 3]];
    const safeId = `${theme.id}${kind}${seed}${index}`;
    const markSize = kind === 'sticker' ? 178 : 54;
    const markY = kind === 'sticker' ? 226 : 61;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="g${safeId}" x2="1" y2="1"><stop stop-color="${a}"/><stop offset=".52" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient><filter id="s${safeId}" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dy="${kind === 'sticker' ? 14 : 3}" stdDeviation="${kind === 'sticker' ? 15 : 3}" flood-color="#090511" flood-opacity=".55"/></filter></defs><g transform="rotate(${rotation} ${size / 2} ${size / 2})" filter="url(#s${safeId})"><rect x="${size * 0.07}" y="${size * 0.07}" width="${size * 0.86}" height="${size * 0.86}" rx="${size * 0.29}" fill="url(#g${safeId})" stroke="#fff" stroke-width="${kind === 'sticker' ? 18 : 4}"/><path d="M ${size * 0.15} ${size * 0.31} Q ${size * 0.5} ${size * 0.02} ${size * 0.84} ${size * 0.26}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${kind === 'sticker' ? 10 : 2}" stroke-linecap="round"/><text x="50%" y="${markY}" text-anchor="middle" font-size="${markSize}" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif" fill="#fff">${escapeXml(mark)}</text>${kind === 'sticker' ? `<rect x="70" y="318" width="372" height="108" rx="54" fill="#10091d" fill-opacity=".88"/><text x="256" y="389" text-anchor="middle" font-size="58" font-weight="900" letter-spacing="-2" font-family="Inter,Arial,sans-serif" fill="#fff">${escapeXml(label)}</text>` : ''}</g></svg>`;
    const baseName = (packName || theme.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return { id: `${safeId}-${label}`, label, svg, filename: `${baseName}-${kind}-${String(index + 1).padStart(2, '0')}.png` };
  });
}

export async function svgToPng(svg: string): Promise<Blob> {
  const sourceUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Artwork render failed')); image.src = sourceUrl; });
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas export is unavailable');
    context.drawImage(image, 0, 0);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG export failed')), 'image/png'));
  } finally { URL.revokeObjectURL(sourceUrl); }
}
