import { Pregunta } from './pregunta';
import { Asignatura } from './asignatura';

export class Examen  implements Generic{
    id: number;
    nombre: string;
    createAt: string;
    preguntas: Pregunta[] = [];
    asignatura: Asignatura;
    respondido: boolean;
}
