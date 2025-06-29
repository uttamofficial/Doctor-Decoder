import { OCRService } from './ocrService';

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class OpenRouterAPI {
  private static readonly BASE_URL = 'https://openrouter.ai/api/v1';
  private static readonly API_KEY = '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';
  private static readonly MODEL = 'deepseek/deepseek-r1:free';

  private static async makeRequest(messages: OpenRouterMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Doctor Decoder'
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: messages,
          temperature: 0.3,
          max_tokens: 2500,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`AI processing failed: ${response.status} ${response.statusText}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI model');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      if (error instanceof Error) {
        throw new Error(`AI processing failed: ${error.message}`);
      }
      throw new Error('Failed to get AI response. Please check your connection and try again.');
    }
  }

  // Enhanced OCR extraction using the new OCR service
  static async extractAndValidatePrescription(imageFile: File, onProgress?: (progress: number) => void): Promise<string> {
    try {
      console.log('🚀 Starting enhanced OCR extraction...');
      
      // Use the new OCR service with progress tracking
      const extractedText = await OCRService.extractText(imageFile, (progressInfo) => {
        if (onProgress) {
          onProgress(progressInfo.progress);
        }
        console.log(`OCR Progress: ${progressInfo.stage} - ${progressInfo.progress}% - ${progressInfo.message}`);
      });
      
      if (onProgress) onProgress(100);
      
      console.log('✅ OCR extraction completed successfully');
      console.log('📊 Final result length:', extractedText.length, 'characters');
      
      return extractedText;
      
    } catch (error) {
      console.error('❌ OCR extraction failed:', error);
      throw error;
    }
  }

  static async decodePrescription(prescriptionText: string, personalDetails?: any, medicalHistory?: any): Promise<string> {
    const systemPrompt = `You are an expert medical prescription interpreter. Format all responses in clean, plain text without any bold, italic, or markdown formatting.

CRITICAL FORMATTING RULES:
- NEVER use markdown symbols like *, **, #, or any formatting
- Use clean plain text with consistent font
- Format each medication exactly like this:

Medication: [Medicine Name]
Dose: [Amount and frequency]
Purpose: [What it treats]
How to Take: [Clear instructions]
Duration: [Time period]
Important Notes: [Warnings and side effects]

[Add spacing between medications]

MOBILE-RESPONSIVE FORMATTING:
- Keep lines short and auto-wrap friendly
- Use clear spacing between sections
- Avoid long unbroken text blocks
- Structure for easy mobile reading

DOSAGE SAFETY:
- Check if any dosage exceeds recommended maximums
- Include clear warnings in plain text (not markdown)
- For unclear OCR text, provide best medical interpretation with caution notes

HANDLING UNCLEAR TEXT:
- When prescription text contains OCR errors, use medical knowledge to suggest most likely medications
- Clearly indicate uncertainty with "Possible interpretation:" or "Verification needed:"
- Provide 2-3 most likely options for unclear medication names
- Include "VERIFICATION NEEDED" section for unclear elements

STRUCTURE YOUR RESPONSE:
1. Brief greeting with patient name if available
2. Each medication in the specified clean format
3. General patient-specific guidance section
4. Verification needed section (if applicable)
5. Important safety reminders

Keep all text plain, clean, and mobile-friendly. Use professional, caring tone with simple language.`;

    const userPrompt = `Please interpret this prescription text and format it in clean, plain text without any formatting symbols. Make it mobile-responsive with proper line breaks and spacing:

PRESCRIPTION TEXT:
${prescriptionText}

${personalDetails ? `
PATIENT INFORMATION:
- Name: ${personalDetails.name}
- Age: ${personalDetails.age} years
- Weight: ${personalDetails.weight}kg
- Height: ${personalDetails.height}cm
- Gender: ${personalDetails.gender}
- BMI: ${personalDetails.height > 0 ? (personalDetails.weight / ((personalDetails.height/100) ** 2)).toFixed(1) : 'Not calculated'}
` : ''}

${medicalHistory ? `
MEDICAL HISTORY:
- Existing Conditions: ${medicalHistory.conditions.join(', ') || 'None reported'}
- Known Allergies: ${medicalHistory.allergies.join(', ') || 'None reported'}
- Current Medications: ${medicalHistory.currentMedications.join(', ') || 'None reported'}
- Additional Notes: ${medicalHistory.additionalNotes || 'None'}
` : ''}

INSTRUCTIONS:
1. Format each medication using the exact clean template provided
2. Include dosage safety warnings if any dose appears excessive
3. Consider the patient's profile for personalized guidance
4. Recommend verification for any uncertain interpretations
5. Use clean, plain text formatting that works well on mobile devices
6. Add proper spacing between sections for readability`;

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return await this.makeRequest(messages);
  }

  static async getChatbotResponse(userMessage: string, personalDetails?: any, medications?: any[]): Promise<string> {
    const systemPrompt = `You are MedBot, an advanced AI medical assistant for Doctor Decoder. You provide helpful, accurate medication guidance while maintaining appropriate medical disclaimers.

CRITICAL FORMATTING RULES:
- NEVER use any markdown symbols like *, **, #, or formatting
- Use clean, readable plain text only
- Structure responses with clear sections when helpful
- Use simple dashes or line breaks for lists
- Keep language simple and professional
- Make responses mobile-friendly with proper line breaks
- Use emojis sparingly for clarity (only 💊, ⚠️, 📞 when absolutely necessary)

EXAMPLE FORMATTING:
When listing medications or steps, use simple format like:

Medication: Rifampicin
Dose: 600 mg once daily
Purpose: Used for tuberculosis
Instructions: Take on an empty stomach
Caution: May discolor urine

For multiple items, use dashes:
- Take with food
- Avoid alcohol
- Monitor for side effects

CAPABILITIES:
- Answer questions about medications, side effects, interactions
- Provide personalized guidance based on patient profile
- Explain medical terms and instructions clearly
- Offer practical advice for medication management
- Recognize when to recommend professional medical consultation

RESPONSE STYLE:
- Friendly, professional, and reassuring tone
- Use clear, simple language without medical jargon
- Provide actionable advice when appropriate
- Always include appropriate medical disclaimers
- Emphasize the importance of following prescribed instructions

SAFETY GUIDELINES:
- Never provide emergency medical advice
- Always recommend consulting healthcare providers for serious concerns
- Acknowledge limitations and uncertainties
- Direct users to seek immediate help for severe symptoms

Remember: Use only plain text formatting. No bold, italic, or special symbols except basic punctuation.`;

    const contextInfo = personalDetails ? `
PATIENT CONTEXT:
- Name: ${personalDetails.name}
- Age: ${personalDetails.age} years
- Weight: ${personalDetails.weight}kg
- Height: ${personalDetails.height}cm
- Gender: ${personalDetails.gender}
- BMI: ${personalDetails.height > 0 ? (personalDetails.weight / ((personalDetails.height/100) ** 2)).toFixed(1) : 'Not calculated'}
` : '';

    const medicationContext = medications && medications.length > 0 ? `
CURRENT PRESCRIPTION:
${medications.map(med => `- ${med.name} (${med.dosage}) - ${med.schedule}`).join('\n')}
` : '';

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${contextInfo}${medicationContext}

PATIENT QUESTION: ${userMessage}

Please provide a helpful, personalized response that addresses their question while maintaining appropriate medical safety guidelines. Use clean plain text formatting without any formatting symbols and make it mobile-friendly with proper spacing.` }
    ];

    return await this.makeRequest(messages);
  }

  // Test OCR functionality
  static async testOCRCapabilities(): Promise<{ success: boolean; details: string }> {
    return await OCRService.testOCR();
  }
}

export default OpenRouterAPI;