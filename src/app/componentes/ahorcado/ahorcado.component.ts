import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, query, orderBy, limit } from '@angular/fire/firestore'; 
import { inject } from '@angular/core';
import { onSnapshot } from 'firebase/firestore';
import { getAuth } from "firebase/auth"; 

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent {
  letrasSeleccionadas: string[] = [];
  palabraSecreta: string | null = null;
  intentosRestantes: number = 6;
  juegoTerminado: boolean = false;
  palabraCargada: boolean = false;
  mensajeResultado: string = '';
  puntos: number = 0;
  private db = inject(Firestore); 
  ranking: { ['correo']: string, ['score']: number }[] = [];
  mejoresJugadores: { nombre: string, puntos: number }[] = [];

  constructor(private http: HttpClient) {
    this.getRandomWord(); 
    this.obtenerRanking(); 
  }

  obtenerCorreoUsuario(): string | null {
    const auth = getAuth();  
    const user = auth.currentUser;

    if (user && user.email) {
      return user.email;
    }

    return null;
  }

  guardarResultado() {
    const correoUsuario = this.obtenerCorreoUsuario();

    if (correoUsuario) {
      addDoc(collection(this.db, 'ranking'), {
        correo: correoUsuario, 
        score: this.puntos,
        fecha: new Date(),
      })
      .then(() => {
        console.log('Resultado guardado');
        this.obtenerRanking(); 
      })
      .catch((error) => {
        console.error('Error al guardar el resultado: ', error);
        this.mensajeResultado = 'Error al guardar el resultado. Intenta nuevamente.';
      });
    } else {
      console.error('No hay usuario autenticado');
      this.mensajeResultado = 'No se pudo obtener el correo del usuario. Asegúrate de estar logueado.';
    }
  }

  obtenerRanking() {
    const q = query(collection(this.db, 'ranking'), orderBy('score', 'desc'), limit(5));
    onSnapshot(q, (querySnapshot) => {
      this.mejoresJugadores = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        this.mejoresJugadores.push({ nombre: data['correo'], puntos: data['score'] });
      });
    }, (error) => {
      console.error('Error al obtener ranking: ', error);
      this.mensajeResultado = 'Error al obtener el ranking. Intenta nuevamente.';
    });
  }

  finalizarJuego() {
    if (this.juegoTerminado) {
      this.guardarResultado(); 
    }
  }

  getRandomWord() {
    this.palabraCargada = false;
    this.http.get('https://clientes.api.greenborn.com.ar/public-random-word').subscribe(
      (response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          const palabra = response[0].toUpperCase();

          if (this.contieneLetrasConAcento(palabra) || this.contieneDiacriticos(palabra) || this.contieneEspacios(palabra)) {
            this.getRandomWord();
          } else {
            this.palabraSecreta = palabra;
            this.resetGame();
          }
        }
        console.log(this.palabraSecreta)
      },
      error => {
        console.error('Error al obtener la palabra secreta', error);
      }
    );
  }

  contieneLetrasConAcento(palabra: string): boolean {
    const letrasConAcento = /[áéíóúÁÉÍÓÚ]/;
    return letrasConAcento.test(palabra);
  }

  contieneDiacriticos(palabra: string): boolean {
    const letrasConDiacriticos = /[üñ]/;
    return letrasConDiacriticos.test(palabra);
  }

  contieneEspacios(palabra: string): boolean {
    return palabra.includes(' ');
  }

  resetGame() {
    this.letrasSeleccionadas = [];
    this.intentosRestantes = 6;
    this.juegoTerminado = false;
    this.palabraCargada = true; 
    this.mensajeResultado = '';
  }

  seleccionarLetra(letra: string) {
    if (!this.letrasSeleccionadas.includes(letra) && !this.juegoTerminado && this.palabraCargada) {
      this.letrasSeleccionadas.push(letra);

      if (this.palabraSecreta && !this.palabraSecreta.includes(letra)) {
        this.intentosRestantes--;

        if (this.intentosRestantes === 0) {
          this.juegoTerminado = true;
          this.mensajeResultado = 'PERDISTE. La palabra era: ' + this.palabraSecreta;
          this.puntos = 0;
        }
      }

      if (this.haGanado()) {
        this.juegoTerminado = true;
        this.mensajeResultado = '¡EXCELENTE! Sumaste 5 puntos';
        this.puntos += 5;
      }

      if (this.juegoTerminado) {
        this.finalizarJuego(); 
      }
    }
  }

  obtenerPalabraConGuiones() {
    if (!this.palabraSecreta) {
      return '';
    }
    return this.palabraSecreta
      .split('')
      .map(letter => this.letrasSeleccionadas.includes(letter) ? letter : '_')
      .join(' ');
  }

  haGanado() {
    return this.palabraSecreta?.split('').every(letter => this.letrasSeleccionadas.includes(letter));
  }
}