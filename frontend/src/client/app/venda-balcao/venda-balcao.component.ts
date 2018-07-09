import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CaixaStatus, GenericResponse } from '../_model/index';
import { Questionario, QuestionarioOpcoes } from '../_model/checklist.caixa';
import { CaixaService } from '../_services/caixa.service';
import { AlertService } from '../_services/alert.service';
import { VendaBalcaoService } from '../venda-balcao/services/venda-balcao.service';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { PuxadaService } from '../puxada/services/puxada.service';
import { Estoque } from '../estoque/model/estoque';
import { EstoqueService } from '../estoque/services/estoque.service';
import { ExportModalComponent, FiltroRange } from '../_directives/export-modal/export-modal.component';
import { IMyDateRange } from 'mydatepicker';
import { FileSaverService } from 'ngx-filesaver';
import { ToastService } from '../_services/toast.service';

@Component({
  moduleId: module.id,
  selector: 'venda-balcao',
  templateUrl: 'venda-balcao.component.html',
  styleUrls: ['venda-balcao.component.css']
})
export class VendaBalcaoComponent implements OnInit {

  @ViewChild(ExportModalComponent)
  private exportModalComponent: ExportModalComponent;

  restError: any;
  statusCaixa: CaixaStatus;
  produtosEstoque: Estoque[];
  showLoading: boolean = false;

  constructor(private caixaService: CaixaService,
    private estoqueService: EstoqueService,
    private puxadaService: PuxadaService,
    private vendaBalcaoService: VendaBalcaoService,
    private fileSaverService: FileSaverService,
    private toastService: ToastService,
    private router: Router) {
    this.caixaService.statusCaixaEmitter.subscribe((data) => this.statusCaixa = data);
  }

  ngOnInit(): void {
    this.caixaService.GetStatusCaixa().subscribe(
      (data) => { },
      (err: any) => this.handleError(err)
    );
    this.GetEstoque();
  }

  private handleError(error: GenericResponse) {
    if (error.message) {
      this.restError = error.message;
      console.log('restError => ' + this.restError);
    }

    window.scrollTo(0, 0);
  }

  GetEstoque() {
    this.estoqueService.getEstoqueBalcaoTodos().toPromise()
      .then(data => this.produtosEstoque = data)
      .catch(err => this.handleError(err));
  }

  IsEstoqueBaixo(estoque: Estoque): boolean {
    return estoque.Quantidade <= estoque.EstoqueMinimo;
  }

  onChangeOrderFilter(event) {
    console.log(event);
    this.produtosEstoque = this.produtosEstoque.sort((a, b) => {
      return a.Quantidade > b.Quantidade ? event : (event * - 1);
    });
  }

  exportarCsv(filtroRange: FiltroRange): void {
    this.showLoading = true;
    this.vendaBalcaoService.exportar(filtroRange)
      .subscribe(data => {
        if ((<any>data)._body != null) {
          this.fileSaverService.save((<any>data)._body, 'venda-balcao.csv');
        } else {
          this.toastService.errorNotification('Atenção', 'Houve uma falha durante a exportação.');
        }

        this.showLoading = false;
      });
  }


}