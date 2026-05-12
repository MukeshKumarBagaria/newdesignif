import { AnimatePresence, motion } from 'framer-motion';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { CaretDown, IconCheck, Search } from '../icons';

/* ──────────────────────────────────────────────────────────────────
 *  Shared visual constants — keep in lock-step with SectionCard /
 *  EditableField so every input on the screen feels like one family.
 * ────────────────────────────────────────────────────────────────── */

const FIELD_BORDER = '1px solid #5A72A5';
const FIELD_HEIGHT = 36;
const FIELD_RADIUS = 10;
const FIELD_BG = '#FFFFFF';

/* ───────── ModeToggle ─────────
 * Segmented "Create New" / "Use Existing" pill — animated indicator
 * slides between the two options. Used at the top of every section.
 */

export function ModeToggle({
  options,
  value,
  onChange,
  disabled,
  layoutId,
}) {
  return (
    <div
      role="tablist"
      aria-label="Mode selection"
      className="relative inline-flex items-center"
      style={{
        padding: 4,
        gap: 4,
        borderRadius: 999,
        border: '1px solid #BED0F4',
        background: '#F2F6FD',
        opacity: disabled ? 0.55 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className="relative z-[1] font-poppins font-semibold whitespace-nowrap transition-colors focus:outline-none"
            style={{
              height: 36,
              padding: '0 18px',
              borderRadius: 999,
              fontSize: 12,
              color: active ? '#FFFFFF' : '#1B4AA8',
            }}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                aria-hidden
                className="absolute inset-0 -z-[1]"
                style={{
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #3A74DD 0%, #255AC3 50%, #1B4AA8 100%)',
                  boxShadow: '0 6px 16px -8px rgba(37, 90, 195, 0.65)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="flex items-center gap-2">
              <span
                className="flex items-center justify-center"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  border: `1.5px solid ${active ? '#FFFFFF' : '#5A72A5'}`,
                  background: active ? '#FFFFFF' : 'transparent',
                }}
              >
                {active && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: '#1B4AA8',
                    }}
                  />
                )}
              </span>
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────── LabeledField wrapper ───────── */

export function LabeledField({
  label,
  required,
  hint,
  error,
  children,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-start ${className}`} style={{ gap: 8 }}>
      <label
        className="font-poppins"
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#2D3953',
          lineHeight: 'normal',
        }}
      >
        {label}
        {required && <span style={{ color: '#B8141A' }}> *</span>}
      </label>
      {children}
      {error ? (
        <span
          className="font-poppins"
          style={{ fontSize: 11, color: '#B8141A', lineHeight: 'normal' }}
        >
          {error}
        </span>
      ) : (
        hint && (
          <span
            className="font-poppins"
            style={{ fontSize: 11, color: '#5A72A5', lineHeight: 'normal' }}
          >
            {hint}
          </span>
        )
      )}
    </div>
  );
}

/* ───────── TextField ─────────
 * Standard single-line input matching the EditableField visual rhythm
 * (40px tall, 12px radius, 1px #5A72A5 border, white surface).
 */

export function TextField({
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  prefix,
  inputMode,
  align = 'left',
  tone = 'default',
  className = '',
  ariaLabel,
}) {
  const borderColor = tone === 'error' ? '#B8141A' : '#5A72A5';
  return (
    <div
      className={`flex items-center w-full transition-shadow focus-within:shadow-[0_0_0_3px_rgba(37,90,195,0.18)] ${className}`}
      style={{
        height: FIELD_HEIGHT,
        padding: prefix ? '0 12px 0 12px' : '0 12px',
        gap: 8,
        borderRadius: FIELD_RADIUS,
        border: `1px solid ${borderColor}`,
        background: FIELD_BG,
      }}
    >
      {prefix && (
        <span
          className="font-poppins shrink-0"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#5A72A5',
          }}
        >
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        aria-label={ariaLabel}
        className="font-poppins flex-1 min-w-0 bg-transparent outline-none border-0"
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: '#142952',
          lineHeight: 'normal',
          textAlign: align,
        }}
      />
    </div>
  );
}

/* ───────── TextArea ───────── */

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className="font-poppins w-full outline-none resize-y transition-shadow focus:shadow-[0_0_0_3px_rgba(37,90,195,0.18)]"
      style={{
        padding: '10px 12px',
        borderRadius: FIELD_RADIUS,
        border: FIELD_BORDER,
        background: FIELD_BG,
        fontSize: 14,
        fontWeight: 500,
        color: '#142952',
        lineHeight: 1.55,
      }}
    />
  );
}

/* ───────── RadioGroup ─────────
 * Pill-style radio group used for Revenue/Capital/Both, Voted/Charged/Both.
 */

export function RadioGroup({
  options,
  value,
  onChange,
  ariaLabel,
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap items-center" style={{ gap: 8 }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className="font-poppins inline-flex items-center transition-colors focus:outline-none"
            style={{
              height: FIELD_HEIGHT,
              padding: '0 16px',
              gap: 8,
              borderRadius: 999,
              border: `1px solid ${active ? '#255AC3' : '#5A72A5'}`,
              background: active ? '#E5F4FF' : '#FFFFFF',
              fontSize: 13,
              fontWeight: 500,
              color: active ? '#1B4AA8' : '#2D3953',
            }}
          >
            <span
              className="flex items-center justify-center shrink-0"
              style={{
                width: 16,
                height: 16,
                borderRadius: 999,
                border: `1.5px solid ${active ? '#255AC3' : '#5A72A5'}`,
                background: '#FFFFFF',
              }}
            >
              {active && (
                <span
                  style={{ width: 8, height: 8, borderRadius: 999, background: '#255AC3' }}
                />
              )}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  SearchableDropdown — portal-anchored selector
 *
 *  Unlike a native <select>, we render the menu via a portal that is
 *  positioned against the trigger's bounding rect. This guarantees the
 *  list never gets clipped by the section's `overflow-hidden` wrapper
 *  (the accordion body uses overflow:hidden during enter/exit).
 *  ────────────────────────────────────────────────────────────────── */

export function SearchableDropdown({
  items,
  selectedId,
  onSelect,
  placeholder = 'Search…',
  emptyText = 'No matches found.',
  disabled,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const triggerRef = useRef(null);
  const popRef = useRef(null);
  const inputRef = useRef(null);
  const [pos, setPos] = useState(null);

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) || null,
    [items, selectedId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        (i.code ?? '').toLowerCase().includes(q) ||
        (i.caption ?? '').toLowerCase().includes(q)
    );
  }, [items, query]);

  /* Position + close-on-outside ─────────────────────────────────── */
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const t = triggerRef.current;
      if (!t) return;
      const r = t.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      const t = triggerRef.current;
      const p = popRef.current;
      const target = e.target;
      if (t?.contains(target)) return;
      if (p?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center w-full font-poppins transition-shadow focus:shadow-[0_0_0_3px_rgba(37,90,195,0.18)] focus:outline-none"
        style={{
          height: FIELD_HEIGHT,
          padding: '0 12px',
          gap: 8,
          borderRadius: FIELD_RADIUS,
          border: FIELD_BORDER,
          background: FIELD_BG,
          opacity: disabled ? 0.55 : 1,
        }}
      >
        <Search size={16} className="shrink-0" style={{ color: '#5A72A5' }} />
        <span
          className="flex-1 min-w-0 text-left truncate"
          style={{
            fontSize: 14,
            fontWeight: selected ? 600 : 500,
            color: selected ? '#142952' : '#5A72A5',
          }}
        >
          {selected ? (
            <>
              <span style={{ color: '#1B4AA8' }}>{selected.code} —</span>{' '}
              <span>{selected.label}</span>
            </>
          ) : (
            placeholder
          )}
        </span>
        <CaretDown
          size={18}
          className="shrink-0 transition-transform"
          style={{
            color: '#5A72A5',
            transform: open ? 'rotate(180deg)' : undefined,
          }}
        />
      </button>

      {open && pos &&
        createPortal(
          <div
            ref={popRef}
            className="fixed z-[60]"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              role="listbox"
              className="overflow-hidden font-poppins"
              style={{
                borderRadius: 16,
                border: '1px solid #BED0F4',
                background: '#FFFFFF',
                boxShadow: '0 16px 40px -12px rgba(20, 49, 107, 0.30)',
              }}
            >
              <div
                className="flex items-center"
                style={{
                  padding: 10,
                  gap: 8,
                  borderBottom: '1px solid #E9EFFB',
                  background: '#F2F6FD',
                }}
              >
                <Search size={16} style={{ color: '#5A72A5' }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type code or name…"
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: 14, fontWeight: 500, color: '#142952' }}
                />
              </div>
              <ul
                className="overflow-y-auto"
                style={{ maxHeight: 280, padding: 6 }}
              >
                {filtered.length === 0 && (
                  <li
                    className="text-center"
                    style={{
                      padding: '20px 12px',
                      fontSize: 13,
                      color: '#5A72A5',
                    }}
                  >
                    {emptyText}
                  </li>
                )}
                {filtered.map((it) => {
                  const active = it.id === selectedId;
                  return (
                    <li key={it.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          onSelect(it.id);
                          setOpen(false);
                          setQuery('');
                        }}
                        className="w-full text-left flex items-start transition-colors hover:bg-[#F2F6FD]"
                        style={{
                          padding: '10px 12px',
                          gap: 12,
                          borderRadius: 12,
                          background: active ? '#E5F4FF' : 'transparent',
                        }}
                      >
                        {it.code !== undefined && (
                          <span
                            className="shrink-0 inline-flex items-center justify-center"
                            style={{
                              minWidth: 56,
                              height: 28,
                              padding: '0 10px',
                              borderRadius: 8,
                              border: '1px solid #BED0F4',
                              background: active ? '#FFFFFF' : '#F2F6FD',
                              color: '#1B4AA8',
                              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                              fontSize: 13,
                              fontWeight: 700,
                            }}
                          >
                            {it.code}
                          </span>
                        )}
                        <span className="flex-1 min-w-0">
                          <div
                            className="truncate"
                            style={{ fontSize: 14, fontWeight: 600, color: '#142952' }}
                          >
                            {it.label}
                          </div>
                          {it.caption && (
                            <div
                              className="truncate"
                              style={{ fontSize: 12, fontWeight: 500, color: '#5A72A5', marginTop: 2 }}
                            >
                              {it.caption}
                            </div>
                          )}
                        </span>
                        {active && (
                          <span
                            className="shrink-0 inline-flex items-center justify-center"
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 999,
                              background: '#255AC3',
                              color: '#FFFFFF',
                            }}
                          >
                            <IconCheck size={14} />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>,
          document.body
        )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  SelectField — lightweight portal-anchored select for short option
 *  lists (sector / sub-sector). Matches TextField visually so all
 *  fields in a row align perfectly.
 *  ────────────────────────────────────────────────────────────────── */

export function SelectField({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const popRef = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const t = triggerRef.current;
      if (!t) return;
      const r = t.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      const t = triggerRef.current;
      const p = popRef.current;
      const target = e.target;
      if (t?.contains(target)) return;
      if (p?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
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
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center w-full font-poppins transition-shadow focus:shadow-[0_0_0_3px_rgba(37,90,195,0.18)] focus:outline-none"
        style={{
          height: FIELD_HEIGHT,
          padding: '0 12px',
          gap: 8,
          borderRadius: FIELD_RADIUS,
          border: FIELD_BORDER,
          background: FIELD_BG,
          opacity: disabled ? 0.55 : 1,
        }}
      >
        <span
          className="flex-1 min-w-0 text-left truncate"
          style={{
            fontSize: 14,
            fontWeight: value ? 600 : 500,
            color: value ? '#142952' : '#5A72A5',
          }}
        >
          {value || placeholder}
        </span>
        <CaretDown
          size={18}
          className="shrink-0 transition-transform"
          style={{
            color: '#5A72A5',
            transform: open ? 'rotate(180deg)' : undefined,
          }}
        />
      </button>

      {open && pos &&
        createPortal(
          <div
            ref={popRef}
            className="fixed z-[60]"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              role="listbox"
              className="overflow-hidden font-poppins"
              style={{
                borderRadius: 16,
                border: '1px solid #BED0F4',
                background: '#FFFFFF',
                boxShadow: '0 16px 40px -12px rgba(20, 49, 107, 0.30)',
              }}
            >
              <ul style={{ padding: 6, maxHeight: 280, overflowY: 'auto' }}>
                {options.length === 0 && (
                  <li
                    className="text-center"
                    style={{ padding: '16px 10px', fontSize: 13, color: '#5A72A5' }}
                  >
                    No options
                  </li>
                )}
                {options.map((o) => {
                  const active = o === value;
                  return (
                    <li key={o}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          onChange(o);
                          setOpen(false);
                        }}
                        className="w-full text-left transition-colors hover:bg-[#F2F6FD]"
                        style={{
                          padding: '10px 12px',
                          borderRadius: 10,
                          background: active ? '#E5F4FF' : 'transparent',
                          fontSize: 14,
                          fontWeight: active ? 600 : 500,
                          color: '#142952',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                        }}
                      >
                        <span className="truncate">{o}</span>
                        {active && (
                          <span
                            className="shrink-0 inline-flex items-center justify-center"
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 999,
                              background: '#255AC3',
                              color: '#FFFFFF',
                            }}
                          >
                            <IconCheck size={12} />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>,
          document.body
        )}
    </>
  );
}

/* ───────── HierarchyBadge ─────────
 * CREATED / MAPPED / pending pill — reused inside the section header
 * and the hierarchy summary cards.
 */

export function HierarchyBadge({ status }) {
  if (!status) {
    return (
      <span
        className="font-poppins inline-flex items-center"
        style={{
          height: 22,
          padding: '0 10px',
          gap: 6,
          borderRadius: 999,
          background: '#F6F7F8',
          color: '#808080',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.04em',
          border: '1px dashed #BFBFBF',
        }}
      >
        <span
          aria-hidden
          style={{ width: 6, height: 6, borderRadius: 999, background: '#BFBFBF' }}
        />
        PENDING
      </span>
    );
  }
  const isCreated = status === 'CREATED';
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="font-poppins inline-flex items-center"
        style={{
          height: 22,
          padding: '0 10px',
          gap: 6,
          borderRadius: 999,
          background: isCreated ? '#E6F5E1' : '#E5F4FF',
          color: isCreated ? '#2C6C13' : '#1B4AA8',
          border: `1px solid ${isCreated ? '#A5D66F' : '#BED0F4'}`,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.04em',
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: isCreated ? '#358217' : '#255AC3',
          }}
        />
        {status}
      </motion.span>
    </AnimatePresence>
  );
}
