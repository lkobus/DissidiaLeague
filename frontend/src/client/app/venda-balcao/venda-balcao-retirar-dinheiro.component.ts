import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CaixaStatus } from '../_model/caixa-status';
import { Questionario, QuestionarioOpcoes, GenericResponse } from '../_model/index';
import { CaixaService } from '../_services/caixa.service';
import { AlertService } from '../_services/alert.service';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';

@Component({
  moduleId: module.id,
  selector: 'venda-balcao-retirar-dinheiro',
  templateUrl: 'venda-balcao-retirar-dinheiro.component.html'
})
export class VendaBalcaoRetirarDinheiroComponent implements OnInit {

  restError: any;
  statusCaixa: CaixaStatus;
  valorRetirar: number;
  constructor(private router: Router,
    public caixaService: CaixaService)
  { }

  ngOnInit() {
    this.caixaService.statusCaixaEmitter.subscribe((data) => this.statusCaixa = data);
  }

  SaldoDinheiroCheque() {
    let valor = CaixaStatus.GetSaldoDinheiroCheque(this.statusCaixa);
    return valor;
  }

  RetirarValor(): void {
    if (!(this.valorRetirar > 0)) {
      this.restError = 'Valor inválido';
      return;
    }

    this.restError = null;
    this.caixaService
      .RetirarValor(this.valorRetirar)
      .subscribe(
      (response) => console.log(response),
      (err) => { this.handleError(err); },
      () => { this.GoBack(); }
      );
  }

  private handleError(error: GenericResponse) {
    this.restError = error.message;

    window.scrollTo(0, 0);
  }

  private GoBack() {
    this.router.navigate(['venda-balcao']);
  }
}
