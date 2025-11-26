import { useEffect, useRef, useState } from 'react';
import type { TokenInfo } from '../types/tokens.type';
import { imageBaseUrl } from '../const';

interface Props {
  tokensList: TokenInfo[];
  label: string;
  selected: TokenInfo;
  onSelect: (t: TokenInfo) => void;
}

export default function TokenDropdown({ tokensList, label, selected, onSelect }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current) return;
      if (open && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
    }, [open]);

  return (
    <div ref={ref}>
      <label className="block text-gray-200 text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full bg-[rgba(255,255,255,0.06)] text-white px-4 py-3 rounded-xl flex items-center justify-between hover:bg-[rgba(255,255,255,0.1)] transition-colors border border-[#343436]"
        >
          <div className="flex items-center gap-3">
            <img src={imageBaseUrl + selected.currency + '.svg'} alt={selected.currency} className="w-6 h-6" />
            <span className="font-medium">{selected.currency}</span>
          </div>
          <span className="text-gray-400">▼</span>
        </button>
        {open && (
          <div className="absolute z-10 w-full mt-1 bg-[#1f1f21] rounded-xl border border-[#343436] max-h-48 overflow-y-auto shadow-xl">
            {tokensList?.map((currency) => (
              <button
                key={currency.currency}
                onClick={() => {
                  onSelect(currency);
                  setOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-white hover:bg-[rgba(254,202,29,0.12)] flex items-center gap-3"
              >
                <img src={imageBaseUrl + currency.currency + '.svg'} alt={currency.currency} className="w-5 h-5" />
                <span>{currency.currency}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
