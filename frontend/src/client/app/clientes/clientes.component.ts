import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClienteService } from '../_services/cliente.service';
import { Cliente, StatusCliente, TipoImagem, TipoPessoa } from './model/cliente';
import { Estado, Municipio } from '../_model/endereco';
import { Modal } from 'ngx-modal';
import { FileSaverService } from 'ngx-filesaver';
import { ToastService } from '../_services/toast.service';
import { BaseTableComponent } from '../shared/table/base-table-component';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { ModalConfirmacaoComponent } from '../_directives/modal-confirmacao/modal-confirmacao.component';

@Component({
  moduleId: module.id,
  selector: 'clientes',
  templateUrl: 'clientes.component.html',
  styleUrls: ['clientes.component.css']
})
export class ClientesComponent extends BaseTableComponent implements OnInit {

  @ViewChild('modalConfirmar')
  modalConfirmacao: ModalConfirmacaoComponent;

  @Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  searchUpdated: Subject<string> = new Subject<string>();

  isLoadingClientes: boolean = false;
  sourceClientes: Cliente[] = [];
  listClientes: Cliente[] = [];
  listStatus: StatusCliente[] = [];
  listEstados: Estado[] = [];
  listMunicipios: Municipio[] = [];
  listTiposPessoa: TipoPessoa[] = [];
  selectedCliente: Cliente;

  inputSearch: any;
  currentStatusFilter: number;

  viewMode: boolean = false;
  isParaActive: boolean = false;
  isBtnActive: boolean = false;

  fileHolder: any;
  isImporting: boolean = false;
  isExporting: boolean = false;
  @ViewChild('modalImportar') modalImportar: Modal;

  constructor(
    private clienteService: ClienteService,
    private _FileSaverService: FileSaverService,
    private toastService: ToastService
  ) {
    super();
    this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(item => this.filter(item));
  }

  ngOnInit() {
    this.loadClientes();
    this.loadListStatusCliente();
    this.loadMunicipios();
  }

  loadClientes(): void {
    this.isLoadingClientes = true;
    this.clienteService.getAllClientes()
      .switchMap(data => {
        this.setDataSource(data);
        this.isLoadingClientes = false;
        return this.clienteService.getTiposPessoa();
      })
      .flatMap(data => {
        this.listTiposPessoa = data;
        return this.clienteService.getEstados()
      })
      .flatMap(data => {
        this.listEstados = data;
        return Observable.of(true);
      })
      .subscribe(
      (data) => console.log(data),
      (err) => console.log(err),
      () => console.log('completed')
      );
  }

  loadListStatusCliente(): void {
    this.clienteService.getStatusCliente()
      .toPromise()
      .then(data => {
        this.listStatus = data;
      });
  }

  setDataSource(clientes: Cliente[]): void {
    this.sourceClientes = clientes;
    this.listClientes = clientes;
  }

  statusFilterOnChange(status: number): void {
    this.currentStatusFilter = status;
    this.filter(this.inputSearch);
  }

  inputSearchOnFilter(searchText: string): void {
    this.searchUpdated.next(searchText);
  }

  filter(searchText) {
    if (searchText) {
      searchText = searchText.toLowerCase();
    } else {
      searchText = '';
    }
    if (!this.currentStatusFilter) {
      this.currentStatusFilter = 0;
    }
    this.listClientes = this.sourceClientes.filter((c: Cliente) => {
      let found = false;

      let razaoSocial = c.RazaoSocial;
      if (!razaoSocial) {
        razaoSocial = '';
      }
      let nomeFantasia = c.NomeFantasia;
      if (!nomeFantasia) {
        nomeFantasia = '';
      }
      let cnpjCpf = c.CnpjCpf;
      if (!cnpjCpf) {
        cnpjCpf = '';
      }
      if (searchText != '' && (razaoSocial.toLowerCase().indexOf(searchText) > -1
        || nomeFantasia.toLowerCase().indexOf(searchText) > -1
        || cnpjCpf.indexOf(searchText) > -1)) {
        found = true;
      }

      return (found || searchText == '') && (this.currentStatusFilter == 0 || c.Status == this.currentStatusFilter)
    });
    this.selectedCliente = null;
  }

  getStatusDescription(codigo: number): string {
    let status = this.listStatus.find(s => s.Codigo == codigo);
    if (status) {
      return status.Valor;
    } else {
      return '';
    }
  }

  getTipoPessoaDescription(codigo: number): string {
    let tipo = this.listTiposPessoa.find(t => t.Codigo == codigo);
    if (tipo) {
      return tipo.Valor;
    } else {
      return '';
    }
  }

  getEstadoUF(codigo: number): string {
    let estado = this.listEstados.find(e => e.Codigo == codigo);
    if (estado) {
      return estado.UF;
    } else {
      return '';
    }
  }

  loadMunicipioNome(cliente: Cliente): string {
    let municipio = this.listMunicipios.find(m => m.Codigo == cliente.Endereco.Municipio);
    return municipio == null ? '' : municipio.Nome.toLocaleUpperCase();
  }

  abrirConfirmacaoExclusao(cliente: Cliente) {
    this.modalConfirmacao.openModal('Deseja realmente excluir o cliente "' + cliente.NomeFantasia + '"?', cliente);
  }

  excluirCliente(cliente: Cliente): void {
    this.clienteService.deleteCliente(cliente.Id)
      .then(() => {
        this.toastService.sucessNotification('', 'Cliente excluido com sucesso');
        this.listClientes.forEach((c: Cliente, i: number) => {
          if (c.Id === cliente.Id) {
            this.listClientes.splice(i, 1);
          }
        });
      });
  }

  onSelect(cliente: Cliente): void {
    this.selectedCliente = cliente;
  }

  getImagemFachada(id: string): string {
    return this.clienteService.getImagemClienteUrl(id, TipoImagem.FACHADA.Codigo);
  }

  toggleClass() {
    this.isParaActive = !this.isParaActive;
    this.isBtnActive = !this.isBtnActive;
  }

  getAllExportClientes(): void {
    this.isExporting = true;
    this.clienteService.exportClientes()
      .subscribe(data => {
        this._FileSaverService.save((<any>data)._body, 'clientes_base.csv');
        this.isExporting = false;
      });
  }

  uploadCSV(event: any): void {
    this.fileHolder = event;
  }

  onUploadFinished(event: any): void {
    console.log('opa 2');
  }

  importCSV(): void {
    if (this.fileHolder !== undefined) {
      this.isImporting = true;
      this.clienteService.uploadCSV(this.fileHolder)
        .then(() => {
          this.isImporting = false;
          this.loadClientes();
          this.modalImportar.close();
        }).catch(error => {
          this.isImporting = false;
          this.modalImportar.close();
        });
    }
  }

  private loadMunicipios() {
    this.clienteService.getMunicipiosFranquia()
      .subscribe(municipios => this.listMunicipios = municipios);
  }

  private downloadFile(data: Response): void {
    let blob = new Blob([data.blob()], { type: 'text/CSV' });
    let url = window.URL.createObjectURL(blob);
    window.open(url);
  }
}
