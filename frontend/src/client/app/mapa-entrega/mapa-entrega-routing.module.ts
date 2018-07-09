import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MapaEntregaComponent } from './mapa-entrega.component';
import { MapaEntregaResumoComponent } from './mapa-entrega-resumo.component';
import { MapaEntregaDetailComponent } from './mapa-entrega-detail.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'entrega/mapa', component: MapaEntregaComponent },
            { path: 'entrega/mapa/resumo', component: MapaEntregaResumoComponent },
            { path: 'entrega/mapa/detail/:id', component: MapaEntregaDetailComponent }
        ])
    ],
    exports: [RouterModule]
})
export class MapaEntregaRoutingModule { }
