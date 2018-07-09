import { FormsModule, NgModel, Form, AbstractControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Questionario, CaixaStatus, QuestionarioOpcoes, GenericResponse } from '../../_model/index';
import { CaixaService } from '../../_services/caixa.service';
import { AlertService } from '../../_services/alert.service';
import { SharedMaskModule } from '../../shared-mask/shared-mask.module';
import { Modal } from 'ngx-modal';

@Component({
  moduleId: module.id,
  selector: 'fechamento-caixa',
  templateUrl: 'fechamento-caixa.component.html'
})
export class VendaExternaFecharComponent implements OnInit {
  @ViewChild('modalSobra') modalSobra: Modal;

  checklistFechamento: Questionario[];
  valorFechamento: number;
  restError: any;
  statusCaixa: CaixaStatus;
  constructor(
    private caixaService: CaixaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.IniciarFechamentoCaixa();
  }

  IniciarFechamentoCaixa() {
    this.restError = null;
    this.caixaService.GetChecklistFechamento()
      .flatMap((data) => {
        this.checklistFechamento = data;
        return this.caixaService.GetStatusCaixa();
      })
      .flatMap((statusCaixa: CaixaStatus) => {
        this.statusCaixa = statusCaixa;
        if (this.statusCaixa) {
          let valor = CaixaStatus.GetSaldoDinheiroCheque(this.statusCaixa);
          this.valorFechamento = valor;
        }
        return Observable.of(true);
      })
      .subscribe(
      (data) => console.log(data),
      (error) => this.handleError
      );
  }

  GetSaldoDinheiro(): number {
    let valor = CaixaStatus.GetSaldoDinheiroCheque(this.statusCaixa);
    return valor;
  }

  private hasSobraCaixa(): boolean {
    return this.valorFechamento < this.GetSaldoDinheiro();
  }

  FecharCaixa(validaValor: boolean, form: AbstractControl): void {
    if (!form.valid) {
      console.log('Form is invalid');
      return
    }

    if (!this.valorFechamento || this.valorFechamento <= 0) {
      this.valorFechamento = 0;
    }

    if (validaValor && this.hasSobraCaixa()) {
      this.modalSobra.open();
      return
    }

    this.modalSobra.close();
    this.caixaService.FecharCaixa(this.valorFechamento)
      .subscribe(
      (data) => console.log(data),
      (error) => { this.handleError(error); },
      () => this.goBack()
      );
  }

  goBack(): void {
    this.router.navigate(['venda-balcao']);
  }

  private handleError(error: GenericResponse) {
    console.error('An error occurred', error);
    if (error.message) {
      this.restError = error.message;
    }

    window.scrollTo(0, 0);
  }
}
