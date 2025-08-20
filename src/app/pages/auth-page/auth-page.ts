import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css'
})
export class AuthPage {
  constructor(private readonly keycloak: KeycloakService) {}

  public login(): void {
    this.keycloak.login({
      redirectUri: window.location.origin + '/intro'
    });
  }

  public register(): void {
    this.keycloak.register({
      redirectUri: window.location.origin + '/intro'
    });
  }
}
