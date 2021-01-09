import { OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Generic } from '../models/generic';
import { CommonService } from '../services/common.service';

export abstract class CommonListarComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  protected nombreModel: string = '';
  protected titulo: string = 'Listado de Alumnos';
  lista: E[] = [];
  totalRegistros: number = 0;
  paginaActual: number = 0;
  totalPorPaginas: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator ;

  constructor(protected service: S) {
  }

  ngOnInit(): void {
    this.calcularRangos();
  }

  paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPaginas = event.pageSize;
    this.calcularRangos();
  }

  private calcularRangos(): void {
    this.service.listarPagina(this.paginaActual.toString(), this.totalPorPaginas.toString()).subscribe(
      p => {
        this.lista = p.content as E[];
        this.totalRegistros = p.totalElements as number;
        this.paginator?._intl.itemsPerPageLabel = 'Registros por página';
      }
    );
  }

  eliminar(e: E): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `¿Estás Seguro?`,
      text: `No se puede revertir la eliminación de ${e.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminarlo!',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(e.id).subscribe(
          () => {
            this.calcularRangos();
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El ${this.nombreModel} ha sido eliminado.`,
              'success'
            );
          }
        );
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          `${this.nombreModel} ${e.nombre} no eliminado `,
          'error'
        );
      }
    });
  }
}
