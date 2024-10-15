import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mayor-o-menor',
  standalone: true, // Indica que es un componente standalone
  templateUrl: './mayor-o-menor.component.html',
  styleUrls: ['./mayor-o-menor.component.css'],
  imports: [CommonModule], // Importa CommonModule aquí
})
export class MayorOMenorComponent {
  cartaActual!: any; // Cambia a 'any' para almacenar el objeto de la carta
  siguienteCarta!: any; // Cambia a 'any' para almacenar el objeto de la carta
  puntaje: number = 0;
  mensaje: string = '';

  cartas: any[] = [
    { valor: 1, palo: 'Basto', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F1basto.jpg?alt=media&token=69375ad9-f781-4c08-90a5-9a30800bb040' },
    { valor: 2, palo: 'Oro', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F2oro.jpg?alt=media&token=78131d5e-4b83-4954-9bc3-d1a0a0667fc2' },
    { valor: 3, palo: 'Espada', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F3espada.jpg?alt=media&token=8b9ed865-7f8d-4677-863d-d07f26acf165' },
    { valor: 4, palo: 'Copa', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F4copa.jpg?alt=media&token=5e444ece-f667-4d42-a354-31c2e9b80969' },
    { valor: 5, palo: 'Basto', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F5basto.jpg?alt=media&token=ecc1aa6d-b9bf-400a-abc7-876c3cbefd03' },
    { valor: 6, palo: 'Espada', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F6espada.jpg?alt=media&token=32911066-9563-423e-920c-66352d1cee4f' },
    { valor: 7, palo: 'Oro', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F7oro.jpg?alt=media&token=9b64dc71-f0c8-43f3-8229-e89276ddfd66' },
    { valor: 8, palo: 'Copa', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F8copa.jpg?alt=media&token=661df783-aafc-4616-ac47-384802ac36ca' },
    { valor: 9, palo: 'Espada', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F9espada.jpg?alt=media&token=88fe1c8a-f790-45c0-8c04-2dca581daf37' },
    { valor: 10, palo: 'Basto', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F10basto.jpg?alt=media&token=e18705a0-ad73-40b4-99ee-aafb94b34a76' },
    { valor: 11, palo: 'Copa', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F11copa.jpg?alt=media&token=f44e71d8-3a4c-4e05-9c8e-654077878c97' },
    { valor: 12, palo: 'Espada', imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/cartas%2F12espada.jpg?alt=media&token=3e38ce2e-a622-4841-8323-ba949ae76bd0' },
  ];

  constructor() {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.cartaActual = this.generarCarta();
    this.siguienteCarta = this.generarCarta();
  }

  generarCarta(): any {
    let carta;

    do {
      carta = this.cartas[Math.floor(Math.random() * this.cartas.length)];
    } while (carta === this.cartaActual); // Asegúrate de que no sea la misma carta

    return carta;
  }

  verificarRespuesta(respuesta: 'mayor' | 'menor') {
    const esCorrecto = (respuesta === 'mayor' && this.siguienteCarta.valor > this.cartaActual.valor) ||
      (respuesta === 'menor' && this.siguienteCarta.valor < this.cartaActual.valor);

    if (esCorrecto) {
      this.mensaje = '¡CORRECTO! SEGUI SUMANDO PUNTOS';
      this.puntaje++;
    } else {
      this.mensaje = `¡PERDISTE! La carta era: ${this.siguienteCarta.valor} de ${this.siguienteCarta.palo}`;
      this.puntaje = 0;
    }

    this.cartaActual = this.siguienteCarta;
    this.siguienteCarta = this.generarCarta();
  }
}
