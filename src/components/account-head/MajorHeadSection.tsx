import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  MAJOR_HEADS,
  SECTORS,
  SUB_SECTORS,
  type MajorHeadState,
} from './data';
import {
  LabeledField,
  ModeToggle,
  SearchableDropdown,
  SelectField,
  StatusSwitch,
  TextArea,
  TextField,
  type DropdownItem,
} from './primitives';

type Props = {
  state: MajorHeadState;
  onChange: (next: MajorHeadState) => void;
};

/* Cross-fade transition shared by every "swap-form / swap-dropdown" body. */
const swap = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export function MajorHeadSection({ state, onChange }: Props) {
  /* Derived ─────────────────────────── */
  const items: DropdownItem[] = useMemo(
    () =>
      MAJOR_HEADS.map((m) => ({
        id: m.id,
        code: m.code,
        label: m.name,
        caption: [m.sector, m.subSector].filter(Boolean).join(' · '),
      })),
    []
  );

  const subSectorOptions =
    state.mode === 'create' && state.form.sector
      ? SUB_SECTORS[state.form.sector] ?? []
      : [];

  /* Validation (live) ──────────────── */
  const codeError =
    state.mode === 'create' && state.form.code && !/^\d{4}$/.test(state.form.code)
      ? 'Code must be exactly 4 digits.'
      : null;

  const dupError =
    state.mode === 'create' &&
    /^\d{4}$/.test(state.form.code) &&
    MAJOR_HEADS.some((m) => m.code === state.form.code)
      ? 'A Major Head with this code already exists.'
      : null;

  /* Update helpers ─────────────────── */
  const setMode = (mode: 'create' | 'use') => {
    if (mode === 'use') onChange({ mode: 'use', selectedId: null });
    else onChange({
      mode: 'create',
      form: state.mode === 'create'
        ? state.form
        : {
            code: '',
            englishName: '',
            hindiName: '',
            sector: '',
            subSector: '',
            active: true,
            remarks: '',
          },
    });
  };

  const updateForm = <K extends keyof (MajorHeadState & { mode: 'create' })['form']>(
    key: K,
    value: (MajorHeadState & { mode: 'create' })['form'][K]
  ) => {
    if (state.mode !== 'create') return;
    const nextForm = { ...state.form, [key]: value };
    if (key === 'sector') nextForm.subSector = '';
    onChange({ mode: 'create', form: nextForm });
  };

  return (
    <div className="flex flex-col w-full" style={{ gap: 16 }}>
      <ModeRow
        mode={state.mode}
        onChange={setMode}
        layoutId="major-mode-pill"
        labels={['Create New Major Head', 'Use Existing Major Head']}
      />

      <AnimatePresence mode="wait" initial={false}>
        {state.mode === 'use' ? (
          <motion.div key="use" {...swap}>
            <UseExistingPanel
              title="Map an existing Major Head"
              description="Filter through the chart of accounts and pick the parent Major Head to attach child heads under."
              dropdown={
                <SearchableDropdown
                  ariaLabel="Select Major Head"
                  items={items}
                  selectedId={state.selectedId}
                  onSelect={(id) => onChange({ mode: 'use', selectedId: id })}
                  placeholder="Select Major Head — search by code or name"
                />
              }
            />
          </motion.div>
        ) : (
          <motion.div key="create" {...swap}>
            <FormGrid>
              <LabeledField
                label="Major Head Code"
                required
                hint="4-digit code (e.g. 2202)"
                error={codeError ?? dupError}
              >
                <TextField
                  value={state.form.code}
                  onChange={(v) => updateForm('code', v.replace(/\D/g, '').slice(0, 4))}
                  placeholder="0000"
                  maxLength={4}
                  inputMode="numeric"
                  align="left"
                  prefix="#"
                  tone={codeError || dupError ? 'error' : 'default'}
                />
              </LabeledField>

              <LabeledField label="English Nomenclature" required>
                <TextField
                  value={state.form.englishName}
                  onChange={(v) => updateForm('englishName', v)}
                  placeholder="e.g. Education, Sports, Art and Culture"
                />
              </LabeledField>

              <LabeledField label="Hindi Nomenclature">
                <TextField
                  value={state.form.hindiName}
                  onChange={(v) => updateForm('hindiName', v)}
                  placeholder="e.g. शिक्षा, खेल, कला और संस्कृति"
                />
              </LabeledField>

              <LabeledField label="Sector" required>
                <SelectField
                  options={SECTORS}
                  value={state.form.sector}
                  onChange={(v) => updateForm('sector', v)}
                  placeholder="Select sector"
                />
              </LabeledField>

              <LabeledField
                label="Sub Sector"
                hint={!state.form.sector ? 'Select sector first' : undefined}
              >
                <SelectField
                  options={subSectorOptions}
                  value={state.form.subSector}
                  onChange={(v) => updateForm('subSector', v)}
                  placeholder={state.form.sector ? 'Select sub-sector' : 'Sector first'}
                  disabled={!state.form.sector}
                />
              </LabeledField>

              <LabeledField label="Active Status">
                <StatusSwitch
                  active={state.form.active}
                  onChange={(v) => updateForm('active', v)}
                />
              </LabeledField>

              <LabeledField label="Remarks" className="col-span-full">
                <TextArea
                  value={state.form.remarks}
                  onChange={(v) => updateForm('remarks', v)}
                  placeholder="Optional notes for audit / approval reviewers"
                  rows={2}
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
 *  Layout helpers reused by all three sections
 *  ────────────────────────────────────────────────────────────────── */

export function ModeRow({
  mode,
  onChange,
  layoutId,
  labels,
}: {
  mode: 'create' | 'use';
  onChange: (m: 'create' | 'use') => void;
  layoutId: string;
  labels: [string, string];
}) {
  return (
    <div
      className="flex items-center justify-between flex-wrap"
      style={{
        padding: '10px 12px',
        gap: 10,
        background:
          'linear-gradient(135deg, rgba(37,90,195,0.06) 0%, rgba(125,90,255,0.04) 100%)',
        border: '1px solid #BED0F4',
        borderRadius: 14,
      }}
    >
      <div className="flex items-center gap-6">
        <span className="font-poppins" style={{ fontSize: 12, fontWeight: 700, color: '#5A72A5', textTransform: 'uppercase' }}>
          Mode
        </span>
        <span className="font-poppins" style={{ fontSize: 13, fontWeight: 600, color: '#142952' }}>
          {mode === 'create' ? 'Create New' : 'Use Existing'}
        </span>
      </div>
      <ModeToggle
        layoutId={layoutId}
        value={mode}
        onChange={onChange}
        options={[
          { value: 'create', label: labels[0] },
          { value: 'use',    label: labels[1] },
        ]}
      />
    </div>
  );
}

export function FormGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-y-4 gap-x-4">
      <style>{`
        .col-span-full { grid-column: 1 / -1; }
      `}</style>
      {children}
    </div>
  );
}

export function UseExistingPanel({
  title,
  description,
  dropdown,
}: {
  title: string;
  description: string;
  dropdown: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col w-full"
      style={{
        padding: 14,
        gap: 10,
        borderRadius: 14,
        background: '#FFFFFF',
        border: '1px solid #BED0F4',
        boxShadow: '0 1px 0 0 rgba(255,255,255,0.95) inset, 0 4px 16px -10px rgba(20,49,107,0.18)',
      }}
    >
      <div className="flex flex-col" style={{ gap: 2 }}>
        <span
          className="font-poppins"
          style={{ fontSize: 13, fontWeight: 600, color: '#142952' }}
        >
          {title}
        </span>
        {description ? (
          <span
            className="font-poppins"
            style={{ fontSize: 11, fontWeight: 500, color: '#5A72A5' }}
          >
            {description}
          </span>
        ) : null}
      </div>
      {dropdown}
    </div>
  );
}
