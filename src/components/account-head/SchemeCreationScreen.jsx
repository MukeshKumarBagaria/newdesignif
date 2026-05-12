import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useMemo, useState } from 'react';
import { CaretRight } from '../icons';
import { LabeledField, SelectField, TextArea, TextField } from './primitives';
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
  { code: '01', name: 'Salaries' }, { code: '02', name: 'Wages' },
  { code: '11', name: 'Travel Expenses' }, { code: '13', name: 'Office Expenses' },
  { code: '31', name: 'Grants-in-aid' }, { code: '50', name: 'Other Charges' },
];
const DETAIL_HEADS = [
  { code: '101', name: 'Pay of Officers' }, { code: '102', name: 'Pay of Establishment' },
  { code: '110', name: 'Materials and Supplies' }, { code: '337', name: 'Road Works' },
];

/* ─── Helpers ────────────────────────────────────────────────────── */

function calcDuration(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start).getFullYear();
  const e = new Date(end).getFullYear();
  return Math.max(0, e - s + 1);
}

function genFY(startDate, count) {
  const yr = new Date(startDate).getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const y = yr + i;
    return `${y}-${String(y + 1).slice(2)}`;
  });
}

/* ─── Primitives ─────────────────────────────────────────────────── */

function Grid4({ children, className = '' }) {
  return <div className={`grid grid-cols-4 gap-x-4 gap-y-4 ${className}`}>{children}</div>;
}

function Divider({ label }) {
  return (
    <div className="col-span-4 flex items-center gap-3" style={{ marginTop: 2, marginBottom: -2 }}>
      {label && (
        <span className="font-poppins shrink-0"
          style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: '#7A8FB5', textTransform: 'uppercase' }}>
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-[#E9EFFB]" />
    </div>
  );
}

function Section({ index, title, description, children }) {
  return (
    <div className="w-full rounded-2xl bg-white border border-[#E2EAF8]" style={{ padding: '20px 24px' }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
        <span className="font-poppins inline-flex items-center justify-center shrink-0"
          style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#E9EFFB 0%,#D4E0F7 100%)', color: '#1B4AA8', fontSize: 12, fontWeight: 700 }}>
          {index}
        </span>
        <div>
          <p className="font-poppins" style={{ fontSize: 15, fontWeight: 700, color: '#142952', lineHeight: 1.2 }}>{title}</p>
          {description && <p className="font-poppins" style={{ fontSize: 11, fontWeight: 500, color: '#7A8FB5', marginTop: 2 }}>{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function DateField({ value, onChange, max, min }) {
  return (
    <input type="date" value={value} max={max} min={min} onChange={e => onChange(e.target.value)}
      className="font-poppins w-full outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(37,90,195,0.18)]"
      style={{ height: 36, padding: '0 10px', borderRadius: 10, border: '1px solid #5A72A5', background: '#FFFFFF', fontSize: 13, fontWeight: 500, color: '#142952' }}
    />
  );
}

function Tag({ children, color = 'blue' }) {
  const m = { blue: { bg: '#EFF4FD', b: '#BED0F4', c: '#1B4AA8' }, amber: { bg: '#FBF5E9', b: '#E4C988', c: '#815E18' }, green: { bg: '#E6F5E1', b: '#A5D66F', c: '#2C6C13' } }[color];
  return (
    <span className="font-poppins inline-flex items-center"
      style={{ height: 22, padding: '0 8px', borderRadius: 999, background: m.bg, border: `1px solid ${m.b}`, color: m.c, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

/* ─── HoA compact card ───────────────────────────────────────────── */

function HoaEntry({
  hoa, index: entryIdx, total,
  onChange, onRemove,
}) {
  const subMajorOpts = useMemo(() => SUB_MAJOR_HEADS.filter(s => s.parentMajorId === hoa.majorId), [hoa.majorId]);
  const minorOpts    = useMemo(() => MINOR_HEADS.filter(m => m.parentSubMajorId === hoa.subMajorId), [hoa.subMajorId]);

  const majorLabel = () => { const m = MAJOR_HEADS.find(x => x.id === hoa.majorId); return m ? `${m.code} — ${m.name}` : ''; };
  const smLabel    = () => { const s = subMajorOpts.find(x => x.id === hoa.subMajorId); return s ? `${s.code} — ${s.name}` : ''; };
  const mnLabel    = () => { const m = minorOpts.find(x => x.id === hoa.minorId); return m ? `${m.code} — ${m.name}` : ''; };
  const ohLabel    = () => { const o = OBJECT_HEADS.find(x => x.code === hoa.objectCode); return o ? `${o.code} — ${o.name}` : ''; };
  const dhLabel    = () => { const d = DETAIL_HEADS.find(x => x.code === hoa.detailCode); return d ? `${d.code} — ${d.name}` : ''; };
  const dLabel     = () => { const d = DEMANDS.find(x => x.id === hoa.demandId); return d ? `${d.code} — ${d.name}` : ''; };

  /* Card segment definitions */
  const segs = [
    { lbl: 'Demand', val: DEMANDS.find(d => d.id === hoa.demandId)?.code ?? '', w: 48, max: 2,
      onSet: v => { const m = DEMANDS.find(d => d.code === v); onChange({ ...hoa, demandId: m?.id ?? '' }); } },
    { lbl: 'Major', val: MAJOR_HEADS.find(m => m.id === hoa.majorId)?.code ?? '', w: 60, max: 4,
      onSet: v => { const m = MAJOR_HEADS.find(x => x.code === v); onChange({ ...hoa, majorId: m?.id ?? '', subMajorId: '', minorId: '' }); } },
    { lbl: 'Sub Maj', val: subMajorOpts.find(s => s.id === hoa.subMajorId)?.code ?? '', w: 48, max: 2,
      onSet: v => { const m = subMajorOpts.find(s => s.code === v); onChange({ ...hoa, subMajorId: m?.id ?? '', minorId: '' }); } },
    { lbl: 'Minor', val: minorOpts.find(m => m.id === hoa.minorId)?.code ?? '', w: 52, max: 3,
      onSet: v => { const m = minorOpts.find(x => x.code === v); onChange({ ...hoa, minorId: m?.id ?? '' }); } },
    { lbl: 'Seg', val: hoa.segment, w: 48, max: 4,
      onSet: v => onChange({ ...hoa, segment: v.toUpperCase() }) },
    { lbl: 'Scheme', val: hoa.schemeCode, w: 56, max: 4, locked: true, onSet: () => undefined },
    { lbl: 'Dev', val: hoa.developmentHead.slice(0, 5), w: 52, max: 5,
      onSet: v => { const m = DEVELOPMENT_HEADS.find(d => d.startsWith(v)); onChange({ ...hoa, developmentHead: m ?? v }); } },
    { lbl: 'Object', val: hoa.objectCode, w: 44, max: 2,
      onSet: v => { const m = OBJECT_HEADS.find(o => o.code === v); onChange({ ...hoa, objectCode: m?.code ?? v }); } },
    { lbl: 'Detail', val: hoa.detailCode, w: 48, max: 3,
      onSet: v => { const m = DETAIL_HEADS.find(d => d.code === v); onChange({ ...hoa, detailCode: m?.code ?? v }); } },
  ];

  return (
    <div className="rounded-xl border border-[#E2EAF8] bg-[#FAFBFD]" style={{ padding: '12px 14px' }}>
      {/* entry header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
        <div className="flex items-center gap-2">
          <span className="font-poppins inline-flex items-center justify-center"
            style={{ width: 22, height: 22, borderRadius: 6, background: '#E9EFFB', color: '#1B4AA8', fontSize: 10, fontWeight: 700 }}>
            {entryIdx + 1}
          </span>
          <span className="font-poppins" style={{ fontSize: 11, fontWeight: 600, color: '#142952' }}>HoA Mapping</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onChange({ ...hoa, showDropdowns: !hoa.showDropdowns })}
            className="font-poppins"
            style={{ height: 22, padding: '0 8px', borderRadius: 4, border: '1px solid #BED0F4', background: '#F2F6FD', color: '#1B4AA8', fontSize: 10, fontWeight: 600 }}>
            {hoa.showDropdowns ? 'Hide Dropdowns' : 'Show Dropdowns'}
          </button>
          {total > 1 && (
            <button type="button" onClick={onRemove}
              style={{ height: 22, width: 22, borderRadius: 4, border: '1px solid #F5C6CB', background: '#FDF3F3', color: '#B8141A', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* card view */}
      <div style={{ padding: '10px 12px', borderRadius: 10, background: 'linear-gradient(135deg,#F4F7FE 0%,#EBF0FB 100%)', border: '1px solid #C8D8F4', marginBottom: hoa.showDropdowns ? 12 : 0 }}>
        <div className="flex flex-wrap items-end" style={{ gap: '6px 4px' }}>
          {segs.map((s, i) => (
            <div key={s.lbl} className="flex items-end" style={{ gap: 4 }}>
              <div className="flex flex-col" style={{ gap: 3 }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', color: '#7A8FB5', textTransform: 'uppercase' }}>
                  {s.lbl}
                </span>
                <input
                  value={s.val} maxLength={s.max} onChange={e => s.onSet(e.target.value)}
                  placeholder={'·'.repeat(s.max)} disabled={s.locked}
                  className="font-poppins text-center outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(37,90,195,0.22)]"
                  style={{
                    width: s.w, height: 34, borderRadius: 6,
                    border: `1px solid ${s.locked ? '#E4C988' : '#C2D2EE'}`,
                    background: s.locked ? '#FBF5E9' : '#FFFFFF',
                    color: s.locked ? '#815E18' : '#142952',
                    fontSize: 13, fontWeight: 700, letterSpacing: '0.04em',
                    fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
                  }}
                />
              </div>
              {i < segs.length - 1 && (
                <span aria-hidden style={{ color: '#BED0F4', fontSize: 16, fontWeight: 300, paddingBottom: 7 }}>–</span>
              )}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 9, color: '#7A8FB5', marginTop: 6 }}>
          Type codes directly or use dropdowns below · Scheme Code locked at <strong style={{ color: '#815E18' }}>0000</strong>
        </p>
      </div>

      {/* dropdowns — collapsible */}
      <AnimatePresence initial={false}>
        {hoa.showDropdowns && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
            <div className="grid grid-cols-5 gap-3" style={{ paddingTop: 2 }}>
              {[
                { lbl: 'Demand Number *', opts: DEMANDS.map(d => `${d.code} — ${d.name}`), val: dLabel(),
                  onCh: (v) => { const code = v.split(' — ')[0]; const m = DEMANDS.find(d => d.code === code); onChange({ ...hoa, demandId: m?.id ?? '' }); } },
                { lbl: 'Major Head *', opts: MAJOR_HEADS.map(m => `${m.code} — ${m.name}`), val: majorLabel(),
                  onCh: (v) => { const code = v.split(' — ')[0]; const m = MAJOR_HEADS.find(x => x.code === code); onChange({ ...hoa, majorId: m?.id ?? '', subMajorId: '', minorId: '' }); } },
                { lbl: 'Sub Major Head *', opts: subMajorOpts.map(s => `${s.code} — ${s.name}`), val: smLabel(),
                  onCh: (v) => { const code = v.split(' — ')[0]; const m = subMajorOpts.find(s => s.code === code); onChange({ ...hoa, subMajorId: m?.id ?? '', minorId: '' }); } },
                { lbl: 'Minor Head *', opts: minorOpts.map(m => `${m.code} — ${m.name}`), val: mnLabel(),
                  onCh: (v) => { const code = v.split(' — ')[0]; const m = minorOpts.find(x => x.code === code); onChange({ ...hoa, minorId: m?.id ?? '' }); } },
                { lbl: 'Segment Code *', opts: SEGMENT_CODES, val: hoa.segment,
                  onCh: (v) => onChange({ ...hoa, segment: v }) },
                { lbl: 'Development Head', opts: DEVELOPMENT_HEADS, val: hoa.developmentHead,
                  onCh: (v) => onChange({ ...hoa, developmentHead: v }) },
                { lbl: 'Object Head *', opts: OBJECT_HEADS.map(o => `${o.code} — ${o.name}`), val: ohLabel(),
                  onCh: (v) => onChange({ ...hoa, objectCode: v.split(' — ')[0] }) },
                { lbl: 'Detail Head *', opts: DETAIL_HEADS.map(d => `${d.code} — ${d.name}`), val: dhLabel(),
                  onCh: (v) => onChange({ ...hoa, detailCode: v.split(' — ')[0] }) },
                { lbl: 'Charged / Voted *', opts: ['Voted', 'Charged'], val: hoa.chargedVoted,
                  onCh: (v) => onChange({ ...hoa, chargedVoted: v }) },
              ].map(f => (
                <div key={f.lbl}>
                  <LabeledField label={f.lbl.replace(' *', '')} required={f.lbl.includes('*')}>
                    <SelectField options={f.opts} value={f.val} onChange={f.onCh} placeholder={`Select`} />
                  </LabeledField>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Stepper ────────────────────────────────────────────────────── */

function StepperCTA({ steps }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isComplete = step.state === 'complete';
        const isActive   = step.state === 'active';
        return (
          <div key={step.label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className="font-poppins inline-flex items-center justify-center shrink-0"
                style={{
                  width: 24, height: 24, borderRadius: 999,
                  background: isComplete ? '#22C55E' : isActive ? '#255AC3' : 'transparent',
                  border: isComplete ? '1.5px solid #16A34A' : isActive ? '1.5px solid #255AC3' : '1.5px solid #BED0F4',
                  color: isComplete || isActive ? '#FFFFFF' : '#9DB3DC',
                  fontSize: 10, fontWeight: 700,
                  transition: 'all 0.2s',
                }}
              >
                {isComplete ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  String(i + 1).padStart(2, '0')
                )}
              </span>
              <span className="font-poppins whitespace-nowrap"
                style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isComplete ? '#16A34A' : isActive ? '#142952' : '#9DB3DC' }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 24, height: 1.5, background: isComplete ? '#86EFAC' : '#E2EAF8', borderRadius: 1 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main screen ────────────────────────────────────────────────── */

let _uid = 0;
const uid = () => String(++_uid);

const makeHoa = (id) => ({
  id, demandId: '', majorId: '', subMajorId: '', minorId: '',
  segment: '', schemeCode: '0000', developmentHead: '',
  objectCode: '', detailCode: '', chargedVoted: '', showDropdowns: false,
});

const emptyScheme = {
  category: '', schemeCode: '0000', nomenclatureEn: '', nomenclatureHi: '',
  shortName: '', validityStart: '', validityEnd: '',
  totalAmount: '', yearCaps: [],
  attachmentName: '', schemeDescription: '', remarks: '',
};

export function SchemeCreationScreen() {
  const [hoaList, setHoaList] = useState([makeHoa(uid())]);
  const [form, setForm] = useState(emptyScheme);
  const fileRef = useRef(null);

  const upd = (k, v) =>
    setForm(p => ({ ...p, [k]: v }));

  const updateHoa = (id, next) =>
    setHoaList(list => list.map(h => h.id === id ? next : h));

  const addHoa = () => setHoaList(list => [...list, makeHoa(uid())]);
  const removeHoa = (id) => setHoaList(list => list.filter(h => h.id !== id));

  /* Auto year caps from duration */
  const duration = calcDuration(form.validityStart, form.validityEnd);
  useEffect(() => {
    if (!form.validityStart || duration <= 0) { upd('yearCaps', []); return; }
    const fyLabels = genFY(form.validityStart, duration);
    setForm(p => ({
      ...p,
      yearCaps: fyLabels.map((yr, i) => ({ year: yr, amount: p.yearCaps[i]?.amount ?? '' })),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.validityStart, form.validityEnd]);

  const today = new Date().toISOString().slice(0, 10);

  /* Financial validation */
  const total       = parseFloat(form.totalAmount) || 0;
  const yearSum     = form.yearCaps.reduce((s, y) => s + (parseFloat(y.amount) || 0), 0);
  const capMismatch = total > 0 && form.yearCaps.length > 0 && Math.abs(yearSum - total) > 0.001;

  /* Stepper completion */
  const s1Complete = !!form.category && form.nomenclatureEn.trim().length > 0 && form.nomenclatureHi.trim().length > 0 && !!form.validityStart;
  const s2Complete = total > 0 && !capMismatch && form.yearCaps.every(y => y.amount.length > 0);
  const s3Complete = hoaList.some(h => !!h.majorId && !!h.segment && !!h.objectCode);
  const s4Complete = !!form.schemeDescription.trim() || !!form.attachmentName;

  const stepsConfig = [
    { label: 'Scheme Basics', state: s1Complete ? 'complete' : 'active' },
    { label: 'Financials',    state: s2Complete ? 'complete' : s1Complete ? 'active' : 'pending' },
    { label: 'HoA Mapping',  state: s3Complete ? 'complete' : s2Complete ? 'active' : 'pending' },
    { label: 'Attachments',  state: s4Complete ? 'complete' : s3Complete ? 'active' : 'pending' },
  ];

  const hoaOk     = hoaList.some(h => !!h.demandId && !!h.majorId && !!h.subMajorId && !!h.minorId && !!h.segment && !!h.objectCode && !!h.detailCode && !!h.chargedVoted);
  const canSubmit = s1Complete && s2Complete && hoaOk;

  const reset = () => { setHoaList([makeHoa(uid())]); setForm(emptyScheme); };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    upd('attachmentName', f.name);
    if (!form.remarks) upd('remarks', `Auto-extracted from "${f.name}": Scheme proposal aligned with departmental objectives.`);
  };

  return (
    <main className="flex-1 min-w-0 flex flex-col gap-4">
      <motion.div layout className="flex flex-col w-full"
        style={{ padding: 16, gap: 16, borderRadius: 24, background: '#FFF' }}>

        {/* ── Page header ── */}
        <div style={{ paddingBottom: 12, borderBottom: '1px solid #EEF2FB' }}>
          <h1 className="font-poppins" style={{ color: '#1565C0', fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>
            New Scheme Creation Request
          </h1>
          <p className="font-poppins" style={{ color: '#7A8FB5', fontSize: 13, fontWeight: 500, marginTop: 4, maxWidth: 680, lineHeight: 1.5 }}>
            Initiate a scheme proposal in IFMIS NG — map to Head of Account, define financial ceilings, then route through BCO → Admin → DoF.
          </p>
          <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
            <span className="font-poppins" style={{ background: '#F2F6FD', padding: '3px 8px', borderRadius: 6, fontSize: 12, color: '#7A8FB5', fontWeight: 500 }}>Budget Module</span>
            <CaretRight size={14} />
            <span className="font-poppins" style={{ background: '#F2F6FD', padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#1565C0' }}>Scheme Master</span>
            <CaretRight size={14} />
            <Tag color="amber">Flag · 0000 · Temporary</Tag>
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
              <LabeledField label={
                <span className="flex items-center gap-1.5">
                  Scheme Code<span style={{ color: '#B8141A' }}> *</span>
                  <span style={{ height: 16, padding: '0 6px', borderRadius: 4, background: '#FBF5E9', border: '1px solid #E4C988', color: '#815E18', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center' }}>LOCKED · 0000</span>
                </span>
              }>
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
              <LabeledField label={
                <span className="flex items-center gap-1.5">
                  Duration (Years)
                  <span style={{ height: 16, padding: '0 6px', borderRadius: 4, background: '#EFF4FD', border: '1px solid #BED0F4', color: '#1B4AA8', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center' }}>AUTO</span>
                </span>
              }>
                <TextField value={duration > 0 ? String(duration) : ''} onChange={() => undefined} placeholder="—" align="center" />
              </LabeledField>
            </div>
          </Grid4>
        </Section>

        {/* ── 02 Financial Parameters ── */}
        <Section index="02" title="Financial Parameters" description="Total sanctioned cost and year-wise break-up — auto-generated from scheme duration.">
          <Grid4>
            <div className="col-span-2">
              <LabeledField label="Total Sanctioned Amount (₹)" required>
                <TextField value={form.totalAmount} onChange={v => upd('totalAmount', v.replace(/[^\d.]/g, ''))} placeholder="0.00" inputMode="numeric" prefix="₹" />
              </LabeledField>
            </div>

            <Divider label="Year-wise Capping" />

            <div className="col-span-4">
              {form.yearCaps.length === 0 ? (
                <p className="font-poppins" style={{ fontSize: 12, color: '#9DB3DC', fontStyle: 'italic' }}>
                  Set Validity Start and End dates in Section 01 to auto-generate year-wise rows.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-3" style={{ marginBottom: 10 }}>
                    {form.yearCaps.map((y, idx) => (
                      <div key={idx} className="rounded-xl border border-[#E2EAF8] bg-[#FAFBFD]" style={{ padding: '12px 14px' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                          <span className="font-poppins" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#7A8FB5', textTransform: 'uppercase' }}>Year {idx + 1}</span>
                          <span className="font-poppins" style={{ fontSize: 11, fontWeight: 700, color: '#1B4AA8' }}>{y.year}</span>
                        </div>
                        <LabeledField label="Capped Amount (₹)">
                          <TextField value={y.amount}
                            onChange={v => upd('yearCaps', form.yearCaps.map((c, i) => i === idx ? { ...c, amount: v.replace(/[^\d.]/g, '') } : c))}
                            placeholder="0.00" inputMode="numeric" prefix="₹" />
                        </LabeledField>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-3 rounded-xl"
                    style={{ padding: '8px 16px', background: capMismatch ? '#FDF3F3' : '#F0FAF0', border: `1px solid ${capMismatch ? '#F5C6CB' : '#A5D66F'}` }}>
                    <span className="font-poppins" style={{ fontSize: 12, fontWeight: 600, color: capMismatch ? '#B8141A' : '#2C6C13' }}>
                      {capMismatch ? `Mismatch — year total ₹${yearSum.toLocaleString()} ≠ ₹${total.toLocaleString()}` : `Reconciled — ₹${yearSum.toLocaleString()}`}
                    </span>
                    <span className="font-poppins" style={{ fontSize: 11, color: '#7A8FB5', fontWeight: 500 }}>
                      Target: ₹{total.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Grid4>
        </Section>

        {/* ── 03 HoA Mapping ── */}
        <Section index="03" title="Head of Account Mapping" description="Add one or more budget lines. Type codes directly in the card or expand dropdowns.">
          <div className="flex flex-col" style={{ gap: 12 }}>
            {hoaList.map((hoa, idx) => (
              <HoaEntry key={hoa.id} hoa={hoa} index={idx} total={hoaList.length}
                onChange={next => updateHoa(hoa.id, next)}
                onRemove={() => removeHoa(hoa.id)} />
            ))}
            <button type="button" onClick={addHoa}
              className="font-poppins self-start"
              style={{ height: 32, padding: '0 16px', borderRadius: 999, border: '1.5px dashed #BED0F4', background: '#F8FAFD', color: '#1B4AA8', fontSize: 12, fontWeight: 600 }}>
              + Add Another HoA Mapping
            </button>
          </div>
        </Section>

        {/* ── 04 Attachments & Remarks ── */}
        <Section index="04" title="Attachments & Remarks" description="Upload a document — the system auto-extracts key content into Remarks.">
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
              <LabeledField label="Scheme Description">
                <TextArea value={form.schemeDescription} onChange={v => upd('schemeDescription', v.slice(0, 500))} placeholder="Describe the scheme purpose and objectives (500 chars)" rows={4} />
              </LabeledField>
            </div>
            <div className="col-span-2">
              <LabeledField label={
                <span className="flex items-center gap-1.5">
                  Remarks
                  <span style={{ height: 16, padding: '0 6px', borderRadius: 4, background: '#E6F5E1', border: '1px solid #A5D66F', color: '#2C6C13', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center' }}>AI EXTRACTED</span>
                </span>
              }>
                <TextArea value={form.remarks} onChange={v => upd('remarks', v.slice(0, 500))} placeholder="Remarks — auto-populated from uploaded document" rows={4} />
              </LabeledField>
            </div>
          </Grid4>
        </Section>
      </motion.div>

      {/* ── Sticky footer with stepper ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-cta sticky bottom-5 z-30 box-border flex items-center justify-between self-stretch flex-wrap"
        style={{ padding: '14px 24px', gap: 16 }}>

        <StepperCTA steps={stepsConfig} />

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
