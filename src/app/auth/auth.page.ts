import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import { AuthKakaoService } from './kakao/auth.kakao.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit, OnDestroy {

  private subscription: Subscription;
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private kakaoService: AuthKakaoService
  ) { }

  ngOnInit() {
    this.subscription = this.kakaoService.loginWithKakao().subscribe((kakaoUser: { email: string, pw: string }) => {
      if (kakaoUser) {
        let authObs: Observable<AuthResponseData>;
        this.authService.login(kakaoUser.email, kakaoUser.pw).subscribe(
          hasAccount => {
            this.isLogin = true;
          },
          noAccount => {
            this.isLogin = false;
          }).add(complete => {
            this.authenticate(kakaoUser.email, kakaoUser.pw);
          })
      }
    }).add(
      this.kakaoService.kakaoCode.subscribe(code => {
        if (code) {
          console.log(code);
        }
      })
    )
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: '로그인 하고 있습니다...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(
          resData => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.authService.isAuthorized().subscribe(isAuthorized => {
              if (!isAuthorized) {
                this.authService.logout();
                this.showAlert('접속 승인 후 사용하세요~');
                this.router.navigateByUrl('auth');
                return;
              }
              this.router.navigateByUrl('tabs/supply');
            })
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = '회원가입이 이루어지지 않았습니다. 잠시 후 시도하세요.';
            if (code === 'EMAIL_EXISTS') {
              message = '누가 사용하고 있는 메일이군요!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = '가입한 주소를 사용해주세요.';
            } else if (code === 'INVALID_PASSWORD') {
              message = '비번 틀려염.'
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: '인증 실패',
        message: message,
        buttons: ['확인']
      })
      .then(alertEl => alertEl.present());
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
