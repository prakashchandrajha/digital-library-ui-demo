import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { HeaderComponent } from "../shared/header/header.component";
import { CategoryComponent } from "../category-component/category-component";
import { DigitalLibaryAboutComponent } from "../digital-libary-about-component/digital-libary-about-component";

@Component({
  selector: 'app-intro-page',
  standalone: true,
  imports: [HeaderComponent, CategoryComponent, DigitalLibaryAboutComponent],
  templateUrl: './intro-page.html',
  styleUrls: ['./intro-page.css']
})
export class IntroPageComponent {
  constructor(private readonly keycloak: KeycloakService) {}

  public logout(): void {
    this.keycloak.logout(window.location.origin + '/auth');
  }
}
