import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './calendar/calendar.component';
import { MatCardModule} from '@angular/material/card'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EventDetailsComponent } from './event-details/event-details.component';
import { MatDialogModule } from '@angular/material/dialog'
import {MatSelectModule} from '@angular/material/select'
import {MatInputModule} from '@angular/material/input';
import { MatDatepickerModule} from '@angular/material/datepicker'
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventFormComponent } from './event-form/event-form.component';
import { EventListComponent } from './event-list/event-list.component';
import { MatTableModule} from '@angular/material/table'
import { MatRadioModule } from '@angular/material/radio'

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    EventDetailsComponent,
    EventFormComponent,
    EventListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatRadioModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
