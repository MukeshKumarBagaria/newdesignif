import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { IconCheckCircle } from './icons';

type Props = {
  index: string;
  title: string;
  expanded: boolean;
  completed?: boolean;
  onToggle: () => void;
  children?: ReactNode;
};

/**
 * SectionCard — matches Figma nodes 5938:50582 (header) + 5938:50592 (body)
 *  Header: h56, 0 16px padding, rounded-t-[16px], border 1px #2273C3 (top/L/R), bg #F6F7F8
 *  Body:   padding 24 16, gap 32, flex-col items-end, rounded-b-[16px], border 1px #2273C3 (bot/L/R)
 *  Arrow button: 32×32 rounded-full, white bg, Dept shadow, rotates when expanded.
 */
export function SectionCard({ index, title, expanded, completed, onToggle, children }: Props) {
  return (
    <motion.div layout className="w-full flex flex-col">
      {/* ─────────── Header ─────────── */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between self-stretch transition-colors hover:brightness-[0.99]"
        style={{
          height: '56px',
          padding: '0 16px',
          borderRadius: expanded ? '24px 24px 0 0' : '24px',
          border: '1px solid #2273C3',
          borderBottom: expanded ? 'none' : '1px solid #2273C3',
          background: '#F6F7F8',
        }}
      >
        {/* Left: index circle + title */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{
              width: '40px',
              height: '40px',
              background: '#DDE6F8',
            }}
          >
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
          </div>
          <span
            className="font-poppins whitespace-nowrap"
            style={{
              color: '#142952',
              fontSize: '1.125rem',
              fontWeight: 600,
              lineHeight: 'normal',
            }}
          >
            {title}
          </span>
        </div>

        {/* Right: optional completed pill + arrow */}
        <div className="flex items-center gap-3">
          {completed && !expanded && (
            <span className="px-2.5 h-7 rounded-full bg-accent-green-50 text-accent-green-600 ring-1 ring-accent-green-100 text-[12px] font-semibold flex items-center gap-1.5">
              <IconCheckCircle size={14} />
              Completed
            </span>
          )}

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
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
        </div>
      </button>

      {/* ─────────── Body ─────────── */}
      <AnimatePresence initial={false}>
        {expanded && (
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
