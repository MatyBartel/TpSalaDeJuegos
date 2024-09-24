import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule

@Component({
  selector: 'app-login',
  standalone: true, // Asegúrate de que está definido como standalone
  imports: [FormsModule], // Importa FormsModule aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Asegúrate de que la ruta sea correcta
})
export class LoginComponent {
  username: string = ''; // Variable para el nombre de usuario
  password: string = ''; // Variable para la contraseña

  constructor() {}

  onSubmit() {
    // Aquí puedes manejar el envío del formulario
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }
}