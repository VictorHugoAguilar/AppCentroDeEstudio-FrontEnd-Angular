import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Curso } from '../models/curso';

@Injectable({
  providedIn: 'root'
})
export class CursosService extends CommonService<Curso>{

  protected baseEndpoint = 'http://localhost:8090/api/cursos';

}
