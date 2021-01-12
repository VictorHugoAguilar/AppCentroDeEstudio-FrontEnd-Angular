import { Component, OnInit, ViewChild } from '@angular/core';
import { Curso } from '../../models/curso';
import { ActivatedRoute } from '@angular/router';
import { CursosService } from '../../services/cursos.service';
import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from '../../models/alumno';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-asignar-alumnos',
  templateUrl: './asignar-alumnos.component.html',
  styleUrls: ['./asignar-alumnos.component.css']
})
export class AsignarAlumnosComponent implements OnInit {

  curso: Curso;
  alumnosAsignar: Alumno[] = [];
  alumnos: Alumno[] = [];
  mostrarColumna: string[] = ['nombre', 'apellido', 'seleccion'];
  mostrarColumnasAlumnos: string[] = ['id', 'nombre', 'apellido', 'email', 'eliminar'];
  dataSource: MatTableDataSource<Alumno>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  pageSizeOptions: number[] = [5, 10, 20, 50];
  tabIndex = 0;

  seleccion: SelectionModel<Alumno> = new SelectionModel<Alumno>(true, []);

  constructor(private route: ActivatedRoute,
    private cursoService: CursosService,
    private alumnoService: AlumnoService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id: number = Number.parseInt(params.get('id'));
      this.cursoService.ver(id).subscribe(c => {
        this.curso = c;
        this.alumnos = this.curso.alumnos;
        this.iniciarPaginador();
      });
    });
  }

  iniciarPaginador(): void {
    this.dataSource = new MatTableDataSource<Alumno>(this.alumnos);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
  }

  filtrar(nombreCurso: string): void {
    nombreCurso = nombreCurso !== undefined ? nombreCurso.trim() : '';
    if (nombreCurso !== '') {
      this.alumnoService.filtrarPorNombre(nombreCurso).subscribe(alumnos => {
        this.alumnosAsignar = alumnos.filter(a => {
          let filtrar = true;
          this.alumnos.forEach(ca => {
            if (a.id === ca.id) {
              filtrar = false;
            }
          });
          return filtrar;
        });
      });
    }
  }

  estanTodosSeleccionados(): boolean {
    const seleccionados = this.seleccion.selected.length;
    const numAlumnos = this.alumnosAsignar.length;
    return (seleccionados === numAlumnos);
  }

  seleccionarDesSeleccionarTodos(): void {
    this.estanTodosSeleccionados() ?
      this.seleccion.clear() :
      this.alumnosAsignar.forEach(a => this.seleccion.select(a));
  }

  asignar(): void {
    this.cursoService.asignarAlumnos(this.curso, this.seleccion.selected)
      .subscribe(c => {
        this.tabIndex = 2;
        Swal.fire(
          'Asignados: ',
          `Alumnos asignados con éxitos al curso ${this.curso.nombre}`,
          'success'
        );
        this.alumnos = this.alumnos.concat(this.seleccion.selected);
        this.iniciarPaginador();
        this.alumnosAsignar = [];
        this.seleccion.clear();
      }, e => {
        if (e.status === 500) {
          const mensaje = e.error.message as string;
          if (mensaje.indexOf('ConstraintViolationException') > -1) {
            Swal.fire(
              'Cuidado',
              'No se puede asignar el alumno al curso, ya esta asignado a otro curso',
              'error'
            );
          }
        }
      });
  }

  eliminarAlumno(alumno: Alumno): void {
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
        this.cursoService.eliminarAlumno(this.curso, alumno)
          .subscribe(
            curso => {
              this.alumnos = this.alumnos.filter(a => a.id !== alumno.id);
              this.iniciarPaginador();
              Swal.fire(
                'Eliminado',
                `Alumno ${alumno.nombre} fue eliminado del curso ${curso.nombre}`,
                'success'
              );
            });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          `Alumno ${alumno.nombre} no fue eliminado del curso ${this.curso.nombre}`,
          'error'
        );
      }
    });
  }

}
