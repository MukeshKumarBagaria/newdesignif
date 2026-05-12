import { motion } from 'framer-motion';
import { useState } from 'react';
import { CaretRight } from '../icons';
import { LabeledField, SelectField, TextArea, TextField } from './primitives';
import { SECTORS, SUB_SECTORS } from './data';
import { WorkflowBanner } from '../workflow/WorkflowBanner';
import { RemarksPanel } from '../workflow/RemarksPanel';
import { WorkflowFooter } from '../workflow/WorkflowFooter';
import { ReviewSection, Grid4, Divider } from '../workflow/ReviewSection';

/* ─── Mock submitted data from Creator ─────────────────────────── */

const CREATOR_SUBMISSION = {
  submittedBy: 'Rajesh Kumar (BCO Creator)',
  submittedAt: '12 May 2026, 10:34 AM',
  major: {
    code: '2202',
    englishName: 'Education, Sports, Art and Culture',
    hindiName: 'शिक्षा, खेलकूद, कला और संस्कृति',
    sector: 'Social Services',
    subSector: 'Education',
    remarks: 'Major head mapped as per budget circular 2026-27.',
  },
  subMajor: {
    code: '01',
    englishName: 'Elementary Education',
    hindiName: 'प्राथमिक शिक्षा',
    remarks: 'Sub-major head created for elementary education segment.',
  },
  minor: {
    code: '101',
    englishName: 'Government Primary Schools',
    hindiName: 'सरकारी प्राथमिक विद्यालय',
    remarks: 'Covers all government primary school budget allocations.',
  },
};

const VERIFIER_REMARKS_MOCK = [
  {
    role: 'creator',
    name: 'Rajesh Kumar',
    date: '12 May 2026',
    text: 'All heads created as per budget manual Chapter 3. Sector mapping verified with Finance Dept circular dated 01-Apr-2026.',
  },
];

const APPROVER_REMARKS_MOCK = [
  ...VERIFIER_REMARKS_MOCK,
  {
    role: 'verifier',
    name: 'Priya Sharma',
    date: '13 May 2026',
    text: 'Reviewed and verified all three heads. Nomenclature matches state chart of accounts. Forwarding for final approval.',
  },
];

/* ─── Screen ────────────────────────────────────────────────────── */

export function AccountHeadReviewScreen({ role }) {
  const isVerifier = role === 'verifier';
  const previousRemarks = isVerifier ? VERIFIER_REMARKS_MOCK : APPROVER_REMARKS_MOCK;

  /* Editable copies of creator's submitted data */
  const [major, setMajor] = useState({ ...CREATOR_SUBMISSION.major });
  const [subMajor, setSubMajor] = useState({ ...CREATOR_SUBMISSION.subMajor });
  const [minor, setMinor] = useState({ ...CREATOR_SUBMISSION.minor });
  const [remarks, setRemarks] = useState('');

  const subSectorOptions = major.sector ? (SUB_SECTORS[major.sector] ?? []) : [];

  const canProceed = remarks.trim().length >= 5; // require some remarks to proceed

  const handleReturn = () => alert('Request returned with remarks.');
  const handleForward = () => alert('Request forwarded to Approver.');
  const handleReject = () => alert('Request rejected.');
  const handleApprove = () => alert('Request approved and committed to master.');

  return (
    <main className="flex-1 min-w-0 flex flex-col gap-4">
      <motion.div layout className="flex flex-col w-full"
        style={{ padding: 16, gap: 16, borderRadius: 24, background: '#FFF' }}>

        {/* Header */}
        <div style={{ paddingBottom: 12, borderBottom: '1px solid #EEF2FB' }}>
          <h1 className="font-poppins" style={{ color: '#1565C0', fontSize: 22, fontWeight: 700 }}>
            Unified Account Head — {isVerifier ? 'Verifier Review' : 'Approver Review'}
          </h1>
          <p className="font-poppins" style={{ color: '#7A8FB5', fontSize: 13, fontWeight: 500, marginTop: 4, lineHeight: 1.5 }}>
            Review and edit the submission from {isVerifier ? 'the Creator' : 'the Verifier'}. All fields are editable. Add remarks before proceeding.
          </p>
          <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
            <span className="font-poppins" style={{ background: '#F2F6FD', padding: '3px 8px', borderRadius: 6, fontSize: 12, color: '#7A8FB5', fontWeight: 500 }}>Budget Module</span>
            <CaretRight size={14} />
            <span className="font-poppins" style={{ background: '#F2F6FD', padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#1565C0' }}>Account Head Management</span>
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
          module="Account Head Management"
        />

        {/* ── Section 01: Major Head ── */}
        <ReviewSection index="01" title="Major Head" description="4-digit primary budget classification. All fields editable.">
          <Grid4>
            <div className="col-span-1">
              <LabeledField label="Major Head Code" required>
                <TextField value={major.code}
                  onChange={v => setMajor(p => ({ ...p, code: v.replace(/\D/g, '').slice(0, 4) }))}
                  placeholder="4-digit code" inputMode="numeric" maxLength={4} />
              </LabeledField>
            </div>
            <div className="col-span-1">
              <LabeledField label="Sector" required>
                <SelectField options={SECTORS} value={major.sector}
                  onChange={v => setMajor(p => ({ ...p, sector: v, subSector: '' }))}
                  placeholder="Select Sector" />
              </LabeledField>
            </div>
            <div className="col-span-1">
              <LabeledField label="Sub-Sector">
                <SelectField options={subSectorOptions} value={major.subSector}
                  onChange={v => setMajor(p => ({ ...p, subSector: v }))}
                  placeholder="Select Sub-Sector" disabled={!major.sector} />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Nomenclature (English)" required>
                <TextField value={major.englishName}
                  onChange={v => setMajor(p => ({ ...p, englishName: v.slice(0, 200) }))}
                  placeholder="Scheme description in English" />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Nomenclature (Hindi)" required>
                <TextField value={major.hindiName}
                  onChange={v => setMajor(p => ({ ...p, hindiName: v.slice(0, 200) }))}
                  placeholder="विवरण हिंदी में" />
              </LabeledField>
            </div>
            <div className="col-span-4">
              <LabeledField label="Remarks">
                <TextArea value={major.remarks}
                  onChange={v => setMajor(p => ({ ...p, remarks: v }))}
                  placeholder="Remarks from creator (editable)" rows={2} />
              </LabeledField>
            </div>
          </Grid4>
        </ReviewSection>

        {/* ── Section 02: Sub Major Head ── */}
        <ReviewSection index="02" title="Sub Major Head" description="2-digit sub-classification under the Major Head.">
          <Grid4>
            <div className="col-span-1">
              <LabeledField label="Parent Major Head">
                <TextField value={`${major.code} — ${major.englishName}`} onChange={() => undefined} />
              </LabeledField>
            </div>
            <div className="col-span-1">
              <LabeledField label="Sub Major Head Code" required>
                <TextField value={subMajor.code}
                  onChange={v => setSubMajor(p => ({ ...p, code: v.replace(/\D/g, '').slice(0, 2) }))}
                  placeholder="2-digit code" inputMode="numeric" maxLength={2} />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Nomenclature (English)" required>
                <TextField value={subMajor.englishName}
                  onChange={v => setSubMajor(p => ({ ...p, englishName: v.slice(0, 200) }))}
                  placeholder="Description in English" />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Nomenclature (Hindi)" required>
                <TextField value={subMajor.hindiName}
                  onChange={v => setSubMajor(p => ({ ...p, hindiName: v.slice(0, 200) }))}
                  placeholder="विवरण हिंदी में" />
              </LabeledField>
            </div>
            <div className="col-span-4">
              <LabeledField label="Remarks">
                <TextArea value={subMajor.remarks}
                  onChange={v => setSubMajor(p => ({ ...p, remarks: v }))}
                  placeholder="Remarks from creator (editable)" rows={2} />
              </LabeledField>
            </div>
          </Grid4>
        </ReviewSection>

        {/* ── Section 03: Minor Head ── */}
        <ReviewSection index="03" title="Minor Head" description="3-digit program-level classification.">
          <Grid4>
            <div className="col-span-1">
              <LabeledField label="Parent Sub Major Head">
                <TextField value={`${subMajor.code} — ${subMajor.englishName}`} onChange={() => undefined} />
              </LabeledField>
            </div>
            <div className="col-span-1">
              <LabeledField label="Minor Head Code" required>
                <TextField value={minor.code}
                  onChange={v => setMinor(p => ({ ...p, code: v.replace(/\D/g, '').slice(0, 3) }))}
                  placeholder="3-digit code" inputMode="numeric" maxLength={3} />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Nomenclature (English)" required>
                <TextField value={minor.englishName}
                  onChange={v => setMinor(p => ({ ...p, englishName: v.slice(0, 200) }))}
                  placeholder="Description in English" />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Nomenclature (Hindi)" required>
                <TextField value={minor.hindiName}
                  onChange={v => setMinor(p => ({ ...p, hindiName: v.slice(0, 200) }))}
                  placeholder="विवरण हिंदी में" />
              </LabeledField>
            </div>
            <div className="col-span-4">
              <LabeledField label="Remarks">
                <TextArea value={minor.remarks}
                  onChange={v => setMinor(p => ({ ...p, remarks: v }))}
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
