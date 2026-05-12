import { motion } from 'framer-motion';

const ROLE_COLORS = {
  creator:  { bg: '#F0FDF4', border: '#86EFAC', label: '#166534', dot: '#22C55E' },
  verifier: { bg: '#EFF6FF', border: '#93C5FD', label: '#1E40AF', dot: '#3B82F6' },
  approver: { bg: '#F5F3FF', border: '#C4B5FD', label: '#4C1D95', dot: '#7C3AED' },
};

function RemarkItem({ role, name, date, text }) {
  const c = ROLE_COLORS[role] ?? ROLE_COLORS.creator;
  return (
    <div className="rounded-xl" style={{ padding: '10px 14px', background: c.bg, border: `1px solid ${c.border}` }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: c.dot, flexShrink: 0 }} />
        <span className="font-poppins" style={{ fontSize: 11, fontWeight: 700, color: c.label, textTransform: 'capitalize' }}>{role}</span>
        <span className="font-poppins" style={{ fontSize: 11, fontWeight: 600, color: '#142952' }}>— {name}</span>
        <span className="font-poppins ml-auto" style={{ fontSize: 10, color: '#9DB3DC', fontWeight: 500 }}>{date}</span>
      </div>
      <p className="font-poppins" style={{ fontSize: 13, color: '#142952', fontWeight: 500, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

export function RemarksPanel({ previousRemarks = [], currentRole, value, onChange }) {
  return (
    <div className="w-full rounded-2xl bg-white border border-[#E2EAF8]" style={{ padding: '20px 24px' }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
        <span className="font-poppins inline-flex items-center justify-center shrink-0"
          style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#E9EFFB 0%,#D4E0F7 100%)', color: '#1B4AA8', fontSize: 12, fontWeight: 700 }}>
          ✎
        </span>
        <div>
          <p className="font-poppins" style={{ fontSize: 15, fontWeight: 700, color: '#142952' }}>Remarks & Notings</p>
          <p className="font-poppins" style={{ fontSize: 11, color: '#7A8FB5', marginTop: 2 }}>
            Previous remarks are read-only. Add your own remarks below.
          </p>
        </div>
      </div>

      {previousRemarks.length > 0 && (
        <div className="flex flex-col" style={{ gap: 8, marginBottom: 16 }}>
          <p className="font-poppins" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#7A8FB5', textTransform: 'uppercase', marginBottom: 4 }}>
            Previous Remarks
          </p>
          {previousRemarks.map((r, i) => (
            <RemarkItem key={i} {...r} />
          ))}
        </div>
      )}

      <div className="flex flex-col" style={{ gap: 6 }}>
        <p className="font-poppins" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#7A8FB5', textTransform: 'uppercase' }}>
          Your Remarks ({currentRole})
        </p>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          placeholder={`Add your remarks as ${currentRole}…`}
          className="font-poppins w-full outline-none resize-y transition-shadow focus:shadow-[0_0_0_3px_rgba(37,90,195,0.18)]"
          style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #5A72A5', background: '#FFFFFF', fontSize: 13, fontWeight: 500, color: '#142952', lineHeight: 1.55 }}
        />
      </div>
    </div>
  );
}
