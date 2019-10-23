import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'supply',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../supply-tab/supply-tab.module').then(m => m.SupplyTabPageModule)
          }
        ]
      },
      {
        path: 'supply-history',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../supply-history-tab/supply-history-tab.module').then(m => m.SupplyHistoryTabPageModule)
          }
        ]
      },
      {
        path: 'failure-history',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../failure-history-tab/failure-history-tab.module').then(m => m.FailureHistoryTabPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/supply',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/supply',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
