import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ExplorarComponent } from './pages/explorar/explorar.component';
import { Page404Component } from './pages/page-404/page-404.component';
import { ShowplanComponent } from './pages/showplan/showplan.component';
import { PublicarPlanComponent } from './pages/publicar-plan/publicar-plan.component';
import { ProfileComponent } from './pages/profile/profile.component'; 
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { EditarPlanComponent } from './pages/editar-plan/editar-plan.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'explorar', component: ExplorarComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'showplan/:id', component: ShowplanComponent }, 
    { path: 'publicar-plan', component: PublicarPlanComponent },
    { path: 'editar-plan', component: EditarPlanComponent },
    { path: 'perfil/:username', component: ProfileComponent },
    { path: 'editar-perfil', component: EditarPerfilComponent },
    { path: 'favoritos', component: FavoritosComponent },
    { path: '**', component: Page404Component },
];