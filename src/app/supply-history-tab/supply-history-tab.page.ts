import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supply-history-tab',
  templateUrl: 'supply-history-tab.page.html',
  styleUrls: ['supply-history-tab.page.scss']
})
export class SupplyHistoryTabPage {
  title: string = '불출내역';

  constructor(
    public actionSheetController: ActionSheetController, 
    private router: Router
    ) { }

  ionViewWillEnter() {
  }

  navigate(mode: string) {
    console.log(this.router.routerState.snapshot.url);
    this.router.navigateByUrl('/tabs/supply-history/'+mode)
  }

  async openActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: this.title,
      buttons: [{
        text: '날짜로 검색',
        icon: 'clock',
        handler: () => this.navigate('daily')
      },
      {
        text: '소모품으로 검색',
        icon: 'build',
        handler: () => this.navigate('device')
      },
      {
        text: '취소',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
