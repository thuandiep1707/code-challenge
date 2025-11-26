interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function AmountInput({ value, onChange, placeholder = '0.00' }: Props) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min="0"
      placeholder={placeholder}
      className="w-full bg-[rgba(255,255,255,0.06)] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#feca1d] border border-[#343436]"
    />
  );
}
