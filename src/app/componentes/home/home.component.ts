import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../../../firebaseConfig';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore"; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message: string = '';
  messages: { user: string, text: string }[] = [];
  username: string = '';
  isLoggedIn: boolean = false;

  app = initializeApp(firebaseConfig);
  auth = getAuth(this.app);
  db: Firestore = getFirestore(this.app);  // Inicializar Firestore

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user && user.email) {
      this.username = user.email; // O usa user.displayName si está disponible
      this.isLoggedIn = true;
    } else {
      this.username = ''; 
      this.isLoggedIn = false;
    }

    // Escuchar los mensajes en tiempo real desde Firestore
    this.listenToMessages();
  }

  // Método para enviar mensajes
  async sendMessage() {
    if (this.message.trim() && this.isLoggedIn) {
      try {
        const docRef = await addDoc(collection(this.db, 'chats'), {
          user: this.username,
          text: this.message,
          timestamp: new Date()  // Agregar una marca de tiempo para ordenar los mensajes
        });
        this.message = ''; // Limpiar el campo de entrada
      } catch (e) {
        console.error("Error al agregar mensaje: ", e);
      }
    }
  }

  listenToMessages() {
    const q = query(collection(this.db, 'chats'), orderBy('timestamp'));
    onSnapshot(q, (querySnapshot) => {
      this.messages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        this.messages.push({ user: data['user'], text: data['text'] });
      });
    });
  }
}