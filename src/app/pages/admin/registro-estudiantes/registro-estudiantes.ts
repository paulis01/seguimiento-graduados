import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro-estudiantes.html',
  
})
export class RegistroAdminComponent {
  registroForm: FormGroup;
  mensaje = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.registroForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        usuario: ['', Validators.required],
        cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        fecha_nacimiento: ['', Validators.required],
        carrera: ['', Validators.required],
        direccion: [''],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        correo: ['', [Validators.required, Validators.email]],
        contrasena: ['', Validators.required],
        confirmar_contrasena: ['', Validators.required],
        fecha_graduacion: ['', Validators.required],
      },
      { validators: this.coincidenContrasenas() }
    );
  }

  /** Valida que las contraseñas coincidan */
  coincidenContrasenas(): ValidatorFn {
    return (form: AbstractControl): { [key: string]: any } | null => {
      const pass = form.get('contrasena')?.value;
      const confirm = form.get('confirmar_contrasena')?.value;
      return pass === confirm ? null : { contrasenasDiferentes: true };
    };
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      alert('Por favor complete todos los campos requeridos.');
      return;
    }

    const data = this.registroForm.value;

    if (data.contrasena !== data.confirmar_contrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') ?? '[]');

    const existe = usuarios.some((u: any) => u.usuario === data.usuario);
    if (existe) {
      alert('El usuario ya existe.');
      return;
    }

    usuarios.push({
      ...data,
    });

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    this.mensaje = 'Usuario registrado correctamente.';
    setTimeout(() => {
      this.router.navigate(['/admin/admin']);
    }, 1500);
    this.registroForm.reset();
  }
}
