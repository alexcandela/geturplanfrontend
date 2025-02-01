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
import {
  GeneralSettings,
  updatePassword,
} from '../../../core/interfaces/general-settings';
import { EditProfileService } from '../../../core/services/edit-profile.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [ReactiveFormsModule, ToastComponent],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
})
export class PasswordComponent implements OnInit {
  @Input() user: User | null = {
    username: '',
    email: '',
    description: '',
    img: '',
    instagram: '',
    facebook: '',
    tiktok: '',
  };
  editPassword: FormGroup;
  submitted = signal(false);

  conflictActualPass = signal(false);

  constructor(
    private fb: FormBuilder,
    private editProfileService: EditProfileService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.editPassword = this.fb.group({
      actualPass: ['', [Validators.required]],
      newPass: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/),
        ],
      ],
    });
  }

  @Output() refresh = new EventEmitter<{ username: string; email: string }>();

  onSubmit = (value: updatePassword) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwt');
      if (token) {
        if (this.editPassword.valid) {
          this.editProfileService.updatePassword(token, value).subscribe(
            (response: any) => {
              if (response.status === 'success') {
                window.location.reload();
                this.notificationService.showNotification(
                  'Contraseña actualizada correctamente.',
                  'success'
                );
              }
            },
            (error) => {
              if (error.status === 409) {
                this.conflictActualPass.set(true);
              }
            }
          );
        } else {
          this.submitted.set(true);
          this.editPassword.markAllAsTouched();
        }
      } else {
        this.router.navigate(['/login']);
      }
    }
  };

  ngOnInit(): void {}
}
