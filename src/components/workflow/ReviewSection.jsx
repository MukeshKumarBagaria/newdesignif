/** Consistent section card wrapper for verifier / approver review screens. */
export function ReviewSection({ index, title, description, children }) {
  return (
    <div className="w-full rounded-2xl bg-white border border-[#E2EAF8]" style={{ padding: '20px 24px' }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
        <span className="font-poppins inline-flex items-center justify-center shrink-0"
          style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#E9EFFB 0%,#D4E0F7 100%)', color: '#1B4AA8', fontSize: 12, fontWeight: 700 }}>
          {index}
        </span>
        <div>
          <p className="font-poppins" style={{ fontSize: 15, fontWeight: 700, color: '#142952', lineHeight: 1.2 }}>{title}</p>
          {description && (
            <p className="font-poppins" style={{ fontSize: 11, fontWeight: 500, color: '#7A8FB5', marginTop: 2 }}>{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

/** 4-column grid used inside ReviewSection */
export function Grid4({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-4 gap-x-4 gap-y-4 ${className}`}>{children}</div>
  );
}

/** Divider with optional label spanning 4 cols */
export function Divider({ label }) {
  return (
    <div className="col-span-4 flex items-center gap-3" style={{ marginTop: 2, marginBottom: -2 }}>
      {label && (
        <span className="font-poppins shrink-0"
          style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: '#7A8FB5', textTransform: 'uppercase' }}>
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-[#E9EFFB]" />
    </div>
  );
}
