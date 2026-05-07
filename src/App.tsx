import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { IconSidebar } from './components/IconSidebar';
import { SectionCard } from './components/SectionCard';
import { CaretRight } from './components/icons';
import {
  badgeFor,
  emptyChildForm,
  emptyMajorForm,
  isChildComplete,
  isMajorComplete,
  type ChildHeadState,
  type MajorHeadState,
} from './components/account-head/data';
import { HierarchyBadge } from './components/account-head/primitives';
import { MajorHeadSection } from './components/account-head/MajorHeadSection';
import { SubMajorHeadSection } from './components/account-head/SubMajorHeadSection';
import { MinorHeadSection } from './components/account-head/MinorHeadSection';
import { ObjectDetailHeadScreen } from './components/account-head/ObjectDetailHeadScreen';

type SectionId = 'major' | 'subMajor' | 'minor';
type CreationTarget = 'major' | 'subMajor' | 'minor';

const sectionDefs: { id: SectionId; index: string; label: string }[] = [
  { id: 'major',    index: '01', label: 'Major Head'     },
  { id: 'subMajor', index: '02', label: 'Sub Major Head' },
  { id: 'minor',    index: '03', label: 'Minor Head'     },
];

export default function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [moduleOpen, setModuleOpen] = useState(false);
  const [activeMenuKey, setActiveMenuKey] = useState('Dashboard');
  const [creationTarget, setCreationTarget] = useState<CreationTarget>('minor');

  /* Section state ─────────────────────────────────────────────── */
  const [major, setMajor] = useState<MajorHeadState>({ mode: 'create', form: emptyMajorForm });
  const [subMajor, setSubMajor] = useState<ChildHeadState>({ mode: 'create', form: emptyChildForm });
  const [minor, setMinor] = useState<ChildHeadState>({ mode: 'create', form: emptyChildForm });

  /* Accordion expansion ───────────────────────────────────────── */
  const [open, setOpen] = useState<Set<SectionId>>(new Set(['major']));

  const toggleSection = (id: SectionId) => {
    setOpen((prev) => {
      // Keep Major Head open until a valid parent context exists.
      if (id === 'major' && prev.has('major') && !majorComplete) {
        return prev;
      }
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const collapseAll = () => {
    // Prevent an empty/blocked first view when nothing has been selected yet.
    if (!majorComplete) {
      setOpen(new Set(['major']));
      return;
    }
    setOpen(new Set());
  };
  const visibleSections = useMemo(() => {
    if (creationTarget === 'major') return sectionDefs.filter((s) => s.id === 'major');
    if (creationTarget === 'subMajor') return sectionDefs.filter((s) => s.id !== 'minor');
    return sectionDefs;
  }, [creationTarget]);

  /* Dependency rules ──────────────────────────────────────────── */
  const majorComplete    = isMajorComplete(major);
  const subMajorComplete = isChildComplete(subMajor);
  const subMajorLocked   = !majorComplete;
  const minorLocked      = !majorComplete || !subMajorComplete;

  /* When Major becomes complete, auto-open Sub Major (only the
     first time, if it hasn't been opened yet). Same for Minor. */
  const autoOpen = (id: SectionId) =>
    setOpen((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  /* Reset / draft / submit ────────────────────────────────────── */
  const resetAll = () => {
    setMajor({ mode: 'create', form: emptyMajorForm });
    setSubMajor({ mode: 'create', form: emptyChildForm });
    setMinor({ mode: 'create', form: emptyChildForm });
    setOpen(new Set(['major']));
  };

  const canSubmit = majorComplete; // at minimum a Major Head must exist

  return (
    <div className="min-h-screen page-bg font-poppins">
      <Header />

      <div className="mx-auto w-full max-w-[1920px] flex gap-5 px-6 pb-14 pt-10 xl:gap-6 xl:px-8 2xl:px-10">
        <IconSidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
          moduleMenuOpen={moduleOpen}
          onOpenModuleMenu={setModuleOpen}
          activeMenuKey={activeMenuKey}
          onMenuChange={setActiveMenuKey}
        />

        {/* Main content */}
        {activeMenuKey === 'Object + Detail Head' ? (
          <ObjectDetailHeadScreen />
        ) : (
        <main className="flex-1 min-w-0 flex flex-col gap-4">
          {/*
           * Outer white card — Figma node 5938:50559
           *   display:flex · flex-direction:column · align-items:flex-start
           *   padding:16 · gap:40 · border-radius:24 · background:#FFF
           */}
          <motion.div
            layout
            className="flex flex-col w-full"
            style={{
              padding: 16,
              gap: 32,
              alignItems: 'flex-start',
              borderRadius: 24,
              background: '#FFF',
            }}
          >
            {/* ─── Title row + breadcrumb + collapse pills ─── */}
            <div className="flex items-center justify-between gap-6 w-full flex-wrap">
              <div className="flex flex-col items-start" style={{ gap: 8 }}>
                <h1
                  className="font-poppins"
                  style={{
                    color: '#1565C0',
                    fontSize: 26,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Unified Account Head Creation
                </h1>
                <p
                  className="font-poppins"
                  style={{
                    color: '#5A72A5',
                    fontSize: 14,
                    fontWeight: 500,
                    maxWidth: 720,
                    lineHeight: 1.4,
                  }}
                >
                  Create Major, Sub Major, and Minor Heads in one workflow. Use the options below
                  to choose how deep you want to go in this run.
                </p>
                <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 6 }}>
                  {[
                    { id: 'major', label: 'Create Major Only' },
                    { id: 'subMajor', label: 'Create Major + Sub Major' },
                    { id: 'minor', label: 'Create Major + Sub Major + Minor' },
                  ].map((item) => {
                    const selected = creationTarget === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="checkbox"
                        aria-checked={selected}
                        onClick={() => {
                          setCreationTarget(item.id as CreationTarget);
                          setOpen(new Set(['major']));
                        }}
                        className="inline-flex items-center gap-2 rounded-full font-poppins transition-all hover:brightness-95"
                        style={{
                          height: 34,
                          padding: '0 12px',
                          border: `1px solid ${selected ? '#255AC3' : '#BED0F4'}`,
                          background: selected ? '#E5F4FF' : '#F6F7F8',
                          color: selected ? '#1B4AA8' : '#5A72A5',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <span
                          aria-hidden
                          className="inline-flex items-center justify-center rounded-full"
                          style={{
                            width: 16,
                            height: 16,
                            border: `1.5px solid ${selected ? '#255AC3' : '#9DB3DC'}`,
                            background: selected ? '#255AC3' : '#FFFFFF',
                            color: '#FFFFFF',
                            fontSize: 10,
                            lineHeight: 1,
                          }}
                        >
                          {selected ? '✓' : ''}
                        </span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
                  <span
                    className="flex items-center justify-center rounded-2xl font-poppins font-medium"
                    style={{
                      background: '#F6F7F8',
                      padding: '4px 8px',
                      fontSize: 14,
                      color: '#808080',
                    }}
                  >
                    Budget Module
                  </span>
                  <CaretRight size={20} className="text-grey-400" />
                  <span
                    className="flex items-center justify-center rounded-2xl font-poppins"
                    style={{
                      background: '#F6F7F8',
                      padding: '4px 8px',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#1565C0',
                    }}
                  >
                    Account Head Management
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={collapseAll}
                  aria-label="Collapse All"
                  className="flex items-center justify-center font-poppins whitespace-nowrap transition hover:brightness-95"
                  style={{
                    width: 120,
                    padding: '4px 8px',
                    gap: 4,
                    border: '1px solid #815E18',
                    background: '#FBF5E9',
                    color: '#815E18',
                    fontSize: 14,
                    fontWeight: 500,
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                  }}
                >
                  <img src="/assets/caret-double-up.svg" alt="" width={16} height={16} draggable={false} />
                  Collapse All
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(new Set(visibleSections.map((s) => s.id)))}
                  aria-label="Expand All"
                  className="flex items-center justify-center font-poppins whitespace-nowrap transition hover:brightness-95"
                  style={{
                    width: 120,
                    padding: '4px 8px',
                    gap: 4,
                    borderTop: '1px solid #815E18',
                    borderRight: '1px solid #815E18',
                    borderBottom: '1px solid #815E18',
                    background: '#FBF5E9',
                    color: '#815E18',
                    fontSize: 14,
                    fontWeight: 500,
                    borderTopRightRadius: 16,
                    borderBottomRightRadius: 16,
                  }}
                >
                  <img src="/assets/caret-double-down.svg" alt="" width={16} height={16} draggable={false} />
                  Expand All
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col" style={{ gap: 24 }}>
              {visibleSections.map((s, i) => {
                const isOpen = open.has(s.id);
                const sectionState =
                  s.id === 'major' ? major : s.id === 'subMajor' ? subMajor : minor;
                const status = badgeFor(sectionState);

                const locked =
                  s.id === 'subMajor' ? subMajorLocked :
                  s.id === 'minor'    ? minorLocked :
                  false;

                const lockedHint =
                  s.id === 'subMajor'
                    ? 'Select or create a Major Head first.'
                    : s.id === 'minor'
                      ? majorComplete
                        ? 'Select or create a Sub Major Head first.'
                        : 'Select or create the Major + Sub Major Heads first.'
                      : undefined;

                const subtitle = locked ? null : sectionSubtitle(s.id, sectionState);

                return (
                  <motion.div
                    key={s.id}
                    id={`section-${s.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    className="w-full"
                  >
                    <SectionCard
                      index={s.index}
                      title={s.label}
                      subtitle={subtitle}
                      expanded={isOpen}
                      locked={locked}
                      lockedHint={lockedHint}
                      badge={<HierarchyBadge status={status} />}
                      onToggle={() => toggleSection(s.id)}
                    >
                      {s.id === 'major' && (
                        <MajorHeadSection
                          state={major}
                          onChange={(next) => {
                            setMajor(next);
                            if (isMajorComplete(next)) autoOpen('subMajor');
                          }}
                        />
                      )}
                      {s.id === 'subMajor' && (
                        <SubMajorHeadSection
                          major={major}
                          state={subMajor}
                          onChange={(next) => {
                            setSubMajor(next);
                            if (isChildComplete(next)) autoOpen('minor');
                          }}
                        />
                      )}
                      {s.id === 'minor' && (
                        <MinorHeadSection
                          major={major}
                          subMajor={subMajor}
                          state={minor}
                          onChange={setMinor}
                        />
                      )}
                    </SectionCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ─────────── Sticky glass footer ─────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="glass-cta sticky bottom-5 z-30 box-border flex items-center justify-between self-stretch flex-wrap"
            style={{ padding: '20px 32px', gap: 24 }}
          >
            <div className="flex items-center gap-3">
              <span
                className="font-poppins"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: '#5A72A5',
                  textTransform: 'uppercase',
                }}
              >
                Workflow Status
              </span>
              <span
                className="font-poppins"
                style={{ fontSize: 14, fontWeight: 600, color: '#142952' }}
              >
                {workflowStatusText(major, subMajor, minor)}
              </span>
            </div>

            <div className="flex items-center" style={{ gap: 16 }}>
              {/* Reset */}
              <motion.button
                type="button"
                onClick={resetAll}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="glass-btn-reset group box-border inline-flex items-center justify-center shrink-0 relative overflow-hidden"
                style={{ height: 48, padding: '10px 22px', gap: 8, borderRadius: 16 }}
              >
                <span className="glass-btn-sheen" aria-hidden />
                <ResetGlyph />
                <span
                  className="relative z-[1] font-poppins font-semibold whitespace-nowrap"
                  style={{ fontSize: 15, color: '#255AC3', letterSpacing: '0.01em' }}
                >
                  Reset
                </span>
              </motion.button>

              {/* Save Draft */}
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="glass-btn-save group box-border inline-flex items-center justify-center shrink-0 relative overflow-hidden"
                style={{ height: 48, padding: '10px 22px', gap: 10, borderRadius: 16 }}
              >
                <span className="glass-btn-sheen" aria-hidden />
                <SaveGlyph />
                <span
                  className="relative z-[1] font-poppins font-semibold whitespace-nowrap"
                  style={{ fontSize: 15, color: '#0E4913', letterSpacing: '0.01em' }}
                >
                  Save Draft
                </span>
              </motion.button>

              {/* Submit Hierarchy */}
              <motion.button
                type="button"
                disabled={!canSubmit}
                whileHover={canSubmit ? { y: -2 } : undefined}
                whileTap={canSubmit ? { scale: 0.97 } : undefined}
                className="glass-btn-forward group box-border inline-flex items-center justify-center shrink-0 relative overflow-hidden"
                style={{
                  height: 48,
                  padding: '10px 24px',
                  gap: 8,
                  borderRadius: 16,
                  opacity: canSubmit ? 1 : 0.55,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                }}
              >
                <span className="glass-btn-sheen" aria-hidden />
                <span
                  className="relative z-[1] font-poppins font-semibold whitespace-nowrap"
                  style={{ fontSize: 15, color: '#FFFFFF', letterSpacing: '0.01em' }}
                >
                  Submit Hierarchy
                </span>
                <SubmitGlyph />
              </motion.button>
            </div>
          </motion.div>
        </main>
        )}
      </div>

      {/* Click-catcher to dismiss the module overlay */}
      <AnimatePresence>
        {moduleOpen && (
          <motion.div
            key="mod-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-transparent"
            onClick={() => setModuleOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Helpers — section subtitle + footer status copy
 *  ────────────────────────────────────────────────────────────────── */

function sectionSubtitle(id: SectionId, state: MajorHeadState | ChildHeadState): string | null {
  if (state.mode === 'use') {
    if (!state.selectedId) return 'Use Existing — no selection yet';
    return 'Use Existing — record will be mapped';
  }
  const head =
    id === 'major'
      ? '4-digit Major Head'
      : id === 'subMajor'
        ? '2-digit Sub Major Head'
        : '3-digit Minor Head';
  return `Create New — drafting ${head}`;
}

function workflowStatusText(
  major: MajorHeadState,
  subMajor: ChildHeadState,
  minor: ChildHeadState
): string {
  const parts: string[] = [];
  const m = badgeFor(major);
  const s = badgeFor(subMajor);
  const n = badgeFor(minor);
  if (m) parts.push(`Major ${m.toLowerCase()}`);
  if (s) parts.push(`Sub Major ${s.toLowerCase()}`);
  if (n) parts.push(`Minor ${n.toLowerCase()}`);
  if (parts.length === 0) return 'Begin by selecting or creating a Major Head.';
  return parts.join(' · ');
}

/* ──────────────────────────────────────────────────────────────────
 *  Inline glyphs
 *  ────────────────────────────────────────────────────────────────── */

function ResetGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="relative z-[1] transition-transform duration-300 group-hover:-rotate-[30deg]"
      aria-hidden
    >
      <path
        d="M4 12a8 8 0 0114.5-4.6M20 12a8 8 0 01-14.5 4.6M4 4v4h4M20 20v-4h-4"
        stroke="#255AC3"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SaveGlyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="relative z-[1] transition-transform duration-300 group-hover:scale-110"
      aria-hidden
    >
      <path
        d="M5 4h11l3 3v13a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
        stroke="#0E4913"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M7 4v5h9V4M8 14h8M8 17h6"
        stroke="#0E4913"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SubmitGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="relative z-[1] transition-transform duration-300 group-hover:translate-x-1"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
