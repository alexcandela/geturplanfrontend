import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.scss',
})
export class ToastComponent implements OnInit {
  message: string | null = null;
  type: string | null = null;
  icon: WritableSignal<string | null> = signal(null);
  hide: boolean = false;

  constructor(private notificationService: NotificationService) {}

  getIconClass = () => {
    switch (this.type) {
      case 'info':
        this.icon.set('fa-solid fa-circle-info');
        break;
      case 'error':
        this.icon.set('fa-solid fa-circle-exclamation');
        break;
      case 'warning':
        this.icon.set('fa-solid fa-triangle-exclamation');
        break;
      case 'success':
        this.icon.set('fa-solid fa-circle-check');
        break;

      default:
        break;
    }
  };

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe((notification) => {
      this.message = notification.message;
      this.type = notification.type;
      this.getIconClass();
      this.hide = false;
      setTimeout(() => {
        this.hide = true;
      }, 3000);
      setTimeout(() => {
        this.message = null;
        this.type = null;
      }, 3500);
    });
  }
}
