import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  

   @Output() triggerParent = new EventEmitter<void>();

  buttonClicked() {
  this.triggerParent.emit();
  }

  logout() {
    this.triggerParent.emit();
  }
}
