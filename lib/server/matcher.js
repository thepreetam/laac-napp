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

const COUNTY_COORDINATES = {
  'Alameda': { lat: 37.8044, lon: -122.2712 },
  'San Francisco': { lat: 37.7749, lon: -122.4194 },
  'San Mateo': { lat: 37.563, lon: -122.3255 },
  'Contra Costa': { lat: 37.9535, lon: -122.0561 },
  'Santa Clara': { lat: 37.3541, lon: -121.9552 },
  'San Joaquin': { lat: 37.9577, lon: -121.2908 },
  'Stanislaus': { lat: 37.6385, lon: -120.997 },
  'Fresno': { lat: 36.7378, lon: -119.7871 },
  'Kern': { lat: 35.3733, lon: -119.0187 },
  'Merced': { lat: 37.3022, lon: -120.483 },
  'Los Angeles': { lat: 34.0522, lon: -118.2437 },
  'Orange': { lat: 33.7175, lon: -117.8311 },
  'Ventura': { lat: 34.2746, lon: -119.229 },
  'Riverside': { lat: 33.9533, lon: -117.3962 },
  'San Bernardino': { lat: 34.1083, lon: -117.2898 },
  'Imperial': { lat: 32.8421, lon: -115.5694 },
  'San Diego': { lat: 32.7157, lon: -117.1611 },
  'Humboldt': { lat: 40.745, lon: -124.1926 },
  'Shasta': { lat: 40.5865, lon: -122.3917 },
  'Siskiyou': { lat: 41.5918, lon: -122.6286 },
  'Trinity': { lat: 40.6524, lon: -123.1164 },
  'Del Norte': { lat: 41.7558, lon: -124.2026 },
  'Sacramento': { lat: 38.5816, lon: -121.4944 },
  'Yolo': { lat: 38.6785, lon: -121.7733 },
  'Santa Barbara': { lat: 34.4208, lon: -119.6982 },
  'San Luis Obispo': { lat: 35.2828, lon: -120.6596 },
  'Monterey': { lat: 36.6002, lon: -121.8947 },
  'Santa Cruz': { lat: 36.9741, lon: -122.0308 },
  'Marin': { lat: 38.0834, lon: -122.7633 },
  'Napa': { lat: 38.2975, lon: -122.2869 },
  'Sonoma': { lat: 38.2919, lon: -122.458 },
  'Solano': { lat: 38.2494, lon: -121.94 },
  'Placer': { lat: 38.8916, lon: -121.0769 },
  'El Dorado': { lat: 38.7296, lon: -120.5294 },
  'Nevada': { lat: 39.261, lon: -121.0036 },
  'Butte': { lat: 39.6607, lon: -121.5773 },
  'Tehama': { lat: 40.0304, lon: -122.2361 },
  'Mendocino': { lat: 39.3085, lon: -123.8053 },
  'Lake': { lat: 39.0035, lon: -122.8453 },
  'Lassen': { lat: 40.5865, lon: -120.6572 },
  'Modoc': { lat: 41.5599, lon: -120.9522 },
  'Plumas': { lat: 39.9391, lon: -120.8361 },
  'Tulare': { lat: 36.2077, lon: -119.3473 },
  'Kings': { lat: 36.0733, lon: -119.8135 },
  'Madera': { lat: 37.0216, lon: -119.9621 },
  'Mariposa': { lat: 37.4849, lon: -119.9663 },
  'Inyo': { lat: 36.6063, lon: -117.3723 },
  'Mono': { lat: 37.9344, lon: -118.9532 },
  'Alpine': { lat: 38.5963, lon: -119.8002 },
  'Amador': { lat: 38.4468, lon: -120.653 },
  'Calaveras': { lat: 38.1963, lon: -120.5622 },
  'Tuolumne': { lat: 37.9627, lon: -119.9454 },
  'Colusa': { lat: 39.2144, lon: -122.0097 },
  'Glenn': { lat: 39.5941, lon: -122.3925 },
  'Sutter': { lat: 39.0338, lon: -121.6936 },
  'Yuba': { lat: 39.2538, lon: -121.3847 },
  'Sierra': { lat: 39.5766, lon: -120.5224 },
  'San Benito': { lat: 36.8433, lon: -121.1333 },
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3959
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
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

  let distance = null
  const roleLat = role.latitude || role.metadata?.latitude
  const roleLon = role.longitude || role.metadata?.longitude
  if (roleLat && roleLon) {
    const studentCounty = (student.counties && student.counties[0]) || ''
    const coords = COUNTY_COORDINATES[studentCounty]
    if (coords) {
      distance = haversineDistance(coords.lat, coords.lon, roleLat, roleLon)
    }
  }

  return {
    id: `${role.employerId}-${role.id}`,
    roleId: role.id,
    employerId: role.employerId,
    role,
    score: Math.min(100, Math.max(0, total)),
    reasons,
    weakSpot,
    languageOverlap: langOverlap,
    breakdown,
    distance,
  }
}

function computeAllMatches(student, roles) {
  return roles
    .map((role) => computeMatchScore(student, role))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
}

module.exports = { computeMatchScore, computeAllMatches, WEIGHTS }
