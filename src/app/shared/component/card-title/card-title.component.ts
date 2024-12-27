import { Component, Input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-card-title',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './card-title.component.html',
})
export class CardTitleComponent {
  @Input()
  title: string;
  @Input()
  secondaryTemplate: TemplateRef<any>;
}
