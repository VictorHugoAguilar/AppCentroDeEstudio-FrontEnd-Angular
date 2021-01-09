import { Injectable } from '@angular/core';
import { Examen } from '../models/examen';

@Injectable({
  providedIn: 'root'
})
export class ExamenService extends CommonService<Examen>{

  protected baseEndpoint = 'http://localhost:8090/api/examenes';

}