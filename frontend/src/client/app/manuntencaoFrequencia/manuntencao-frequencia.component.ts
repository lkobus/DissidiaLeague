import { Component, OnInit, EventEmitter, Output, ViewChild, ViewChildren, ElementRef, AfterContentInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { NguiMapModule } from '@ngui/map';
import { Marker, NguiMapComponent, OptionBuilder } from '@ngui/map';
import { DragulaModule } from 'ng2-dragula';
import { ContagemFrequenciaVendedorDTO } from './dto/contagem-frequencia-vendedor-dto';
import { ManuntencaoFrequenciaService } from './shared/manuntencao-frequencia.service';
import { Cliente, TipoImagem } from '../clientes/model/cliente';
import { DragulaService } from 'ng2-dragula';
import { UpdateFrequenciaDto } from './dto/update-frequencia-dto';
import { MarkerHelper } from './dto/marker-helper';
import { Modal } from 'ngx-modal';
import { ToastService } from '../_services/toast.service';
import { ClienteService } from '../_services/cliente.service';
import { Estado, Municipio } from '../_model/endereco';
import { FileSaverService } from 'ngx-filesaver';
import { AuthenticationService } from '../_services/authentication.service';
import { Empresa } from '../_model/index';


@Component({
    moduleId: module.id,
    selector: 'manuntencao-frequencia',
    templateUrl: 'manuntencao-frequencia.component.html',
    styleUrls: ['manuntencao-frequencia.component.css']
})

export class ManuntencaoFrequenciaComponent implements OnInit {
    @ViewChild('clienteModal') modalAtual: Modal;
    @ViewChild('mapa') mapa: NguiMapComponent;
    @ViewChildren('inputSearchCliente') vcInputCliente;
    contagensFrequenciaVendedores: ContagemFrequenciaVendedorDTO[] = [];
    contagensFrequenciaVendedores2: ContagemFrequenciaVendedorDTO[] = [];
    clienteDetail: Cliente;

    templateLoading: string =
        '<div class="loading-overlay">' +
        '<img src="assets/logo-promax-blue.png" alt="logo Promax" width="123" height="15" class="img-loader" />' +
        '<div class="spinner">' +
        '<div class="bounce1"></div>' +
        '<div class="bounce2"></div>' +
        '<div class="bounce3"></div>' +
        '</div>' +
        '<h1 class="loading-venda">' +
        '{{message}}' +
        '</h1>' +
        '</div>';
    busy: any;

    empresa: Empresa;
    clientes: Cliente[];
    clientes2: Cliente[];
    icon: string;
    delecoes: UpdateFrequenciaDto[];
    adicoes: UpdateFrequenciaDto[];

    markerCliente: Cliente;
    clientesSemFrequencia: Cliente[];
    clienteParaAdicionar: Cliente;
    clientes1Size: number;
    clientes2Size: number;
    selectedGrid: ContagemFrequenciaVendedorDTO;
    selectedUser2: string;
    selectedDay1: number;
    selectedDay2: number;

    estados: Estado[];
    municipios: Municipio[];

    readonly: boolean;

    lista: number;
    positions1: MarkerHelper[];
    positions2: MarkerHelper[];
    positions: MarkerHelper[];

    fileHolder: any;
    isImporting: boolean;
    isExporting: boolean;
    @ViewChild('modalImportar') modalImportar: Modal;

    @ViewChild('mapa') modalSobra: NguiMapComponent;

    map: NguiMapComponent;
    currentCol: number;

    constructor(private manuntencaoService: ManuntencaoFrequenciaService,
        private dragulaService: DragulaService,
        private clienteService: ClienteService,
        private _FileSaverService: FileSaverService,
        private toastService: ToastService,
        private authenticationService: AuthenticationService) {
        this.clientes = [];
        this.readonly = false;
        this.icon = "assets/redMarker.png";
        this.delecoes = [];
        this.adicoes = [];
        this.positions = [];
        this.positions1 = [];
        this.positions2 = [];
        this.estados = [];
        this.municipios = [];
        dragulaService.setOptions('first-bag', {});
        dragulaService.drag.subscribe((value) => {
            this.onDrag(value.slice(1));
        });
        dragulaService.dropModel.subscribe((value) => {
            console.log(value);
            this.onDropModel(value);
        });

        dragulaService.drop.subscribe((value) => {
            this.onDrop(value);
        });
        dragulaService.over.subscribe((value) => {
            this.onOver(value.slice(1));
        });
        dragulaService.out.subscribe((value) => {
            this.onOut(value.slice(1));
        });

        this.empresa = this.authenticationService.getEmpresa();
    }


    ontMarkerMapaClick({ target: marker }, c: MarkerHelper) {
        this.clienteService.getCliente(c.clienteId)
            .then(response => {
                this.markerCliente = response;
                marker.nguiMapComponent.openInfoWindow("clienteInfoDetail", marker);
            });

    }

    openModal(lista: number) {
        this.lista = lista;
        this.manuntencaoService.getClientesSemVisita()
            .then(clientes => this.clientesSemFrequencia = clientes)
            .then(c => {
                var p = [];
                p.push(this.clientes);
                p.push(this.clientes2);
                p.forEach(clientes => {
                    clientes.forEach(c => {
                        var index = this.clientesSemFrequencia.findIndex(d => d.Id == c.Id);
                        if (index != -1) {
                            this.clientesSemFrequencia.splice(index, 1);
                        }
                    });
                });
            });
        this.modalAtual.open();
    }

    excluir(clienteId: string, dia: number, idVendedor: string) {
        var delecao = new UpdateFrequenciaDto();
        delecao.idVendedor = idVendedor;
        delecao.cliente = clienteId;
        delecao.tipoAlteracao = 1;
        delecao.ordem = 999;
        delecao.codigoPerfil = this.getPerfilFromVendedor(delecao.idVendedor);
        delecao.dia = dia;
        this.delecoes.push(delecao);

        var index = this.clientes.findIndex(c => c.Id == clienteId);
        if (index != -1) {
            this.clientes.splice(index, 1);
        }
        index = this.clientes2.findIndex(c => c.Id == clienteId);
        if (index != -1) {
            this.clientes2.splice(index, 1);
        }
    }

    adicionarNovoCliente() {
      if (!this.clienteParaAdicionar) {
        return;
      }

        var adicionar = new UpdateFrequenciaDto();
        var cliente = this.clientesSemFrequencia.filter(p => p.Id == this.clienteParaAdicionar.Id)[0];
        if (this.lista == 1) {
            adicionar.idVendedor = this.selectedGrid.idVendedor;
            var r = this.contagensFrequenciaVendedores.filter(p => p.idVendedor == adicionar.idVendedor)[0];
            adicionar.codigoPerfil = r.perfil;
            adicionar.cliente = cliente.Id;
            adicionar.ordem = 999;
            adicionar.tipoAlteracao = 2;
            adicionar.dia = this.selectedDay1;
            this.clientes.push(cliente);
        }
        else if (this.lista == 2) {
            adicionar.idVendedor = this.selectedUser2;
            var r = this.contagensFrequenciaVendedores2.filter(p => p.idVendedor == adicionar.idVendedor)[0];
            adicionar.codigoPerfil = r.perfil;
            adicionar.cliente = cliente.Id;
            adicionar.ordem = 999;
            adicionar.tipoAlteracao = 2;
            adicionar.dia = this.selectedDay2;
            this.clientes2.push(cliente);

        }
        this.adicoes.push(adicionar);


        var index = this.clientesSemFrequencia.findIndex(p => p.Id == adicionar.cliente);
        this.clientesSemFrequencia.splice(index, 1);
        this.clienteParaAdicionar = null;
        this.vcInputCliente.first.nativeElement.focus();
    }

    private onDropModel(args) {
        if (this.verificaSeMudouDeBag()) {
            if (this.clienteVoltouParaBag(args)) {
                var indexToRemove = this.delecoes.findIndex(p => p.cliente == args[1].id);
                if (indexToRemove != -1) {
                    this.delecoes.splice(indexToRemove, 1);
                }
            } else {
                var delecao = new UpdateFrequenciaDto();
                var adicao = new UpdateFrequenciaDto();
                var c = this.clientes.filter(p => p.Id == args[1].id);
                if (c.length == 0) {
                    c = this.clientes2.filter(p => p.Id == args[1].id);
                }
                delecao.dia = this.selectedDay1;
                delecao.idVendedor = this.selectedGrid.idVendedor;
                adicao.dia = this.selectedDay2;
                adicao.idVendedor = this.selectedUser2;
                if (args[2].id == 'bag1') {
                    delecao.dia = this.selectedDay2;
                    delecao.idVendedor = this.selectedUser2;
                    adicao.dia = this.selectedDay1;
                    adicao.idVendedor = this.selectedGrid.idVendedor;
                }
                var cliente = c[0];
                delecao.cliente = c[0].Id;
                delecao.tipoAlteracao = 1;
                adicao.cliente = c[0].Id;
                adicao.ordem = 999;
                delecao.ordem = 999;
                adicao.codigoPerfil = this.getPerfilFromVendedor(adicao.idVendedor);
                delecao.codigoPerfil = this.getPerfilFromVendedor(delecao.idVendedor);
                adicao.tipoAlteracao = 2;
                this.delecoes.push(delecao);
                this.adicoes.push(adicao);
                var adicao = new UpdateFrequenciaDto();
            }
        }
    }



    atualizaFrequencia() {
        this.readonly = true;
        var toSend = this.delecoes;
        toSend = toSend.concat(this.adicoes);
        var i = 0;
        this.clientes.forEach(c => {
            var alteracao = new UpdateFrequenciaDto();
            alteracao.cliente = c.Id;
            alteracao.tipoAlteracao = 3;
            alteracao.idVendedor = this.selectedGrid.idVendedor;
            alteracao.codigoPerfil = this.getPerfilFromVendedor(alteracao.idVendedor);
            alteracao.dia = this.selectedDay1;

            alteracao.ordem = i++;
            toSend.push(alteracao);
        });

        i = 0;
        this.clientes2.forEach(c => {
            var alteracao = new UpdateFrequenciaDto();
            alteracao.cliente = c.Id;
            alteracao.tipoAlteracao = 3;
            alteracao.idVendedor = this.selectedUser2;
            alteracao.codigoPerfil = this.getPerfilFromVendedor(alteracao.idVendedor);
            alteracao.dia = this.selectedDay2;
            alteracao.ordem = i++;
            toSend.push(alteracao);
        });
        this.busy = this.manuntencaoService.updateFrequenciaVendedor(toSend)
            .then(c => this.onDayClick(this.selectedGrid.idVendedor, this.selectedDay1))
            .then(c => this.manuntencaoService.getContagemFrequenciasVendedores()
                .then(contages => {
                    console.log(contages);
                    this.contagensFrequenciaVendedores = contages;
                    this.contagensFrequenciaVendedores2 = contages;
                })).then(c => {
                    if (this.adicoes.length > 0 || this.delecoes.length > 0) {
                        this.toastService.sucessNotification("Sucesso", "Frequencia alterada");
                    }
                    this.adicoes = [];
                    this.delecoes = [];
                })




    }

    getPerfilFromVendedor(vendedorId: string) {
        var perfil = 0;
        this.contagensFrequenciaVendedores.filter(p => p.idVendedor == vendedorId)
            .forEach(p => perfil = p.perfil);
        this.contagensFrequenciaVendedores2.filter(p => p.idVendedor == vendedorId)
            .forEach(p => perfil = p.perfil);
        return perfil;
    }

    clienteVoltouParaBag(args: any) {
        var result = false;
        var clienteId = args[1].id;
        var r = this.delecoes.filter(p => p.cliente == clienteId);
        return r.length == 1;
    }


    verificaSeMudouDeBag() {
        return !(this.clientes1Size == this.clientes.length &&
            this.clientes2.length == this.clientes2Size);
    }

    opt: OptionBuilder;
    ngOnInit(): void {
        this.positions = [];
        this.manuntencaoService.getContagemFrequenciasVendedores()
            .then(contages => {
                console.log(contages);
                this.contagensFrequenciaVendedores = contages;
                this.contagensFrequenciaVendedores2 = contages;
            });
    }

    ngOnDestroy(): void {
        this.dragulaService.destroy("first-bag");
    }


    autoClicou(vendedorId: string, index: number) {
        return this.selectedDay2 == index && vendedorId == this.selectedUser2;
    }
    onDayClick(vendedorId: string, index: number) {
        if (this.autoClicou(vendedorId, index)) {
            this.selectedDay2 = this.selectedDay1;
            this.selectedUser2 = this.selectedGrid.idVendedor;
            this.manuntencaoService.getListagemClientes(this.selectedUser2, this.selectedDay2)
                .then(clientes => this.clientes2 = clientes);
        }
        this.selectedDay1 = index;
        this.contagensFrequenciaVendedores.forEach(p => {
            if (p.idVendedor == vendedorId) {
                this.selectedGrid = p;
            }
        });

        this.busy = this.manuntencaoService.getListagemClientes(vendedorId, index)
            .then(clientes => this.clientes = clientes)
            .then(c => this.loadPositions(1));

        if (this.clientes2 == null) {
            var choice = 0;
            if (index == 0) {
                choice = 1;
            }
            this.selectedDay2 = choice;
            this.selectedUser2 = vendedorId;
            this.manuntencaoService.getListagemClientes(vendedorId, choice)
                .then(clientes => this.clientes2 = clientes);
        }

    }

    carregaEstadosMunicipios(): Promise<any> {
        this.isImporting = true;
        return this.clienteService.getEstados()
            .toPromise()
            .then(data => {
                this.estados = data;
                return this.clienteService.getMunicipios(this.estados[0].Codigo).toPromise();
            })
            .then(data => {
                this.municipios = data;
                this.isImporting = false;
                return Promise.resolve();
            })
            .catch(_ => {
                this.isImporting = false;
                this.toastService.errorNotification("", "Falha ao carregar estado e município");
            });
    }

    onChangeSelectDay1(index: any) {
        this.atualizaFrequencia();
        this.selectedDay1 = index;
        this.onDayClick(this.selectedGrid.idVendedor, this.selectedDay1);
    }

    onChangeSelectVD1(frequenciaVendedor: any) {
        this.atualizaFrequencia();
        this.onDayClick(frequenciaVendedor, this.selectedDay1);
    }

    loadClientes2(vendedorId: string, index: number) {
        this.manuntencaoService.getListagemClientes(vendedorId, index)
            .then(clientes => this.clientes2 = clientes)
            .then(c => this.readonly = true)
            .then(c => this.loadPositions(2))
            .then(c => this.readonly = false);
    }

    onChangeSelectDay2(index: any, day: any) {
        this.atualizaFrequencia();
        this.selectedDay2 = index;
        this.loadClientes2(this.selectedUser2, this.selectedDay2);
    }

    onChangeSelectVD2(frequenciaVendedor: any) {
        this.atualizaFrequencia();
        this.selectedUser2 = frequenciaVendedor;
        this.loadClientes2(frequenciaVendedor, this.selectedDay2);
    }

    loadPositions(ref: any) {
        if (ref == 1) {
            this.positions1 = [];
            var o = 0;
            this.clientes.forEach(c => {
                o++;
                if (c.Latitude != 0 && c.Longitude != 0) {
                    var marker = new MarkerHelper();
                    marker.position = [c.Latitude, c.Longitude];
                    marker.clienteId = c.Id;
                    marker.label = o.toString() + '\u200b';
                    marker.icon = "assets/redMarker.png";
                    this.positions1.push(marker);
                }
            });
        } else {
            this.positions2 = [];
            var o = 0;
            this.clientes2.forEach(c => {
                o++;
                if (c.Latitude != 0 && c.Longitude != 0) {
                    var marker = new MarkerHelper();
                    marker.position = [c.Latitude, c.Longitude];
                    marker.label = c.NomeFantasia;
                    marker.clienteId = c.Id;
                    marker.label = o.toString() + '\u200b';
                    marker.icon = "assets/blueMarker.png";
                    this.positions2.push(marker);
                }
            });
        }

        this.positions = this.positions1.concat(this.positions2);
        this.mostrarPinsMapa(this.positions);
    }

    private mostrarPinsMapa(list: MarkerHelper[]) {
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(this.empresa.latitude, this.empresa.longitude));

        if (list != null) {
            list.forEach(p => bounds.extend(new google.maps.LatLng(p.position[0], p.position[1])));
        }

        this.mapa.map.fitBounds(bounds);
        this.mapa.map.setZoom(this.mapa.map.getZoom() - 2);
    }

    changeDayCanBeDone(index: any, day: any) {
        var result = false;
        if (this.selectedGrid != null) {
            if (this.selectedGrid.idVendedor == this.selectedUser2) {
                result = day != index;
            } else {
                result = true;
            }
        }
        return result;
    }



    changeSalesCanBeDone(idVendedor: string, idReferencia: string) {
        var result = true;
        if (idVendedor == idReferencia) {
            result = this.selectedDay1 != this.selectedDay2;
        }
        return result;
    }



    onMapReady(map) {
        this.mostrarPinsMapa(null);
    }

    onIdle(event) {
        console.log('map', event.target);
    }
    onMarkerInit(marker) {
        console.log('marker', marker);
    }
    onMapClick(event) {

    }

    toggleCols(newValue: number) {
        if (this.currentCol === newValue) {
            this.currentCol = 0;
        } else {
            this.currentCol = newValue;
        }
    }

    exportar(): void {
        this.isExporting = true;
        this.manuntencaoService.export()
            .subscribe(data => {
                this._FileSaverService.save((<any>data)._body, 'frequencia_visita_base.csv');
                this.isExporting = false;
            });
    }

    uploadCSV(event: any): void {
        this.fileHolder = event;
    }

    onUploadFinished(event: any): void {
        console.log('opa 2');
    }

    importar(): void {
        if (this.fileHolder !== undefined) {
            this.isImporting = true;
            this.manuntencaoService.uploadCSV(this.fileHolder)
                .then(() => {
                    this.isImporting = false;
                    this.modalImportar.close();
                    this.toastService.sucessNotification("Sucesso", "Frequência importada");

                    this.busy = this.manuntencaoService.getContagemFrequenciasVendedores()
                        .then(contages => {
                            this.contagensFrequenciaVendedores = contages;
                            this.contagensFrequenciaVendedores2 = contages;
                        }).then(c => {
                            if (this.adicoes.length > 0 || this.delecoes.length > 0) {
                                this.toastService.sucessNotification("Sucesso", "Frequência alterada");
                            }
                            this.adicoes = [];
                            this.delecoes = [];
                        });
                }).catch(error => {
                    this.isImporting = false;
                    this.modalImportar.close();
                    this.toastService.errorNotification("Erro", "Falha ao importar frequência");
                });
        }
    }

    getImagemFachada(): string {
        return this.clienteService.getImagemClienteUrl(this.markerCliente.Id, TipoImagem.FACHADA.Codigo);
    }
    private onDrag(args) {
        let [e, el] = args;
        //alert(e);
        // do something
    }

    private onDrop(args) {
        let [e, el] = args;
        this.clientes1Size = this.clientes.length;
        this.clientes2Size = this.clientes2.length;
        //   this.alteraBag(args[2], args[1].id);
        // do something
    }

    private onOver(args) {
        let [e, el, container] = args;
        //alert(e);
        // do something
    }

    private onOut(args) {
        let [e, el, container] = args;
        //alert(e);
        // do something
    }

}
