import { motion, AnimatePresence } from 'framer-motion';

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
};

/**
 * Figma dashed connector line (node 5830:83647 / 5938:51325).
 * Mirrors the original SVG 1-for-1: viewBox 0 0 50 70, line x=25.75 from y=10.75→59.25,
 * stroke #808080, stroke-width 1.5, round caps, dasharray 4 4.
 */
function DashSpacer({ tone = 'idle' }: { tone?: 'idle' | 'completed' }) {
  const color = tone === 'completed' ? '#358217' : '#808080';
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
export function StepperPanel({ steps, onSelect, expanded = true }: Props) {
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
