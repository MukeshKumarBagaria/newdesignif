import { motion } from 'framer-motion';

const ROLE_CONFIG = {
  verifier: {
    label: 'Verifier Review',
    from: 'Submitted by Creator',
    bg: 'linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%)',
    border: '#93C5FD',
    dot: '#3B82F6',
    text: '#1E40AF',
    badge: { bg: '#DBEAFE', border: '#93C5FD', color: '#1D4ED8' },
  },
  approver: {
    label: 'Approver Review',
    from: 'Forwarded by Verifier',
    bg: 'linear-gradient(135deg,#F5F3FF 0%,#EDE9FE 100%)',
    border: '#C4B5FD',
    dot: '#7C3AED',
    text: '#4C1D95',
    badge: { bg: '#EDE9FE', border: '#C4B5FD', color: '#6D28D9' },
  },
};

export function WorkflowBanner({ role, submittedBy, submittedAt, module }) {
  const cfg = ROLE_CONFIG[role];
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-2xl flex items-center justify-between flex-wrap"
      style={{ padding: '12px 20px', gap: 12, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <div className="flex items-center gap-3">
        <span
          style={{ width: 10, height: 10, borderRadius: 999, background: cfg.dot, flexShrink: 0,
            boxShadow: `0 0 0 4px ${cfg.dot}22` }}
        />
        <div className="flex flex-col" style={{ gap: 2 }}>
          <span className="font-poppins" style={{ fontSize: 14, fontWeight: 700, color: cfg.text }}>
            {cfg.label} — {module}
          </span>
          <span className="font-poppins" style={{ fontSize: 12, fontWeight: 500, color: cfg.text, opacity: 0.75 }}>
            {cfg.from} · <strong>{submittedBy}</strong> on {submittedAt}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-poppins" style={{
          height: 24, padding: '0 10px', borderRadius: 999, display: 'inline-flex', alignItems: 'center',
          background: cfg.badge.bg, border: `1px solid ${cfg.badge.border}`,
          color: cfg.badge.color, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Awaiting {role === 'verifier' ? 'Verification' : 'Approval'}
        </span>
      </div>
    </motion.div>
  );
}
