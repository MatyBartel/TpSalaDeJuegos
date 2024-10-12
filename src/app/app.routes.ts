import { Routes } from '@angular/router';
import { AboutComponent } from './componentes/about/about.component';
import { HomeComponent } from './componentes/home/home.component';
import { PageNotFoundComponent } from './componentes/page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: "full" }, // Redirige a login en lugar de home
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },

    // La ruta comodín debe ir siempre al final
    { path: '**', component: PageNotFoundComponent },
];