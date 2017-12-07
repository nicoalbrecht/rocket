//Angular Specific Imports

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterConfig } from './shared/routing/router-config.component';

// Angular Material Imports

import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material";

//Custom Imports

import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { HomeComponent } from './home/home.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { QueryLoaderComponent } from './query-loader/query-loader.component';
import { QueryPageComponent } from './query-page/query-page.component';
import { QueryEditorComponent } from './query-editor/query-editor.component';
import { DynamicInputComponent } from './dynamic-input/dynamic-input.component';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    MainFooterComponent,
    HomeComponent,
    ErrorPageComponent,
    QueryBuilderComponent,
    QueryLoaderComponent,
    QueryPageComponent,
    QueryEditorComponent,
    DynamicInputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(RouterConfig),
    MatMenuModule,
    MatToolbarModule,
    MatGridListModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    HighlightJsModule
  ],
  providers: [
    HighlightJsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
