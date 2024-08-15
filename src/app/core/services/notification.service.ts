import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Notification {
  message: string;
  type: string; // Definiendo tipos de notificación
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  showNotification(message: string, type: string = 'info') {
    this.notificationSubject.next({ message, type });
  }
  
}
