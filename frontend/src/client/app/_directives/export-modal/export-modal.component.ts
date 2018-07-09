import { Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';

import { IMyDpOptions, IMyDateModel, IMyDate, IMyDateRange } from 'mydatepicker';
import { Modal } from 'ngx-modal';

import * as moment from 'moment';
import { Moment } from 'moment';

import { ToastService } from '../../_services/toast.service';

@Component({
    moduleId: module.id,
    selector: 'export-modal',
    templateUrl: 'export-modal.component.html'
})

export class ExportModalComponent implements OnInit {

    private initial: IMyDateModel;
    private final: IMyDateModel;

    myDatePickerOptions: IMyDpOptions = {
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

    @ViewChild('modalExport') modal: Modal;

    @Input() title: string = 'Exportar';
    @Input() initialDate: string;
    @Input() finalDate: string;

    @Input() closeOutSide: boolean = false;
    @Input() isLoading: boolean = false;
    @Input() hiddenCsvExport: boolean = false;
    @Input() hiddenXmlExport: boolean = false;

    @Output() onInitialDateChanged: EventEmitter<IMyDateModel> = new EventEmitter<IMyDateModel>();
    @Output() onFinalDateChanged: EventEmitter<IMyDateModel> = new EventEmitter<IMyDateModel>();
    @Output() exportCsv: EventEmitter<FiltroRange> = new EventEmitter<FiltroRange>();
    @Output() exportXml: EventEmitter<FiltroRange> = new EventEmitter<FiltroRange>();

    constructor(private toastService: ToastService) {

    }

    ngOnInit(): void {
        var today = moment();
        var lastWeek = moment().subtract('days', 7);

        this.initialDate = lastWeek.format('DD/MM/YYYY');
        this.finalDate = today.format('DD/MM/YYYY');

        this.initial = this.transformDate(lastWeek);
        this.final = this.transformDate(today);
    }

    initialDateChange(value: IMyDateModel) {
        this.initial = value;
        this.onInitialDateChanged.emit(value);
    }

    finalDateChange(value: IMyDateModel) {
        this.final = value;
        this.onFinalDateChanged.emit(value);
    }

    export(csv: boolean) {
        if (this.initial.epoc > this.final.epoc) {
            this.toastService.errorNotification('Atenção', 'O filtro da data inicial não pode ser maior que a data final');
        } else {
            if (csv) {
                this.exportCsv.emit(this.sendDateEmitter());
            } else {
                this.exportXml.emit(this.sendDateEmitter());
            }
        }
    }

    openModal() {
        this.modal.open();
    }

    closeModal() {
        this.modal.close();
    }

    private sendDateEmitter(): FiltroRange {
        return new FiltroRange(this.initial.jsdate, this.final.jsdate);
    }

    private transformDate(moment: Moment): IMyDateModel {
        var date = <IMyDate>{ day: moment.date(), month: moment.month(), year: moment.year() };
        var jsDate = new Date(date.year, date.month, date.day);
        var formatted = moment.format("DD/MM/YYYY");

        return <IMyDateModel>{ date: date, jsdate: jsDate, formatted: formatted, epoc: Math.round(jsDate.getTime() / 1000.0) };
    }

}

export class FiltroRange {

    DataInicial: string;
    DataFinal: string;

    constructor(initial: Date, final: Date) {
        this.DataInicial = initial.toISOString().split('T')[0];
        this.DataFinal = final.toISOString().split('T')[0];;
    }

}