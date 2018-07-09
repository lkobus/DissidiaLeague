import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificacaoComponent } from './notificacao.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'timeline-notif', component: NotificacaoComponent },
        ])
    ],
    exports: [RouterModule]
})
export class NotificacaoRoutingModule {

}
