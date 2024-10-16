import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-word-game',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './word-game.component.html',
  styleUrls: ['./word-game.component.css']
})
export class WordGameComponent {
  palabraOriginal: string | null = null;
  palabraMezclada: string[] = []; // Cambiado a arreglo de letras
  letrasOrdenadas: string[] = [];
  letrasBloqueadas: Set<string> = new Set(); // Usamos un Set para letras bloqueadas
  puntos: number = 0;
  mensajeResultado: string = '';

  constructor(private http: HttpClient) {
    this.getRandomWord();
  }

  getRandomWord() {
    this.http.get('https://clientes.api.greenborn.com.ar/public-random-word').subscribe(
      (response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          const palabra = response[0].toUpperCase();
          if (!this.contieneLetrasInvalidas(palabra) && !this.comprobarLetrasRepetidas(palabra)) {
            this.palabraOriginal = palabra;
            this.palabraMezclada = this.mezclarLetras(palabra).split(''); // Convertimos a arreglo
          } else {
            this.getRandomWord(); // Si la palabra no es válida, busca otra
          }
        }
      },
      error => console.error('Error al obtener la palabra', error)
    );
  }

  seleccionarLetra(letra: string) {
    if (this.palabraOriginal && !this.letrasOrdenadas.includes(letra)) {
      this.letrasOrdenadas.push(letra);
      this.letrasBloqueadas.add(letra); // Bloqueamos solo la letra seleccionada
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
    if (this.letrasOrdenadas.join('') === this.palabraOriginal) {
      this.mensajeResultado = '¡Correcto! Ganaste 5 puntos.';
      this.puntos += 5;
    } else {
      this.mensajeResultado = `Incorrecto. La palabra correcta era: ${this.palabraOriginal}`;
      this.puntos = 0;
    }
    this.reiniciarJuego();
  }

  reiniciarJuego() {
    this.letrasOrdenadas = []; // Reiniciar letras ordenadas
    this.letrasBloqueadas.clear(); // Reiniciar letras bloqueadas
    this.getRandomWord();
  }

  comprobarLetrasRepetidas(palabra: string): boolean {
    const letras = new Set<string>();
    for (let letra of palabra) {
      if (letras.has(letra)) {
        return true; // Retorna true si hay letras repetidas
      }
      letras.add(letra);
    }
    return false; // Retorna false si no hay letras repetidas
  }
}