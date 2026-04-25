import { motion } from 'framer-motion';
import { useState } from 'react';
import { EditableLabel } from '../form';

/**
 * AdvancedDetailsContent — Figma node 5938:51057.
 *
 * Locked spec:
 *   Row layout    : input pair (gap 24) · gap 120 · totals card (497px)
 *                   wraps to next line (24px row-gap) when row would overflow
 *   Input field   : 300×40 · padding 10/12 · radius 12 · bg white · 1px #5A72A5
 *                   placeholder Poppins Medium 14 / #5A72A5
 *   Totals card   : self-stretch · padding 12 · gap 8 · radius 16 · bg white · w-497
 *                   contains 2 FetchField cells (each flex-1)
 *   FetchField    : bg #F2F6FD · border 1px #BED0F4 · padding 8/20 · gap 4 · radius 12
 *                   label Poppins Medium 14 / #2D3953
 *                   value Poppins SemiBold 16 / #255AC3 (Total DA)
 *                                            #2C6C13 (Total — green)
 */

function AmountInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
      placeholder={placeholder}
      className="font-poppins w-full outline-none transition-shadow focus:ring-2 focus:ring-[#255AC3]/30 placeholder:text-[#5A72A5]"
      style={{
        height: 40,
        padding: '10px 12px',
        borderRadius: 12,
        border: '1px solid #5A72A5',
        background: '#FFFFFF',
        fontSize: 14,
        fontWeight: 500,
        color: '#142952',
        lineHeight: 'normal',
      }}
    />
  );
}

function FetchCell({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div
      className="flex flex-col items-start flex-1 min-w-0 font-poppins"
      style={{
        background: '#F2F6FD',
        border: '1px solid #BED0F4',
        borderRadius: 12,
        padding: '8px 20px',
        gap: 4,
      }}
    >
      <p style={{ fontSize: 14, fontWeight: 500, color: '#2D3953', lineHeight: 'normal' }}>
        {label}
      </p>
      <p style={{ fontSize: 16, fontWeight: 600, color: valueColor, lineHeight: 'normal' }}>
        {value}
      </p>
    </div>
  );
}

export function AdvancedDetailsContent() {
  const [travel, setTravel] = useState('');
  const [accommodation, setAccommodation] = useState('');

  const totalDA = 30000;
  const total = (Number(travel) || 0) + (Number(accommodation) || 0) + totalDA;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div
        className="flex flex-wrap items-center w-full"
        style={{ columnGap: 120, rowGap: 24 }}
      >
        {/* Left: amount inputs */}
        <div className="flex flex-wrap items-end" style={{ columnGap: 24, rowGap: 24 }}>
          <div className="flex flex-col items-start" style={{ gap: 8, width: 300 }}>
            <EditableLabel>Travel Charges</EditableLabel>
            <AmountInput value={travel} onChange={setTravel} placeholder="Enter Amount" />
          </div>
          <div className="flex flex-col items-start" style={{ gap: 8, width: 300 }}>
            <EditableLabel>Accommodation Charges</EditableLabel>
            <AmountInput
              value={accommodation}
              onChange={setAccommodation}
              placeholder="Enter Amount"
            />
          </div>
        </div>

        {/* Right: totals card */}
        <div
          className="flex items-center shrink-0"
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: 12,
            gap: 8,
            width: 497,
            maxWidth: '100%',
          }}
        >
          <FetchCell label="Total DA" value={totalDA.toLocaleString()} valueColor="#255AC3" />
          <FetchCell label="Total" value={total.toLocaleString()} valueColor="#2C6C13" />
        </div>
      </div>
    </motion.div>
  );
}
