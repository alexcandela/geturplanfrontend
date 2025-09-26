import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/authservice.service';
import { User, UserData, UserResponse } from '../../core/interfaces/user';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { EditProfileForm } from '../../core/interfaces/edit-profile-form';
import { EditProfileService } from '../../core/services/edit-profile.service';
import { ToastComponent } from '../../components/toast-notification/toast-notification.component';
import { NotificationService } from '../../core/services/notification.service';
import { imageValidator } from '../../core/validadores';
import { backendurl } from '../../core/environments/backendurl';
@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, ToastComponent],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.scss',
})
export class EditarPerfilComponent implements OnInit {
  editProfileForm: FormGroup;
  user: User = {
    id: 0,
    username: '',
    email: '',
    description: '',
    img: '',
    instagram: '',
    facebook: '',
    tiktok: '',
  };

  defaultImg: string = `https://xvzgprxywegcfprvqhtr.supabase.co/storage/v1/object/public/storage/images/default/default_user.png`;

  token: string | null = null;
  userData: UserData | null = null;
  loading = signal(true);

  userImg: WritableSignal<string> = signal('');

  constructor(
    private titulo: Title,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private editProfileService: EditProfileService,
    private notificationService: NotificationService
  ) {
    titulo.setTitle('Perfil');
    this.editProfileForm = this.fb.group({
      img: [this.user.img],
      description: [this.user.description],
      instagram: [this.user.instagram],
      facebook: [this.user.facebook],
      tiktok: [this.user.tiktok],
    });
  }

  clearToken() {
    localStorage.removeItem('jwt');
    this.userData = null;
  }

  getUser = (username: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      this.userService.getUser(this.token, username).subscribe(
        (response: UserResponse) => {
          if (response.status === 'success') {
            this.user = response.user;
            this.editProfileForm.patchValue({
              description: this.user.description,
              instagram: this.user.instagram || null,
              facebook: this.user.facebook || null,
              tiktok: this.user.tiktok || null,
            });
            this.loading.set(false);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  getUsername = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.userData = this.authService.decodeToken(this.token) as UserData;
          this.getUser(this.userData.username);
        } else {
          this.clearToken();
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    }
  };

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.editProfileForm.patchValue({
        img: file,
      });
      this.user.img = URL.createObjectURL(file);
      // Marcar el control de la imagen como tocado para validar
      // this.editProfileForm.get('img')?.markAsTouched();
    }
  }

  deleteImg = () => {
    if (
      this.user.img !== this.defaultImg
    ) {
      this.user.img = this.defaultImg;
    } else {
      this.notificationService.showNotification(
        'No se puede borrar la imagen.',
        'error'
      );
    }
  };

  generateFormData = () => {
    const formData = new FormData();

    if (
      this.user.img === 'http://localhost:8000/storage/default/default_user.png'
    ) {
      formData.append('default_img', 'true');
    }
    formData.append(
      'description',
      this.editProfileForm.get('description')?.value == null
        ? ''
        : this.editProfileForm.get('description')?.value
    );

    formData.append(
      'instagram',
      this.editProfileForm.get('instagram')?.value == null
        ? ''
        : this.editProfileForm.get('instagram')?.value
    );
    formData.append(
      'facebook',
      this.editProfileForm.get('facebook')?.value == null
        ? ''
        : this.editProfileForm.get('facebook')?.value
    );
    formData.append(
      'tiktok',
      this.editProfileForm.get('tiktok')?.value == null
        ? ''
        : this.editProfileForm.get('tiktok')?.value
    );
    const imgFile = this.editProfileForm.get('img')?.value;
    if (imgFile) {
      formData.append('img', imgFile);
    }
    return formData;
  };

  onSubmit = (formValue: EditProfileForm) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwt');
      if (token) {
        const formData = this.generateFormData();

        this.editProfileService.editProfile(token, formData).subscribe(
          (response: any) => {
            if (response.status === 'success') {
              this.notificationService.showNotification(
                'Perfil actualizado correctamente',
                'success'
              );
            }
          },
          (error) => {
            console.log(error);
            this.notificationService.showNotification(
              'Ha habido un error al editar los datos',
              'error'
            );
          }
        );
      } else {
        this.router.navigate(['/login']);
      }
    }
  };

  sendEmail = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwt');
      if (token) {
        this.userService.sendEmailResetPassword(token).subscribe(
          (response: any) => {
            if (response.status === 'success') {
              this.notificationService.showNotification(
                'Se ha enviado un correo a tu dirección. Por favor, revisa tu bandeja de entrada.',
                'info'
              );
            }
          },
          (error) => {
            console.log(error);
            this.notificationService.showNotification(
              'Ha habido un error.',
              'error'
            );
          }
        );
      }
    }
  };

  ngOnInit(): void {
    this.getUsername();
  }
}
