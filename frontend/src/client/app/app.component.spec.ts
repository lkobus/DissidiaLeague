import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import {
  async
} from '@angular/core/testing';
import {
  Route
} from '@angular/router';
import {
  RouterTestingModule
} from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { VendaBalcaoComponent } from './venda-balcao/venda-balcao.component';
import { VendaExternaComponent } from './venda-externa/venda-externa.component';
import { EstoqueComponent } from './estoque/estoque.component';
import { RetornoComponent } from './retorno/retorno.component';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { NavbarLeftComponent } from './shared/navbar-left/navbar-left.component';

export function main() {

  describe('App component', () => {

    let config: Route[] = [
      { path: '', component: HomeComponent },
      { path: 'venda-balcao', component: VendaBalcaoComponent }
    ];
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterTestingModule.withRoutes(config)],
        declarations: [TestComponent, ToolbarComponent,
          NavbarComponent, AppComponent,
          HomeComponent, NavbarLeftComponent, VendaBalcaoComponent, VendaExternaComponent, EstoqueComponent, RetornoComponent],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' }
        ]
      });
    });

    it('should build without a problem',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let compiled = fixture.nativeElement;

            expect(compiled).toBeTruthy();
          });
      }));
  });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-app></sd-app>'
})

class TestComponent {
}



