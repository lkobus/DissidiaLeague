import { NgModule } from "@angular/core";
import { ManuntencaoFrequenciaComponent } from "./manuntencao-frequencia.component";
import { ManuntencaoFrequenciaRoutingModule } from "./manuntencao-frequencia.routing";
//import { MdButtonModule, MdCheckboxModule } from '@angular/material';
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { SharedMaskModule } from "../shared-mask/shared-mask.module";
import { SharedModule } from "../shared/shared.module";
import { NguiMapModule } from "@ngui/map";
import { DragulaModule } from "ng2-dragula";
import { ManuntencaoFrequenciaService } from "./shared/manuntencao-frequencia.service";
import { ContagemFrequenciaDTO } from "./dto/contagem-frequencia-dto";
import { ModalModule } from "ngx-modal";
import { ClienteService } from "../_services/cliente.service";
import { BusyModule, BusyConfig } from "angular2-busy";
import { FileSaverModule } from "ngx-filesaver";
import { ImageUploadModule } from "./../angular2-image-upload/index";
import { MatButtonModule, MatCheckboxModule } from "@angular/material";
import { UiSwitchModule } from "../_directives/switch/ui-switch.module";
import { NguiAutoCompleteModule } from "@ngui/auto-complete";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    DragulaModule,
    FormsModule,
    HttpModule,
    NguiAutoCompleteModule,
    SharedMaskModule,
    SharedModule,
    BusyModule.forRoot(
      new BusyConfig({
        message: "Aguarde...",
        backdrop: true,
        template:
          '<div class="loading-overlay">' +
          '<img src="assets/logo-promax-blue.png" alt="logo Promax" width="123" height="15" class="img-loader" />' +
          '<div class="spinner">' +
          '<div class="bounce1"></div>' +
          '<div class="bounce2"></div>' +
          '<div class="bounce3"></div>' +
          "</div>" +
          '<h1 class="loading-venda">' +
          "{{message}}" +
          "</h1>" +
          "</div>",
        delay: 0,
        minDuration: 1000,
        wrapperClass: "ng-busy"
      })
    ),
    MatButtonModule,
    MatCheckboxModule,
    UiSwitchModule,
    NguiMapModule,
    UiSwitchModule,
    ModalModule,
    FileSaverModule,
    ImageUploadModule.forRoot(),
    ManuntencaoFrequenciaRoutingModule
  ],
  declarations: [ManuntencaoFrequenciaComponent],
  exports: [ManuntencaoFrequenciaComponent],
  providers: [ManuntencaoFrequenciaService, ClienteService]
})
export class ManuntencaoFrequenciaModule {}
