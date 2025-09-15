# 🎤 Groq Whisper AI Setup for Voice Input

## Overview
KrishiRakshak now uses **Groq Whisper AI** for accurate voice-to-text conversion, supporting both Hindi and English languages.

## 🚀 Quick Setup

### 1. Get Your Groq API Key
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the API key (starts with `gsk_`)

### 2. Configure the API Key
Open `/src/services/groqService.ts` and replace the placeholder:

```typescript
// Replace this line:
this.apiKey = 'gsk_YOUR_GROQ_API_KEY_HERE';

// With your actual API key:
this.apiKey = 'gsk_abcd1234...your_actual_key';
```

### 3. Features Enabled

✅ **Multi-language Support**: Hindi, English, and Hinglish
✅ **High Accuracy**: Powered by Whisper-large-v3 model
✅ **Fast Processing**: Groq's optimized inference
✅ **Fallback Options**: Smart category selection if API fails
✅ **Farming Context**: Optimized for agricultural terminology

## 🎯 How It Works

1. **Voice Recording**: User taps microphone and speaks
2. **AI Processing**: Audio sent to Groq Whisper API
3. **Transcription**: AI converts speech to text
4. **Fallback**: If AI fails, category selection appears
5. **Chat Integration**: Transcribed text sent to farming AI

## 🔧 Technical Details

### Supported Audio Formats
- M4A (primary)
- MP3, WAV, FLAC, OGG, WebM

### API Configuration
- **Model**: `whisper-large-v3`
- **Language**: Auto-detect (Hindi/English)
- **Temperature**: 0.1 (for accuracy)
- **Response Format**: Plain text

### Error Handling
- Invalid API key detection
- Rate limit handling
- Audio format validation
- Network error recovery
- Graceful fallback to categories

## 💰 Pricing
Groq offers:
- **Free Tier**: Limited requests per day
- **Paid Plans**: Higher limits and priority
- Check [Groq Pricing](https://groq.com/pricing) for current rates

## 🛠️ Troubleshooting

### "API key not configured" Error
- Ensure you've replaced the placeholder in `groqService.ts`
- Check that your API key starts with `gsk_`

### "Rate limit exceeded" Error
- Wait a few minutes and try again
- Consider upgrading to a paid Groq plan

### Audio conversion errors
- Ensure device has microphone permissions
- Try recording again with clear speech

### Network issues
- Check internet connection
- App will automatically fall back to category selection

## 🔄 Fallback System

If Groq Whisper fails, users see:
- **Primary**: Try Groq API again
- **Secondary**: Category selection dialog
- **Tertiary**: Type message manually

## 📱 User Experience

1. **Tap microphone** → Recording starts
2. **Speak clearly** → Visual feedback shown
3. **Tap stop** → AI processes audio
4. **Get transcription** → Text appears in input
5. **Send message** → AI responds with context

## 🌾 Farming Optimizations

The system is optimized for:
- Agricultural terminology (Hindi/English)
- Common farming questions
- Government scheme names
- Crop and disease names
- Irrigation and equipment terms

## 🔒 Privacy & Security

- Audio processed by Groq (external service)
- No audio stored locally after transcription
- API key stored securely in app
- User can always opt for typing instead

---

**Ready to test?** Replace the API key and start using voice input in your farming assistant! 🚀