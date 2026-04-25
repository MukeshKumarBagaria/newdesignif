import { motion } from 'framer-motion';

/**
 * ModuleGrid — Figma node 5938:44360 ("Module overlay")
 *
 * Container tokens (1:1 with Figma):
 *   display:inline-flex · flex-direction:column · padding:16 · gap:16
 *   border-radius:24 · border:1px solid #BED0F4
 *   background:rgba(233, 239, 251, 0.75) · backdrop-filter:blur(6px)
 *
 * Row tokens:
 *   flex · gap:16 · items-center · self-stretch
 *
 * Tile tokens (per Figma child 5938:44362 etc.):
 *   width:125 · padding:10 · gap:6 · radius:16 · 1px solid {tile.border}
 *   icon bubble: 28×28 · radius:50 · bg:{tile.iconBg}
 *   icon: 20×20 (Phosphor — same SVGs sourced from Figma payload)
 *   label: Poppins Medium 14
 */

export type ModuleTile = {
  label: string;
  icon: string;
  bg: string;
  border: string;
  iconBg: string;
  text: string;
};

export const moduleTiles: ModuleTile[] = [
  {
    label: 'Budget',
    icon: '/assets/icon-cardholder.svg',
    bg: '#E0F7D4',
    border: '#D0F4BE',
    iconBg: '#C1EFA9',
    text: '#295214',
  },
  {
    label: 'Deposit',
    icon: '/assets/icon-hand-arrow-up.svg',
    bg: '#DAD4F7',
    border: '#C7BEF4',
    iconBg: '#B5A9EF',
    text: '#1E1452',
  },
  {
    label: 'Receipt',
    icon: '/assets/icon-receipt.svg',
    bg: '#D4EBF7',
    border: '#BEE2F4',
    iconBg: '#A9D8EF',
    text: '#143D52',
  },
  {
    label: 'BMS',
    icon: '/assets/icon-money.svg',
    bg: '#D4E0F7',
    border: '#BED0F4',
    iconBg: '#A9C0EF',
    text: '#142952',
  },
  {
    label: 'Strong Room',
    icon: '/assets/icon-dresser.svg',
    bg: '#F7F1D4',
    border: '#F4EBBE',
    iconBg: '#EFE3A9',
    text: '#524814',
  },
  {
    label: 'Pension',
    icon: '/assets/icon-hand-withdraw.svg',
    bg: '#D4F7E5',
    border: '#BEF4D9',
    iconBg: '#A9EFCC',
    text: '#145233',
  },
];

type Props = {
  selected?: string;
  onSelect?: (tile: ModuleTile) => void;
};

export function ModuleGrid({ selected, onSelect }: Props = {}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex flex-col items-start"
      style={{
        padding: 16,
        gap: 16,
        borderRadius: 24,
        border: '1px solid #BED0F4',
        background: 'rgba(233, 239, 251, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        boxShadow: '0 24px 48px -24px rgba(20, 49, 107, 0.28)',
      }}
    >
      {[moduleTiles.slice(0, 3), moduleTiles.slice(3, 6)].map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center self-stretch"
          style={{ gap: 16 }}
        >
          {row.map((tile, i) => {
            const isSelected = selected === tile.label;
            return (
            <motion.button
              key={tile.label}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.04 * (rowIdx * 3 + i),
                duration: 0.28,
                type: 'spring',
                stiffness: 260,
                damping: 22,
              }}
              whileHover={{
                y: -2,
                boxShadow: '0 12px 24px -12px rgba(20, 49, 107, 0.30)',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect?.(tile)}
              aria-pressed={isSelected}
              className="border border-solid flex flex-col items-center justify-center shrink-0 transition-shadow"
              style={{
                width: 125,
                padding: 10,
                gap: 6,
                borderRadius: 16,
                background: tile.bg,
                borderColor: tile.border,
                outline: isSelected ? '2px solid rgba(20, 49, 107, 0.55)' : 'none',
                outlineOffset: 2,
              }}
            >
              <div
                className="overflow-hidden flex items-center justify-center shrink-0"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 50,
                  background: tile.iconBg,
                }}
              >
                <img
                  src={tile.icon}
                  alt=""
                  draggable={false}
                  style={{ width: 20, height: 20, display: 'block' }}
                />
              </div>
              <span
                className="font-poppins font-medium whitespace-nowrap"
                style={{
                  fontSize: 14,
                  lineHeight: 'normal',
                  color: tile.text,
                }}
              >
                {tile.label}
              </span>
            </motion.button>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
}
