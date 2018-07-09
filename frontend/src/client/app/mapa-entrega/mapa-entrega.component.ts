import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ToastService } from '../_services/toast.service';
import { MapaEntregaService } from './services/mapa-entrega.service';
import { CaminhaoService } from '../caminhao/shared/caminhao.service';
import { Marker, NguiMapComponent, OptionBuilder } from '@ngui/map';
import { Subject } from 'rxjs/Subject';
import { Modal } from 'ngx-modal';
import { BaseTableComponent } from '../shared/table/base-table-component';

import { GenericResponse, Empresa } from '../_model/index';
import { MapaEntrega, PedidoMapa } from './model/mapa-entrega';
import { PedidoEntrega } from './model/pedido-entrega';
import { Caminhao } from '../caminhao/model/caminhao';
import { Pedido } from '../pedidos/model/pedido';
import { Usuario } from '../_model/usuario';
import { UsuariosService } from '../usuarios/shared/usuarios.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
    moduleId: module.id,
    selector: 'mapa-entrega',
    templateUrl: 'mapa-entrega.component.html',
    animations: [
        trigger(
            'myAnimation',
            [
                transition(
                    ':enter', [
                        style({ transform: 'translateX(100%)', opacity: 0 }),
                        animate('500ms', style({ transform: 'translateX(0)', 'opacity': 1 }))
                    ]
                ),
                transition(
                    ':leave', [
                        style({ transform: 'translateX(0)', 'opacity': 1 }),
                        animate('500ms', style({ transform: 'translateX(100%)', 'opacity': 0 }))
                    ]
                )]
        )
    ],
})
export class MapaEntregaComponent extends BaseTableComponent implements OnInit {

    isLoading: boolean = false;
    edited: boolean = false;
    mapaCarregado: boolean = false;

    listVDE: Usuario[] = [];
    listVDI: Usuario[] = [];
    listVDOutros: Usuario[] = [];
    filterVendedor: string = "";
    selecionarPedidosDisp: boolean = false;
    selecionarPedidosMapa: boolean = false;

    mapaSelecionado: MapaEntrega;
    sourceMapas: MapaEntrega[] = [];
    sourcePedidosDisponiveis: PedidoEntrega[] = [];
    listPedidosDisponiveis: PedidoEntrega[] = [];
    sourcePedidosMapaSelecionado: PedidoEntrega[] = [];
    listPedidosMapaSelecionado: PedidoEntrega[] = [];
    listVeiculos: Caminhao[] = [];

    mapaCadastro: MapaEntrega;

    empresa: Empresa;

    @ViewChild('modalCadastro')
    modalCadastro: Modal;

    @ViewChild('modalMoverPedidoDisp')
    modalMoverPedidosDisp: Modal;

    @ViewChild('modalMoverPedidoMapa')
    modalMoverPedidosMapa: Modal;

    @ViewChild('mapa')
    mapa: NguiMapComponent;

    pedidoDetail: PedidoEntrega = null;

    @Output()
    searchChangeEmitterPedidosDisponiveis: EventEmitter<any> = new EventEmitter<any>();

    searchUpdatedPedidosDisponiveis: Subject<string> = new Subject<string>();
    inputSearchPedidosDisponiveis: any;

    @Output()
    searchChangeEmitterPedidosMapa: EventEmitter<any> = new EventEmitter<any>();

    searchUpdatedPedidosMapa: Subject<string> = new Subject<string>();
    inputSearchPedidosMapa: any;

    @ViewChild("modalConfirmacao")
    modalConfirmacao: Modal;

    constructor(
        private authenticationService: AuthenticationService,
        private mapaEntregaService: MapaEntregaService,
        private veiculoService: CaminhaoService,
        private usuarioService: UsuariosService,
        private toastService: ToastService
    ) {
        super();

        this.searchChangeEmitterPedidosDisponiveis = <any>this.searchUpdatedPedidosDisponiveis.asObservable()
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(item => this.filterNotasDisponiveis(item));

        this.searchChangeEmitterPedidosMapa = <any>this.searchUpdatedPedidosMapa.asObservable()
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(item => this.filterNotasMapa(item));

        this.empresa = this.authenticationService.getEmpresa();
    }

    ngOnInit() {
        this.loadSource();
    }

    formatarPlaca(placa: string): string {
        let regex = /^([a-zA-Z]+)(\d+)$/g;
        let matchs = regex.exec(placa.toLocaleUpperCase());
        if (matchs && matchs.length == 3) {
            placa = matchs[1] + '-' + matchs[2];
        }
        return placa;
    }

    loadSource(): Promise<any> {
        this.filterVendedor = "";
        this.inputSearchPedidosDisponiveis = "";
        this.edited = false;
        this.isLoading = true;
        return this.loadSourceMapas()
            .then(() => {
                return this.loadSourceNotas();
            })
            .then(() => {
                return this.veiculoService.getCaminhoes()
                    .toPromise();
            })
            .then(data => {
                this.listVeiculos = data.filter(d => {
                    d.Placa = this.formatarPlaca(d.Placa);
                    return d;
                });
                return this.usuarioService.getUsers();
            })
            .then(data => {
                this.listVDE = data.filter(d => d.perfil == 2);
                this.listVDI = data.filter(d => d.perfil == 5);
                this.listVDOutros = data.filter(d => d.perfil == 1
                    && this.sourcePedidosDisponiveis.find(p => p.VendedorId == d.id));

                this.isLoading = false;
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            });
    }

    loadSourceMapas(): Promise<any> {
        this.mapaSelecionado = null;
        this.sourcePedidosMapaSelecionado = [];
        this.listPedidosMapaSelecionado = [];
        return this.mapaEntregaService.getMapasAbertos()
            .then(data => {
                this.sourceMapas = data.sort((m1, m2) => {
                    if (m1.Codigo > m2.Codigo) {
                        return 1;
                    } else if (m1.Codigo < m2.Codigo) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            });
    }

    filterPedidosDisponiveis(): PedidoEntrega[] {
        return this.listPedidosDisponiveis.filter(p => p.ClienteLat != 0 && p.ClienteLng != 0);
    }

    filterPedidosMapaSelecionado(): PedidoEntrega[] {
        return this.listPedidosMapaSelecionado.filter(p => p.ClienteLat != 0 && p.ClienteLng != 0);
    }

    loadSourceNotas(): Promise<any> {
        this.sourcePedidosDisponiveis = [];
        this.listPedidosDisponiveis = [];
        return this.mapaEntregaService.getPedidosDisponiveis()
            .then(data => {
                this.sourcePedidosDisponiveis = data;
                this.listPedidosDisponiveis = this.sourcePedidosDisponiveis;
            });
    }

    abrirModalMoverPedidos(adicionar: boolean) {
        if (adicionar) {
            if (this.possuiMapaVeiculoSelecionado()) {
                this.modalMoverPedidosDisp.open();
            }
        } else {
            this.modalMoverPedidosMapa.open();
        }
    }

    addPedidoEntrega(pedido: PedidoEntrega): void {
        if (this.possuiMapaVeiculoSelecionado()) {
            this.moverPedido(pedido);
        }
    }

    moverTodosPedidosMapa(adicionar: boolean) {
        if (adicionar) {
            var pedidos = this.listPedidosDisponiveis.filter(p => p.Selecionado);
            pedidos.forEach(p => this.moverPedido(p));
            this.selecionarPedidosDisp = false;
            this.modalMoverPedidosDisp.close();
        } else {
            var pedidos = this.listPedidosMapaSelecionado.filter(p => p.Selecionado);
            pedidos.forEach(p => this.removePedidoEntrega(p));
            this.selecionarPedidosMapa = false;
            this.modalMoverPedidosMapa.close();
        }
    }

    removePedidoEntrega(pedido: PedidoEntrega): void {
        this.sourcePedidosMapaSelecionado = this.sourcePedidosMapaSelecionado.filter(p => p != pedido);
        this.listPedidosMapaSelecionado = this.sourcePedidosMapaSelecionado;
        this.mapaSelecionado.PesoTotal -= pedido.PesoTotal;
        this.mapaSelecionado.VolumeTotal -= pedido.VolumeTotal;
        this.edited = true;
        this.sourcePedidosDisponiveis.push(pedido);
        this.filterNotasDisponiveis(this.inputSearchPedidosDisponiveis);
    }

    onMapaSelected(mapaId: string): void {
        this.selecionarPedidosMapa = false;

        if (this.edited) {
            this.isLoading = true;
            this.loadSource()
                .then(() => {
                    this.isLoading = false;
                    if (mapaId != "0") {
                        this.mapaSelecionado = this.sourceMapas.find(m => m.Id == mapaId);
                        this.sourcePedidosMapaSelecionado = this.mapaSelecionado.Pedidos.filter(p => true);
                    } else {
                        this.mapaSelecionado = null;
                        this.sourcePedidosMapaSelecionado = [];
                    }
                    this.listPedidosMapaSelecionado = this.sourcePedidosMapaSelecionado;
                    if (this.listPedidosDisponiveis.length == 0) {
                        this.mostrarPinsMapa(this.filterPedidosMapaSelecionado());
                    }
                })
                .catch(error => {
                    this.isLoading = false;
                    this.handleServerError(error);
                })
        } else {
            if (mapaId != "0") {
                this.mapaSelecionado = this.sourceMapas.find(m => m.Id == mapaId);
                this.sourcePedidosMapaSelecionado = this.mapaSelecionado.Pedidos.filter(n => true);
            } else {
                this.mapaSelecionado = null;
                this.sourcePedidosMapaSelecionado = [];
            }
            this.listPedidosMapaSelecionado = this.sourcePedidosMapaSelecionado;
            if (this.listPedidosDisponiveis.length == 0) {
                this.mostrarPinsMapa(this.filterPedidosMapaSelecionado());
            }
        }
    }

    salvar(): void {
        if (!this.mapaSelecionado.VeiculoId) {
            this.toastService.errorNotification("Atenção", "É necessário informar o veículo para o mapa de entrega.");
            return;
        }

        this.isLoading = true;
        let mapaId = this.mapaSelecionado.Id;
        let veiculoId = this.mapaSelecionado.VeiculoId;

        this.mapaEntregaService.updateVeiculo(mapaId, veiculoId)
            .then(() => {
                this.mapaEntregaService.updatePedidosMapa(this.mapaSelecionado.Id, this.sourcePedidosMapaSelecionado)
                    .then(() => {
                        this.loadSource()
                            .then(() => {
                                this.onMapaSelected(mapaId);
                                this.toastService.sucessNotification("", "Mapa de entrega atualizado com sucesso.");
                            })
                    })
                    .catch(error => {
                        this.isLoading = false;
                        this.handleServerError(error);
                    })
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            })
    }

    faturarMapaSelecionado(): void {
        this.isLoading = true;
        this.mapaEntregaService.faturarMapa(this.mapaSelecionado)
            .then(() => {
                this.loadSource()
                    .then(() => {
                        this.toastService.sucessNotification("", "Faturamento solicitado com sucesso.");
                    });
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            });
    }

    removerMapaSelecionado(): void {
        this.closeModalConfirmacao();
        this.isLoading = true;
        this.mapaEntregaService.deleteMapa(this.mapaSelecionado.Id)
            .then(() => {
                this.loadSource()
                    .then(() => {
                        this.toastService.sucessNotification("", "Mapa excluído com sucesso.");
                    });
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            });
    }

    openModalCadastro(): void {
        this.mapaCadastro = new MapaEntrega;
        let pattern = /(\d+\-\d+\-\d+)\D\+/;
        let data = new Date().toLocaleDateString();
        this.mapaCadastro.Descricao = "MAPA " + data.replace(pattern, "$1");
        this.modalCadastro.open();
    }

    closeModalCadastro(): void {
        this.mapaCadastro = null;
        this.modalCadastro.close();
    }

    salvarCadastroMapa(): void {
        if (!this.mapaCadastro.Descricao) {
            this.toastService.errorNotification("Atenção", "Informe uma descrição para o mapa de entrega.");
            return;
        }

        this.isLoading = true;
        this.mapaEntregaService.createMapa(this.mapaCadastro)
            .then(() => {
                return this.loadSource()
                    .then(() => {
                        this.edited = false;
                        this.isLoading = false;
                        this.mapaSelecionado = this.sourceMapas[this.sourceMapas.length - 1];
                        this.toastService.sucessNotification("", "Mapa cadastrado com sucesso.");
                    })
                    .catch(error => {
                        this.edited = false;
                        this.isLoading = false;
                        this.handleServerError(error);
                    });
            })
            .catch(error => {
                this.edited = false;
                this.isLoading = false;
                this.handleServerError(error);
            })
        this.closeModalCadastro();
    }

    onMapReady(event) {
        this.mapaCarregado = true;
        this.mostrarPinsMapa(null);

        let pedidos = this.filterPedidosMapaSelecionado();
        if (pedidos.length == 0) {
            pedidos = this.filterPedidosDisponiveis();
        }

        if (pedidos.length > 0) {
            this.mostrarPinsMapa(pedidos);
        }
    }

    private mostrarPinsMapa(list: PedidoEntrega[]) {
        if (this.mapaCarregado) {
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(new google.maps.LatLng(this.empresa.latitude, this.empresa.longitude));

            if (list != null) {
                list.forEach(p => bounds.extend(new google.maps.LatLng(p.ClienteLat, p.ClienteLng)));
            }

            this.mapa.map.fitBounds(bounds);
        }
    }

    ontMarkerDisponivelClick({ target: marker }, pedido: PedidoEntrega) {
        this.pedidoDetail = pedido;
        marker.nguiMapComponent.openInfoWindow("pedidoDisponivelDetail", marker);
    }

    ontMarkerMapaClick({ target: marker }, pedido: PedidoEntrega) {
        this.pedidoDetail = pedido;
        marker.nguiMapComponent.openInfoWindow("pedidoMapaDetail", marker);
    }

    onVeiculoChange(): void {
        this.edited = true;
    }

    onVendedorFilter(): void {
        this.filterNotasDisponiveis(this.inputSearchPedidosDisponiveis);
    }

    formatCurrency(value: number): string {
        var formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        });

        return formatter.format(value);
    }

    inputSearchPedidosDisponiveisOnFilter(searchText: string): void {
        this.searchUpdatedPedidosDisponiveis.next(searchText);
    }

    inputSearchPedidosMapaOnFilter(searchText: string): void {
        this.searchUpdatedPedidosMapa.next(searchText);
    }

    filterNotasDisponiveis(searchText) {
        if (searchText) {
            searchText = searchText.toLowerCase();
        } else {
            searchText = '';
        }

        this.listPedidosDisponiveis = this.sourcePedidosDisponiveis.filter((p: PedidoEntrega) => {
            let result = true;
            if (searchText) {
                let cliente = p.ClienteFantasia;
                if (!cliente) {
                    cliente = '';
                }
                result = cliente.toLowerCase().indexOf(searchText) > -1;
            }
            if (result && this.filterVendedor) {
                result = p.VendedorId == this.filterVendedor;
            }
            return result;
        });
    }

    getPesoTotalPedDisp(): number {
        return this.listPedidosDisponiveis.reduce((a, b) => a + b.PesoTotal, 0);
    }

    getVolumeTotalPedDisp() {
        return this.listPedidosDisponiveis.reduce((a, b) => a + b.VolumeTotal, 0);
    }

    filterNotasMapa(searchText) {
        if (searchText) {
            searchText = searchText.toLowerCase();
        } else {
            searchText = '';
        }

        this.listPedidosMapaSelecionado = this.sourcePedidosMapaSelecionado.filter((p: PedidoEntrega) => {
            if (!searchText) {
                return true;
            }

            let cliente = p.ClienteFantasia;
            if (!cliente) {
                cliente = '';
            }
            return cliente.toLowerCase().indexOf(searchText) > -1;
        });
    }

    openModalConfirmacao(): void {
        if (this.mapaSelecionado.Id) {
            this.modalConfirmacao.open();
        }
    }

    closeModalConfirmacao(): void {
        this.modalConfirmacao.close();
    }

    formatDecimal(value: number): string {
        var formatter = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2
        });

        return formatter.format(value);
    }

    getClassForVolume(): string {
        let veiculo = this.listVeiculos.find(v => v.DocumentId == this.mapaSelecionado.VeiculoId);
        if (!veiculo) {
            return '';
        }
        if (veiculo.Capacidade < this.mapaSelecionado.VolumeTotal) {
            return 'c-error';
        }
        return 'c-ok';
    }

    selectPedidos(selecionado: boolean, isMapa: boolean) {
        if (isMapa) {
            this.listPedidosMapaSelecionado.forEach(p => {
                p.Selecionado = selecionado;
            });
        }
        else {
            this.listPedidosDisponiveis.forEach(p => {
                p.Selecionado = selecionado;
            });
        }
    }

    getClassFb(item: number): string {
        var posicao = 2;

        var possuiPosDois =
            this.edited || (this.mapaSelecionado && this.mapaSelecionado.Id && (this.listPedidosMapaSelecionado.length > 0 || !this.mapaSelecionado.VeiculoId));
        if (possuiPosDois) posicao = 3;

        var possuiPosTres = this.edited || this.listPedidosMapaSelecionado.length > 0;
        if (possuiPosTres) posicao = 4;

        if (item == 2 && this.selecionarPedidosDisp) posicao++;

        return 'nds nd' + posicao;
    }

    private moverPedido(pedido: PedidoEntrega) {
        this.sourcePedidosDisponiveis = this.sourcePedidosDisponiveis.filter(p => p != pedido);
        this.listPedidosDisponiveis = this.sourcePedidosDisponiveis;
        this.sourcePedidosMapaSelecionado.push(pedido);
        this.listPedidosMapaSelecionado = this.sourcePedidosMapaSelecionado;
        this.mapaSelecionado.PesoTotal += pedido.PesoTotal;
        this.mapaSelecionado.VolumeTotal += pedido.VolumeTotal;
        this.edited = true;
        this.filterNotasDisponiveis(this.inputSearchPedidosDisponiveis);
    }

    private possuiMapaVeiculoSelecionado(): boolean {
        if (!this.mapaSelecionado) {
            this.toastService.errorNotification("Atenção", "É necessário selecionar um mapa de entrega.");
            return false;
        }
        if (!this.mapaSelecionado.VeiculoId) {
            this.toastService.errorNotification("Atenção", "É necessário informar o veículo antes de adicionar um pedido.");
            return false;
        }

        return true;
    }

    private handleServerError(error: GenericResponse): void {
        this.isLoading = false;
        if (error.message) {
            this.toastService.errorNotification('', error.message);
        } else {
            this.toastService.errorNotification('', 'Falha ocorrida.');
        }
    }
}
