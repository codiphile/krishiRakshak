import Constants from 'expo-constants';
import { farmerProfileService } from './farmerProfile';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor() {
    // For now, use the working API key directly
    this.apiKey = 'AIzaSyCmdUzo96T01Mx0mQX27LCQTfOGAQ5_s2I';

    console.log('Gemini API key loaded:', this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'MISSING');
  }

  async generateResponse(message: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Get farmer profile for personalized context
    const farmerProfile = await farmerProfileService.getProfile();
    const profileContext = farmerProfile ? farmerProfileService.generateDetailedContext(farmerProfile) : '';

    // Create farming-focused system prompt with personalized context
    const systemPrompt = `You are KrishiRakshak AI, an expert agricultural assistant helping farmers in India. You provide practical, actionable advice on:

🌾 Crop cultivation and management
🌱 Plant diseases and pest control
💧 Irrigation and water management
🌡️ Weather-based farming decisions
🌿 Organic and sustainable farming
🛍️ Market prices and crop selling
🔧 Farm equipment and tools
📊 Government schemes for farmers

Always:
- Give practical, easy-to-understand advice
- Consider Indian farming conditions and seasons
- Suggest cost-effective solutions
- Mention relevant government schemes when applicable (PM-KISAN, Soil Health Card, etc.)
- Use simple language and include Hindi terms when helpful
- Be encouraging and supportive
- Keep responses concise but informative
- Include emojis for better readability
- MOST IMPORTANT: Use the farmer's profile information below to give personalized, relevant advice

${profileContext ? `${profileContext}` : ''}${conversationHistory.length > 0 ? `Previous conversation context:\n${conversationHistory.map(h => `${h.role}: ${h.content}`).join('\n')}\n\n` : ''}Current farmer question: ${message}

Please provide a helpful, personalized response based on the farmer's profile information above:`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error:', response.status, errorData);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();

      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response generated');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  // Method to search for agricultural retailers using AI
  async searchRetailersWithAI(latitude: number, longitude: number, category: string = 'all', maxDistance: number = 25): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `You are a local business directory expert. Find agricultural retailers near location coordinates: ${latitude}, ${longitude} (within ${maxDistance}km radius).

Search for retailers that sell:
${category === 'all' ? '- Fertilizers, pesticides, seeds, farming equipment' : `- ${category}`}

Focus on government-certified dealers and those offering subsidies.

Return response in this EXACT JSON format:
{
  "retailers": [
    {
      "name": "Store Name",
      "address": "Complete address with pincode",
      "latitude": 28.1234,
      "longitude": 77.5678,
      "phone": "+91 98765 43210",
      "category": "fertilizers|pesticides|seeds|equipment|general",
      "rating": 4.5,
      "reviews": 120,
      "openHours": "9:00 AM - 7:00 PM",
      "isGovernmentCertified": true,
      "subsidyAvailable": true,
      "description": "Brief description of the store",
      "products": [
        {
          "name": "Product name",
          "category": "Product category",
          "price": 1000,
          "subsidyPrice": 700,
          "subsidyPercentage": 30,
          "description": "Product description"
        }
      ]
    }
  ]
}

Provide real, accurate information for agricultural retailers in this area. If you cannot find exact data, create realistic examples based on typical agricultural retailers in India with proper government certification and subsidy information.`;

    try {
      console.log('Making API request with key:', this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'MISSING');

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3, // Lower temperature for more consistent JSON
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error:', response.status, errorData);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();

      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response generated');
      }
    } catch (error) {
      console.error('Error calling Gemini API for retailer search:', error);
      throw error;
    }
  }

  async analyzeImage(imageUri: string, analysisType: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const mimeType = 'image/jpeg';
    const base64Image = await this.uriToBase64(imageUri);

    const prompt = this.getAnalysisPrompt(analysisType);

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error:', response.status, errorData);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();

      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
        const jsonString = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonString);
      } else {
        throw new Error('No response generated');
      }
    } catch (error) {
      console.error('Error calling Gemini API for image analysis:', error);
      throw error;
    }
  }

  private getAnalysisPrompt(analysisType: string): string {
    const basePrompt = `You are an expert agricultural analyst. Analyze the attached image for the specified analysis type and provide a detailed report in JSON format. The report should include the following fields:
- "primary_analysis": A summary of the main findings.
- "detailed_findings": A more detailed breakdown of the analysis.
- "severity_level": The severity of the issue (e.g., "high", "medium", "low").
- "treatment_plan": A recommended course of action.
- "prevention_measures": Steps to prevent future issues.
- "confidence_score": A score from 0 to 1 indicating your confidence in the analysis.

Return the response in this EXACT JSON format:
{
  "primary_analysis": "...",
  "detailed_findings": "...",
  "severity_level": "...",
  "treatment_plan": "...",
  "prevention_measures": "...",
  "confidence_score": 0.95
}`;

    switch (analysisType) {
      case 'crop':
        return `Analyze the overall health of the crop in the image. ${basePrompt}`;
      case 'pest':
        return `Identify any pests present in the image and assess the extent of the infestation. ${basePrompt}`;
      case 'disease':
        return `Detect any plant diseases visible in the image and determine the stage of infection. ${basePrompt}`;
      case 'soil':
        return `Analyze the soil in the image, focusing on its texture, color, and any visible characteristics that might indicate its health or composition. ${basePrompt}`;
      default:
        return basePrompt;
    }
  }

  private async uriToBase64(uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  
  // Method to transcribe audio using Gemini (experimental - may not work with current API)
  async transcribeAudio(audioBase64: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log('🎤 Attempting audio transcription with Gemini...');

    // Try using gemini-1.5-pro which might have better audio support
    const audioUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

    const prompt = `Please transcribe the following audio into text. The audio is likely in Hindi, English, or a mix of both languages (Hinglish). Please provide the transcription in English text. If the audio contains farming-related terms, please include them accurately. Return only the transcribed text without any additional formatting or explanation.`;

    try {
      const response = await fetch(`${audioUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: 'audio/m4a', // Try m4a mime type
                    data: audioBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('🚫 Gemini audio transcription error:', response.status, errorData);

        // Try alternative approach - just throw error to trigger fallback
        throw new Error(`Gemini audio API not available: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();

      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
        const transcription = data.candidates[0].content.parts[0].text.trim();
        console.log('✅ Audio transcription successful:', transcription);
        return transcription;
      } else {
        throw new Error('No transcription generated from audio');
      }
    } catch (error) {
      console.log('⚠️ Gemini audio transcription not available:', error);
      // Don't log as error since this is expected - audio transcription may not be supported
      throw error;
    }
  }

  // Method to get farming-specific suggestions
  getFarmingSuggestions(): string[] {
    return [
      "What crops should I grow this season?",
      "How to identify and treat crop diseases?",
      "Best irrigation practices for my farm",
      "Government schemes for farmers",
      "How to improve soil fertility?",
      "Pest control methods",
      "Weather-based farming tips",
      "Market prices and selling tips"
    ];
  }
}

export const geminiService = new GeminiService();