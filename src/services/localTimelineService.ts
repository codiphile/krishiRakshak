import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMELINE_HISTORY_KEY = '@timeline_history';

export interface TimelineData {
  id: string;
  crop: string;
  landSize: string;
  location: string;
  timeline: any[];
  nextCrop: string;
  createdAt: string;
}

export const localTimelineService = {
  async getTimelineHistory(): Promise<TimelineData[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(TIMELINE_HISTORY_KEY);
      const history = jsonValue != null ? JSON.parse(jsonValue) : [];
      // Sort by date, newest first
      history.sort((a: TimelineData, b: TimelineData) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return history;
    } catch (e) {
      console.error('Failed to fetch timeline history from storage', e);
      return [];
    }
  },

  async saveTimeline(timelineData: Omit<TimelineData, 'id' | 'createdAt'>): Promise<TimelineData> {
    try {
      const history = await this.getTimelineHistory();
      const newTimeline: TimelineData = {
        ...timelineData,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const newHistory = [newTimeline, ...history];
      const jsonValue = JSON.stringify(newHistory);
      await AsyncStorage.setItem(TIMELINE_HISTORY_KEY, jsonValue);
      console.log('💾 Timeline saved locally.');
      return newTimeline;
    } catch (e) {
      console.error('Failed to save timeline to storage', e);
      throw e;
    }
  },
};
