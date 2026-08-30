/**
 * Deterministic matching engine.
 *
 * Weights:
 *   Skills / interests overlap   30%
 *   Practice area match          25%
 *   Language overlap             20%
 *   Geography (county)           15%
 *   Timing / accessibility       10%
 */

const WEIGHTS = {
  skills:      30,
  interests:   25,
  language:    20,
  geography:   15,
  timing:      10,
}

function computeMatchScore(student, role) {
  let breakdown = {}

  // --- Interests / Skills (30 + 25 = combined practice area overlap) ---
  const interestOverlap = student.practiceInterests?.includes(role.practiceArea) ? 1 : 0
  breakdown.skills = Math.round(WEIGHTS.skills * interestOverlap)
  breakdown.interests = Math.round(WEIGHTS.interests * interestOverlap)

  // --- Language (20) ---
  const studentLangs = student.languages || []
  const roleLangs = role.languages || []
  const langOverlap = studentLangs.filter((l) => roleLangs.includes(l))
  const langRatio = roleLangs.length === 0 ? 0.5 : langOverlap.length / roleLangs.length
  breakdown.language = Math.round(WEIGHTS.language * langRatio)

  // --- Geography (15) ---
  const counties = student.counties || []
  const geoMatch = counties.includes(role.county) ? 1 : 0
  breakdown.geography = Math.round(WEIGHTS.geography * geoMatch)

  // --- Timing / accessibility (10) ---
  let timingScore = 0
  if (role.hybrid && student.hybridOk) timingScore += 0.5
  if (!role.preBarHire && student.barStatus !== 'not-taken') timingScore += 0.3
  if (role.preBarHire) timingScore += 0.2
  if (student.needsTransit && !role.hybrid) timingScore -= 0.3
  if (!student.hasCar && !role.hybrid) timingScore -= 0.2
  timingScore = Math.max(0, Math.min(1, timingScore + 0.5))
  breakdown.timing = Math.round(WEIGHTS.timing * timingScore)

  const total = breakdown.skills + breakdown.interests + breakdown.language + breakdown.geography + breakdown.timing

  // Build reasons
  const reasons = []
  if (interestOverlap) {
    reasons.push(`${role.title} aligns with your interest in ${role.practiceArea}.`)
  } else {
    reasons.push(`${role.title} is ${role.practiceArea} work, which is outside your listed interests.`)
  }
  if (geoMatch) {
    reasons.push(`${role.county} is one of your target counties.`)
  } else {
    reasons.push(`${role.county} is not in your chosen counties — this is the main tradeoff.`)
  }
  if (langOverlap.length > 0) {
    reasons.push(`Your ${langOverlap.join(', ')} skills match what this office uses.`)
  }
  if (role.hybrid && student.hybridOk) {
    reasons.push('Hybrid scheduling fits what you told us about your availability.')
  }
  if (role.preBarHire && student.barStatus !== 'not-taken') {
    reasons.push('This role hires before admission, so you can start right away.')
  }

  // Weak spot detection
  let weakSpot
  if (!geoMatch) weakSpot = 'Location'
  else if (!interestOverlap) weakSpot = 'Practice area'
  else if (langOverlap.length === 0 && roleLangs.length > 0) weakSpot = 'Language'

  return {
    roleId: role.id,
    employerId: role.employerId,
    score: Math.min(100, Math.max(0, total)),
    reasons,
    weakSpot,
    languageOverlap: langOverlap,
    breakdown,
  }
}

function computeAllMatches(student, roles) {
  return roles
    .map((role) => computeMatchScore(student, role))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
}

module.exports = { computeMatchScore, computeAllMatches, WEIGHTS }
