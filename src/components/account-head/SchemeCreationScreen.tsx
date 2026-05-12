import { motion } from 'framer-motion';
import { useRef, useMemo, useState, type ReactNode } from 'react';
import { CaretRight } from '../icons';
import {
  LabeledField,
  RadioGroup,
  SelectField,
  TextArea,
  TextField,
} from './primitives';
import { MAJOR_HEADS, SUB_MAJOR_HEADS, MINOR_HEADS } from './data';

/* ─── Reference data ─────────────────────────────────────────────── */

const SCHEME_CATEGORIES = ['Expenditure Scheme', 'Receipt Scheme'];
const DEMANDS = [
  { id: 'd-01', code: '01', name: 'General Administration' },
  { id: 'd-15', code: '15', name: 'School Education' },
  { id: 'd-17', code: '17', name: 'Public Health & Family Welfare' },
  { id: 'd-21', code: '21', name: 'Urban Development & Housing' },
  { id: 'd-28', code: '28', name: 'Public Works – Roads & Bridges' },
];
const SEGMENT_CODES = ['ST', 'SCSP', 'TSP', 'GEN'];
const DEVELOPMENT_HEADS = ['80100 – Plan', '80200 – Non-Plan', '80300 – Centrally Sponsored'];
const OBJECT_HEADS = [
  { code: '01', name: 'Salaries' },
  { code: '02', name: 'Wages' },
  { code: '11', name: 'Travel Expenses' },
  { code: '13', name: 'Office Expenses' },
  { code: '31', name: 'Grants-in-aid' },
  { code: '50', name: 'Other Charges' },
];
const DETAIL_HEADS = [
  { code: '101', name: 'Pay of Officers' },
  { code: '102', name: 'Pay of Establishment' },
  { code: '110', name: 'Materials and Supplies' },
  { code: '337', name: 'Road Works' },
];

/* ─── Types ──────────────────────────────────────────────────────── */

type HoaState = {
  demandId: string; majorId: string; subMajorId: string; minorId: string;
  segment: string; schemeCode: string; developmentHead: string;
  objectCode: string; detailCode: string; chargedVoted: string;
};
type YearCap = { year: string; amount: string };
type SchemeForm = {
  category: string; schemeCode: string; nomenclatureEn: string; nomenclatureHi: string;
  shortName: string; validityStart: string; validityEnd: string;
  totalAmount: string; ledgerClass: 'capital' | 'revenue'; yearCaps: YearCap[];
  attachmentName: string; justification: string; remarks: string;
};

const emptyHoa: HoaState = {
  demandId: '', majorId: '', subMajorId: '', minorId: '',
  segment: '', schemeCode: '0000', developmentHead: '',
  objectCode: '', detailCode: '', chargedVoted: '',
};
const emptyScheme: SchemeForm = {
  category: '', schemeCode: '0000', nomenclatureEn: '', nomenclatureHi: '',
  shortName: '', validityStart: '', validityEnd: '',
  totalAmount: '', ledgerClass: 'revenue', yearCaps: [{ year: '2026-27', amount: '' }],
  attachmentName: '', justification: '', remarks: '',
};

/* ─── Sub-components ─────────────────────────────────────────────── */

/** 4-column responsive grid — the layout backbone of this screen */
function Grid4({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-4 gap-x-4 gap-y-4 ${className}`}>
      {children}
    </div>
  );
}

/** Divider with optional label */
function Divider({ label }: { label?: string }) {
  return (
    <div className="col-span-4 flex items-center gap-3" style={{ marginTop: 4, marginBottom: -4 }}>
      {label && (
        <span className="font-poppins shrink-0"
          style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: '#5A72A5', textTransform: 'uppercase' }}>
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-[#E9EFFB]" />
    </div>
  );
}

/** Section card — single white card, no nesting */
function Section({ index, title, description, children }: {
  index: string; title: string; description?: string; children: ReactNode;
}) {
  return (
    <div className="w-full rounded-2xl bg-white border border-[#E2EAF8]"
      style={{ padding: '20px 24px' }}>
      {/* header */}
      <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
        <span className="font-poppins inline-flex items-center justify-center shrink-0"
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg,#E9EFFB 0%,#D4E0F7 100%)',
            color: '#1B4AA8', fontSize: 12, fontWeight: 700,
          }}>
          {index}
        </span>
        <div>
          <p className="font-poppins" style={{ fontSize: 15, fontWeight: 700, color: '#142952', lineHeight: 1.2 }}>
            {title}
          </p>
          {description && (
            <p className="font-poppins" style={{ fontSize: 11, fontWeight: 500, color: '#7A8FB5', marginTop: 2 }}>
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

/** Date input styled to match the design system fields */
function DateField({ value, onChange, max, min }: {
  value: string; onChange: (v: string) => void; max?: string; min?: string;
}) {
  return (
    <input type="date" value={value} max={max} min={min}
      onChange={(e) => onChange(e.target.value)}
      className="font-poppins w-full outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(37,90,195,0.18)]"
      style={{
        height: 36, padding: '0 10px', borderRadius: 10,
        border: '1px solid #5A72A5', background: '#FFFFFF',
        fontSize: 13, fontWeight: 500, color: '#142952',
      }}
    />
  );
}

/** Compact tag pill */
function Tag({ children, color = 'blue' }: { children: ReactNode; color?: 'blue' | 'amber' | 'green' | 'red' }) {
  const map = {
    blue:  { bg: '#EFF4FD', border: '#BED0F4', color: '#1B4AA8' },
    amber: { bg: '#FBF5E9', border: '#E4C988', color: '#815E18' },
    green: { bg: '#E6F5E1', border: '#A5D66F', color: '#2C6C13' },
    red:   { bg: '#FBECEC', border: '#F5C6CB', color: '#B8141A' },
  }[color];
  return (
    <span className="font-poppins inline-flex items-center"
      style={{
        height: 22, padding: '0 8px', borderRadius: 999,
        background: map.bg, border: `1px solid ${map.border}`,
        color: map.color, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
        textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
      {children}
    </span>
  );
}

/* ─── HoA Card View ──────────────────────────────────────────────── */

function HoaCard({ hoa, onChange }: { hoa: HoaState; onChange: (n: HoaState) => void }) {
  const demand   = DEMANDS.find(d => d.id === hoa.demandId);
  const major    = MAJOR_HEADS.find(m => m.id === hoa.majorId);
  const subMajor = SUB_MAJOR_HEADS.find(s => s.id === hoa.subMajorId);
  const minor    = MINOR_HEADS.find(m => m.id === hoa.minorId);

  const segs: { lbl: string; val: string; w: number; max: number; locked?: boolean; onSet: (v: string) => void }[] = [
    { lbl: 'Demand', val: demand?.code ?? '', w: 52, max: 2,
      onSet: v => { const m = DEMANDS.find(d => d.code === v); onChange({ ...hoa, demandId: m?.id ?? '' }); } },
    { lbl: 'Major', val: major?.code ?? '', w: 68, max: 4,
      onSet: v => { const m = MAJOR_HEADS.find(x => x.code === v); onChange({ ...hoa, majorId: m?.id ?? '', subMajorId: '', minorId: '' }); } },
    { lbl: 'Sub Maj', val: subMajor?.code ?? '', w: 52, max: 2,
      onSet: v => { const m = SUB_MAJOR_HEADS.find(s => s.code === v && s.parentMajorId === hoa.majorId); onChange({ ...hoa, subMajorId: m?.id ?? '', minorId: '' }); } },
    { lbl: 'Minor', val: minor?.code ?? '', w: 56, max: 3,
      onSet: v => { const m = MINOR_HEADS.find(x => x.code === v && x.parentSubMajorId === hoa.subMajorId); onChange({ ...hoa, minorId: m?.id ?? '' }); } },
    { lbl: 'Segment', val: hoa.segment, w: 64, max: 6,
      onSet: v => onChange({ ...hoa, segment: v.toUpperCase() }) },
    { lbl: 'Scheme', val: hoa.schemeCode, w: 64, max: 4, locked: true, onSet: () => undefined },
    { lbl: 'Dev Head', val: hoa.developmentHead.slice(0, 5), w: 68, max: 5,
      onSet: v => { const m = DEVELOPMENT_HEADS.find(d => d.startsWith(v)); onChange({ ...hoa, developmentHead: m ?? '' }); } },
    { lbl: 'Object', val: hoa.objectCode, w: 48, max: 2,
      onSet: v => { const m = OBJECT_HEADS.find(o => o.code === v); onChange({ ...hoa, objectCode: m?.code ?? '' }); } },
    { lbl: 'Detail', val: hoa.detailCode, w: 56, max: 3,
      onSet: v => { const m = DETAIL_HEADS.find(d => d.code === v); onChange({ ...hoa, detailCode: m?.code ?? '' }); } },
  ];

  return (
    <div style={{
      padding: '14px 16px', borderRadius: 12,
      border: '1px solid #BED0F4',
      background: 'linear-gradient(135deg,#F4F7FE 0%,#EBF0FB 100%)',
    }}>
      <p className="font-poppins" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: '#7A8FB5', textTransform: 'uppercase', marginBottom: 12 }}>
        Budget Line — Card View
      </p>
      <div className="flex flex-wrap items-end" style={{ gap: '8px 6px' }}>
        {segs.map((s, i) => (
          <div key={s.lbl} className="flex items-end" style={{ gap: 6 }}>
            <div className="flex flex-col" style={{ gap: 4 }}>
              <span className="font-poppins" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: '#7A8FB5', textTransform: 'uppercase' }}>
                {s.lbl}
              </span>
              <input
                value={s.val}
                maxLength={s.max}
                onChange={e => s.onSet(e.target.value)}
                placeholder={'·'.repeat(s.max)}
                disabled={s.locked}
                className="font-poppins text-center outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(37,90,195,0.22)]"
                style={{
                  width: s.w, height: 40, borderRadius: 8,
                  border: `1px solid ${s.locked ? '#E4C988' : '#C2D2EE'}`,
                  background: s.locked ? '#FBF5E9' : '#FFFFFF',
                  color: s.locked ? '#815E18' : '#142952',
                  fontSize: 15, fontWeight: 700, letterSpacing: '0.04em',
                  fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
                }}
              />
            </div>
            {i < segs.length - 1 && (
              <span aria-hidden style={{ color: '#BED0F4', fontSize: 20, fontWeight: 300, paddingBottom: 9, lineHeight: 1 }}>–</span>
            )}
          </div>
        ))}
      </div>
      <p className="font-poppins" style={{ fontSize: 10, color: '#7A8FB5', marginTop: 10 }}>
        Scheme Code is locked at <strong style={{ color: '#815E18' }}>0000</strong> — replaced by Finance Dept after final approval.
      </p>
    </div>
  );
}

/* ─── Main screen ────────────────────────────────────────────────── */

export function SchemeCreationScreen() {
  const [hoa, setHoa] = useState<HoaState>(emptyHoa);
  const [form, setForm] = useState<SchemeForm>(emptyScheme);
  const fileRef = useRef<HTMLInputElement>(null);

  const upd = <K extends keyof SchemeForm>(k: K, v: SchemeForm[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const subMajorOpts = useMemo(() => SUB_MAJOR_HEADS.filter(s => s.parentMajorId === hoa.majorId), [hoa.majorId]);
  const minorOpts    = useMemo(() => MINOR_HEADS.filter(m => m.parentSubMajorId === hoa.subMajorId), [hoa.subMajorId]);

  const today = new Date().toISOString().slice(0, 10);

  /* Financial validation */
  const total      = parseFloat(form.totalAmount) || 0;
  const yearSum    = form.yearCaps.reduce((s, y) => s + (parseFloat(y.amount) || 0), 0);
  const capMismatch = total > 0 && Math.abs(yearSum - total) > 0.001;

  /* Duration */
  const duration =
    form.validityStart && form.validityEnd
      ? Math.max(0, new Date(form.validityEnd).getFullYear() - new Date(form.validityStart).getFullYear() + 1)
      : null;

  /* Can submit */
  const hoaOk = !!hoa.demandId && !!hoa.majorId && !!hoa.subMajorId && !!hoa.minorId && !!hoa.segment && !!hoa.objectCode && !!hoa.detailCode && !!hoa.chargedVoted;
  const canSubmit = !!form.category && form.nomenclatureEn.trim().length > 0 && form.nomenclatureHi.trim().length > 0 && !!form.validityStart && !capMismatch && hoaOk;

  const reset = () => { setHoa(emptyHoa); setForm(emptyScheme); };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    upd('attachmentName', f.name);
    if (!form.remarks) upd('remarks', `Auto-extracted from "${f.name}": Scheme proposal aligned with departmental objectives; financial outlay and outcome indicators detailed in attached document.`);
  };

  /* helper to render a SelectField option string from a code */
  const demandLabel = (id: string) => { const d = DEMANDS.find(x => x.id === id); return d ? `${d.code} — ${d.name}` : ''; };
  const majorLabel  = (id: string) => { const m = MAJOR_HEADS.find(x => x.id === id); return m ? `${m.code} — ${m.name}` : ''; };
  const smLabel     = (id: string) => { const s = subMajorOpts.find(x => x.id === id); return s ? `${s.code} — ${s.name}` : ''; };
  const mnLabel     = (id: string) => { const m = minorOpts.find(x => x.id === id); return m ? `${m.code} — ${m.name}` : ''; };
  const ohLabel     = (code: string) => { const o = OBJECT_HEADS.find(x => x.code === code); return o ? `${o.code} — ${o.name}` : ''; };
  const dhLabel     = (code: string) => { const d = DETAIL_HEADS.find(x => x.code === code); return d ? `${d.code} — ${d.name}` : ''; };

  return (
    <main className="flex-1 min-w-0 flex flex-col gap-4">
      <motion.div layout className="flex flex-col w-full"
        style={{ padding: 16, gap: 16, borderRadius: 24, background: '#FFF' }}>

        {/* ── Page header ── */}
        <div style={{ paddingBottom: 8, borderBottom: '1px solid #EEF2FB' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-poppins" style={{ color: '#1565C0', fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>
                New Scheme Creation Request
              </h1>
              <p className="font-poppins" style={{ color: '#7A8FB5', fontSize: 13, fontWeight: 500, marginTop: 4, maxWidth: 680, lineHeight: 1.5 }}>
                Initiate a scheme proposal in IFMIS NG — map to HoA, define financial ceilings and outcome indicators, then route through BCO → Admin → DoF.
              </p>
              <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
                <span className="font-poppins" style={{ background: '#F2F6FD', padding: '3px 8px', borderRadius: 6, fontSize: 12, color: '#7A8FB5', fontWeight: 500 }}>Budget Module</span>
                <CaretRight size={14} className="text-grey-400" />
                <span className="font-poppins" style={{ background: '#F2F6FD', padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#1565C0' }}>Scheme Master</span>
                <CaretRight size={14} className="text-grey-400" />
                <Tag color="amber">Flag · 0000 · Temporary</Tag>
              </div>
            </div>
          </div>
        </div>

        {/* ── 01 Scheme Master Basics ── */}
        <Section index="01" title="Scheme Master Basics" description="Scheme identity fields. Final 4-digit code assigned by Finance Dept after approval.">
          <Grid4>
            <div className="col-span-1">
              <LabeledField label="Scheme Category" required>
                <SelectField options={SCHEME_CATEGORIES} value={form.category} onChange={v => upd('category', v)} placeholder="Select" />
              </LabeledField>
            </div>
            <div className="col-span-1">
              <LabeledField label="Scheme Code" required hint="Locked at 0000">
                <TextField value={form.schemeCode} onChange={() => undefined} />
              </LabeledField>
            </div>
            <div className="col-span-1">
              <LabeledField label="Validity Start Date" required>
                <DateField value={form.validityStart} onChange={v => upd('validityStart', v)} max={today} />
              </LabeledField>
            </div>
            <div className="col-span-1">
              <LabeledField label="Validity End Date">
                <DateField value={form.validityEnd} onChange={v => upd('validityEnd', v)} min={form.validityStart || undefined} />
              </LabeledField>
            </div>

            <div className="col-span-2">
              <LabeledField label="Nomenclature (English)" required>
                <TextField value={form.nomenclatureEn} onChange={v => upd('nomenclatureEn', v.replace(/[^A-Za-z0-9 .,'\-()/]/g, '').slice(0, 200))} placeholder="Scheme description in English" maxLength={200} />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Nomenclature (Hindi)" required>
                <TextField value={form.nomenclatureHi} onChange={v => upd('nomenclatureHi', v.slice(0, 200))} placeholder="योजना का विवरण हिंदी में" maxLength={200} />
              </LabeledField>
            </div>

            <div className="col-span-1">
              <LabeledField label="Scheme Short Name">
                <TextField value={form.shortName} onChange={v => upd('shortName', v.slice(0, 50))} placeholder="Short name (optional)" maxLength={50} />
              </LabeledField>
            </div>
            <div className="col-span-1">
              <LabeledField label="Duration (Years)" hint="Auto-calculated">
                <TextField value={duration !== null ? String(duration) : ''} onChange={() => undefined} placeholder="—" align="center" />
              </LabeledField>
            </div>
          </Grid4>
        </Section>

        {/* ── 02 HoA Mapping ── */}
        <Section index="02" title="Head of Account Mapping" description="Card view and dropdowns stay in sync — edit either to update both.">
          <div className="flex flex-col" style={{ gap: 16 }}>
            <HoaCard hoa={hoa} onChange={setHoa} />

            <Divider label="Dropdown View" />

            <Grid4>
              <div className="col-span-1">
                <LabeledField label="Demand Number" required>
                  <SelectField options={DEMANDS.map(d => `${d.code} — ${d.name}`)} value={demandLabel(hoa.demandId)}
                    onChange={v => { const code = v.split(' — ')[0]; const m = DEMANDS.find(d => d.code === code); setHoa({ ...hoa, demandId: m?.id ?? '' }); }} placeholder="Select Demand" />
                </LabeledField>
              </div>
              <div className="col-span-1">
                <LabeledField label="Major Head" required>
                  <SelectField options={MAJOR_HEADS.map(m => `${m.code} — ${m.name}`)} value={majorLabel(hoa.majorId)}
                    onChange={v => { const code = v.split(' — ')[0]; const m = MAJOR_HEADS.find(x => x.code === code); setHoa({ ...hoa, majorId: m?.id ?? '', subMajorId: '', minorId: '' }); }} placeholder="Select Major Head" />
                </LabeledField>
              </div>
              <div className="col-span-1">
                <LabeledField label="Sub Major Head" required>
                  <SelectField options={subMajorOpts.map(s => `${s.code} — ${s.name}`)} value={smLabel(hoa.subMajorId)}
                    onChange={v => { const code = v.split(' — ')[0]; const m = subMajorOpts.find(s => s.code === code); setHoa({ ...hoa, subMajorId: m?.id ?? '', minorId: '' }); }}
                    placeholder={hoa.majorId ? 'Select Sub Major' : 'Pick Major first'} disabled={!hoa.majorId} />
                </LabeledField>
              </div>
              <div className="col-span-1">
                <LabeledField label="Minor Head" required>
                  <SelectField options={minorOpts.map(m => `${m.code} — ${m.name}`)} value={mnLabel(hoa.minorId)}
                    onChange={v => { const code = v.split(' — ')[0]; const m = minorOpts.find(x => x.code === code); setHoa({ ...hoa, minorId: m?.id ?? '' }); }}
                    placeholder={hoa.subMajorId ? 'Select Minor Head' : 'Pick Sub Major first'} disabled={!hoa.subMajorId} />
                </LabeledField>
              </div>

              <div className="col-span-1">
                <LabeledField label="Segment Code" required>
                  <SelectField options={SEGMENT_CODES} value={hoa.segment} onChange={v => setHoa({ ...hoa, segment: v })} placeholder="Select Segment" />
                </LabeledField>
              </div>
              <div className="col-span-1">
                <LabeledField label="Scheme Code" hint="Locked at 0000">
                  <TextField value={hoa.schemeCode} onChange={() => undefined} />
                </LabeledField>
              </div>
              <div className="col-span-1">
                <LabeledField label="Development Head">
                  <SelectField options={DEVELOPMENT_HEADS} value={hoa.developmentHead} onChange={v => setHoa({ ...hoa, developmentHead: v })} placeholder="Select Dev Head" />
                </LabeledField>
              </div>
              <div className="col-span-1">
                <LabeledField label="Charged / Voted" required>
                  <SelectField options={['Voted', 'Charged']} value={hoa.chargedVoted} onChange={v => setHoa({ ...hoa, chargedVoted: v })} placeholder="Select" />
                </LabeledField>
              </div>

              <div className="col-span-1">
                <LabeledField label="Object Head" required>
                  <SelectField options={OBJECT_HEADS.map(o => `${o.code} — ${o.name}`)} value={ohLabel(hoa.objectCode)}
                    onChange={v => setHoa({ ...hoa, objectCode: v.split(' — ')[0] })} placeholder="Select Object Head" />
                </LabeledField>
              </div>
              <div className="col-span-1">
                <LabeledField label="Detail Head" required>
                  <SelectField options={DETAIL_HEADS.map(d => `${d.code} — ${d.name}`)} value={dhLabel(hoa.detailCode)}
                    onChange={v => setHoa({ ...hoa, detailCode: v.split(' — ')[0] })} placeholder="Select Detail Head" />
                </LabeledField>
              </div>
            </Grid4>
          </div>
        </Section>

        {/* ── 03 Financial Parameters ── */}
        <Section index="03" title="Financial Parameters" description="Total sanctioned cost, multi-year break-up, and Capital / Revenue classification.">
          <Grid4>
            <div className="col-span-1">
              <LabeledField label="Total Sanctioned Amount (₹)" required>
                <TextField value={form.totalAmount} onChange={v => upd('totalAmount', v.replace(/[^\d.]/g, ''))} placeholder="0.00" inputMode="numeric" prefix="₹" />
              </LabeledField>
            </div>
            <div className="col-span-3 flex items-end">
              <LabeledField label="Capital / Revenue" required>
                <RadioGroup value={form.ledgerClass} onChange={v => upd('ledgerClass', v)}
                  options={[{ value: 'revenue', label: 'Revenue' }, { value: 'capital', label: 'Capital' }]} />
              </LabeledField>
            </div>

            <Divider label="Year-wise Capping" />

            <div className="col-span-4">
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <p className="font-poppins" style={{ fontSize: 11, color: '#7A8FB5', fontWeight: 500 }}>
                  Sum of yearly allocations must equal Total Amount.
                </p>
                <button type="button" onClick={() => upd('yearCaps', [...form.yearCaps, { year: '', amount: '' }])}
                  className="font-poppins"
                  style={{ height: 28, padding: '0 12px', borderRadius: 999, border: '1px solid #BED0F4', background: '#F2F6FD', color: '#1B4AA8', fontSize: 11, fontWeight: 600 }}>
                  + Add Year
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {form.yearCaps.map((y, idx) => (
                  <div key={idx} className="rounded-xl border border-[#E2EAF8] bg-[#FAFBFD]" style={{ padding: '12px 14px' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                      <span className="font-poppins" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#7A8FB5', textTransform: 'uppercase' }}>
                        Year {idx + 1}
                      </span>
                      {form.yearCaps.length > 1 && (
                        <button type="button" onClick={() => upd('yearCaps', form.yearCaps.filter((_, i) => i !== idx))}
                          className="font-poppins"
                          style={{ height: 20, padding: '0 7px', borderRadius: 4, border: '1px solid #F5C6CB', background: '#FDF3F3', color: '#B8141A', fontSize: 10, fontWeight: 700 }}>
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col" style={{ gap: 8 }}>
                      <LabeledField label="Financial Year">
                        <TextField value={y.year} onChange={v => upd('yearCaps', form.yearCaps.map((c, i) => i === idx ? { ...c, year: v } : c))} placeholder="YYYY-YY" />
                      </LabeledField>
                      <LabeledField label="Capped Amount (₹)">
                        <TextField value={y.amount} onChange={v => upd('yearCaps', form.yearCaps.map((c, i) => i === idx ? { ...c, amount: v.replace(/[^\d.]/g, '') } : c))} placeholder="0.00" inputMode="numeric" prefix="₹" />
                      </LabeledField>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 rounded-xl" style={{
                marginTop: 10, padding: '8px 16px',
                background: capMismatch ? '#FDF3F3' : '#F0FAF0',
                border: `1px solid ${capMismatch ? '#F5C6CB' : '#A5D66F'}`,
              }}>
                <span className="font-poppins" style={{ fontSize: 12, fontWeight: 600, color: capMismatch ? '#B8141A' : '#2C6C13' }}>
                  {capMismatch
                    ? `Mismatch — year total ₹${yearSum.toLocaleString()} ≠ total ₹${total.toLocaleString()}`
                    : `Reconciled — ₹${yearSum.toLocaleString()}`}
                </span>
                <span className="font-poppins" style={{ fontSize: 11, color: '#7A8FB5', fontWeight: 500 }}>Target: ₹{total.toLocaleString()}</span>
              </div>
            </div>
          </Grid4>
        </Section>

        {/* ── 04 Attachments & Remarks ── */}
        <Section index="04" title="Attachments, Justification & Remarks" description="Upload a document — the system auto-extracts key content into the Remarks field.">
          <Grid4>
            <div className="col-span-4">
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#BED0F4] bg-[#F8FAFD]" style={{ padding: '12px 16px' }}>
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" className="hidden" onChange={handleFile} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="font-poppins shrink-0"
                  style={{ height: 32, padding: '0 14px', borderRadius: 8, border: '1px solid #255AC3', background: '#FFFFFF', color: '#255AC3', fontSize: 12, fontWeight: 600 }}>
                  Choose File
                </button>
                <span className="font-poppins flex-1 truncate" style={{ fontSize: 13, color: form.attachmentName ? '#142952' : '#9DB3DC', fontWeight: 500 }}>
                  {form.attachmentName || 'No file selected · PDF / JPEG / DOCX'}
                </span>
                {form.attachmentName && <Tag color="green">AI Extracted → Remarks</Tag>}
              </div>
            </div>
            <div className="col-span-2">
              <LabeledField label="Justification">
                <TextArea value={form.justification} onChange={v => upd('justification', v.slice(0,500))} placeholder="Justify the need for this scheme (optional, 500 chars)" rows={3} />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label="Remarks" hint="Auto-populated from attachments">
                <TextArea value={form.remarks} onChange={v => upd('remarks', v.slice(0,500))} placeholder="Remarks — populated automatically from attachments" rows={3} />
              </LabeledField>
            </div>
          </Grid4>
        </Section>

      </motion.div>

      {/* ── Sticky footer ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-cta sticky bottom-5 z-30 box-border flex items-center justify-between self-stretch flex-wrap"
        style={{ padding: '16px 28px', gap: 16 }}>
        <div className="flex items-center gap-2">
          <span className="font-poppins" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: '#7A8FB5', textTransform: 'uppercase' }}>
            Submission Readiness
          </span>
          <span className="font-poppins" style={{ fontSize: 13, fontWeight: 600, color: '#142952' }}>
            {canSubmit ? 'All checks passed — ready to submit.' : 'Complete mandatory fields to enable submission.'}
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <button type="button" onClick={reset} className="font-poppins font-semibold"
            style={{ height: 40, borderRadius: 10, border: '1px solid #BED0F4', color: '#5A72A5', padding: '0 18px', background: '#fff', fontSize: 13 }}>
            Reset
          </button>
          <button type="button" className="font-poppins font-semibold"
            style={{ height: 40, borderRadius: 10, border: '1px solid #9EDC8A', color: '#0E4913', padding: '0 18px', background: '#B6EAA6', fontSize: 13 }}>
            Save Draft
          </button>
          <button type="button" disabled={!canSubmit} className="font-poppins font-semibold"
            style={{ height: 40, borderRadius: 10, border: '1px solid #2273C3', color: '#fff', padding: '0 20px', background: '#2273C3', fontSize: 13, opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
            Submit to Verifier →
          </button>
        </div>
      </motion.div>
    </main>
  );
}
