import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient) {
    this.getRandomWord();
  }

  getRandomWord() {
    this.palabraCargada = false;
    this.http.get('https://clientes.api.greenborn.com.ar/public-random-word').subscribe(
      (response: any) => {
        console.log('Respuesta de la API:', response);
        if (Array.isArray(response) && response.length > 0) {
          const palabra = response[0].toUpperCase();
          
          if (this.contieneLetrasConAcento(palabra) || this.contieneDiacriticos(palabra) || this.contieneEspacios(palabra)) {
            console.error('La palabra no es válida, obteniendo una nueva palabra...');
            this.getRandomWord();
          } else {
            this.palabraSecreta = palabra;
            this.resetGame();
          }
        } else {
          console.error('La API no devolvió una palabra válida');
        }
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
          this.mensajeResultado = 'Perdiste. La palabra era: ' + this.palabraSecreta;
        }
      }

      if (this.haGanado()) {
        this.juegoTerminado = true; 
        this.mensajeResultado = '¡Ganaste! La palabra era: ' + this.palabraSecreta;
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