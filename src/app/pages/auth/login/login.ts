import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  /** Formulario reactivo con validaciones básicas */
  loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    });
  }

  /** Acción al enviar el formulario */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      window.alert('Por favor, complete todos los campos.');
      return;
    }

    const { usuario, contrasena } = this.loginForm.value;

    //Admin
    const admin = { usuario: 'admin', contrasena: 'admin123' };

    //Graduados almacenados en localStorage
    const graduados: any[] = JSON.parse(
      localStorage.getItem('usuarios') ?? '[]'
    );
    const graduado = graduados.find(
      (u) => u.usuario === usuario && u.contrasena === contrasena
    );

    // ─── Lógica de redirección ──────────────────────────────────────────
    if (usuario === admin.usuario && contrasena === admin.contrasena) {
      localStorage.setItem('adminLogged', 'true');
      this.router.navigate(['/admin/admin']);
    } else if (graduado) {
      localStorage.setItem('usuarioActivo', JSON.stringify(graduado));
      this.router.navigate(['/usuario/inicio']);
    } else {
      window.alert('Usuario o contraseña incorrectos.');
    }
  }
}
