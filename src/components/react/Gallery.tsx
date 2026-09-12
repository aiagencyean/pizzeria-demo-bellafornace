import { useEffect, useState } from 'react';
import type { GalleryPhoto } from '@/data/gallery';

interface Props {
  photos: GalleryPhoto[];
}

export default function Gallery({ photos }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [activeIndex, photos.length]);

  return (
    <>
      <div className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setActiveIndex(i)}
            className={`group relative overflow-hidden rounded-xl ${
              photo.span === 'tall' ? 'row-span-2' : ''
            } ${photo.span === 'wide' ? 'col-span-2' : ''}`}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-charcoal-900/0 transition-colors group-hover:bg-charcoal-900/10" />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal-900/90 p-4 animate-fade-in">
          <button
            onClick={() => setActiveIndex(null)}
            aria-label="Schließen"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => setActiveIndex((activeIndex - 1 + photos.length) % photos.length)}
            aria-label="Vorheriges Bild"
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <img
            src={photos[activeIndex].src}
            alt={photos[activeIndex].alt}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-lifted"
          />
          <button
            onClick={() => setActiveIndex((activeIndex + 1) % photos.length)}
            aria-label="Nächstes Bild"
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
