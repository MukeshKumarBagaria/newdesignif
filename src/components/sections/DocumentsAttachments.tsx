import { motion } from 'framer-motion';
import { useState } from 'react';
import { IconCheck } from '../icons';
import { EditableLabel, NextButton } from '../form';

type Props = { onNext: () => void };

const items = [
  { key: 'luggage', label: 'Original Luggage Charges Receipt (If applicable)' },
  { key: 'ticket', label: 'Original Travel Ticket' },
];

/**
 * DocumentsAttachmentsContent — Figma node 5938:51027.
 *
 * Locked spec:
 *   Outer gap     : 32 (label group → next button)
 *   Group gap     : 8  (label → card row)
 *   Card row gap  : 24
 *   Card          : 400×80 · padding 12 · radius 16 · items-start justify-between
 *                   inactive bg #E9EFFB / border 1px #BED0F4 / text #5A72A5
 *                   active   bg #255AC3 / border 1px white / text white /
 *                            shadow 0 1 2 rgba(20,49,107,0.5) / white 24px check-circle
 *   Card text     : Poppins Medium 16 · line-height 24 (active wraps within 214px)
 *   Next button   : right-aligned NextButton (100×48)
 */
export function DocumentsAttachmentsContent({ onNext }: Props) {
  const [selected, setSelected] = useState<string | null>('luggage');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full"
      style={{ gap: 32 }}
    >
      <div className="flex flex-col w-full" style={{ gap: 8 }}>
        <EditableLabel required>Valid Documents Checklist</EditableLabel>

        <div className="flex items-center w-full" style={{ gap: 24 }}>
          {items.map((it) => {
            const active = selected === it.key;
            return (
              <motion.button
                key={it.key}
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(it.key)}
                className="flex items-start justify-between font-poppins shrink-0 text-left"
                style={{
                  width: 400,
                  height: 80,
                  padding: 12,
                  borderRadius: 16,
                  border: active ? '1px solid #FFFFFF' : '1px solid #BED0F4',
                  background: active ? '#255AC3' : '#E9EFFB',
                  color: active ? '#FFFFFF' : '#5A72A5',
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: '24px',
                  boxShadow: active ? '0 1px 2px 0 rgba(20, 49, 107, 0.50)' : 'none',
                }}
              >
                <span style={{ width: 214 }}>{it.label}</span>
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
          })}
        </div>
      </div>

      <NextButton onClick={onNext} className="self-end" />
    </motion.div>
  );
}
