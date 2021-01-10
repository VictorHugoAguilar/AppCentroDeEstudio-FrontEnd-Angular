export class Asignatura {
  id: number = 0;
  nombre: string = '';
  padre: Asignatura;
  hijos: Asignatura[] = [];
}
