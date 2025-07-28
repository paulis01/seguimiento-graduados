import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.html',
})
export class InicioComponent {
  encuestas: any[] = [];

  constructor(private readonly router: Router) {}

  contestarEncuesta(id: string): void {
    this.router.navigate(['/usuario/contestar', id]);
  }

  ngOnInit(): void {
    const usuarioActivo = JSON.parse(
      localStorage.getItem('usuarioActivo') ?? '{}'
    );
    const nombreUsuario = usuarioActivo.usuario || 'Usuario desconocido';

    const todas = JSON.parse(localStorage.getItem('encuestas') ?? '[]');
    const clave = `encuestasRespondidas_${nombreUsuario}`;
    const respondidas = JSON.parse(localStorage.getItem(clave) ?? '[]');

    this.encuestas = todas.filter(
      (e: any) => !respondidas.includes(String(e.id))
    );
  }

  cerrarSesion() {
    this.router.navigate(['/auth/login']);
  }
}
