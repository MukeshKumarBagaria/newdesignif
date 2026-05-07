import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  MAJOR_HEADS,
  MINOR_HEADS,
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
import { ParentBanner, parentSummaryText } from './SubMajorHeadSection';

type Props = {
  major: MajorHeadState;
  subMajor: ChildHeadState;
  state: ChildHeadState;
  onChange: (next: ChildHeadState) => void;
};

const swap = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export function MinorHeadSection({ major, subMajor, state, onChange }: Props) {
  const parentMajorId =
    major.mode === 'use' ? major.selectedId : null;
  const parentSubMajorId =
    subMajor.mode === 'use' ? subMajor.selectedId : null;

  const items: DropdownItem[] = useMemo(() => {
    let pool = MINOR_HEADS;
    if (parentMajorId) pool = pool.filter((mn) => mn.parentMajorId === parentMajorId);
    if (parentSubMajorId)
      pool = pool.filter((mn) => mn.parentSubMajorId === parentSubMajorId);
    return pool.map((mn) => {
      const m = MAJOR_HEADS.find((mh) => mh.id === mn.parentMajorId);
      const sm = SUB_MAJOR_HEADS.find((s) => s.id === mn.parentSubMajorId);
      return {
        id: mn.id,
        code: mn.code,
        label: mn.name,
        caption: m && sm ? `Under ${m.code} · ${sm.code}` : undefined,
      };
    });
  }, [parentMajorId, parentSubMajorId]);

  const codeError =
    state.mode === 'create' && state.form.code && !/^\d{3}$/.test(state.form.code)
      ? 'Code must be exactly 3 digits.'
      : null;

  const dupError =
    state.mode === 'create' &&
    /^\d{3}$/.test(state.form.code) &&
    parentMajorId &&
    parentSubMajorId &&
    MINOR_HEADS.some(
      (mn) =>
        mn.parentMajorId === parentMajorId &&
        mn.parentSubMajorId === parentSubMajorId &&
        mn.code === state.form.code
    )
      ? 'A Minor Head with this code already exists under the selected Sub Major.'
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

  const subParentSummary = subMajorSummaryText(subMajor);

  return (
    <div className="flex flex-col w-full" style={{ gap: 24 }}>
      <div className="flex flex-col w-full" style={{ gap: 8 }}>
        <ParentBanner label="Parent Major Head" value={parentSummaryText(major)} />
        <ParentBanner label="Parent Sub Major Head" value={subParentSummary} />
      </div>

      <ModeRow
        mode={state.mode}
        onChange={setMode}
        layoutId="minor-mode-pill"
        labels={['Create New Minor Head', 'Use Existing Minor Head']}
      />

      <AnimatePresence mode="wait" initial={false}>
        {state.mode === 'use' ? (
          <motion.div key="use" {...swap}>
            <UseExistingPanel
              title="Map an existing Minor Head"
              description={
                parentSubMajorId
                  ? 'Filtered by the selected Major + Sub Major above.'
                  : 'You can browse all Minor Heads — choose a Sub Major Head above to filter.'
              }
              dropdown={
                <SearchableDropdown
                  ariaLabel="Select Minor Head"
                  items={items}
                  selectedId={state.selectedId}
                  onSelect={(id) => onChange({ mode: 'use', selectedId: id })}
                  placeholder="Select Minor Head"
                />
              }
            />
          </motion.div>
        ) : (
          <motion.div key="create" {...swap}>
            <FormGrid>
              <LabeledField
                label="Minor Head Code"
                required
                hint="3-digit numeric code (e.g. 102)."
                error={codeError ?? dupError}
              >
                <TextField
                  value={state.form.code}
                  onChange={(v) => updateForm('code', v.replace(/\D/g, '').slice(0, 3))}
                  placeholder="000"
                  maxLength={3}
                  inputMode="numeric"
                  prefix="#"
                  tone={codeError || dupError ? 'error' : 'default'}
                />
              </LabeledField>

              <LabeledField label="English Nomenclature" required>
                <TextField
                  value={state.form.englishName}
                  onChange={(v) => updateForm('englishName', v)}
                  placeholder="e.g. Government Schools"
                />
              </LabeledField>

              <LabeledField label="Hindi Nomenclature">
                <TextField
                  value={state.form.hindiName}
                  onChange={(v) => updateForm('hindiName', v)}
                  placeholder="e.g. राजकीय विद्यालय"
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

function subMajorSummaryText(subMajor: ChildHeadState): string {
  if (subMajor.mode === 'use') {
    const sm = SUB_MAJOR_HEADS.find((s) => s.id === subMajor.selectedId);
    return sm ? `${sm.code} — ${sm.name}` : 'No Sub Major Head selected yet';
  }
  const code = subMajor.form.code || '__';
  const name = subMajor.form.englishName || '(new draft)';
  return `${code} — ${name}`;
}
