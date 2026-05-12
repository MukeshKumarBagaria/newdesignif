import { motion } from 'framer-motion';

export function WorkflowFooter({ role, onReturn, onForward, onReject, onApprove, canForward = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-cta sticky bottom-5 z-30 box-border flex items-center justify-between self-stretch flex-wrap"
      style={{ padding: '16px 28px', gap: 16 }}
    >
      <div className="flex items-center gap-2">
        <span style={{ width: 8, height: 8, borderRadius: 999, background: role === 'verifier' ? '#3B82F6' : '#7C3AED' }} />
        <span className="font-poppins" style={{ fontSize: 13, fontWeight: 600, color: '#142952', textTransform: 'capitalize' }}>
          {role} Review Mode
        </span>
        <span className="font-poppins" style={{ fontSize: 12, color: '#7A8FB5' }}>
          — Review, edit if required, then {role === 'verifier' ? 'forward or return.' : 'approve, return or reject.'}
        </span>
      </div>

      <div className="flex items-center" style={{ gap: 8 }}>
        {/* Return — always available */}
        <button
          type="button"
          onClick={onReturn}
          className="font-poppins font-semibold inline-flex items-center gap-2"
          style={{ height: 40, borderRadius: 10, border: '1px solid #F5C6CB', color: '#B8141A', padding: '0 18px', background: '#FDF3F3', fontSize: 13 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Return
        </button>

        {role === 'approver' && (
          <button
            type="button"
            onClick={onReject}
            className="font-poppins font-semibold"
            style={{ height: 40, borderRadius: 10, border: '1px solid #FCA5A5', color: '#7F1D1D', padding: '0 18px', background: '#FEE2E2', fontSize: 13 }}
          >
            Reject
          </button>
        )}

        {role === 'verifier' && (
          <button
            type="button"
            onClick={onForward}
            disabled={!canForward}
            className="font-poppins font-semibold inline-flex items-center gap-2"
            style={{ height: 40, borderRadius: 10, border: '1px solid #93C5FD', color: '#1E40AF', padding: '0 20px', background: '#DBEAFE', fontSize: 13, opacity: canForward ? 1 : 0.5, cursor: canForward ? 'pointer' : 'not-allowed' }}
          >
            Forward to Approver
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {role === 'approver' && (
          <button
            type="button"
            onClick={onApprove}
            disabled={!canForward}
            className="font-poppins font-semibold inline-flex items-center gap-2"
            style={{ height: 40, borderRadius: 10, border: '1px solid #6D28D9', color: '#fff', padding: '0 20px', background: '#7C3AED', fontSize: 13, opacity: canForward ? 1 : 0.5, cursor: canForward ? 'pointer' : 'not-allowed' }}
          >
            Approve
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}
