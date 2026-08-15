export type AssetKind = 'sticker' | 'emoji';
export type PackTheme = { id: 'neon' | 'flash' | 'runes' | 'soft'; name: string; signal: string; description: string; colors: [string, string, string]; phrases: string[] };
export type GeneratedAsset = { id: string; label: string; svg: string; filename: string };

export const packThemes: PackTheme[] = [
  { id: 'neon', name: 'Voltage Type', signal: 'NIGHT / LOUD', description: 'Die-cut black type, chrome flashes and nightclub voltage.', colors: ['#ff3dbb', '#27e5ff', '#b974ff'], phrases: ["LET'S GO", 'ICONIC', 'NO WAY', 'BIG MOOD', 'OBSESSED', 'MAGIC', 'YES!', 'WILD', 'GLOW UP', 'CHAOS', 'DONE', 'LOUDER'] },
  { id: 'flash', name: 'Lucky Damage', signal: 'TATTOO / GRAPHIC', description: 'Old-school flash motifs, heavy ink and sharp ribbon lettering.', colors: ['#f2b72f', '#e5483f', '#3155d9'], phrases: ['LUCKY', 'NO MERCY', 'BURN', 'ALL IN', 'OBSESSED', 'MAGIC', 'STAY WILD', 'PARTY', 'NIGHT OWL', 'WOW', 'HIGH FIVE', 'GOOD JOB'] },
  { id: 'runes', name: 'Ritual Signals', signal: 'ARCANE / PRECISE', description: 'Fine-line sigils, astronomical geometry and restrained metallic light.', colors: ['#8f70ff', '#43e6ce', '#e8bd62'], phrases: ['AWAKEN', 'ALIGNED', 'SIGNAL', 'ENTER', 'BOUND', 'SEEN', 'REVEAL', 'ASCEND', 'CAST', 'OPEN', 'ORACLE', 'AURA'] },
  { id: 'soft', name: 'Tender Things', signal: 'TACTILE / QUIET', description: 'Puffy organic forms with tiny faces, soft shadows and gentle color.', colors: ['#86d9c7', '#a7aef8', '#ff9ebc'], phrases: ['HI', 'LOVE YOU', 'REST', 'GROWING', 'BREATHE', 'YAY', 'COMFY', 'SWEET', 'COFFEE?', 'MELTING', 'THANK YOU', 'MISS YOU'] }
];

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]!);
const uid = (theme: string, kind: string, seed: number, index: number) => `${theme}${kind}${seed}${index}`;

function neonArt(label: string, size: number, id: string, slot: number, kind: AssetKind) {
  const pink = slot % 2 ? '#27e5ff' : '#ff3dbb';
  const blue = slot % 2 ? '#ff3dbb' : '#27e5ff';
  const short = label.replace(/\s/g, '').slice(0, kind === 'emoji' ? 2 : 20);
  const font = kind === 'emoji' ? 38 : label.length > 8 ? 58 : 76;
  return `<defs><linearGradient id="c${id}"><stop stop-color="${pink}"/><stop offset="1" stop-color="${blue}"/></linearGradient><filter id="n${id}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dy="${size * .035}" stdDeviation="${size * .025}" flood-color="#000" flood-opacity=".8"/><feDropShadow stdDeviation="${size * .015}" flood-color="${pink}" flood-opacity=".8"/></filter></defs><g filter="url(#n${id})" transform="rotate(${slot % 2 ? 4 : -5} ${size / 2} ${size / 2})"><path d="M${size*.09} ${size*.31} L${size*.2} ${size*.1} L${size*.48} ${size*.15} L${size*.68} ${size*.07} L${size*.91} ${size*.28} L${size*.84} ${size*.72} L${size*.63} ${size*.92} L${size*.38} ${size*.85} L${size*.14} ${size*.91} Z" fill="#09080d" stroke="#fff" stroke-width="${size*.035}"/><path d="M${size*.15} ${size*.27} L${size*.82} ${size*.18} M${size*.21} ${size*.79} L${size*.86} ${size*.68}" stroke="url(#c${id})" stroke-width="${size*.018}"/><text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-family="Impact,Arial Black,sans-serif" font-style="italic" font-size="${font}" letter-spacing="${kind === 'emoji' ? -2 : -4}" fill="#fff" stroke="url(#c${id})" stroke-width="${size*.012}" paint-order="stroke">${escapeXml(short)}</text><path d="M${size*.68} ${size*.2} l${size*.05} ${size*.1} ${size*.11} ${size*.04} -${size*.1} ${size*.05} -${size*.05} ${size*.11} -${size*.02} -${size*.12} -${size*.11} -${size*.05} ${size*.11} -${size*.02}z" fill="${pink}"/></g>`;
}

function flashArt(label: string, size: number, id: string, slot: number, kind: AssetKind) {
  const motif = slot % 4;
  const drawing = motif === 0
    ? `<path d="M${size*.5} ${size*.72} C${size*.38} ${size*.58} ${size*.2} ${size*.47} ${size*.22} ${size*.29} C${size*.24} ${size*.13} ${size*.43} ${size*.14} ${size*.5} ${size*.29} C${size*.57} ${size*.14} ${size*.76} ${size*.13} ${size*.78} ${size*.29} C${size*.8} ${size*.47} ${size*.62} ${size*.58} ${size*.5} ${size*.72}Z" fill="#e5483f"/>`
    : motif === 1
      ? `<path d="M${size*.57} ${size*.12} L${size*.27} ${size*.52} L${size*.47} ${size*.5} L${size*.38} ${size*.84} L${size*.73} ${size*.39} L${size*.52} ${size*.42}Z" fill="#f2b72f"/>`
      : motif === 2
        ? `<path d="M${size*.14} ${size*.46} Q${size*.5} ${size*.12} ${size*.86} ${size*.46} Q${size*.5} ${size*.8} ${size*.14} ${size*.46}Z" fill="#f5e6c8"/><ellipse cx="${size*.5}" cy="${size*.46}" rx="${size*.14}" ry="${size*.2}" fill="#3155d9"/><circle cx="${size*.5}" cy="${size*.46}" r="${size*.065}" fill="#171119"/>`
        : `<path d="M${size*.5} ${size*.1} L${size*.59} ${size*.37} L${size*.88} ${size*.37} L${size*.64} ${size*.54} L${size*.73} ${size*.82} L${size*.5} ${size*.65} L${size*.27} ${size*.82} L${size*.36} ${size*.54} L${size*.12} ${size*.37} L${size*.41} ${size*.37}Z" fill="#3155d9"/>`;
  return `<defs><filter id="f${id}" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dy="${size*.04}" stdDeviation="${size*.018}" flood-color="#000" flood-opacity=".48"/></filter></defs><g filter="url(#f${id})" transform="rotate(${slot%2?4:-4} ${size/2} ${size/2})"><g stroke="#19131a" stroke-width="${size*.045}" stroke-linejoin="round" paint-order="stroke">${drawing}</g><path d="M${size*.16} ${size*.67} Q${size*.5} ${size*.57} ${size*.84} ${size*.67} L${size*.78} ${size*.87} Q${size*.5} ${size*.78} ${size*.22} ${size*.87}Z" fill="#f5e6c8" stroke="#19131a" stroke-width="${size*.035}"/>${kind==='sticker'?`<text x="50%" y="78%" text-anchor="middle" font-family="Georgia,serif" font-weight="900" font-size="${label.length>8?38:50}" fill="#19131a">${escapeXml(label)}</text>`:`<circle cx="50%" cy="76%" r="${size*.055}" fill="#e5483f"/>`}</g>`;
}

function runeArt(label: string, size: number, id: string, slot: number, kind: AssetKind) {
  const rings = [3, 4, 6, 8][slot % 4];
  const spokes = Array.from({length:rings},(_,i)=>{const a=(Math.PI*2*i/rings)-Math.PI/2;return `<line x1="${size*.5}" y1="${size*.5}" x2="${size*(.5+Math.cos(a)*.29)}" y2="${size*(.5+Math.sin(a)*.29)}"/>`;}).join('');
  return `<defs><radialGradient id="r${id}"><stop stop-color="#8f70ff" stop-opacity=".35"/><stop offset=".7" stop-color="#141129" stop-opacity=".65"/><stop offset="1" stop-color="#080812" stop-opacity="0"/></radialGradient><filter id="rg${id}"><feDropShadow stdDeviation="${size*.012}" flood-color="#43e6ce" flood-opacity=".7"/></filter></defs><g filter="url(#rg${id})"><circle cx="50%" cy="48%" r="44%" fill="url(#r${id})"/><g fill="none" stroke="${slot%2?'#e8bd62':'#a99aff'}" stroke-width="${size*.009}" opacity=".95"><circle cx="50%" cy="48%" r="34%"/><circle cx="50%" cy="48%" r="24%" stroke-dasharray="${size*.025} ${size*.022}"/>${spokes}<polygon points="${size*.5},${size*.2} ${size*.73},${size*.62} ${size*.27},${size*.62}"/><circle cx="50%" cy="48%" r="${size*.055}" fill="#43e6ce" fill-opacity=".25"/></g>${kind==='sticker'?`<text x="50%" y="90%" text-anchor="middle" font-family="Georgia,serif" font-size="28" letter-spacing="8" fill="#f3ead3">${escapeXml(label)}</text>`:''}</g>`;
}

function softArt(label: string, size: number, id: string, slot: number, kind: AssetKind) {
  const [a,b]=slot%2?['#a7aef8','#ff9ebc']:['#86d9c7','#ffe0a3'];
  const faceY=size*.5;
  return `<defs><linearGradient id="s${id}" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><filter id="sf${id}" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dy="${size*.045}" stdDeviation="${size*.035}" flood-color="#4f4b75" flood-opacity=".3"/></filter></defs><g filter="url(#sf${id})" transform="rotate(${slot%2?2:-2} ${size/2} ${size/2})"><path d="M${size*.2} ${size*.37} Q${size*.22} ${size*.17} ${size*.42} ${size*.2} Q${size*.58} ${size*.08} ${size*.69} ${size*.26} Q${size*.9} ${size*.27} ${size*.84} ${size*.48} Q${size*.93} ${size*.66} ${size*.73} ${size*.74} Q${size*.6} ${size*.91} ${size*.43} ${size*.78} Q${size*.21} ${size*.85} ${size*.18} ${size*.64} Q${size*.05} ${size*.48} ${size*.2} ${size*.37}Z" fill="url(#s${id})" stroke="#fff" stroke-opacity=".8" stroke-width="${size*.035}"/><ellipse cx="${size*.42}" cy="${faceY}" rx="${size*.025}" ry="${size*.035}" fill="#3e4059"/><ellipse cx="${size*.58}" cy="${faceY}" rx="${size*.025}" ry="${size*.035}" fill="#3e4059"/><path d="M${size*.45} ${size*.58} Q${size*.5} ${size*(slot%3===0?.64:.54)} ${size*.55} ${size*.58}" fill="none" stroke="#3e4059" stroke-width="${size*.014}" stroke-linecap="round"/><circle cx="${size*.34}" cy="${size*.57}" r="${size*.035}" fill="#ff7895" opacity=".45"/><circle cx="${size*.66}" cy="${size*.57}" r="${size*.035}" fill="#ff7895" opacity=".45"/>${kind==='sticker'?`<text x="50%" y="87%" text-anchor="middle" font-family="Arial Rounded MT Bold,Arial,sans-serif" font-size="${label.length>8?34:44}" fill="#fff">${escapeXml(label)}</text>`:''}</g>`;
}

export function generatePack(theme: PackTheme, kind: AssetKind, count: number, packName: string, seed: number): GeneratedAsset[] {
  const size = kind === 'sticker' ? 512 : 100;
  return Array.from({ length: count }, (_, index) => {
    const slot = (index + seed) % theme.phrases.length;
    const label = theme.phrases[slot];
    const id = uid(theme.id, kind, seed, index);
    const art = theme.id === 'neon' ? neonArt(label,size,id,slot,kind) : theme.id === 'flash' ? flashArt(label,size,id,slot,kind) : theme.id === 'runes' ? runeArt(label,size,id,slot,kind) : softArt(label,size,id,slot,kind);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${art}</svg>`;
    const baseName = (packName || theme.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return { id: `${id}-${label}`, label, svg, filename: `${baseName}-${kind}-${String(index + 1).padStart(2, '0')}.png` };
  });
}

export async function svgToPng(svg: string): Promise<Blob> {
  const sourceUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('Artwork render failed'));image.src=sourceUrl;});
    const canvas=document.createElement('canvas'); canvas.width=image.naturalWidth; canvas.height=image.naturalHeight;
    const context=canvas.getContext('2d'); if(!context) throw new Error('Canvas export is unavailable'); context.drawImage(image,0,0);
    return await new Promise<Blob>((resolve,reject)=>canvas.toBlob((blob)=>blob?resolve(blob):reject(new Error('PNG export failed')),'image/png'));
  } finally { URL.revokeObjectURL(sourceUrl); }
}
