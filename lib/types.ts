export type Region = 'bay-area' | 'central-valley' | 'los-angeles' | 'rural-north' | 'inland-empire'

export type PracticeArea =
  | 'Housing'
  | 'Domestic violence'
  | 'Immigration'
  | 'Public benefits'
  | 'Consumer'
  | 'Workers'
  | 'Tribal'
  | 'Rural generalist'
  | 'Senior law'
  | 'Disability rights'

export type Language = 'Spanish' | 'Mandarin' | 'Vietnamese' | 'Tagalog' | 'Punjabi' | 'Hmong'

export interface RegionInfo {
  id: Region
  name: string
  short: string
  counties: string[]
}

export interface Employer {
  id: string
  name: string
  region: Region
  counties: string[]
  practiceAreas: PracticeArea[]
  languages: Language[]
  hiresPreBar: boolean
  ruralPlacement: boolean
  description: string
  openRoles: number
  founded: number
}

export interface Role {
  id: string
  employerId: string
  title: string
  practiceArea: PracticeArea
  preBarHire: boolean
  rule942: boolean
  hybrid: boolean
  startDate: string
  hoursPerWeek: number
  county: string
  stipend?: string
}

export interface Match {
  id: string
  employerId: string
  roleId: string
  score: number
  reasons: string[]
  weakSpot?: string
  languageOverlap: Language[]
}

export interface StudentProfile {
  name: string
  school: string
  gradYear: number
  barStatus: 'not-taken' | 'studying' | 'results-pending'
  practiceInterests: PracticeArea[]
  languages: Language[]
  counties: string[]
  needsTransit: boolean
  hasCar: boolean
  eveningsOk: boolean
  hybridOk: boolean
}
