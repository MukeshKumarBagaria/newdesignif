import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  MAJOR_HEADS,
  MINOR_HEADS,
  SUB_MAJOR_HEADS,
  type ChildHeadState,
  type HierarchyStatus,
  type MajorHeadState,
  badgeFor,
} from './data';
import { HierarchyBadge } from './primitives';

type Props = {
  major: MajorHeadState;
  subMajor: ChildHeadState;
  minor: ChildHeadState;
  /** Click on a row scrolls / opens the relevant accordion. */
  onJump?: (id: 'major' | 'subMajor' | 'minor') => void;
};

type RowDescriptor = {
  id: 'major' | 'subMajor' | 'minor';
  label: string;
  code: string | null;
  name: string | null;
  status: HierarchyStatus;
  enabled: boolean;
};

/**
 * HierarchySummary — sticky right-rail preview that mirrors the user's
 * current selections in real time.
 *
 *   ┌──────────────────────────────────┐
 *   │  Hierarchy Preview               │
 *   │  ──────────                      │
 *   │  ① Major Head    [ MAPPED ]      │
 *   │     2202 — Education             │
 *   │   │                              │
 *   │  ② Sub Major     [ CREATED ]     │
 *   │     05 — Adult Education         │
 *   │   │                              │
 *   │  ③ Minor Head    [ pending ]     │
 *   │     —                            │
 *   └──────────────────────────────────┘
 */
export function HierarchySummary({ major, subMajor, minor, onJump }: Props) {
  const rows = useMemo<RowDescriptor[]>(() => {
    /* Major */
    let majorRow: RowDescriptor;
    if (major.mode === 'use') {
      const m = MAJOR_HEADS.find((mh) => mh.id === major.selectedId) ?? null;
      majorRow = {
        id: 'major',
        label: 'Major Head',
        code: m?.code ?? null,
        name: m?.name ?? null,
        status: badgeFor(major),
        enabled: true,
      };
    } else {
      majorRow = {
        id: 'major',
        label: 'Major Head',
        code: major.form.code || null,
        name: major.form.englishName || null,
        status: badgeFor(major),
        enabled: true,
      };
    }

    /* Sub Major */
    const subEnabled = isComplete(major);
    let subRow: RowDescriptor;
    if (subMajor.mode === 'use') {
      const sm = SUB_MAJOR_HEADS.find((s) => s.id === subMajor.selectedId) ?? null;
      subRow = {
        id: 'subMajor',
        label: 'Sub Major Head',
        code: sm?.code ?? null,
        name: sm?.name ?? null,
        status: badgeFor(subMajor),
        enabled: subEnabled,
      };
    } else {
      subRow = {
        id: 'subMajor',
        label: 'Sub Major Head',
        code: subMajor.form.code || null,
        name: subMajor.form.englishName || null,
        status: badgeFor(subMajor),
        enabled: subEnabled,
      };
    }

    /* Minor */
    const minorEnabled = subEnabled && isChildComplete(subMajor);
    let minorRow: RowDescriptor;
    if (minor.mode === 'use') {
      const mn = MINOR_HEADS.find((m) => m.id === minor.selectedId) ?? null;
      minorRow = {
        id: 'minor',
        label: 'Minor Head',
        code: mn?.code ?? null,
        name: mn?.name ?? null,
        status: badgeFor(minor),
        enabled: minorEnabled,
      };
    } else {
      minorRow = {
        id: 'minor',
        label: 'Minor Head',
        code: minor.form.code || null,
        name: minor.form.englishName || null,
        status: badgeFor(minor),
        enabled: minorEnabled,
      };
    }

    return [majorRow, subRow, minorRow];
  }, [major, subMajor, minor]);

  const completedCount = rows.filter((r) => r.status !== null).length;

  return (
    <aside
      className="shrink-0 self-start"
      style={{
        position: 'sticky',
        top: 'var(--app-sticky-top)',
        width: 320,
      }}
    >
      <motion.div
        layout
        className="flex flex-col"
        style={{
          borderRadius: 24,
          border: '1px solid #BED0F4',
          background: '#FFFFFF',
          overflow: 'hidden',
          boxShadow:
            '0 1px 0 0 rgba(255,255,255,0.9) inset, 0 12px 32px -16px rgba(20, 49, 107, 0.18)',
        }}
      >
        {/* ─────────── Gradient header ─────────── */}
        <div
          className="relative"
          style={{
            padding: '16px 20px 20px',
            background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 60%, #443399 120%)',
            color: '#FFFFFF',
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-poppins"
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', opacity: 0.85 }}
            >
              LIVE PREVIEW
            </span>
            <span
              className="font-poppins inline-flex items-center"
              style={{
                height: 22,
                padding: '0 8px',
                gap: 6,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.30)',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {completedCount}/3
            </span>
          </div>
          <h3
            className="font-poppins"
            style={{ fontSize: 18, fontWeight: 600, marginTop: 6, lineHeight: 1.2 }}
          >
            Hierarchy Preview
          </h3>
          <p
            className="font-poppins"
            style={{ fontSize: 12, fontWeight: 400, opacity: 0.85, marginTop: 4 }}
          >
            Mapped + newly-created heads, in order.
          </p>
          <ProgressTrack count={completedCount} />
        </div>

        {/* ─────────── Rows ─────────── */}
        <div className="relative" style={{ padding: '20px 20px 24px' }}>
          {/* Vertical connector */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 36,
              top: 32,
              bottom: 32,
              width: 2,
              borderLeft: '2px dashed #BED0F4',
            }}
          />
          <div className="flex flex-col" style={{ gap: 12 }}>
            {rows.map((row, i) => (
              <SummaryRow
                key={row.id}
                index={i + 1}
                row={row}
                onJump={onJump ? () => onJump(row.id) : undefined}
              />
            ))}
          </div>

          {/* Composed code preview, e.g. 2202 · 01 · 102 */}
          {completedCount > 0 && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start font-poppins"
              style={{
                marginTop: 18,
                padding: 14,
                gap: 6,
                borderRadius: 14,
                background: '#F2F6FD',
                border: '1px solid #BED0F4',
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#5A72A5',
                  textTransform: 'uppercase',
                }}
              >
                Composed Head
              </span>
              <span
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#1B4AA8',
                  lineHeight: 1.1,
                }}
              >
                {rows.map((r) => r.code || '—').join(' · ')}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────── */

function SummaryRow({
  index,
  row,
  onJump,
}: {
  index: number;
  row: RowDescriptor;
  onJump?: () => void;
}) {
  const filled = row.status !== null;
  const dotBg = !row.enabled
    ? '#F6F7F8'
    : filled
      ? row.status === 'CREATED'
        ? '#358217'
        : '#255AC3'
      : '#FFFFFF';
  const dotBorder = !row.enabled
    ? '#D9D9D9'
    : filled
      ? 'transparent'
      : '#BED0F4';
  const dotText = !row.enabled || !filled ? '#5A72A5' : '#FFFFFF';

  return (
    <motion.button
      type="button"
      layout
      onClick={onJump}
      whileHover={onJump ? { x: 2 } : undefined}
      transition={{ duration: 0.18 }}
      className="relative flex items-start text-left w-full focus:outline-none"
      style={{
        gap: 12,
        padding: 0,
        background: 'transparent',
        cursor: onJump ? 'pointer' : 'default',
        opacity: row.enabled ? 1 : 0.55,
      }}
      aria-disabled={!row.enabled}
    >
      {/* Dot / step number */}
      <span
        className="flex items-center justify-center shrink-0 font-poppins"
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: dotBg,
          border: `1.5px solid ${dotBorder}`,
          color: dotText,
          fontSize: 13,
          fontWeight: 700,
          marginLeft: 8,
          zIndex: 1,
          boxShadow: filled ? '0 4px 10px -4px rgba(37, 90, 195, 0.40)' : undefined,
        }}
      >
        {index}
      </span>

      {/* Card */}
      <span
        className="flex-1 min-w-0 flex flex-col"
        style={{
          padding: '10px 12px',
          gap: 6,
          borderRadius: 14,
          background: filled ? '#FFFFFF' : '#F6F7F8',
          border: filled ? '1px solid #BED0F4' : '1px dashed #BFBFBF',
        }}
      >
        <span className="flex items-center justify-between" style={{ gap: 8 }}>
          <span
            className="font-poppins truncate"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#5A72A5',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {row.label}
          </span>
          <HierarchyBadge status={row.status} />
        </span>
        {filled ? (
          <span className="flex items-baseline" style={{ gap: 8 }}>
            <span
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 14,
                fontWeight: 700,
                color: '#1B4AA8',
              }}
            >
              {row.code || '—'}
            </span>
            <span
              className="font-poppins truncate"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: '#142952',
                lineHeight: 1.3,
              }}
            >
              {row.name || 'Awaiting name'}
            </span>
          </span>
        ) : (
          <span
            className="font-poppins"
            style={{ fontSize: 12, fontWeight: 500, color: '#808080', fontStyle: 'italic' }}
          >
            {row.enabled ? 'Not set yet' : 'Locked — complete the previous step first'}
          </span>
        )}
      </span>
    </motion.button>
  );
}

function ProgressTrack({ count }: { count: number }) {
  return (
    <div
      className="flex items-center"
      style={{ marginTop: 14, gap: 6 }}
      aria-label={`${count} of 3 steps complete`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="flex-1"
          style={{
            height: 6,
            borderRadius: 999,
            background: i < count ? 'rgba(165, 214, 111, 0.95)' : 'rgba(255,255,255,0.25)',
            transition: 'background 0.3s ease',
            boxShadow:
              i < count
                ? '0 0 0 1px rgba(165,214,111,0.6) inset'
                : '0 0 0 1px rgba(255,255,255,0.18) inset',
          }}
        />
      ))}
    </div>
  );
}

/* Local helpers — duplicate of `data.ts` to avoid a circular import. */

function isComplete(s: MajorHeadState): boolean {
  if (s.mode === 'use') return !!s.selectedId;
  return s.form.code.trim().length >= 4 && !!s.form.englishName.trim();
}

function isChildComplete(s: ChildHeadState): boolean {
  if (s.mode === 'use') return !!s.selectedId;
  return s.form.code.trim().length >= 2 && !!s.form.englishName.trim();
}
