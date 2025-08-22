import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-digital-libary-about-component',
  imports: [CommonModule],
  templateUrl: './digital-libary-about-component.html',
  styleUrl: './digital-libary-about-component.css'
})
export class DigitalLibaryAboutComponent {
   @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() description: string = '';
  @Input() features: string[] = [];
  @Input() image: string = '';
  @Input() highlightValue: string = '';
  @Input() highlightLabel: string = '';
  @Input() reverse: boolean = false; // for flipping layou
@Input() titleClass: string = 'bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent';
@Input() subtitleClass: string = 'font-medium tracking-wider text-red-500';
@Input() descClass: string = 'mt-8 text-lg md:text-xl font-light text-gray-600 leading-relaxed';

}
