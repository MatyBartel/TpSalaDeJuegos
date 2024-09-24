import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Asegúrate de que sea styleUrls, no styleUrl
})
export class AppComponent {
  title = 'rutas';

  constructor(private router: Router) {}

  goTo(path: string) {
    this.router.navigate([path]);
  }
}