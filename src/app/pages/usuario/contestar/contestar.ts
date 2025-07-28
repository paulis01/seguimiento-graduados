import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contestar',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contestar.html',
})
export class ContestarComponent implements OnInit {
  encuesta: any;
  respuestaForm: FormGroup;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.respuestaForm = this.fb.group({
      respuesta: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const encuestas = JSON.parse(localStorage.getItem('encuestas') ?? '[]');
    this.encuesta = encuestas.find((e: any) => String(e.id) === id);
  }

  onSubmit(): void {
    if (this.respuestaForm.valid && this.encuesta) {
      const respuestaTexto = this.respuestaForm.value.respuesta;

      // Obtener usuario actual
      const usuarioActivo = JSON.parse(
        localStorage.getItem('usuarioActivo') ?? '{}'
      );
      const nombreUsuario = usuarioActivo.usuario || 'UsuarioDesconocido';

      // Guardar respuesta completa
      const respuestas = JSON.parse(
        localStorage.getItem('respuestasUsuario') ?? '[]'
      );
      respuestas.push({
        usuario: nombreUsuario,
        encuesta: this.encuesta.titulo,
        respuesta: respuestaTexto,
        fecha: new Date().toISOString(),
      });
      localStorage.setItem('respuestasUsuario', JSON.stringify(respuestas));

      // Guardar encuesta como respondida para el usuario
      const clave = `encuestasRespondidas_${nombreUsuario}`;
      const respondidas = JSON.parse(localStorage.getItem(clave) ?? '[]');
      if (!respondidas.includes(this.encuesta.id)) {
        respondidas.push(String(this.encuesta.id));

        localStorage.setItem(clave, JSON.stringify(respondidas));
      }

      alert('¡Gracias por tu respuesta!');
      this.router.navigate(['/usuario/inicio']);
    }
  }
}
