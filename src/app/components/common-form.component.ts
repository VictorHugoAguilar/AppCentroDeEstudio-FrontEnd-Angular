import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonService } from '../services/common.service';
import { Generic } from '../models/generic';


export abstract class CommonFormComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  protected titulo: string = '';
  protected model: E;
  protected error: any;
  protected nombreModel: string = '';
  protected redirect: string = '';

  constructor(protected service: S,
    protected router: Router,
    protected route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id: number = +params.id;
      if (id) {
        this.service.ver(id).subscribe(m => {
          this.model = m;
          this.titulo = 'Editar ' + this.nombreModel;
        });
      }
    });
  }

  crear(): void {
    // console.log(this.alumno);
    this.service.crear(this.model).subscribe(
      m => {
        Swal.fire(
          'Creado!',
          `${this.nombreModel} ${m.nombre} creado con éxito!`,
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

  editar(): void {
    // console.log(this.alumno);
    this.service.editar(this.model).subscribe(
      m => {
        console.log(m);
        Swal.fire(
          'Actualizado!',
          `${this.nombreModel} ${m.nombre} actualizado con éxito!`,
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
