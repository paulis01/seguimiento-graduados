import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

interface Usuario {
  nombre: string;
  usuario: string;
  cedula: string;
  carrera: string;
  fecha_graduacion: string;
  [key: string]: any;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
})
export class AdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  filtro = '';
  ordenActual: string = '';
  ascendente = true;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();

    // Verificar sesión admin
    if (!localStorage.getItem('adminLogged')) {
      this.router.navigate(['/auth/login']);
    }
  }

  cargarUsuarios(): void {
    const datos = localStorage.getItem('usuarios');
    this.usuarios = datos ? JSON.parse(datos) : [];
    this.aplicarFiltro();
  }

  ordenarPor(campo: string): void {
    if (this.ordenActual === campo) {
      this.ascendente = !this.ascendente;
    } else {
      this.ordenActual = campo;
      this.ascendente = true;
    }

    // Primero aplica filtro para actualizar usuariosFiltrados
    this.aplicarFiltro();

    // Luego ordena el arreglo filtrado
    this.usuariosFiltrados.sort((a, b) => {
      const valorA = a[campo]?.toString().toLowerCase() ?? '';
      const valorB = b[campo]?.toString().toLowerCase() ?? '';
      return valorA.localeCompare(valorB) * (this.ascendente ? 1 : -1);
    });
  }

  aplicarFiltro(): void {
    const termino = this.filtro.toLowerCase().trim();
    this.usuariosFiltrados = this.usuarios.filter(
      (u) =>
        u.nombre.toLowerCase().includes(termino) ||
        u.usuario.toLowerCase().includes(termino)
    );
  }
  eliminarUsuario(usuario: string): void {
    const confirmacion = confirm(
      `¿Estás seguro de eliminar al usuario "${usuario}"?`
    );
    if (!confirmacion) return;

    // Eliminar el usuario del arreglo
    this.usuarios = this.usuarios.filter((u) => u.usuario !== usuario);
    // Elimiar de usuarioActivo
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (usuarioActivo === usuario) {
      localStorage.removeItem('usuarioActivo');
    }
    // Guardar los cambios en el localStorage
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));

    // Filtrar usuario
    this.usuarios = this.usuarios.filter((u) => u.usuario !== usuario);
    // Guardar nueva lista en localStorage
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    // Volver a aplicar filtro y renderizar
    this.aplicarFiltro();
  }

  cerrarSesion(): void {
    localStorage.removeItem('adminLogged');
    this.router.navigate(['/auth/login']);
  }
}
