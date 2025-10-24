import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HistoryPageComponent } from './pages/history-page/history-page.component';
import { SessionPageComponent } from './pages/session-page/session-page.component';
import { SessionCardComponent } from './components/session-card/session-card.component';
import { MetricsCardsComponent } from './components/metrics-cards/metrics-cards.component';

const routes: Routes = [
  { path: '', component: HistoryPageComponent },
  { path: ':id', component: SessionPageComponent }
];

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SessionCardComponent,
    MetricsCardsComponent
  ]
})
export class HistoryModule {}
