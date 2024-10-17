import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, query, orderBy, limit } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css']
})
export class PreguntadosComponent implements OnInit {
  preguntas: any[] = [];
  preguntaActual: any = null;
  respuestas: string[] = [];
  puntaje: number = 0;
  mensaje: string = '';
  imagenCategoria: string = '';
  nombreCategoria: string = '';
  apiKey: string = "$2b$12$aOPN7wbnS2sS80QBrb5Jx.HGhQUFe8THWWRyUR6OAmXO7.d0Tk0u6";
  mejoresJugadores: { nombre: string, puntaje: number }[] = [];
  private db = inject(Firestore);

  constructor() {}

  ngOnInit() {
    this.cargarPreguntas();
    this.obtenerRanking();
  }

  async cargarPreguntas() {
    try {
      const deportesResponse = await fetch(`https://api.quiz-contest.xyz/questions?limit=10&page=1&category=sports%26leisure`, {
        method: 'GET',
        headers: {
          'Authorization': `${this.apiKey}`
        }
      });

      const arteResponse = await fetch(`https://api.quiz-contest.xyz/questions?limit=10&page=1&category=arts%26literature`, {
        method: 'GET',
        headers: {
          'Authorization': `${this.apiKey}`
        }
      });

      const geoResponse = await fetch(`https://api.quiz-contest.xyz/questions?limit=10&page=1&category=geography`, {
        method: 'GET',
        headers: {
          'Authorization': `${this.apiKey}`
        }
      });

      if (!deportesResponse.ok || !arteResponse.ok || !geoResponse.ok) {
        throw new Error('Error al cargar preguntas de una o más categorías');
      }

      const deportesData = await deportesResponse.json();
      const arteData = await arteResponse.json();
      const geoData = await geoResponse.json();

      this.preguntas = [...deportesData.questions, ...arteData.questions, ...geoData.questions];
      this.preguntas = this.mezclarPreguntas(this.preguntas);
      this.cambiarPregunta();
    } catch (err: unknown) {
      this.mensaje = `Error al cargar preguntas: ${(err instanceof Error) ? err.message : 'Error desconocido'}`;
    }
  }

  mezclarPreguntas(preguntas: any[]): any[] {
    return preguntas.sort(() => Math.random() - 0.5);
  }

  preguntasRespondidas: string[] = [];

  cambiarPregunta() {
    const preguntasSinResponder = this.preguntas.filter(pregunta => !this.preguntasRespondidas.includes(pregunta.id));

    if (preguntasSinResponder.length > 0) {
      const randomIndex = Math.floor(Math.random() * preguntasSinResponder.length);
      const preguntaElegida = preguntasSinResponder[randomIndex];

      this.preguntasRespondidas.push(preguntaElegida.id);
      this.preguntaActual = preguntaElegida;

      this.respuestas = [
        this.preguntaActual.correctAnswers,
        ...this.preguntaActual.incorrectAnswers
      ];
      this.respuestas = this.mezclarRespuestas(this.respuestas);

      const categoriaInfo = this.obtenerNombreCategoriaLegible(this.preguntaActual.category);
      this.nombreCategoria = categoriaInfo.nombre;
      this.imagenCategoria = categoriaInfo.imagen;
    } else {
      this.mensaje = "¡No hay más preguntas disponibles!";
    }
  }

  mezclarRespuestas(respuestas: string[]): string[] {
    return respuestas.sort(() => Math.random() - 0.5);
  }

  obtenerNombreCategoriaLegible(categoria: string): { nombre: string, imagen: string } {
    const categorias: { [key: string]: { nombre: string, imagen: string } } = {
      "sports&leisure": {
        nombre: "Deportes y Ocio",
        imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/preguntados%2Fdeportes.jpg?alt=media&token=b382f7e5-8b75-4607-bb8b-3910999523a8'
      },
      "arts&literature": {
        nombre: "Artes y Literatura",
        imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/preguntados%2Fartylit.jpg?alt=media&token=3608bb12-a4e5-4301-8907-0571d2a575e8'
      },
      "geography": {
        nombre: "Geografía",
        imagen: 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/preguntados%2Fgeo.jpg?alt=media&token=f026fe5b-6e53-48d4-aef8-9240035735b8'
      },
    };

    return categorias[categoria] || { nombre: categoria, imagen: 'URL_IMAGEN_DEFAULT' };
  }

  verificarRespuesta(respuestaSeleccionada: string) {
    if (respuestaSeleccionada === this.preguntaActual.correctAnswers) {
      this.puntaje++;
      this.mensaje = '¡Correcto! Tu puntaje es: ' + this.puntaje;
    } else {
      this.mensaje = 'Incorrecto. La respuesta correcta era: ' + this.preguntaActual.correctAnswers;
      this.guardarPuntaje();
      this.puntaje = 0;
    }
    this.cambiarPregunta();
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://firebasestorage.googleapis.com/v0/b/salajuegos-bartel.appspot.com/o/preguntados%2Fdefault.jpg?alt=media';
  }



  async guardarPuntaje() {
    const auth = getAuth();
    const user = auth.currentUser;
    const correoUsuario = user?.email || 'Anónimo'; 

    try {
      await addDoc(collection(this.db, 'ranking_preguntados'), {
        correo: correoUsuario,
        puntaje: this.puntaje,
        fecha: new Date(),
      });
      this.obtenerRanking();
    } catch (error) {
      console.error('Error al guardar el puntaje: ', error);
      this.mensaje = 'Error al guardar el puntaje. Intenta nuevamente.';
    }
  }

  obtenerRanking() {
    const q = query(collection(this.db, 'ranking_preguntados'), orderBy('puntaje', 'desc'), limit(5));
    onSnapshot(q, (querySnapshot) => {
      this.mejoresJugadores = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        this.mejoresJugadores.push({ nombre: data['correo'], puntaje: data['puntaje'] });
      });
    }, (error) => {
      console.error('Error al obtener ranking: ', error);
      this.mensaje = 'Error al obtener el ranking. Intenta nuevamente.';
    });
  }
}