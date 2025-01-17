// angular import
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Add this
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './theme/shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule, BrowserAnimationsModule,  HttpClientModule ],
  bootstrap: [AppComponent]
})
export class AppModule {}
