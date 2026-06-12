import { notFound } from 'next/navigation';
import { GalleryGrid, Panel } from '@stixmagic/ui';
import { PACK_CATEGORY_LABELS } from '@stixmagic/types';
import { loadPipelineManifest } from '../../integrations/manifest';

interface PackDetailPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const manifest = await loadPipelineManifest();
  return manifest.packs.map((pack) => ({ id: pack.id }));
}

export default async function PackDetailPage({ params }: PackDetailPageProps) {
  const manifest = await loadPipelineManifest();
  const pack = manifest.packs.find((p) => p.id === params.id);

  if (!pack) {
    notFound();
  }

  const packAssets = manifest.assets.filter((a) => a.packId === pack.id);

  return (
    <div className="space-y-8 pb-10">
      <Panel>
        <div className="flex flex-wrap items-start gap-3">
          <span className="inline-flex rounded-full border border-white/10 bg-panel-secondary px-4 py-1 text-xs font-medium text-accent-violet">
            {PACK_CATEGORY_LABELS[pack.category]}
          </span>
          {pack.featured && (
            <span className="inline-flex rounded-full bg-accent-primary px-4 py-1 text-xs font-semibold text-text">
              Featured
            </span>
          )}
          {pack.plan && (
            <span className="inline-flex rounded-full border border-white/10 bg-panel-secondary px-4 py-1 text-xs font-medium text-accent-cyan">
              {pack.plan}
            </span>
          )}
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text sm:text-5xl">{pack.name}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">{pack.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-sm text-muted">{pack.assetCount} assets</span>
          <div className="flex gap-1.5">
            {pack.formats.map((fmt) => (
              <span
                key={fmt}
                className="rounded bg-panel-secondary px-2 py-0.5 text-[10px] font-mono text-accent-cyan"
              >
                {fmt}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pack.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Panel>

      {packAssets.length > 0 ? (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-text">Assets in this pack</h2>
          <GalleryGrid assets={packAssets} />
        </div>
      ) : (
        <Panel variant="secondary">
          <p className="text-sm text-muted">
            Asset previews for this pack will appear here once the pipeline manifest is populated.
          </p>
        </Panel>
      )}

      <Panel variant="secondary">
        <h2 className="text-base font-semibold text-text">Pipeline metadata</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted/60">Pack ID</dt>
            <dd className="mt-0.5 font-mono text-xs text-accent-cyan">{pack.id}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted/60">Manifest version</dt>
            <dd className="mt-0.5 font-mono text-xs text-accent-cyan">{manifest.version}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted/60">Generated at</dt>
            <dd className="mt-0.5 text-xs text-muted">{manifest.generatedAt}</dd>
          </div>
        </dl>
      </Panel>
    </div>
  );
}
