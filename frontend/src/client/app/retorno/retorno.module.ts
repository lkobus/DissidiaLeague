import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetornoComponent } from './retorno.component';
import { RetornoRoutingModule } from './retorno-routing.module';

@NgModule({
  imports: [CommonModule, RetornoRoutingModule],
  declarations: [RetornoComponent],
  exports: [RetornoComponent]
})
export class RetornoModule { }
