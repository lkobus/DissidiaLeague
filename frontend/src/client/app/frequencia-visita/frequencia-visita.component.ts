import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import * as moment from 'moment';
import { MatCheckboxChange } from '@angular/material';
import { Usuario, Perfil } from '../_model/usuario';
import { Cliente } from '../clientes/model/cliente';
import { GenericResponse } from '../_model/generic-response';
import { UsuariosService } from '../usuarios/shared/usuarios.service';
import { ClienteService } from '../_services/cliente.service';
import { Frequencia, Sazonalidade } from './model/frequencia';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { AlertService } from '../_services/alert.service';
import { ToastService } from '../_services/toast.service';

@Component({
  moduleId: module.id,
  selector: 'sd-frequencia-visita',
  templateUrl: 'fraquencia-visita.component.html'
})
export class FrequenciaVisitaComponent implements OnInit {

  error: any;
  frequencia: Frequencia;
  @Input('cliente') cliente: Cliente;
  @Input('vendedores') vendedores: Usuario[];

  daysOfWeek: string[];
  periodicidade: Sazonalidade[];
  checkedValues = [];
  dataInicialCliente: string;

  public selectedDate;
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    dayLabels: {
      su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui',
      fr: 'Sex', sa: 'Sab'
    },
    monthLabels: {
      1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mar', 6: 'Jun', 7: 'Jul',
      8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
    },
    showClearDateBtn: false,
    showTodayBtn: false,
    yearSelector: true,
    monthSelector: true,
    disableWeekdays: []
  };

  GetDate() {
    var date = moment();
    return {
      year: date.year(),
      month: date.month(),
      day: date.day()
    };
  }

  onDisablePast() {
    let date = new Date();

    // Disable/enable dates from 5th backward
    date.setDate(date.getDate());

    let copy = this.getCopyOfOptions();
    copy.disableUntil = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    this.myDatePickerOptions = copy;
  }

  constructor(private serviceUsuario: UsuariosService,
    private clienteService: ClienteService,
    private toastService: ToastService,
    private alert: AlertService) {

    this.onDisablePast();
    

    this.periodicidade = [Sazonalidade.Semanal, Sazonalidade.Quinzenal, Sazonalidade.Mensal];
    this.onChangePeriodo(this.periodicidade[0].valor);
  }

  ngOnInit() {    
    this.selectedDate = moment().format('DD/MM/YYYY');
  }

  ngOnChanges(changes: SimpleChanges) {
    var cliente = changes['cliente'] as SimpleChange;
    if (cliente && cliente.isFirstChange) {
      this.frequencia = this.cliente.FrequenciasVisita.find(p => p.Perfil === this.vendedores[0].perfil);

      if (this.frequencia && this.frequencia.DataInicio) {
        this.selectedDate = moment(this.frequencia.DataInicio, 'YYYY-MM-DD').format('DD/MM/YYYY');
        this.dataInicialCliente = this.selectedDate;
      }
      // 1(segunda), 4(quinta) ....
      this.frequencia.DiasAtendimento.forEach((day, index) => {
        // sunday, monday ...
        this.daysOfWeek.forEach((element, i) => {
          if (day === i) {
            this.checkedValues[element] = true;
          }
        });
      });
      this.setDisableWeekdays();
      this.getProximaDataVisita();
    }
  }

  SalvarFrequencia() {
    this.error = null;
    var days = [];
    var vendedor = this.vendedores.find(p => p.id === this.frequencia.Vendedor);
    var date = moment(this.selectedDate, 'DD.MM.YYYY');

    this.daysOfWeek.forEach((element, index) => {
      if (this.checkedValues[element]) {
        days.push(index);
      }
    });

    if (!vendedor) {
      this.error = 'Selecione um vendedor';
      return false;
    }

    if (!days || !(days.length > 0)) {
      this.error = 'Selecione um dia para a frequência';
      return false;
    }

    this.frequencia.DataInicio = date.format('YYYY-MM-DD');
    this.frequencia.Perfil = vendedor.perfil;
    this.frequencia.DiasAtendimento = days;

    this.clienteService.SalvarFrequencia(this.cliente.Id, this.frequencia)
      .subscribe((data) => {
        this.toastService.sucessNotification('', 'Frequência de Visitas do Cliente atualizada com sucesso');
      }, (err) => this.handleServerError(err), () => { });

    return false;
  }

  getCopyOfOptions(): IMyDpOptions {
    return JSON.parse(JSON.stringify(this.myDatePickerOptions));
  }

  setDisableWeekdays() {
    var disabledaysOfWeekdays = [];
    this.daysOfWeek.forEach(element => {
      if (!this.checkedValues[element]) {
        disabledaysOfWeekdays.push(element.slice(0, 2).toLowerCase());
      }
    });

    let copy = this.getCopyOfOptions();
    copy.disableWeekdays = disabledaysOfWeekdays;
    this.myDatePickerOptions = copy;
  }

  GetPerfil() {
    return Perfil.From(this.vendedores[0].perfil).Nome;
  }

  onDateChanged(event: IMyDateModel) {
    console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(),
      ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    this.selectedDate = event.formatted;
  }

  OnCheck(value: MatCheckboxChange) {
    console.log(this.frequencia);

    var count = 0;
    this.daysOfWeek.forEach(element => {
      count += this.checkedValues[element] ? 1 : 0;
    });
    if (count >= this.maxCheckedValues()) {
      value.source.checked = false;
    }

    var day = this.daysOfWeek.find(day => String(day) === value.source.value);
    if (day) {
      this.checkedValues[day] = value.source.checked;
    }
    this.setDisableWeekdays();
    this.getProximaDataVisita();
  }

  onChangePeriodo(event: string) {
    this.checkedValues = [];
    this.daysOfWeek = [];

    var dateLocale = moment();
    var days = 6;
    var today = dateLocale.clone().startOf('week');
    var finalDate = dateLocale.clone().startOf('week').add(days, 'days');

    for (var m = moment(today); m.diff(finalDate, 'days') <= 0; m.add(1, 'days')) {
      this.daysOfWeek.push(m.format('dddd'));
    }
  }

  getProximaDataVisita(): void {
    var days = [];
    var frequencia = this.frequencia;
    this.daysOfWeek.forEach((element, index) => {
      if (this.checkedValues[element]) {
        days.push(index);
      }
    });
    frequencia.DiasAtendimento = days;
    frequencia.DataInicio = this.dataInicialCliente;
    if (days.length > 0) {
      this.clienteService.GetProximaVisita(frequencia).subscribe((data) => {
        this.selectedDate = data;
      });
    }
    this.dataInicialCliente = null;
  }

  GetLabelForWeek(stringValue) {
    var result = '';
    if (stringValue === 'Sunday') {
      result = 'Domingo';
    } else if (stringValue === 'Monday') {
      result = 'Segunda';
    } else if (stringValue === 'Tuesday') {
      result = 'Terça';
    } else if (stringValue === 'Wednesday') {
      result = 'Quarta';
    } else if (stringValue === 'Thursday') {
      result = 'Quinta';
    } else if (stringValue === 'Friday') {
      result = 'Sexta';
    } else if (stringValue === 'Saturday') {
      result = 'Sábado';
    }
    return result.slice(0, 3);
  }

  dayIsNotSelected(): boolean {
    var dayNotSelected = true;
    var count = 0;
    this.daysOfWeek.forEach(element => {
      count += this.checkedValues[element] ? 1 : 0;
    });
    if (count > 0) {
      dayNotSelected = false;
    }
    return dayNotSelected;
  }

  private maxCheckedValues() {
    if (Number(this.frequencia.Sazonalidade) === Number(Sazonalidade.Semanal.codigo)) {
      return 2;
    }
    return 1;
  }

  private handleServerError(serverResponse: GenericResponse) {
    this.error = serverResponse.message;
    window.scrollTo(0, 0);
  }
}
