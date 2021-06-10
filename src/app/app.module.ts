import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbdSortableHeader } from "./sortable.directive";
import { HttpClientModule } from "@angular/common/http";
import { DecimalPipe } from "@angular/common";
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [AppComponent, NgbdSortableHeader, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [DecimalPipe],
  exports: [AppComponent, NgbdSortableHeader],
  bootstrap: [AppComponent],
})
export class AppModule {}
