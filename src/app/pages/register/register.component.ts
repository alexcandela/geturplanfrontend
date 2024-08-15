import { Component, WritableSignal, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RegisterService } from '../../core/services/register.service';
import { Register } from '../../core/interfaces/register';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = signal(false);
  inputtype: WritableSignal<string> = signal('password');
  dashed = signal(false);
  eye: string = '/assets/icons/eye.svg';
  dashedeye: string = '/assets/icons/dashed-eye.svg';
  showPasswordImg: WritableSignal<string> = signal(this.eye);
  usernameBackend = signal(false);
  emailBackend = signal(false);

  constructor(
    private fb: FormBuilder,
    private service: RegisterService,
    private titulo: Title,
    private router: Router
  ) {
    titulo.setTitle('Registrarse');
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
      ]]      
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

  reset = () => {
    this.submitted.set(false);
    this.emailBackend.set(false);
    this.usernameBackend.set(false);
  }

  onSubmit = (registerData: Register) => {
    this.reset();
    if (this.registerForm.valid) {
      this.service.login(registerData, { withCredentials: true }).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            localStorage.setItem('jwt', response.token);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          if (error.status === 422) {
            if (error.error.errors.email) {
              this.emailBackend.set(true);
            }
            if (error.error.errors.username) {
              this.usernameBackend.set(true);
            }
          }
        }
      );
    } else {
      this.submitted.set(true);
      this.registerForm.markAllAsTouched();
    }
  };
}
