import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './componentes/page-not-found/page-not-found.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: "full" },
    {
        path: 'home',
        loadChildren: () => import('./componentes/home/home.module').then(m => m.HomeModule)
    },
    {
    path: 'about',
    loadComponent: () => import('./componentes/about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'ahorcado',
        loadChildren: () => import('./componentes/ahorcado/ahorcado.module').then(m => m.AhorcadoModule)
    },
    {
        path: 'mayor-menor',
        loadChildren: () => import('./componentes/mayor-o-menor/mayor-o-menor.module').then(m => m.MayorOMenorModule)
    },
    {
        path: 'preguntados',
        loadChildren: () => import('./componentes/preguntados/preguntados.module').then(m => m.PreguntadosModule)
    },
    {
        path: 'word-game',
        loadChildren: () => import('./componentes/word-game/word-game.module').then(m => m.WordGameModule)
    },
    {
        path: 'encuesta',
        loadChildren: () => import('./componentes/encuesta/encuesta.module').then(m => m.EncuestaModule)
    },
    { path: '**', component: PageNotFoundComponent }
];
