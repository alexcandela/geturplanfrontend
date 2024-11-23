import { Component, Signal, WritableSignal, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Login } from '../../core/interfaces/login';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from '../../core/services/login.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { ToastComponent } from '../../components/toast-notification/toast-notification.component';
import { AuthService } from '../../core/services/authservice.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = signal(false);
  register: boolean = false;
  rememberme = signal(false);
  showErrorMessage = signal(false);
  message: WritableSignal<string> = signal('');
  inputtype: WritableSignal<string> = signal('password');
  dashed = signal(false);
  eye: string = '/assets/icons/eye.svg';
  dashedeye: string = '/assets/icons/dashed-eye.svg';
  showPasswordImg: WritableSignal<string> = signal(this.eye);
  token: string | null = null;
  userData: Object = {};
  

  constructor(
    private fb: FormBuilder,
    private service: LoginService,
    private titulo: Title,
    private router: Router,
    private notifiationService: NotificationService,
    private authService: AuthService
  ) {
    titulo.setTitle('Login');
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberme: [false],
    });
  }

  showpassword = () => {
    this.inputtype() === 'password'
      ? this.inputtype.set('text')
      : this.inputtype.set('password');
    this.dashed() === false ? this.dashed.set(true) : this.dashed.set(false);
    this.dashed() === false
      ? this.showPasswordImg.set(this.eye)
      : this.showPasswordImg.set(this.dashedeye);
  };

  sendEmail = () => {
    // this.notifiationService.showNotification(
    //   'Se ha enviado un correo a tu dirección. Por favor, revisa tu bandeja de entrada.',
    //   'info'
    // );
  };

  onSubmit(loginData: Login): void {
    if (this.loginForm.valid) {
      this.service.login(loginData, { withCredentials: true }).subscribe(
        
        (response: any) => {
          if (response.status === 'success') {
            localStorage.setItem('jwt', response.token);
            if (this.authService.isTokenValid(response.token)) {
              this.userData = this.authService.decodeToken(response.token);
              // console.log(this.userData);
              
            }
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.showErrorMessage.set(true);
          if (error.status === 401) {
            this.message.set('El correo o la contraseña son incorrectos.');
          } else {
            this.message.set('Ocurrió un error al intentar iniciar sesión.');
          }
        }
      );
    } else {
      this.submitted.set(true);
      this.loginForm.markAllAsTouched();
    }
  }
}
