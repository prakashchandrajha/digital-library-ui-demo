import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly keycloak: KeycloakService, private readonly router: Router) {}

  public async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (await this.keycloak.isLoggedIn()) {
      return true;
    }

    await this.keycloak.login({
      redirectUri: window.location.origin + state.url
    });

    return false;
  }
}