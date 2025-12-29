import PDFDocument from 'pdfkit'
import { BookingEmailData } from './emailService'

interface PDFOptions {
  booking: BookingEmailData
}

export async function generateBookingPDF(booking: BookingEmailData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      })

      const buffers: Buffer[] = []
      
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers)
        resolve(pdfBuffer)
      })
      doc.on('error', reject)

      const primaryGreen = '#2c5f2d'
      const lightGreen = '#97bc62'
      const darkGray = '#333333'
      const lightGray = '#666666'
      const bgGray = '#f8f9fa'

      doc.rect(0, 0, doc.page.width, 120)
         .fillColor(primaryGreen)
         .fill()

      doc.fillColor('#ffffff')
         .fontSize(28)
         .font('Helvetica-Bold')
         .text('SEWANAGALA SUGAR FACTORY', 50, 30, { align: 'center' })
      
      doc.fontSize(14)
         .font('Helvetica')
         .text('Tour Booking Confirmation', 50, 70, { align: 'center' })

      doc.rect(50, 150, doc.page.width - 100, 80)
         .fillColor(bgGray)
         .fill()
      
      doc.rect(50, 150, 4, 80)
         .fillColor(primaryGreen)
         .fill()

      doc.fillColor(lightGray)
         .fontSize(10)
         .font('Helvetica')
         .text('BOOKING REFERENCE NUMBER', 65, 165)

      doc.fillColor(primaryGreen)
         .fontSize(24)
         .font('Helvetica-Bold')
         .text(booking.booking_id, 65, 185)

      doc.fillColor(lightGray)
         .fontSize(9)
         .text('Please keep this reference for your records', 65, 213)

      let yPos = 260

      doc.fillColor(primaryGreen)
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('Booking Details', 50, yPos)

      yPos += 30

      const details = [
        { label: 'Name', value: booking.name },
        { label: 'Email', value: booking.email },
        { label: 'Phone', value: booking.phone },
        { label: 'Tour Date', value: new Date(booking.visit_date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })},
        { label: 'Tour Time', value: booking.visit_time },
        { label: 'Number of Visitors', value: booking.visitor_count.toString() },
        { label: 'Booking Date', value: new Date(booking.booking_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })},
        { label: 'Status', value: 'CONFIRMED', highlight: true }
      ]

      details.forEach((detail, index) => {
        if (index % 2 === 0) {
          doc.rect(50, yPos - 5, doc.page.width - 100, 30)
             .fillColor('#fafafa')
             .fill()
        }

        doc.fillColor(primaryGreen)
           .fontSize(11)
           .font('Helvetica-Bold')
           .text(detail.label, 60, yPos)

        if (detail.highlight) {
          doc.fillColor(primaryGreen)
             .fontSize(12)
             .font('Helvetica-Bold')
             .text(detail.value, 250, yPos)
        } else {
          doc.fillColor(darkGray)
             .fontSize(11)
             .font('Helvetica')
             .text(detail.value, 250, yPos)
        }

        yPos += 30
      })

      yPos += 20

      doc.rect(50, yPos, doc.page.width - 100, 180)
         .fillColor('#e8f5e9')
         .fill()

      yPos += 15

      doc.fillColor(primaryGreen)
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('Important Instructions', 60, yPos)

      yPos += 25

      const instructions = [
        'Arrive 15 minutes before your scheduled time',
        'Bring a valid ID for check-in',
        'Wear comfortable walking shoes and modest clothing',
        'Photography is allowed in designated areas',
        'Tour duration is approximately 2 hours',
        'The tour includes safety briefing and factory floor access'
      ]

      instructions.forEach((instruction) => {
        doc.fillColor(darkGray)
           .fontSize(10)
           .font('Helvetica')
           .text('*', 60, yPos, { continued: true })
           .text(`  ${instruction}`, 70, yPos)
        yPos += 22
      })

      doc.addPage()
      yPos = 50

      doc.rect(50, yPos, doc.page.width - 100, 30)
         .fillColor('#fff9e6')
         .fill()

      doc.fillColor('#e68a00')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('TOUR POLICIES', 60, yPos + 8)

      yPos += 45

      doc.fillColor(primaryGreen)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Health & Safety', 50, yPos)

      yPos += 20

      const healthPolicies = [
        'Closed-toe shoes are mandatory for factory floor access',
        'Safety equipment will be provided (hard hats, safety vests)',
        'Children under 12 must be accompanied by an adult at all times',
        'Please inform us of any health conditions or mobility issues'
      ]

      healthPolicies.forEach((policy) => {
        doc.fillColor(darkGray)
           .fontSize(10)
           .font('Helvetica')
           .text('*', 50, yPos, { continued: true })
           .text(`  ${policy}`, 60, yPos, { width: doc.page.width - 120 })
        yPos += 18
      })

      yPos += 10

      doc.fillColor(primaryGreen)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Photography & Recording', 50, yPos)

      yPos += 20

      const photoPolicies = [
        'Photography allowed in designated areas only',
        'No video recording of production processes',
        'Please respect signage indicating restricted areas',
        'Commercial photography requires prior approval'
      ]

      photoPolicies.forEach((policy) => {
        doc.fillColor(darkGray)
           .fontSize(10)
           .font('Helvetica')
           .text('*', 50, yPos, { continued: true })
           .text(`  ${policy}`, 60, yPos, { width: doc.page.width - 120 })
        yPos += 18
      })

      yPos += 10

      doc.fillColor(primaryGreen)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Code of Conduct', 50, yPos)

      yPos += 20

      const conductPolicies = [
        'Follow tour guide instructions at all times',
        'Stay with your group throughout the tour',
        'No smoking, eating, or drinking on the factory floor',
        'Maintain respectful behavior towards staff and equipment'
      ]

      conductPolicies.forEach((policy) => {
        doc.fillColor(darkGray)
           .fontSize(10)
           .font('Helvetica')
           .text('*', 50, yPos, { continued: true })
           .text(`  ${policy}`, 60, yPos, { width: doc.page.width - 120 })
        yPos += 18
      })

      yPos += 25

      doc.rect(50, yPos, doc.page.width - 100, 30)
         .fillColor('#fff0f0')
         .fill()

      doc.fillColor('#cc0000')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('CANCELLATION & RESCHEDULING POLICY', 60, yPos + 8)

      yPos += 45

      doc.fillColor(darkGray)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('Free Cancellation:', 50, yPos, { continued: true })
         .font('Helvetica')
         .text(' Up to 48 hours before your scheduled tour', { width: doc.page.width - 100 })

      yPos += 18

      doc.font('Helvetica-Bold')
         .text('Rescheduling:', 50, yPos, { continued: true })
         .font('Helvetica')
         .text(' Allowed once, up to 24 hours before the tour', { width: doc.page.width - 100 })

      yPos += 18

      doc.font('Helvetica-Bold')
         .text('Late Cancellation:', 50, yPos, { continued: true })
         .font('Helvetica')
         .text(' Within 24 hours - no refund', { width: doc.page.width - 100 })

      yPos += 18

      doc.font('Helvetica-Bold')
         .text('No-Show:', 50, yPos, { continued: true })
         .font('Helvetica')
         .text(' Full booking amount forfeited', { width: doc.page.width - 100 })

      yPos += 25

      doc.fontSize(9)
         .font('Helvetica-Oblique')
         .text('To cancel or reschedule, please contact us at least 48 hours in advance via phone or email.', 50, yPos, { width: doc.page.width - 100 })

      yPos += 30

      doc.fillColor(primaryGreen)
         .fontSize(11)
         .font('Helvetica-Bold')
         .text('Weather & Factory Closures', 50, yPos)

      yPos += 18

      doc.fillColor(darkGray)
         .fontSize(10)
         .font('Helvetica')
         .text('In case of extreme weather conditions or unexpected factory closures, we will notify you immediately and offer:', 50, yPos, { width: doc.page.width - 100 })

      yPos += 28

      doc.text('* Full refund, or', 50, yPos)
      yPos += 15
      doc.text('* Rescheduling to any available date at no extra cost', 50, yPos)

      yPos += 35

      doc.rect(50, yPos, doc.page.width - 100, 80)
         .fillColor(bgGray)
         .fill()

      yPos += 15

      doc.fillColor(primaryGreen)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Need to Make Changes?', 60, yPos, { align: 'center', width: doc.page.width - 120 })

      yPos += 20

      doc.fillColor(darkGray)
         .fontSize(10)
         .font('Helvetica')
         .text('Phone: +94 77 123 4567', 60, yPos, { align: 'center', width: doc.page.width - 120 })

      yPos += 15

      doc.text('Email: tours@sewanagalafactory.com', 60, yPos, { align: 'center', width: doc.page.width - 120 })

      yPos += 15

      doc.text('Office Hours: Mon-Fri, 8:00 AM - 5:00 PM', 60, yPos, { align: 'center', width: doc.page.width - 120 })

      const addFooter = (pageNum: number) => {
        const footerY = doc.page.height - 80

        doc.rect(0, footerY - 20, doc.page.width, 1)
           .fillColor('#e0e0e0')
           .fill()

        doc.fillColor(lightGray)
           .fontSize(10)
           .font('Helvetica-Bold')
           .text('Sewanagala Sugar Factory', 50, footerY, { align: 'center', width: doc.page.width - 100 })

        doc.fontSize(9)
           .font('Helvetica')
           .text('Proudly serving Sri Lanka since 1986', 50, footerY + 15, { align: 'center', width: doc.page.width - 100 })

        doc.fontSize(8)
           .text('Buttala Road, Sewanagala, Sri Lanka', 50, footerY + 30, { align: 'center', width: doc.page.width - 100 })

        doc.fontSize(7)
           .text(`Page ${pageNum}`, 50, footerY + 45, { align: 'center', width: doc.page.width - 100 })
      }

      doc.switchToPage(0)
      addFooter(1)

      doc.switchToPage(1)
      addFooter(2)

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

export async function sendBookingPDFEmail(booking: BookingEmailData, pdfBuffer: Buffer) {
  return pdfBuffer
}
