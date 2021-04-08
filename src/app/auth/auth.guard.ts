import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AngularFireAuth } from  "@angular/fire/auth";
import { Observable, from } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AngularFireAuth,
    public authService: AuthService,
    public router: Router
  ){ }

  // canActivate(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<boolean> {
	// 	return this.auth.user
	// 		.pipe(
  //       take(1),
  //       map(state => !!state),
  //       tap(authenticated => {
  //         console.log("auth.guard", authenticated);
  //         if (!authenticated) {
  //           this.router.navigate(['/login'], {
  //             queryParams: {
  //               return: routerState.url
  //             }
  //           });
  //         }
  //       }),
  //     );
	// }

  // canActivate(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<boolean> {
	// 	return from(this.auth.authState)
	// 		.pipe(
  //       take(1),
  //       map(state => !!state),
  //       tap(authenticated => {
  //         console.log("auth.guard", authenticated);
  //         if (!authenticated) {
  //           this.router.navigate(['/login'], {
  //             queryParams: {
  //               return: routerState.url
  //             }
  //           });
  //         }
  //       }),
  //     );
	// }

  canActivate(
    next: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return (async () => {
      console.log("canActivate from auth.guard");
      const rawUser = localStorage.getItem("user");
      if (rawUser && JSON.parse(rawUser)) {
        return true;
      }


      if ((await this.authService.isVerifiedUser) !== true) {
        console.log("Safe guarding to login");
        this.router.navigate(['/login'], {
          queryParams: {
            return: routerState.url
          }
        });
        return false;
      }
      return true;
    })();
  }

}
