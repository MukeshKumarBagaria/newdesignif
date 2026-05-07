import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  MAJOR_HEADS,
  SUB_MAJOR_HEADS,
  type ChildHeadState,
  type MajorHeadState,
} from './data';
import {
  LabeledField,
  SearchableDropdown,
  TextArea,
  TextField,
  type DropdownItem,
} from './primitives';
import { FormGrid, ModeRow, UseExistingPanel } from './MajorHeadSection';

type Props = {
  major: MajorHeadState;
  state: ChildHeadState;
  onChange: (next: ChildHeadState) => void;
};

const swap = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export function SubMajorHeadSection({ major, state, onChange }: Props) {
  /* Resolve the parent Major Head — drives both the filtered dropdown
     and the duplicate-check namespace below. */
  const parentMajor = useMemo(() => {
    if (major.mode === 'use') {
      return MAJOR_HEADS.find((m) => m.id === major.selectedId) ?? null;
    }
    return null;
  }, [major]);
  const parentMajorId = parentMajor?.id ?? null;

  const items: DropdownItem[] = useMemo(() => {
    const filtered = parentMajorId
      ? SUB_MAJOR_HEADS.filter((s) => s.parentMajorId === parentMajorId)
      : SUB_MAJOR_HEADS;
    return filtered.map((s) => {
      const parent = MAJOR_HEADS.find((m) => m.id === s.parentMajorId);
      return {
        id: s.id,
        code: s.code,
        label: s.name,
        caption: parent ? `Under ${parent.code} — ${parent.name}` : undefined,
      };
    });
  }, [parentMajorId]);

  /* Live validation. */
  const codeError =
    state.mode === 'create' && state.form.code && !/^\d{2}$/.test(state.form.code)
      ? 'Code must be exactly 2 digits.'
      : null;

  const dupError =
    state.mode === 'create' &&
    /^\d{2}$/.test(state.form.code) &&
    parentMajorId &&
    SUB_MAJOR_HEADS.some(
      (s) => s.parentMajorId === parentMajorId && s.code === state.form.code
    )
      ? 'A Sub Major Head with this code already exists under the selected Major Head.'
      : null;

  const setMode = (mode: 'create' | 'use') => {
    if (mode === 'use') onChange({ mode: 'use', selectedId: null });
    else
      onChange({
        mode: 'create',
        form:
          state.mode === 'create'
            ? state.form
            : {
                code: '',
                englishName: '',
                hindiName: '',
                remarks: '',
              },
      });
  };

  const updateForm = <K extends keyof (ChildHeadState & { mode: 'create' })['form']>(
    key: K,
    value: (ChildHeadState & { mode: 'create' })['form'][K]
  ) => {
    if (state.mode !== 'create') return;
    onChange({ mode: 'create', form: { ...state.form, [key]: value } });
  };

  const parentSummary = parentSummaryText(major);

  return (
    <div className="flex flex-col w-full" style={{ gap: 24 }}>
      <ParentBanner label="Parent Major Head" value={parentSummary} />

      <ModeRow
        mode={state.mode}
        onChange={setMode}
        layoutId="sub-major-mode-pill"
        labels={['Create New Sub Major Head', 'Use Existing Sub Major Head']}
      />

      <AnimatePresence mode="wait" initial={false}>
        {state.mode === 'use' ? (
          <motion.div key="use" {...swap}>
            <UseExistingPanel
              title="Map an existing Sub Major Head"
              description={
                parentMajorId
                  ? `Showing only Sub Major Heads under ${parentMajor?.code} — ${parentMajor?.name}.`
                  : 'You can browse all Sub Major Heads — pick a Major Head above to filter.'
              }
              dropdown={
                <SearchableDropdown
                  ariaLabel="Select Sub Major Head"
                  items={items}
                  selectedId={state.selectedId}
                  onSelect={(id) => onChange({ mode: 'use', selectedId: id })}
                  placeholder="Select Sub Major Head"
                />
              }
            />
          </motion.div>
        ) : (
          <motion.div key="create" {...swap}>
            <FormGrid>
              <LabeledField
                label="Sub Major Head Code"
                required
                hint="2-digit numeric code (e.g. 01)."
                error={codeError ?? dupError}
              >
                <TextField
                  value={state.form.code}
                  onChange={(v) => updateForm('code', v.replace(/\D/g, '').slice(0, 2))}
                  placeholder="00"
                  maxLength={2}
                  inputMode="numeric"
                  prefix="#"
                  tone={codeError || dupError ? 'error' : 'default'}
                />
              </LabeledField>

              <LabeledField label="English Nomenclature" required>
                <TextField
                  value={state.form.englishName}
                  onChange={(v) => updateForm('englishName', v)}
                  placeholder="e.g. Elementary Education"
                />
              </LabeledField>

              <LabeledField label="Hindi Nomenclature">
                <TextField
                  value={state.form.hindiName}
                  onChange={(v) => updateForm('hindiName', v)}
                  placeholder="e.g. प्रारंभिक शिक्षा"
                />
              </LabeledField>

              <LabeledField label="Remarks" className="col-span-full">
                <TextArea
                  value={state.form.remarks}
                  onChange={(v) => updateForm('remarks', v)}
                  placeholder="Optional notes for audit / approval reviewers"
                  rows={3}
                  maxLength={500}
                />
              </LabeledField>
            </FormGrid>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  ParentBanner — small contextual strip showing the parent that
 *  this section will be created/mapped under.
 *  ────────────────────────────────────────────────────────────────── */

export function ParentBanner({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center w-full font-poppins"
      style={{
        padding: '10px 14px',
        gap: 12,
        background: '#F2F6FD',
        border: '1px solid #BED0F4',
        borderRadius: 14,
      }}
    >
      <span
        className="inline-flex items-center justify-center shrink-0"
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: '#FFFFFF',
          border: '1px solid #BED0F4',
          color: '#1B4AA8',
        }}
        aria-hidden
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 5h7l2 2h9v11a2 2 0 01-2 2H3V5z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#5A72A5', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span
        className="flex-1 min-w-0 truncate"
        style={{ fontSize: 14, fontWeight: 600, color: '#142952' }}
      >
        {value}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Compose a one-line description of whichever parent has been
 *  selected so far. Reused by Sub Major + Minor sections.
 *  ────────────────────────────────────────────────────────────────── */

export function parentSummaryText(major: MajorHeadState): string {
  if (major.mode === 'use') {
    const m = MAJOR_HEADS.find((mh) => mh.id === major.selectedId);
    return m ? `${m.code} — ${m.name}` : 'No Major Head selected yet';
  }
  const code = major.form.code || '____';
  const name = major.form.englishName || '(new draft)';
  return `${code} — ${name}`;
}
