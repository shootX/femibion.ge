import nodemailer from 'nodemailer'
import { join } from 'path'
import { stat } from 'fs/promises'
import type { Invoice } from '@/lib/invoice-types'
import { INVOICE_STATUS_META } from '@/lib/invoice-types'
import { generateInvoicePdf } from '@/lib/invoice-pdf'

export async function sendInvoiceEmail(params: {
  invoice: Invoice
  recipientEmail: string
  subject?: string
  message?: string
}): Promise<{ success: boolean; error?: string }> {
  const { invoice, recipientEmail, subject, message } = params

  const host = process.env.SMTP_HOST || 'mail.femibion.ge'
  const user = process.env.SMTP_USER || 'info@femibion.ge'
  const pass = process.env.SMTP_PASS
  const port = parseInt(process.env.SMTP_PORT || '587', 10)

  if (!pass) {
    return { success: false, error: 'SMTP პაროლი (.env) არ არის კონფიგურირებული' }
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })

  // 1. Prepare PDF attachment
  let finalPdfBuffer: Buffer
  try {
    finalPdfBuffer = await generateInvoicePdf(invoice)
  } catch (err) {
    console.error('Failed to generate PDF for email attachment:', err)
    return { success: false, error: 'ინვოისის PDF-ის შექმნა ვერ მოხერხდა' }
  }

  const attachments: Array<{
    filename: string
    content?: Buffer
    path?: string
    contentType?: string
    contentDisposition?: 'attachment' | 'inline'
    cid?: string
  }> = [
    {
      filename: `Invoice-${invoice.number}.pdf`,
      content: finalPdfBuffer,
      contentType: 'application/pdf',
      contentDisposition: 'attachment',
    },
  ]

  // Add logo as inline CID attachment
  const logoPath = join(process.cwd(), 'public', 'images', 'logo.png')
  let hasLogo = false
  try {
    await stat(logoPath)
    attachments.push({
      filename: 'logo.png',
      path: logoPath,
      cid: 'femibion-logo',
    })
    hasLogo = true
  } catch {
    hasLogo = false
  }

  const emailSubject =
    subject?.trim() ||
    `ინვოისი #${invoice.number} - Femibion Georgia (${invoice.seller.name})`

  const statusMeta = INVOICE_STATUS_META[invoice.status] || INVOICE_STATUS_META.pending

  const statusBg =
    invoice.status === 'paid'
      ? '#ecfdf5'
      : invoice.status === 'cancelled'
        ? '#f3f4f6'
        : '#fffbeb'
  const statusColor =
    invoice.status === 'paid'
      ? '#047857'
      : invoice.status === 'cancelled'
        ? '#6b7280'
        : '#b45309'

  const itemsRows = invoice.items
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 12px; text-align: center; color: #9ca3af; font-family: monospace;">${idx + 1}</td>
        <td style="padding: 10px 12px; font-weight: 500; color: #111827;">${item.description}</td>
        <td style="padding: 10px 12px; text-align: center; color: #374151;">${item.quantity} ცალი</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #374151;">${item.unitPrice.toFixed(2)} ₾</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; font-weight: bold; color: #111827;">${item.total.toFixed(2)} ₾</td>
      </tr>
    `
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html lang="ka">
    <head>
      <meta charset="utf-8">
      <title>${emailSubject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 24px; color: #1f2937;">
      <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <!-- Header with Logo -->
        <div style="background-color: #ffffff; padding: 28px 32px; border-bottom: 2px solid #f3f4f6;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top;">
                ${
                  hasLogo
                    ? `<img src="cid:femibion-logo" alt="Femibion Logo" width="48" height="48" style="width: 48px; height: 48px; object-fit: contain; border-radius: 10px; border: 1px solid #f3f4f6; display: block;" />`
                    : `<div style="display: inline-block; width: 44px; height: 44px; background-color: #db2777; border-radius: 10px; color: #ffffff; text-align: center; line-height: 44px; font-size: 24px; font-weight: bold;">F</div>`
                }
                <div style="margin-top: 10px;">
                  <span style="font-size: 18px; font-weight: bold; color: #111827; letter-spacing: -0.3px;">FEMIBION GEORGIA</span>
                  <div style="font-size: 12px; color: #6b7280;">ოფიციალური დისტრიბუცია საქართველოში</div>
                </div>
              </td>
              <td style="vertical-align: top; text-align: right;">
                <div style="font-size: 26px; font-weight: 800; color: #111827; letter-spacing: -0.5px;">ინვოისი</div>
                <div style="font-family: monospace; font-size: 15px; font-weight: 600; color: #db2777; margin-top: 2px;">#${invoice.number}</div>
                <div style="font-size: 13px; color: #6b7280; margin-top: 6px;">თარიღი: <strong style="color: #111827;">${invoice.date}</strong></div>
                ${invoice.dueDate ? `<div style="font-size: 13px; color: #6b7280;">გადახდის ვადა: <strong style="color: #111827;">${invoice.dueDate}</strong></div>` : ''}
                <div style="margin-top: 8px;">
                  <span style="display: inline-block; padding: 3px 10px; font-size: 12px; font-weight: 600; border-radius: 20px; background-color: ${statusBg}; color: ${statusColor};">
                    ${statusMeta.label}
                  </span>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Download Attachment Box -->
        <div style="margin: 20px 32px 0 32px; background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 10px; padding: 14px 18px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 38px; vertical-align: middle;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background-color: #db2777; color: #ffffff; text-align: center; line-height: 36px; font-size: 18px; font-weight: bold;">
                  ⬇
                </div>
              </td>
              <td style="vertical-align: middle; padding-left: 12px;">
                <div style="font-size: 14px; font-weight: bold; color: #9d174d;">ინვოისი #${invoice.number} მიმაგრებულია (PDF)</div>
                <div style="font-size: 12px; color: #be185d; margin-top: 2px;">
                  ოფიციალური საბუთი შეგიძლიათ გადმოწეროთ წერილის დანართებიდან: <strong>Invoice-${invoice.number}.pdf</strong>
                </div>
              </td>
            </tr>
          </table>
        </div>

        ${
          message
            ? `
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 20px; margin: 16px 32px 0 32px; border-radius: 6px; font-size: 13px; color: #1e40af;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        `
            : ''
        }

        <!-- Seller & Buyer -->
        <div style="padding: 24px 32px 16px 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; vertical-align: top; padding-right: 12px;">
                <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 14px; font-size: 12px;">
                  <div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">გამყიდველი</div>
                  <div style="font-size: 14px; font-weight: bold; color: #111827; margin-bottom: 4px;">${invoice.seller.name}</div>
                  <div style="color: #4b5563;">ს/კ: <strong style="font-family: monospace;">${invoice.seller.taxId}</strong></div>
                  <div style="color: #4b5563;">მისამართი: ${invoice.seller.address}</div>
                  <div style="color: #4b5563;">ტელეფონი: ${invoice.seller.phone}</div>
                </div>
              </td>
              <td style="width: 50%; vertical-align: top; padding-left: 12px;">
                <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 14px; font-size: 12px;">
                  <div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">შემსყიდველი</div>
                  <div style="font-size: 14px; font-weight: bold; color: #111827; margin-bottom: 4px;">${invoice.buyer.name}</div>
                  ${invoice.buyer.taxId ? `<div style="color: #4b5563;">ს/კ ან პ/ნ: <strong style="font-family: monospace;">${invoice.buyer.taxId}</strong></div>` : ''}
                  <div style="color: #4b5563;">ტელეფონი: ${invoice.buyer.phone}</div>
                  <div style="color: #4b5563;">მისამართი: ${invoice.buyer.address}</div>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <div style="padding: 8px 32px 16px 32px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
                <th style="padding: 10px 12px; text-align: center; color: #4b5563; font-weight: 600; width: 40px;">№</th>
                <th style="padding: 10px 12px; text-align: left; color: #4b5563; font-weight: 600;">საქონლის დასახელება</th>
                <th style="padding: 10px 12px; text-align: center; color: #4b5563; font-weight: 600; width: 85px;">რაოდენობა</th>
                <th style="padding: 10px 12px; text-align: right; color: #4b5563; font-weight: 600; width: 100px;">ფასი (₾)</th>
                <th style="padding: 10px 12px; text-align: right; color: #4b5563; font-weight: 600; width: 110px;">ჯამი (₾)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>
        </div>

        <!-- Total Box -->
        <div style="padding: 0 32px 24px 32px; text-align: right;">
          <table style="margin-left: auto; border-collapse: collapse; min-width: 240px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
            <tr>
              <td style="padding: 8px 16px; font-size: 13px; color: #6b7280; text-align: left;">ქვეჯამი:</td>
              <td style="padding: 8px 16px; font-size: 13px; font-family: monospace; color: #111827; text-align: right;">${invoice.subtotal.toFixed(2)} ₾</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 10px 16px; font-size: 15px; font-weight: bold; color: #111827; text-align: left;">სულ გადასახდელი:</td>
              <td style="padding: 10px 16px; font-size: 17px; font-weight: bold; font-family: monospace; color: #db2777; text-align: right;">${invoice.total.toFixed(2)} ₾</td>
            </tr>
          </table>
        </div>

        ${
          invoice.notes
            ? `
        <div style="padding: 0 32px 20px 32px;">
          <div style="background-color: #f9fafb; border-radius: 6px; padding: 12px 16px; font-size: 12px; color: #4b5563;">
            <strong style="color: #111827;">შენიშვნა:</strong> ${invoice.notes}
          </div>
        </div>
        `
            : ''
        }

        <!-- Footer -->
        <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 32px; font-size: 12px; color: #6b7280; text-align: center;">
          <p style="margin: 0 0 6px 0; font-weight: 500; color: #374151;">მადლობას გიხდით თანამშრომლობისთვის!</p>
          <p style="margin: 0;">Femibion Georgia • <a href="mailto:info@femibion.ge" style="color: #db2777; text-decoration: none;">info@femibion.ge</a> • +995 595 94 74 50</p>
        </div>

      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: `Femibion Georgia <${process.env.SMTP_FROM || user}>`,
      to: recipientEmail,
      subject: emailSubject,
      html,
      attachments,
    })
    return { success: true }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error('Invoice email send error:', errorMsg, err)
    return { success: false, error: errorMsg }
  }
}
