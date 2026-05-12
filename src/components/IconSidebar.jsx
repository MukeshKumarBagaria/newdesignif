import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ModuleGrid } from './ModuleGrid';

const defaultModule = {
  label: 'HRMS',
  icon: '/assets/icon-usercircle.svg',
  bg: 'linear-gradient(90deg, #BED9F4 0%, #B4A8F0 100%)',
  border: '#BED0F4',
  iconBg: '#E9EFFB',
  text: '#142952',
};

/* ─── Navigation tree ──────────────────────────────────────────── */

const NAV_ITEMS = [
  { key: 'Dashboard',            label: 'Dashboard',            icon: '/assets/icon-squares.svg' },
  {
    key: 'Account Head',         label: 'Account Head',          icon: '/assets/icon-cashregister.svg',
    children: [
      { key: 'Account Head / Creator',  label: 'Creator' },
      { key: 'Account Head / Verifier', label: 'Verifier' },
      { key: 'Account Head / Approver', label: 'Approver' },
    ],
  },
  {
    key: 'Object + Detail Head', label: 'Object + Detail Head',  icon: '/assets/icon-cashregister.svg',
    children: [
      { key: 'Object + Detail Head / Creator',  label: 'Creator' },
      { key: 'Object + Detail Head / Verifier', label: 'Verifier' },
      { key: 'Object + Detail Head / Approver', label: 'Approver' },
    ],
  },
  { key: 'Scheme Creation',      label: 'Scheme Creation',       icon: '/assets/icon-handcoins.svg' },
  { key: 'Reimbursement',        label: 'Reimbursement',         icon: '/assets/icon-handcoins.svg' },
  { key: 'Leave Encashment',     label: 'Leave Encashment',      icon: '/assets/icon-cashregister.svg' },
  { key: 'E-profile',            label: 'E-profile',             icon: '/assets/icon-usercheck.svg' },
];

const ROLE_COLORS = {
  Creator:  { bg: '#F0FDF4', border: '#86EFAC', color: '#166534' },
  Verifier: { bg: '#EFF6FF', border: '#93C5FD', color: '#1E40AF' },
  Approver: { bg: '#F5F3FF', border: '#C4B5FD', color: '#6D28D9' },
};

/* ─── Sub-item child row (Creator / Verifier / Approver) ────────── */

function ChildItem({ item, isActive, onClick }) {
  const rc = ROLE_COLORS[item.label] ?? {};
  return (
    <motion.button
      whileHover={{ x: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(item.key)}
      className="flex items-center self-stretch transition-colors"
      style={{
        height: 32,
        borderRadius: 20,
        padding: '0 10px 0 36px',
        background: isActive ? (rc.bg ?? '#D4E0F7') : 'transparent',
        border: `1px solid ${isActive ? (rc.border ?? '#BED0F4') : 'transparent'}`,
        gap: 8,
      }}
    >
      <span
        style={{
          width: 6, height: 6, borderRadius: 999, flexShrink: 0,
          background: isActive ? (rc.color ?? '#255AC3') : '#D9D9D9',
        }}
      />
      <span
        className="font-poppins truncate"
        style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? (rc.color ?? '#142952') : '#7A8FB5' }}
      >
        {item.label}
      </span>
    </motion.button>
  );
}

/* ─── Top-level nav item (with optional children) ───────────────── */

function NavItem({ item, activeKey, onSelect, expandedKeys, onToggleExpand }) {
  const isParent = !!item.children;
  const isExpanded = expandedKeys.has(item.key);
  const isActive = activeKey === item.key;
  const hasActiveChild = isParent && item.children.some(c => c.key === activeKey);

  const bg = isActive || hasActiveChild ? '#D4E0F7' : '#FFFFFF';
  const borderColor = isActive || hasActiveChild ? '#BED0F4' : '#D9D9D9';

  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      <motion.button
        whileHover={{ x: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (isParent) onToggleExpand(item.key);
          else onSelect(item.key);
        }}
        className="border border-solid flex items-center transition-colors"
        style={{
          width: 200, height: 40, borderRadius: 24, padding: '0 10px',
          background: bg, borderColor,
          justifyContent: isActive || hasActiveChild ? 'flex-start' : 'space-between',
          gap: isActive || hasActiveChild ? 6 : 0,
        }}
      >
        <div className="flex items-center" style={{ gap: 6 }}>
          <div
            className="overflow-hidden flex items-center justify-center"
            style={{ width: 24, height: 24, borderRadius: 50, background: isActive || hasActiveChild ? '#255AC3' : '#F6F7F8' }}
          >
            <img src={item.icon} alt="" className={isActive || hasActiveChild ? 'brightness-0 invert' : ''} style={{ width: 20, height: 20 }} />
          </div>
          <span
            className="font-poppins text-[#142952] truncate"
            style={{ fontSize: 13, fontWeight: isActive || hasActiveChild ? 700 : 500, maxWidth: 110 }}
          >
            {item.label}
          </span>
        </div>
        {isParent ? (
          <motion.svg
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ marginLeft: 'auto', opacity: 0.6 }}
          >
            <path d="M9 18l6-6-6-6" stroke="#5A72A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        ) : (
          !isActive && (
            <img src="/assets/icon-caret-dark.svg" alt="" style={{ width: 20, height: 20, opacity: 0.7 }} />
          )
        )}
      </motion.button>

      {/* Children */}
      <AnimatePresence initial={false}>
        {isParent && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
            className="flex flex-col"
            style={{ gap: 2 }}
          >
            {item.children.map(child => (
              <ChildItem
                key={child.key}
                item={child}
                isActive={activeKey === child.key}
                onClick={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sidebar ───────────────────────────────────────────────────── */

export function IconSidebar({
  expanded,
  onToggle,
  moduleMenuOpen,
  onOpenModuleMenu,
  activeMenuKey,
  onMenuChange,
}) {
  const [activeKey, setActiveKey] = useState('Account Head / Creator');
  const [selectedModule, setSelectedModule] = useState(defaultModule);

  // Auto-expand parents that contain the active key
  const initExpanded = () => {
    const s = new Set();
    NAV_ITEMS.forEach(item => {
      if (item.children?.some(c => c.key === activeKey)) s.add(item.key);
    });
    return s;
  };
  const [expandedKeys, setExpandedKeys] = useState(initExpanded);

  const currentActiveKey = activeMenuKey ?? activeKey;

  const setMenu = (key) => {
    setActiveKey(key);
    onMenuChange?.(key);
  };

  const toggleExpand = (key) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleModuleSelect = (tile) => {
    setSelectedModule(tile);
    onOpenModuleMenu(false);
  };

  return (
    <motion.aside
      animate={{ width: expanded ? '17.4375rem' : '7.4375rem' }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="shrink-0 flex flex-col items-start z-30"
      style={{ position: 'sticky', top: 'var(--app-sticky-top)', gap: '1rem', maxHeight: 'calc(100vh - var(--app-sticky-top) - 1.25rem)' }}
    >
      {/* ── Top card: search + worklist ── */}
      <div className="relative w-full rounded-[20px] bg-white ring-1 ring-grey-50 shadow-soft p-4 flex flex-col items-end gap-4 overflow-visible">
        <motion.button
          whileHover={{ scale: 1.05, x: expanded ? 22 : 22 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggle}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          className="absolute z-10 w-11 h-11 rounded-full flex items-center justify-center"
          style={{ top: 14, right: -22, background: 'linear-gradient(135deg,#FFFFFF 0%,#F4F7FE 100%)', border: '1px solid #BED0F4', boxShadow: '0 8px 20px -8px rgba(37,90,195,0.35),0 2px 4px -1px rgba(20,49,107,0.08),inset 0 1px 0 rgba(255,255,255,0.9)' }}
        >
          <motion.img
            animate={{ rotate: expanded ? 0 : 180 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            src="/assets/sidebar-toggle.svg" alt="" className="w-6 h-6"
          />
        </motion.button>

        <div className="flex items-center self-stretch" style={{ paddingRight: 28 }}>
          {expanded ? (
            <motion.div key="search-input" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }} className="w-full flex items-center">
              <div className="flex-1 min-w-0 h-10 bg-white border border-[#5a72a5] border-r-0 rounded-l-[16px] px-3 flex items-center">
                <input placeholder="Search" className="w-full text-[14px] font-normal text-[#5a72a5] placeholder:text-[#5a72a5] bg-transparent outline-none" />
              </div>
              <button className="w-10 h-10 bg-[#e9effb] border border-[#5a72a5] rounded-r-[16px] flex items-center justify-center hover:bg-[#dde4f5] transition">
                <img src="/assets/magnifier.svg" alt="" className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.button key="search-icon-inline" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }} className="w-10 h-10 bg-[#e9effb] border border-[#5a72a5] rounded-full flex items-center justify-center hover:bg-[#dde4f5] transition" aria-label="Search">
              <img src="/assets/magnifier.svg" alt="" className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        <AnimatePresence initial={false} mode="wait">
          {expanded ? (
            <motion.button key="worklist-pill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} whileHover={{ y: -1 }}
              className="w-full h-11 rounded-[24px] bg-[#FFF0E5] border border-[#FFE1CC] px-3 flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFE1CC] flex items-center justify-center">
                  <img src="/assets/calendar-check.svg" alt="" className="w-6 h-6" />
                </div>
                <span className="text-[16px] font-medium text-[#4C2000] font-poppins">Worklist</span>
              </div>
              <span className="text-[16px] font-semibold text-[#994000] font-poppins">28</span>
            </motion.button>
          ) : (
            <motion.button key="worklist-badge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
              className="self-center h-10 pl-2 pr-3 rounded-full bg-[#FFF0E5] border border-[#FFE1CC] flex items-center gap-1.5 text-[#994000] hover:shadow-md transition">
              <div className="w-7 h-7 rounded-full bg-[#FFE1CC] flex items-center justify-center">
                <img src="/assets/calendar-check.svg" alt="" className="w-5 h-5" />
              </div>
              <span className="text-[13px] font-semibold font-poppins">28</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom card: nav ── */}
      <div className="relative w-full">
        {expanded ? (
          <div className="relative rounded-[24px] bg-white border border-[#BED0F4] overflow-hidden overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - var(--app-sticky-top) - 14rem)' }}>
            <div className="flex flex-col items-start" style={{ padding: '16px 16px 16px 40px', gap: 4 }}>

              {/* Selected Module pill */}
              <div className="self-stretch flex items-center justify-center" style={{ marginBottom: 12 }}>
                <div className="h-px bg-[#D9D9D9] flex-1" />
                <span className="font-poppins font-medium mx-3 shrink-0 whitespace-nowrap" style={{ fontSize: 13, color: '#808080' }}>Selected Module</span>
                <div className="h-px bg-[#D9D9D9] flex-1" />
              </div>

              <motion.button
                whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                onClick={() => onOpenModuleMenu(!moduleMenuOpen)}
                aria-haspopup="menu" aria-expanded={moduleMenuOpen}
                className="border border-solid flex items-center justify-between self-stretch hover:shadow-md transition-shadow"
                style={{ boxSizing: 'border-box', padding: '6px 12px', borderRadius: 24, borderColor: selectedModule.border, background: selectedModule.bg, marginBottom: 16 }}
              >
                <div className="flex items-center" style={{ gap: 8 }}>
                  <div className="overflow-hidden flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 50, background: selectedModule.iconBg }}>
                    <img src={selectedModule.icon} alt="" style={{ width: 24, height: 24 }} />
                  </div>
                  <span className="font-poppins font-semibold whitespace-nowrap" style={{ fontSize: 15, color: selectedModule.text }}>{selectedModule.label}</span>
                </div>
                <motion.img animate={{ rotate: moduleMenuOpen ? 90 : 0 }} transition={{ duration: 0.22 }} src="/assets/icon-caret-white.svg" alt="" style={{ width: 24, height: 24 }} />
              </motion.button>

              {/* Nav items */}
              <div className="flex flex-col items-end self-stretch" style={{ gap: 6 }}>
                {NAV_ITEMS.map(item => (
                  <NavItem
                    key={item.key}
                    item={item}
                    activeKey={currentActiveKey}
                    onSelect={setMenu}
                    expandedKeys={expandedKeys}
                    onToggleExpand={toggleExpand}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Collapsed: icon-only */
          <div className="w-full rounded-[20px] bg-white ring-1 ring-grey-50 shadow-soft p-3 flex flex-col items-center gap-2">
            <button onClick={() => onOpenModuleMenu(!moduleMenuOpen)} aria-haspopup="menu" aria-expanded={moduleMenuOpen}
              className="w-10 h-10 rounded-full flex items-center justify-center ring-1"
              style={{ background: selectedModule.iconBg, borderColor: selectedModule.border }}>
              <img src={selectedModule.icon} alt={selectedModule.label} className="w-6 h-6" />
            </button>
            {NAV_ITEMS.map(item => {
              const isActive = currentActiveKey === item.key || item.children?.some(c => c.key === currentActiveKey);
              return (
                <button key={item.key}
                  onClick={() => item.children ? toggleExpand(item.key) : setMenu(item.key)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${isActive ? 'bg-[#255AC3]' : 'hover:bg-grey-25'}`}
                  aria-label={item.label}>
                  <img src={item.icon} alt="" className={`w-5 h-5 ${isActive ? 'brightness-0 invert' : ''}`} />
                </button>
              );
            })}
          </div>
        )}

        {/* Module grid popup */}
        <AnimatePresence>
          {moduleMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, x: -8 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.96, x: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute z-40" style={{ top: 0, left: 'calc(100% + 16px)' }}
              role="menu" aria-label="Switch module"
            >
              <ModuleGrid selected={selectedModule.label} onSelect={handleModuleSelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
