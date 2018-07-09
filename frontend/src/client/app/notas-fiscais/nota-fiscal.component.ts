import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { Router } from '@angular/router';
import { ToastService } from '../_services/toast.service';
import { NotaFiscalService } from './services/nota-fiscal.service';
import { GenericResponse } from '../_model/index';
import { NotaFiscal } from './model/nota-fiscal';
import { Usuario, Perfil } from '../_model/usuario';
import { Modal } from 'ngx-modal';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import * as moment from 'moment';
import { BaseTableComponent } from '../shared/table/base-table-component';
import { UsuariosService } from '../usuarios/shared/usuarios.service';
import { Cliente } from '../clientes/model/cliente';
import { ClienteService } from '../_services/cliente.service';
import { List } from "linqts";
import { NotaFiscalFilter } from './model/nota-fiscal-filter';

@Component({
  moduleId: module.id,
  selector: 'sv-nota-fiscal',
  templateUrl: 'nota-fiscal.component.html',
  styleUrls: ['nota-fiscal.component.css']
})
export class NotaFiscalComponent extends BaseTableComponent implements OnInit {

  isLoading: boolean;
  isExporting: boolean;

  filterStatus: number = 0;
  filterTipoNota: number = 1;

  filterTipoNotaExport: number = 1;
  filterVendedorExport: string = "0";
  filterClienteExport: string = "0";

  vdeList: List<Usuario> = new List();
  vdiList: List<Usuario> = new List();
  clientesList: List<Cliente> = new List();

  selectedNotaFiscal: NotaFiscal;

  sourceNotasFiscais: NotaFiscal[] = [];
  listNotasFiscais: NotaFiscal[] = [];

  @ViewChild('modalExportar') modalExportar: Modal;
  @ViewChild('modalConfirmacao') modalConfirmacao: Modal;

  public selectedDateDe = moment().format('DD/MM/YYYY');
  public selectedDateAte = moment().format('DD/MM/YYYY');
  public selectedDateDeExport = moment().format('DD/MM/YYYY');
  public selectedDateAteExport = moment().format('DD/MM/YYYY');

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    dayLabels: {
      su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui',
      fr: 'Sex', sa: 'Sab'
    },
    monthLabels: {
      1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mar', 6: 'Jun', 7: 'Jul',
      8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
    },
    yearSelector: true,
    monthSelector: true,
    showClearDateBtn: false,
    markCurrentDay: true,
    showTodayBtn: false,
    markCurrentMonth: true,
    markCurrentYear: true,
    alignSelectorRight: true,
    disableHeaderButtons: false,
    showDecreaseDateBtn: true,
    showIncreaseDateBtn: true
  };

  constructor(
    public router: Router,
    private notaFiscalService: NotaFiscalService,
    private toastService: ToastService,
    private fileSaverService: FileSaverService,
    private usuarioService: UsuariosService,
    private clienteService: ClienteService
  ) {
    super();

    this.selectedDateDe = moment().format('DD/MM/YYYY');
    this.selectedDateAte = moment().format('DD/MM/YYYY');
    this.selectedDateDeExport = moment().format('DD/MM/YYYY');
    this.selectedDateAteExport = moment().format('DD/MM/YYYY');
  }

  ngOnInit() {
    this.loadSources();
  }

  loadSources(): void {
    this.isLoading = true;
    this.notaFiscalService.getNotas(this.getFilterTipoNota(), this.getFilterDataInicial(), this.getFilterDataFinal())
      .then(data => {
        this.sourceNotasFiscais = data;
        return this.usuarioService.getUsers();
      })
      .then(usuarios => {
        this.vdeList = new List(usuarios).Where(u => u.perfil == Perfil.VDE.Codigo).OrderBy(u => u.nome);
        this.vdiList = new List(usuarios).Where(u => u.perfil == Perfil.VDI.Codigo).OrderBy(u => u.nome);;
        return this.clienteService.getAllClientes().toPromise();
      })
      .then(clientes => {
        this.clientesList = new List(clientes).OrderBy(u => u.NomeFantasia);
        this.setFilters();
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        this.handleServerError(error);
      });
  }

  viewDetalheNota(notaFiscal: NotaFiscal): void {
    this.router.navigate(['/notas-fiscais', notaFiscal.Id]);
  }

  onSelect(notaFiscal: NotaFiscal): void {
    this.selectedNotaFiscal = notaFiscal;
  }

  getFilterTipoNota(): number {
    return this.filterTipoNota;
  }

  getFilterDataInicial(): Date {
    var data = moment(this.selectedDateDe, 'DD/MM/YYYY').format('YYYY-MM-DD');
    return new Date(data);
  }

  getFilterDataFinal(): Date {
    var data = moment(this.selectedDateAte, 'DD/MM/YYYY').format('YYYY-MM-DD');
    return new Date(data);
  }

  getStateClass(statusCodigo: number): string {
    if (statusCodigo == 1) {
      return 'c-ok';
    }
    if (statusCodigo == 3 || statusCodigo == 4) {
      return 'c-warning';
    }
    if (statusCodigo == 2) {
      return 'c-error';
    }
    return '';
  }

  getStateMapa(statusMapa: string) {
    if (statusMapa.toLocaleUpperCase() == 'FECHADO'
      || statusMapa.toLocaleUpperCase() == 'PRONTO PARA CARREGAR') {
      return 'c-ok';
    }
    return 'c-warning';
  }

  getStateIcon(statusCodigo: number): string {
    if (statusCodigo == 1) {
      return 'icon-checked';
    }
    return '';
  }

  onDataFilter(): void {
    this.loadSources();
  }

  onTipoNotaFilter(): void {
    this.loadSources();
  }

  onOtherFilter(): void {
    this.setFilters();
  }

  onDateInicialChanged(event: IMyDateModel) {
    this.selectedDateDe = event.formatted;
  }

  onDateFinalChanged(event: IMyDateModel) {
    this.selectedDateAte = event.formatted;
  }

  onDateInicialExportChanged(event: IMyDateModel) {
    this.selectedDateDeExport = event.formatted;
  }

  onDateFinalExportChanged(event: IMyDateModel) {
    this.selectedDateAteExport = event.formatted;
  }

  setFilters(): void {
    if (this.filterStatus == 0) {
      this.listNotasFiscais = this.sourceNotasFiscais;
    } else if (this.filterStatus != 0) {
      this.listNotasFiscais = this.sourceNotasFiscais.filter(p => p.StatusCodigo == this.filterStatus);
    } else {
      this.listNotasFiscais = this.sourceNotasFiscais
        .filter(p => p.StatusCodigo == this.filterStatus);
    }
  }

  isBoletoEnabled(notaFiscal: NotaFiscal): boolean {
    return notaFiscal.StatusCodigo == 1
      && notaFiscal.TipoNota == 1
      && notaFiscal.CodigoFormaPagamento == 14;
  }

  gerarBoleto(notaFiscalId: string): void {
    this.isLoading = true;
    this.notaFiscalService.gerarBoleto(notaFiscalId)
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

  baixarDanfe(notaId: string): void {
    this.isLoading = true;
    this.notaFiscalService.baixarDanfe(notaId)
      .then(data => {
        let result = new Blob([data.fileData], { type: 'application/pdf;charset=utf-8' });
        this.fileSaverService.save(result, data.fileName);
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        error.message = 'Nota Fiscal não possui PDF vinculado.';
        this.handleServerError(error);
      });
  }

  baixarXml(notaId: string): void {
    this.isLoading = true;
    this.notaFiscalService.baixarXml(notaId)
      .then(data => {
        let result = new Blob([data.fileData], { type: 'application/xml;charset=utf-8' });
        this.fileSaverService.save(result, data.fileName);
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        error.message = 'Nota Fiscal não possui XML vinculado.';
        this.handleServerError(error);
      });
  }

  cancelarNotaFiscal(notaFiscal: NotaFiscal): void {
    this.isLoading = true;
    this.notaFiscalService.cancelarNotaFiscal(notaFiscal.Id)
      .then(data => {
        try {
          notaFiscal.StatusCodigo = data.StatusCodigo;
          notaFiscal.StatusValor = data.StatusValor;
        } catch (error) { }
        //notaFiscal.StatusEvento = 'Em cancelamento';
        this.isLoading = false;
        this.closeModalConfirmacao();
      })
      .catch(error => {
        this.isLoading = false;
        this.closeModalConfirmacao();
        this.handleServerError(error);
      });
  }

  exportarXML(): void {
    this.isLoading = true;
    this.notaFiscalService.exportXML(this.getFiltroExport())
      .then(data => {
        let result = new Blob([data.fileData], { type: 'application/zip;charset=utf-8' });
        this.fileSaverService.save(result, data.fileName);
        this.isLoading = false;
        this.modalExportar.close();
      })
      .catch(error => {
        this.isLoading = false;
        error.message = 'Sem XML vinculado.';
        this.modalExportar.close();
        this.handleServerError(error);
      });
  }

  exportarCSV(): void {
    this.isLoading = true;
    this.notaFiscalService.exportCSV(this.getFiltroExport())
      .subscribe(data => {
        this.fileSaverService.save((<any>data)._body, 'notas_fiscais.csv');
        this.isLoading = false;
        this.modalExportar.close();
      });
  }

  HabilitaCancelarNota(notaFiscal: NotaFiscal) {
    return ((notaFiscal.StatusCodigo == 1 && notaFiscal.TipoNota == 1) || notaFiscal.StatusCodigo == 2) && !notaFiscal.StatusEvento && notaFiscal.Operacao != '115';
  }

  openModalConfirmacao(notaFiscal: NotaFiscal): void {
    this.selectedNotaFiscal = notaFiscal;
    this.modalConfirmacao.open();
  }

  closeModalConfirmacao(): void {
    this.modalConfirmacao.close();
  }

  private getFiltroExport(): NotaFiscalFilter {
    return new NotaFiscalFilter(this.filterTipoNotaExport, this.filterVendedorExport,
      this.filterClienteExport, this.convertDate(this.selectedDateDeExport), this.convertDate(this.selectedDateAteExport));
  }

  private convertDate(date: string): Date {
    return new Date(moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'));
  }

  private handleServerError(error: GenericResponse): void {
    if (error.message) {
      this.toastService.errorNotification('', error.message);
    } else {
      this.toastService.errorNotification('', 'Falha ocorrida');
    }
  }

  public toInventti(): void {
    this.notaFiscalService.forToInventti();
  }
}