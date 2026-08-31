const config = require('../../config')

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const EMPLOYERS = [
  {
    id: 'lafla',
    title: 'Legal Aid Foundation of Los Angeles',
    content: 'Represents low-income Angelenos in housing, public benefits, and consumer matters across six neighborhood offices.',
    slug: 'employer-lafla',
    type: 'employer',
    tags: ['los-angeles', 'housing', 'public-benefits', 'consumer', 'pre-bar-hire', 'spanish', 'tagalog'],
    status: 1,
    metadata: {
      region: 'los-angeles',
      counties: ['Los Angeles'],
      practiceAreas: ['Housing', 'Public benefits', 'Consumer'],
      languages: ['Spanish', 'Tagalog'],
      hiresPreBar: true,
      ruralPlacement: false,
      founded: 1929,
      openRoles: 3,
      latitude: 34.0522,
      longitude: -118.2437,
    },
  },
  {
    id: 'baylegal',
    title: 'Bay Area Legal Aid',
    content: 'A regional legal aid network serving survivors of violence and families facing eviction across seven Bay Area counties.',
    slug: 'employer-baylegal',
    type: 'employer',
    tags: ['bay-area', 'domestic-violence', 'housing', 'public-benefits', 'pre-bar-hire', 'spanish', 'mandarin', 'vietnamese'],
    status: 1,
    metadata: {
      region: 'bay-area',
      counties: ['Alameda', 'San Francisco', 'Contra Costa'],
      practiceAreas: ['Domestic violence', 'Housing', 'Public benefits'],
      languages: ['Spanish', 'Mandarin', 'Vietnamese'],
      hiresPreBar: true,
      ruralPlacement: false,
      founded: 1953,
      openRoles: 2,
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  {
    id: 'cvls',
    title: 'Central Valley Legal Services',
    content: 'A rural generalist practice covering farmworker housing, wage claims, and family law across the San Joaquin Valley.',
    slug: 'employer-cvls',
    type: 'employer',
    tags: ['central-valley', 'rural-generalist', 'housing', 'workers', 'pre-bar-hire', 'spanish', 'hmong', 'rural'],
    status: 1,
    metadata: {
      region: 'central-valley',
      counties: ['San Joaquin', 'Stanislaus'],
      practiceAreas: ['Rural generalist', 'Housing', 'Workers'],
      languages: ['Spanish', 'Hmong'],
      hiresPreBar: true,
      ruralPlacement: true,
      founded: 1968,
      openRoles: 2,
      latitude: 37.9577,
      longitude: -121.2908,
    },
  },
  {
    id: 'nclc-tribal',
    title: 'California Indian Legal Services',
    content: 'Advocates for tribal sovereignty, ICWA compliance, and access to benefits for Native families statewide.',
    slug: 'employer-nclc-tribal',
    type: 'employer',
    tags: ['central-valley', 'tribal', 'public-benefits', 'housing', 'spanish', 'rural'],
    status: 1,
    metadata: {
      region: 'central-valley',
      counties: ['Fresno', 'Kern'],
      practiceAreas: ['Tribal', 'Public benefits', 'Housing'],
      languages: ['Spanish'],
      hiresPreBar: false,
      ruralPlacement: true,
      founded: 1967,
      openRoles: 1,
      latitude: 36.7378,
      longitude: -119.7871,
    },
  },
  {
    id: 'senior-law',
    title: 'Legal Assistance for Seniors',
    content: 'Elder law clinic providing benefits advocacy, guardianship alternatives, and consumer defense.',
    slug: 'employer-senior-law',
    type: 'employer',
    tags: ['bay-area', 'senior-law', 'public-benefits', 'consumer', 'pre-bar-hire', 'mandarin', 'vietnamese'],
    status: 1,
    metadata: {
      region: 'bay-area',
      counties: ['Alameda'],
      practiceAreas: ['Senior law', 'Public benefits', 'Consumer'],
      languages: ['Mandarin', 'Vietnamese'],
      hiresPreBar: true,
      ruralPlacement: false,
      founded: 1978,
      openRoles: 1,
      latitude: 37.8044,
      longitude: -122.2712,
    },
  },
  {
    id: 'immdef',
    title: 'Immigrant Defenders Law Center',
    content: 'Removal defense and affirmative immigration relief for detained and community-based clients.',
    slug: 'employer-immdef',
    type: 'employer',
    tags: ['los-angeles', 'immigration', 'pre-bar-hire', 'spanish'],
    status: 1,
    metadata: {
      region: 'los-angeles',
      counties: ['Los Angeles', 'Orange'],
      practiceAreas: ['Immigration'],
      languages: ['Spanish'],
      hiresPreBar: true,
      ruralPlacement: false,
      founded: 2018,
      openRoles: 2,
      latitude: 33.9425,
      longitude: -118.4081,
    },
  },
  {
    id: 'north-coast',
    title: 'North Coast Rural Justice Project',
    content: 'A storefront office serving three rural counties with a generalist civil practice.',
    slug: 'employer-north-coast',
    type: 'employer',
    tags: ['rural-north', 'rural-generalist', 'housing', 'domestic-violence', 'pre-bar-hire', 'rural'],
    status: 1,
    metadata: {
      region: 'rural-north',
      counties: ['Humboldt', 'Trinity'],
      practiceAreas: ['Rural generalist', 'Housing', 'Domestic violence'],
      languages: [],
      hiresPreBar: true,
      ruralPlacement: true,
      founded: 1974,
      openRoles: 1,
      latitude: 40.745,
      longitude: -124.1926,
    },
  },
  {
    id: 'ielc',
    title: 'Inland Empire Legal Collaborative',
    content: 'Tenant defense and wage-claim representation across the fastest-growing counties in the state.',
    slug: 'employer-ielc',
    type: 'employer',
    tags: ['inland-empire', 'housing', 'workers', 'consumer', 'pre-bar-hire', 'spanish'],
    status: 1,
    metadata: {
      region: 'inland-empire',
      counties: ['Riverside', 'San Bernardino'],
      practiceAreas: ['Housing', 'Workers', 'Consumer'],
      languages: ['Spanish'],
      hiresPreBar: true,
      ruralPlacement: false,
      founded: 1996,
      openRoles: 2,
      latitude: 33.9533,
      longitude: -117.3962,
    },
  },
  {
    id: 'imperial-valley',
    title: 'Imperial Valley Advocates',
    content: 'Cross-border legal aid at the edge of the state, focused on farmworker and immigrant communities.',
    slug: 'employer-imperial-valley',
    type: 'employer',
    tags: ['inland-empire', 'rural-generalist', 'immigration', 'workers', 'pre-bar-hire', 'spanish', 'rural'],
    status: 1,
    metadata: {
      region: 'inland-empire',
      counties: ['Imperial'],
      practiceAreas: ['Rural generalist', 'Immigration', 'Workers'],
      languages: ['Spanish'],
      hiresPreBar: true,
      ruralPlacement: true,
      founded: 1981,
      openRoles: 1,
      latitude: 32.8421,
      longitude: -115.5694,
    },
  },
  {
    id: 'disability-rights-ca',
    title: 'Disability Rights California — Central Coast',
    content: 'Statewide disability rights advocacy with a Central Coast regional office.',
    slug: 'employer-disability-rights-ca',
    type: 'employer',
    tags: ['central-valley', 'disability-rights', 'public-benefits'],
    status: 1,
    metadata: {
      region: 'central-valley',
      counties: ['Kern', 'Merced'],
      practiceAreas: ['Disability rights', 'Public benefits'],
      languages: [],
      hiresPreBar: false,
      ruralPlacement: false,
      founded: 1978,
      openRoles: 1,
      latitude: 35.3733,
      longitude: -119.0187,
    },
  },
  {
    id: 'la-workers',
    title: 'Worker Justice Center of LA',
    content: 'Wage theft and workplace safety representation for low-wage workers across LA County.',
    slug: 'employer-la-workers',
    type: 'employer',
    tags: ['los-angeles', 'workers', 'consumer', 'pre-bar-hire', 'spanish', 'tagalog'],
    status: 1,
    metadata: {
      region: 'los-angeles',
      counties: ['Los Angeles'],
      practiceAreas: ['Workers', 'Consumer'],
      languages: ['Spanish', 'Tagalog'],
      hiresPreBar: true,
      ruralPlacement: false,
      founded: 2004,
      openRoles: 2,
      latitude: 34.0522,
      longitude: -118.2437,
    },
  },
  {
    id: 'shasta-legal',
    title: 'Shasta Rural Legal Aid',
    content: 'The only civil legal aid provider covering three far-northern counties.',
    slug: 'employer-shasta-legal',
    type: 'employer',
    tags: ['rural-north', 'housing', 'rural-generalist', 'senior-law', 'pre-bar-hire', 'rural'],
    status: 1,
    metadata: {
      region: 'rural-north',
      counties: ['Shasta', 'Siskiyou'],
      practiceAreas: ['Housing', 'Rural generalist', 'Senior law'],
      languages: [],
      hiresPreBar: true,
      ruralPlacement: true,
      founded: 1970,
      openRoles: 1,
      latitude: 40.5865,
      longitude: -122.3917,
    },
  },
]

const ROLES = [
  { id: 'r1', title: 'Housing Justice Fellow', content: 'Housing Justice Fellow at Legal Aid Foundation of Los Angeles. Pre-bar hire with Rule 9.42 supervision, hybrid schedule.', slug: 'role-r1', type: 'role', tags: ['lafla', 'housing', 'los-angeles', 'pre-bar', 'rule-942', 'hybrid'], status: 1, metadata: { employerId: 'lafla', practiceArea: 'Housing', preBarHire: true, rule942: true, hybrid: true, startDate: '2026-09-01', hoursPerWeek: 35, county: 'Los Angeles', stipend: '$16,000', latitude: 34.0522, longitude: -118.2437 } },
  { id: 'r2', title: 'Public Benefits Advocate', content: 'Public Benefits Advocate at Legal Aid Foundation of Los Angeles. Full-time position, in-person.', slug: 'role-r2', type: 'role', tags: ['lafla', 'public-benefits', 'los-angeles', 'pre-bar'], status: 1, metadata: { employerId: 'lafla', practiceArea: 'Public benefits', preBarHire: true, rule942: false, hybrid: false, startDate: '2026-08-15', hoursPerWeek: 40, county: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 } },
  { id: 'r3', title: 'DV Survivor Advocate', content: 'DV Survivor Advocate at Bay Area Legal Aid. Pre-bar hire with Rule 9.42 supervision, hybrid schedule.', slug: 'role-r3', type: 'role', tags: ['baylegal', 'domestic-violence', 'alameda', 'pre-bar', 'rule-942', 'hybrid'], status: 1, metadata: { employerId: 'baylegal', practiceArea: 'Domestic violence', preBarHire: true, rule942: true, hybrid: true, startDate: '2026-09-01', hoursPerWeek: 35, county: 'Alameda', stipend: '$16,000', latitude: 37.8044, longitude: -122.2712 } },
  { id: 'r4', title: 'Eviction Defense Fellow', content: 'Eviction Defense Fellow at Bay Area Legal Aid. Pre-bar hire with Rule 9.42 supervision, in-person.', slug: 'role-r4', type: 'role', tags: ['baylegal', 'housing', 'san-francisco', 'pre-bar', 'rule-942'], status: 1, metadata: { employerId: 'baylegal', practiceArea: 'Housing', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-01', hoursPerWeek: 35, county: 'San Francisco', stipend: '$16,000', latitude: 37.7749, longitude: -122.4194 } },
  { id: 'r5', title: 'Farmworker Housing Fellow', content: 'Farmworker Housing Fellow at Central Valley Legal Services. Pre-bar hire with Rule 9.42 supervision, in-person.', slug: 'role-r5', type: 'role', tags: ['cvls', 'rural-generalist', 'san-joaquin', 'pre-bar', 'rule-942', 'rural'], status: 1, metadata: { employerId: 'cvls', practiceArea: 'Rural generalist', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-15', hoursPerWeek: 40, county: 'San Joaquin', stipend: '$15,500', latitude: 37.9577, longitude: -121.2908 } },
  { id: 'r6', title: 'Wage Claims Associate', content: 'Wage Claims Associate at Central Valley Legal Services. Full-time position, in-person.', slug: 'role-r6', type: 'role', tags: ['cvls', 'workers', 'stanislaus', 'pre-bar'], status: 1, metadata: { employerId: 'cvls', practiceArea: 'Workers', preBarHire: true, rule942: false, hybrid: false, startDate: '2026-08-01', hoursPerWeek: 40, county: 'Stanislaus', latitude: 37.6385, longitude: -120.997 } },
  { id: 'r7', title: 'ICWA Staff Attorney', content: 'ICWA Staff Attorney at California Indian Legal Services. Licensed attorney position, hybrid schedule.', slug: 'role-r7', type: 'role', tags: ['nclc-tribal', 'tribal', 'fresno', 'hybrid'], status: 1, metadata: { employerId: 'nclc-tribal', practiceArea: 'Tribal', preBarHire: false, rule942: false, hybrid: true, startDate: '2026-10-01', hoursPerWeek: 40, county: 'Fresno', latitude: 36.7378, longitude: -119.7871 } },
  { id: 'r8', title: 'Elder Benefits Fellow', content: 'Elder Benefits Fellow at Legal Assistance for Seniors. Pre-bar hire with Rule 9.42 supervision, hybrid schedule.', slug: 'role-r8', type: 'role', tags: ['senior-law', 'senior-law', 'alameda', 'pre-bar', 'rule-942', 'hybrid'], status: 1, metadata: { employerId: 'senior-law', practiceArea: 'Senior law', preBarHire: true, rule942: true, hybrid: true, startDate: '2026-09-01', hoursPerWeek: 30, county: 'Alameda', stipend: '$16,000', latitude: 37.8044, longitude: -122.2712 } },
  { id: 'r9', title: 'Removal Defense Fellow', content: 'Removal Defense Fellow at Immigrant Defenders Law Center. Pre-bar hire with Rule 9.42 supervision, in-person.', slug: 'role-r9', type: 'role', tags: ['immdef', 'immigration', 'los-angeles', 'pre-bar', 'rule-942'], status: 1, metadata: { employerId: 'immdef', practiceArea: 'Immigration', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-01', hoursPerWeek: 40, county: 'Los Angeles', stipend: '$16,000', latitude: 34.0522, longitude: -118.2437 } },
  { id: 'r10', title: 'Affirmative Relief Associate', content: 'Affirmative Relief Associate at Immigrant Defenders Law Center. Full-time position, hybrid schedule.', slug: 'role-r10', type: 'role', tags: ['immdef', 'immigration', 'orange', 'pre-bar', 'hybrid'], status: 1, metadata: { employerId: 'immdef', practiceArea: 'Immigration', preBarHire: true, rule942: false, hybrid: true, startDate: '2026-08-15', hoursPerWeek: 40, county: 'Orange', latitude: 33.7175, longitude: -117.8311 } },
  { id: 'r11', title: 'Rural Generalist Fellow', content: 'Rural Generalist Fellow at North Coast Rural Justice Project. Pre-bar hire with Rule 9.42 supervision, in-person.', slug: 'role-r11', type: 'role', tags: ['north-coast', 'rural-generalist', 'humboldt', 'pre-bar', 'rule-942', 'rural'], status: 1, metadata: { employerId: 'north-coast', practiceArea: 'Rural generalist', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-15', hoursPerWeek: 35, county: 'Humboldt', stipend: '$15,000', latitude: 40.745, longitude: -124.1926 } },
  { id: 'r12', title: 'Tenant Defense Fellow', content: 'Tenant Defense Fellow at Inland Empire Legal Collaborative. Pre-bar hire with Rule 9.42 supervision, hybrid schedule.', slug: 'role-r12', type: 'role', tags: ['ielc', 'housing', 'riverside', 'pre-bar', 'rule-942', 'hybrid'], status: 1, metadata: { employerId: 'ielc', practiceArea: 'Housing', preBarHire: true, rule942: true, hybrid: true, startDate: '2026-09-01', hoursPerWeek: 35, county: 'Riverside', stipend: '$16,000', latitude: 33.9533, longitude: -117.3962 } },
  { id: 'r13', title: 'Consumer Protection Associate', content: 'Consumer Protection Associate at Inland Empire Legal Collaborative. Full-time position, hybrid schedule.', slug: 'role-r13', type: 'role', tags: ['ielc', 'consumer', 'san-bernardino', 'pre-bar', 'hybrid'], status: 1, metadata: { employerId: 'ielc', practiceArea: 'Consumer', preBarHire: true, rule942: false, hybrid: true, startDate: '2026-08-01', hoursPerWeek: 40, county: 'San Bernardino', latitude: 34.1083, longitude: -117.2898 } },
  { id: 'r14', title: 'Farmworker Rights Fellow', content: 'Farmworker Rights Fellow at Imperial Valley Advocates. Pre-bar hire with Rule 9.42 supervision, in-person.', slug: 'role-r14', type: 'role', tags: ['imperial-valley', 'rural-generalist', 'imperial', 'pre-bar', 'rule-942', 'rural'], status: 1, metadata: { employerId: 'imperial-valley', practiceArea: 'Rural generalist', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-15', hoursPerWeek: 35, county: 'Imperial', stipend: '$15,000', latitude: 32.8421, longitude: -115.5694 } },
  { id: 'r15', title: 'Disability Rights Advocate', content: 'Disability Rights Advocate at Disability Rights California. Licensed attorney position, hybrid schedule.', slug: 'role-r15', type: 'role', tags: ['disability-rights-ca', 'disability-rights', 'kern', 'hybrid'], status: 1, metadata: { employerId: 'disability-rights-ca', practiceArea: 'Disability rights', preBarHire: false, rule942: false, hybrid: true, startDate: '2026-10-01', hoursPerWeek: 40, county: 'Kern', latitude: 35.3733, longitude: -119.0187 } },
  { id: 'r16', title: 'Wage Theft Fellow', content: 'Wage Theft Fellow at Worker Justice Center of LA. Pre-bar hire with Rule 9.42 supervision, in-person.', slug: 'role-r16', type: 'role', tags: ['la-workers', 'workers', 'los-angeles', 'pre-bar', 'rule-942'], status: 1, metadata: { employerId: 'la-workers', practiceArea: 'Workers', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-01', hoursPerWeek: 35, county: 'Los Angeles', stipend: '$16,000', latitude: 34.0522, longitude: -118.2437 } },
  { id: 'r17', title: 'Workplace Safety Associate', content: 'Workplace Safety Associate at Worker Justice Center of LA. Full-time position, hybrid schedule.', slug: 'role-r17', type: 'role', tags: ['la-workers', 'workers', 'los-angeles', 'pre-bar', 'hybrid'], status: 1, metadata: { employerId: 'la-workers', practiceArea: 'Workers', preBarHire: true, rule942: false, hybrid: true, startDate: '2026-08-15', hoursPerWeek: 40, county: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 } },
  { id: 'r18', title: 'Rural Housing Fellow', content: 'Rural Housing Fellow at Shasta Rural Legal Aid. Pre-bar hire with Rule 9.42 supervision, in-person.', slug: 'role-r18', type: 'role', tags: ['shasta-legal', 'housing', 'shasta', 'pre-bar', 'rule-942', 'rural'], status: 1, metadata: { employerId: 'shasta-legal', practiceArea: 'Housing', preBarHire: true, rule942: true, hybrid: false, startDate: '2026-09-15', hoursPerWeek: 35, county: 'Shasta', stipend: '$15,000', latitude: 40.5865, longitude: -122.3917 } },
]

const RESOURCES = [
  {
    title: 'How to Apply for a Skadden Fellowship',
    content: 'The Skadden Fellowship Foundation funds two-year fellowships for recent law graduates to provide civil legal services to the poor. Applications open each September and require a sponsoring organization. Key steps: identify a host legal aid organization, develop a project proposal, secure a supervisor, and submit by the October deadline. The fellowship provides a salary and benefits for two years.',
    slug: 'resource-skadden-guide',
    type: 'resource',
    tags: ['fellowship', 'skadden', 'application', 'guide', 'featured'],
    status: 1,
    metadata: { category: 'fellowship', featured: true },
  },
  {
    title: 'Equal Justice Works Fellowship: What You Need to Know',
    content: 'Equal Justice Works Fellowships support law graduates working on specific legal issues in underserved communities. Unlike Skadden, EJW fellowships are funded by law firm sponsors. The application process involves matching with a sponsoring law firm and a host organization. Fellowships last two years and include salary, benefits, and loan repayment assistance.',
    slug: 'resource-ejw-guide',
    type: 'resource',
    tags: ['fellowship', 'equal-justice-works', 'application', 'guide', 'featured'],
    status: 1,
    metadata: { category: 'fellowship', featured: true },
  },
  {
    title: 'Rule 9.42: Practicing Law Before Bar Results',
    content: 'California Rule 9.42 allows certified law students to appear in court and provide legal services under attorney supervision before passing the bar exam. To qualify, you must have completed your legal education, be awaiting bar results, and work under the supervision of a licensed attorney. Many legal aid organizations in California hire under Rule 9.42, allowing you to start your career months before your bar results arrive.',
    slug: 'resource-rule-942',
    type: 'resource',
    tags: ['rule-942', 'pre-bar', 'practice', 'california', 'featured'],
    status: 1,
    metadata: { category: 'career', featured: true },
  },
  {
    title: 'Bridge Fellowships: The Gap Between Graduation and Bar Results',
    content: 'Bridge fellowships fill the 4-6 month gap between law school graduation and bar exam results. Programs like the Borchard Foundation on Law and Aging, the Immigrant Legal Resource Center fellowship, and individual legal aid organization bridge positions provide salary and supervision during this period. These are shorter than traditional fellowships but provide critical early-career experience.',
    slug: 'resource-bridge-fellowships',
    type: 'resource',
    tags: ['fellowship', 'bridge', 'pre-bar', 'career'],
    status: 1,
    metadata: { category: 'fellowship', featured: false },
  },
  {
    title: 'California Bar Exam Preparation Timeline',
    content: 'The California Bar Exam is administered in February and July each year. Most graduates take the July exam after spring graduation. Key milestones: register by the deadline (typically March for July, October for February), complete the Moral Character application, study for 8-10 weeks full-time, and await results (typically released in November for July, May for February). Many legal aid employers allow fellows to take study leave before the exam.',
    slug: 'resource-bar-prep-timeline',
    type: 'resource',
    tags: ['bar-exam', 'timeline', 'preparation', 'california'],
    status: 1,
    metadata: { category: 'bar-prep', featured: false },
  },
  {
    title: 'Rural Legal Aid: Why It Matters and How to Get There',
    content: 'Rural California faces a severe access-to-justice gap. Many counties have zero legal aid attorneys per 10,000 low-income residents. Rural placements offer unique benefits: generalist practice (you will handle housing, family, benefits, and consumer cases), faster professional growth, housing stipends, and loan repayment assistance through programs like LRAP. Organizations like North Coast Rural Justice Project and Shasta Rural Legal Aid actively recruit new attorneys willing to relocate.',
    slug: 'resource-rural-legal-aid',
    type: 'resource',
    tags: ['rural', 'placement', 'career', 'featured'],
    status: 1,
    metadata: { category: 'career', featured: true },
  },
  {
    title: 'Career Services Toolkit: Promoting Legal Aid to Your Students',
    content: 'This toolkit helps career services offices promote legal aid careers to law students. Includes talking points for counseling sessions, sample email templates for student outreach, data on legal aid hiring trends, and information about the LAAC Pipeline matching tool. Partner schools receive this toolkit along with aggregated placement reports each semester.',
    slug: 'resource-career-services-toolkit',
    type: 'resource',
    tags: ['career-services', 'toolkit', 'schools', 'outreach'],
    status: 1,
    metadata: { category: 'schools', featured: false },
  },
  {
    title: 'Loan Repayment Assistance Programs for Legal Aid Attorneys',
    content: 'Several programs help legal aid attorneys manage student debt: the federal Public Service Loan Forgiveness (PSLF) program forgives remaining balance after 120 qualifying payments. California\'s LRAP provides additional assistance. Many individual legal aid organizations offer their own loan repayment stipends. Combined, these programs can significantly reduce the financial burden of a legal aid career.',
    slug: 'resource-loan-repayment',
    type: 'resource',
    tags: ['loan-repayment', 'pslf', 'financial', 'career'],
    status: 1,
    metadata: { category: 'career', featured: false },
  },
]

const DEMO_USERS = [
  { email: 'demo@lawschool.edu', password: 'demo123', firstName: 'Maya', lastName: 'Ruiz', persona: 'student' },
  { email: 'hr@baylegal.org', password: 'demo123', firstName: 'Sarah', lastName: 'Chen', persona: 'employer' },
  { email: 'admin@laac.org', password: 'demo123', firstName: 'Admin', lastName: 'LAAC', persona: 'admin' },
]

const DEMO_STUDENT_PREFS = {
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

async function seed(store) {
  const seeded = await store.get('pipeline-seeded')
  if (seeded) return { skipped: true }

  const results = { employers: 0, roles: 0, resources: 0, users: 0 }

  // Register demo users (reset password if already exists)
  for (const user of DEMO_USERS) {
    try {
      const registered = await store.registerUser(user.email, user.password, user.firstName, user.lastName)
      if (registered) {
        await store.set(`user-${slugify(user.email)}-profile`, {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          persona: user.persona,
          createdAt: new Date().toISOString(),
        })
        results.users++
      }
    } catch (err) {
      // User already exists — reset password so demo credentials always work
      console.log(`[Seed] User ${user.email}: ${err.message} — resetting password`)
      try {
        await store.resetUserPassword(user.email, user.password)
        console.log(`[Seed] Password reset for ${user.email}`)
      } catch (resetErr) {
        console.log(`[Seed] Password reset failed for ${user.email}: ${resetErr.message}`)
      }
    }
  }

  // Seed demo student preferences
  await store.set(`user-${slugify('demo@lawschool.edu')}-preferences`, DEMO_STUDENT_PREFS)

  // Seed employers as /content
  for (const emp of EMPLOYERS) {
    try {
      await store.createContent(emp.type, emp.title, emp.content, emp.tags, emp.metadata)
      results.employers++
    } catch (err) {
      console.log(`[Seed] Employer ${emp.id}: ${err.message}`)
    }
  }

  // Seed roles as /content
  for (const role of ROLES) {
    try {
      await store.createContent(role.type, role.title, role.content, role.tags, role.metadata)
      results.roles++
    } catch (err) {
      console.log(`[Seed] Role ${role.id}: ${err.message}`)
    }
  }

  // Seed resources as /content
  for (const res of RESOURCES) {
    try {
      await store.createContent(res.type, res.title, res.content, res.tags, res.metadata)
      results.resources++
    } catch (err) {
      console.log(`[Seed] Resource ${res.slug}: ${err.message}`)
    }
  }

  // Store reference lists in app-data for O(1) lookup
  await store.set('pipeline-employers-registry', EMPLOYERS.map((e) => e.id))
  await store.set('pipeline-roles-registry', ROLES.map((r) => r.id))
  await store.set('pipeline-resources-registry', RESOURCES.map((r) => r.slug))
  await store.set('pipeline-user-registry', DEMO_USERS.map((u) => u.email))

  // Set seeded flag
  await store.set('pipeline-seeded', true)

  return { skipped: false, ...results }
}

module.exports = { seed, EMPLOYERS, ROLES, RESOURCES, DEMO_USERS }
