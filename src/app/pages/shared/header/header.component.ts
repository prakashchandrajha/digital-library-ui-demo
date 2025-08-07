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
  
   showLogout = false;

   @Output() triggerParent = new EventEmitter<void>();

  buttonClicked() {
  this.triggerParent.emit();
  }


  toggleLogout() {
    this.showLogout = !this.showLogout;
  }

  logout() {
    this.triggerParent.emit();
  }
}
