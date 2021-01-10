import { Generic } from './generic';

export class Alumno implements Generic {
  id: number = 0;
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  createAt: string = '';
  fotoHashCode: number = 0;
}
