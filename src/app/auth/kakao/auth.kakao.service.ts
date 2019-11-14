import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';

import '../../../assets/js/kakao.min.js';

//todo : android/iOS
const { Browser } = Plugins;

declare const Kakao: any;

interface KakaoAuth {
  access_token: string,
  refresh_token: string,
  token_type: string,
  expires_in: number,
  scope: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthKakaoService {

  private _kakao = new BehaviorSubject<{ email: string, pw: string }>(null);
  private _kakaoCode = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { }

  async openURL(url) {
    await Browser.open({ 'url': url });
  }

  get kakaoCode() {
    return this._kakaoCode.asObservable();
  }

  setKakaoCode(code: string)  {
    this._kakaoCode.next(code);
  }

  loginWithKakao() {
    return this._kakao.asObservable();
  }

  login() {
    Kakao.Auth.login({
      success: authInfo => {
        Kakao.API.request({
          url: '/v2/user/me',
          success: (userProfile: { id: number, kakao_account: {}, properties: {} }) => {
            this._kakao.next(
              {
                email: `${userProfile.id}@derren.com`,
                pw: `${userProfile.id}`
              }
            );
          },
          fail: err => {
            console.log(err);
          }
        })
      },
      fail: err => {
        console.log(JSON.stringify(err));
      }
    });
  }
}
