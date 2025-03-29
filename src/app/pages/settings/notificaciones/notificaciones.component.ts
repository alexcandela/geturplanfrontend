import { Component } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastComponent } from '../../../components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [ToastComponent],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss'
})
export class NotificacionesComponent {
  constructor (
    private notificationService: NotificationService,
  ) {

  }

  error(){
    this.notificationService.showNotification(
      'Error al actualizar el perfil',
      'error'
    );
  }
  success(){
    this.notificationService.showNotification(
      'Error al actualizar el perfil.',
      'success'
    );
  }
  info(){
    this.notificationService.showNotification(
      'Error al actualizar el perfil.',
      'info'
    );
  }
  warning(){
    this.notificationService.showNotification(
      'Error al actualizar el perfil.',
      'warning'
    );
  }
  
}
