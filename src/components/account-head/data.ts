/**
 * Sample data + shared types for the Unified Account Head Creation screen.
 *
 * Values mirror the Government of India Demands-for-Grants chart of
 * accounts so that the demo feels representative of an actual IFMIS
 * deployment (Major Heads in 4-digit, Sub Major in 2-digit, Minor in
 * 3-digit). All values are static — wire to your API at the call-sites
 * inside `MajorHeadSection` / `SubMajorHeadSection` / `MinorHeadSection`.
 */

export type Mode = 'create' | 'use';
export type HierarchyStatus = 'CREATED' | 'MAPPED' | null;

/* ───────── Existing options (for "Use Existing …" dropdowns) ───────── */

export type MajorHeadOption = {
  id: string;
  code: string;
  name: string;
  sector: string;
  subSector?: string;
};

export type SubMajorHeadOption = {
  id: string;
  parentMajorId: string;
  code: string;
  name: string;
};

export type MinorHeadOption = {
  id: string;
  parentMajorId: string;
  parentSubMajorId: string;
  code: string;
  name: string;
};

export const MAJOR_HEADS: MajorHeadOption[] = [
  { id: 'mh-2202', code: '2202', name: 'Education, Sports, Art and Culture', sector: 'Social Services', subSector: 'Education' },
  { id: 'mh-2210', code: '2210', name: 'Medical and Public Health',          sector: 'Social Services', subSector: 'Health' },
  { id: 'mh-2215', code: '2215', name: 'Water Supply and Sanitation',         sector: 'Social Services', subSector: 'Urban Development' },
  { id: 'mh-2401', code: '2401', name: 'Crop Husbandry',                      sector: 'Economic Services', subSector: 'Agriculture' },
  { id: 'mh-2501', code: '2501', name: 'Special Programmes for Rural Development', sector: 'Economic Services', subSector: 'Rural Development' },
  { id: 'mh-3054', code: '3054', name: 'Roads and Bridges',                   sector: 'Economic Services', subSector: 'Transport' },
  { id: 'mh-2055', code: '2055', name: 'Police',                              sector: 'General Services', subSector: 'Administrative Services' },
];

export const SUB_MAJOR_HEADS: SubMajorHeadOption[] = [
  { id: 'sm-2202-01', parentMajorId: 'mh-2202', code: '01', name: 'Elementary Education' },
  { id: 'sm-2202-02', parentMajorId: 'mh-2202', code: '02', name: 'Secondary Education' },
  { id: 'sm-2202-03', parentMajorId: 'mh-2202', code: '03', name: 'University and Higher Education' },
  { id: 'sm-2202-04', parentMajorId: 'mh-2202', code: '04', name: 'Adult Education' },

  { id: 'sm-2210-01', parentMajorId: 'mh-2210', code: '01', name: 'Urban Health Services' },
  { id: 'sm-2210-03', parentMajorId: 'mh-2210', code: '03', name: 'Rural Health Services' },
  { id: 'sm-2210-06', parentMajorId: 'mh-2210', code: '06', name: 'Public Health' },

  { id: 'sm-2215-01', parentMajorId: 'mh-2215', code: '01', name: 'Water Supply' },
  { id: 'sm-2215-02', parentMajorId: 'mh-2215', code: '02', name: 'Sewerage and Sanitation' },

  { id: 'sm-2401-00', parentMajorId: 'mh-2401', code: '00', name: 'General' },

  { id: 'sm-3054-03', parentMajorId: 'mh-3054', code: '03', name: 'State Highways' },
  { id: 'sm-3054-04', parentMajorId: 'mh-3054', code: '04', name: 'District and Other Roads' },

  { id: 'sm-2055-00', parentMajorId: 'mh-2055', code: '00', name: 'General' },
];

export const MINOR_HEADS: MinorHeadOption[] = [
  { id: 'mn-2202-01-101', parentMajorId: 'mh-2202', parentSubMajorId: 'sm-2202-01', code: '101', name: 'Government Primary Schools' },
  { id: 'mn-2202-01-102', parentMajorId: 'mh-2202', parentSubMajorId: 'sm-2202-01', code: '102', name: 'Assistance to Non-Government Primary Schools' },
  { id: 'mn-2202-01-104', parentMajorId: 'mh-2202', parentSubMajorId: 'sm-2202-01', code: '104', name: 'Inspection' },
  { id: 'mn-2202-01-789', parentMajorId: 'mh-2202', parentSubMajorId: 'sm-2202-01', code: '789', name: 'Special Component Plan for Scheduled Castes' },

  { id: 'mn-2202-02-109', parentMajorId: 'mh-2202', parentSubMajorId: 'sm-2202-02', code: '109', name: 'Government Secondary Schools' },
  { id: 'mn-2202-02-110', parentMajorId: 'mh-2202', parentSubMajorId: 'sm-2202-02', code: '110', name: 'Assistance to Non-Government Secondary Schools' },

  { id: 'mn-2210-01-110', parentMajorId: 'mh-2210', parentSubMajorId: 'sm-2210-01', code: '110', name: 'Hospitals and Dispensaries' },
  { id: 'mn-2210-03-103', parentMajorId: 'mh-2210', parentSubMajorId: 'sm-2210-03', code: '103', name: 'Primary Health Centres' },

  { id: 'mn-2215-01-101', parentMajorId: 'mh-2215', parentSubMajorId: 'sm-2215-01', code: '101', name: 'Urban Water Supply Schemes' },
  { id: 'mn-2215-01-102', parentMajorId: 'mh-2215', parentSubMajorId: 'sm-2215-01', code: '102', name: 'Rural Water Supply Programmes' },

  { id: 'mn-3054-03-337', parentMajorId: 'mh-3054', parentSubMajorId: 'sm-3054-03', code: '337', name: 'Road Works' },
];

/* ───────── Reference data for "Create New …" form selects ───────── */

export const SECTORS = [
  'General Services',
  'Social Services',
  'Economic Services',
  'Grants-in-Aid and Contributions',
  'Public Debt',
];

export const SUB_SECTORS: Record<string, string[]> = {
  'General Services': ['Organs of State', 'Fiscal Services', 'Administrative Services', 'Pensions and Misc'],
  'Social Services':  ['Education', 'Health', 'Water Supply and Sanitation', 'Welfare', 'Labour and Employment'],
  'Economic Services':['Agriculture', 'Rural Development', 'Industry and Minerals', 'Transport', 'Energy'],
  'Grants-in-Aid and Contributions': ['General'],
  'Public Debt':      ['Internal Debt', 'External Debt'],
};

/* ───────── Form payload types ───────── */

export type MajorHeadForm = {
  code: string;
  englishName: string;
  hindiName: string;
  sector: string;
  subSector: string;
  remarks: string;
};

export type ChildHeadForm = {
  code: string;
  englishName: string;
  hindiName: string;
  remarks: string;
};

export const emptyMajorForm: MajorHeadForm = {
  code: '',
  englishName: '',
  hindiName: '',
  sector: '',
  subSector: '',
  remarks: '',
};

export const emptyChildForm: ChildHeadForm = {
  code: '',
  englishName: '',
  hindiName: '',
  remarks: '',
};

/* ───────── Section state held by parent ───────── */

export type MajorHeadState =
  | { mode: 'use'; selectedId: string | null }
  | { mode: 'create'; form: MajorHeadForm };

export type ChildHeadState =
  | { mode: 'use'; selectedId: string | null }
  | { mode: 'create'; form: ChildHeadForm };

/** Helper — does a section have a usable selection/payload yet? */
export function isMajorComplete(s: MajorHeadState): boolean {
  if (s.mode === 'use') return !!s.selectedId;
  return s.form.code.trim().length >= 4 && !!s.form.englishName.trim();
}

export function isChildComplete(s: ChildHeadState): boolean {
  if (s.mode === 'use') return !!s.selectedId;
  return s.form.code.trim().length >= 2 && !!s.form.englishName.trim();
}

/** Map a section state to the badge it should display in the summary. */
export function badgeFor(s: MajorHeadState | ChildHeadState | null): HierarchyStatus {
  if (!s) return null;
  if (s.mode === 'create') {
    // Show CREATED only once required fields are present.
    const looksFilled =
      'form' in s && s.form.code.trim() !== '' && s.form.englishName.trim() !== '';
    return looksFilled ? 'CREATED' : null;
  }
  return s.selectedId ? 'MAPPED' : null;
}
