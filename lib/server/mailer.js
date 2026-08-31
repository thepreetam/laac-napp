const config = require('../../config')
const axios = require('axios')

const mailClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.DEVELOPER_TOKEN}`,
  },
})

async function sendEmail(to, subject, html, fromName) {
  if (!config.DEVELOPER_TOKEN) {
    console.log('[Mailer] No developer token — skipping email to', to)
    return null
  }

  try {
    const { data } = await mailClient.post('/developers/mail', {
      to,
      subject,
      html,
      from_name: fromName || 'LAAC Pipeline',
    })
    return data
  } catch (err) {
    console.error('[Mailer] Failed to send email:', err.message)
    return null
  }
}

async function sendWelcomeEmail(to, name) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #F7F3EB;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 24px; color: #12161C; margin: 0;">Welcome to LAAC Pipeline</h1>
      </div>
      <div style="background: #FBF8F2; border: 1px solid #D9D1C3; border-radius: 6px; padding: 24px;">
        <p style="color: #3A4250; line-height: 1.6; margin: 0 0 16px;">Hi ${name || 'there'},</p>
        <p style="color: #3A4250; line-height: 1.6; margin: 0 0 16px;">
          Welcome to LAAC Pipeline — the New Attorney Pipeline Project connecting California law students and recent graduates to legal aid organizations.
        </p>
        <p style="color: #3A4250; line-height: 1.6; margin: 0 0 16px;">
          Complete your profile to get matched with fellowships, pre-bar hires, and rural placements across California.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://laac-pipeline.machaao.com/onboarding/student" style="display: inline-block; background: #0F4C5C; color: #F7F3EB; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Complete your profile</a>
        </div>
      </div>
      <p style="color: #3A4250; font-size: 13px; text-align: center; margin-top: 24px;">
        LAAC does not employ fellows. We facilitate matches between students and independent legal aid organizations.
      </p>
    </div>
  `
  return sendEmail(to, 'Welcome to LAAC Pipeline', html, 'LAAC Pipeline')
}

async function sendApplicationConfirmation(to, name, roleName, employerName) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #F7F3EB;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 24px; color: #12161C; margin: 0;">Application Submitted</h1>
      </div>
      <div style="background: #FBF8F2; border: 1px solid #D9D1C3; border-radius: 6px; padding: 24px;">
        <p style="color: #3A4250; line-height: 1.6; margin: 0 0 16px;">Hi ${name || 'there'},</p>
        <p style="color: #3A4250; line-height: 1.6; margin: 0 0 16px;">
          Your application for <strong>${roleName}</strong> at <strong>${employerName}</strong> has been submitted.
        </p>
        <p style="color: #3A4250; line-height: 1.6; margin: 0 0 16px;">
          The employer will review your profile and reach out if they would like to move forward. You can track the status of your applications in your dashboard.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://laac-pipeline.machaao.com/app/applications" style="display: inline-block; background: #0F4C5C; color: #F7F3EB; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View applications</a>
        </div>
      </div>
    </div>
  `
  return sendEmail(to, `Application submitted: ${roleName}`, html, 'LAAC Pipeline')
}

async function sendEmployerNotification(to, employerName, studentName, roleName) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #F7F3EB;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 24px; color: #12161C; margin: 0;">New Application Received</h1>
      </div>
      <div style="background: #FBF8F2; border: 1px solid #D9D1C3; border-radius: 6px; padding: 24px;">
        <p style="color: #3A4250; line-height: 1.6; margin: 0 0 16px;">Hello ${employerName},</p>
        <p style="color: #3A4250; line-height: 1.6; margin: 0 0 16px;">
          <strong>${studentName}</strong> has applied for your <strong>${roleName}</strong> position through LAAC Pipeline.
        </p>
        <p style="color: #3A4250; line-height: 1.6; margin: 0 0 16px;">
          Log in to your employer dashboard to review their profile and match details.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://laac-pipeline.machaao.com/employers/dashboard" style="display: inline-block; background: #0F4C5C; color: #F7F3EB; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View dashboard</a>
        </div>
      </div>
    </div>
  `
  return sendEmail(to, `New application: ${studentName} for ${roleName}`, html, 'LAAC Pipeline')
}

module.exports = { sendEmail, sendWelcomeEmail, sendApplicationConfirmation, sendEmployerNotification }
