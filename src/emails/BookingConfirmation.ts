interface BookingConfirmationEmailProps {
  booking_id: string
  name: string
  email: string
  phone: string
  visit_date: string
  visit_time: string
  visitor_count: number
  booking_date: string
}

export const BookingConfirmationEmail = ({
  booking_id = 'BK-001',
  name = 'John Doe',
  email = 'john@example.com',
  phone = '+94771234567',
  visit_date = '2025-12-25',
  visit_time = '10:00 AM',
  visitor_count = 5,
  booking_date = '2025-12-23',
}: BookingConfirmationEmailProps) => {
  const formattedDate = new Date(visit_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formattedBookingDate = new Date(booking_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Project colors based on your shadcn/ui theme
  const colors = {
    primary: '#1e293b', // slate-800
    primaryLight: '#334155', // slate-700
    primaryDark: '#0f172a', // slate-900
    accent: '#3b82f6', // blue-500
    accentLight: '#60a5fa', // blue-400
    accentDark: '#2563eb', // blue-600
    success: '#16a34a', // green-600
    warning: '#f59e0b', // amber-500
    danger: '#dc2626', // red-600
    text: '#1e293b', // slate-800
    textLight: '#64748b', // slate-500
    textMuted: '#94a3b8', // slate-400
    background: '#f8fafc', // slate-50
    backgroundAlt: '#f1f5f9', // slate-100
    white: '#ffffff',
    border: '#e2e8f0', // slate-200
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - ${booking_id}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${colors.background};">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${colors.background}; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: ${colors.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: ${colors.white}; font-size: 28px; font-weight: bold; letter-spacing: 0.5px;">
                      SEWANAGALA SUGAR FACTORY
                    </h1>
                    <p style="margin: 10px 0 0 0; color: ${colors.white}; font-size: 16px; opacity: 0.95;">
                      Tour Booking Confirmation
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    
                    <!-- Greeting -->
                    <p style="margin: 0 0 20px 0; font-size: 18px; color: ${colors.text}; font-weight: 500;">
                      Dear ${name},
                    </p>
                    
                    <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 24px; color: ${colors.textLight};">
                      Thank you for booking a tour with Sewanagala Sugar Factory! We're excited to welcome you and show you the fascinating process of sugar production.
                    </p>

                    <!-- Booking Reference Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${colors.backgroundAlt}; border-left: 4px solid ${colors.accent}; border-radius: 8px; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="margin: 0 0 8px 0; font-size: 12px; color: ${colors.textMuted}; text-transform: uppercase; letter-spacing: 0.5px;">
                            Booking Reference Number
                          </p>
                          <p style="margin: 0 0 8px 0; font-size: 32px; color: ${colors.accent}; font-weight: bold; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                            ${booking_id}
                          </p>
                          <p style="margin: 0; font-size: 12px; color: ${colors.textMuted};">
                            Please keep this reference number for your records
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Tour Details -->
                    <h2 style="margin: 0 0 20px 0; font-size: 20px; color: ${colors.primary}; font-weight: bold;">
                      Your Tour Details
                    </h2>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${colors.backgroundAlt}; border: 1px solid ${colors.border}; border-radius: 8px; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 16px 20px; border-bottom: 1px solid ${colors.border};">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="40%" style="font-size: 14px; font-weight: bold; color: ${colors.primary};">Date</td>
                              <td style="font-size: 15px; color: ${colors.text};">${formattedDate}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 20px; border-bottom: 1px solid ${colors.border};">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="40%" style="font-size: 14px; font-weight: bold; color: ${colors.primary};">Time</td>
                              <td style="font-size: 15px; color: ${colors.text};">${visit_time}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 20px; border-bottom: 1px solid ${colors.border};">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="40%" style="font-size: 14px; font-weight: bold; color: ${colors.primary};">Visitors</td>
                              <td style="font-size: 15px; color: ${colors.text};">${visitor_count} ${visitor_count === 1 ? 'person' : 'people'}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="40%" style="font-size: 14px; font-weight: bold; color: ${colors.primary};">Status</td>
                              <td style="font-size: 16px; color: ${colors.success}; font-weight: bold;">CONFIRMED</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Important Instructions -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%); border-radius: 8px; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 25px;">
                          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: ${colors.white}; font-weight: bold;">
                            Important Instructions
                          </h3>
                          <ul style="margin: 0; padding-left: 20px; color: ${colors.white}; opacity: 0.95;">
                            <li style="margin-bottom: 10px; font-size: 14px; line-height: 20px;">Arrive <strong>15 minutes before</strong> your scheduled time</li>
                            <li style="margin-bottom: 10px; font-size: 14px; line-height: 20px;">Bring a <strong>valid ID</strong> for check-in</li>
                            <li style="margin-bottom: 10px; font-size: 14px; line-height: 20px;">Wear <strong>comfortable walking shoes</strong> and modest clothing</li>
                            <li style="margin-bottom: 10px; font-size: 14px; line-height: 20px;">Photography is allowed in designated areas</li>
                            <li style="margin-bottom: 10px; font-size: 14px; line-height: 20px;">Tour duration is approximately <strong>2 hours</strong></li>
                            <li style="margin-bottom: 0; font-size: 14px; line-height: 20px;">The tour includes safety briefing and factory floor access</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <!-- Tour Policies -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fffbeb; border: 2px solid #fcd34d; border-radius: 8px; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 25px;">
                          <h3 style="margin: 0 0 20px 0; font-size: 18px; color: ${colors.warning}; font-weight: bold;">
                            Tour Policies
                          </h3>
                          
                          <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: ${colors.warning};">Health & Safety</p>
                          <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: ${colors.text};">
                            • Closed-toe shoes are mandatory for factory floor access<br>
                            • Safety equipment will be provided (hard hats, safety vests)<br>
                            • Children under 12 must be accompanied by an adult at all times<br>
                            • Please inform us of any health conditions or mobility issues
                          </p>

                          <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: ${colors.warning};">Photography & Recording</p>
                          <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: ${colors.text};">
                            • Photography allowed in designated areas only<br>
                            • No video recording of production processes<br>
                            • Please respect signage indicating restricted areas<br>
                            • Commercial photography requires prior approval
                          </p>

                          <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: ${colors.warning};">Code of Conduct</p>
                          <p style="margin: 0; font-size: 14px; line-height: 22px; color: ${colors.text};">
                            • Follow tour guide instructions at all times<br>
                            • Stay with your group throughout the tour<br>
                            • No smoking, eating, or drinking on the factory floor<br>
                            • Maintain respectful behavior towards staff and equipment
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Cancellation Policy -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 25px;">
                          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: ${colors.danger}; font-weight: bold;">
                            Cancellation & Rescheduling Policy
                          </h3>
                          
                          <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 22px; color: ${colors.text};">
                            <strong>Free Cancellation:</strong> Up to 48 hours before your scheduled tour<br>
                            <strong>Rescheduling:</strong> Allowed once, up to 24 hours before the tour<br>
                            <strong>Late Cancellation:</strong> Within 24 hours - no refund<br>
                            <strong>No-Show:</strong> Full booking amount forfeited
                          </p>

                          <p style="margin: 0 0 16px 0; font-size: 13px; font-style: italic; color: ${colors.textLight};">
                            To cancel or reschedule, please contact us at least 48 hours in advance via phone or email.
                          </p>

                          <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: ${colors.danger};">Weather & Factory Closures</p>
                          <p style="margin: 0; font-size: 14px; line-height: 22px; color: ${colors.text};">
                            In case of extreme weather conditions or unexpected factory closures, we will notify you immediately and offer:<br>
                            • Full refund, or<br>
                            • Rescheduling to any available date at no extra cost
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- What to Expect -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="margin: 0 0 12px 0; font-size: 18px; color: ${colors.accentDark}; font-weight: bold;">
                            What to Expect
                          </h3>
                          <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 24px; color: ${colors.text};">
                            Your guided tour will take you through the complete sugar production process, from cane crushing to packaging. You'll witness state-of-the-art machinery in action and learn about the rich history of Sewanagala Sugar Factory.
                          </p>
                          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: ${colors.text};">Tour Highlights:</p>
                          <p style="margin: 0; font-size: 14px; line-height: 22px; color: ${colors.textLight};">
                            • Sugar cane processing and crushing<br>
                            • Juice extraction and clarification<br>
                            • Crystallization and refining process<br>
                            • Packaging and quality control<br>
                            • Factory history and heritage display<br>
                            • Sample tasting (subject to availability)
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Contact Info -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${colors.backgroundAlt}; border-radius: 8px; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <h4 style="margin: 0 0 12px 0; font-size: 16px; color: ${colors.text}; font-weight: 600;">
                            Need to Make Changes?
                          </h4>
                          <p style="margin: 0; font-size: 14px; color: ${colors.textLight}; line-height: 22px;">
                            <strong>Phone:</strong> +94 77 123 4567<br>
                            <strong>Email:</strong> tours@sewanagalafactory.com<br>
                            <strong>Office Hours:</strong> Mon-Fri, 8:00 AM - 5:00 PM
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 10px 0 30px 0;">
                          <a href="https://sewanagalafactory.com/booking/${booking_id}" style="display: inline-block; padding: 14px 40px; background: ${colors.accent}; color: ${colors.white}; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            View Booking Details
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Location -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 8px;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <p style="margin: 0 0 10px 0; font-size: 14px; color: ${colors.text};">
                            <strong>Location:</strong> Sewanagala Sugar Factory, Buttala Road, Sewanagala
                          </p>
                          <a href="https://maps.google.com" style="color: ${colors.accent}; font-size: 14px; font-weight: 600; text-decoration: none;">
                            Get Directions →
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: ${colors.backgroundAlt}; border-top: 1px solid ${colors.border}; text-align: center;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: ${colors.text}; font-weight: 600;">
                      <strong>Sewanagala Sugar Factory</strong>
                    </p>
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: ${colors.textLight};">
                      Proudly serving Sri Lanka since 1986
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: ${colors.textMuted};">
                      This is an automated confirmation email. Please do not reply to this message.
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: ${colors.textMuted};">
                      For support, contact us at tours@sewanagalafactory.com
                    </p>
                    <p style="margin: 0; font-size: 12px; color: ${colors.textMuted};">
                      By confirming this booking, you agree to our tour policies and cancellation terms.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

export default BookingConfirmationEmail

