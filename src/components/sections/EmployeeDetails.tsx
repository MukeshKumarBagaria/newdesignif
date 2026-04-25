import { motion } from 'framer-motion';
import { FetchField, NextButton, type FetchFieldSide } from '../form';

type Props = { onNext: () => void };

const row1: { label: string; value: string }[] = [
  { label: 'Employee Name', value: 'Mukesh Kumar' },
  { label: 'Employee Code', value: '99880DSE' },
  { label: 'Gender', value: 'Male' },
  { label: 'Post Details', value: 'Deputy Director' },
  { label: 'Office', value: 'Bhopal Head Office' },
];

export function EmployeeDetailsContent({ onNext }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-end self-stretch w-full"
      style={{ gap: 32 }}
    >
      {/* Data block — Figma node 5830:83394 (rows of fetched fields, gap 8) */}
      <div className="flex flex-col items-start w-full" style={{ gap: 8 }}>
        {/* Row 1 — 5 connected fetched fields (Figma node 5830:83000) */}
        <div className="flex items-stretch w-full">
          {row1.map((cell, i) => {
            const side: FetchFieldSide =
              i === 0 ? 'left' : i === row1.length - 1 ? 'right' : 'middle';
            return (
              <motion.div
                key={cell.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i, duration: 0.25 }}
                className="flex flex-1 min-w-0"
              >
                <FetchField label={cell.label} value={cell.value} side={side} />
              </motion.div>
            );
          })}
        </div>

        {/* Row 2 — Employee Class + Pay Scale (Figma node 5830:83318) */}
        <div className="flex items-stretch w-full">
          <div className="flex flex-1 min-w-0">
            <FetchField label="Employee Class" value="Class I" side="left" />
          </div>
          <div className="flex flex-1 min-w-0">
            <FetchField
              label="Pay Scale"
              value="30000.00 - 60000.00"
              side="right"
              highlight
            />
          </div>
        </div>
      </div>

      {/* Next CTA — shared component locked to Figma node 5830:83076 */}
      <NextButton onClick={onNext} />
    </motion.div>
  );
}
