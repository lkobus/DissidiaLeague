import { Component, OnInit, EventEmitter, Output, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { FormsModule, NgModel, NG_VALIDATORS, Validator, Validators, AbstractControl, Form, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Refrigerador } from './model/refrigerador';
import { Comodato, ComodatoSolicitado, FiltroComodatoEnum } from './model/comodato';
import { Cliente } from './../clientes/model/cliente';
import { Modal } from 'ngx-modal';
import { FileSaverService } from 'ngx-filesaver';
import { ToastService } from '../_services/toast.service';
import { BaseTableComponent } from '../shared/table/base-table-component';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { ComodatoService } from './services/comodato.service';
import { ClienteService } from '../_services/cliente.service';
import { GenericResponse } from '../_model/index';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import * as moment from 'moment';


@Component({
  moduleId: module.id,
  selector: 'comodatos',
  templateUrl: 'comodatos.component.html',
  styleUrls: ['comodatos.component.css']
})
export class ComodatosComponent extends BaseTableComponent implements OnInit {

  @Output() searchComodatoChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchRefrigeradorChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("modalSolicitarComodato") modalSolicitarComodato: Modal;
  searchComodatoUpdated: Subject<string> = new Subject<string>();
  searchRefrigeradorUpdated: Subject<string> = new Subject<string>();
  inputSearchRefrigerador: any;
  inputSearchComodato: any;
  currentStatusFilter: number;
  carregou: boolean = false;
  selectedRefrigerador: Refrigerador;
  sourceRefrigeradores: Refrigerador[] = [];
  listRefrigeradores: Refrigerador[] = [];
  isLoading: boolean = false;
  isTabComodato: boolean = true;
  isTabEstoque: boolean = false;
  solicitacaoComodato: Comodato;
  listClientes: Cliente[];
  clienteSelecionado: Cliente;
  isImporting: boolean = false;
  filtroGeral: number;

  comodatos: Comodato[] = [];
  sourceComodatos: Comodato[] = [];
  refrigeradores: Refrigerador[];

  public submitted: boolean = false;
  public selectedDateVencimento = moment().add(1, 'y').format("DD/MM/YYYY");
  private dataInicialFilter: string;
  private dataFinalFilter: string;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: "dd/mm/yyyy",
    dayLabels: {
      su: "Dom",
      mo: "Seg",
      tu: "Ter",
      we: "Qua",
      th: "Qui",
      fr: "Sex",
      sa: "Sab"
    },
    monthLabels: {
      1: "Jan",
      2: "Fev",
      3: "Mar",
      4: "Abr",
      5: "Mar",
      6: "Jun",
      7: "Jul",
      8: "Ago",
      9: "Set",
      10: "Out",
      11: "Nov",
      12: "Dez"
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
    private comodatoService: ComodatoService,
    private clienteService: ClienteService,
    private _toastService: ToastService,
    private router: Router
  ) {
    super();
    this.listClientes = [];
    this.clienteSelecionado = new Cliente();
    this.solicitacaoComodato = new Comodato();
    this.searchRefrigeradorChangeEmitter = <any>this.searchRefrigeradorUpdated.asObservable()
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(item => this.filterRefrigeradores(item));

    this.searchComodatoChangeEmitter = <any>this.searchComodatoUpdated.asObservable()
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(item => this.filterListComodato(item));

  }

  getAllComodatosAssociados(): void {
    this.isTabEstoque = false;
    this.isTabComodato = true;
  }

  getAllRefrigeradoresEstoque(): void {
    this.selectedRefrigerador = null;
    this.isTabComodato = false;
    this.isLoading = true;
    this.isTabEstoque = true;
    this.selectedDateVencimento = moment().add(1, 'y').format("DD/MM/YYYY");
    this.comodatoService
      .getRefrigeradoresEstoque()
      .then(refrigeradores => {
        this.sourceRefrigeradores = refrigeradores;
        this.listRefrigeradores = refrigeradores;
        this.isLoading = false
      });
  }

  inputSearchRefrigeradorOnFilter(searchText: string): void {
    this.searchRefrigeradorUpdated.next(searchText);
  }

  inputSearchComodatoOnFilter(searchText: string): void {
    this.searchComodatoUpdated.next(searchText);
  }

  getRefrigeradorImageURL(refrigeradorId: string) {
    return this.comodatoService.getRefrigeradorImageURL(refrigeradorId);
  }

  ngOnInit() {
    this.LoadClientesList();
    this.getAllComodatosAssociados();
    this.LoadComodatos();
  }

  public LoadComodatos() {
    this.isLoading = true;
    this.carregou = false;
    this.comodatoService.getComodatos()
      .flatMap(p => {
        this.comodatos = p;
        this.sourceComodatos = p;
        return this.comodatoService.getRefrigeradores();
      })
      .flatMap(d => {
        this.refrigeradores = d;

        return Observable.of(true);
      })
      .subscribe(() => { this.isLoading = false, this.carregou = true });
  }

  public changeNameClienteComodato(idForNameCliente: string): string {
    var nomeCliente = '';
    this.listClientes.forEach(p => {
      if (p.Id == idForNameCliente) {
        nomeCliente = p.NomeFantasia;
      }
    });
    return nomeCliente;
  }

  public changeNameRefrigeradorComodato(idForName: string): string {
    var nomeRefrigerador = '';
    this.refrigeradores.forEach(p => {
      if (p.documentId == idForName) {
        nomeRefrigerador = p.nomeAmigavel;
      }
    });
    return nomeRefrigerador;
  }

  public formatDate(dateConvert: string): string {
    return moment(dateConvert).format('DD/MM/YYYY');
  }

  public changeCssLi(comodato: Comodato): string {
    var classCss = ["", "product plus", "product minus", "product disabled"];
    var classAplique = '';

    if (comodato.status == 2 && this.formatDate(comodato.dataVencimento) < moment().format('DD/MM/YYYY')) {
      classAplique = classCss[2];
    } else if (comodato.status == 2 && this.formatDate(comodato.dataVencimento) >= moment().format('DD/MM/YYYY')) {
      classAplique = classCss[1];
    } else if (comodato.status == 1) {
      classAplique = classCss[3];
    }
    return classAplique;
  }

  public changeStatusComodato(comodatoStatus: Comodato): string {
    var status = ['', 'Vigente', 'Atrasado', 'Enviando', 'Recolhendo'];
    var statusToComodato = '';

    if (comodatoStatus.status == 2 && this.formatDate(comodatoStatus.dataVencimento) < moment().format('DD/MM/YYYY')) {
      statusToComodato = status[2];
    } else if (comodatoStatus.status == 2 && this.formatDate(comodatoStatus.dataVencimento) >= moment().format('DD/MM/YYYY')) {
      statusToComodato = status[1];
    } else if (comodatoStatus.status == 1) {
      statusToComodato = status[3];
    } else if (comodatoStatus.status == 3) {
      statusToComodato = status[4];
    }
    return statusToComodato;
  }

  onRefrigeradorSelected(refrigerador: Refrigerador): void {
    this.selectedRefrigerador = refrigerador;
  }

  OnTabSelected(tab: any) {
    if (tab.title == 'Comodatos') {
      this.getAllComodatosAssociados();
    }
    if (tab.title == 'Estoque') {
      this.getAllRefrigeradoresEstoque();
    }
  }

  IncluirNovaSolicitacao(refrigerador: Refrigerador) {
    this.solicitacaoComodato = new Comodato();
    this.solicitacaoComodato.cliente = null;
    this.solicitacaoComodato.refrigerador = refrigerador;
    this.solicitacaoComodato.valor = refrigerador.custoMedio;
    this.solicitacaoComodato.dataVencimento = moment().add(1, 'y').format("DD/MM/YYYY");
    this.solicitacaoComodato.dataSolicitacao = moment().format("DD/MM/YYYY");
    this.modalSolicitarComodato.open();
  }

  CadastrarComodato(form: AbstractControl): void {
    this.submitted = true;
    if (!form.valid) {
      this._toastService.errorNotification(
        "",
        "Por favor, verifique os campos informados"
      );
      console.log("Form is invalid");
      return;
    }
    if (!this.solicitacaoComodato.cliente.Id) {
      this._toastService.errorNotification(
        "",
        "Por favor, selecione um cliente"
      );
      console.log("Form is invalid");
      return;
    }
    this.modalSolicitarComodato.close();
    this.comodatoService
      .GerarSolicitacaoComodato(this.PreparaSolicitacaoComodato(this.solicitacaoComodato))
      .subscribe(
      () => {
        this.isImporting = false;
        this._toastService.sucessNotification(
          "",
          "Pedido de comodato gerado com sucesso."
        );
        this.getAllRefrigeradoresEstoque();
        this.LoadComodatos();
      },
      error => {
        this.isImporting = false;
        this._toastService.errorNotification(
          "Erro ao gerar o comodato",
          error.message
        );
      }
      );
  }

  PreparaSolicitacaoComodato(comodato: Comodato): ComodatoSolicitado {
    let comodatoSolicitado = new ComodatoSolicitado();
    comodatoSolicitado.ClienteId = comodato.cliente.Id;
    comodatoSolicitado.DataVencimento = moment(comodato.dataVencimento, "DD/MM/YYYY").format("YYYY/MM/DD");
    comodatoSolicitado.Valor = comodato.valor;
    comodatoSolicitado.mensagemDanfe = comodato.mensagemDanfe;
    comodatoSolicitado.RefrigeradorId = comodato.refrigerador.documentId;
    return comodatoSolicitado;
  }

  LoadClientesList(): void {
    this.clienteService.getAllClientes().subscribe(
      data => {
        this.listClientes = data;
      },
      err => {
        this._toastService.errorNotification(
          "Erro ao carregar os clientes",
          err.message
        );
      }
    );
  }

  OnValorChange(event) {
    this.solicitacaoComodato.valor = event;
  }

  customCallback(event: Event) {
    return event;
  }

  selectAutoCompleteEstoque(event: Event) {
    console.log(event);
  }

  onDateVencimentoChanged(event: IMyDateModel) {
    this.solicitacaoComodato.dataVencimento = event.formatted;
    this.selectedDateVencimento = event.formatted;
  }

  //    this.dataFilter = moment(dataMesMeta.toString()).format('MM/YYYY');
  //  this.onSearchType(this.dataFilter);

  public onDateInicialChanged(event: any): void {
    var dataInicial = event.jsdate;
    this.dataInicialFilter = moment(dataInicial.toString()).format('DD/MM/YYYY');
    this.filterComodatoForDate(this.dataInicialFilter, this.dataFinalFilter);
  }

  public onDateFinalChanged(event: any): void {
    var dataFinal = event.jsdate;
    this.dataFinalFilter = moment(dataFinal.toString()).format('DD/MM/YYYY');
    this.filterComodatoForDate(this.dataInicialFilter, this.dataFinalFilter);
  }

  private filterComodatoForDate(dataInicial: string, dataFinal: string): void {
    var comodatoDataFiltrado = [];

    this.comodatos = this.sourceComodatos.filter(f => {
      if (this.formatDate(f.dataSolicitacao) >= dataInicial && this.formatDate(f.dataVencimento) <= dataFinal) {
        comodatoDataFiltrado.push(f);
      }
    });

    this.comodatos = comodatoDataFiltrado;
  }

  public filtroGeralComodato(filter: number) {
    var comodatoFiltrado = [];

    this.comodatos = this.sourceComodatos.filter(c => {

      if (FiltroComodatoEnum.TODOS.Codigo == filter) {
        comodatoFiltrado = this.sourceComodatos;
      }

      if (FiltroComodatoEnum.VENCIDOS.Codigo == filter) {
        if (c.status == 2 && this.formatDate(c.dataVencimento) >= moment().format('DD/MM/YYYY')) {
          comodatoFiltrado.push(c);
        }
      }

      if (FiltroComodatoEnum.VENCIDOS.Codigo == filter) {
        if (c.status == 2 && this.formatDate(c.dataVencimento) < moment().format('DD/MM/YYYY')) {
          comodatoFiltrado.push(c);
        }
      }

      if (FiltroComodatoEnum.SOLICITACAO.Codigo == filter) {
        if (c.status == 1) {
          comodatoFiltrado.push(c);
        }
      }
    });

    this.comodatos = comodatoFiltrado;
  }

  filterRefrigeradores(searchText) {
    if (searchText) {
      searchText = searchText.toLowerCase();
    } else {
      searchText = '';
    }
    if (!this.currentStatusFilter) {
      this.currentStatusFilter = 0;
    }
    this.listRefrigeradores = this.sourceRefrigeradores.filter((c: any) => {
      let found = false;

      let nome = c.nomeAmigavel;
      if (!nome) {
        nome = '';
      }
      let codigo = c.codigo;
      if (!codigo) {
        codigo = '';
      }
      if (searchText != '' && (nome.toLowerCase().indexOf(searchText) > -1
        || String(codigo) == searchText)) {
        found = true;
      }

      return (found || searchText == '') && (this.currentStatusFilter == 0 || c.status == this.currentStatusFilter)
    });
    this.selectedRefrigerador = null;
  }

  public filterListComodato(searchText): void {
    if (searchText) {
      searchText = searchText.toLowerCase();
    } else {
      searchText = '';
    }
    if (!this.currentStatusFilter) {
      this.currentStatusFilter = 0;
    }

    this.comodatos = this.sourceComodatos.filter((c: any) => {
      let found = false;

      let nome = this.changeNameClienteComodato(c.clienteId);
      if (!nome) {
        nome = '';
      }

      if (searchText != '' && nome.toLowerCase().indexOf(searchText) > -1) {
        found = true;
      }

      return (found || searchText == '') && (this.currentStatusFilter == 0 || c.status == this.currentStatusFilter)
    });
  }

  private handleServerError(error: GenericResponse): void {
    if (error.message) {
      this._toastService.errorNotification('', error.message);
    } else {
      this._toastService.errorNotification('', 'Falha ocorrida');
    }
  }

  public selectAutoComplete(franquiaFilter: string): void {
    this.onSearchType(franquiaFilter);
  }

  private onSearchType(value: string): void {
    this.searchComodatoChangeEmitter.next(value);
    this.inputSearchComodato = value;
  }
}
