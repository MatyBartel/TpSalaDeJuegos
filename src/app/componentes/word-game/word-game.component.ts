import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, query, orderBy, limit } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-word-game',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './word-game.component.html',
  styleUrls: ['./word-game.component.css']
})
export class WordGameComponent {
  palabraOriginal: string | null = null;
  palabraMezclada: string[] = [];
  letrasOrdenadas: string[] = [];
  letrasBloqueadas: Set<string> = new Set();
  puntos: number = 0;
  mensajeResultado: string = '';
  mejoresJugadores: { nombre: string, puntos: number }[] = [];
  bloqueado: boolean = false;
  botonListoHabilitado: boolean = false;
  
  private db = inject(Firestore);

  constructor(private http: HttpClient) {
    this.getRandomWord();
    this.obtenerRanking();
  }

  getRandomWord() {
    this.botonListoHabilitado = false;
    this.http.get('https://clientes.api.greenborn.com.ar/public-random-word').subscribe(
      (response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          const palabra = response[0].toUpperCase();
          if (!this.contieneLetrasInvalidas(palabra) && !this.comprobarLetrasRepetidas(palabra)) {
            this.palabraOriginal = palabra;
            this.palabraMezclada = this.mezclarLetras(palabra).split('');
            this.botonListoHabilitado = true;
          } else {
            console.warn('Palabra de la API con acento o dieresis, buscando otra...');
            this.getRandomWord();
          }
        }
      },
      error => {
        console.error('Error al obtener la palabra', error);
        this.mensajeResultado = 'Error al obtener una nueva palabra. Intenta nuevamente.';
      }
    );
}


  seleccionarLetra(letra: string) {
    if (this.bloqueado) return;
    if (this.palabraOriginal && !this.letrasOrdenadas.includes(letra)) {
      this.letrasOrdenadas.push(letra);
      this.letrasBloqueadas.add(letra);
    }
}

  contieneLetrasInvalidas(palabra: string): boolean {
    const letrasConAcento = /[áéíóúÁÉÍÓÚüñ ]/;
    return letrasConAcento.test(palabra);
  }

  mezclarLetras(palabra: string): string {
    return palabra.split('').sort(() => Math.random() - 0.5).join('');
  }

  borrarUltimaLetra() {
    const letraBorrada = this.letrasOrdenadas.pop();
    if (letraBorrada) {
      this.letrasBloqueadas.delete(letraBorrada);
    }
  }

  verificarOrden() {
    if (this.bloqueado) return;
    if (this.letrasOrdenadas.join('') === this.palabraOriginal) {
      this.mensajeResultado = '¡Correcto! Ganaste 5 puntos.';
      this.puntos += 5;
      this.guardarResultado();
    } else {
      this.mensajeResultado = `Incorrecto. La palabra correcta era: ${this.palabraOriginal}`;
      this.puntos = 0;
    }
    this.reiniciarJuego();
}

  guardarResultado() {
    const auth = getAuth();
    const user = auth.currentUser;
    const correoUsuario = user?.email || 'Anónimo';

    addDoc(collection(this.db, 'ranking_word_game'), {
      correo: correoUsuario,
      score: this.puntos,
      fecha: new Date(),
    })
    .then(() => {
      this.obtenerRanking();
    })
    .catch((error) => {
      console.error('Error al guardar el resultado: ', error);
      this.mensajeResultado = 'Error al guardar el resultado. Intenta nuevamente.';
    });
  }

  obtenerRanking() {
    const q = query(collection(this.db, 'ranking_word_game'), orderBy('score', 'desc'), limit(5));
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

  reiniciarJuego() {
    this.letrasOrdenadas = [];
    this.letrasBloqueadas.clear(); 
    this.getRandomWord();
  }
  comprobarLetrasRepetidas(palabra: string): boolean {
    const letras = new Set<string>();
    for (let letra of palabra) {
      if (letras.has(letra)) {
        return true;
      }
      letras.add(letra);
    }
    return false;
  }
}