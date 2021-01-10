import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from '../../models/alumno';
import { AlumnoService } from '../../services/alumno.service';
import { CommonFormComponent } from '../common-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.css']
})
export class AlumnosFormComponent extends CommonFormComponent<Alumno, AlumnoService> implements OnInit {

  private fotoSeleccionada!: File;

  constructor(service: AlumnoService,
    router: Router,
    route: ActivatedRoute) {

    super(service, router, route);
    this.titulo = 'Crear Alumnos';
    this.model = new Alumno();
    this.nombreModel = Alumno.name;
    this.redirect = '/alumnos';
  }

  public seleccionarFoto(event: { target: { files: File[]; }; }): void {
    let fichero: any = event.target.files[0];
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      fichero = null;
      Swal.fire('Error al seleccionar la foto:', 'El archivo debe ser del tipo imagen', 'error');
    }
    if (this.fotoSeleccionada.size > 1024000) {
      fichero = null;
      Swal.fire('Error al seleccionar la foto:', 'El archivo debe pesar menos de 1024KB', 'error');
    }
    this.fotoSeleccionada = fichero;
  }

  crear(): void {
    if (!this.fotoSeleccionada) {
      super.crear();
    } else {
      // console.log(this.alumno);
      this.service.crearConFoto(this.model, this.fotoSeleccionada).subscribe(
        alumno => {
          Swal.fire(
            'Creado!',
            `${this.nombreModel} ${alumno.nombre} creado con éxito!`,
            'success'
          );
          this.router.navigate([this.redirect]);
        },
        err => {
          if (err.status === 400) {
            this.error = err.error;
            console.error(this.error);
          }
        }
      );
    }
  }

  editar(): void {
    if (!this.fotoSeleccionada) {
      super.editar();
    } else {
      // console.log(this.alumno);
      this.service.editarConFoto(this.model, this.fotoSeleccionada).subscribe(
        alumno => {
          Swal.fire(
            'Modificado!',
            `${this.nombreModel} ${alumno.nombre} modificado con éxito!`,
            'success'
          );
          this.router.navigate([this.redirect]);
        },
        err => {
          if (err.status === 400) {
            this.error = err.error;
            console.error(this.error);
          }
        }
      );
    }
  }

}
