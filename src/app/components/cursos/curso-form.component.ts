import { Component, OnInit } from '@angular/core';
import { Curso } from 'src/app/models/curso';
import { CommonFormComponent } from '../common-form.component';
import { CursosService } from '../../services/cursos.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-curso-form',
  templateUrl: './curso-form.component.html',
  styleUrls: ['./curso-form.component.css']
})
export class CursoFormComponent extends CommonFormComponent<Curso, CursosService> implements OnInit {

  constructor(service: CursosService,
    router: Router,
    route: ActivatedRoute) {
    super(service, router, route);
    this.titulo = 'Crear Curso';
    this.model = new Curso();
    this.redirect = '/cursos';
    this.nombreModel = Curso.name;
  }

}
