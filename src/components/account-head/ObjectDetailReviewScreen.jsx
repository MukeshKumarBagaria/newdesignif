import { motion } from 'framer-motion';
import { useState } from 'react';
import { CaretRight } from '../icons';
import { LabeledField, RadioGroup, SelectField, TextArea, TextField } from './primitives';
import { SECTORS } from './data';
import { WorkflowBanner } from '../workflow/WorkflowBanner';
import { RemarksPanel } from '../workflow/RemarksPanel';
import { WorkflowFooter } from '../workflow/WorkflowFooter';
import { ReviewSection, Grid4 } from '../workflow/ReviewSection';

/* ─── Mock submitted data from Creator ─────────────────────────── */

const CREATOR_SUBMISSION = {
  submittedBy: 'Anita Verma (BCO Creator)',
  submittedAt: '11 May 2026, 03:15 PM',
  object: {
    code: '0113',
    englishName: 'Office Expenses and Stationery',
    hindiName: 'कार्यालय व्यय एवं लेखन सामग्री',
    sector: 'General Services',
    ledgerClass: 'revenue',
    voteClass: 'voted',
    remarks: 'New object head for office administration expenditure.',
  },
  detail: {
    code: '002',
    englishName: 'Computer and Peripheral Maintenance',
    hindiName: 'कंप्यूटर एवं परिधीय रखरखाव',
    remarks: 'Detail head for IT maintenance costs within office expenses.',
  },
};

const VERIFIER_REMARKS_MOCK = [
  {
    role: 'creator',
    name: 'Anita Verma',
    date: '11 May 2026',
    text: 'Object head created per budget classification guidelines. Detail head covers IT peripheral costs not covered under existing heads.',
  },
];

const APPROVER_REMARKS_MOCK = [
  ...VERIFIER_REMARKS_MOCK,
  {
    role: 'verifier',
    name: 'Sunil Mathur',
    date: '12 May 2026',
    text: 'Verified object and detail head codes. No duplicates found in master. Nomenclature is accurate. Forwarding for approval.',
  },
];

/* ─── Screen ────────────────────────────────────────────────────── */

export function ObjectDetailReviewScreen({ role }) {
  const isVerifier = role === 'verifier';
  const previousRemarks = isVerifier ? VERIFIER_REMARKS_MOCK : APPROVER_REMARKS_MOCK;

  const [object, setObject] = useState({ ...CREATOR_SUBMISSION.object });
  const [detail, setDetail] = useState({ ...CREATOR_SUBMISSION.detail });
  const [remarks, setRemarks] = useState('');

  const canProceed = remarks.trim().length >= 5;

  const handleReturn = () => alert('Request returned with remarks.');
  const handleForward = () => alert('Request forwarded to Approver.');
  const handleReject = () => alert('Request rejected.');
  const handleApprove = () => alert('Object and Detail Head committed to master.');

  return (
    <main className="flex-1 min-w-0 flex flex-col gap-4">
      <motion.div layout className="flex flex-col w-full"
        style={{ padding: 16, gap: 16, borderRadius: 24, background: '#FFF' }}>

        {/* Header */}
        <div style={{ paddingBottom: 12, borderBottom: '1px solid #EEF2FB' }}>
          <h1 className="font-poppins" style={{ color: '#1565C0', fontSize: 22, fontWeight: 700 }}>
            Object + Detail Head — {isVerifier ? 'Verifier Review' : 'Approver Review'}
          </h1>
          <p className="font-poppins" style={{ color: '#7A8FB5', fontSize: 13, fontWeight: 500, marginTop: 4, lineHeight: 1.5 }}>
            Review and edit the submission from {isVerifier ? 'the Creator' : 'the Verifier'}. All fields are editable. Add remarks before proceeding.
          </p>
          <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
            <span className="font-poppins" style={{ background: '#F2F6FD', padding: '3px 8px', borderRadius: 6, fontSize: 12, color: '#7A8FB5', fontWeight: 500 }}>Budget Module</span>
            <CaretRight size={14} />
            <span className="font-poppins" style={{ background: '#F2F6FD', padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#1565C0' }}>Object + Detail Head</span>
            <CaretRight size={14} />
            <span className="font-poppins" style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', letterSpacing: '0.04em',
              background: isVerifier ? '#DBEAFE' : '#EDE9FE', border: `1px solid ${isVerifier ? '#93C5FD' : '#C4B5FD'}`, color: isVerifier ? '#1D4ED8' : '#6D28D9' }}>
              {role}
            </span>
          </div>
        </div>

        {/* Workflow banner */}
        <WorkflowBanner
          role={role}
          submittedBy={CREATOR_SUBMISSION.submittedBy}
          submittedAt={CREATOR_SUBMISSION.submittedAt}
          module="Object + Detail Head"
        />

        {/* ── Section 01: Object Head ── */}
        <ReviewSection index="01" title="Object Head" description="4-digit unit of expenditure classification. All fields editable.">
          <Grid4>
            <div className="col-span-1">
              <LabeledField label="Object Head Code" required>
                <TextField value={object.code}
                  onChange={v => setObject(p => ({ ...p, code: v.replace(/\D/g, '').slice(0, 4) }))}
                  placeholder="4-digit code" inputMode="numeric" maxLength={4} />
              </LabeledField>
            </div>
            <div className="col-span-1">
              <LabeledField label="Sector" required>
                <SelectField options={SECTORS} value={object.sector}
                  onChange={v => setObject(p => ({ ...p, sector: v }))}
                  placeholder="Select Sector" />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Nomenclature (English)" required>
                <TextField value={object.englishName}
                  onChange={v => setObject(p => ({ ...p, englishName: v.slice(0, 200) }))}
                  placeholder="Description in English" />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Nomenclature (Hindi)" required>
                <TextField value={object.hindiName}
                  onChange={v => setObject(p => ({ ...p, hindiName: v.slice(0, 200) }))}
                  placeholder="विवरण हिंदी में" />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Revenue / Capital">
                <RadioGroup
                  value={object.ledgerClass}
                  onChange={v => setObject(p => ({ ...p, ledgerClass: v }))}
                  options={[{ value: 'revenue', label: 'Revenue' }, { value: 'capital', label: 'Capital' }, { value: 'both', label: 'Both' }]}
                />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Voted / Charged">
                <RadioGroup
                  value={object.voteClass}
                  onChange={v => setObject(p => ({ ...p, voteClass: v }))}
                  options={[{ value: 'voted', label: 'Voted' }, { value: 'charged', label: 'Charged' }, { value: 'both', label: 'Both' }]}
                />
              </LabeledField>
            </div>
            <div className="col-span-4">
              <LabeledField label="Remarks">
                <TextArea value={object.remarks}
                  onChange={v => setObject(p => ({ ...p, remarks: v }))}
                  placeholder="Remarks from creator (editable)" rows={2} />
              </LabeledField>
            </div>
          </Grid4>
        </ReviewSection>

        {/* ── Section 02: Detail Head ── */}
        <ReviewSection index="02" title="Detail Head" description="3-digit detailed classification under the Object Head.">
          <Grid4>
            <div className="col-span-1">
              <LabeledField label="Parent Object Head">
                <TextField value={`${object.code} — ${object.englishName}`} onChange={() => undefined} />
              </LabeledField>
            </div>
            <div className="col-span-1">
              <LabeledField label="Detail Head Code" required>
                <TextField value={detail.code}
                  onChange={v => setDetail(p => ({ ...p, code: v.replace(/\D/g, '').slice(0, 3) }))}
                  placeholder="3-digit code" inputMode="numeric" maxLength={3} />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Nomenclature (English)" required>
                <TextField value={detail.englishName}
                  onChange={v => setDetail(p => ({ ...p, englishName: v.slice(0, 200) }))}
                  placeholder="Description in English" />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Nomenclature (Hindi)" required>
                <TextField value={detail.hindiName}
                  onChange={v => setDetail(p => ({ ...p, hindiName: v.slice(0, 200) }))}
                  placeholder="विवरण हिंदी में" />
              </LabeledField>
            </div>
            <div className="col-span-4">
              <LabeledField label="Remarks">
                <TextArea value={detail.remarks}
                  onChange={v => setDetail(p => ({ ...p, remarks: v }))}
                  placeholder="Remarks from creator (editable)" rows={2} />
              </LabeledField>
            </div>
          </Grid4>
        </ReviewSection>

        {/* ── Remarks & Notings ── */}
        <RemarksPanel
          previousRemarks={previousRemarks}
          currentRole={role}
          value={remarks}
          onChange={setRemarks}
        />
      </motion.div>

      <WorkflowFooter
        role={role}
        canForward={canProceed}
        onReturn={handleReturn}
        onForward={handleForward}
        onReject={handleReject}
        onApprove={handleApprove}
      />
    </main>
  );
}
