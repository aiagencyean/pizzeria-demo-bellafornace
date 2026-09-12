import { useState } from 'react';
import { restaurant } from '@/data/restaurant.config';

export default function DeliveryCheck() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<'idle' | 'yes' | 'no'>('idle');

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length < 4) return;
    setResult(restaurant.deliveryPostalCodes.includes(trimmed) ? 'yes' : 'no');
  };

  return (
    <div>
      <form onSubmit={check} className="flex max-w-sm gap-2">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setResult('idle');
          }}
          inputMode="numeric"
          placeholder="Postleitzahl eingeben"
          className="w-full rounded-full border border-charcoal-900/15 bg-white px-5 py-3 text-base outline-none focus:border-tomato-500 sm:text-sm"
        />
        <button type="submit" className="btn-primary shrink-0">
          Prüfen
        </button>
      </form>

      {result === 'yes' && (
        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-basil-600 animate-fade-in">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-basil-500 text-white">✓</span>
          Wir liefern in dein Gebiet!
        </p>
      )}
      {result === 'no' && (
        <p className="mt-3 text-sm font-medium text-tomato-600 animate-fade-in">
          Leider liefern wir aktuell nicht in dieses Gebiet — Abholung ist aber jederzeit möglich.
        </p>
      )}
    </div>
  );
}
