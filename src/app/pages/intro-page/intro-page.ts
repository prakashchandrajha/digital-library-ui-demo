import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-intro-page',
  standalone: true,
  imports: [],
  templateUrl: './intro-page.html',
  styleUrls: ['./intro-page.css']
})
export class IntroPageComponent {
  constructor(private readonly keycloak: KeycloakService) {}

  public logout(): void {
    this.keycloak.logout();
  }
}