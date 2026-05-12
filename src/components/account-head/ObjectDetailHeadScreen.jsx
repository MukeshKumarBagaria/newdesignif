import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { CaretRight } from '../icons';
import {
  FormGrid,
  ModeRow,
  UseExistingPanel,
} from './MajorHeadSection';
import {
  LabeledField,
  RadioGroup,
  SearchableDropdown,
  SelectField,
  TextArea,
  TextField,
} from './primitives';
import { MAJOR_HEADS, SECTORS } from './data';

const emptyObjectForm = {
  code: '',
  englishName: '',
  hindiName: '',
  sector: '',
  ledgerClass: 'revenue',
  voteClass: 'voted',
  remarks: '',
};

const emptyDetailForm = {
  code: '',
  englishName: '',
  hindiName: '',
  remarks: '',
};

export function ObjectDetailHeadScreen() {
  const [objectMode, setObjectMode] = useState('create');
  const [detailMode, setDetailMode] = useState('notRequired');
  const [objectForm, setObjectForm] = useState(emptyObjectForm);
  const [mappedObjectId, setMappedObjectId] = useState(null);
  const [detailForm, setDetailForm] = useState(emptyDetailForm);

  useEffect(() => {
    if (objectMode === 'map') {
      setDetailMode('create');
    }
  }, [objectMode]);

  const objectOptions = useMemo(
    () =>
      MAJOR_HEADS.map((m) => ({
        id: m.id,
        code: m.code,
        label: m.name,
        caption: [m.sector, m.subSector].filter(Boolean).join(' · '),
      })),
    []
  );

  const mappedObject = MAJOR_HEADS.find((m) => m.id === mappedObjectId) ?? null;

  const objectComplete =
    objectMode === 'create'
      ? /^\d{4}$/.test(objectForm.code) && objectForm.englishName.trim().length > 0
      : !!mappedObjectId;
  const detailComplete =
    detailMode === 'notRequired'
      ? true
      : /^\d{3}$/.test(detailForm.code) && detailForm.englishName.trim().length > 0;
  const canSubmit = objectComplete && detailComplete;

  const resetAll = () => {
    setObjectMode('create');
    setDetailMode('notRequired');
    setObjectForm(emptyObjectForm);
    setMappedObjectId(null);
    setDetailForm(emptyDetailForm);
  };

  return (
    <main className="flex-1 min-w-0 flex flex-col gap-4">
      <motion.div
        layout
        className="flex flex-col w-full"
        style={{ padding: 16, gap: 24, alignItems: 'flex-start', borderRadius: 24, background: '#FFF' }}
      >
        <div className="flex flex-col items-start w-full" style={{ gap: 8 }}>
          <h1 className="font-poppins" style={{ color: '#1565C0', fontSize: 26, fontWeight: 700 }}>
            Object + Detail Head
          </h1>
          <p className="font-poppins" style={{ color: '#5A72A5', fontSize: 14, fontWeight: 500 }}>
            One screen for Object and Detail Head creation with optional Detail support.
          </p>
          <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
            <span className="flex items-center justify-center rounded-2xl font-poppins font-medium" style={{ background: '#F6F7F8', padding: '4px 8px', fontSize: 14, color: '#808080' }}>
              Budget Module
            </span>
            <CaretRight size={20} className="text-grey-400" />
            <span className="flex items-center justify-center rounded-2xl font-poppins" style={{ background: '#F6F7F8', padding: '4px 8px', fontSize: 14, fontWeight: 600, color: '#1565C0' }}>
              Object + Detail Head
            </span>
          </div>
        </div>

        <div className="w-full rounded-[20px] border border-[#BED0F4] bg-[#F6F7F8]" style={{ padding: 14 }}>
          <div className="w-full rounded-[12px] bg-white border border-[#BED0F4]" style={{ padding: 12 }}>
            <ModeRow
              mode={objectMode === 'create' ? 'create' : 'use'}
              onChange={(mode) => setObjectMode(mode === 'create' ? 'create' : 'map')}
              layoutId="object-detail-object-mode"
              labels={['Create Object Head', 'Map Object Head']}
            />

            <div style={{ marginTop: 12 }}>
              {objectMode === 'create' ? (
                <FormGrid>
                  <LabeledField label="Object Head Code" required>
                    <TextField
                      value={objectForm.code}
                      onChange={(v) => setObjectForm((prev) => ({ ...prev, code: v.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="Enter 4 digit code"
                      inputMode="numeric"
                      maxLength={4}
                    />
                  </LabeledField>
                  <LabeledField label="Nomenclature (English)" required>
                    <TextField
                      value={objectForm.englishName}
                      onChange={(v) => setObjectForm((prev) => ({ ...prev, englishName: v }))}
                      placeholder="Description of Object Head in English"
                    />
                  </LabeledField>
                  <LabeledField label="Nomenclature (Hindi)" required>
                    <TextField
                      value={objectForm.hindiName}
                      onChange={(v) => setObjectForm((prev) => ({ ...prev, hindiName: v }))}
                      placeholder="Description of Object Head in Hindi"
                    />
                  </LabeledField>
                  <LabeledField label="Sector" required>
                    <SelectField
                      options={SECTORS}
                      value={objectForm.sector}
                      onChange={(v) => setObjectForm((prev) => ({ ...prev, sector: v }))}
                      placeholder="Select Sector"
                    />
                  </LabeledField>
                  <LabeledField label="Revenue / Capital">
                    <RadioGroup
                      value={objectForm.ledgerClass}
                      onChange={(v) => setObjectForm((prev) => ({ ...prev, ledgerClass: v }))}
                      options={[
                        { value: 'revenue', label: 'Revenue' },
                        { value: 'capital', label: 'Capital' },
                        { value: 'both', label: 'Both' },
                      ]}
                    />
                  </LabeledField>
                  <LabeledField label="Voted / Charged">
                    <RadioGroup
                      value={objectForm.voteClass}
                      onChange={(v) => setObjectForm((prev) => ({ ...prev, voteClass: v }))}
                      options={[
                        { value: 'voted', label: 'Voted' },
                        { value: 'charged', label: 'Charged' },
                        { value: 'both', label: 'Both' },
                      ]}
                    />
                  </LabeledField>
                  <LabeledField label="Remarks" className="col-span-full" required>
                    <TextArea
                      value={objectForm.remarks}
                      onChange={(v) => setObjectForm((prev) => ({ ...prev, remarks: v }))}
                      placeholder="Optional notes"
                      rows={3}
                    />
                  </LabeledField>
                </FormGrid>
              ) : (
                <UseExistingPanel
                  title="Map existing Object Head"
                  description="Select an already configured Object Head."
                  dropdown={
                    <SearchableDropdown
                      items={objectOptions}
                      selectedId={mappedObjectId}
                      onSelect={setMappedObjectId}
                      placeholder="Select Object Head"
                    />
                  }
                />
              )}
            </div>
          </div>
        </div>

        <div className="w-full rounded-[20px] border border-[#BED0F4] bg-[#F6F7F8]" style={{ padding: 14 }}>
          <div className="w-full rounded-[12px] bg-white border border-[#BED0F4]" style={{ padding: 12 }}>
            <ModeRow
              mode={detailMode === 'create' ? 'create' : 'use'}
              onChange={(mode) => setDetailMode(mode === 'create' ? 'create' : 'notRequired')}
              layoutId="object-detail-detail-mode"
              labels={['Create Detail Head', objectMode === 'map' ? 'Required when Object is mapped' : 'Detail Head Not Required']}
            />

            <div style={{ marginTop: 12 }}>
              {detailMode === 'create' ? (
                <FormGrid>
                  <LabeledField label="Parent Object Head" required>
                    <TextField
                      value={
                        objectMode === 'map'
                          ? (mappedObject ? `${mappedObject.code} - ${mappedObject.name}` : '')
                          : `${objectForm.code || '____'} - ${objectForm.englishName || '(new object draft)'}`
                      }
                      onChange={() => undefined}
                      placeholder={objectMode === 'map' ? 'Select Object Head first' : 'Create Object Head first'}
                      ariaLabel="Parent Object Head"
                    />
                  </LabeledField>
                  <LabeledField label="Detail Head Code" required>
                    <TextField
                      value={detailForm.code}
                      onChange={(v) => setDetailForm((prev) => ({ ...prev, code: v.replace(/\D/g, '').slice(0, 3) }))}
                      placeholder="Enter 3 digit detail head code"
                      inputMode="numeric"
                      maxLength={3}
                    />
                  </LabeledField>
                  <LabeledField label="Nomenclature (English)" required>
                    <TextField
                      value={detailForm.englishName}
                      onChange={(v) => setDetailForm((prev) => ({ ...prev, englishName: v }))}
                      placeholder="Description of Detail Head in English"
                    />
                  </LabeledField>
                  <LabeledField label="Nomenclature (Hindi)" required>
                    <TextField
                      value={detailForm.hindiName}
                      onChange={(v) => setDetailForm((prev) => ({ ...prev, hindiName: v }))}
                      placeholder="Description of Detail Head in Hindi"
                    />
                  </LabeledField>
                  <LabeledField label="Remarks" className="col-span-full" required>
                    <TextArea
                      value={detailForm.remarks}
                      onChange={(v) => setDetailForm((prev) => ({ ...prev, remarks: v }))}
                      placeholder="Optional notes"
                      rows={3}
                    />
                  </LabeledField>
                </FormGrid>
              ) : (
                <div
                  className="font-poppins inline-flex items-center rounded-full"
                  style={{
                    height: 34,
                    padding: '0 12px',
                    background: '#F2F6FD',
                    border: '1px solid #BED0F4',
                    color: '#1B4AA8',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Variation enabled: Object Head can be created without Detail Head.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-cta sticky bottom-5 z-30 box-border flex items-center justify-end self-stretch flex-wrap"
        style={{ padding: '20px 32px', gap: 16 }}
      >
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex items-center justify-center font-poppins font-semibold"
          style={{ height: 44, borderRadius: 12, border: '1px solid #255AC3', color: '#255AC3', padding: '0 20px', background: '#fff' }}
        >
          Reset
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center font-poppins font-semibold"
          style={{ height: 44, borderRadius: 12, border: '1px solid #9EDC8A', color: '#0E4913', padding: '0 20px', background: '#B6EAA6' }}
        >
          Save
        </button>
        <button
          type="button"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center font-poppins font-semibold"
          style={{
            height: 44,
            borderRadius: 12,
            border: '1px solid #2273C3',
            color: '#fff',
            padding: '0 20px',
            background: '#2273C3',
            opacity: canSubmit ? 1 : 0.55,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          Submit
        </button>
      </motion.div>
    </main>
  );
}
