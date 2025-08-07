# Digital Library UI

This project is the front-end for a digital library application, built with Angular and secured with Keycloak.

## Keycloak Data Flow

1.  **Application Initialization (`main.ts` -> `app.config.ts` -> `keycloak-init.ts`)**

    *   The application starts with `main.ts`, which bootstraps the Angular application using the configuration defined in `app.config.ts`.
    *   `app.config.ts` provides the `KeycloakService` and sets up an `APP_INITIALIZER`. This initializer calls the `initializeKeycloak` function from `keycloak-init.ts`.
    *   `initializeKeycloak` configures the Keycloak instance with the server URL, realm, and client ID. It then calls the `init` method on the Keycloak instance.
    *   The `init` method, with the `onLoad: 'check-sso'` option, checks if the user is already logged in to the Keycloak server in the background.

2.  **Initial Page Load (`app.routes.ts`)**

    *   The application's routing is defined in `app.routes.ts`.
    *   The default route `'/'` redirects to `'/auth'`. The `AuthPage` is displayed, which is a public-facing page.

3.  **Navigating to a Protected Route (`app.routes.ts` -> `auth.guard.ts`)**

    *   When the user navigates to the `'/intro'` path, the `AuthGuard` is activated.
    *   The `canActivate` method in `AuthGuard` checks if the user is logged in using `this.keycloak.isLoggedIn()`.

4.  **Authentication Flow (`auth.guard.ts` -> Keycloak)**

    *   **If the user is logged in**, `isLoggedIn()` returns `true`, and the guard allows access to the `IntroPageComponent`.
    *   **If the user is not logged in**, `isLoggedIn()` returns `false`. The guard then calls `this.keycloak.login()`, which redirects the user to the Keycloak login page.

5.  **Post-Authentication (`Keycloak` -> `auth.guard.ts`)**

    *   After successful authentication on the Keycloak server, the user is redirected back to the application.
    *   The `redirectUri` is set to the originally requested URL (`/intro` in this case), so the user lands on the page they intended to visit.
    *   The `AuthGuard` runs again, but this time `isLoggedIn()` returns `true`, and the user can access the `IntroPageComponent`.


## Keycloak Integration

Authentication and authorization are handled by Keycloak. Here's a breakdown of how it's integrated into the application:

*   **`keycloak-init.ts`**: This file contains the core Keycloak configuration. It initializes the Keycloak service, connecting to the Keycloak server, realm, and client ID. It uses the `check-sso` option for the `onLoad` event, which checks if a user is already authenticated when the application loads.

*   **`app.config.ts`**: This file registers the Keycloak service with the Angular application. It uses an `APP_INITIALIZER` to ensure that the Keycloak initialization process is completed before the application fully bootstraps.

*   **`auth.guard.ts`**: This route guard protects application routes. Before a user can access a protected route, the guard checks if they are logged in. If they are not, it redirects them to the Keycloak login page.

### Keycloak Versioning (keycloak-js)

This project uses `keycloak-js` version `26.2.0`. It's important to understand the versioning changes that were introduced with Keycloak 23.0.

Prior to version 23.0, the `keycloak-js` adapter was released in lockstep with the main Keycloak server. This meant that the version of the JavaScript adapter was tied to the version of the Keycloak server.

Starting with Keycloak 23.0, the `keycloak-js` adapter has been decoupled from the Keycloak server and is now released on its own schedule. This allows for more frequent updates and bug fixes for the adapter, independent of the server release cycle.

The version of `keycloak-js` was jumped from 22.x to 26.2.0 to clearly signify this change. **There are no breaking functional changes between `keycloak-js` 22.x and 26.2.0.** The adapter remains backward compatible with all actively supported releases of the Keycloak server.
