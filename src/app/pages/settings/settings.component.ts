import {
  Component,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { GeneralComponent } from './general/general.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { PasswordComponent } from './password/password.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { RedesSocialesComponent } from './redes-sociales/redes-sociales.component';
import { AuthService } from '../../core/services/authservice.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { User } from '../../core/interfaces/user';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    GeneralComponent,
    EditarPerfilComponent,
    PasswordComponent,
    NotificacionesComponent,
    RedesSocialesComponent,
    CommonModule,
    RouterLink
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  selectedComponent: WritableSignal<string> = signal('general');
  user: User | null = null;

  bold = signal(false);

  frases: string[] = [
    'Ajusta tus preferencias generales de la cuenta.',
    'Actualiza tu información personal y foto de perfil.',
    'Cambia tu contraseña para mantener tu cuenta segura.',
    'Conecta o desconecta tus cuentas de redes sociales.',
    'Configura tus preferencias de notificación.',
    'Elimina tu cuenta de forma permanente.',
  ];
  fraseSeleccionada: WritableSignal<string> = signal(this.frases[0]);

  constructor(
    private titulo: Title,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    titulo.setTitle('Configuración');
  }

  checkLogged = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwt');
      if (!token || !this.authService.isTokenValid(token)) {
        this.router.navigate(['/login']);
      }
    }
  };

  seleccionarComponente = (data: string) => {
    this.selectedComponent.set(data);
    switch (data) {
      case 'general':
        this.fraseSeleccionada.set(this.frases[0]);
        break;
      case 'editar':
        this.fraseSeleccionada.set(this.frases[1]);
        break;
      case 'password':
        this.fraseSeleccionada.set(this.frases[2]);
        break;
      case 'redes':
        this.fraseSeleccionada.set(this.frases[3]);
        break;
      case 'notificaciones':
        this.fraseSeleccionada.set(this.frases[4]);
        break;

      default:
        break;
    }
  };

  toggleClase() {
    this.bold.set(!this.bold());
    console.log(this.bold());
  }

  refresh = (object: any) => {
    const localStorageUser = this.userService.getUserFromLocalStorage();
    if (localStorageUser) {
      localStorageUser.username = object.username;
      localStorageUser.email = object.email;
      this.userService.setUser(localStorageUser);
    }
  };

  ngOnInit(): void {
    this.checkLogged();
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      } else {
        const localStorageUser = this.userService.getUserFromLocalStorage();
        if (localStorageUser) {
          this.user = localStorageUser;
        }
      }
    });
  }
}
