import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { CaretDown, IconCheck } from '../icons';
import { EditableLabel, NextButton } from '../form';
import { DatePicker, TimePicker } from '../pickers';

type Props = { onNext: () => void };

/**
 * TransferTravelJourneyContent — Figma node 5938:50909.
 * Visual spec is locked to the Figma design; inputs are wired to real
 * native pickers (date/time) and a custom dropdown so the section is
 * interactive end-to-end.
 */

type FieldProps = { label: ReactNode; required?: boolean; width?: number | string; children: ReactNode };

function FieldGroup({ label, required, width, children }: FieldProps) {
  return (
    <div className="flex flex-col items-start shrink-0" style={{ gap: 8, width }}>
      <EditableLabel required={required}>{label}</EditableLabel>
      {children}
    </div>
  );
}

const inputBaseStyle = {
  height: 40,
  padding: '10px 12px',
  borderRadius: 12,
  border: '1px solid #5A72A5',
  background: '#FFFFFF',
};

const inputTextStyle = {
  fontSize: 14,
  fontWeight: 500,
  color: '#142952',
  lineHeight: 'normal' as const,
};

/* ─── Plain text field ─── */

function TextField({
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
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="font-poppins w-full outline-none transition-shadow focus:ring-2 focus:ring-[#255AC3]/30 placeholder:text-[#5A72A5]"
      style={{ ...inputBaseStyle, ...inputTextStyle }}
    />
  );
}

/* ─── Conveyance dropdown ─── */

function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center w-full transition-shadow hover:shadow-[0_2px_8px_-4px_rgba(37,90,195,0.4)]"
        style={{ height: 40 }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="flex flex-1 items-center font-poppins min-w-0 text-left"
          style={{
            height: 40,
            padding: '10px 12px',
            borderTop: '1px solid #5A72A5',
            borderBottom: '1px solid #5A72A5',
            borderLeft: '1px solid #5A72A5',
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            background: '#FFFFFF',
            ...inputTextStyle,
          }}
        >
          <span className="truncate">{value}</span>
        </span>
        <span
          className="flex items-center justify-center shrink-0"
          style={{
            width: 40,
            height: 40,
            background: '#E9EFFB',
            border: '1px solid #5A72A5',
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex"
          >
            <CaretDown size={20} className="text-[#5A72A5]" />
          </motion.span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 z-20 font-poppins overflow-hidden"
            style={{
              top: 'calc(100% + 6px)',
              background: '#FFFFFF',
              border: '1px solid #BED0F4',
              borderRadius: 12,
              boxShadow: '0 12px 24px -12px rgba(20, 49, 107, 0.30)',
            }}
          >
            {options.map((opt) => {
              const selected = opt === value;
              return (
                <li
                  key={opt}
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className="cursor-pointer transition-colors flex items-center justify-between"
                  style={{
                    padding: '10px 12px',
                    fontSize: 14,
                    fontWeight: 500,
                    color: selected ? '#255AC3' : '#142952',
                    background: selected ? '#F2F6FD' : '#FFFFFF',
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) e.currentTarget.style.background = '#F8FAFE';
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  <span>{opt}</span>
                  {selected && <IconCheck size={16} className="text-[#255AC3]" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Pill toggle card (Vehicle / Yes-No) ─── */

function PillCard({
  label,
  active,
  width,
  onClick,
}: {
  label: string;
  active: boolean;
  width: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center justify-between font-poppins shrink-0 text-left"
      style={{
        width,
        height: 40,
        padding: 12,
        borderRadius: 16,
        border: active ? '1px solid #FFFFFF' : '1px solid #BED0F4',
        background: active ? '#255AC3' : '#E9EFFB',
        color: active ? '#FFFFFF' : '#5A72A5',
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 'normal',
        boxShadow: active ? '0 1px 2px 0 rgba(20, 49, 107, 0.50)' : 'none',
      }}
    >
      <span className="truncate">{label}</span>
      <span
        className="flex items-center justify-center shrink-0 rounded-full"
        style={{
          width: 24,
          height: 24,
          background: active ? '#FFFFFF' : 'transparent',
          border: active ? 'none' : '1.5px solid #BED0F4',
        }}
      >
        {active && <IconCheck size={14} className="text-[#255AC3]" />}
      </span>
    </motion.button>
  );
}

function SectionBanner({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center w-full"
      style={{
        background: '#FCF4E8',
        borderLeft: '2px solid #D18317',
        padding: '10px 20px',
      }}
    >
      <p
        className="font-poppins"
        style={{ fontSize: 16, fontWeight: 600, color: '#8A570F', lineHeight: 'normal' }}
      >
        {children}
      </p>
    </div>
  );
}

const CONVEYANCE_OPTIONS = ['Road', 'Rail', 'Air', 'Sea'];

export function TransferTravelJourneyContent({ onNext }: Props) {
  const [fromPlace, setFromPlace] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [conveyance, setConveyance] = useState('Road');
  const [vehicle, setVehicle] = useState<'gov' | 'private'>('private');

  const [toPlace, setToPlace] = useState('');
  const [toDate, setToDate] = useState('');
  const [toTime, setToTime] = useState('');
  const [luggage, setLuggage] = useState<'yes' | 'no'>('no');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full"
      style={{ gap: 32 }}
    >
      <div className="flex flex-col w-full" style={{ gap: 49 }}>
        {/* ─── From Place ─── */}
        <div className="flex flex-col w-full" style={{ gap: 16 }}>
          <SectionBanner>From Place</SectionBanner>

          <div className="flex flex-col w-full" style={{ gap: 24 }}>
            <div className="flex items-end w-full justify-between">
              <FieldGroup label="Place" width={400}>
                <TextField value={fromPlace} onChange={setFromPlace} placeholder="Enter Place" />
              </FieldGroup>
              <div className="flex items-end" style={{ gap: 24 }}>
                <FieldGroup label="Travel Start Date" width={180}>
                  <DatePicker value={fromDate} onChange={setFromDate} placeholder="Enter Date" />
                </FieldGroup>
                <FieldGroup label="Travel Start Time" required width={180}>
                  <TimePicker value={fromTime} onChange={setFromTime} placeholder="Enter Time" />
                </FieldGroup>
              </div>
            </div>

            <div className="flex items-end w-full justify-between">
              <FieldGroup label="Conveyance Mode" required width={400}>
                <Dropdown value={conveyance} options={CONVEYANCE_OPTIONS} onChange={setConveyance} />
              </FieldGroup>
              <FieldGroup label="Vehicles mode" required width={356}>
                <div className="flex items-center w-full" style={{ gap: 16 }}>
                  <PillCard
                    label="Government"
                    active={vehicle === 'gov'}
                    width={170}
                    onClick={() => setVehicle('gov')}
                  />
                  <PillCard
                    label="Private"
                    active={vehicle === 'private'}
                    width={170}
                    onClick={() => setVehicle('private')}
                  />
                </div>
              </FieldGroup>
            </div>
          </div>
        </div>

        {/* ─── To Place ─── */}
        <div className="flex flex-col w-full" style={{ gap: 16 }}>
          <SectionBanner>To Place</SectionBanner>

          <div className="flex items-end w-full justify-between">
            <FieldGroup label="Place" width={400}>
              <TextField value={toPlace} onChange={setToPlace} placeholder="Enter Place" />
            </FieldGroup>
            <div className="flex items-end" style={{ gap: 24 }}>
              <FieldGroup label="Travel End Date" width={180}>
                <DatePicker value={toDate} onChange={setToDate} placeholder="Enter Date" />
              </FieldGroup>
              <FieldGroup label="Travel End Time" required width={180}>
                <TimePicker value={toTime} onChange={setToTime} placeholder="Enter Time" />
              </FieldGroup>
            </div>
            <FieldGroup label="Is shifting of luggage by truck?" required width={262}>
              <div className="flex items-center w-full" style={{ gap: 24 }}>
                <PillCard
                  label="Yes"
                  active={luggage === 'yes'}
                  width={100}
                  onClick={() => setLuggage('yes')}
                />
                <PillCard
                  label="No"
                  active={luggage === 'no'}
                  width={100}
                  onClick={() => setLuggage('no')}
                />
              </div>
            </FieldGroup>
          </div>
        </div>
      </div>

      <NextButton onClick={onNext} className="self-end" />
    </motion.div>
  );
}
