import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { HeaderComponent } from "../shared/header/header.component";
import { HomePageComponent } from "../home-page/home-page.component";

@Component({
  selector: 'app-intro-page',
  standalone: true,
  imports: [HeaderComponent, HomePageComponent],
  templateUrl: './intro-page.html',
  styleUrls: ['./intro-page.css']
})
export class IntroPageComponent {
  constructor(private readonly keycloak: KeycloakService) {}

  public logout(): void {
    this.keycloak.logout(window.location.origin + '/auth');
  }
}
