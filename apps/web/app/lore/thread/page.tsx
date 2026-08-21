'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const chapters = [
  { id: 'before-the-name', label: 'Before the name', number: '01' },
  { id: 'the-room-keeps-weather', label: 'The room keeps weather', number: '02' },
  { id: 'a-practice-of-noticing', label: 'A practice of noticing', number: '03' },
  { id: 'leave-a-light', label: 'Leave a light', number: '04' }
];

const chapterCopy = [
  {
    id: 'before-the-name',
    eyebrow: 'CHAPTER 01 · ORIGIN',
    title: 'Before the name, there was the signal.',
    paragraphs: [
      'LORE began as a way of keeping a small appointment with the world. Not a database. Not a feed. A place to set down the things that changed the temperature of a day: a face seen once, a sentence overheard, the blue edge of a shadow at 5:14 pm.',
      'We called these things fragments because they arrived without instructions. A fragment does not ask to be solved. It asks to be carried for a little while, to be turned over until the shape of the question becomes more interesting than the answer.'
    ],
    quote: 'A fragment is not incomplete. It is still in motion.',
    aura: 'Tender Static'
  },
  {
    id: 'the-room-keeps-weather',
    eyebrow: 'CHAPTER 02 · ATMOSPHERE',
    title: 'The room keeps weather.',
    paragraphs: [
      'Every interior has a forecast. The kitchen after an argument. The bus shelter after rain. The bedroom at the exact moment a person decides to stay awake. We move through these climates mostly without naming them, which does not make them less real.',
      'An Aura is a way of naming without closing the door. It is a color held near a feeling, a temporary instrument for recognizing what is already present. Deep Water is not sadness. Afterglow is not joy. They are conditions in which attention can become more precise.'
    ],
    quote: 'Name the weather lightly. It may change while you are speaking.',
    aura: 'Deep Water'
  },
  {
    id: 'a-practice-of-noticing',
    eyebrow: 'CHAPTER 03 · METHOD',
    title: 'Attention is a form of making.',
    paragraphs: [
      'To notice is not to stand outside an experience and record it cleanly. Noticing changes the thing. The photograph makes a threshold. The sentence makes a room around an absence. The ritual prompt is a match held near the ordinary until it gives off a little light.',
      'This is why the archive does not arrange itself by importance. It follows resonance instead. A field note may sit beside a portrait; a cover may lead to a prompt; a person may become a doorway into a color they did not know they were carrying.'
    ],
    quote: 'The smallest act of attention can redraw the map.',
    aura: 'Night Bloom'
  },
  {
    id: 'leave-a-light',
    eyebrow: 'CHAPTER 04 · INVITATION',
    title: 'Leave a light for the next thing.',
    paragraphs: [
      'There is no final room in LORE. The index remains open because a finished archive would be a kind of forgetting. What matters is not accumulation, but the gentle evidence that something passed through here and was met with care.',
      'Take a fragment with you. Make a cover. Draw a card when the beginning feels too far away. Save what follows you home. Then leave a light on for the next person—not as a promise of a crowd, but as a sign that the room can still be entered.'
    ],
    quote: 'We keep the door open by making the next small thing possible.',
    aura: 'Afterglow'
  }
];

export default function ThreadPage() {
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);

  useEffect(() => {
    const savedProgress = Number(window.localStorage.getItem('lore-thread-progress') ?? 0);
    if (savedProgress > 0) {
      window.scrollTo({ top: savedProgress, behavior: 'instant' as ScrollBehavior });
    }

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
      setProgress(nextProgress);
      window.localStorage.setItem('lore-thread-progress', String(window.scrollY));
      const visibleChapter = chapterCopy.find((chapter) => {
        const element = document.getElementById(chapter.id);
        return element && element.getBoundingClientRect().top < window.innerHeight * 0.42;
      });
      if (visibleChapter) setActiveChapter(visibleChapter.id);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.72, behavior: 'smooth' });
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.72, behavior: 'smooth' });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const chapterIndex = useMemo(() => chapters.findIndex((chapter) => chapter.id === activeChapter), [activeChapter]);

  return (
    <main className="thread-page">
      <div className="thread-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      <header className="thread-header">
        <Link href="/" className="thread-back">← <span>Return to LORE</span></Link>
        <div className="thread-header-meta"><span>THE CANON THREAD</span><span>{String(Math.max(0, chapterIndex) + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</span></div>
      </header>

      <section className="thread-hero">
        <p className="lore-label">A LONG-FORM READING EXPERIENCE</p>
        <h1>The Canon Thread</h1>
        <p className="thread-dek">A short field guide to the weather inside a room, the things we keep, and the practice of making enough space to notice.</p>
        <div className="thread-hero-line"><span>LORE / VOL. 01</span><span>{progress}% remembered</span></div>
      </section>

      <div className="thread-reader-layout">
        <aside className="thread-chapter-nav" aria-label="Thread chapters">
          <p className="lore-label">CHAPTERS</p>
          <ol>
            {chapters.map((chapter) => <li key={chapter.id}><a className={activeChapter === chapter.id ? 'is-active' : ''} href={`#${chapter.id}`}><span>{chapter.number}</span>{chapter.label}</a></li>)}
          </ol>
          <p className="thread-keyboard-note">Use ↑ ↓ to read<br />Print view available</p>
        </aside>

        <article className="thread-copy">
          {chapterCopy.map((chapter, index) => (
            <section id={chapter.id} className="thread-chapter" key={chapter.id}>
              <p className="lore-label">{chapter.eyebrow}</p>
              <h2>{chapter.title}</h2>
              {chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <blockquote><span>“</span>{chapter.quote}</blockquote>
              <div className="thread-aura-ref"><span className="thread-aura-dot" style={{ background: ['#d7a8ff', '#74d8ff', '#b7e8bd', '#ffb38a'][index] }} /><span>Related Aura</span><strong>{chapter.aura}</strong><Link href="/#world">Explore ↗</Link></div>
            </section>
          ))}
          <footer className="thread-footer"><p className="lore-label">END OF THREAD / BEGIN AGAIN</p><h2>What will you leave a light on for?</h2><Link className="lore-button lore-button-primary" href="/#rituals">Draw a ritual <span aria-hidden="true">↘</span></Link></footer>
        </article>
      </div>

      <section className="thread-related" aria-labelledby="thread-related-title"><div><p className="lore-label">RELATED ARTIFACTS</p><h2 id="thread-related-title">Carry the thread elsewhere.</h2></div><div className="thread-related-grid"><Link href="/#cover"><span>01</span><strong>Compose a cover</strong><small>Personal artifact · local export</small></Link><Link href="/#shelf"><span>02</span><strong>Open your Shelf</strong><small>Saved in this browser</small></Link><Link href="/#rituals"><span>03</span><strong>Draw a ritual</strong><small>A prompt for the next room</small></Link></div></section>
    </main>
  );
}
