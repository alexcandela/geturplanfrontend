import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { User } from '../../../core/interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from '../../../components/toast-notification/toast-notification.component';
import { GeneralSettings } from '../../../core/interfaces/general-settings';
import { EditProfileService } from '../../../core/services/edit-profile.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [ReactiveFormsModule, ToastComponent],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
})
export class GeneralComponent implements OnInit {
  @Input() user: User | null = {
    id: 0,
    username: '',
    email: '',
    description: '',
    img: '',
    instagram: '',
    facebook: '',
    tiktok: '',
  };
  editGeneral: FormGroup;
  submitted = signal(false);

  conflictUsername = signal(false);
  conflictEmail = signal(false);

  constructor(
    private fb: FormBuilder,
    private editProfileService: EditProfileService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.editGeneral = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  @Output() refresh = new EventEmitter<{ username: string; email: string }>();

  onSubmit = (value: GeneralSettings) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwt');
      if (token) {
        if (this.editGeneral.valid) {
          this.editProfileService.generalSettings(token, value).subscribe(
            (response: any) => {
              if (response.status === 'success') {
                localStorage.setItem('jwt', response.token);
                window.location.reload();
                this.refresh.emit({
                  username: response.newUsername,
                  email: response.newEmail,
                });
                this.notificationService.showNotification(
                  'Perfil actualizado correctamente.',
                  'success'
                );
              }
            },
            (error) => {
              if (error.status === 409) {
                if (error.error.type === 'username') {
                  this.conflictUsername.set(true);
                }

                if (error.error.type === 'email') {
                  this.conflictEmail.set(true);
                }
              }

              this.notificationService.showNotification(
                'Error al actualizar el perfil.',
                'error'
              );
            }
          );
        } else {
          this.submitted.set(true);
          this.editGeneral.markAllAsTouched();
        }
      } else {
        this.router.navigate(['/login']);
      }
    }
  };

  ngOnInit(): void {
    this.editGeneral.patchValue({
      username: this.user?.username,
      email: this.user?.email,
    });
  }
}
