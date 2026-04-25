import { motion } from 'framer-motion';
import { useState } from 'react';
import { IconCheck } from '../icons';
import { NextButton } from '../form';

type Props = { onNext: () => void };

const options = [
  { value: 'self', label: 'Self' },
  { value: 'family', label: 'Family' },
  { value: 'both', label: 'Self & Family' },
];

const initialFamily = [
  { name: 'Mukesh Kumar', rel: 'Son', age: 25, checked: true },
  { name: 'Mikey', rel: 'Daughter', age: 18, checked: false },
];

/**
 * ReimbursementDetailsContent — Figma node 5938:50831.
 *
 * Locked spec:
 *   Group gap   : 32px (matches SectionCard body)
 *   Member card : 150×80 · padding 12 · radius 16 · gap 24 between cards
 *                 inactive bg #E9EFFB, border 1px #BED0F4, text #5A72A5
 *                 active   bg #255AC3, border 1px #FFFFFF, text #FFFFFF,
 *                          shadow 0 1 2 rgba(20,49,107,0.5), white 24px circle
 *                          with #255AC3 check
 *   Banner      : bg #FCF4E8, border-l 2px #D18317, padding 10/20,
 *                 Poppins SemiBold 16 / #8A570F
 *   Table       : radius 16, 1.5px #BED0F4 borders
 *                 header row 60px · bg #F2F6FD · Poppins SemiBold 14 / #142952
 *                 body row   60px · bg #FFFFFF · Poppins Medium 14 / #2D3953
 *                 Action column: 115px, 24×24 checkbox, radius 4,
 *                                1.5px #255AC3 border, fill #255AC3 when checked
 */
export function ReimbursementDetailsContent({ onNext }: Props) {
  const [selected, setSelected] = useState('family');
  const [checks, setChecks] = useState(initialFamily.map((f) => f.checked));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full"
      style={{ gap: 32 }}
    >
      {/* ─── Travelling members ─── */}
      <div className="flex flex-col w-full" style={{ gap: 8 }}>
        <p
          className="font-poppins"
          style={{ fontSize: 16, fontWeight: 600, color: '#2D3953', lineHeight: 'normal' }}
        >
          Travelling members <span style={{ color: '#B8141A' }}>*</span>
        </p>
        <div className="flex items-center" style={{ gap: 24 }}>
          {options.map((o) => {
            const active = selected === o.value;
            return (
              <motion.button
                key={o.value}
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(o.value)}
                className="flex items-start justify-between font-poppins shrink-0 text-left"
                style={{
                  width: 150,
                  height: 80,
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
                <span className="leading-tight">{o.label}</span>
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

      {/* ─── Family Member List ─── */}
      <div className="flex flex-col w-full" style={{ gap: 16 }}>
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
            Family Member List
          </p>
        </div>

        <div
          className="w-full overflow-hidden"
          style={{ borderRadius: 16, border: '1.5px solid #BED0F4' }}
        >
          <table className="w-full font-poppins" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F2F6FD', height: 60 }}>
                <th
                  className="text-center"
                  style={{ fontSize: 14, fontWeight: 600, color: '#142952' }}
                >
                  Name
                </th>
                <th
                  className="text-center"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#142952',
                    borderLeft: '1.5px solid #BED0F4',
                    width: 171,
                  }}
                >
                  Relationship
                </th>
                <th
                  className="text-center"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#142952',
                    borderLeft: '1.5px solid #BED0F4',
                    width: 313,
                  }}
                >
                  Age
                </th>
                <th
                  className="text-center"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#142952',
                    borderLeft: '1.5px solid #BED0F4',
                    width: 115,
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {initialFamily.map((f, i) => (
                <tr
                  key={f.name}
                  style={{
                    background: '#FFFFFF',
                    height: 60,
                    borderTop: '1.5px solid #BED0F4',
                  }}
                >
                  <td
                    className="text-center"
                    style={{ fontSize: 14, fontWeight: 500, color: '#2D3953' }}
                  >
                    {f.name}
                  </td>
                  <td
                    className="text-center"
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#2D3953',
                      borderLeft: '1.5px solid #BED0F4',
                    }}
                  >
                    {f.rel}
                  </td>
                  <td
                    className="text-center"
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#2D3953',
                      borderLeft: '1.5px solid #BED0F4',
                    }}
                  >
                    {f.age}
                  </td>
                  <td
                    className="text-center"
                    style={{ borderLeft: '1.5px solid #BED0F4' }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setChecks(checks.map((c, idx) => (idx === i ? !c : c)))
                      }
                      className="inline-flex items-center justify-center transition-colors"
                      aria-label={`Select ${f.name}`}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        border: '1.5px solid #255AC3',
                        background: checks[i] ? '#255AC3' : '#FFFFFF',
                      }}
                    >
                      {checks[i] && <IconCheck size={16} className="text-white" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NextButton onClick={onNext} className="self-end" />
    </motion.div>
  );
}
