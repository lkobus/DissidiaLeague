import {
  Component, OnInit, EventEmitter, Output, ViewChild, ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Indicadores } from './model/indicadores';
import { ModalModule, Modal } from 'ngx-modal';
import { Subject } from 'rxjs/Subject';
import { IndicadorMetaService } from './shared/indicador-meta.service';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'sd-indicador-meta',
  templateUrl: 'indicador-meta.component.html'
})
export class IndicadoresMetaComponent implements OnInit {

  @Output()
  searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

  public dados: Indicadores[];
  public sortingDesc: boolean = false;

  private dataFilter: any;
  private indicadores: Indicadores[];
  private searchUpdated: Subject<string> = new Subject<string>();

  public selectedMesMeta = moment().format('DD/MM/YYYY');
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',

    monthLabels: {
      1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mar', 6: 'Jun', 7: 'Jul',
      8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
    },
    yearSelector: true,
    monthSelector: true,
    showClearDateBtn: true,
    markCurrentDay: true,
    showTodayBtn: false,
    markCurrentMonth: true,
    markCurrentYear: true,
    alignSelectorRight: true,
    disableHeaderButtons: false,
    showDecreaseDateBtn: true,
    showIncreaseDateBtn: true
  };

  constructor(private indicadorService: IndicadorMetaService) {
    this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(item => this.filter(item, this.indicadores));
  }

  ngOnInit() {
    this.LoadValues(); 
  }

  public LoadValues(): void {
    this.indicadorService.getIndicadores()
      .subscribe(indicador => {
        this.indicadores = indicador;
        this.dados = indicador;
        this.setDateFilterList();
      });
  }

  public onDataMesMeta(event: any): void {
    var dataMesMeta = event.jsdate;
    this.selectedMesMeta = event.formatted;
    this.dataFilter = moment(dataMesMeta.toString()).format('MM/YYYY');
    this.onSearchType(this.dataFilter);
  }

  private setDateFilterList(): void {
    this.dataFilter = moment(this.selectedMesMeta.toString()).format('DD/YYYY');
    this.onSearchType(this.dataFilter);
  }

  public formatDate(dateConvert: Date): string {
    return moment(dateConvert.toString()).format('MM/YYYY');
  }

  public formatRegraCalculo(codigo: number): string {
    var array = ["", "Maior que", "Menor que", "Maior igual", "Menor igual", "Igual"];
    return array[codigo];
  }

  public formatValor(valor: number, nomeEnum: string): string {
    if (nomeEnum == 'Positivação' || nomeEnum == 'Visitas' || nomeEnum == 'GPS') {
      var mascara = valor + ' %';
      return mascara;
    } else {
      var semMascara = valor.toString();
      return semMascara;
    }
  }

  private onSearchType(value: string) {
    this.searchUpdated.next(value);
  }

  public filter(searchText, list: Indicadores[]): void {
    var textoBusca = '';
    if (searchText) {
      textoBusca = searchText.toLowerCase();
    }

    this.dados = list.filter((indicador) => {
      var dataBusca = this.formatDate(indicador.DataMesMeta);
      var find = false;
      var matchFilter = false;

      if (indicador.IndicadoresEnum.Valor.toLowerCase().indexOf(textoBusca) > -1) {
        find = true;
      } else if (dataBusca.indexOf(textoBusca) > -1) {
        find = true;
      }
      return find;
    });
  }

  public sortList(list: any[], property: string): void {
    this.sortingDesc = !this.sortingDesc;
    let direction = this.sortingDesc ? 1 : -1;
    let temp = property.split('.');
    let first = temp[0];
    let second = temp.length > 1 ? temp[1] : '';
    list = list.sort((a, b) => {
      if (this.GetProperty(a, first, second) < this.GetProperty(b, first, second)) {
        return -1 * direction;
      } else if (this.GetProperty(a, first, second) > this.GetProperty(b, first, second)) {
        return 1 * direction;
      }
      return 0;
    });
  }

  private GetProperty(value: any, first: string, second: string): any {

    var temp = value[first];
    if (second != '') {
      temp = value[first][second];
    }

    if (typeof temp === 'number') {
      return Number(temp);
    }
    return temp;
  }
}