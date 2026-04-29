import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { IconSidebar } from './components/IconSidebar';
import { StepperPanel, type StepperItem } from './components/StepperPanel';
import { SectionCard } from './components/SectionCard';
import { CaretRight } from './components/icons';
import { EmployeeDetailsContent } from './components/sections/EmployeeDetails';
import { EmployeeTransferDetailsContent } from './components/sections/EmployeeTransferDetails';
import { ReimbursementDetailsContent } from './components/sections/ReimbursementDetails';
import { TransferTravelJourneyContent } from './components/sections/TransferTravelJourney';
import { DocumentsAttachmentsContent } from './components/sections/DocumentsAttachments';
import { AdvancedDetailsContent } from './components/sections/AdvancedDetails';

type SectionId = 's1' | 's2' | 's3' | 's4' | 's5' | 's6';

const sectionDefs: { id: SectionId; index: string; label: string }[] = [
  { id: 's1', index: '01', label: 'Employee Details' },
  { id: 's2', index: '02', label: 'Employee Transfer Details' },
  { id: 's3', index: '03', label: 'Reimbursement Details' },
  { id: 's4', index: '04', label: 'Transfer Travel Journey Details' },
  { id: 's5', index: '05', label: 'Documents & Attachments' },
  { id: 's6', index: '06', label: 'Advanced Details' },
];

export default function App() {
  const [open, setOpen] = useState<Set<SectionId>>(
    new Set(sectionDefs.map((s) => s.id))
  );
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [moduleOpen, setModuleOpen] = useState(false);
  const [stepperLayout, setStepperLayout] = useState<'side' | 'top'>('side');

  const toggleSection = (id: SectionId) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const collapseAll = () => setOpen(new Set());
  const expandAll = () => setOpen(new Set(sectionDefs.map((s) => s.id)));

  // Build stepper state: highlight the first open section as "active",
  // previous ones as "completed".
  const steps: StepperItem[] = useMemo(() => {
    const firstOpenIdx = sectionDefs.findIndex((s) => open.has(s.id));
    return sectionDefs.map((s, i) => {
      let state: StepperItem['state'] = 'idle';
      if (firstOpenIdx === -1) {
        state = 'idle';
      } else if (i < firstOpenIdx) {
        state = 'completed';
      } else if (i === firstOpenIdx) {
        state = 'active';
      }
      return { id: s.id, index: s.index, label: s.label, state };
    });
  }, [open]);

  return (
    <div className="min-h-screen page-bg font-poppins">
      <Header
        stepperLayout={stepperLayout}
        onChangeStepperLayout={setStepperLayout}
      />

      <div className="mx-auto w-full max-w-[1920px] flex gap-5 px-6 pb-14 pt-10 xl:gap-6 xl:px-8 2xl:px-10">
        <IconSidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
          moduleMenuOpen={moduleOpen}
          onOpenModuleMenu={setModuleOpen}
        />

        {stepperLayout === 'side' && (
          <StepperPanel
            steps={steps}
            onSelect={(id) => toggleSection(id as SectionId)}
            expanded={sidebarExpanded}
            orientation="vertical"
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col gap-4">
          {stepperLayout === 'top' && (
            <StepperPanel
              steps={steps}
              onSelect={(id) => toggleSection(id as SectionId)}
              expanded={sidebarExpanded}
              orientation="horizontal"
            />
          )}
          {/*
           * Outer white card — Figma node 5938:50559
           *   display:flex · flex-direction:column · align-items:flex-start
           *   padding:16 · gap:40 · border-radius:24 · background:#FFF
           */}
          <motion.div
            layout
            className="flex flex-col w-full"
            style={{
              padding: '16px',
              gap: '40px',
              alignItems: 'flex-start',
              borderRadius: '24px',
              background: '#FFF',
            }}
          >
            {/* Title row — Figma node 5938:50560 */}
            <div className="flex items-center justify-between gap-6 w-full">
              <div className="flex flex-col items-start gap-1">
                <h1
                  className="font-poppins"
                  style={{
                    color: '#255AC3',
                    fontSize: '24px',
                    fontWeight: 600,
                    lineHeight: 'normal',
                    fontStyle: 'normal',
                  }}
                >
                  Travel Order
                </h1>
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center justify-center rounded-2xl font-poppins font-medium"
                    style={{
                      background: '#F6F7F8',
                      padding: '4px 8px',
                      fontSize: '16px',
                      color: '#808080',
                    }}
                  >
                    HRMS
                  </span>
                  <CaretRight size={20} className="text-grey-400" />
                  <span
                    className="flex items-center justify-center rounded-2xl font-poppins"
                    style={{
                      background: '#F6F7F8',
                      padding: '4px 8px',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#255AC3',
                    }}
                  >
                    Reimbursement
                  </span>
                </div>
              </div>

              {/* Segmented Collapse / Expand pills — Figma nodes 5938:50571 + 5938:50576 */}
              <div className="flex items-center">
                <button
                  onClick={collapseAll}
                  aria-label="Collapse All"
                  className="flex items-center justify-center font-poppins whitespace-nowrap transition hover:brightness-95"
                  style={{
                    width: '120px',
                    padding: '4px 8px',
                    gap: '4px',
                    border: '1px solid #815E18',
                    background: '#FBF5E9',
                    color: '#815E18',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: 'normal',
                    borderTopLeftRadius: '16px',
                    borderBottomLeftRadius: '16px',
                  }}
                >
                  <img
                    src="/assets/caret-double-up.svg"
                    alt=""
                    width={16}
                    height={16}
                    draggable={false}
                    className="shrink-0"
                  />
                  Collapse All
                </button>
                <button
                  onClick={expandAll}
                  aria-label="Expand All"
                  className="flex items-center justify-center font-poppins whitespace-nowrap transition hover:brightness-95"
                  style={{
                    width: '120px',
                    padding: '4px 8px',
                    gap: '4px',
                    borderTop: '1px solid #815E18',
                    borderRight: '1px solid #815E18',
                    borderBottom: '1px solid #815E18',
                    background: '#FBF5E9',
                    color: '#815E18',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: 'normal',
                    borderTopRightRadius: '16px',
                    borderBottomRightRadius: '16px',
                  }}
                >
                  <img
                    src="/assets/caret-double-down.svg"
                    alt=""
                    width={16}
                    height={16}
                    draggable={false}
                    className="shrink-0"
                  />
                  Expand All
                </button>
              </div>
            </div>

            {/* Sections list — Figma node 6270:43992
             *   display:flex · flex-direction:column · align-items:flex-start
             *   gap:24px · align-self:stretch
             */}
            <div
              className="flex flex-col w-full"
              style={{ alignItems: 'flex-start', gap: '24px' }}
            >
              {sectionDefs.map((s, i) => {
                const isOpen = open.has(s.id);
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className="w-full"
                  >
                    <SectionCard
                      index={s.index}
                      title={s.label}
                      expanded={isOpen}
                      onToggle={() => toggleSection(s.id)}
                    >
                      {renderSection(s.id, () => {
                        const idx = sectionDefs.findIndex((x) => x.id === s.id);
                        const next = sectionDefs[idx + 1];
                        if (next) {
                          setOpen((prev) => {
                            const n = new Set(prev);
                            n.delete(s.id);
                            n.add(next.id);
                            return n;
                          });
                        }
                      })}
                    </SectionCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ───────────── Sticky Form action CTAs — Figma node 5830:83284
              Glass-morphism treatment: translucent white with backdrop blur,
              gradient hairline border, layered ambient + elevation shadows,
              inner highlight at the top edge for depth. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="glass-cta sticky bottom-5 z-30 box-border flex items-center justify-end self-stretch"
            style={{
              padding: '24px 40px',
              gap: 24,
            }}
          >
            {/* Reset — glass outline */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="glass-btn-reset group box-border inline-flex items-center justify-center shrink-0 relative overflow-hidden"
              style={{
                width: 150,
                height: 48,
                padding: '10px 24px',
                gap: 8,
                borderRadius: 16,
              }}
            >
              <span className="glass-btn-sheen" aria-hidden />
              <img
                src="/assets/icon-clockclockwise.svg"
                alt=""
                className="relative z-[1] transition-transform duration-300 group-hover:-rotate-[30deg]"
                style={{ width: 20, height: 20 }}
              />
              <span
                className="relative z-[1] font-poppins font-semibold whitespace-nowrap"
                style={{ fontSize: 16, color: '#255AC3', lineHeight: 'normal', letterSpacing: '0.01em' }}
              >
                Reset
              </span>
            </motion.button>

            {/* Save — mint gradient + soft glow */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="glass-btn-save group box-border inline-flex items-center justify-center shrink-0 relative overflow-hidden"
              style={{
                width: 150,
                height: 48,
                padding: '10px 24px',
                gap: 8,
                borderRadius: 16,
              }}
            >
              <span className="glass-btn-sheen" aria-hidden />
              <img
                src="/assets/icon-floppydisk.svg"
                alt=""
                className="relative z-[1] transition-transform duration-300 group-hover:scale-110"
                style={{ width: 32, height: 32 }}
              />
              <span
                className="relative z-[1] font-poppins font-semibold whitespace-nowrap"
                style={{ fontSize: 16, color: '#0E4913', lineHeight: 'normal', letterSpacing: '0.01em' }}
              >
                Save
              </span>
            </motion.button>

            {/* Forward — primary gradient with halo */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="glass-btn-forward group box-border inline-flex items-center justify-end shrink-0 relative overflow-hidden"
              style={{
                width: 150,
                height: 48,
                padding: '10px 24px',
                gap: 8,
                borderRadius: 16,
              }}
            >
              <span className="glass-btn-sheen" aria-hidden />
              <span
                className="relative z-[1] font-poppins font-semibold whitespace-nowrap"
                style={{ fontSize: 16, color: '#FFFFFF', lineHeight: 'normal', letterSpacing: '0.01em' }}
              >
                Forward
              </span>
              <img
                src="/assets/icon-caret-forward.svg"
                alt=""
                className="relative z-[1] transition-transform duration-300 group-hover:translate-x-1"
                style={{ width: 20, height: 20 }}
              />
            </motion.button>
          </motion.div>
        </main>
      </div>

      {/* Click-catcher to dismiss the module overlay. Kept BELOW the
          sidebar (z-20 < sidebar's z-30) so it never intercepts clicks
          on the popup tiles — those clicks reach the ModuleGrid first. */}
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

function renderSection(id: SectionId, onNext: () => void) {
  switch (id) {
    case 's1': return <EmployeeDetailsContent onNext={onNext} />;
    case 's2': return <EmployeeTransferDetailsContent onNext={onNext} />;
    case 's3': return <ReimbursementDetailsContent onNext={onNext} />;
    case 's4': return <TransferTravelJourneyContent onNext={onNext} />;
    case 's5': return <DocumentsAttachmentsContent onNext={onNext} />;
    case 's6': return <AdvancedDetailsContent />;
  }
}
