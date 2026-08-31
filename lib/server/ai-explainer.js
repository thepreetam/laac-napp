const config = require('../../config')

async function explainMatch(student, role, employer, match) {
  if (!config.OPENROUTER_API_KEY) {
    return null
  }

  const prompt = `You are a career counselor at a California legal aid organization. A law student is looking at a role and you need to explain why this is a good (or partial) match.

Student profile:
- Name: ${student.name || 'Student'}
- School: ${student.school || 'Unknown'}
- Graduation year: ${student.gradYear || 'Unknown'}
- Bar status: ${student.barStatus || 'Unknown'}
- Practice interests: ${(student.practiceInterests || []).join(', ') || 'None listed'}
- Languages: ${(student.languages || []).join(', ') || 'English only'}
- Target counties: ${(student.counties || []).join(', ') || 'None listed'}
- Has car: ${student.hasCar ? 'Yes' : 'No'}
- Needs transit: ${student.needsTransit ? 'Yes' : 'No'}
- Hybrid OK: ${student.hybridOk ? 'Yes' : 'No'}

Role details:
- Title: ${role.title || 'Unknown'}
- Employer: ${employer?.name || role.employerId || 'Unknown'}
- Practice area: ${role.practiceArea || 'Unknown'}
- County: ${role.county || 'Unknown'}
- Pre-bar hire: ${role.preBarHire ? 'Yes' : 'No'}
- Rule 9.42: ${role.rule942 ? 'Yes' : 'No'}
- Hybrid: ${role.hybrid ? 'Yes' : 'No'}
- Stipend: ${role.stipend || 'Not specified'}

Match analysis:
- Overall score: ${match.score}/100
- Skills/interests: ${match.breakdown?.skills || 0}/30
- Practice area: ${match.breakdown?.interests || 0}/25
- Language: ${match.breakdown?.language || 0}/20
- Geography: ${match.breakdown?.geography || 0}/15
- Timing: ${match.breakdown?.timing || 0}/10
${match.weakSpot ? `- Weak spot: ${match.weakSpot}` : ''}

Write a 2-3 paragraph explanation in a warm, encouraging but honest tone. Be specific about what makes this a strong or partial match. If there are tradeoffs, explain them clearly. Do not use bullet points. Write as if you are speaking directly to the student.`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-haiku',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    return data?.choices?.[0]?.message?.content || null
  } catch (err) {
    console.error('[AI Explainer]', err.message)
    return null
  }
}

module.exports = { explainMatch }
