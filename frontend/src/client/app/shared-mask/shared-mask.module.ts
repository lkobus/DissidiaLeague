
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { KzCnpjValidatorDirective} from './directives/kz-cnpj.directive'
import { KzCpfValidatorDirective} from './directives/kz-cpf.directive'
import { KzCpfCnpjValidatorDirective} from './directives/kz-cpf-cnpj.directive'
import { KzMaskDirective} from './directives/masked-input/kz-mask.directive'
import { KzMaskCurrencyDirective} from './directives/masked-input/kz-mask-currency.directive'
import { KzCepPipe} from './pipes/kz-cep.pipe'
import { KzCnpjPipe} from './pipes/kz-cnpj.pipe'
import { KzCpfCnpjPipe} from './pipes/kz-cpf-cnpj.pipe'
import { KzCpfPipe} from './pipes/kz-cpf.pipe'

@NgModule({
  imports:      [ 
  	CommonModule,
  	FormsModule 
  ],
  declarations: [ 
  	KzCepPipe,
  	KzCpfPipe,
  	KzCnpjPipe,
  	KzCpfCnpjPipe,
  	KzCpfValidatorDirective,
  	KzCnpjValidatorDirective, 
  	KzCpfCnpjValidatorDirective,
    KzMaskDirective,
		KzMaskCurrencyDirective
	],
  exports: [ 
  	KzCepPipe,
  	KzCpfPipe,
  	KzCnpjPipe,
  	KzCpfCnpjPipe,
  	KzCpfValidatorDirective,
  	KzCnpjValidatorDirective, 
  	KzCpfCnpjValidatorDirective,
    KzMaskDirective,
    KzMaskCurrencyDirective,
    CommonModule, 
    FormsModule 
  ]
})
export class SharedMaskModule {
}