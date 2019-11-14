import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AuthKakaoService } from './auth.kakao.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-kakao-platform',
  templateUrl: './kakao-platform.component.html',
  styleUrls: ['./kakao-platform.component.scss'],
})
export class KakaoPlatformComponent implements OnInit {

  private app_key:string = environment.kakao.restAPIKey;
  private redirect_uri:string = window.location.origin + '/kakaoCallback';
  kakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${this.app_key}&redirect_uri=${this.redirect_uri}&response_type=code`;

  kakaoLoginImgUrl: string = "../../assets/kakao_account_login_btn_medium_narrow.png";
  constructor(private kakaoService: AuthKakaoService) { }

  ngOnInit() {}

  kakaoLogin() {
    Plugins.Browser.open({url: this.kakaoUrl});
  }
}
