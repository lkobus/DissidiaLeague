import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { PainelPerformanceComponent } from './painel-performance.component';
import { PainelPerformanceRoutingModule } from './painel-performance-routing.module';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { SharedModule } from '../shared/shared.module';
import { ModalModule } from 'ngx-modal';

import { AngularEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [CommonModule,
            AngularEchartsModule,
            PainelPerformanceRoutingModule,
            BrowserModule,
            FormsModule,
            HttpModule,
            SharedMaskModule,
            SharedModule,
            NgxPaginationModule,
            ModalModule],
  declarations: [PainelPerformanceComponent],
  exports: [PainelPerformanceComponent]

})
export class PainelPerformanceModule { }
