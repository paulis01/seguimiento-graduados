import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recuperar-contrasena.html',
})
export class RecuperarContrasenaComponent {
  recuperarForm: FormGroup;
  mensaje = '';
  mensajeColor = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.recuperarForm = this.fb.group({
      usuario: ['', Validators.required],
      cedula: ['', Validators.required],
      nuevaContrasena: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.recuperarForm.invalid) {
      alert('Completa TODOS los campos requeridos.');
      this.recuperarForm.markAllAsTouched();
      return;
    }

    const { usuario, cedula, nuevaContrasena } = this.recuperarForm.value;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') ?? '[]');

    const index = usuarios.findIndex(
      (u: any) => u.usuario === usuario && u.cedula === cedula
    );

    if (index === -1) {
      this.mensaje = 'Usuario o cédula incorrecta.';
      this.mensajeColor = 'error';
      return;
    }

    usuarios[index].contrasena = nuevaContrasena;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.mensaje = '✅ Contraseña actualizada correctamente. Redirigiendo...';
    this.mensajeColor = 'success';
    this.recuperarForm.reset();
  }
}
