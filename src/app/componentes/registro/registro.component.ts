import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  @Output() loginStatusChange = new EventEmitter<boolean>();
  username: string = '';
  password: string = '';
  nombre: string = '';
  correo: string = '';
  errorMessage: string = ''; 

  constructor(private router: Router) {}

  async onSubmit() {
    const auth = getAuth();
    const db = getFirestore();

    if (!this.nombre || !this.username || !this.correo || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    if (!this.validateEmail(this.correo)) {
      this.errorMessage = 'Por favor, ingresa un correo válido.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, this.correo, this.password);
      const user = userCredential.user;

      const userDoc = doc(db, 'usuarios', user.uid);
      await setDoc(userDoc, {
        nombre: this.nombre,
        username: this.username,
        correo: this.correo,
        fechaIngreso: new Date().toISOString()
      });

      console.log('Usuario registrado exitosamente:', user);
      this.loginStatusChange.emit(true); 
      this.router.navigate(['/home']);

    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'El correo ya está registrado.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'El formato del correo es inválido.';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'La contraseña es demasiado débil.';
          break;
        default:
          this.errorMessage = 'Error al registrar el usuario. Intenta nuevamente.';
      }
      console.error('Error al registrar el usuario:', error);
      this.loginStatusChange.emit(false);
    }
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}