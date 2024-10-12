import { Component} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component'; 
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './componentes/registro/registro.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LoginComponent, RegistroComponent], // Asegúrate de que LoginComponent esté aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rutas';
  isLoggedIn: boolean = false;

  constructor(public router: Router) {}

  setLoginStatus(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  updateLoginStatus(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }
}