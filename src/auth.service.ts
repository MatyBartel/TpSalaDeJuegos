import { Injectable } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebaseConfig'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private app = initializeApp(firebaseConfig);
  private auth = getAuth(this.app);
  public isLoggedIn: boolean = false;

  constructor() {}

  login(email: string, password: string) {
  }

  logout() {
    signOut(this.auth).then(() => {
      this.isLoggedIn = false;
    }).catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
  }
}