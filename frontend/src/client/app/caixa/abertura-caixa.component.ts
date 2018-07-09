import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CaixaStatus } from '../_model/caixa-status';
import {
  Questionario, QuestionarioOpcoes, GenericResponse
} from '../_model/index';
import { CaixaService } from '../_services/caixa.service';
import { AlertService } from '../_services/alert.service';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { DropdownQuestion, QuestionBase, TextboxQuestion } from '../shared/dynamic-question/index';

@Component({
  moduleId: module.id,
  selector: 'abertura-caixa',
  templateUrl: 'abertura-caixa.component.html',
  styleUrls: ['abertura-caixa.component.css']
})
export class VendaBalcaoAberturaCaixaComponent implements OnInit {

  restError: any;
  statusCaixa: CaixaStatus;
  ultimoCaixa: CaixaStatus;
  checklistAbertura: QuestionBase<any>[];
  valorAbertura: number;
  constructor(
    private router: Router,
    private caixaService: CaixaService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.CarregaAberturaCaixa();
    this.valorAbertura = 0;
  }

  CarregaAberturaCaixa() {
    this.restError = null;
    this.caixaService.GetStatusCaixa()
      .flatMap((data) => {
        this.statusCaixa = data;   
        return this.caixaService.GetStatusUltimoCaixa();
      })
      .subscribe(
      (data) => this.OnDataUltimoCaixaLoaded(data),
      (error) => this.handleError
      );
  }

  private OnDataUltimoCaixaLoaded(data) {
    this.ultimoCaixa = data;
    if (this.ultimoCaixa.Saldo > 0) {
      this.valorAbertura = this.ultimoCaixa.Saldo;
    }
  }

  IniciarAberturaCaixa() {
    this.restError = null;
    this.caixaService.GetChecklistAbertura()
      .subscribe(
      (data) => this.checklistAbertura = data,
      (error) => this.handleError
      );
  }

  AbrirCaixa() {
    this.restError = null;
    if (!this.valorAbertura) {
      this.valorAbertura = 0;
    }
    this.caixaService.AbrirCaixa(this.valorAbertura)
      .subscribe(
      (data) => this.statusCaixa = data,
      (error) => { this.handleError(error); },
      () => console.log('abriu caixa')
      );
  }

  private handleError(error: GenericResponse) {
    console.error('An error occurred', error);
    if (error.message) {
      this.restError = error.message;
    }

    window.scrollTo(0, 0);
  }
}