import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CaixaMovimento, CaixaStatus, OperacoesCaixa, FormaPagamento } from '../_model/index';
import { Questionario, QuestionarioOpcoes, GenericResponse } from '../_model/index';
import { CaixaService } from '../_services/caixa.service';
import { AlertService } from '../_services/alert.service';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'extrato-diario',
  templateUrl: 'extrato-diario.component.html',
  styleUrls: ['abertura-caixa.component.css']
})
export class ExtratoDiarioCaixaComponent implements OnInit {

  restError: any;
  statusCaixa: CaixaStatus;
  saldoCaixaMomento: number[] = [];
  constructor(
    private router: Router,
    private caixaService: CaixaService,
    private alertService: AlertService
  ) { }

  TipoMovimento(movimento: CaixaMovimento): string {
    if (movimento.Operacao.Codigo == OperacoesCaixa.Venda.Codigo || movimento.Operacao.Codigo == OperacoesCaixa.VendaCancelamento.Codigo) {
      return " - " + movimento.FormaPagamento.Descricao;
    }
    return "";
  }

  SetDate(date: string): string {
    var temp = date.split(" ");
    var hour = temp[1].split(":");
    var days = temp[0].split("/");
    return hour[0] + ":" + hour[1];
  }

  SaldoDinheiroCheque() {
    let valor = CaixaStatus.GetSaldoDinheiroCheque(this.statusCaixa);
    return valor;
  }

  SaldoCartao(): number {
    let vendaCartao = this.statusCaixa.Vendas.filter(p => {
      return p.FormaPagamento.Codigo === FormaPagamento.CartaoCredito.Codigo
        || p.FormaPagamento.Codigo === FormaPagamento.CartaoDebito.Codigo
    });
    let saldoCartao = vendaCartao.reduce((a, b) => a + b.Valor, 0);
    return saldoCartao;
  }

  GetBalancoTotal(index: number): number {
    return this.saldoCaixaMomento[index];
  }

  ngOnInit(): void {
    this.caixaService.statusCaixaEmitter.subscribe((data) => this.OnDataLoaded(data));
  }

  private PutSaldoMomento(from: number, at: number): number {
    let list = this.statusCaixa.Movimentos.slice(from, at);
    let total = list.reduce((a, b, c, d) => CaixaMovimento.CalculaSaldo(a, b), 0);
    return total;
  }

  private OnDataLoaded(data: CaixaStatus) {
    if (data) {
      this.statusCaixa = data;
      this.saldoCaixaMomento = [];

      this.statusCaixa.Movimentos.sort((a, b) => {
        let date1 = moment(a.Data, 'DD/MM/YYYY HH:mm:ss');
        let date2 = moment(b.Data, 'DD/MM/YYYY HH:mm:ss');
        return (date1.diff(date2) >= 0) ? 1 : -1;
      });

      this.statusCaixa.Movimentos.forEach((element, i, array) => {
        this.saldoCaixaMomento.push(this.PutSaldoMomento(0, i + 1));
      });

      this.statusCaixa.Movimentos.reverse();
      this.saldoCaixaMomento.reverse();
    }
  }

  CarregaMovimentos(): void {
    this.caixaService.GetStatusCaixa().subscribe();
  }

  private handleError(error: GenericResponse) {
    console.error('An error occurred', error);
    if (error.message) {
      this.restError = error.message;
    }

    window.scrollTo(0, 0);
  }
}
