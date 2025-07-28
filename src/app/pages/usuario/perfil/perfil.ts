import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil.html',
})

// PerfilComponent: Maneja la visualización y edición del perfil del usuario
export class PerfilComponent {
  usuario: any = null;
  editando = false;

  // Formulario editable (se rellena al activar edición)
  form = {
    nombre: '',
    foto: '',
    usuario: '',
    cedula: '',
    fecha_nacimiento: '',
    carrera: '',
    direccion: '',
    telefono: '',
    correo: '',
    estado_laboral: '',
    empresa: '',
    cargo: '',
    historial_trabajos: [] as any[],
    nuevoTrabajo: {
      empresa: '',
      cargo: '',
      fecha_inicio: '',
      fecha_fin: '',
    },
  };

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (usuarioActivo) {
      this.usuario = JSON.parse(usuarioActivo);
    }
  }
  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const archivo = input.files[0];
    const lector = new FileReader();

    lector.onload = () => {
      const base64 = lector.result as string;
      this.form.foto = base64;
    };

    lector.readAsDataURL(archivo);
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioActivo');
    this.router.navigate(['/auth/login']);
  }

  activarEdicion() {
    this.editando = true;
    this.form = { ...this.usuario }; // Copia datos al formulario
  }

  agregarTrabajoAnterior() {
    const nuevo = { ...this.form.nuevoTrabajo };
    if (!nuevo.empresa || !nuevo.cargo || !nuevo.fecha_inicio) return;

    this.form.historial_trabajos.push(nuevo);
    this.form.nuevoTrabajo = {
      empresa: '',
      cargo: '',
      fecha_inicio: '',
      fecha_fin: '',
    };
  }

  guardarCambios() {
    if (!this.usuario) return;

    this.usuario = { ...this.form };
    localStorage.setItem('usuarioActivo', JSON.stringify(this.usuario));

    // Actualizar en lista general (si existiera)
    const lista = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const i = lista.findIndex((u: any) => u.usuario === this.usuario.usuario);
    if (i >= 0) lista[i] = this.usuario;
    localStorage.setItem('usuarios', JSON.stringify(lista));

    this.editando = false;
  }
}
