import type { Employer, Match, Region, RegionInfo, Role, StudentProfile } from './types'

export const regions: RegionInfo[] = [
  {
    id: 'bay-area',
    name: 'Bay Area',
    short: 'Bay',
    counties: ['Alameda', 'San Francisco', 'San Mateo', 'Contra Costa', 'Santa Clara'],
  },
  {
    id: 'central-valley',
    name: 'Central Valley',
    short: 'Valley',
    counties: ['San Joaquin', 'Fresno', 'Kern', 'Stanislaus', 'Merced'],
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    short: 'LA',
    counties: ['Los Angeles', 'Ventura', 'Orange'],
  },
  {
    id: 'rural-north',
    name: 'Rural North',
    short: 'North',
    counties: ['Humboldt', 'Shasta', 'Del Norte', 'Trinity', 'Siskiyou'],
  },
  {
    id: 'inland-empire',
    name: 'Inland Empire / Imperial',
    short: 'Inland',
    counties: ['Riverside', 'San Bernardino', 'Imperial'],
  },
]

export const employers: Employer[] = [
  {
    id: 'lafla',
    name: 'Legal Aid Foundation of Los Angeles',
    region: 'los-angeles',
    counties: ['Los Angeles'],
    practiceAreas: ['Housing', 'Public benefits', 'Consumer'],
    languages: ['Spanish', 'Tagalog'],
    hiresPreBar: true,
    ruralPlacement: false,
    description:
      'Represents low-income Angelenos in housing, public benefits, and consumer matters across six neighborhood offices.',
    openRoles: 3,
    founded: 1929,
  },
  {
    id: 'baylegal',
    name: 'Bay Area Legal Aid',
    region: 'bay-area',
    counties: ['Alameda', 'San Francisco', 'Contra Costa'],
    practiceAreas: ['Domestic violence', 'Housing', 'Public benefits'],
    languages: ['Spanish', 'Mandarin', 'Vietnamese'],
    hiresPreBar: true,
    ruralPlacement: false,
    description:
      'A regional legal aid network serving survivors of violence and families facing eviction across seven Bay Area counties.',
    openRoles: 2,
    founded: 1953,
  },
  {
    id: 'cvls',
    name: 'Central Valley Legal Services',
    region: 'central-valley',
    counties: ['San Joaquin', 'Stanislaus'],
    practiceAreas: ['Rural generalist', 'Housing', 'Workers'],
    languages: ['Spanish', 'Hmong'],
    hiresPreBar: true,
    ruralPlacement: true,
    description:
      'A rural generalist practice covering farmworker housing, wage claims, and family law across the San Joaquin Valley.',
    openRoles: 2,
    founded: 1968,
  },
  {
    id: 'nclc-tribal',
    name: 'California Indian Legal Services',
    region: 'central-valley',
    counties: ['Fresno', 'Kern'],
    practiceAreas: ['Tribal', 'Public benefits', 'Housing'],
    languages: ['Spanish'],
    hiresPreBar: false,
    ruralPlacement: true,
    description:
      'Advocates for tribal sovereignty, ICWA compliance, and access to benefits for Native families statewide.',
    openRoles: 1,
    founded: 1967,
  },
  {
    id: 'senior-law',
    name: 'Legal Assistance for Seniors',
    region: 'bay-area',
    counties: ['Alameda'],
    practiceAreas: ['Senior law', 'Public benefits', 'Consumer'],
    languages: ['Mandarin', 'Vietnamese'],
    hiresPreBar: true,
    ruralPlacement: false,
    description: 'Elder law clinic providing benefits advocacy, guardianship alternatives, and consumer defense.',
    openRoles: 1,
    founded: 1978,
  },
  {
    id: 'immdef',
    name: 'Immigrant Defenders Law Center',
    region: 'los-angeles',
    counties: ['Los Angeles', 'Orange'],
    practiceAreas: ['Immigration'],
    languages: ['Spanish'],
    hiresPreBar: true,
    ruralPlacement: false,
    description: 'Removal defense and affirmative immigration relief for detained and community-based clients.',
    openRoles: 2,
    founded: 2018,
  },
  {
    id: 'north-coast',
    name: 'North Coast Rural Justice Project',
    region: 'rural-north',
    counties: ['Humboldt', 'Trinity'],
    practiceAreas: ['Rural generalist', 'Housing', 'Domestic violence'],
    languages: [],
    hiresPreBar: true,
    ruralPlacement: true,
    description: 'A storefront office serving three rural counties with a generalist civil practice.',
    openRoles: 1,
    founded: 1974,
  },
  {
    id: 'ielc',
    name: 'Inland Empire Legal Collaborative',
    region: 'inland-empire',
    counties: ['Riverside', 'San Bernardino'],
    practiceAreas: ['Housing', 'Workers', 'Consumer'],
    languages: ['Spanish'],
    hiresPreBar: true,
    ruralPlacement: false,
    description: 'Tenant defense and wage-claim representation across the fastest-growing counties in the state.',
    openRoles: 2,
    founded: 1996,
  },
  {
    id: 'imperial-valley',
    name: 'Imperial Valley Advocates',
    region: 'inland-empire',
    counties: ['Imperial'],
    practiceAreas: ['Rural generalist', 'Immigration', 'Workers'],
    languages: ['Spanish'],
    hiresPreBar: true,
    ruralPlacement: true,
    description: 'Cross-border legal aid at the edge of the state, focused on farmworker and immigrant communities.',
    openRoles: 1,
    founded: 1981,
  },
  {
    id: 'disability-rights-ca',
    name: 'Disability Rights California — Central Coast',
    region: 'central-valley',
    counties: ['Kern', 'Merced'],
    practiceAreas: ['Disability rights', 'Public benefits'],
    languages: [],
    hiresPreBar: false,
    ruralPlacement: false,
    description: 'Statewide disability rights advocacy with a Central Coast regional office.',
    openRoles: 1,
    founded: 1978,
  },
  {
    id: 'la-workers',
    name: 'Worker Justice Center of LA',
    region: 'los-angeles',
    counties: ['Los Angeles'],
    practiceAreas: ['Workers', 'Consumer'],
    languages: ['Spanish', 'Tagalog'],
    hiresPreBar: true,
    ruralPlacement: false,
    description: 'Wage theft and workplace safety representation for low-wage workers across LA County.',
    openRoles: 2,
    founded: 2004,
  },
  {
    id: 'shasta-legal',
    name: 'Shasta Rural Legal Aid',
    region: 'rural-north',
    counties: ['Shasta', 'Siskiyou'],
    practiceAreas: ['Housing', 'Rural generalist', 'Senior law'],
    languages: [],
    hiresPreBar: true,
    ruralPlacement: true,
    description: 'The only civil legal aid provider covering three far-northern counties.',
    openRoles: 1,
    founded: 1970,
  },
]

export const roles: Role[] = [
  { id: 'r1', employerId: 'lafla', title: 'Housing Justice Fellow', practiceArea: 'Housing', preBarHire: true, rule942: true, hybrid: true, startDate: '2026-09-01', hoursPerWeek: 35, county: 'Los Angeles', stipend: '$16,000' },
  { id: 'r2', employerId: 'lafla', title: 'Public Benefits Advocate', practiceArea: 'Public benefits', preBarHire: true, rule942: false, hybrid: false, startDate: '2026-08-15', hoursPerWeek: 40, county: 'Los Angeles' },
  { id: 'r3', employerId: 'baylegal', title: 'DV Survivor Advocate', practiceArea: 'Domestic violence', preBarHire: true, rule942: true, hybrid: true, startDate: '2026-09-01', hoursPerWeek: 35, county: 'Alameda', stipend: '$16,000' },
  { id: 'r4', employerId: 'baylegal', title: 'Eviction Defense Fellow', practiceArea: 'Housing', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-01', hoursPerWeek: 35, county: 'San Francisco', stipend: '$16,000' },
  { id: 'r5', employerId: 'cvls', title: 'Farmworker Housing Fellow', practiceArea: 'Rural generalist', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-15', hoursPerWeek: 40, county: 'San Joaquin', stipend: '$15,500' },
  { id: 'r6', employerId: 'cvls', title: 'Wage Claims Associate', practiceArea: 'Workers', preBarHire: true, rule942: false, hybrid: false, startDate: '2026-08-01', hoursPerWeek: 40, county: 'Stanislaus' },
  { id: 'r7', employerId: 'nclc-tribal', title: 'ICWA Staff Attorney', practiceArea: 'Tribal', preBarHire: false, rule942: false, hybrid: true, startDate: '2026-10-01', hoursPerWeek: 40, county: 'Fresno' },
  { id: 'r8', employerId: 'senior-law', title: 'Elder Benefits Fellow', practiceArea: 'Senior law', preBarHire: true, rule942: true, hybrid: true, startDate: '2026-09-01', hoursPerWeek: 30, county: 'Alameda', stipend: '$16,000' },
  { id: 'r9', employerId: 'immdef', title: 'Removal Defense Fellow', practiceArea: 'Immigration', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-01', hoursPerWeek: 40, county: 'Los Angeles', stipend: '$16,000' },
  { id: 'r10', employerId: 'immdef', title: 'Affirmative Relief Associate', practiceArea: 'Immigration', preBarHire: true, rule942: false, hybrid: true, startDate: '2026-08-15', hoursPerWeek: 40, county: 'Orange' },
  { id: 'r11', employerId: 'north-coast', title: 'Rural Generalist Fellow', practiceArea: 'Rural generalist', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-15', hoursPerWeek: 35, county: 'Humboldt', stipend: '$15,000' },
  { id: 'r12', employerId: 'ielc', title: 'Tenant Defense Fellow', practiceArea: 'Housing', preBarHire: true, rule942: true, hybrid: true, startDate: '2026-09-01', hoursPerWeek: 35, county: 'Riverside', stipend: '$16,000' },
  { id: 'r13', employerId: 'ielc', title: 'Consumer Protection Associate', practiceArea: 'Consumer', preBarHire: true, rule942: false, hybrid: true, startDate: '2026-08-01', hoursPerWeek: 40, county: 'San Bernardino' },
  { id: 'r14', employerId: 'imperial-valley', title: 'Farmworker Rights Fellow', practiceArea: 'Rural generalist', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-15', hoursPerWeek: 35, county: 'Imperial', stipend: '$15,000' },
  { id: 'r15', employerId: 'disability-rights-ca', title: 'Disability Rights Advocate', practiceArea: 'Disability rights', preBarHire: false, rule942: false, hybrid: true, startDate: '2026-10-01', hoursPerWeek: 40, county: 'Kern' },
  { id: 'r16', employerId: 'la-workers', title: 'Wage Theft Fellow', practiceArea: 'Workers', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-01', hoursPerWeek: 35, county: 'Los Angeles', stipend: '$16,000' },
  { id: 'r17', employerId: 'la-workers', title: 'Workplace Safety Associate', practiceArea: 'Workers', preBarHire: true, rule942: false, hybrid: true, startDate: '2026-08-15', hoursPerWeek: 40, county: 'Los Angeles' },
  { id: 'r18', employerId: 'shasta-legal', title: 'Rural Housing Fellow', practiceArea: 'Housing', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-15', hoursPerWeek: 35, county: 'Shasta', stipend: '$15,000' },
]

export const sampleStudent: StudentProfile = {
  name: 'Maya R.',
  school: 'UC Law SF',
  gradYear: 2026,
  barStatus: 'studying',
  practiceInterests: ['Housing', 'Domestic violence'],
  languages: ['Spanish'],
  counties: ['Alameda', 'San Francisco', 'San Joaquin'],
  needsTransit: true,
  hasCar: false,
  eveningsOk: true,
  hybridOk: true,
}

export const matches: Match[] = [
  {
    id: 'm1',
    employerId: 'baylegal',
    roleId: 'r4',
    score: 94,
    reasons: [
      'This match is strong on housing and Spanish.',
      'Eviction Defense Fellow sits in San Francisco — one of your three counties.',
      'The role is transit-accessible and offers hybrid days, which fits what you told us about getting around.',
    ],
    languageOverlap: ['Spanish'],
  },
  {
    id: 'm2',
    employerId: 'baylegal',
    roleId: 'r3',
    score: 81,
    reasons: [
      'DV Survivor Advocate is a close match on domestic violence, your second interest.',
      'Alameda is on your list, and the office is reachable without a car.',
      'Hybrid scheduling and evening flexibility line up with your availability.',
    ],
    languageOverlap: ['Spanish'],
  },
  {
    id: 'm3',
    employerId: 'lafla',
    roleId: 'r1',
    score: 73,
    reasons: [
      'Housing Justice Fellow matches your top practice interest directly.',
      'It is hybrid and offers Rule 9.42 supervision, so you could start before your results come back.',
      'Los Angeles is outside your three counties, which is the main tradeoff here.',
    ],
    weakSpot: 'Location',
    languageOverlap: [],
  },
  {
    id: 'm4',
    employerId: 'cvls',
    roleId: 'r5',
    score: 61,
    reasons: [
      'Farmworker Housing Fellow touches housing, but the caseload leans rural generalist rather than eviction defense.',
      'San Joaquin is one of the counties you listed.',
      'The role is in-person only, which may be harder without a car.',
    ],
    weakSpot: 'Work style',
    languageOverlap: ['Spanish'],
  },
  {
    id: 'm5',
    employerId: 'senior-law',
    roleId: 'r8',
    score: 44,
    reasons: [
      'Elder Benefits Fellow is only loosely connected to housing through benefits advocacy.',
      'Alameda fits your counties, and the schedule is hybrid with fewer hours per week.',
      'Spanish is spoken at the office, but the caseload does not draw on it heavily.',
    ],
    weakSpot: 'Practice area',
    languageOverlap: [],
  },
  {
    id: 'm6',
    employerId: 'immdef',
    roleId: 'r9',
    score: 29,
    reasons: [
      'Removal Defense Fellow is immigration work, outside both of your listed interests.',
      'Los Angeles is not one of your three counties and the role is in-person only.',
      'Spanish overlaps, but that is the only strong point of alignment here.',
    ],
    weakSpot: 'Practice area & location',
    languageOverlap: ['Spanish'],
  },
]

export function getEmployer(id: string) {
  return employers.find((e) => e.id === id)
}

export function getRole(id: string) {
  return roles.find((r) => r.id === id)
}

export function getRegion(id: Region) {
  return regions.find((r) => r.id === id)
}

export function rolesForEmployer(employerId: string) {
  return roles.filter((r) => r.employerId === employerId)
}

export const fellowshipTimeline = [
  { label: 'Info sessions', date: 'Sep 2026', detail: 'Statewide webinars introducing the 2026–27 fellowship cycle.' },
  { label: 'Applications open', date: 'Oct 2026', detail: 'Students submit interests, skills, and county preferences.' },
  { label: 'Matching', date: 'Jan 2027', detail: 'LAAC facilitates introductions between fellows and host organizations.' },
  { label: 'Offers extended', date: 'Feb 2027', detail: 'Host legal aid organizations extend fellowship offers.' },
  { label: 'Bar exam blackout', date: 'Jul 2027', detail: 'Fellows pause active casework to sit for the California Bar.' },
  { label: 'Return to host', date: 'Aug 2027', detail: 'Fellows resume full casework, often transitioning to staff roles.' },
]

export const fellowshipSampleTerms = {
  stipend: '$16,000',
  hours: '~400 hours',
  duration: '6 months',
  hostOverhead: '$1,500',
}
