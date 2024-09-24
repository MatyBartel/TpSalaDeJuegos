import { Routes } from '@angular/router';
import { AboutComponent } from './componentes/about/about.component';
import { HomeComponent } from './componentes/home/home.component';
import { PageNotFoundComponent } from './componentes/page-not-found/page-not-found.component';
import { LoginComponent } from './componentes/login/login.component'; // Importa el LoginComponent

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: "full" }, // Redirige a login en lugar de home
    { path: 'login', component: LoginComponent }, // Añade la ruta para el Login
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    // La ruta comodín debe ir siempre al final
    { path: '**', component: PageNotFoundComponent },
];