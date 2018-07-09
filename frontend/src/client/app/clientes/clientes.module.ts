import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesComponent } from './clientes.component';
import { ClienteDetailComponent } from './cliente-detail.component';
import { ClientesRoutingModule } from './clientes-routing.module';
import { FrequenciaVisitaModule } from '../frequencia-visita/frequencia-vista.module';
import { SharedModule } from '../shared/shared.module';
import { ClienteService } from '../_services/cliente.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-modal';
import { ImageUploadModule } from './../angular2-image-upload/index.js';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { FileSaverModule } from 'ngx-filesaver';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { CsvDownloaderComponent } from '../shared/csv-downloader.component';
import { NguiMapModule } from '@ngui/map';
import { UiSwitchModule } from '../_directives/switch/ui-switch.module';
import { ModalConfirmacaoModule } from '../_directives/modal-confirmacao/modal-confirmacao.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ClientesRoutingModule,
    FrequenciaVisitaModule,
    NgxPaginationModule,
    MatButtonModule,
    MatCheckboxModule,
    FileSaverModule,
    ImageUploadModule.forRoot(),
    SharedMaskModule,
    ModalModule,
    NguiMapModule,
    UiSwitchModule,
    ModalConfirmacaoModule
  ],
  declarations: [ClientesComponent, ClienteDetailComponent],
  exports: [ClientesComponent, ClienteDetailComponent],
  providers: [ClienteService]
})
export class ClientesModule { }
