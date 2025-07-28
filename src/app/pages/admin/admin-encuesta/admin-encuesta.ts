import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EncuestaService } from '../../../services/encuesta.service';

interface Encuesta {
  id: number;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-admin-encuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-encuesta.html',
})
export class AdminEncuestaComponent implements OnInit, OnDestroy {
  encuestas: Encuesta[] = [];
  crearForm!: FormGroup;
  editarForm!: FormGroup;
  mostrandoEdicion = false;
  mostrandoCrear = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly encuestaService: EncuestaService
  ) {}

  ngOnInit(): void {
    this.cargarEncuestas();

    this.crearForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
    });

    this.editarForm = this.fb.group({
      id: [''],
      titulo: ['', Validators.required],
      descripcion: [''],
    });

    window.addEventListener(
      'encuestasActualizadas',
      this.recargarEncuestas.bind(this)
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener(
      'encuestasActualizadas',
      this.recargarEncuestas.bind(this)
    );
  }

  cargarEncuestas(): void {
    this.encuestas = this.encuestaService.obtenerEncuestas();
  }

  recargarEncuestas(): void {
    this.cargarEncuestas();
  }

  mostrarCrearEncuesta(): void {
    this.mostrandoCrear = true;
  }

  crearEncuesta(): void {
    if (this.crearForm.invalid) return;

    const nueva: Encuesta = {
      id: Date.now(),
      titulo: this.crearForm.value.titulo,
      descripcion: this.crearForm.value.descripcion,
    };

    const nuevasEncuestas = [...this.encuestas, nueva];
    this.encuestaService.guardarEncuestas(nuevasEncuestas);
    this.encuestas = nuevasEncuestas;

    this.crearForm.reset();
    this.mostrandoCrear = false;

    window.dispatchEvent(new CustomEvent('encuestasActualizadas'));
  }

  cancelarCrear(): void {
    this.crearForm.reset();
    this.mostrandoCrear = false;
  }

  editarEncuesta(encuesta: Encuesta): void {
    this.mostrandoEdicion = true;
    this.editarForm.setValue({
      id: encuesta.id,
      titulo: encuesta.titulo,
      descripcion: encuesta.descripcion,
    });
  }

  guardarEdicion(): void {
    if (this.editarForm.invalid) return;

    const { id, titulo, descripcion } = this.editarForm.value;
    const index = this.encuestas.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.encuestas[index] = { id, titulo, descripcion };
      this.encuestaService.guardarEncuestas(this.encuestas);
      window.dispatchEvent(new CustomEvent('encuestasActualizadas'));
    }

    this.cancelarEdicion();
  }

  cancelarEdicion(): void {
    this.mostrandoEdicion = false;
    this.editarForm.reset();
  }

  eliminarEncuesta(id: number): void {
    this.encuestaService.eliminarEncuestaPorId(id);
    this.cargarEncuestas(); // Refresca la vista local
  }
}
