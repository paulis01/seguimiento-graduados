import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';

// Importar componentes de usuario
import { RegistroComponent } from './pages/usuario/registro/registro';
import { InicioComponent } from './pages/usuario/inicio/inicio';
import { PerfilComponent } from './pages/usuario/perfil/perfil';
import { RecuperarContrasenaComponent } from './pages/usuario/recuperar-contrasena/recuperar-contrasena';

// Importar componentes de administrador
import { RegistroAdminComponent } from './pages/admin/registro-estudiantes/registro-estudiantes';
import { AdminComponent } from './pages/admin/admin/admin';
import { AdminEncuestaComponent } from './pages/admin/admin-encuesta/admin-encuesta';
import { EncuestasComponent } from './pages/admin/encuestas/encuestas';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  // Rutas de usuario
  { path: 'usuario/registro', component: RegistroComponent },
  {
    path: 'usuario/recuperar-contrasena',
    component: RecuperarContrasenaComponent,
  },
  { path: 'usuario/perfil', component: PerfilComponent },
  { path: 'usuario/inicio', component: InicioComponent },
  {
    path: 'usuario/contestar/:id',
    loadComponent: () =>
      import('./pages/usuario/contestar/contestar').then(
        (m) => m.ContestarComponent
      ),
  },
  // Rutas de administrador
  { path: 'admin/admin', component: AdminComponent },
  { path: 'admin/registro-estudiantes', component: RegistroAdminComponent },
  { path: 'admin/admin-encuesta', component: AdminEncuestaComponent },
  { path: 'admin/encuestas', component: EncuestasComponent },

  // Rutas de encuestas
];
