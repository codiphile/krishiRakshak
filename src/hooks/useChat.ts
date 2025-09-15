import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../components/ChatMessage';
import { geminiService } from '../services/gemini';

const CHAT_STORAGE_KEY = '@krishi_chat_messages';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from storage
  const loadMessages = useCallback(async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } else {
        // Add welcome message if no messages exist
        const welcomeMessage: Message = {
          id: 'welcome',
          text: '🌾 नमस्ते! I am KrishiRakshak AI, your farming assistant. I can help you with:\n\n• Crop cultivation and management\n• Plant diseases and pest control\n• Irrigation and water management\n• Weather-based farming decisions\n• Government schemes for farmers\n• Market prices and selling tips\n\nHow can I help you today?',
          isUser: false,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  // Save messages to storage
  const saveMessages = useCallback(async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (text: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text,
      isUser: true,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await geminiService.generateResponse(text);

      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } catch (error) {
      console.error('Error getting AI response:', error);

      // Add error message
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        text: '🌾 Sorry, I encountered an error. Please check your internet connection and try again. If the problem persists, make sure the Gemini API key is configured correctly.',
        isUser: false,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, saveMessages]);

  // Clear chat history
  const clearMessages = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
      setMessages([]);
      // Reload welcome message
      await loadMessages();
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  }, [loadMessages]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    loadMessages
  };
};