import { Component } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';


/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'emplacamento',
  templateUrl: 'emplacamento.component.html',
  animations: [
    trigger(
      'myAnimation',
      [
        transition(
          ':enter', [
            style({transform: 'translateX(100%)', opacity: 0}),
            animate('500ms', style({transform: 'translateX(0)', 'opacity': 1}))
          ]
        ),
        transition(
          ':leave', [
            style({transform: 'translateX(0)', 'opacity': 1}),
            animate('500ms', style({transform: 'translateX(100%)', 'opacity': 0}))
          ]
        )]
    )
  ],
})
export class EmplacamentoComponent { }
