import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, tap, switchMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AuthKakaoService } from './kakao/auth.kakao.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router, private kakaoAuth: AuthKakaoService) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          if (window.location.pathname === '/kakaoCallback') {
            const code = window.location.search.substring(window.location.search.indexOf('=')+1);
            this.kakaoAuth.setKakaoCode(code);
          }
          this.router.navigateByUrl('/auth');
        }
        this.authService.isAuthorized().subscribe(isAuthorized => {
          if (!isAuthorized) {
            this.authService.logout();
            this.router.navigateByUrl('/auth')
          }
        })
      })
    );
  }
}
