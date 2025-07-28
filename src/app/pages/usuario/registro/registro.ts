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
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.html',
})
export class RegistroComponent {
  registroForm: FormGroup;

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

  coincidenContrasenas(): ValidatorFn {
    return (form: AbstractControl): { [key: string]: any } | null => {
      const pass = form.get('contrasena')?.value;
      const confirm = form.get('confirmar_contrasena')?.value;
      return pass === confirm ? null : { contrasenasDiferentes: true };
    };
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const nuevoGraduado = this.registroForm.value;

    // Validar que las contraseñas coincidan
    if (nuevoGraduado.contrasena !== nuevoGraduado.confirmar_contrasena) {
      window.alert('Las contraseñas no coinciden.');
      return;
    }

    // Obtener usuarios anteriores o que ya existen
    const usuarios: any[] = JSON.parse(
      localStorage.getItem('usuarios') ?? '[]'
    );

    // Verificar si el usuario ya existe
    const yaExiste = usuarios.some((u) => u.usuario === nuevoGraduado.usuario);

    if (yaExiste) {
      alert('Ese nombre de usuario ya existe. Eliga otro:)');
      return;
    }
    // Eliminar confirmar_contrasena antes de guardar
    delete nuevoGraduado.confirmar_contrasena;

    // Guardar nuevo graduado
    usuarios.push(nuevoGraduado);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    this.router.navigate(['/auth/login']);
  }
}
