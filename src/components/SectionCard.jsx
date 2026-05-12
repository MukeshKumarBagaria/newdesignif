import { AnimatePresence, motion } from 'framer-motion';
import { IconCheckCircle } from './icons';

/**
 * SectionCard — matches Figma nodes 5938:50582 (header) + 5938:50592 (body)
 *  Header: h56, 0 16px padding, rounded-t-[16px], border 1px #2273C3 (top/L/R), bg #F6F7F8
 *  Body:   padding 24 16, gap 32, flex-col items-end, rounded-b-[16px], border 1px #2273C3 (bot/L/R)
 *  Arrow button: 32×32 rounded-full, white bg, Dept shadow, rotates when expanded.
 */
export function SectionCard({
  index,
  title,
  expanded,
  completed,
  locked,
  lockedHint,
  badge,
  subtitle,
  onToggle,
  children,
}) {
  const effectiveExpanded = expanded && !locked;
  return (
    <motion.div layout className="w-full flex flex-col">
      {/* ─────────── Header ─────────── */}
      <button
        type="button"
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        title={locked ? lockedHint : undefined}
        aria-disabled={locked}
        className="flex items-center justify-between self-stretch transition-colors hover:brightness-[0.99]"
        style={{
          minHeight: '56px',
          padding: locked ? '10px 16px' : '0 16px',
          borderRadius: effectiveExpanded ? '24px 24px 0 0' : '24px',
          border: locked ? '1px solid #D5DEEF' : '1px solid #2273C3',
          borderBottom: effectiveExpanded ? 'none' : (locked ? '1px solid #D5DEEF' : '1px solid #2273C3'),
          background: locked
            ? 'linear-gradient(135deg, #F7F9FE 0%, #F2F6FD 100%)'
            : '#F6F7F8',
          opacity: locked ? 0.92 : 1,
          cursor: locked ? 'not-allowed' : 'pointer',
        }}
      >
        {/* Left: index circle + title (+ subtitle when locked) */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{
              width: '40px',
              height: '40px',
              background: locked ? '#EDEEF1' : '#DDE6F8',
            }}
          >
            {locked ? (
              <LockGlyph />
            ) : (
              <span
                className="font-poppins"
                style={{
                  color: '#142952',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  lineHeight: '1.6875rem',
                }}
              >
                {index}
              </span>
            )}
          </div>
          <span className="flex flex-col items-start min-w-0">
            <span
              className="font-poppins whitespace-nowrap"
              style={{
                color: locked ? '#4F628D' : '#142952',
                fontSize: '1.125rem',
                fontWeight: 600,
                lineHeight: 'normal',
              }}
            >
              {title}
            </span>
            {subtitle && (
              <span
                className="font-poppins truncate"
                style={{ color: '#5A72A5', fontSize: 12, fontWeight: 500, marginTop: 2 }}
              >
                {subtitle}
              </span>
            )}
            {locked && lockedHint && (
              <span
                className="font-poppins inline-flex items-center truncate"
                style={{
                  marginTop: 6,
                  maxWidth: 'min(560px, 65vw)',
                  height: 24,
                  padding: '0 10px',
                  gap: 6,
                  borderRadius: 999,
                  background: '#FFFFFF',
                  border: '1px solid #D7E2F5',
                  color: '#4F628D',
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: 'normal',
                }}
              >
                <LockGlyph size={12} />
                <span className="truncate">{lockedHint}</span>
              </span>
            )}
          </span>
        </div>

        {/* Right: optional badge + completed pill + arrow */}
        <div className="flex items-center gap-3 shrink-0">
          {badge}
          {completed && !effectiveExpanded && (
            <span className="px-2.5 h-7 rounded-full bg-accent-green-50 text-accent-green-600 ring-1 ring-accent-green-100 text-[12px] font-semibold flex items-center gap-1.5">
              <IconCheckCircle size={14} />
              Completed
            </span>
          )}

          {!locked && (
            <motion.div
              animate={{ rotate: effectiveExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center shrink-0"
              style={{
                width: '32px',
                height: '32px',
                padding: '6px',
                borderRadius: '50px',
                background: '#FFFFFF',
                boxShadow: '0 1px 2px 0 rgba(20, 49, 107, 0.50)',
              }}
            >
              <img
                src="/assets/arrow-downward.svg"
                alt=""
                className="w-5 h-5"
                draggable={false}
              />
            </motion.div>
          )}
        </div>
      </button>

      {/* ─────────── Body ─────────── */}
      <AnimatePresence initial={false}>
        {effectiveExpanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden self-stretch"
          >
            <div
              className="flex flex-col items-end justify-end self-stretch"
              style={{
                padding: '24px 16px',
                gap: '32px',
                borderRadius: '0 0 16px 24px',
                borderRight: '1px solid #2273C3',
                borderBottom: '1px solid #2273C3',
                borderLeft: '1px solid #2273C3',
                background: '#F6F7F8',
              }}
            >
              <div className="w-full">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

function LockGlyph({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" stroke="#5A72A5" strokeWidth="1.6" />
      <path d="M8 10.5V8a4 4 0 018 0v2.5" stroke="#5A72A5" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.4" fill="#5A72A5" />
    </svg>
  );
}
