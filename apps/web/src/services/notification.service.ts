import { Resend } from 'resend';
import { Notification } from '@fsp/shared';
import { formatDateTime } from '@fsp/shared';
import { prisma } from '@fsp/database';

export class NotificationService {
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  /**
   * Send weather conflict notification
   */
  async sendWeatherConflict(data: {
    studentEmail: string;
    studentName: string;
    scheduledTime: Date;
    violatedMinimums: string[];
    location: string;
  }): Promise<void> {
    const subject = `Weather Alert: Flight Canceled - ${formatDateTime(data.scheduledTime)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #991b1b; margin: 0 0 10px 0;">⚠️ Weather Conflict Detected</h2>
          <p style="color: #7f1d1d; margin: 0;">Your flight has been canceled due to weather conditions.</p>
        </div>

        <div style="padding: 20px; background: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Flight Details</h3>
          <p><strong>Scheduled:</strong> ${formatDateTime(data.scheduledTime)}</p>
          <p><strong>Location:</strong> ${data.location}</p>
        </div>

        <div style="padding: 20px; background: #fef3c7; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Weather Issues</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${data.violatedMinimums.map((min) => `<li>${min}</li>`).join('')}
          </ul>
        </div>

        <div style="padding: 20px; background: #dbeafe; border-radius: 8px;">
          <h3 style="margin-top: 0;">Next Steps</h3>
          <p>We're working on finding you a new time. You'll receive reschedule options shortly.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
             style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; margin-top: 10px;">
            View Dashboard
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>Questions? Reply to this email or contact your instructor.</p>
          <p style="margin: 0;">Flight Schedule Pro - Weather Management System</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: data.studentEmail,
      subject,
      html,
    });
  }

  /**
   * Send reschedule options notification
   */
  async sendRescheduleOptions(data: {
    studentEmail: string;
    studentName: string;
    originalTime: Date;
    options: Array<{
      id: string;
      proposedTime: Date;
      reasoning: string;
      score: number;
    }>;
  }): Promise<void> {
    const subject = `New Flight Options Available`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #1e40af; margin: 0 0 10px 0;">🔄 Reschedule Options Ready</h2>
          <p style="color: #1e3a8a; margin: 0;">We've found ${data.options.length} great times for your rescheduled flight.</p>
        </div>

        <div style="padding: 20px; background: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Original Time:</strong> ${formatDateTime(data.originalTime)}</p>
          <p style="color: #6b7280; margin: 0;">Canceled due to weather</p>
        </div>

        <h3>Recommended Options:</h3>

        ${data.options
          .map(
            (option, index) => `
          <div style="padding: 20px; background: white; border: 2px solid #e5e7eb; border-radius: 8px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
              <h4 style="margin: 0; color: #111827;">Option ${index + 1}</h4>
              <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                ${Math.round(option.score * 100)}% Match
              </span>
            </div>
            <p style="font-size: 18px; font-weight: 600; color: #3b82f6; margin: 10px 0;">
              ${formatDateTime(option.proposedTime)}
            </p>
            <p style="color: #6b7280; margin: 10px 0 15px 0; font-size: 14px;">
              ${option.reasoning}
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/reschedule/${option.id}" 
               style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
              Select This Time
            </a>
          </div>
        `
          )
          .join('')}

        <div style="margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center;">
          <p style="margin: 0 0 10px 0;"><strong>Need a different time?</strong></p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings" 
             style="color: #3b82f6; text-decoration: none;">
            View full calendar →
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p style="margin: 0;">Flight Schedule Pro - Weather Management System</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: data.studentEmail,
      subject,
      html,
    });
  }

  /**
   * Send reschedule confirmation
   */
  async sendRescheduleConfirmation(data: {
    studentEmail: string;
    studentName: string;
    newTime: Date;
    location: string;
    instructor: string;
    aircraft: string;
  }): Promise<void> {
    const subject = `Flight Confirmed - ${formatDateTime(data.newTime)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #065f46; margin: 0 0 10px 0;">✅ Flight Confirmed!</h2>
          <p style="color: #064e3b; margin: 0;">Your rescheduled flight has been confirmed.</p>
        </div>

        <div style="padding: 30px; background: white; border: 2px solid #10b981; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #111827;">Flight Details</h3>
          <div style="font-size: 24px; font-weight: 700; color: #3b82f6; margin: 15px 0;">
            ${formatDateTime(data.newTime)}
          </div>
          <div style="margin-top: 20px;">
            <p style="margin: 8px 0;"><strong>Location:</strong> ${data.location}</p>
            <p style="margin: 8px 0;"><strong>Instructor:</strong> ${data.instructor}</p>
            <p style="margin: 8px 0;"><strong>Aircraft:</strong> ${data.aircraft}</p>
          </div>
        </div>

        <div style="padding: 20px; background: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Before Your Flight</h3>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Check weather conditions 24 hours before</li>
            <li>Complete pre-flight checklist</li>
            <li>Arrive 15 minutes early</li>
            <li>Bring your logbook and pilot certificate</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
             style="display: inline-block; padding: 14px 28px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            View Dashboard
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
          <p>Need to make changes? Contact us at least 24 hours before your flight.</p>
          <p style="margin: 0;">Flight Schedule Pro - Weather Management System</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: data.studentEmail,
      subject,
      html,
    });
  }

  /**
   * Internal method to send email via Resend
   */
  private async sendEmail(data: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      await this.resend.emails.send({
        from: 'Flight Schedule Pro <noreply@flightschedulepro.com>',
        to: data.to,
        subject: data.subject,
        html: data.html,
      });

      console.log(`Email sent to ${data.to}: ${data.subject}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}

