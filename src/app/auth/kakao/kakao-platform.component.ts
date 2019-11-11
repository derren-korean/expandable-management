import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AuthKakaoService } from './auth.kakao.service';
import { environment } from '../../../environments/environment';
import '../../../assets/js/kakao.min.js';
declare const Kakao: any;

@Component({
  selector: 'app-kakao-platform',
  templateUrl: './kakao-platform.component.html',
  styleUrls: ['./kakao-platform.component.scss'],
})
export class KakaoPlatformComponent implements OnInit {

  kakaoLoginImgUrl: string = "../../assets/kakao_account_login_btn_medium_narrow.png";
  constructor(private kakaoService: AuthKakaoService) { }

  ngOnInit() {
    Kakao.init(environment.kakao.javaScriptKey);
  }

  onKakaoLogin() {
    this.kakaoService.login();
  }
}
