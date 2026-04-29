import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export type StepState = 'idle' | 'active' | 'completed';

export type StepperItem = {
  id: string;
  index: string;
  label: string;
  state: StepState;
};

type Props = {
  steps: StepperItem[];
  onSelect: (id: string) => void;
  expanded?: boolean;
  orientation?: 'vertical' | 'horizontal';
};

/**
 * Figma dashed connector line (node 5830:83647 / 5938:51325).
 * Mirrors the original SVG 1-for-1: viewBox 0 0 50 70, line x=25.75 from y=10.75→59.25,
 * stroke #808080, stroke-width 1.5, round caps, dasharray 4 4.
 */
function DashSpacer({
  tone = 'idle',
  axis = 'vertical',
}: {
  tone?: 'idle' | 'completed';
  axis?: 'vertical' | 'horizontal';
}) {
  const color = tone === 'completed' ? '#358217' : '#808080';
  if (axis === 'horizontal') {
    // Mirror of the vertical 50×70 connector: same inset proportions, rotated 90°.
    return (
      <div
        className="relative shrink-0 self-center"
        style={{ width: 70, height: 50 }}
        aria-hidden
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 70 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <line
            x1="10.75"
            y1="25.75"
            x2="59.25"
            y2="25.75"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
    );
  }
  return (
    <div
      className="relative shrink-0"
      style={{ width: 50, height: 70 }}
      aria-hidden
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 50 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <line
          x1="25.75"
          y1="10.75"
          x2="25.75"
          y2="59.25"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
}

/** Styles per step state, tuned to blend with the Figma palette. */
function pillStyle(state: StepState) {
  switch (state) {
    case 'active':
      return {
        bg: 'bg-[#255AC3]',
        border: 'border-[#255AC3]',
        text: 'text-white',
        shadow: 'shadow-[0_4px_12px_-4px_rgba(37,90,195,0.45)]',
      };
    case 'completed':
      return {
        bg: 'bg-[#E6F5E1]',
        border: 'border-[#358217]',
        text: 'text-[#358217]',
        shadow: '',
      };
    default:
      return {
        bg: 'bg-[#F6F7F8]',
        border: 'border-[#808080]',
        text: 'text-[#808080]',
        shadow: '',
      };
  }
}

function badgeStyle(state: StepState) {
  switch (state) {
    case 'active':
      return 'border-white bg-white text-brand-500';
    case 'completed':
      return 'border-[#358217] bg-white text-[#358217]';
    default:
      return 'border-[#808080] bg-transparent text-[#808080]';
  }
}

/**
 * Status / progress panel.
 *
 * Matches Figma:
 *  – Expanded  → node 5830:83642 (width 279px, pills with index + label)
 *  – Collapsed → node 5938:51321 (width 90px, 50×50 pills, badges only)
 *
 * Container tokens (both states):
 *   border-radius 24px · border 1px solid #BED0F4 · background #FFF
 *   padding 20px · flex-col · gap 4px
 */
/**
 * Wraps the horizontal stepper and tracks whether it's currently
 * pinned against the header. Uses a 1px sentinel above the sticky
 * element + IntersectionObserver — when the sentinel scrolls out of
 * view, the stepper is stuck.
 */
function HorizontalStepperContainer({
  children,
}: {
  children: (stuck: boolean) => React.ReactNode;
}) {
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const headerH =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--app-header-height'
        )
      ) || 68;
    const obs = new IntersectionObserver(
      ([entry]) => setStuck(entry.boundingClientRect.top < headerH + 0.5),
      { rootMargin: `-${headerH + 1}px 0px 0px 0px`, threshold: 0 }
    );
    obs.observe(el);
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      setStuck(r.top < headerH + 0.5);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden style={{ height: 1 }} />
      {children(stuck)}
    </>
  );
}

export function StepperPanel({
  steps,
  onSelect,
  expanded = true,
  orientation = 'vertical',
}: Props) {
  if (orientation === 'horizontal') {
    return (
      <HorizontalStepperContainer>
        {(stuck) => (
      <div
        data-stuck={stuck ? 'true' : 'false'}
        className="w-full sticky z-30"
        style={{
          position: 'sticky',
          top: 'var(--app-header-height)',
          padding: 20,
          borderRadius: stuck ? 0 : 24,
          border: '1px solid rgba(190, 208, 244, 0.6)',
          borderTop: stuck ? 'none' : '1px solid rgba(190, 208, 244, 0.6)',
          background: stuck
            ? 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(240,244,255,0.55) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(240,244,255,0.78) 100%)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          boxShadow: stuck
            ? '0 8px 24px -12px rgba(20, 49, 107, 0.28), inset 0 1px 0 rgba(255,255,255,0.6)'
            : '0 2px 8px -4px rgba(20, 49, 107, 0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
          transition: 'border-radius 220ms ease-out, box-shadow 220ms ease-out, background 220ms ease-out',
        }}
      >
        <div className="flex items-center justify-center w-full" style={{ gap: 4 }}>
          {steps.map((step, i) => {
            const pill = pillStyle(step.state);
            const badge = badgeStyle(step.state);
            const prevCompleted = i > 0 && steps[i - 1].state === 'completed';
            const isActive = step.state === 'active';

            return (
              <div key={step.id} className="flex items-center shrink-0">
                {i > 0 && (
                  <DashSpacer axis="horizontal" tone={prevCompleted ? 'completed' : 'idle'} />
                )}

                {/* Circular pill — matches collapsed vertical state (50×50, badge inside) */}
                <div className="relative group shrink-0">
                  <motion.button
                    layout
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(step.id)}
                    aria-label={step.label}
                    aria-current={isActive ? 'step' : undefined}
                    className={`${pill.bg} ${pill.border} ${pill.text} ${pill.shadow} border border-solid flex items-center justify-center transition-colors`}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 24,
                    }}
                  >
                    <div
                      className={`${badge} border border-solid flex items-center justify-center font-medium shrink-0`}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 50,
                        fontSize: 16,
                        lineHeight: 1,
                      }}
                    >
                      {step.index}
                    </div>
                  </motion.button>

                  {/* Hover tooltip — shows the step label in a glassy pill above the badge */}
                  <div
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:-translate-y-0 group-focus-within:opacity-100 group-focus-within:-translate-y-0 transition-all duration-200 ease-out"
                    style={{ bottom: 'calc(100% + 10px)', zIndex: 20 }}
                    role="tooltip"
                  >
                    <div
                      className="whitespace-nowrap font-poppins font-medium"
                      style={{
                        padding: '8px 14px',
                        borderRadius: 12,
                        fontSize: 12,
                        lineHeight: 1.2,
                        color: '#FFFFFF',
                        background:
                          'linear-gradient(135deg, rgba(20,41,82,0.96) 0%, rgba(37,90,195,0.96) 100%)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow:
                          '0 12px 28px -8px rgba(20, 49, 107, 0.45), 0 2px 4px rgba(20, 49, 107, 0.12)',
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{
                        top: '100%',
                        width: 10,
                        height: 10,
                        marginTop: -5,
                        background:
                          'linear-gradient(135deg, rgba(20,41,82,0.96) 0%, rgba(37,90,195,0.96) 100%)',
                        transform: 'translateX(-50%) rotate(45deg)',
                        borderRight: '1px solid rgba(255,255,255,0.12)',
                        borderBottom: '1px solid rgba(255,255,255,0.12)',
                      }}
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
        )}
      </HorizontalStepperContainer>
    );
  }

  return (
    <motion.div
      animate={{ width: expanded ? 279 : 90 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="shrink-0 self-start sticky"
      style={{
        position: 'sticky',
        width: expanded ? 279 : 90,
        top: 'var(--app-sticky-top)',
      }}
    >
      <motion.div
        layout
        className="flex flex-col"
        style={{
          width: '100%',
          padding: 20,
          gap: 4,
          alignItems: expanded ? 'flex-start' : 'center',
          borderRadius: 24,
          border: '1px solid #BED0F4',
          background: '#FFF',
        }}
      >
        {steps.map((step, i) => {
          const pill = pillStyle(step.state);
          const badge = badgeStyle(step.state);
          const prevCompleted = i > 0 && steps[i - 1].state === 'completed';

          return (
            <div
              key={step.id}
              className={expanded ? 'w-full' : ''}
              style={expanded ? undefined : { alignSelf: 'center' }}
            >
              {i > 0 && (
                <div className={expanded ? 'pl-[8px]' : 'flex justify-center'}>
                  <DashSpacer tone={prevCompleted ? 'completed' : 'idle'} />
                </div>
              )}

              <motion.button
                layout
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(step.id)}
                aria-label={step.label}
                aria-current={step.state === 'active' ? 'step' : undefined}
                className={`${pill.bg} ${pill.border} ${pill.text} ${pill.shadow} border border-solid flex items-center transition-colors`}
                style={{
                  borderRadius: expanded ? 16 : 24,
                  padding: expanded ? '12px 8px' : 0,
                  gap: 8,
                  width: expanded ? '100%' : 50,
                  height: expanded ? undefined : 50,
                  justifyContent: expanded ? 'flex-start' : 'center',
                }}
              >
                <div
                  className={`${badge} border border-solid flex items-center justify-center font-medium shrink-0`}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 50,
                    fontSize: 16,
                    lineHeight: 1,
                  }}
                >
                  {step.index}
                </div>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className="font-medium text-left overflow-hidden"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: 14,
                        lineHeight: 'normal',
                        width: 160,
                        whiteSpace: 'normal',
                      }}
                    >
                      {step.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
