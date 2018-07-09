import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { AlertService } from '../_services/alert.service';
import { VendaBalcaoService } from './services/venda-balcao.service';
import { VendaBalcao } from './model/venda-balcao';
import { StatusConfirmacao } from './model/status-confirmacao';
import { BaseTableComponent } from '../shared/table/base-table-component';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    moduleId: module.id,
    selector: 'venda-balcao-historico',
    templateUrl: 'venda-balcao-historico.component.html',
    styleUrls: []
})
export class VendaBalcaoHistoricoComponent extends BaseTableComponent implements OnInit {

    listStatusConfirmacao: StatusConfirmacao[] = [];

    filterPeriodo: number = 1;
    filterStatus: number = 0;

    isLoadingVendas: boolean = false;
    sourceVendas: VendaBalcao[] = [];
    listVendas: VendaBalcao[] = [];

    constructor(private alertService: AlertService, private vendaBalcaoService: VendaBalcaoService) {
        super();
    }

    ngOnInit(): void {
        this.loadListStatusConfirmacao();
        this.loadVendas();
    }

    loadVendas(): void {
        this.isLoadingVendas = true;
        this.setDataSource([]);
        this.vendaBalcaoService
            .getVendasEfetuadas(this.getFilterDataInicial())
            .then(vendas => {
                this.setDataSource(vendas);
                this.isLoadingVendas = false;
            });
    }

    loadListStatusConfirmacao(): void {
        this.vendaBalcaoService.getVendaStatusConfirmacao()
            .then(listStatus => {
                this.listStatusConfirmacao = listStatus.filter(s => s.Codigo == 1 || s.Codigo == 2
                    || s.Codigo == 3 || s.Codigo == 4);
            })
    }

    setDataSource(vendas: VendaBalcao[]): void {
        this.sourceVendas = vendas;
        this.listVendas = this.sourceVendas.sort((a, b) => {
            if (a.Data > b.Data) {
                return -1;
            } else if (a.Data < b.Data) {
                return 1;
            }
            return 0;
        });
    }

    getFilterDataInicial(): Date {
        let result: Date;
        let currentDate: Date = new Date();
        if (this.filterPeriodo == 1) {
            result = currentDate;
        } else if (this.filterPeriodo == 2) {
            result = new Date(currentDate.getFullYear(),
                currentDate.getMonth(), currentDate.getDate() - currentDate.getDay())
        } else if (this.filterPeriodo == 3) {
            result = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        } else if (this.filterPeriodo == 4) {
            result = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate())
        } else if (this.filterPeriodo == 5) {
            result = new Date(currentDate.getFullYear(), 1, 1)
        }
        return result;
    }

    onStatusFilter(): void {
        if (this.filterStatus == 0) {
            this.listVendas = this.sourceVendas;
        } else {
            this.listVendas = this.sourceVendas.filter(v => v.Status == this.filterStatus);
        }
    }

    onPeriodoFilter(): void {
        this.loadVendas();
        this.onStatusFilter();
    }
}