import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from '../../models/alumno';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  titulo: string = 'Listado de Alumnos';
  alumnos: Alumno[];

  constructor(private service: AlumnoService) {
    this.alumnos = [];
  }

  ngOnInit(): void {
    this.service.listar().subscribe(
      alumnos => this.alumnos = alumnos
    );
  }

  eliminar(alumno: Alumno): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `¿Estás Seguro?`,
      text: `No se puede revertir la eliminación de ${alumno.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminarlo!',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(alumno.id).subscribe(
          () => {
            this.alumnos = this.alumnos.filter(a => a !== alumno);
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'El alumno ha sido eliminado.',
              'success'
            );
          }
        );
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          `Alumno ${alumno.nombre} no eliminado `,
          'error'
        );
      }
    });
  }
}
