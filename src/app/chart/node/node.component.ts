import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Node } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
    selector: '[appNode]',
    template: `
      <svg:circle
        [ngClass]="type"
        [attr.d]="lineString"
        [style.fill]="fill">
      </svg:path>
    `,
    styleUrls: ['./line.component.css']
  })
export class NodeComponent {
  @Input() node: Node;
}