import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, CaretDown, IconClock } from './icons';

const POPOVER_SHADOW = '0 16px 40px -12px rgba(20, 49, 107, 0.30)';
const inputShell = {
  height: 40,
  padding: '10px 12px',
  borderRadius: 12,
  border: '1px solid #5A72A5',
  background: '#FFFFFF',
};
const inputText = {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 'normal' as const,
};

/* ──────────────────────────────────────────────────────────────────
 *  Popover — viewport-anchored portal
 *  Computes a fixed (top, left) from the trigger rect each tick so it
 *  cannot be clipped by ancestor `overflow-hidden`. Flips horizontally
 *  if it would run past the right viewport edge.
 *  ────────────────────────────────────────────────────────────────── */

function Popover({
  triggerRef,
  open,
  width,
  estimatedHeight = 360,
  onClose,
  children,
}: {
  triggerRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  width: number;
  estimatedHeight?: number;
  onClose: () => void;
  children: ReactNode;
}) {
  const [pos, setPos] = useState<{ top: number; left: number; placement: 'below' | 'above' } | null>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const t = triggerRef.current;
      if (!t) return;
      const r = t.getBoundingClientRect();
      const margin = 8;
      const popHeight = popRef.current?.offsetHeight || estimatedHeight;

      let left = r.left;
      const maxLeft = window.innerWidth - width - margin;
      if (left > maxLeft) left = Math.max(margin, maxLeft);

      const spaceBelow = window.innerHeight - r.bottom;
      const spaceAbove = r.top;
      const placement: 'below' | 'above' =
        spaceBelow < popHeight + 12 && spaceAbove > spaceBelow ? 'above' : 'below';
      const top = placement === 'below' ? r.bottom + 6 : Math.max(margin, r.top - popHeight - 6);

      setPos({ top, left, placement });
    };
    place();
    const id = window.setTimeout(place, 0);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, triggerRef, width, estimatedHeight]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = triggerRef.current;
      const p = popRef.current;
      const target = e.target as Node;
      if (t?.contains(target)) return;
      if (p?.contains(target)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, triggerRef]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && pos && (
        <motion.div
          ref={popRef}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            width,
            zIndex: 1000,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  DatePicker
 *  Value format: 'YYYY-MM-DD'
 *  ────────────────────────────────────────────────────────────────── */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function fmtISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseISO(v: string): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function fmtDisplay(d: Date) {
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < startDow; i++) {
    const date = new Date(year, month, -startDow + i + 1);
    cells.push({ date, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    cells.push({ date: next, inMonth: next.getMonth() === month });
  }
  return cells;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select Date',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const selected = parseISO(value);
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState(() => {
    const base = selected ?? today;
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  useEffect(() => {
    if (open && selected) {
      setView({ year: selected.getFullYear(), month: selected.getMonth() });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const cells = useMemo(() => buildMonthGrid(view.year, view.month), [view]);
  const display = selected ? fmtDisplay(selected) : '';

  const stepMonth = (delta: number) => {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const isSameDay = (a: Date, b: Date | null) =>
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div className="relative w-full">
      <div
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center w-full font-poppins cursor-pointer transition-shadow hover:shadow-[0_2px_8px_-4px_rgba(37,90,195,0.4)]"
        style={inputShell}
      >
        <span
          className="flex-1 truncate select-none"
          style={{ ...inputText, color: display ? '#142952' : '#5A72A5' }}
        >
          {display || placeholder}
        </span>
        <button
          type="button"
          aria-label="Open calendar"
          className="shrink-0 text-[#5A72A5] hover:text-[#255AC3] transition-colors"
        >
          <Calendar size={24} />
        </button>
      </div>

      <Popover
        triggerRef={triggerRef}
        open={open}
        width={304}
        estimatedHeight={388}
        onClose={() => setOpen(false)}
      >
        <div
          className="font-poppins"
          style={{
            background: '#FFFFFF',
            border: '1px solid #BED0F4',
            borderRadius: 16,
            boxShadow: POPOVER_SHADOW,
            padding: 12,
          }}
        >
          {/* Month header */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => stepMonth(-1)}
              aria-label="Previous month"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F2F6FD] text-[#142952] transition-colors"
            >
              <CaretDown size={20} className="rotate-90" />
            </button>
            <div className="flex items-center gap-1.5">
              <span style={{ fontSize: 14, fontWeight: 600, color: '#142952' }}>
                {MONTH_NAMES[view.month]}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#5A72A5' }}>
                {view.year}
              </span>
            </div>
            <button
              type="button"
              onClick={() => stepMonth(1)}
              aria-label="Next month"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F2F6FD] text-[#142952] transition-colors"
            >
              <CaretDown size={20} className="-rotate-90" />
            </button>
          </div>

          {/* Day-of-week */}
          <div className="grid grid-cols-7 mb-1">
            {DOW.map((d, i) => (
              <div
                key={i}
                className="h-7 flex items-center justify-center"
                style={{ fontSize: 11, fontWeight: 600, color: '#5A72A5' }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map(({ date, inMonth }, i) => {
              const isSelected = isSameDay(date, selected);
              const isToday = isSameDay(date, today);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(fmtISO(date));
                    setOpen(false);
                  }}
                  className="h-9 flex items-center justify-center transition-colors relative"
                  style={{
                    fontSize: 13,
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected
                      ? '#FFFFFF'
                      : !inMonth
                        ? '#B7C2D9'
                        : isToday
                          ? '#255AC3'
                          : '#142952',
                    background: isSelected ? '#255AC3' : 'transparent',
                    borderRadius: 10,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = '#F2F6FD';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {date.getDate()}
                  {isToday && !isSelected && (
                    <span
                      className="absolute"
                      style={{
                        bottom: 4,
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        background: '#255AC3',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E9EFFB]">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className="px-2 h-8 rounded-lg transition-colors"
              style={{ fontSize: 12, fontWeight: 500, color: '#5A72A5' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F2F6FD')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(fmtISO(today));
                setOpen(false);
              }}
              className="px-3 h-8 rounded-lg transition-colors"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#255AC3',
                background: '#F2F6FD',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#E1EBFB')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#F2F6FD')}
            >
              Today
            </button>
          </div>
        </div>
      </Popover>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  TimePicker
 *  Value format: 'HH:MM' (24h)
 *  ────────────────────────────────────────────────────────────────── */

function parseTime(v: string): { h12: number; m: number; period: 'AM' | 'PM' } {
  if (!v) return { h12: 9, m: 0, period: 'AM' };
  const [hStr = '0', mStr = '0'] = v.split(':');
  const h24 = Number(hStr) || 0;
  const m = Number(mStr) || 0;
  const period: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM';
  const h12 = ((h24 + 11) % 12) + 1;
  return { h12, m, period };
}

function fmtTimeISO(h12: number, m: number, period: 'AM' | 'PM') {
  let h24 = h12 % 12;
  if (period === 'PM') h24 += 12;
  return `${pad(h24)}:${pad(m)}`;
}

function fmtTimeDisplay(v: string) {
  if (!v) return '';
  const { h12, m, period } = parseTime(v);
  return `${h12}:${pad(m)} ${period}`;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function ScrollColumn<T>({
  items,
  selected,
  onChange,
  format,
  width,
}: {
  items: T[];
  selected: T;
  onChange: (v: T) => void;
  format: (v: T) => string;
  width: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = items.findIndex((i) => i === selected);
    if (idx < 0) return;
    const target = el.children[idx + 1] as HTMLElement | undefined;
    if (target) {
      el.scrollTo({
        top: target.offsetTop - el.clientHeight / 2 + target.clientHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [selected, items]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-stretch overflow-y-auto scrollbar-hidden"
      style={{
        width,
        height: 168,
        scrollSnapType: 'y mandatory',
      }}
    >
      <div style={{ height: 62 }} />
      {items.map((item, i) => {
        const isSel = item === selected;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(item)}
            className="flex items-center justify-center font-poppins transition-all shrink-0"
            style={{
              height: 44,
              scrollSnapAlign: 'center',
              fontSize: isSel ? 18 : 15,
              fontWeight: isSel ? 600 : 500,
              color: isSel ? '#255AC3' : '#5A72A5',
              borderRadius: 10,
              margin: '0 6px',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isSel) e.currentTarget.style.background = '#F8FAFE';
            }}
            onMouseLeave={(e) => {
              if (!isSel) e.currentTarget.style.background = 'transparent';
            }}
          >
            {format(item)}
          </button>
        );
      })}
      <div style={{ height: 62 }} />
    </div>
  );
}

export function TimePicker({
  value,
  onChange,
  placeholder = 'Select Time',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const parsed = parseTime(value);
  const [h12, setH12] = useState(parsed.h12);
  const [m, setM] = useState(parsed.m);
  const [period, setPeriod] = useState<'AM' | 'PM'>(parsed.period);

  useEffect(() => {
    if (open) {
      const p = parseTime(value);
      setH12(p.h12);
      setM(p.m);
      setPeriod(p.period);
    }
  }, [open, value]);

  const display = fmtTimeDisplay(value);

  const apply = () => {
    onChange(fmtTimeISO(h12, m, period));
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <div
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center w-full font-poppins cursor-pointer transition-shadow hover:shadow-[0_2px_8px_-4px_rgba(37,90,195,0.4)]"
        style={inputShell}
      >
        <span
          className="flex-1 truncate select-none"
          style={{ ...inputText, color: display ? '#142952' : '#5A72A5' }}
        >
          {display || placeholder}
        </span>
        <button
          type="button"
          aria-label="Open time picker"
          className="shrink-0 text-[#5A72A5] hover:text-[#255AC3] transition-colors"
        >
          <IconClock size={24} />
        </button>
      </div>

      <Popover
        triggerRef={triggerRef}
        open={open}
        width={232}
        estimatedHeight={300}
        onClose={() => setOpen(false)}
      >
        <div
          className="font-poppins"
          style={{
            background: '#FFFFFF',
            border: '1px solid #BED0F4',
            borderRadius: 16,
            boxShadow: POPOVER_SHADOW,
            padding: 12,
          }}
        >
          {/* Wheel area with selection band */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                top: 62,
                left: 0,
                right: 0,
                height: 44,
                borderRadius: 12,
                background: '#F2F6FD',
                border: '1px solid #E1EBFB',
              }}
            />
            <div className="relative flex items-stretch justify-center">
              <ScrollColumn
                items={HOURS}
                selected={h12}
                onChange={setH12}
                format={(v) => pad(v)}
                width={88}
              />
              <div
                className="flex items-center justify-center font-poppins shrink-0"
                style={{ width: 16, fontSize: 18, fontWeight: 600, color: '#142952' }}
              >
                :
              </div>
              <ScrollColumn
                items={MINUTES}
                selected={m}
                onChange={setM}
                format={(v) => pad(v)}
                width={88}
              />
            </div>
          </div>

          {/* AM/PM segmented toggle */}
          <div
            className="flex items-center mt-3 p-0.5"
            style={{
              background: '#F2F6FD',
              borderRadius: 12,
              border: '1px solid #E1EBFB',
            }}
          >
            {(['AM', 'PM'] as const).map((p) => {
              const active = p === period;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className="flex-1 flex items-center justify-center font-poppins transition-all"
                  style={{
                    height: 32,
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    color: active ? '#FFFFFF' : '#5A72A5',
                    background: active ? '#255AC3' : 'transparent',
                    boxShadow: active ? '0 1px 2px 0 rgba(20, 49, 107, 0.30)' : 'none',
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E9EFFB]">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const h24 = now.getHours();
                const newPeriod: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM';
                const newH12 = ((h24 + 11) % 12) + 1;
                let newMin = Math.round(now.getMinutes() / 5) * 5;
                if (newMin === 60) newMin = 0;
                setH12(newH12);
                setM(newMin);
                setPeriod(newPeriod);
              }}
              className="px-2 h-8 rounded-lg transition-colors"
              style={{ fontSize: 12, fontWeight: 500, color: '#5A72A5' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F2F6FD')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Now
            </button>
            <button
              type="button"
              onClick={apply}
              className="px-3 h-8 rounded-lg transition-colors"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#FFFFFF',
                background: '#255AC3',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1E4AA8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#255AC3')}
            >
              Confirm
            </button>
          </div>
        </div>
      </Popover>
    </div>
  );
}
