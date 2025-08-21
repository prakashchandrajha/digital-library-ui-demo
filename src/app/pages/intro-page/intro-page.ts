import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { HeaderComponent } from "../shared/header/header.component";
import { CategoryComponent } from "../category-component/category-component";
import { DigitalLibaryAboutComponent } from "../digital-libary-about-component/digital-libary-about-component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../shared/footer/footer.component";

@Component({
  selector: 'app-intro-page',
  standalone: true,
  imports: [HeaderComponent, CategoryComponent, DigitalLibaryAboutComponent, CommonModule, FooterComponent],
  templateUrl: './intro-page.html',
  styleUrls: ['./intro-page.css']
})
export class IntroPageComponent {
  constructor(private readonly keycloak: KeycloakService) {}


   profileIcons = [
    { img: '../../../assets/images/c2.png', position: 'left-[45px] -top-[4px]' },
    { img: '../../../assets/images/c3.png', position: 'right-[45px] -top-[4px]' },
    { img: '../../../assets/images/c6.png', position: '-left-4 top-20' },
    { img: '../../../assets/images/c7.png', position: '-right-4 top-20' },
    { img: '../../../assets/images/c3.png', position: 'bottom-8 -left-0' },
    { img: '../../../assets/images/c2.png', position: 'bottom-8 -right-0' },
    { img: '../../../assets/images/c6.png', position: 'right-[40%] -bottom-4' }
  ];

  centerImage = '../../../assets/images/c4.png';

  public logout(): void {
    this.keycloak.logout(window.location.origin + '/auth');
  }
}
