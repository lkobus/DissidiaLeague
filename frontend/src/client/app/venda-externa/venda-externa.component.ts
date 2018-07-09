import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CaixaStatus } from '../_model/caixa-status';
import { Questionario, QuestionarioOpcoes } from '../_model/checklist.caixa';
import { CaixaService } from '../_services/caixa.service';
import { AlertService } from '../_services/alert.service';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { BaseTableComponent } from '../shared/table/base-table-component';

@Component({
  moduleId: module.id,
  selector: 'venda-externa',
  templateUrl: 'venda-externa.component.html',
  styleUrls: ['venda-externa.component.css']
})
export class VendaExternaComponent extends BaseTableComponent implements OnInit {
  statusCaixa: CaixaStatus;
  activeStep: number;

  constructor(private CaixaService: CaixaService) {
    super();
  }

  ngOnInit(): void {
    this.CaixaService.statusCaixaEmitter.subscribe((data) => this.statusCaixa = data);
    this.CaixaService.GetStatusCaixa().subscribe();

    this.activeStep = 1;
  }
}
