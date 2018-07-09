import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaEntregaComponent } from './mapa-entrega.component';
import { MapaEntregaResumoComponent } from './mapa-entrega-resumo.component';
import { MapaEntregaDetailComponent } from './mapa-entrega-detail.component';
import { MapaEntregaRoutingModule } from './mapa-entrega-routing.module';
import { MapaEntregaService } from './services/mapa-entrega.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ModalModule } from 'ngx-modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';
import { NguiMapModule } from '@ngui/map';
import { MyDatePickerModule } from 'mydatepicker';
import { MatDatepickerModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MapaEntregaRoutingModule,
        SharedModule,
        NguiMapModule,
        CurrencyMaskModule,
        ModalModule,
        NgxPaginationModule,
        MyDatePickerModule,
        MatDatepickerModule
    ],
    declarations: [MapaEntregaComponent, MapaEntregaResumoComponent, MapaEntregaDetailComponent],
    exports: [MapaEntregaComponent, MapaEntregaResumoComponent, MapaEntregaDetailComponent],
    providers: [MapaEntregaService]
})
export class MapaEntregaModule { }
