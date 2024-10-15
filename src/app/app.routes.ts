import { Routes } from '@angular/router';
import { AboutComponent } from './componentes/about/about.component';
import { HomeComponent } from './componentes/home/home.component';
import { PageNotFoundComponent } from './componentes/page-not-found/page-not-found.component';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './componentes/mayor-o-menor/mayor-o-menor.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: "full" },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'ahorcado', component: AhorcadoComponent },
    { path: 'mayor-menor', component: MayorOMenorComponent },

    { path: '**', component: PageNotFoundComponent },
];