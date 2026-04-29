import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CaretRight } from './icons';
import { ProfileMenu } from './ProfileMenu';

/**
 * Header — Figma node 5830:82739 (IFMIS-NG_BPL)
 * Exact spec:
 * - gradient: #336699 @ 16.528% -> #443399 @ 82.153%
 * - border-bottom 1px #2273c3
 * - padding: 24px / 6px
 * - icon bubbles: #e9effb (lavender 32px)
 * - notification dot: #ff6a00 / text #4c2000
 * - profile pill: #1f1c4a, rounded 16px
 */
type HeaderProps = {
  stepperLayout?: 'side' | 'top';
  onChangeStepperLayout?: (layout: 'side' | 'top') => void;
};

export function Header({ stepperLayout = 'side', onChangeStepperLayout }: HeaderProps) {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [fontStep, setFontStep] = useState<0 | 1 | 2>(1);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'linear-gradient(90deg, #369 16.53%, #439 82.15%)',
        borderBottom: '1px solid #2273C3',
        boxShadow: '0 1px 2px 0 rgba(20, 49, 107, 0.5)',
      }}
    >
      <div className="flex items-center justify-between px-6 py-1.5">
        {/* Left: Logo */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="w-[55px] h-[55px] rounded-full overflow-hidden">
            <img
              src="/assets/logo.png"
              alt="IFMIS-NG"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          <div className="flex flex-col leading-none">
            <div className="text-white font-semibold text-[24px] font-poppins">IFMIS-NG</div>
            <div className="text-[#e6e6e6] font-medium text-[14px] font-poppins mt-1">
              Financial Management
            </div>
          </div>
        </motion.div>

        {/* Right cluster */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="flex items-center gap-10"
        >
          {/* Language + Font size group */}
          <div className="flex items-center gap-6">
            {/* Language toggle — segmented pill with sliding indicator */}
            <div
              className="relative flex items-center rounded-[16px] border border-white overflow-hidden"
              role="tablist"
              aria-label="Language"
            >
              {(['en', 'hi'] as const).map((code) => {
                const active = lang === code;
                const label = code === 'en' ? 'English' : 'हिन्दी';
                return (
                  <motion.button
                    key={code}
                    onClick={() => setLang(code)}
                    whileTap={{ scale: 0.97 }}
                    role="tab"
                    aria-selected={active}
                    className="relative w-20 h-8 flex items-center justify-center font-poppins font-semibold text-[14px] focus:outline-none"
                  >
                    {/* Sliding active pill */}
                    {active && (
                      <motion.span
                        layoutId="lang-pill"
                        className="absolute inset-0 rounded-[16px] bg-white"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <motion.span
                      animate={{ color: active ? '#142952' : '#FFFFFF' }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 leading-none"
                    >
                      {label}
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>

            {/* Font size group */}
            <div className="flex items-center gap-4">
              {[
                { step: 0, size: 12, label: 'Decrease font size' },
                { step: 1, size: 16, label: 'Default font size' },
                { step: 2, size: 20, label: 'Increase font size' },
              ].map(({ step, size, label }) => {
                const active = fontStep === step;
                return (
                  <motion.button
                    key={step}
                    onClick={() => setFontStep(step as 0 | 1 | 2)}
                    aria-label={label}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className={`relative size-6 rounded-[8px] flex items-center justify-center font-semibold text-white font-poppins transition-colors ${
                      active
                        ? 'bg-white/70 text-[#142952]'
                        : 'bg-transparent hover:bg-white/40'
                    }`}
                    style={{ fontSize: size, lineHeight: 1 }}
                  >
                    A
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Settings + Bell */}
          <div className="flex items-center gap-6">
            {/* Settings */}
            <button className="flex items-center gap-2 group">
              <span className="relative size-8 rounded-full bg-[#e9effb] flex items-center justify-center transition-transform group-hover:rotate-45">
                <GearIcon />
              </span>
              <span className="text-white text-[14px] font-medium font-poppins">Settings</span>
            </button>

            {/* Bell */}
            <button className="relative">
              <span className="relative size-8 rounded-full bg-[#e9effb] flex items-center justify-center transition-transform hover:scale-105">
                <BellIcon />
              </span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 14 }}
                className="absolute -top-2 left-[calc(50%+1px)] min-w-5 h-5 px-1 rounded-full bg-[#ff6a00] text-[#4c2000] text-[14px] font-semibold flex items-center justify-center leading-none"
              >
                2
              </motion.span>
            </button>
          </div>

          {/* Profile */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-3 bg-[#1f1c4a] rounded-[16px] px-2 py-1.5 hover:bg-[#26216a] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full overflow-hidden bg-white/10">
                  <img
                    src="/assets/avatar.png"
                    alt="Anurag Singh"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                <span className="text-white text-[14px] font-medium font-poppins">
                  Anurag Singh
                </span>
              </div>
              <motion.span
                animate={{ rotate: profileOpen ? -90 : 90 }}
                transition={{ duration: 0.22 }}
                className="size-6 flex items-center justify-center text-white"
              >
                <CaretRight size={20} />
              </motion.span>
            </motion.button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-[58px] z-50"
                >
                  <ProfileMenu
                    onClose={() => setProfileOpen(false)}
                    stepperLayout={stepperLayout}
                    onChangeStepperLayout={onChangeStepperLayout}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

/* Inline icons that match the Figma pixel weights */

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
        stroke="#142952"
        strokeWidth="1.6"
      />
      <path
        d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.88-.34 1.7 1.7 0 00-1.03 1.56V21a2 2 0 11-4 0v-.08a1.7 1.7 0 00-1.1-1.56 1.7 1.7 0 00-1.88.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.7 1.7 0 004.68 15a1.7 1.7 0 00-1.56-1.03H3a2 2 0 110-4h.08A1.7 1.7 0 004.64 9a1.7 1.7 0 00-.34-1.88l-.06-.06a2 2 0 112.83-2.83l.06.06A1.7 1.7 0 009 4.64a1.7 1.7 0 001.03-1.56V3a2 2 0 114 0v.08A1.7 1.7 0 0015 4.64a1.7 1.7 0 001.88-.34l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.36 9c.12.38.38.7.76.88.38.18.8.24 1.2.16.3-.06.57-.18.8-.36.22-.18.38-.42.48-.68"
        stroke="#142952"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9a6 6 0 1112 0v3.2c0 .8.3 1.5.8 2.1L20 16H4l1.2-1.7c.5-.6.8-1.3.8-2.1V9z"
        stroke="#142952"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M10 19a2 2 0 004 0"
        stroke="#142952"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M17.5 4.5c1.5 1.2 2.4 2.9 2.5 4.8M4 9.3c.1-1.9 1-3.6 2.5-4.8"
        stroke="#142952"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
