import { motion } from 'framer-motion';
import { useState } from 'react';
import { EditableLabel } from '../form';

/**
 * AdvancedDetailsContent — Figma node 5938:51057.
 */

function AmountInput({
  value,
  onChange,
  placeholder,
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
        className="w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '24px 28px',
        }}
      >
        {/* Left: amount inputs */}
        <div className="flex flex-col items-start" style={{ gap: 8 }}>
          <EditableLabel>Travel Charges</EditableLabel>
          <AmountInput value={travel} onChange={setTravel} placeholder="Enter Amount" />
        </div>
        <div className="flex flex-col items-start" style={{ gap: 8 }}>
          <EditableLabel>Accommodation Charges</EditableLabel>
          <AmountInput
            value={accommodation}
            onChange={setAccommodation}
            placeholder="Enter Amount"
          />
        </div>

        {/* Right: totals card — spans remaining space */}
        <div
          className="flex items-center shrink-0"
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: 12,
            gap: 8,
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
