import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccordionGroupComponent } from './debug/accordion/accordion-group';
import { AccordionComponent } from './debug/accordion/accordion';
import { DebugComponent } from './debug/debug-panel';
import { NotificationFactoryComponent } from './debug/notification-factory/notification-factory';
import { PortapiInspectorComponent } from './debug/portapi-inspector/portapi-inspector';
import { NavigationComponent } from './layout/navigation/navigation';
import { SideDashComponent } from './layout/side-dash/side-dash';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { SettingsComponent } from './pages/settings/settings';
import { WidgetSettingsOutletComponent } from './pages/widget-settings-outlet/widget-settings-outlet';
import { BasicSettingComponent } from './shared/config/basic-setting/basic-setting';
import { FilterListComponent } from './shared/config/filter-list/filter-list';
import { FilterListItemComponent } from './shared/config/filter-list/list-item';
import { GenericSettingComponent } from './shared/config/generic-setting/generic-setting';
import { SecuritySettingComponent } from './shared/config/security-setting/security-setting';
import { DropDownItemComponent, DropDownValueDirective } from './shared/dropdown/dropdown-item';
import { DropdownComponent } from './shared/dropdown/dropdown';
import { ExpertiseComponent } from './shared/expertise/expertise-switch';
import { ExpertiseDirective } from './shared/expertise/expertise-directive';
import { NotificationComponent } from './shared/notification/notification';
import { SubsystemComponent } from './shared/subsystem/subsystem';
import { ToggleSwitchComponent } from './shared/toggle-switch/toggle-switch';
import { StatusWidgetComponent, StatusWidgetSettingsComponent } from './widgets/status-widget';
import { WIDGET_DEFINTIONS } from './widgets/widget.types';

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    DebugComponent,
    AccordionComponent,
    AccordionGroupComponent,
    NotificationFactoryComponent,
    PortapiInspectorComponent,
    SubsystemComponent,
    BasicSettingComponent,
    GenericSettingComponent,
    SecuritySettingComponent,
    SettingsComponent,
    DashboardComponent,
    SideDashComponent,
    NavigationComponent,
    ExpertiseComponent,
    ExpertiseDirective,
    DropdownComponent,
    DropDownItemComponent,
    DropDownValueDirective,
    WidgetSettingsOutletComponent,
    StatusWidgetComponent,
    StatusWidgetSettingsComponent,
    ToggleSwitchComponent,
    FilterListComponent,
    FilterListItemComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    OverlayModule,
    PortalModule,
    DragDropModule,
  ],
  providers: [
    {
      provide: WIDGET_DEFINTIONS,
      useValue: {
        type: 'status-widget',
        name: 'Demo Widget',
        settingsComponent: StatusWidgetSettingsComponent,
        widgetComponent: StatusWidgetComponent,
      },
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
