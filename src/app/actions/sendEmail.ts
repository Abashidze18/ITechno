'use server'

import nodemailer from 'nodemailer'

export async function sendContactEmail(formData: FormData) {
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const message = formData.get('message')

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, 
    port: Number(process.env.EMAIL_PORT),
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false 
    }
  })

  const siteUrl = 'https://itechno.ge'
  const logoUrl = `${siteUrl}/og-image.png`

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f9; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <div style="background-color: #2980B9; padding: 30px; text-align: center;">
          <img src="${logoUrl}" alt="I-TECHNO" style="max-width: 150px; margin-bottom: 10px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">ახალი შეტყობინება საიტიდან</h1>
        </div>

        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; line-height: 1.6; color: #555;">თქვენს საიტზე შემოვიდა საკონტაქტო მოთხოვნა შემდეგი მონაცემებით:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #f28f24; font-weight: bold; width: 30%;">სახელი:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #f28f24; font-weight: bold;">ელ-ფოსტა:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${email}" style="color: #2980B9; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #f28f24; font-weight: bold;">ტელეფონი:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${phone}</td>
            </tr>
          </table>

          <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #2980B9; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">ტექსტი:</p>
            <p style="margin: 0; line-height: 1.6; color: #555; white-space: pre-wrap;">${message}</p>
          </div>
        </div>

        <div style="background-color: #fdfdfd; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999; margin: 0;">გამოგზავნილია itechno.ge-ს ადმინ პანელიდან.</p>
          <p style="font-size: 12px; color: #999; margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} I-TECHNO. All rights reserved.</p>
        </div>

      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      replyTo: String(email),
      subject: `📧 ახალი შეტყობინება: ${firstName} ${lastName}`,
      html: emailHtml,
    })
    
    return { success: true }
  } catch (error) {
    console.error('Nodemailer Error:', error)
    return { success: false }
  }
}