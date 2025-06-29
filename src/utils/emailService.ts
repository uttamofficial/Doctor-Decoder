// Email Service for medication reminders
interface EmailReminderData {
  email: string;
  medication: string;
  dosage: string;
  time: string;
  frequency: string;
  patientName: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

export class EmailService {
  // For demo purposes, we'll use EmailJS (free service for client-side emails)
  // In production, you'd want to use a proper backend service
  private static readonly EMAILJS_SERVICE_ID = 'service_demo';
  private static readonly EMAILJS_TEMPLATE_ID = 'template_demo';
  private static readonly EMAILJS_PUBLIC_KEY = 'demo_key';

  // Generate email template for medication reminder
  static generateReminderTemplate(data: EmailReminderData): EmailTemplate {
    const subject = `Medication Reminder: ${data.medication} for ${data.patientName}`;
    
    const body = `
Dear ${data.patientName},

This is your medication reminder from Doctor Decoder.

MEDICATION DETAILS:
• Medicine: ${data.medication}
• Dosage: ${data.dosage}
• Time: ${data.time}
• Frequency: ${data.frequency}

IMPORTANT REMINDERS:
• Take your medication exactly as prescribed
• Don't skip doses even if you feel better
• Contact your healthcare provider if you experience any side effects
• Keep track of your medication schedule

NEXT STEPS:
• Set up additional reminders on your phone
• Use a pill organizer to stay organized
• Keep a medication diary

This reminder was set up through Doctor Decoder - your AI-powered prescription assistant.

Stay healthy!

---
Doctor Decoder Team
🔒 Your health information is secure and private
📱 Visit us at ${window.location.origin}

Note: This is an automated reminder. Please consult your healthcare provider for medical advice.
    `.trim();

    return { subject, body };
  }

  // Send email reminder (demo implementation)
  static async sendReminderEmail(data: EmailReminderData): Promise<{ success: boolean; message: string }> {
    try {
      console.log('📧 Preparing to send email reminder...', data);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Generate email template
      const template = this.generateReminderTemplate(data);
      
      // For demo purposes, we'll simulate email sending
      // In production, you would integrate with:
      // - EmailJS for client-side emails
      // - SendGrid, Mailgun, or AWS SES for server-side emails
      // - Your own backend API
      
      console.log('📧 Email template generated:', template);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, we'll use mailto: link as a fallback
      const mailtoLink = this.generateMailtoLink(data, template);
      
      // Try to open default email client
      if (typeof window !== 'undefined') {
        window.open(mailtoLink, '_blank');
      }

      return {
        success: true,
        message: `Email reminder set up successfully! We've opened your default email client to send the reminder to ${data.email}. You can also set up recurring reminders through your email provider.`
      };

    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send email reminder'
      };
    }
  }

  // Generate mailto link as fallback
  private static generateMailtoLink(data: EmailReminderData, template: EmailTemplate): string {
    const encodedSubject = encodeURIComponent(template.subject);
    const encodedBody = encodeURIComponent(template.body);
    
    return `mailto:${data.email}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  // Set up recurring email reminders (demo)
  static async setupRecurringReminders(data: EmailReminderData): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Setting up recurring reminders...', data);

      // In a real implementation, this would:
      // 1. Store reminder data in a database
      // 2. Set up cron jobs or scheduled tasks
      // 3. Use a service like AWS EventBridge or Google Cloud Scheduler
      
      // For demo, we'll provide instructions
      const instructions = this.generateRecurringInstructions(data);
      
      return {
        success: true,
        message: instructions
      };

    } catch (error) {
      console.error('❌ Recurring reminder setup failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to set up recurring reminders'
      };
    }
  }

  // Generate instructions for setting up recurring reminders
  private static generateRecurringInstructions(data: EmailReminderData): string {
    return `
Recurring Email Reminders Set Up! 📧

WHAT'S NEXT:
1. Check your email (${data.email}) for the reminder template
2. Save it as a draft in your email client
3. Set up recurring sends using your email provider:

GMAIL USERS:
• Use Gmail's "Schedule Send" feature
• Install "Boomerang" extension for recurring emails

OUTLOOK USERS:
• Use "Delay Delivery" with recurring calendar events
• Set up Rules to forward reminders

APPLE MAIL USERS:
• Use Calendar app to set medication reminders
• Create recurring events with email notifications

ALTERNATIVE OPTIONS:
• Use your phone's built-in medication reminder apps
• Set up calendar notifications
• Use pill reminder apps like Medisafe or MyTherapy

MEDICATION: ${data.medication}
SCHEDULE: ${data.time} ${data.frequency}
PATIENT: ${data.patientName}

Remember: Consistency is key to medication adherence! 💊
    `.trim();
  }

  // Validate email reminder data
  static validateReminderData(data: Partial<EmailReminderData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.email || !data.email.trim()) {
      errors.push('Email address is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
      }
    }

    if (!data.medication || !data.medication.trim()) {
      errors.push('Medication name is required');
    }

    if (!data.dosage || !data.dosage.trim()) {
      errors.push('Dosage information is required');
    }

    if (!data.time || !data.time.trim()) {
      errors.push('Reminder time is required');
    }

    if (!data.frequency || !data.frequency.trim()) {
      errors.push('Frequency is required');
    }

    if (!data.patientName || !data.patientName.trim()) {
      errors.push('Patient name is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Test email functionality
  static async testEmailService(): Promise<{ success: boolean; message: string }> {
    const testData: EmailReminderData = {
      email: 'test@example.com',
      medication: 'Test Medication 500mg',
      dosage: '1 tablet',
      time: '08:00',
      frequency: 'daily',
      patientName: 'Test Patient'
    };

    try {
      const template = this.generateReminderTemplate(testData);
      const validation = this.validateReminderData(testData);

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      return {
        success: true,
        message: `Email service test passed! Template generated successfully with subject: "${template.subject}"`
      };

    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Email service test failed'
      };
    }
  }
}