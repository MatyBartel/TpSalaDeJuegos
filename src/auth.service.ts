import { Injectable } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebaseConfig';  // Ajusta según tu estructura

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private app = initializeApp(firebaseConfig);
  private auth = getAuth(this.app);
  public isLoggedIn: boolean = false;

  constructor() {}

  login(email: string, password: string) {
    // Lógica de inicio de sesión
  }

  logout() {
    signOut(this.auth).then(() => {
      this.isLoggedIn = false; // Cambia el estado al cerrar sesión
    }).catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
  }
}