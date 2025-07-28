import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EncuestaService } from '../../../services/encuesta.service';

@Component({
  selector: 'app-admin-ver-encuestas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './encuestas.html',
})
export class EncuestasComponent implements OnInit, OnDestroy {
  respuestas: any[] = [];
  encuestas: any[] = [];
  agrupadas: { encuesta: string; respuestas: any[] }[] = [];

  constructor(private readonly encuestaService: EncuestaService) {}

  ngOnInit(): void {
    this.cargarDatos();

    window.addEventListener(
      'encuestasActualizadas',
      this.cargarDatos.bind(this)
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener(
      'encuestasActualizadas',
      this.cargarDatos.bind(this)
    );
  }

  cargarDatos(): void {
    this.respuestas = this.encuestaService.obtenerRespuestas();
    this.encuestas = this.encuestaService.obtenerEncuestas();

    this.agrupadas = this.agruparPorEncuesta(this.respuestas);
  }

  agruparPorEncuesta(respuestas: any[]): any[] {
    const mapa = new Map<string, any[]>();
    respuestas.forEach((r) => {
      if (!mapa.has(r.encuesta)) {
        mapa.set(r.encuesta, []);
      }
      mapa.get(r.encuesta)?.push(r);
    });

    return Array.from(mapa.entries()).map(([encuesta, respuestas]) => ({
      encuesta,
      respuestas,
    }));
  }

  eliminarEncuesta(titulo: string): void {
    const confirmado = confirm(
      `¿Deseas eliminar completamente la encuesta "${titulo}" y todas sus respuestas?`
    );
    if (!confirmado) return;

    this.encuestaService.eliminarEncuestaPorTitulo(titulo);
    this.cargarDatos(); // Recarga los datos locales
  }
}
