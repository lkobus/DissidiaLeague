import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { ToastService } from '../_services/toast.service';
import { PedidoService } from './services/pedido.service';
import { NotaFiscalService } from '../notas-fiscais/services/nota-fiscal.service';
import { GenericResponse } from '../_model/index';
import { Pedido } from './model/pedido';
import { Usuario } from '../_model/usuario';
import { UsuariosService } from '../usuarios/shared/usuarios.service';
import { Modal } from 'ngx-modal';
import { BaseTableComponent } from '../shared/table/base-table-component';

@Component({
  moduleId: module.id,
  selector: 'pedidos',
  templateUrl: 'pedidos.component.html',
  styleUrls: ['pedidos.component.css']
})
export class PedidosComponent extends BaseTableComponent implements OnInit {

  isLoading: boolean;

  filterData: number = 1;
  filterOperacao: number = 0;
  filterVendedor: string = "";
  filterStatus: number = 0;

  listVDE: Usuario[] = [];
  listVDI: Usuario[] = [];
  listVDOutros: Usuario[] = [];

  sourcePedidos: Pedido[] = [];
  listPedidos: Pedido[] = [];
  listPedidosFaturar: string[] = [];

  @ViewChild("modalConfirmacao") modalConfirmacao: Modal;

  constructor(private pedidoService: PedidoService,
    private notaFiscalService: NotaFiscalService,
    private usuarioService: UsuariosService,
    private toastService: ToastService,
    private fileSaverService: FileSaverService) {

    super();
  }

  ngOnInit() {
    this.loadSources();
  }

  loadSources(): void {
    this.isLoading = true;
    this.pedidoService.getPedidos(this.getFilterDataInicial())
      .then(data => {
        this.sourcePedidos = data;
        this.setFilters();
        return this.usuarioService.getUsers();
      })
      .then(data => {
        this.listVDE = data.filter(d => d.perfil == 2);
        this.listVDI = data.filter(d => d.perfil == 5);
        this.listVDOutros = data.filter(d => d.perfil == 1
          && this.sourcePedidos.find(p => p.Vendedor.Id == d.id));

        this.listPedidosFaturar = [];
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        this.listPedidosFaturar = [];
        this.handleServerError(error);
      })
  }

  getFilterDataInicial(): Date {
    let result: Date;
    let currentDate: Date = new Date();
    if (this.filterData == 1) {
      result = currentDate;
    } else if (this.filterData == 2) {
      result = new Date(currentDate.getFullYear(),
        currentDate.getMonth(), currentDate.getDate() - currentDate.getDay())
    } else if (this.filterData == 3) {
      result = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    } else if (this.filterData == 4) {
      result = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate())
    } else if (this.filterData == 5) {
      result = new Date(currentDate.getFullYear(), 1, 1)
    }
    return result;
  }

  getStateClass(statusCodigo: number): string {
    if (statusCodigo == 1 || statusCodigo == 7) {
      return "c-ok";
    }
    if (statusCodigo == 3 || statusCodigo == 4 || statusCodigo == 6 || statusCodigo == 8) {
      return "c-warning";
    }
    if (statusCodigo == 2 || statusCodigo == 5 || statusCodigo == 9 || statusCodigo == 10) {
      return "c-error";
    }
    return "";
  }

  getStateIcon(statusCodigo: number): string {
    if (statusCodigo == 1) {
      return "icon-checked";
    }
    if (statusCodigo == 7) {
      return "icon-arrow-right";
    }
    if (statusCodigo == 10) {
      return "icon-arrow-left";
    }
    if (statusCodigo == 3 || statusCodigo == 4 || statusCodigo == 6 || statusCodigo == 8 || statusCodigo == 11 || statusCodigo == 12) {
      return "icon-clock";
    }
    if (statusCodigo == 2 || statusCodigo == 5 || statusCodigo == 9 || statusCodigo == 13) {
      return "icon-minus-o";
    }
    return "";
  }

  getStateClassMapa(mapaStatusCodigo: number): string {
    if (mapaStatusCodigo == 2 || mapaStatusCodigo == 4) {
      return 'c-ok';
    }
    return 'c-warning';
  }

  onCheckPedidoFaturar(pedidoId: string): void {
    let exists = this.listPedidosFaturar.find(p => p == pedidoId);
    if (exists) {
      this.listPedidosFaturar = this.listPedidosFaturar.filter(p => p != pedidoId);
    } else {
      this.listPedidosFaturar.push(pedidoId);
    }
  }

  onDataFilter(): void {
    this.loadSources();
  }

  setFilters(): void {
    this.listPedidos = this.sourcePedidos;
    if (this.filterOperacao && this.filterOperacao != 0) {
      this.listPedidos = this.listPedidos.filter(p => p.TipoOperacaoCodigo == this.filterOperacao
        || (p.TipoOperacaoCodigo == 0 && this.filterOperacao == 1));
    }
    if (this.filterVendedor) {
      this.listPedidos = this.listPedidos.filter(p => p.Vendedor && p.Vendedor.Id == this.filterVendedor);
    }
    if (this.filterStatus && this.filterStatus != 0) {
      this.listPedidos = this.listPedidos.filter(p => p.StatusCodigo == this.filterStatus);
    }
  }

  onOtherFilter(): void {
    this.setFilters();
  }

  faturarPedidos(): void {
    this.closeModalConfirmacao();
    this.isLoading = true;
    this.pedidoService.faturarPedidos(this.listPedidosFaturar)
      .then(data => {
        this.listPedidosFaturar = [];
        this.loadSources();
      })
      .catch(error => {
        this.isLoading = false;
        this.handleServerError(error);
      })
  }

  isBoletoEnabled(pedido: Pedido): boolean {
    return pedido.StatusCodigo == 1 
      && pedido.FormaPagamentoCodigo == 14;
  }

  gerarBoleto(pedidoId: string): void {
    this.isLoading = true;
    this.notaFiscalService.gerarBoleto(pedidoId)
      .then(data => {
        let result = new Blob([data.fileData], { type: 'application/pdf;charset=utf-8' });
        this.fileSaverService.save(result, data.fileName);
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        this.handleServerError(error);
      });
  }

  baixarDanfe(pedidoId: string): void {
    this.isLoading = true;
    this.pedidoService.baixarDanfe(pedidoId)
      .then(data => {
        let result = new Blob([data.fileData], { type: "application/pdf;charset=utf-8" })
        this.fileSaverService.save(result, data.fileName);
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        this.handleServerError(error);
      });
  }

  baixarXml(pedidoId: string): void {
    this.isLoading = true;
    this.pedidoService.baixarXml(pedidoId)
      .then(data => {
        let result = new Blob([data.fileData], { type: "application/xml;charset=utf-8" })
        this.fileSaverService.save(result, data.fileName);
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        this.handleServerError(error);
      });
  }

  HabilitaFaturarPedido(pedido: Pedido){
    return (pedido.StatusCodigo == 7 && !pedido.MapaCodigo) || pedido.StatusCodigo == 13 || pedido.StatusCodigo == 9;
  }

  openModalConfirmacao(): void {
    this.modalConfirmacao.open();
  }

  closeModalConfirmacao(): void {
    this.modalConfirmacao.close();
  }

  private handleServerError(error: GenericResponse): void {
    if (error.message) {
      this.toastService.errorNotification('', error.message);
    } else {
      this.toastService.errorNotification('', 'Falha ocorrida');
    }
  }

  allowEdit(pedido: Pedido): boolean {
    return pedido.StatusCodigo == 2 || pedido.StatusCodigo == 7;
  }
}
