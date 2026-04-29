import { motion } from 'framer-motion';

type ProfileMenuProps = {
  onClose?: () => void;
  stepperLayout?: 'side' | 'top';
  onChangeStepperLayout?: (layout: 'side' | 'top') => void;
};

// Matches Figma node 5938-44345 — user profile/role dropdown
export function ProfileMenu({
  onClose,
  stepperLayout = 'side',
  onChangeStepperLayout,
}: ProfileMenuProps) {
  void onClose;
  return (
    <div
      className="w-[380px] p-5 text-grey-800 shadow-[0_20px_40px_-20px_rgba(20,49,107,0.35)]"
      style={{
        borderRadius: '16px',
        border: '1px solid #BED0F4',
        background: 'rgba(233, 239, 251, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div className="text-[13px] font-medium text-brand-900 leading-relaxed">
        Assistant Internal Audit Officer-0000442105
      </div>
      <div className="text-[13px] text-grey-700 mt-1">
        DIRECTORATE OF TREASURIES AND ACCOUNTS, BHOPAL
      </div>

      <div className="mt-4 flex items-center gap-2 text-[13px]">
        <span className="font-semibold text-grey-800">Last Login:</span>
        <span className="text-grey-700">19 Jan, 2026</span>
        <span className="text-brand-500 font-semibold">09:59:01</span>
      </div>

      <div className="mt-5">
        <div className="text-[14px] font-semibold text-grey-900 mb-3">Stepper Position</div>
        <div
          className="relative flex items-center rounded-[12px] border border-brand-200 overflow-hidden bg-white/70"
          role="tablist"
          aria-label="Stepper position"
        >
          {(['side', 'top'] as const).map((pos) => {
            const active = stepperLayout === pos;
            const label = pos === 'side' ? 'Left Side' : 'Top';
            return (
              <motion.button
                key={pos}
                onClick={() => onChangeStepperLayout?.(pos)}
                whileTap={{ scale: 0.97 }}
                role="tab"
                aria-selected={active}
                className="relative flex-1 h-9 flex items-center justify-center font-poppins font-medium text-[13px] focus:outline-none"
              >
                {active && (
                  <motion.span
                    layoutId="stepper-pos-pill"
                    className="absolute inset-0 rounded-[10px] bg-brand-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <motion.span
                  animate={{ color: active ? '#FFFFFF' : '#142952' }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 leading-none"
                >
                  {label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-[14px] font-semibold text-grey-900 mb-3">Assigned Roles</div>
        <div className="flex items-center gap-3">
          {[
            { label: 'Creator', bg: 'bg-[#E6F0FF]', ring: 'ring-brand-300', text: 'text-brand-600' },
            { label: 'Verifier', bg: 'bg-[#FFF4D6]', ring: 'ring-accent-yellow-200', text: 'text-accent-yellow-800' },
            { label: 'Approver', bg: 'bg-[#FFE1CC]', ring: 'ring-accent-orange-500', text: 'text-accent-orange-700' },
          ].map((r, i) => (
            <motion.button
              key={r.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.25 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 h-9 rounded-full ${r.bg} ring-1 ${r.ring} ${r.text} text-[13px] font-medium transition-all hover:shadow-md`}
            >
              {r.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
