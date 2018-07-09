import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FileSaverService } from 'ngx-filesaver';
import { ToastService } from '../_services/toast.service';
import { MapaEntregaService } from './services/mapa-entrega.service';
import { Marker, NguiMapComponent, OptionBuilder } from '@ngui/map';
import { Subject } from 'rxjs/Subject'
import { Modal } from 'ngx-modal';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import * as moment from 'moment';
import { BaseTableComponent } from '../shared/table/base-table-component';

import { GenericResponse } from '../_model/index';
import { MapaEntrega } from './model/mapa-entrega';

@Component({
    moduleId: module.id,
    selector: 'mapaEntregaResumo',
    templateUrl: 'mapa-entrega-resumo.component.html',
    styleUrls: ['mapa-entrega-resumo.component.css']
})
export class MapaEntregaResumoComponent extends BaseTableComponent implements OnInit {

    isLoading: boolean;

    filterStatus: number = 1;
    selectedDataIni = moment().format('DD/MM/YYYY');
    selectedDataFin = moment().format('DD/MM/YYYY');

    mapaSelecionado: MapaEntrega;
    sourceMapas: MapaEntrega[] = [];
    listMapas: MapaEntrega[] = [];

    @Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
    searchUpdated: Subject<string> = new Subject<string>();
    inputSearch: any;

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
        markCurrentMonth: true,
        markCurrentYear: true,
        alignSelectorRight: true,
        disableHeaderButtons: false,
        showDecreaseDateBtn: true,
        showIncreaseDateBtn: true
    };

    constructor(
        private mapaEntregaService: MapaEntregaService,
        private toastService: ToastService,
        private fileSaverService: FileSaverService,
        private router: Router
    ) {
        super();

        this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(item => this.filterMapas(item));
    }

    ngOnInit() {
        this.loadSources();
    }

    loadSources(): Promise<any> {
        if (this.filterStatus == 2) {
            this.isLoading = true;
            return this.mapaEntregaService.getMapasFechados(this.getFilterDataInicial(), this.getFilterDataFinal())
                .then(data => {
                    this.sourceMapas = data;
                    this.listMapas = this.sourceMapas;
                    this.isLoading = false;
                })
                .catch(error => {
                    this.isLoading = false;
                    this.handleServerError(error);
                });
        } else if (this.filterStatus == 3) {
            this.isLoading = true;
            return this.mapaEntregaService.getMapasFaturamento()
                .then(data => {
                    this.sourceMapas = data;
                    this.listMapas = this.sourceMapas;
                    this.isLoading = false;
                })
                .catch(error => {
                    this.isLoading = false;
                    this.handleServerError(error);
                });
        } else if (this.filterStatus == 4) {
            this.isLoading = true;
            return this.mapaEntregaService.getMapasProntoCarregar()
                .then(data => {
                    this.sourceMapas = data;
                    this.listMapas = this.sourceMapas;
                    this.isLoading = false;
                })
                .catch(error => {
                    this.isLoading = false;
                    this.handleServerError(error);
                });
        } else {
            this.isLoading = true;
            return this.mapaEntregaService.getMapasAbertos()
                .then(data => {
                    this.sourceMapas = data;
                    this.listMapas = this.sourceMapas;
                    this.isLoading = false;
                })
                .catch(error => {
                    this.isLoading = false;
                    this.handleServerError(error);
                });
        }
    }

    getFilterDataInicial(): Date {
        var data = moment(this.selectedDataIni, 'DD/MM/YYYY').format('YYYY-MM-DD');
        return new Date(data);
    }

    getFilterDataFinal(): Date {
        var data = moment(this.selectedDataFin, 'DD/MM/YYYY').format('YYYY-MM-DD');
        return new Date(data);
    }

    viewDetalheMapa(mapa: MapaEntrega): void {
        this.router.navigate(['/entrega/mapa/detail', mapa.Id]);
    }

    faturarMapa(mapa: MapaEntrega): void {
        this.isLoading = true;
        this.mapaEntregaService.faturarMapa(mapa)
            .then(() => {
                this.loadSources()
                    .then(() => {
                        this.toastService.sucessNotification("", "Faturamento solicitado com sucesso.");
                    });
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            });
    }

    imprimirMapa(mapa: MapaEntrega): void {
        this.isLoading = true;
        this.mapaEntregaService.imprimirMapa(mapa.Id)
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

    filterMapas(searchText) {
        if (searchText) {
            searchText = searchText.toLowerCase();
        } else {
            searchText = '';
        }

        this.listMapas = this.sourceMapas.filter((mapa: MapaEntrega) => {
            if (!searchText) {
                return true;
            }
            if (mapa.Codigo.toString().indexOf(searchText) > -1) {
                return true;
            }
            if (mapa.Descricao.toLowerCase().indexOf(searchText) > -1) {
                return true;
            }
            if (mapa.UsuarioNome.toLowerCase().indexOf(searchText) > -1) {
                return true;
            }
            return false;
        });
    }

    onFilterStatusChange(): void {
        this.inputSearch = "";
        this.sourceMapas = [];
        this.listMapas = this.sourceMapas;
        this.loadSources();
    }

    onDateInicialChanged(event: IMyDateModel) {
        this.selectedDataIni = event.formatted;
    }

    onDateFinalChanged(event: IMyDateModel) {
        this.selectedDataFin = event.formatted;
    }

    onDataFilter(): void {
        this.loadSources();
    }

    onSelectMapa(mapa: MapaEntrega): void {
        this.mapaSelecionado = mapa;
    }

    inputSearchOnFilter(searchText: string): void {
        this.searchUpdated.next(searchText);
    }

    formatDecimal(value: number): string {
        var formatter = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2
        });

        return formatter.format(value);
    }

    formatarPlaca(placa: string): string {
        if (!placa) {
            return '';
        }
        let regex = /^([a-zA-Z]+)(\d+)$/g;
        let matchs = regex.exec(placa.toLocaleUpperCase());
        if (matchs && matchs.length == 3) {
            placa = matchs[1] + '-' + matchs[2];
        }
        return placa;
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