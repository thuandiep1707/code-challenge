
import { useEffect, useMemo, useState } from 'react';
import type { TokenInfo } from './types/tokens.type';
import TokenDropdown from './components/TokenDropdown';
import AmountInput from './components/AmountInput';
import { baseApiUrl } from './const';

export default function App() {
  const [tokenList, setTokenList] = useState<TokenInfo[]>([]);

  const [fromCurrency, setFromCurrency] = useState<TokenInfo>({
    currency: '',
    date: '',
    price: 0,
  });
  const [toCurrency, setToCurrency] = useState<TokenInfo>({
    currency: '',
    date: '',
    price: 0,
  });
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const [loadingRates, setLoadingRates] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadingRates(true);
        const res = await fetch(baseApiUrl).then(res => res.json());
        const defaultFromToken = res?.filter((item: TokenInfo) => item.currency === 'USD')[0] || res[0];
        const defaultToToken = res?.filter((item: TokenInfo) => item.currency === 'ETH')[0] || res[1];
        setFromCurrency(defaultFromToken);
        setToCurrency(defaultToToken);
        setTokenList(res);
      } catch (e) {
       setError('Unable to fetch token prices. Please try again.');
      } finally {
        setLoadingRates(false);
      }
    })();
  }, []);
  
  const exchangeRate = useMemo(() => {
    const fromPrice = fromCurrency.price;
    const toPrice = toCurrency.price;
    if (!fromPrice || !toPrice) return null;
    return fromPrice / toPrice;
  }, [fromCurrency, toCurrency]);

  const handleFromAmountChange = (value: string) => {
    setError(null);
    setFromAmount(value);
    const num = Number(value);
    if (!value) { setToAmount(''); return; }
    if (Number.isNaN(num) || num < 0) { setError('Amount must be a non-negative number'); return; }
    if (!exchangeRate) { setError('No exchange rate available for this pair'); setToAmount(''); return; }
    setToAmount((num * exchangeRate).toFixed(6));
  };

  const handleToAmountChange = (value: string) => {
    setError(null);
    setToAmount(value);
    const num = Number(value);
    if (!value) { setFromAmount(''); return; }
    if (Number.isNaN(num) || num < 0) { setError('Amount must be a non-negative number'); return; }
    if (!exchangeRate) { setError('No exchange rate available for this pair'); setFromAmount(''); return; }
    setFromAmount((num / exchangeRate).toFixed(6));
  };

  const handleSwap = () => {
    setError(null);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!fromAmount || !toAmount) { setError('Please enter both amounts'); return; }
    if (fromCurrency.currency === toCurrency.currency) { setError('Tokens must be different'); return; }
    if (!exchangeRate) { setError('No exchange rate available for this pair'); return; }
    setSubmitLoading(true);
    await new Promise(res => setTimeout(res, 1200));
    setSubmitLoading(false);
    alert(`Swapping ${fromAmount} ${fromCurrency.currency} to ${toAmount} ${toCurrency.currency}`);
  };

  return (
    <article className="relative flex flex-col item-center gap-2 w-full max-w-[620px] h-full max-h-[85vh] bg-[#262628] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-6 md:p-8 mt-8 mb-auto border border-[#2f2f31]">
      {loadingRates &&<div className="absolute inset-0 bg-[#262628] z-20 flex justify-center items-center rounded-3xl border-[#2f2f31]">
        <div className="w-10 h-10 border-3 border-x-[#feca1d] border-y-transparent rounded-full animate-spin"></div>
      </div>}
      <div className="w-full text-center text-[28px] md:text-[30px] font-bold text-white uppercase tracking-wide py-4 mb-6 rounded-xl bg-[rgba(255,255,255,0.04)]">
        Currency Swap
      </div>
      {exchangeRate && (
        <div className="text-center text-gray-300 text-sm mb-2">
          1 {fromCurrency.currency} ≈ {exchangeRate.toFixed(6)} {toCurrency.currency}
        </div>
      )}
      <TokenDropdown
        tokensList={tokenList}
        label="You Send"
        selected={fromCurrency}
        onSelect={(t) => setFromCurrency(t)}
      />
      <AmountInput
        value={fromAmount}
        onChange={(v) => handleFromAmountChange(v)}
        placeholder="0.00"
      />
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSwap}
          className="bg-[#feca1d] hover:bg-[#ffdb59] text-black font-bold p-3 rounded-full transition-all transform shadow-[0_8px_30px_rgba(254,202,29,0.35)]"
        >
          <svg className="w-6 h-6 hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>
      <TokenDropdown
        tokensList={tokenList}
        label="You Receive"
        selected={toCurrency}
        onSelect={(t) => setToCurrency(t)}
      />
      <AmountInput
        value={toAmount}
        onChange={(v) => handleToAmountChange(v)}
        placeholder="0.00"
      />

     {error && (
        <div className="w-full mb-4 px-4 py-3 rounded-xl bg-[rgba(255,86,86,0.12)] border border-[#5a2a2a] text-[#ffb4b4] text-sm">
          {error}
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={!fromAmount || !toAmount || submitLoading || !exchangeRate}
        className="w-full bg-[#feca1d] disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl uppercase transition-colors shadow-[0_8px_30px_rgba(254,202,29,0.35)] flex items-center justify-center gap-2 mt-auto mb-0"
      >
        {submitLoading ? (
                  <div className="w-6 h-6 border-2 border-x-white border-y-transparent rounded-full animate-spin"></div>
        ): 'Submit'}
      </button>
    </article>
  );
}