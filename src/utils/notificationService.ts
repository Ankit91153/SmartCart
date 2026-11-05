import { Alert } from 'react-native';

class NotificationService {
  private timerId: ReturnType<typeof setTimeout> | null = null;

  scheduleAbandonedCartReminder(delayMs: number = 15000) {
    console.log("STARTCANCEL");

    this.cancelAbandonedCartReminder();
    console.log("CANCELEd");

    this.timerId = setTimeout(() => {
      this.triggerNotification(
        'You left items in your cart!',
        'Don’t miss out! Your favorite items are waiting for you in SmartCart.',
      );
      this.timerId = null;

    }, delayMs);
  }

  cancelAbandonedCartReminder() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private triggerNotification(title: string, message: string) {
    Alert.alert(title, message, [{ text: 'View Cart' }], { cancelable: true });
  }
}

export const notificationService = new NotificationService();
