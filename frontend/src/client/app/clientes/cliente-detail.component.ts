import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormsModule, NgModel, NG_VALIDATORS, Validator, Validators, AbstractControl, Form, ValidatorFn } from '@angular/forms';
import { Modal } from 'ngx-modal';
import { NguiMapModule } from '@ngui/map';
import { Marker, NguiMapComponent, OptionBuilder } from '@ngui/map';
import { GenericResponse } from '../_model/index';
import { AlertService } from '../_services/alert.service';
import { ClienteService } from '../_services/cliente.service';
import { UsuariosService } from '../usuarios/shared/usuarios.service';
import { Cliente, StatusCliente, TipoPessoa, TipoImagem, TipoTributacao } from './model/cliente';
import { Empresa } from '../_model/empresa';
import { SegmentoPreco } from '../_model/segmento-preco';

import { Cep } from '../_model/cep/cep';
import { Pais } from '../_model/cep/pais';
import { Estado } from '../_model/cep/estado';
import { Municipio } from '../_model/cep/municipio';

import { Usuario } from '../_model/usuario';
import { Frequencia, Sazonalidade } from '../frequencia-visita/model/frequencia';
import { Telefone, TipoTelefone } from '../_model/telefone';
import { FormaPagamentoCliente } from '../_model/formaPagametoCliente';
import { FormaPagamentoVendaExterna } from '../configuracoes/model/configuracoes';
import { ToastService } from '../_services/toast.service';
import { CepService } from '../_services/cep.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    moduleId: module.id,
    selector: 'cliente-detail',
    templateUrl: 'cliente-detail.component.html',
    styleUrls: []
})
export class ClienteDetailComponent implements OnInit {

    isLoading: boolean = false;

    fileHolder: any;
    serverError: any;
    submitted = false;

    cliente: Cliente;

    vendedores: Usuario[];
    segmentos: SegmentoPreco[];
    statusCliente: StatusCliente[];
    tiposTelefone: TipoTelefone[];
    tiposPessoa: TipoPessoa[];
    tiposTributacao: TipoTributacao[];
    formasPagamento: FormaPagamentoVendaExterna[] = [];

    ceps: Cep[] = [];
    estados: Estado[] = [];
    municipios: Municipio[] = [];

    enderecoAlterado: boolean = false;
    position: number[];
    placeHolderRazaoSocial: string = 'Razão Social';

    @ViewChild('modalMapa') modalMapa: Modal;
    @ViewChild('mapa') mapa: NguiMapComponent;
    marker: Marker;
    mapIsReady: boolean = false;
    desabilitaBotao = false;

    constructor(
        private route: Router,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private alertService: AlertService,
        private clienteService: ClienteService,
        private usuarioService: UsuariosService,
        private toasterService: ToastService,
        private cepService: CepService
    ) { }

    ngOnInit(): void {
        this.activatedRoute.paramMap
            .switchMap((params: ParamMap) => {
                let id = params.get('id');
                if (id) {
                    let sucess = params.get('sucess');
                    if (sucess === 'ok') {
                        this.toasterService.sucessNotification('', 'Cliente cadastrado com sucesso');
                    }
                    return this.clienteService.getCliente(id);
                } else {
                    return Observable.of(new Cliente());
                }
            })
            .flatMap(cliente => {
                this.cliente = cliente;
                if (!this.cliente.Contato.Fone) {
                    this.cliente.Contato.Fone = new Telefone(TipoTelefone.FIXO.Codigo, '');
                }
                return this.clienteService.getEmpresaInfo();
            })
            .flatMap(empresa => {
                this.formasPagamento = empresa.FormasPagamentoVendaExterna;
                if (!this.cliente.Id) {
                    empresa.FormasPagamentoVendaExterna.forEach(fp => {
                        if (fp.DisponivelParaClientesNovos) {
                            this.cliente.FormasPagamento.push(new FormaPagamentoCliente(fp.Codigo, fp.Descricao, fp.PrazoMaximo));
                        }
                    });

                    this.cliente.LimiteCredito = empresa.LimiteCreditoPadrao;

                    if (empresa.Endereco) {
                        this.AtualizarEndereco(empresa.Endereco.Pais, empresa.Endereco.Estado, empresa.Endereco.Municipio);
                    }
                }

              this.clienteService.getEstadosAny()
                .subscribe(d => {
                  this.estados = d.json() as Estado[];
                  this.clienteService.getMunicipiosAny(this.cliente.Endereco.Estado)
                  .subscribe(municipios => {
                      this.municipios = municipios.json() as Municipio[];
                  });
                });

                return this.clienteService.getSegmentosPreco();
            })
            .flatMap(segmentos => {
                this.segmentos = segmentos;
                if (!this.cliente.Id) {
                    this.cliente.Segmento = this.segmentos[1].Codigo;
                }
                return this.usuarioService.getUsersVendedores();
            })
            .flatMap(usuarios => {
                this.agrupaVendedores(usuarios);
                return this.clienteService.getStatusCliente();
            })
            .flatMap(statusCliente => {
                this.statusCliente = statusCliente;
                return this.clienteService.getTiposTelefone();
            })
            .flatMap(tiposTelefone => {
                this.tiposTelefone = tiposTelefone;
                if (!this.cliente.Id) {
                    this.cliente.Contato.Fone.TipoTelefone = TipoTelefone.FIXO.Codigo;
                }
                let tipos = this.tiposTelefone.filter(t => {
                    if (!this.cliente.Telefones) {
                        this.cliente.Telefones = [];
                    }
                    return !this.cliente.Telefones.find(f => f.TipoTelefone === t.Codigo);
                });
                tipos.forEach(t => this.cliente.Telefones.push(new Telefone(t.Codigo, '')));
                return this.clienteService.getTiposPessoa();
            })
            .flatMap(tiposPessoa => {
                this.tiposPessoa = tiposPessoa;
                if (!this.cliente.Id) {
                    this.cliente.TipoPessoa = TipoPessoa.JURIDICA.Codigo;
                }
                return this.clienteService.getTiposTributacao();
            })
            .flatMap(tiposTributacao => {
                this.tiposTributacao = tiposTributacao;
                if (!this.cliente.Id || this.cliente.TipoTributacao === 0) {
                    this.cliente.TipoTributacao = TipoTributacao.VAREJISTA.Codigo;
                }
                return Observable.of(true);
            })
            .subscribe(
            (data) => console.log(data),
            (err) => console.log(err),
            () => console.log('completed')
            );
    }

    salvarCliente(form: AbstractControl): void {
        this.submitted = true;
        if (!form.valid) {
            this.toasterService.errorNotification('', 'Por favor, verifique os campos informados');
            console.log('Form is invalid');
            this.desabilitaBotao = false;
            return;
        }

        this.serverError = null;
        if (this.cliente.Id) {
            this.clienteService.updateCliente(this.cliente)
                .then(cliente => {
                    if (this.fileHolder) {
                        this.clienteService.uploadImagem(this.fileHolder, cliente.Id, TipoImagem.FACHADA.Codigo)
                            .then(() => this.goBack());
                    } else {
                        this.toasterService.sucessNotification('', 'Cliente alterado com sucesso.');
                        this.goBack();
                    }
                })
                .catch(error => this.handleServerError(error));
        } else {
            this.clienteService.addCliente(this.cliente)
                .then(cliente => {
                    if (this.fileHolder) {
                        this.clienteService.uploadImagem(this.fileHolder, cliente.Id, TipoImagem.FACHADA.Codigo)
                            .then(() => this.route.navigateByUrl('/updateCliente/' + cliente.Id + '/ok'));
                    } else {
                        this.toasterService.sucessNotification('', 'Cliente salvo com sucesso.');
                        this.route.navigateByUrl('/updateCliente/' + cliente.Id + '/ok');
                    }
                })
                .catch(error => this.handleServerError(error));
        }
        this.desabilitaBotao = true;
    }

    goBack(): void {
        this.route.navigate(['clientes']);
    }

    onChangeEstado(codigoEstado: number): void {
        if (codigoEstado && this.estados.length > 0) {
             this.clienteService.getMunicipios(codigoEstado).subscribe(data => this.municipios = data);
        } else {
            this.municipios = [];
        }
    }

    agrupaVendedores(users: Usuario[]): void {
        var groups = users.reduce((obj, item) => {
            obj[item.perfil] = obj[item.perfil] || [];
            obj[item.perfil].push(item);
            return obj;
        }, {});

        this.vendedores = [];
        Object.keys(groups).map((key) => {
            this.vendedores.push(groups[key]);
            this.getFrequencia(groups[key][0]);
        });
    }

    getFrequencia(vendedor: Usuario): void {
        if (!this.cliente.FrequenciasVisita) {
            this.cliente.FrequenciasVisita = [];
        }

        var result = this.cliente.FrequenciasVisita.find(p => p.Perfil === vendedor.perfil);
        if (!result) {
            var frequencia = new Frequencia();
            frequencia.DiasAtendimento = [];
            frequencia.Perfil = vendedor.perfil;
            frequencia.Vendedor = vendedor.id;
            frequencia.Sazonalidade = Sazonalidade.Semanal.codigo;
            this.cliente.FrequenciasVisita.push(frequencia);
        }
    }

    getImagemFachada(): string {
        return this.clienteService.getImagemClienteUrl(this.cliente.Id, TipoImagem.FACHADA.Codigo);
    }

    verifyEndereco(): boolean {
        return this.cliente.Endereco.Estado && this.cliente.Endereco.Municipio
            && this.cliente.Endereco.Logradouro.Rua && this.cliente.Endereco.Logradouro.Numero
            && this.cliente.Endereco.Logradouro.Bairro && this.cliente.Endereco.Logradouro.CEP && true;
    }

    getGeoLocation(): Promise<any> {
        let uf = this.estados.find(e => e.Codigo === this.cliente.Endereco.Estado).UF;
        let municipio = this.municipios.find(m => m.Codigo === this.cliente.Endereco.Municipio).Nome;
        let params = [this.cliente.Endereco.Logradouro.Rua, this.cliente.Endereco.Logradouro.Numero.toString(),
        this.cliente.Endereco.Logradouro.Bairro, this.cliente.Endereco.Logradouro.CEP, municipio, uf];
        return this.clienteService.getGeoLocation(params);
    }

    refreshGeoLocation(): void {
        if (this.enderecoAlterado || (!this.cliente.Latitude || !this.cliente.Longitude)) {
            this.getGeoLocation()
                .then(data => {
                    this.cliente.Latitude = data.lat;
                    this.cliente.Longitude = data.lng;
                    this.position = [this.cliente.Latitude, this.cliente.Longitude];
                    this.refreshMap(this.cliente.Latitude, this.cliente.Longitude);
                });

            this.enderecoAlterado = false;
        } else {
            this.position = [this.cliente.Latitude, this.cliente.Longitude];
            this.refreshMap(this.cliente.Latitude, this.cliente.Longitude);
        }
    }

    refreshMap(lat: number, lng: number): void {
        if (!this.mapIsReady) {
            return;
        }

        if (this.marker) {
            this.marker.ngOnDestroy();
        }
        this.marker = new Marker(this.mapa);
        this.marker.draggable = true;
        this.marker.drag.subscribe((event) => this.markerOnDrag(event));
        this.marker.position = [lat, lng];
        this.marker.initialize();

        this.mapa.center = lat + ', ' + lng;
        this.mapa.setCenter();
    }

    modalMapaOnOpen() {
        if (this.mapIsReady) {
            this.refreshGeoLocation();
        }
    }

    modalMapaConfirm() {
        this.cliente.Latitude = this.position[0];
        this.cliente.Longitude = this.position[1];
        var modal = this.modalMapa.close();
    }

    mapOnReady(event) {
        this.mapIsReady = true;
        this.refreshGeoLocation();
    }

    markerOnDrag(event) {
        this.position = [event.latLng.lat(), event.latLng.lng()];
    }

    imageUploaded(event: any): void {
        this.fileHolder = event;
    }

    tipoPessoaOnChange(): void {
        if (Number(this.cliente.TipoPessoa) === TipoPessoa.JURIDICA.Codigo) {
            this.placeHolderRazaoSocial = 'Razão Social';
        }
        if (Number(this.cliente.TipoPessoa) === TipoPessoa.FISICA.Codigo) {
            this.placeHolderRazaoSocial = 'Nome Completo';
        }
        this.cliente.InscricaoEstadual = '';
        this.cliente.InscricaoMunicipal = '';
    }

    onChangeFormaPagamento(event: any, item: FormaPagamentoVendaExterna): void {
        var index = this.cliente.FormasPagamento.findIndex(p => p.Codigo === item.Codigo);
        if (index >= 0) {
            this.cliente.FormasPagamento.splice(index, 1);
        }
        if (event) {
            var formaPagamentoEmpresa = this.formasPagamento.find(p => p.Codigo === item.Codigo);
            this.cliente.FormasPagamento.push(
                {
                    'Codigo': item.Codigo,
                    'Descricao': item.Descricao,
                    'PrazoMaximo': formaPagamentoEmpresa.PrazoMaximo
                });
        }
    }

    isFormaPagamentoChecked(item: FormaPagamentoVendaExterna): boolean {
        var tempItem = this.cliente.FormasPagamento.find(p => p.Codigo === item.Codigo);
        var checked = false;
        if (tempItem !== undefined && tempItem !== null) {
            checked = true;
        }
        return checked;
    }

    setPrazoMaximo(event: any, item: FormaPagamentoVendaExterna): void {
        var prazoMaximo = event.currentTarget.valueAsNumber;
        var tempItem = this.cliente.FormasPagamento.find(p => p.Codigo === item.Codigo);
        if (tempItem !== undefined && tempItem !== null) {
            tempItem.PrazoMaximo = prazoMaximo;
            var formaPagamentoEmpresa = this.formasPagamento.find(p => p.Codigo === item.Codigo);
            if (tempItem.PrazoMaximo > formaPagamentoEmpresa.PrazoMaximo) {
                tempItem.PrazoMaximo = formaPagamentoEmpresa.PrazoMaximo;
            }
        }
    }

    getPrazoMaximo(item: FormaPagamentoVendaExterna): number {
        var tempItem = this.cliente.FormasPagamento.find(p => p.Codigo === item.Codigo);
        var prazoMaximo = 0;
        if (tempItem !== undefined && tempItem !== null) {
            prazoMaximo = tempItem.PrazoMaximo;
        }
        return prazoMaximo;
    }

    enderecoOnChange(valor): void {
        this.enderecoAlterado = true;
    }

    cepOnChange(cep) {
        cep = cep.replace('-', '');
        if (cep.length == 8) {
            this.enderecoAlterado = true;
            this.loadCep(cep);
        }
    }

    estadoOnChange() {
        this.enderecoAlterado = true;
        this.loadMunicipios();
    }

    validateOnlyNumbers(evt) {
      var theEvent = evt || window.event;
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
      var regex = /[0-9]|\./;
      if (!regex.test(key)) {
          theEvent.returnValue = false;
          if (theEvent.preventDefault) theEvent.preventDefault();
      }
    }

    private handleServerError(error: GenericResponse): void {
        if (error.message) {
            this.toasterService.errorNotification('', error.message);
        } else {
            this.toasterService.errorNotification('', 'Falha ocorrida');
        }
    }

    private AtualizarEndereco(codigoPais: number, codigoEstado: number, codigoMunicipio: number): void {
        this.cliente.Endereco.Pais = codigoPais;
        this.cliente.Endereco.Estado = codigoEstado;
        this.cliente.Endereco.Municipio = codigoMunicipio;
    }

    private loadCep(cep: string): void {
        this.isLoading = true;
        this.cepService.getCep(cep).subscribe(cep => {
            if (cep != null) {
                this.AtualizarEndereco(cep.Pais.Codigo, cep.Estado.Codigo, cep.Municipio.Codigo);
                this.cliente.Endereco.Logradouro.Bairro = cep.Bairro;
                this.cliente.Endereco.Logradouro.Rua = cep.Rua;
            }
            this.isLoading = false;
        });
    }

    private loadMunicipios(): void {
        this.isLoading = true;
        this.cepService.getBaseMunicipios(this.cliente.Endereco.Estado).subscribe(municipios => {
            this.municipios = municipios;
            this.isLoading = false;
        });
    }
}
