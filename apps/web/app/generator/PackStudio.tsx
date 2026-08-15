'use client';

import { useMemo, useState } from 'react';
import JSZip from 'jszip';
import Image from 'next/image';
import { AssetKind, generatePack, packThemes, svgToPng } from './pack-generator';

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PackStudio() {
  const [kind, setKind] = useState<AssetKind>('sticker');
  const [themeId, setThemeId] = useState('neon');
  const [packName, setPackName] = useState('Friday Energy');
  const [count, setCount] = useState(8);
  const [seed, setSeed] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const theme = packThemes.find((item) => item.id === themeId) ?? packThemes[0];
  const assets = useMemo(() => generatePack(theme, kind, count, packName.trim(), seed), [theme, kind, count, packName, seed]);

  const exportOne = async (index: number) => {
    const asset = assets[index];
    download(await svgToPng(asset.svg), asset.filename);
    setMessage(`${asset.label} exported`);
  };

  const exportAll = async () => {
    setExporting(true); setMessage('');
    try {
      const zip = new JSZip();
      const artwork = zip.folder('artwork');
      for (const asset of assets) artwork?.file(asset.filename, await svgToPng(asset.svg));
      const manifest = { name: packName || theme.name, format: kind, theme: theme.name, assetCount: assets.length, generatedAt: new Date().toISOString(), assets: assets.map(({ id, label, filename }) => ({ id, label, filename })) };
      zip.file('manifest.json', JSON.stringify(manifest, null, 2));
      zip.file('README.txt', `STIX MΛGIC — ${manifest.name}\n\n${manifest.assetCount} ${manifest.format} assets\nTheme: ${manifest.theme}\n\nPNG artwork is inside /artwork.`);
      const slug = (packName || theme.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      download(await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }), `${slug}-${kind}-pack.zip`);
      setMessage(`${assets.length}-piece ${kind} pack exported`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Pack export failed'); }
    finally { setExporting(false); }
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#070b15]/90 shadow-2xl shadow-violet-950/30">
      <header className="flex flex-col justify-between gap-6 border-b border-white/10 bg-[radial-gradient(circle_at_10%_0%,rgba(168,85,247,.22),transparent_40%)] px-5 py-8 sm:px-9 lg:flex-row lg:items-end">
        <div><p className="font-mono text-[10px] font-bold tracking-[.22em] text-accent-violet">✦ GENERATIVE PACK LAB</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] text-text sm:text-6xl">One idea. A whole pack.</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">Create a coherent visual universe as full stickers or compact emojis, preview every piece, then export a production-ready bundle.</p></div>
        <div className="hidden text-right sm:block"><strong className="block text-4xl text-accent-cyan">{assets.length}</strong><span className="font-mono text-[9px] tracking-[.16em] text-muted">READY TO EXPORT</span></div>
      </header>
      <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-6 border-b border-white/10 bg-black/10 p-5 lg:border-b-0 lg:border-r lg:p-7">
          <fieldset><legend className="mb-2 font-mono text-[9px] font-bold tracking-[.16em] text-muted">ASSET FORMAT</legend><div className="grid grid-cols-2 gap-2">{(['sticker', 'emoji'] as AssetKind[]).map((value) => <button key={value} type="button" onClick={() => setKind(value)} className={`min-h-11 rounded-xl border text-xs font-semibold capitalize transition ${kind === value ? 'border-violet-400 bg-violet-500/20 text-white' : 'border-white/10 text-muted hover:border-white/25'}`}>{value === 'sticker' ? '◫ Stickers' : '☺ Emojis'}</button>)}</div></fieldset>
          <label className="block"><span className="mb-2 block font-mono text-[9px] font-bold tracking-[.16em] text-muted">PACK NAME</span><input aria-label="Pack name" value={packName} maxLength={32} onChange={(event) => setPackName(event.target.value)} className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-text outline-none transition focus:border-violet-400" /></label>
          <fieldset><legend className="mb-2 font-mono text-[9px] font-bold tracking-[.16em] text-muted">VISUAL UNIVERSE</legend><div className="space-y-2">{packThemes.map((item) => <button type="button" key={item.id} onClick={() => setThemeId(item.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${themeId === item.id ? 'border-violet-400/70 bg-white/5' : 'border-transparent hover:bg-white/5'}`}><span className="flex">{item.colors.map((color) => <i key={color} className="-ml-1 h-7 w-3 rounded-full border border-[#070b15] first:ml-0" style={{ background: color }} />)}</span><span><strong className="block text-xs text-text">{item.name}</strong><small className="font-mono text-[8px] tracking-[.12em] text-muted">{item.signal}</small></span></button>)}</div></fieldset>
          <fieldset><legend className="mb-2 font-mono text-[9px] font-bold tracking-[.16em] text-muted">PACK SIZE</legend><div className="grid grid-cols-3 gap-2">{[4, 8, 12].map((value) => <button type="button" key={value} onClick={() => setCount(value)} className={`min-h-11 rounded-xl border text-xs ${count === value ? 'border-violet-400 bg-violet-500/20 text-white' : 'border-white/10 text-muted'}`}>{value}</button>)}</div></fieldset>
          <button type="button" onClick={() => setSeed((value) => value + 1)} className="min-h-12 w-full rounded-xl border border-cyan-400/40 text-xs font-semibold text-accent-cyan transition hover:bg-cyan-400/10">↻ Remix this pack</button>
        </aside>
        <div className="min-w-0 p-5 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="font-mono text-[9px] font-bold tracking-[.16em] text-muted">{theme.signal}</p><h2 className="mt-2 text-2xl font-semibold text-text">{packName || theme.name}</h2><p className="mt-1 text-xs text-muted">{theme.description}</p></div><span className="w-fit rounded-full border border-white/10 px-3 py-2 font-mono text-[9px] tracking-[.1em] text-muted">⬡ {kind === 'sticker' ? '512' : '100'} CANVAS</span></div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">{assets.map((asset, index) => <button type="button" key={asset.id} onClick={() => exportOne(index)} className="group min-w-0 rounded-2xl border border-white/10 bg-white/[.025] p-2 text-left transition hover:-translate-y-1 hover:border-violet-400/50"><Image unoptimized width={kind === 'sticker' ? 512 : 100} height={kind === 'sticker' ? 512 : 100} className={`aspect-square w-full object-contain drop-shadow-xl ${kind === 'emoji' ? 'p-[12%]' : ''}`} src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(asset.svg)}`} alt={`${asset.label} ${kind} preview`} /><span className="flex items-center justify-between gap-2 px-1 pb-1 pt-2"><strong className="truncate text-[10px] text-text">{asset.label}</strong><span className="text-muted group-hover:text-accent-cyan">⇩</span></span></button>)}</div>
          <button type="button" disabled={exporting} onClick={exportAll} className="mt-6 min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-violet-950/40 transition hover:brightness-110 disabled:opacity-50">{exporting ? 'Forging pack…' : `⇩ Export all ${assets.length} ${kind}s`}</button>
          <p role="status" aria-live="polite" className="mt-3 min-h-5 text-center text-xs text-accent-cyan">{message}</p>
        </div>
      </div>
    </section>
  );
}
