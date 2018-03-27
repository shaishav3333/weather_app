import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from '@angular/http';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import {WeatherReport} from './weather/weather.report.component';
import {HTTPSerivce} from './httpServices/http.service'
@NgModule({
  declarations: [
    AppComponent,
    WeatherReport
  ],
  imports: [
    AgmCoreModule.forRoot({
      libraries: ["places"]
    }),
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    FormsModule,
    JsonpModule
  ],
  providers: [HTTPSerivce],
  bootstrap: [AppComponent]
})
export class AppModule { }
