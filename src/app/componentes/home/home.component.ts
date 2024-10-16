import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../../../firebaseConfig';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore"; 
import { Router, RouterModule } from '@angular/router';

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
  db: Firestore = getFirestore(this.app);

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkUserStatus();
    this.listenToMessages();
  }

  checkUserStatus() {
    const user = this.auth.currentUser;
    this.isLoggedIn = !!user; 
    if (user && user.email) {
      this.username = user.email; 
    } else {
      this.username = ''; 
    }
  }

  // Métodos Chat
  async sendMessage() {
    if (this.message.trim() && this.isLoggedIn) {
      try {
        await addDoc(collection(this.db, 'chats'), {
          user: this.username,
          text: this.message,
          timestamp: new Date() 
        });
        this.message = ''; 
        this.scrollToBottom();
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
      this.scrollToBottom(); 
    });
  }

  private scrollToBottom(): void {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  navegarAGrupo(juego: string) {
    if (this.isLoggedIn) {
      this.router.navigate([`/${juego}`]); 
    }
  }
}