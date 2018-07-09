import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { FileSaverModule } from 'ngx-filesaver';
import { EstoqueComponent } from './estoque.component';
import { EstoqueTransferenciaComponent } from './estoque-transferencia.component';
import { EstoqueAtivosGiroComponent } from './estoque-ativos-giro.component';
import { EstoqueRoutingModule } from './estoque-routing.module';
import { EstoqueService } from './services/estoque.service';
import { ProdutosService } from '../produtos/shared/produtos.service';

@NgModule({
  imports: [
    CommonModule,
    EstoqueRoutingModule,
    NgxPaginationModule,
    FormsModule, ModalModule,
    FileSaverModule
  ],
  declarations: [EstoqueComponent, EstoqueTransferenciaComponent, EstoqueAtivosGiroComponent],
  exports: [EstoqueComponent, EstoqueTransferenciaComponent, EstoqueAtivosGiroComponent],
  providers: [EstoqueService, ProdutosService]
})
export class EstoqueModule { }
