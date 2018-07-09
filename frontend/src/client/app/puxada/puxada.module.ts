import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuxadaComponent } from './puxada.component';
import { ProdutosRoutingModule } from './puxada-routing.module';
import { PuxadaService } from './services/puxada.service';

@NgModule({
  imports: [CommonModule, ProdutosRoutingModule],
  declarations: [PuxadaComponent],
  exports: [PuxadaComponent],
  providers: [PuxadaService]
})
export class PuxadaModule { }
