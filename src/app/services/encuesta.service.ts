import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncuestaService {
  private readonly ENCUESTAS_KEY = 'encuestas';
  private readonly RESPUESTAS_KEY = 'respuestasUsuario';

  obtenerEncuestas(): any[] {
    const datos = localStorage.getItem(this.ENCUESTAS_KEY);
    return datos ? JSON.parse(datos) : [];
  }

  guardarEncuestas(encuestas: any[]): void {
    localStorage.setItem(this.ENCUESTAS_KEY, JSON.stringify(encuestas));
  }

  obtenerRespuestas(): any[] {
    const datos = localStorage.getItem(this.RESPUESTAS_KEY);
    return datos ? JSON.parse(datos) : [];
  }

  guardarRespuestas(respuestas: any[]): void {
    localStorage.setItem(this.RESPUESTAS_KEY, JSON.stringify(respuestas));
  }

  eliminarEncuestaPorId(id: number): void {
    const encuestas = this.obtenerEncuestas();
    const encuesta = encuestas.find((e) => e.id === id);
    if (!encuesta) return;

    const nuevasEncuestas = encuestas.filter((e) => e.id !== id);
    this.guardarEncuestas(nuevasEncuestas);

    const respuestas = this.obtenerRespuestas();
    const nuevasRespuestas = respuestas.filter(
      (r) => r.encuesta !== encuesta.titulo
    );
    this.guardarRespuestas(nuevasRespuestas);

    window.dispatchEvent(new CustomEvent('encuestasActualizadas'));
  }

  eliminarEncuestaPorTitulo(titulo: string): void {
    const encuestas = this.obtenerEncuestas();
    const nuevasEncuestas = encuestas.filter((e) => e.titulo !== titulo);
    this.guardarEncuestas(nuevasEncuestas);

    const respuestas = this.obtenerRespuestas();
    const nuevasRespuestas = respuestas.filter((r) => r.encuesta !== titulo);
    this.guardarRespuestas(nuevasRespuestas);

    window.dispatchEvent(new CustomEvent('encuestasActualizadas'));
  }
}
