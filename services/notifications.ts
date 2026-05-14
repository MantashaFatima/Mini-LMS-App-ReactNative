import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const BOOKMARK_THRESHOLD = 5;
const REMINDER_HOURS = 24;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  static async checkAndSendBookmarkNotification(bookmarkCount: number) {
    if (bookmarkCount >= BOOKMARK_THRESHOLD) {
      const hasNotified = await AsyncStorage.getItem('bookmarkNotificationSent');
      if (!hasNotified) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Great Progress! 📚',
            body: `You've bookmarked ${bookmarkCount} courses! Keep up the learning momentum.`,
            sound: true,
          },
          trigger: {
            type: 'timeInterval',
            seconds: 1, // Show immediately (1 second)
          },
        });
        await AsyncStorage.setItem('bookmarkNotificationSent', 'true');
      }
    }
  }

  static async scheduleReminderNotification() {
    // Cancel any existing reminder
    await Notifications.cancelScheduledNotificationAsync('reminder');

    // Schedule new reminder for 24 hours from now
    await Notifications.scheduleNotificationAsync({
      identifier: 'reminder',
      content: {
        title: 'Time to Learn! 🎓',
        body: 'It\'s been 24 hours since you last opened LearnSphere. Continue your learning journey!',
        sound: true,
      },
      trigger: {
        type: 'timeInterval',
        seconds: REMINDER_HOURS * 60 * 60,
        repeats: false,
      },
    });

    await AsyncStorage.setItem('lastAppOpen', Date.now().toString());
  }

  static async cancelReminderNotification() {
    await Notifications.cancelScheduledNotificationAsync('reminder');
  }

  static async checkReminderOnAppOpen() {
    const lastOpenStr = await AsyncStorage.getItem('lastAppOpen');
    if (lastOpenStr) {
      const lastOpen = parseInt(lastOpenStr);
      const hoursSinceLastOpen = (Date.now() - lastOpen) / (1000 * 60 * 60);

      if (hoursSinceLastOpen >= REMINDER_HOURS) {
        // Schedule reminder for next 24 hours
        await this.scheduleReminderNotification();
      } else {
        // Cancel existing and reschedule
        await this.cancelReminderNotification();
        await this.scheduleReminderNotification();
      }
    } else {
      // First time opening, schedule reminder
      await this.scheduleReminderNotification();
    }
  }

  static async initialize() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const hasPermission = await this.requestPermissions();
    if (hasPermission) {
      await this.checkReminderOnAppOpen();
    }

    return hasPermission;
  }
}