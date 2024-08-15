import { Component, Signal, WritableSignal, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Login } from '../../core/interfaces/login';
import { FormsModule, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../core/services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
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

  constructor(
    private fb: FormBuilder,
    private service: LoginService,
    private titulo: Title,
    private router: Router
  ) {
    titulo.setTitle('Login');
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberme: [false]
    });
  }

  showpassword = () => {
    this.inputtype() === 'password' ? this.inputtype.set('text') : this.inputtype.set('password');
    this.dashed() === false ? this.dashed.set(true) : this.dashed.set(false);
    this.dashed() === false ? this.showPasswordImg.set(this.eye) : this.showPasswordImg.set(this.dashedeye);
  };

  onSubmit(loginData: Login): void {
    if (this.loginForm.valid) {
      this.service.login(loginData, { withCredentials: true }).subscribe(
            (response: any) => {
              if (response.status === 'success') {
                localStorage.setItem('jwt', response.token);
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
