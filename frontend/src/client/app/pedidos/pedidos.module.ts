import { NgModule, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { FileSaverModule } from "ngx-filesaver";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { SharedMaskModule } from "../shared-mask/shared-mask.module";
import { PedidosComponent } from "./pedidos.component";
import { PedidoDetailComponent } from "./pedido-detail.component";
import { PedidoOutrasOperacoesComponent } from "./pedido-outras-operacoes.component";
import { SharedModule } from "../shared/shared.module";
import { PedidosRouting } from "./pedidos.routing";
import { PedidoService } from "./services/pedido.service";
import { MyDatePickerModule } from "mydatepicker";
import { MatDatepickerModule, MatNativeDateModule } from "@angular/material";
import { ModalModule } from "ngx-modal";

@NgModule({
  imports: [
    CommonModule,
    PedidosRouting,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    FileSaverModule,
    CurrencyMaskModule,
    SharedMaskModule,
    MyDatePickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ModalModule
  ],
  declarations: [
    PedidosComponent,
    PedidoDetailComponent,
    PedidoOutrasOperacoesComponent
  ],
  exports: [
    PedidosComponent,
    PedidoDetailComponent,
    PedidoOutrasOperacoesComponent
  ],
  providers: [PedidoService]
})
export class PedidosModule {}
