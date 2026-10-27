import { Resend } from "resend";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private resend: Resend | null = null;
  private fromAddress: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.fromAddress = process.env.EMAIL_FROM || "orders@bharatbazaar.in";

    if (apiKey && apiKey.trim().length > 0) {
      this.resend = new Resend(apiKey);
    }
  }

  isConfigured(): boolean {
    return Boolean(this.resend);
  }

  async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string }> {
    if (!this.resend) {
      // Development fallback: Log email output cleanly
      console.log(`[EMAIL DISPATCH] To: ${options.to} | Subject: "${options.subject}"`);
      return { success: true, id: `dev_mail_${Date.now()}` };
    }

    try {
      const response = await this.resend.emails.send({
        from: this.fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      return { success: true, id: response.data?.id };
    } catch (error) {
      console.error("[EMAIL ERROR]", error);
      return { success: false };
    }
  }

  /**
   * Generates order confirmation email HTML
   */
  getOrderConfirmationTemplate(order: {
    orderNumber: string;
    customerName: string;
    totalAmountFormatted: string;
    items: Array<{ name: string; quantity: number; priceFormatted: string }>;
  }): string {
    const itemsList = order.items
      .map(
        (i) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${i.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${i.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${i.priceFormatted}</td>
          </tr>`
      )
      .join("");

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">BharatBazaar</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #16a34a; margin-top: 0;">Order Confirmed!</h2>
          <p>Dear ${order.customerName},</p>
          <p>Thank you for your order. We are preparing it for shipment.</p>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          <p style="font-size: 18px; text-align: right;"><strong>Total Paid:</strong> ${order.totalAmountFormatted}</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 13px; color: #6b7280; text-align: center;">If you have any questions, reply to this email or visit our store support.</p>
        </div>
      </div>
    `;
  }
}

export const emailService = new EmailService();
