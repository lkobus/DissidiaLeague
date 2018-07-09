import { Component, OnInit, EventEmitter, Output, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { FormsModule, NgModel, NG_VALIDATORS, Validator, Validators, AbstractControl, Form, ValidatorFn } from '@angular/forms';
import { FinanceiroService } from './services/financas.service';
import { ToastService } from '../_services/toast.service';
import {
  ExtratoFinanceiro, Status, Titulo, Categoria, TipoTitulo, FinalidadeCategoriaEnum, FormaPagamento, Remessas
} from './model/financas';
import { ChartCategoriasModel, ChartData, ChartSeries } from './demo/chart-categorias';
import { ChartExtratoModel, ChartExtratoAxis, ChartExtratoSeries } from './demo/chart-extrato';
import { Modal } from 'ngx-modal';
import { DatePipe } from '@angular/common';
import * as demo from './demo/index';
import * as moment from 'moment';
import { Tabs } from '../shared/tabs/tabs';
import { FileSaverService
} from 'ngx-filesaver';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { FornecedorService } from '../fornecedor/service/fornecedor.service';
import { Fornecedor } from '../fornecedor/model/fornecedor';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { debug } from 'util';
import { Subject } from 'rxjs/Subject';
import { BaseTableComponent } from '../shared/table/base-table-component';

@Component({
  moduleId: module.id,
  selector: "financas-selector",
  templateUrl: "financas.component.html",
  styleUrls: ["financas.component.css"]
})
export class FinancasComponent extends BaseTableComponent implements OnInit {
  @Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  searchUpdated: Subject<string> = new Subject<string>();

  @ViewChild("modalConfirmaPagamento") modalConfirmaPagamento: Modal;
  @ViewChild("modalImportar") modalNovoLancamento: Modal;
  @ViewChild("modalRemessaBancaria") modalRemessaBancaria: Modal;
  @ViewChild("modalRetornoBancario") modalRetornoBancario: Modal;
  @ViewChild("modalConfirmaCancelamento") modalConfirmaCancelamento: Modal;
  @ViewChild("categoriaSelect") categoriaSelect: ElementRef;
  @ViewChild("pagamentoSelect") pagamentoSelect: ElementRef;

  ChartPagamentos: ChartExtratoModel;
  ChartRecebimentos: ChartExtratoModel;
  ChartExtrato: ChartExtratoModel;
  ChartCategoriasPagamentos: ChartCategoriasModel;
  ChartCategoriasRecebimentos: ChartCategoriasModel;
  extrato: ExtratoFinanceiro;

  titulosExtrato: Titulo[];
  titulosReceber: Titulo[];
  titulosPagar: Titulo[];

  filterValue: string;
  sourceTitulosExtrato: Titulo[];
  sourceTitulosReceber: Titulo[];
  sourceTitulosPagar: Titulo[];

  arrStatus: Status[] = [
    Status.Todos,
    Status.Pendente,
    Status.Recebido,
    Status.Atrasado,
    Status.Cancelado
  ];
  statusSelecionado: number = 0;

  remessas: Remessas;
  titulosRemessa: Titulo[];
  selectPeriodoValue: any;
  checkedTitulos: Titulo[] = [];

  TotalReceber: number;
  FormasPagamento: FormaPagamento[];
  Categorias: Categoria[];
  novoTitulo: any;
  isImporting: boolean;
  listFornecedores: Fornecedor[];
  fileHolder: any;
  public isLoading: boolean = false;
  public submitted: boolean = false;
  public selectedDateInicio = moment().format("DD/MM/YYYY");
  public showTr = -1;

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

  ngOnInit() {
    this.selectPeriodoValue = "hoje";
    this.LoadExtratoDia();
    this.LoadFornecedoresList();
  }

  constructor(
    private financasService: FinanceiroService,
    private fileSaverService: FileSaverService,
    private _toastService: ToastService,
    private fornecedorService: FornecedorService
  ) {
    super();

    this.listFornecedores = [];
    this.ChartCategoriasPagamentos = new ChartCategoriasModel("Categorias");
    this.ChartCategoriasRecebimentos = new ChartCategoriasModel("Categorias");
    this.ChartExtrato = new ChartExtratoModel();
    this.ChartPagamentos = new ChartExtratoModel();
    this.ChartRecebimentos = new ChartExtratoModel();
    this.configurarFiltro();
  }

  OnCheckTitulo(value: any) {
    var titulo = this.titulosExtrato.find(t => t.documentId == value);
    var index = this.checkedTitulos.indexOf(titulo);
    if (index > -1) {
      this.checkedTitulos.splice(index, 1);
    } else {
      this.checkedTitulos.push(titulo);
    }
    console.log(this.checkedTitulos);
  }

  IsHojeFilter() {
    return this.selectPeriodoValue == "hoje";
  }

  IsSemanaFilter() {
    return this.selectPeriodoValue == "semana";
  }

  IsMesFilter() {
    return this.selectPeriodoValue == "mês";
  }

  IsAnoFilter() {
    return this.selectPeriodoValue == "ano";
  }

  onChangeFiltroPeriodo(value: any): void {
    this.titulosExtrato = [];
    this.titulosReceber = [];
    this.titulosPagar = [];
    this.sourceTitulosExtrato = [];
    this.sourceTitulosReceber = [];
    this.sourceTitulosPagar = [];

    if (this.IsHojeFilter()) {
      return this.LoadExtratoDia();
    } else if (this.IsSemanaFilter()) {
      return this.LoadExtratoSemana();
    } else if (this.IsMesFilter()) {
      return this.LoadExtratoMes();
    } else if (this.IsAnoFilter()) {
      return this.getExtratoAno();
    }
  }

  onChangeFiltroPagamentos(): void {
    this.SetTitulosPagarList(this.statusSelecionado);
  }

  onChangeFiltroRecebimentos(): void {
    this.SetTitulosReceberList(this.statusSelecionado);
  }

  onChangeFiltroExtrato(): void {
    this.SetTitulosExtratoList(this.statusSelecionado);
  }

  LoadFornecedoresList(): void {
    this.fornecedorService.getFornecedores().subscribe(
      data => {
        this.listFornecedores = data;
      },
      err => this.OnLoadError(err)
    );
  }

  LoadExtratoDia(): void {
    this.isLoading = true;
    this.financasService
      .GetExtratoDia()
      .subscribe(
        data => this.OnExtratoResult(data),
        err => this.OnLoadError(err),
        () => (this.isLoading = false)
      );
  }

  LoadExtratoSemana(): void {
    this.isLoading = true;
    this.financasService
      .GetExtratoSemana()
      .subscribe(
        data => this.OnExtratoResult(data),
        err => this.OnLoadError(err),
        () => (this.isLoading = false)
      );
  }

  LoadExtratoMes(): void {
    this.isLoading = true;
    this.financasService
      .GetExtratoMes()
      .subscribe(
        data => this.OnExtratoResult(data),
        err => this.OnLoadError(err),
        () => (this.isLoading = false)
      );
  }

  getExtratoAno(): void {
    this.isLoading = true;
    this.financasService
      .GetExtratoAno()
      .subscribe(
        data => this.OnExtratoResult(data),
        err => this.OnLoadError(err),
        () => (this.isLoading = false)
      );
  }

  ReceberContas() {
    this.isLoading = true;
    this.checkedTitulos.forEach(element => {
      element.valorPago = element.valorReceber;
    });
    this.financasService
      .PagarContas(this.checkedTitulos.filter(t => t.valorReceber > 0))
      .subscribe(
        data => this.OnPagamentoEfetuado(),
        err => this.OnLoadError(err)
      );
  }

  OnPagamentoEfetuado() {
    this.isLoading = false;
    this.modalConfirmaPagamento.close();
    this.onChangeFiltroPeriodo(this.selectPeriodoValue);
  }

  OnExtratoResult(extrato: ExtratoFinanceiro) {
    console.log("OnDataLoaded: " + extrato);
    this.checkedTitulos = [];
    this.extrato = extrato;
    this.extrato.pagamentos = this.Sort(this.extrato.pagamentos);
    this.extrato.recebimentos = this.Sort(this.extrato.recebimentos);

    this.SetTitulosPagarList(this.statusSelecionado);
    this.SetTitulosReceberList(this.statusSelecionado);
    this.SetTitulosExtratoList(this.statusSelecionado);

    this.PrepareChartCategorias(extrato);
    this.PrepareChartExtrato(extrato);
  }

  Sort(list: Titulo[]) {
    return list.sort((a, b) => {
      var aSize = moment(a.dataDocumento, "YYYY/MM/DD");
      var bSize = moment(b.dataDocumento, "YYYY/MM/DD");
      var aLow = moment(a.dataVencimento, "YYYY/MM/DD");
      var bLow = moment(b.dataVencimento, "YYYY/MM/DD");

      if (
        aSize.date() == bSize.date() &&
        aSize.month() == bSize.month() &&
        aSize.year() == bSize.year()
      ) {
        return aLow < bLow ? -1 : aLow > bLow ? 1 : 0;
      } else {
        return aSize > bSize ? -1 : 1;
      }
    });
  }

  GetStatusDescricao(titulo: Titulo): string {
    if (this.IsTituloRecebido(titulo)) {
      if (this.IsTituloPagar(titulo)) {
        return "Pago";
      } else {
        return "Recebidos";
      }
    } else {
      return titulo.status.descricao;
    }
  }

  GetStateClass(titulo: Titulo): string {
    if (this.IsTituloAtrasado(titulo) || this.IsTituloCancelado(titulo)) {
      return "c-error";
    } else if (this.IsTituloPendente(titulo)) {
      return "c-warning";
    }
    return "c-ok";
  }

  GetStateIconClass(titulo: Titulo): string {
    if (this.IsTituloAtrasado(titulo)) {
      return "icon-clock";
    } else if (this.IsTituloPendente(titulo)) {
      return "icon-clock";
    } else if (this.IsTituloCancelado(titulo)) {
      return "icon-minus-o";
    }
    return "icon-checked";
  }

  GetSaldo(): number {
    return this.GetTotalRecebido() - this.GetTotalPago();
  }

  GetSaldoEstimado(): number {
    var entrada = this.GetTotalReceber() + this.GetTotalReceberAtrasado();
    var saida = this.GetTotalPagar() + this.GetTotalPagarAtrasado();
    return entrada - saida;
  }

  GetSaldoEstimadoAtrasado(): number {
    var entrada = this.extrato.recebimentos
      .filter(t => t.status.codigo == Status.Atrasado.codigo)
      .reduce((a, b) => a + b.valor, 0);
    var saida = this.extrato.pagamentos
      .filter(t => t.status.codigo == Status.Atrasado.codigo)
      .reduce((a, b) => a + b.valor, 0);
    return entrada - saida;
  }

  GetTotalReceber(): number {
    var temp = this.extrato.recebimentos.filter(
      t =>
        t.status.codigo === Status.Pendente.codigo &&
        this.IsTituloVencimentoToFilter(t)
    );
    var sum = temp.reduce((a, b) => a + b.valor, 0);
    return sum;
  }

  GetTotalRecebido(): number {
    var temp = this.extrato.recebimentos.filter(
      t => t.status.codigo === Status.Recebido.codigo
    );
    var sum = temp.reduce((a, b) => a + b.valorPago, 0);
    return sum;
  }

  GetTotalReceberAtrasado(): number {
    var temp = this.extrato.recebimentos.filter(
      t => t.status.codigo === Status.Atrasado.codigo
    );
    var sum = temp.reduce((a, b) => a + b.valor, 0);
    return sum;
  }

  GetTotalPago(): number {
    var temp = this.extrato.pagamentos.filter(
      t => t.status.codigo === Status.Recebido.codigo
    );
    var sum = temp.reduce((a, b) => a + b.valorPago, 0);
    return sum;
  }

  IsTituloVencimentoToFilter(titulo: Titulo): boolean {
    if (this.IsHojeFilter()) {
      var a = moment().format("DDMMYYYY");
      var b = moment(titulo.dataVencimento, "YYYY-MM-DD").format("DDMMYYYY");
      return a == b;
    } else if (this.IsSemanaFilter()) {
      var startDate = moment().startOf('week');
      var finalDate = moment().endOf('week');
     return moment().isBetween(startDate, finalDate);
    } else if (this.IsMesFilter()) {
      startDate = moment().startOf('month');
      finalDate = moment().endOf('month');
      return moment().isBetween(startDate, finalDate);
    } else if (this.IsAnoFilter()) {
      startDate = moment().startOf('year');
      finalDate = moment().endOf('year');
      return moment().isBetween(startDate, finalDate);
    }

    return false;
  }

  GetTotalPagar(): number {
    var temp = this.extrato.pagamentos.filter(
      t =>
        t.status.codigo === Status.Pendente.codigo &&
        this.IsTituloVencimentoToFilter(t)
    );
    var titulosPendentes = this.sourceTitulosPagar.filter(t =>
      this.IsTituloPendente(t)
    );

    var sum = temp.reduce((a, b) => a + b.valor, 0);
    var totalTitulos = titulosPendentes.reduce((a, b) => a + b.valor, 0);

    return sum + totalTitulos;
  }

  GetTotalPagarAtrasado(): number {
    var temp = this.extrato.pagamentos.filter(
      t => t.status.codigo === Status.Atrasado.codigo
    );
    var sum = temp.reduce((a, b) => a + b.valor, 0);
    return sum;
  }

  IsTituloRecebido(titulo: Titulo): boolean {
    return titulo.status.codigo == Status.Recebido.codigo;
  }

  IsTituloAtrasado(titulo: Titulo): boolean {
    return titulo.status.codigo == Status.Atrasado.codigo;
  }

  IsTituloPendente(titulo: Titulo): boolean {
    return titulo.status.codigo == Status.Pendente.codigo;
  }

  IsTituloCancelado(titulo: Titulo): boolean {
    return titulo.status.codigo == Status.Cancelado.codigo;
  }

  SetTitulosPagarList(filter: number) {
    var titulos = this.extrato.pagamentos;

    if (filter != Status.Todos.codigo) {
      titulos = this.extrato.pagamentos.filter(t => t.status.codigo == filter);
    }

    var titulosFilter = titulos;
    if (this.filterValue != null && this.filterValue.trim() != "") {
      titulosFilter = titulosFilter.filter(t =>
        this.filtroTitulo(this.filterValue, t)
      );
    }

    this.titulosPagar = titulosFilter;
    this.sourceTitulosPagar = titulos;
  }

  SetTitulosReceberList(filter: number): void {
    var titulos = this.extrato.recebimentos;

    if (filter != Status.Todos.codigo) {
      titulos = this.extrato.recebimentos.filter(
        t => t.status.codigo == filter
      );
    }

    var titulosFilter = titulos;
    if (this.filterValue != null && this.filterValue.trim() != "") {
      titulosFilter = titulosFilter.filter(t =>
        this.filtroTitulo(this.filterValue, t)
      );
    }

    this.titulosReceber = titulosFilter;
    this.sourceTitulosReceber = titulos;
  }

  SetTitulosExtratoList(filter: number): void {
    var pagamentos = this.extrato.pagamentos;
    var recebimentos = this.extrato.recebimentos;

    if (filter != Status.Todos.codigo) {
      pagamentos = pagamentos.filter(t => t.status.codigo == filter);
      recebimentos = recebimentos.filter(t => t.status.codigo == filter);
    }

    var pagamentosFilter = pagamentos;
    var recebimentosFilter = recebimentos;
    if (this.filterValue != null && this.filterValue.trim() != "") {
      pagamentosFilter = pagamentosFilter.filter(t =>
        this.filtroTitulo(this.filterValue, t)
      );
      recebimentosFilter = recebimentosFilter.filter(t =>
        this.filtroTitulo(this.filterValue, t)
      );
    }

    this.titulosExtrato = [];
    this.titulosExtrato = this.titulosExtrato.concat(pagamentosFilter);
    this.titulosExtrato = this.titulosExtrato.concat(recebimentosFilter);

    this.sourceTitulosExtrato = pagamentos.concat(recebimentos);
  }

  PrepareChartExtrato(extrato: ExtratoFinanceiro) {
    this.ChartExtrato = new ChartExtratoModel();
    this.ChartRecebimentos = new ChartExtratoModel();
    this.ChartPagamentos = new ChartExtratoModel();

    this.FillExtratoChart(extrato);
    this.AddRecebidosExtratoChart(extrato);
    this.AddPagamentosExtratoChart(extrato);
  }

  GroupRecebidosValues(values: Titulo[]) {
    return values
      .filter(t => t.status.codigo == Status.Recebido.codigo)
      .sort((a, b) => {
        let date1 = moment(a.dataPagamento, "YYYY/MM/DD HH:mm:ss");
        let date2 = moment(b.dataPagamento, "YYYY/MM/DD HH:mm:ss");
        return date1.diff(date2) >= 0 ? 1 : -1;
      })
      .reduce((obj, item) => {
        var temp = moment(item.dataPagamento, "YYYY/MM/DD HH:mm:ss").format(
          "DD/MM"
        );
        if (this.IsAnoFilter()) {
          temp = moment(item.dataPagamento, "YYYY/MM/DD HH:mm:ss").format(
            "MMM"
          );
        }

        obj[temp] = obj[temp] || [];
        obj[temp].push(item);
        return obj;
      }, {});
  }

  FillExtratoChart(extrato: ExtratoFinanceiro) {
    var temp = extrato.pagamentos;
    temp = temp.concat(extrato.recebimentos);
    var groups = this.GroupRecebidosValues(temp);

    var serieRecebimentos = this.ChartExtrato.CreateSerie(
      "Recebimentos",
      "#00e07e"
    );
    var seriePagamentos = this.ChartExtrato.CreateSerie(
      "Pagamentos",
      "#fd796a"
    );

    this.ChartExtrato.TooltipFormatter();
    this.ChartExtrato.YAxisFormatter();

    Object.keys(groups).map(key => {
      var list = groups[key] as Titulo[];
      this.ChartExtrato.AddXAxis(key);

      seriePagamentos.addData(
        list.reduce((a, b) => {
          if (this.IsTituloPagar(b)) {
            return a + (b.valorPago > 0 ? b.valorPago : b.valor);
          }
          return a + 0;
        }, 0)
      );

      serieRecebimentos.addData(
        list.reduce((a, b) => {
          if (!this.IsTituloPagar(b)) {
            return a + (b.valorPago > 0 ? b.valorPago : b.valor);
          }
          return a + 0;
        }, 0)
      );
    });
  }

  AddRecebidosExtratoChart(extrato: ExtratoFinanceiro) {
    var groups = this.GroupRecebidosValues(extrato.recebimentos);
    var serieRecebimento = this.ChartRecebimentos.CreateSerie(
      "Recebimentos",
      "#00e07e"
    );
    this.ChartRecebimentos.TooltipFormatter();
    this.ChartRecebimentos.YAxisFormatter();

    Object.keys(groups).map(key => {
      var list = groups[key] as Titulo[];
      this.ChartRecebimentos.AddXAxis(key);
      serieRecebimento.addData(
        list.reduce((a, b) => a + (b.valorPago > 0 ? b.valorPago : b.valor), 0)
      );
    });
  }

  AddPagamentosExtratoChart(extrato: ExtratoFinanceiro) {
    var groups = this.GroupRecebidosValues(extrato.pagamentos);
    var seriePagamento = this.ChartPagamentos.CreateSerie(
      "Pagamentos",
      "#fd796a"
    );
    this.ChartPagamentos.TooltipFormatter();
    this.ChartPagamentos.YAxisFormatter();

    Object.keys(groups).map(key => {
      var list = groups[key] as Titulo[];
      this.ChartPagamentos.AddXAxis(key);
      seriePagamento.addData(
        list.reduce((a, b) => a + (b.valorPago > 0 ? b.valorPago : b.valor), 0)
      );
    });
  }

  PrepareChartCategorias(extrato: ExtratoFinanceiro) {
    this.ChartCategoriasPagamentos = new ChartCategoriasModel("Categorias");
    this.ChartCategoriasRecebimentos = new ChartCategoriasModel("Categorias");

    var categoriasP = this.AgrupaCategorias(this.extrato.pagamentos);
    Object.keys(categoriasP).map(key => {
      var list = categoriasP[key] as any[];
      var element = new ChartData(
        key,
        Number(
          Number(
            list.reduce(
              (a, b: Titulo) => (b.valorPago > 0 ? b.valorPago : b.valor) + a,
              0
            )
          ).toFixed(2)
        )
      );
      this.ChartCategoriasPagamentos.add(element);
    });

    var categoriasR = this.AgrupaCategorias(this.extrato.recebimentos);
    Object.keys(categoriasR).map(key => {
      var list = categoriasR[key] as any[];
      var element = new ChartData(
        key,
        Number(
          Number(
            list.reduce(
              (a, b: Titulo) => (b.valorPago > 0 ? b.valorPago : b.valor) + a,
              0
            )
          ).toFixed(2)
        )
      );
      this.ChartCategoriasRecebimentos.add(element);
    });
  }

  AgrupaCategorias(titulos: Titulo[]) {
    var groups = titulos.reduce((obj, item) => {
      obj[item.categoria.descricao] = obj[item.categoria.descricao] || [];
      obj[item.categoria.descricao].push(item);
      return obj;
    }, {});
    return groups;
  }

  OnLoadError(err) {
    console.error(err);
    this.isLoading = false;
    this.isImporting = false;
    this._toastService.errorNotification(
      "Erro carregar extrato",
      "Extrato não carregado"
    );
  }

  IsTituloPagar(titulo: Titulo) {
    return (
      this.extrato.pagamentos.find(t => t.documentId == titulo.documentId) !=
      null
    );
  }

  GetSaldoRestante(titulo: Titulo): number {
    if (titulo.status.codigo == Status.Recebido.codigo) {
      return 0;
    } else {
      return titulo.valor;
    }
  }

  TotalPagamentoAReceber(): Number {
    try {
      return this.checkedTitulos.reduce(
        (a, b) => Number(b.valor) - Number(b.valorPago) + a,
        0
      );
    } catch (err) {
      return 0;
    }
  }

  TotalPagamentoRecebido(): Number {
    var sum = 0;
    this.checkedTitulos.forEach(el => {
      sum += el.valorReceber ? Number(el.valorReceber) : 0;
    });
    return sum;
  }

  BindCategorias(data: Categoria[], finalidade: FinalidadeCategoriaEnum) {
    this.Categorias = [];
    data.push(new Categoria(0, "Selecione", [finalidade.codigo]));
    this.Categorias = data
      .filter(categoria => categoria.finalidade.includes(finalidade.codigo))
      .sort(p => p.codigo);
  }

  BindFormasPagamento(data: FormaPagamento[]) {
    this.FormasPagamento = [];
    data.push(new FormaPagamento({ codigo: 0, descricao: "Selecione" }));
    this.FormasPagamento = data.sort(f => f.codigo);
  }

  IniciarRecebimento() {
    this.modalConfirmaPagamento.open();
  }

  ResetTitulo(tipo: TipoTitulo) {
    this.submitted = false;
    this.selectedDateInicio = moment().format("DD/MM/YYYY");

    this.novoTitulo = {};
    this.novoTitulo.tipo = tipo;
    this.novoTitulo.dataLancamento = moment().format("DD/MM/YYYY");
    this.novoTitulo.vencimentos = [];
    this.novoTitulo.fornecedor = null;

    if (this.categoriaSelect) {
      this.categoriaSelect.nativeElement.selectedIndex = "-1";
    }
    if (this.pagamentoSelect) {
      this.pagamentoSelect.nativeElement.selectedIndex = "-1";
    }
  }

  IncluirNovoRecebimento() {
    this.ResetTitulo(TipoTitulo.Receber);

    this.financasService
      .GetCategorias()
      .subscribe(data =>
        this.BindCategorias(data, FinalidadeCategoriaEnum.Receber)
      );
    this.financasService
      .GetFormasPagamento()
      .subscribe(data => this.BindFormasPagamento(data));

    this.novoTitulo.fornecedor = {};
    this.modalNovoLancamento.title = "Cadastrar recebimento";
    this.modalNovoLancamento.open();
  }

  IncluirNovoPagamento() {
    this.ResetTitulo(TipoTitulo.Pagar);

    this.financasService
      .GetCategorias()
      .subscribe(data =>
        this.BindCategorias(data, FinalidadeCategoriaEnum.Pagar)
      );
    this.financasService
      .GetFormasPagamento()
      .subscribe(data => this.BindFormasPagamento(data));

    this.modalNovoLancamento.title = "Cadastrar pagamento";
    this.modalNovoLancamento.open();
  }

  GetPayload() {
    return JSON.stringify(this.novoTitulo);
  }

  OnPagamentoChange(event) {
    if (
      event &&
      event.descricao.toString().toLowerCase() == "dinheiro".toLowerCase()
    ) {
      this.novoTitulo.parcelas = 1;
    }
  }

  OnValorChange(event) {
    this.novoTitulo.valor = event;
    this.CalculaVecimentos();
  }

  OnParcelasChange(event) {
    if (!event || event <= 0) {
      event = 1;
    }
    this.novoTitulo.parcelas = event;
    this.CalculaVecimentos();
  }

  CalculaVecimentos() {
    this.novoTitulo.vencimentos = [];

    if (!this.novoTitulo.parcelas || this.novoTitulo.parcelas <= 0) {
      this.novoTitulo.parcelas = 1;
    }

    if (!this.novoTitulo.valor) {
      this.novoTitulo.valor = 0;
    }

    var primeiraParcela = moment(this.selectedDateInicio, "DD/MM/YYYY");
    var valor = Number(this.novoTitulo.valor);
    for (var index = 1; index <= this.novoTitulo.parcelas; index++) {
      this.novoTitulo.vencimentos.push({
        data: moment(primeiraParcela),
        valor: valor
      });

      primeiraParcela = moment(primeiraParcela.add(1, "month"));
      if (primeiraParcela.month() == 12) {
        primeiraParcela = moment(primeiraParcela.add(1, "year"));
        primeiraParcela = moment(primeiraParcela.month(0));
      }
    }
  }

  PrepareTitulo(): Titulo[] {
    var titulos: Titulo[] = [];
    this.novoTitulo.vencimentos.forEach(element => {
      var titulo = new Titulo();
      titulo.formaPagamento = this.novoTitulo.formaPagamento;
      titulo.beneficiario = this.novoTitulo.fornecedor;
      titulo.categoria = this.novoTitulo.categoria;
      titulo.valor = element.valor;
      titulo.dataVencimento = element.data;
      titulos.push(titulo);
    });

    return titulos;
  }

  CadastrarTitulo(form: AbstractControl): void {
    this.submitted = true;
    if (!form.valid) {
      this._toastService.errorNotification(
        "",
        "Por favor, verifique os campos informados"
      );
      console.log("Form is invalid");
      return;
    }

    this.isImporting = true;
    if (this.novoTitulo.tipo.codigo == TipoTitulo.Pagar.codigo) {
      this.financasService
        .CriarTitulosPagar(this.PrepareTitulo())
        .subscribe(
          () => this.OnTituloCadastrado(),
          err => this.OnTituloCreateError(err)
        );
    } else {
      this.financasService
        .CriarTitulosReceber(this.PrepareTitulo())
        .subscribe(
          () => this.OnTituloCadastrado(),
          err => this.OnTituloCreateError(err)
        );
    }
  }

  OnTituloCadastrado() {
    this.isImporting = false;
    this.novoTitulo = null;
    this.modalNovoLancamento.close();
    this.onChangeFiltroPeriodo(this.selectPeriodoValue);
  }

  OnTituloCreateError(err) {
    console.error(err);
    this.isImporting = false;
    this._toastService.errorNotification(
      "Cadastro titulos",
      "Houve um erro ao fazer o cadastro"
    );
  }

  exportarCsvExtrato(): void {
    this.isImporting = true;
    this.financasService.exportCSV(this.getFilterSelected()).subscribe(
      data => {
        this.fileSaverService.save(
          (<any>data)._body,
          "financas_" + this.getFilterSelected() + ".csv"
        );
        this.isImporting = false;
      },
      err => {
        this._toastService.errorNotification(
          "Exportação",
          "Erro ao exportar arquivo"
        );
        this.isImporting = false;
      }
    );
  }

  exportarCsvReceber(): void {
    this.isImporting = true;
    this.financasService.exportCSVReceber(this.getFilterSelected()).subscribe(
      data => {
        this.fileSaverService.save(
          (<any>data)._body,
          "financas_receber_" + this.getFilterSelected() + ".csv"
        );
        this.isImporting = false;
      },
      err => {
        this._toastService.errorNotification(
          "Exportação",
          "Erro ao exportar arquivo"
        );
        this.isImporting = false;
      }
    );
  }

  exportarCsvPagar(): void {
    this.isImporting = true;
    this.financasService.exportCSVPagar(this.getFilterSelected()).subscribe(
      data => {
        this.fileSaverService.save(
          (<any>data)._body,
          "financas_pagar_" + this.getFilterSelected() + ".csv"
        );
        this.isImporting = false;
      },
      err => {
        this._toastService.errorNotification(
          "Exportação",
          "Erro ao exportar arquivo"
        );
        this.isImporting = false;
      }
    );
  }

  getFilterSelected() {
    if (this.IsHojeFilter()) {
      return "dia";
    } else if (this.IsSemanaFilter()) {
      return "semana";
    } else if (this.IsMesFilter()) {
      return "mes";
    } else if (this.IsAnoFilter()) {
      return "ano";
    }
    return "";
  }

  customCallback(event: Event) {
    return event;
  }

  selectAutoComplete(event: Event) {
    console.log(event);
  }

  onDateInicialChanged(event: IMyDateModel) {
    this.selectedDateInicio = event.formatted;
    this.CalculaVecimentos();
  }

  RemessaBancaria() {
    this.LoadRemessas();
  }

  LoadRemessas(): void {
    this.financasService.GetRemessas().subscribe(
      data => {
        this.remessas = data;
      },
      err => this.OnLoadError(err)
    );
    this.modalRemessaBancaria.title = "Remessa Bancária";
    this.modalRemessaBancaria.open();
  }

  GerarRemessa(): void {
    this.isLoading = true;
    this.financasService
      .GerarRemessa("1")
      .then(data => {
        let result = new Blob([data.fileData], {
          type: "application/text;charset=utf-8"
        });
        this.fileSaverService.save(result, data.fileName);
        this.isLoading = false;
        this._toastService.sucessNotification(
          "",
          "Remessa Bancária gerada com sucesso."
        );
        this.LoadRemessas();
      })
      .catch(error => {
        this.isLoading = false;
        this._toastService.errorNotification(
          "",
          "Verifique suas configurações bancárias. Pode estar faltando informações."
        );
      });
  }

  downloadRemessa(id: string): void {
    this.financasService
      .GetArquivoRemessa(id)
      .then(data => {
        let result = new Blob([data.fileData], {
          type: "application/text;charset=utf-8"
        });
        this.fileSaverService.save(result, data.fileName);
        this.isLoading = false;
      })
      .catch(error => {
        this._toastService.errorNotification(
          "",
          "Não foi possivel fazer o download do arquivo de remessa bancaria."
        );
      });
  }

  showTrFn(index: number, id: string) {
    if (this.showTr == index) {
      this.showTr = -1;
    } else {
      this.financasService.GetDetalheRemessa(id).subscribe(data => {
        this.titulosRemessa = data;
      });
      this.showTr = index;
    }
  }

  uploadArquivoRetornoBancario(event: any): void {
    this.fileHolder = event;
    this.ImportarRetornoBancario();
  }

  onUploadFinished(event: any): void {
    console.log("opa 2");
  }

  ImportarRetornoBancario(): void {
    if (this.fileHolder !== undefined) {
      this.isImporting = true;
      this.financasService
        .uploadRetornoBancario("1", this.fileHolder)
        .then(retorno => {
          this.isImporting = false;
          if (retorno._body == "0") {
            this._toastService.warningNotification(
              "",
              "Nenhum título encontrado no arquivo a ser pago."
            );
          } else {
            this._toastService.sucessNotification(
              "",
              "Retorno Bancário processado com sucesso. Total de " +
                retorno._body +
                " títulos pagos."
            );
          }
          this.modalRetornoBancario.close();
        })
        .catch(error => {
          this.isImporting = false;
          this._toastService.errorNotification(
            "",
            "Não foi possivel fazer o processamento do retorno bancário."
          );
          this.modalRetornoBancario.close();
        });
    }
  }

  TituloPermiteCancelar(titulo: Titulo): boolean {
    return !(
      titulo.categoria.codigo == Categoria.Balcao.codigo ||
      titulo.categoria.codigo == Categoria.Pedido.codigo ||
      titulo.categoria.codigo == Categoria.Puxada.codigo ||
      titulo.status.codigo == Status.Cancelado.codigo ||
      titulo.status.codigo == Status.Recebido.codigo
    );
  }

  ConfirmaCancelarTitulo() {
    var titulos = this.GetTitulosMarcados();
    if (titulos && titulos.find(t => !this.TituloPermiteCancelar(t))) {
      this._toastService.warningNotification(
        "Cancelamento de títulos",
        "Você só pode cancelar títulos criados manualmente"
      );
    } else {
      this.modalConfirmaCancelamento.open();
    }
  }

  GetTitulosMarcados(): Titulo[] {
    if (this.titulosExtrato) {
      return this.checkedTitulos;
    }
    return [];
  }

  CloseModalConfirmacao() {
    this.modalConfirmaCancelamento.close();
  }

  CancelarTitulo() {
    this.isImporting = true;
    this.CloseModalConfirmacao();
    this.financasService
      .EfetuarCancelarmento(this.GetTitulosMarcados())
      .subscribe(
        data => {
          this.onChangeFiltroPeriodo(this.selectPeriodoValue);
          this.isImporting = false;
        },
        err => this.OnLoadError(err)
      );
  }

  OnTabSelected(tab: any) {
    this.onChangeFiltroPeriodo(this.selectPeriodoValue);
  }

  inputSearchOnFilter(searchText: string): void {
    this.searchUpdated.next(searchText);
  }

  filter(searchText) {
    searchText = searchText ? searchText.toLowerCase() : "";
    this.filterValue = searchText;

    this.titulosExtrato = this.sourceTitulosExtrato.filter((c: Titulo) => {
      return this.filtroTitulo(searchText, c);
    });

    this.titulosPagar = this.sourceTitulosPagar.filter((c: Titulo) => {
      return this.filtroTitulo(searchText, c);
    });

    this.titulosReceber = this.sourceTitulosReceber.filter((c: Titulo) => {
      return this.filtroTitulo(searchText, c);
    });
  }

  private configurarFiltro() {
    this.searchChangeEmitter = <any>this.searchUpdated
      .asObservable()
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(item => this.filter(item));
  }

  private filtroTitulo(filter: string, titulo: Titulo): boolean {
    if (
      titulo.beneficiario != null &&
      titulo.beneficiario.razaoSocial != null
    ) {
      var razaoSocial = titulo.beneficiario.razaoSocial.toLowerCase();
      var match = filter != "" && razaoSocial.indexOf(filter) > -1;

      return filter == "" || match;
    }

    return false;
  }
}
