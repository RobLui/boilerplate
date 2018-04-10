/*
 In this file we are going to import all `@delen` specific packages.
 What do we need:
 - The exported module of the package
*/

import { NgModule } from '@angular/core';

import { BdActionSliderModule } from '@delen/bd-action-slider';
import { BdAvatarModule } from '@delen/bd-avatar';
import { BdBackdropModule } from '@delen/bd-backdrop';
import { BdButtonGroupModule } from '@delen/bd-button-group';
import { BdCheckboxModule } from '@delen/bd-checkbox';
import { BdCoachmarkModule } from '@delen/bd-coachmark';
import { BdDialogModule } from '@delen/bd-dialog';
import { BdFormModule } from '@delen/bd-form';
import { BdInfiniteScrollModule } from '@delen/bd-infinite-scroll';
import { BdKeypadModule } from '@delen/bd-keypad';
import { BdLineChartModule } from '@delen/bd-line-chart';
import { BdMenuModule } from '@delen/bd-menu';
import { BdNumberModule } from '@delen/bd-number';
import { BdOverlayPlaceholderModule } from '@delen/bd-overlay-placeholder';
import { BdPanelSliderModule } from '@delen/bd-panel-slider';
import { BdPieChartModule } from '@delen/bd-pie-chart';
import { BdPincodeModule } from '@delen/bd-pincode';
import { BdPopupModule } from '@delen/bd-popup';
import { BdPortfolioHeaderModule } from '@delen/bd-portfolio-header';
import { BdPullToRefreshModule } from '@delen/bd-pull-to-refresh';
import { BdScrollModule } from '@delen/bd-scroll';
import { BdSectionsModule } from '@delen/bd-sections';
import { BdSelectModule } from '@delen/bd-select';
import { BdSelectionListModule } from '@delen/bd-selection-list';
import { BdTabbarModule } from '@delen/bd-tabbar';
import { BdTableModule } from '@delen/bd-table';
import { BdTileModule } from '@delen/bd-tile';
import { BdToastModule } from '@delen/bd-toast';
import { BdToggleModule } from '@delen/bd-toggle';
import { BdUtilitiesModule } from '@delen/bd-utilities';
import { BdVerticalBarChartModule } from '@delen/bd-vertical-bar-chart';
import { BdViewModule } from '@delen/bd-view';
import { BdWorldModule } from '@delen/bd-world';

@NgModule({
    exports: [
        BdActionSliderModule,
        BdAvatarModule,
        BdBackdropModule,
        BdButtonGroupModule,
        BdCheckboxModule,
        BdCoachmarkModule,
        BdDialogModule,
        BdFormModule,
        BdInfiniteScrollModule,
        BdKeypadModule,
        BdLineChartModule,
        BdMenuModule,
        BdNumberModule,
        BdOverlayPlaceholderModule,
        BdPanelSliderModule,
        BdPieChartModule,
        BdPincodeModule,
        BdPopupModule,
        BdPortfolioHeaderModule,
        BdPullToRefreshModule,
        BdScrollModule,
        BdSectionsModule,
        BdSelectModule,
        BdSelectionListModule,
        BdTabbarModule,
        BdTableModule,
        BdTileModule,
        BdToastModule,
        BdToggleModule,
        BdUtilitiesModule,
        BdVerticalBarChartModule,
        BdViewModule,
        BdWorldModule
    ]
})
export class BdPackagesModule {
}
