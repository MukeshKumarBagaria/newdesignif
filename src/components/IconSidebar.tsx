import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ModuleGrid, type ModuleTile } from './ModuleGrid';

type Props = {
  expanded: boolean;
  onToggle: () => void;
  moduleMenuOpen: boolean;
  onOpenModuleMenu: (v: boolean) => void;
};

const defaultModule: ModuleTile = {
  label: 'HRMS',
  icon: '/assets/icon-usercircle.svg',
  bg: 'linear-gradient(90deg, #BED9F4 0%, #B4A8F0 100%)',
  border: '#BED0F4',
  iconBg: '#E9EFFB',
  text: '#142952',
};

type SubItem = {
  label: string;
  icon: string;
  active?: boolean;
};

const subItems: SubItem[] = [
  { label: 'Dashboard',        icon: '/assets/icon-squares.svg',      active: true },
  { label: 'Reimbursement',    icon: '/assets/icon-handcoins.svg' },
  { label: 'Leave Encashment', icon: '/assets/icon-cashregister.svg' },
  { label: 'E-profile',        icon: '/assets/icon-usercheck.svg' },
];

export function IconSidebar({ expanded, onToggle, moduleMenuOpen, onOpenModuleMenu }: Props) {
  const [activeKey, setActiveKey] = useState<string>('Dashboard');
  const [selectedModule, setSelectedModule] = useState<ModuleTile>(defaultModule);

  const handleModuleSelect = (tile: ModuleTile) => {
    setSelectedModule(tile);
    onOpenModuleMenu(false);
  };

  return (
    <motion.aside
      animate={{ width: expanded ? '17.4375rem' : '7.4375rem' }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="shrink-0 flex flex-col items-start self-start sticky z-30"
      style={{
        position: 'sticky',
        top: 'var(--app-sticky-top)',
        gap: '2.5rem',
      }}
    >
      {/* ───────────── Top card: toggle + search + worklist ───────────── */}
      <div className="w-full rounded-[20px] bg-white ring-1 ring-grey-50 shadow-soft p-4 flex flex-col items-end gap-4">
        {/* Top row: search (collapsed only) + toggle */}
        <div className="flex items-center justify-end gap-3 self-stretch">
          {!expanded && (
            <motion.button
              key="search-icon-inline"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className="w-10 h-10 bg-[#e9effb] border border-[#5a72a5] rounded-full flex items-center justify-center hover:bg-[#dde4f5] transition"
              aria-label="Search"
            >
              <img src="/assets/magnifier.svg" alt="" className="w-5 h-5" />
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            className="w-10 h-10 rounded-full bg-white ring-1 ring-grey-100 flex items-center justify-center text-brand-500 hover:bg-brand-10 transition"
          >
            <img src="/assets/sidebar-toggle.svg" alt="" className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Expanded search bar (full width below toggle) */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="search-input"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="w-full flex items-center overflow-hidden"
            >
              <div className="flex-1 min-w-0 h-10 bg-white border border-[#5a72a5] border-r-0 rounded-l-[16px] px-3 flex items-center">
                <input
                  placeholder="Search"
                  className="w-full text-[14px] font-normal text-[#5a72a5] placeholder:text-[#5a72a5] bg-transparent outline-none"
                />
              </div>
              <button className="w-10 h-10 bg-[#e9effb] border border-[#5a72a5] rounded-r-[16px] flex items-center justify-center hover:bg-[#dde4f5] transition">
                <img src="/assets/magnifier.svg" alt="" className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Worklist */}
        <AnimatePresence initial={false} mode="wait">
          {expanded ? (
            <motion.button
              key="worklist-pill"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              whileHover={{ y: -1 }}
              className="w-full h-11 rounded-[24px] bg-[#FFF0E5] border border-[#FFE1CC] px-3 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFE1CC] flex items-center justify-center">
                  <img src="/assets/calendar-check.svg" alt="" className="w-6 h-6" />
                </div>
                <span className="text-[16px] font-medium text-[#4C2000] font-poppins">
                  Worklist
                </span>
              </div>
              <span className="text-[16px] font-semibold text-[#994000] font-poppins">28</span>
            </motion.button>
          ) : (
            <motion.button
              key="worklist-badge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="self-center h-10 pl-2 pr-3 rounded-full bg-[#FFF0E5] border border-[#FFE1CC] flex items-center gap-1.5 text-[#994000] hover:shadow-md transition"
            >
              <div className="w-7 h-7 rounded-full bg-[#FFE1CC] flex items-center justify-center">
                <img src="/assets/calendar-check.svg" alt="" className="w-5 h-5" />
              </div>
              <span className="text-[13px] font-semibold font-poppins">28</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ───────────── Bottom card: Module selector — Figma node 5938:51270 ─────────────
          Pixel-matched to Figma: card 279×363, selection bar centered w=247 at top 15,
          module container 223px wide offset left 40px top 48px, gap 40 between HRMS
          and list, list gap 18 with items-end, tree connector behind all pills.
          Wrapped in a relative container so the Module-grid popup can anchor to
          this card (and not to the full-height sidebar). */}
      <div className="relative w-full">
      {expanded ? (
        <div
          className="relative rounded-[24px] bg-white border border-[#BED0F4] overflow-hidden"
          style={{ width: 279, height: 363 }}
        >
          {/* Tree connector — drawn first so pill backgrounds cover the overlapping portions */}
          <svg
            aria-hidden
            className="absolute left-0 top-0 pointer-events-none"
            width="279"
            height="363"
          >
            <line x1="15.5" y1="70" x2="15.5" y2="326" stroke="#D9D9D9" strokeWidth="1" />
            <line x1="15" y1="70.5" x2="89" y2="70.5" stroke="#D9D9D9" strokeWidth="1" />
            <line x1="15" y1="152.5" x2="111" y2="152.5" stroke="#D9D9D9" strokeWidth="1" />
            <line x1="15" y1="210.5" x2="111" y2="210.5" stroke="#D9D9D9" strokeWidth="1" />
            <line x1="15" y1="268.5" x2="111" y2="268.5" stroke="#D9D9D9" strokeWidth="1" />
            <line x1="15" y1="326.5" x2="111" y2="326.5" stroke="#D9D9D9" strokeWidth="1" />
          </svg>

          {/* Selection Bar — 247px centered at top 15 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{ top: 15, width: 247, gap: 4 }}
          >
            <div className="h-px bg-[#D9D9D9]" style={{ width: 40 }} />
            <span
              className="shrink-0 font-poppins font-medium whitespace-nowrap"
              style={{ fontSize: 14, color: '#808080' }}
            >
              Selected Module
            </span>
            <div className="h-px bg-[#D9D9D9] flex-1 min-w-[1px]" />
          </div>

          {/* Module Container — 223px wide at (40, 48) */}
          <div
            className="absolute flex flex-col items-start justify-center"
            style={{ left: 40, top: 48, width: 223, gap: 40 }}
          >
            {/* HRMS pill — Selected Module Container (node 5938:51278)
                border-radius 24 · border 1px #BED0F4 · gradient 90deg #BED9F4→#B4A8F0
                padding 6px 12px · justify-between · align-self stretch */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenModuleMenu(!moduleMenuOpen)}
              aria-haspopup="menu"
              aria-expanded={moduleMenuOpen}
              className="border border-solid flex items-center justify-between self-stretch hover:shadow-md transition-shadow"
              style={{
                boxSizing: 'border-box',
                padding: '6px 12px',
                borderRadius: 24,
                borderColor: selectedModule.border,
                background: selectedModule.bg.startsWith('linear-')
                  ? selectedModule.bg
                  : selectedModule.bg,
              }}
            >
              <div className="flex items-center" style={{ gap: 8 }}>
                <div
                  className="overflow-hidden flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 50,
                    background: selectedModule.iconBg,
                  }}
                >
                  <img
                    src={selectedModule.icon}
                    alt=""
                    style={{ width: 24, height: 24 }}
                  />
                </div>
                <motion.span
                  key={selectedModule.label}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-poppins font-semibold whitespace-nowrap"
                  style={{
                    fontSize: 16,
                    lineHeight: '24px',
                    color: selectedModule.text,
                  }}
                >
                  {selectedModule.label}
                </motion.span>
              </div>
              <motion.img
                animate={{ rotate: moduleMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.22 }}
                src="/assets/icon-caret-white.svg"
                alt=""
                style={{ width: 24, height: 24 }}
              />
            </motion.button>

            {/* Module List — items 200px, gap 18, items-end */}
            <div
              className="relative flex flex-col items-end justify-center self-stretch"
              style={{ gap: 18 }}
            >
              {subItems.map((item) => {
                const isActive = activeKey === item.label;
                // Reimbursement uses grey-50; Leave Encashment & E-profile use white.
                const isReimbursement = item.label === 'Reimbursement';
                const bg = isActive
                  ? '#D4E0F7'
                  : isReimbursement
                    ? '#F2F2F2'
                    : '#FFFFFF';
                const borderColor = isActive ? '#BED0F4' : '#D9D9D9';

                return (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveKey(item.label)}
                    className="border border-solid flex items-center transition-colors"
                    style={{
                      width: 200,
                      height: 40,
                      borderRadius: 24,
                      padding: '0 10px',
                      background: bg,
                      borderColor,
                      justifyContent: isActive ? 'flex-start' : 'space-between',
                      gap: isActive ? 6 : 0,
                    }}
                  >
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <div
                        className="overflow-hidden flex items-center justify-center"
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 50,
                          background: isActive ? '#255AC3' : '#F6F7F8',
                        }}
                      >
                        <img
                          src={item.icon}
                          alt=""
                          className={isActive ? 'brightness-0 invert' : ''}
                          style={{ width: 20, height: 20 }}
                        />
                      </div>
                      <span
                        className={`font-poppins text-[#142952] whitespace-nowrap ${
                          isActive ? 'font-semibold' : 'font-medium'
                        }`}
                        style={{ fontSize: 14, lineHeight: 'normal' }}
                      >
                        {item.label}
                      </span>
                    </div>
                    {!isActive && (
                      <img
                        src="/assets/icon-caret-dark.svg"
                        alt=""
                        style={{ width: 20, height: 20, opacity: 0.7 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed module card */
        <div className="w-full rounded-[20px] bg-white ring-1 ring-grey-50 shadow-soft p-3 flex flex-col items-center gap-2">
          <button
            onClick={() => onOpenModuleMenu(!moduleMenuOpen)}
            aria-haspopup="menu"
            aria-expanded={moduleMenuOpen}
            className="w-10 h-10 rounded-full flex items-center justify-center ring-1"
            style={{ background: selectedModule.iconBg, borderColor: selectedModule.border }}
          >
            <img src={selectedModule.icon} alt={selectedModule.label} className="w-6 h-6" />
          </button>
          {subItems.map((item) => {
            const isActive = activeKey === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveKey(item.label)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  isActive ? 'bg-[#255AC3]' : 'hover:bg-grey-25'
                }`}
                aria-label={item.label}
              >
                <img
                  src={item.icon}
                  alt=""
                  className={`w-5 h-5 ${isActive ? 'brightness-0 invert' : ''}`}
                />
              </button>
            );
          })}
        </div>
      )}

        {/* Module grid popup — anchored to the right edge of THIS card
            (the "Selected Module" card) so it visually launches from the
            HRMS pill. z-index sits above the click-catcher (z-30) and the
            StepperPanel (auto), but below the sticky header (z-50). */}
        <AnimatePresence>
          {moduleMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.96, x: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute z-40"
              style={{
                top: 0,
                left: 'calc(100% + 16px)',
              }}
              role="menu"
              aria-label="Switch module"
            >
              <ModuleGrid
                selected={selectedModule.label}
                onSelect={handleModuleSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
