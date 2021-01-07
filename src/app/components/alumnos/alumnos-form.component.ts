import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from '../../models/alumno';
import { AlumnoService } from '../../services/alumno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.css']
})
export class AlumnosFormComponent implements OnInit {

  titulo = "Crear Alumnos";
  alumno: Alumno = new Alumno();
  error:any;

  constructor(private service: AlumnoService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      const id:number = +params.id;
      console.log(id);
      if(id){
        this.service.ver(id).subscribe(alumno => this.alumno = alumno);
      }
    });
  }

  crear() :void{
    // console.log(this.alumno);
    this.service.crear(this.alumno).subscribe(
      alumno => {
        console.log(alumno);
        Swal.fire(
          'Creado!',
          `Alumno ${alumno.nombre} creado con éxito!`,
          'success'
        );
        this.router.navigate(['/alumnos']);
      },
      err => {
        if(err.status === 400){
          this.error = err.error;
          console.error(this.error);
        }
      }
    );
  }

  editar() :void{
    // console.log(this.alumno);
    this.service.editar(this.alumno).subscribe(
      alumno => {
        console.log(alumno);
        Swal.fire(
          'Actualizado!',
          `Alumno ${alumno.nombre} actualizado con éxito!`,
          'success'
        );
        this.router.navigate(['/alumnos']);
      },
      err => {
        if(err.status === 400){
          this.error = err.error;
          console.error(this.error);
        }
      }
    );
  }

}
