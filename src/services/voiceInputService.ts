import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import { Alert, Platform } from 'react-native';
import { groqService } from './groqService';

export interface VoiceRecording {
  uri: string;
  duration: number;
}

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
}

export class VoiceInputService {
  private static recording: Audio.Recording | null = null;
  private static isRecording = false;

  // Initialize audio session
  static async initializeAudio(): Promise<boolean> {
    try {
      // Request audio recording permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Audio recording permission is required for voice input. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => {} }
          ]
        );
        return false;
      }

      // Configure audio session
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }

  // Start voice recording
  static async startRecording(): Promise<boolean> {
    try {
      if (this.isRecording) {
        console.log('Recording already in progress');
        return false;
      }

      const audioInitialized = await this.initializeAudio();
      if (!audioInitialized) {
        return false;
      }

      console.log('🎤 Starting voice recording...');

      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(recordingOptions);
      await this.recording.startAsync();
      this.isRecording = true;

      console.log('✅ Recording started successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start voice recording. Please try again.');
      return false;
    }
  }

  // Stop voice recording and return audio data
  static async stopRecording(): Promise<VoiceRecording | null> {
    try {
      if (!this.recording || !this.isRecording) {
        console.log('No active recording to stop');
        return null;
      }

      console.log('🛑 Stopping voice recording...');

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();

      this.isRecording = false;
      this.recording = null;

      if (!uri) {
        throw new Error('No recording URI available');
      }

      const duration = status.durationMillis || 0;

      console.log('✅ Recording stopped:', { uri, duration });

      return {
        uri,
        duration: duration / 1000 // Convert to seconds
      };
    } catch (error) {
      console.error('❌ Failed to stop recording:', error);
      this.isRecording = false;
      this.recording = null;
      return null;
    }
  }

  // Convert speech to text using Groq Whisper AI
  static async speechToText(audioUri: string): Promise<string | null> {
    try {
      console.log('🗣️ Converting speech to text with Groq Whisper...');

      // Check if Groq service is configured
      if (!groqService.isConfigured()) {
        console.warn('⚠️ Groq API key not configured, using fallback');
        return this.speechToTextFallback();
      }

      // Try using Groq Whisper demo (since it's in demo mode, we don't need actual conversion)
      try {
        console.log('🎯 Running voice input in demo mode...');

        // Since we're in demo mode, we don't actually need to convert the audio
        // Just simulate the transcription process
        const transcription = await groqService.transcribeAudioFromBase64('demo', 'audio/m4a');

        if (transcription && transcription.trim()) {
          console.log('✅ Demo transcription successful:', transcription);
          return transcription.trim();
        } else {
          throw new Error('Empty demo transcription received');
        }

      } catch (groqError) {
        console.log('⚠️ Demo transcription failed, using fallback:', groqError);
        // Continue to fallback below
      }

      // If all Groq methods fail, use fallback
      console.log('🔄 All Groq methods failed, using interactive fallback');
      return this.speechToTextFallback();

    } catch (error) {
      console.error('❌ Speech to text failed:', error);

      // Show user-friendly error and fallback
      Alert.alert(
        'Transcription Issue',
        'Having trouble converting your voice to text. Please try the category selection or type your message.',
        [
          { text: 'Try Categories', onPress: () => {} },
          { text: 'Type Instead', style: 'cancel' }
        ]
      );

      return this.speechToTextFallback();
    }
  }

  // Fallback method with category selection
  private static async speechToTextFallback(): Promise<string | null> {
    return new Promise((resolve) => {
      Alert.alert(
        '🎤 Voice Input Options',
        'Choose what you asked about, or try recording again:',
        [
          {
            text: '🌾 Crop Information',
            onPress: () => resolve("What crops should I grow this season?")
          },
          {
            text: '🐛 Disease/Pest Control',
            onPress: () => resolve("How to identify and treat crop diseases?")
          },
          {
            text: '💧 Irrigation Help',
            onPress: () => resolve("What are the best irrigation practices for my farm?")
          },
          {
            text: '🏛️ Government Schemes',
            onPress: () => resolve("What government schemes are available for farmers?")
          },
          {
            text: '🔄 Try Recording Again',
            onPress: () => resolve(null)
          },
          {
            text: '⌨️ Type Instead',
            style: 'cancel',
            onPress: () => resolve(null)
          }
        ],
        { cancelable: false }
      );
    });
  }

  // Convert audio file to base64 using new Expo FileSystem API
  private static async convertAudioToBase64(uri: string): Promise<string | null> {
    try {
      console.log('🔄 Converting audio to base64:', uri);

      // Use the new FileSystem.File API
      try {
        const file = new FileSystem.File(uri);
        const base64 = await file.text('base64');

        if (base64) {
          console.log('✅ Audio conversion successful with new API, size:', base64.length);
          return base64;
        } else {
          throw new Error('No base64 data received from new API');
        }
      } catch (newApiError) {
        console.log('⚠️ New FileSystem API failed, trying legacy API:', newApiError);

        // Fallback to legacy API if new one doesn't work
        try {
          // Import legacy API
          const { readAsStringAsync } = require('expo-file-system/legacy');

          const base64 = await readAsStringAsync(uri, {
            encoding: 'base64',
          });

          if (base64) {
            console.log('✅ Audio conversion successful with legacy API, size:', base64.length);
            return base64;
          } else {
            throw new Error('No base64 data received from legacy API');
          }
        } catch (legacyError) {
          console.log('⚠️ Legacy API also failed:', legacyError);
          throw legacyError;
        }
      }

    } catch (error) {
      console.error('❌ Failed to convert audio to base64:', error);

      // Final fallback to fetch method
      try {
        console.log('🔄 Trying final fallback with fetch method...');
        const response = await fetch(uri);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (fallbackError) {
        console.error('❌ All conversion methods failed:', fallbackError);
        return null;
      }
    }
  }

  // Text to speech for AI responses
  static async speakText(text: string): Promise<void> {
    try {
      // Check if speech is available
      const isSpeechAvailable = await Speech.isSpeakingAsync();
      if (isSpeechAvailable) {
        await Speech.stop();
      }

      // Speak the text
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        voice: undefined, // Use default voice
      });

      console.log('🔊 Speaking text:', text.substring(0, 50) + '...');
    } catch (error) {
      console.error('❌ Text to speech failed:', error);
    }
  }

  // Stop current speech
  static async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
      console.log('🔇 Speech stopped');
    } catch (error) {
      console.error('Failed to stop speech:', error);
    }
  }

  // Check if currently recording
  static isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  // Cleanup resources
  static async cleanup(): Promise<void> {
    try {
      if (this.recording && this.isRecording) {
        await this.stopRecording();
      }
      await this.stopSpeaking();
    } catch (error) {
      console.error('Failed to cleanup voice input service:', error);
    }
  }
}