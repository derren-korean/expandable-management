import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx'

import { AuthKakaoService } from 'src/app/auth/kakao/auth.kakao.service';
import { environment } from '../../../environments/environment';
import '../../../assets/js/kakao.min.js';
declare const Kakao: any;

@Component({
  selector: 'app-kakao-callback',
  templateUrl: './kakao-callback.component.html',
  styleUrls: ['./kakao-callback.component.scss'],
})
export class KakaoCallbackComponent implements OnInit {

  private host:string = 'https://kauth.kakao.com'
  private redirectUri:string = window.location.origin+window.location.pathname;

  result = '';

  constructor(private kakaoService: AuthKakaoService, private http: HTTP) { }

  ngOnInit() {
    Kakao.init(environment.kakao.javaScriptKey);
    debugger;
    this.http.setHeader(this.host, 'Content-type','application/x-www-form-urlencoded;charset=utf-8');
    this.http.post('/oauth/token',
    {
      grant_type:	'authorization_code',
      client_id: environment.kakao.restAPIKey,
      redirect_uri: this.redirectUri,
      code: window.location.search.substring(window.location.search.indexOf('=')+1)
    },
    this.http.getHeaders).then(a=>console.log(this.result = JSON.stringify(a)));
  }

}
