import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { FestivalEvent } from '../event.interface';
import { EventFormComponent } from '../event-form/event-form.component';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { EventListComponent } from '../event-list/event-list.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'Decemeber',
  ];
  days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  currentMonth: number = new Date().getMonth(); // Returns Current Month - AUGUST
  currentYear = new Date().getFullYear(); //Returns CurrentYear - 2025
  monthDates: Date[] = []; //Array for storing the all the dates like previous, next and current month dates
  events: FestivalEvent[] = [];
  selectedValue: string = 'option1'; //Default options
  filteredDays: string[] = []; //filtered results based on query like week view, work week view and month view and week view
  currentDate: Date = new Date();
  options: Option[] = [
    //Mat Select Options
    { value: 'option1', label: 'Week' },
    { value: 'option2', label: 'Work Week' },
  ];
  calendarView: 'Month' | 'Week' = 'Month'; //options for seeing the calendar month wise or week wise
  weekStartDate: Date = new Date(); // Variable to find the starting date of any week

  constructor(public dialog: MatDialog, private eventService: EventsService) {}

  ngOnInit() {
    //Initial rendaering and finding the dates in the month and loading the events using service by get method
    this.generateMonthDates();
    this.loadEvents();
    this.filteredDays = this.days;
  }

  applyFilters(value: string) {
    if (value === 'option2') {
      //if work week is selected than it will filter out weekend dates and days
      this.filteredDays = this.days.filter(
        (day) => day !== 'Sunday' && day !== 'Saturday'
      );
    } else {
      this.filteredDays = this.days;
    }
    if (this.calendarView === 'Week') {
      //if the calendar's view is in week view it will get all the week dates else month dates
      this.generateWeekDates();
    } else {
      this.generateMonthDates();
    }
  }
  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (response) => {
        this.events = response;
      },
      error: (err) => {
        alert('Error occured while fetching events');
        console.error('Error fetching all events', err);
      },
    });
  }

  generateMonthDates() {
    const dates = [];
    const startDateOfMonth = new Date(this.currentYear, this.currentMonth, 1); //1 August

    const lastDateOfMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ); //31 Aug

    const startWeekDayOfMonth = startDateOfMonth.getDay(); //it returns what is the day on the start date of the month for eg. 1st Aug is on friday so it returns '5'
    if (this.selectedValue === 'option2') {
      //if work week is selected filter the dates to remove the weekend dates
      for (let i = startWeekDayOfMonth - 1; i >= 0; i--) {
        const date = new Date(this.currentYear, this.currentMonth, -i);
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          //Neglecting sunday-'0' and saturday-'6'
          dates.push(date); //filling cards with dates before starting date of current month like before 1st august 31,30,29 july
        }
      }

      for (
        let i = startDateOfMonth.getDate();
        i <= lastDateOfMonth.getDate();
        i++
      ) {
        const date = new Date(this.currentYear, this.currentMonth, i);
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          dates.push(date); //filling cards with dates of the current month like 1st august to 31st august
        }
      }

      let nextDay = 1;
      while (dates.length < 30) {
        const date = new Date(this.currentYear, this.currentMonth + 1, nextDay);
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          dates.push(date); //filling cards with dates after last date of current month like after 31st august 1,2,3 Sept
        }
        nextDay++;
      }
    } else {
      //if the selected view value is week than it generates all the dates inlcuding thd weekend's

      for (let i = startWeekDayOfMonth - 1; i >= 0; i--) {
        dates.push(new Date(this.currentYear, this.currentMonth, -i));
      }

      for (
        let i = startDateOfMonth.getDate();
        i <= lastDateOfMonth.getDate();
        i++
      ) {
        dates.push(new Date(this.currentYear, this.currentMonth, i));
      }

      for (let i = 1; i <= 6 - lastDateOfMonth.getDay(); i++) {
        dates.push(new Date(this.currentYear, this.currentMonth + 1, i));
      }
    }

    this.monthDates = dates;
  }

  generateWeekDates() {
    const weekDates = [];
    const startdate = new Date(this.weekStartDate);
    startdate.setDate(
      this.weekStartDate.getDate() - this.weekStartDate.getDay()
    );
    //sets date to start of the week for eg. weekStartDate is currentdate say 8 august and day is friday - '5'
    //so startdate will be 8 - 5 = 3 which is sunday and start date of that week.

    if (this.selectedValue === 'option2') {
      for (let i = 1; i <= 5; i++) {
        const start = new Date(startdate);
        start.setDate(startdate.getDate() + i);
        weekDates.push(start);
      }
    } else {
      for (let i = 0; i < 7; i++) {
        const start = new Date(startdate);
        start.setDate(startdate.getDate() + i);
        weekDates.push(start);
      }
    }
    this.currentMonth = startdate.getMonth(); //if the toggling between week comes to last week of the month and new month is to be rendered
    this.currentYear = startdate.getFullYear(); //if the toggling between week comes to last week of the year and new year is to be rendered
    this.monthDates = weekDates;
  }
  previousMonth() {
    //going to the previous month and also handles for if we reach to january month than it renders the previous year's decemember month
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateMonthDates();
  }

  nextMonth() {
    //going to the next month and also handles for if we reach to last month than it renders the next year's first month
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateMonthDates();
  }

  previousWeek() {
    //toggling previous weeks just by reducing the dates by 7
    this.weekStartDate.setDate(this.weekStartDate.getDate() - 7);
    this.generateWeekDates();
  }

  nextWeek() {
    //toggling next weeks just by adding the dates by 7
    this.weekStartDate.setDate(this.weekStartDate.getDate() + 7);
    this.generateWeekDates();
  }
  toggleWeek(date: Date) {
    //if the date card is clicked then the clicked date's week is opened
    if (this.calendarView === 'Month') {
      this.calendarView = 'Week';
      this.weekStartDate = new Date(date); //setting the date clicked to the weekstartdate variable which is used to find the start date of the week
      this.generateWeekDates();
    }
  }

  openEventForm(event$: MouseEvent, event?: FestivalEvent,) {
    event$.stopPropagation();
    //adding new event form using the material dialog
    const dialog = this.dialog.open(EventFormComponent, {
      width: '400px',
      data: event
        ? { ...event, date: new Date(event.date) }
        : { eventName: '', eventType: '', date: '', desc: '' },
    });

    dialog.afterClosed().subscribe((eventData) => {
      //this function is invoked when the dialog is closed from the component and adding the new event into the events using the createEvent service function
      if (eventData) {
        if (eventData.id) {
          this.eventService.updateEvent(eventData.id, eventData).subscribe({
            next: () => {
              this.events = this.events.map((e) =>
                e.id === eventData.id ? eventData : e
              );
            },
            error: (err) => {
              alert('Failed to update the event');
              console.error('Error while updating the event details: ', err);
            },
          });
        } else {
          this.eventService.createEvent(eventData).subscribe({
            next: (newEvent) => {
              this.events.push(newEvent);
            },
            error: (err) => console.log('Error creating event: ', err),
          });
        }
      }
    });
  }

  openForEventDetail(event: FestivalEvent, event$: MouseEvent) {
    //Material Dialog to show the event details opened when clicked on the event div and stopped the event propogation to the parent div bec it also has click event
    event$.stopPropagation();
    this.dialog.open(EventDetailsComponent, {
      width: '350px',
      data: event,
    });
  }

  changeCalendarView() {
    //changing the view of the calendar and handling which week should be opened
    if (this.calendarView === 'Month') {
      this.calendarView = 'Week';
      const todayMonth = new Date(); //gives the current date
      if (
        this.currentMonth === todayMonth.getMonth() &&
        this.currentYear === todayMonth.getFullYear()
      ) {
        //if week view is changed from the current month than the current week of the current month is opened
        this.weekStartDate = new Date(todayMonth);
      } else {
        this.weekStartDate = new Date(this.currentYear, this.currentMonth, 1); //else in other cases like previous, future months view are toggled into week view than it will opened in first date week of the month
      }
      this.generateWeekDates();
    } else {
      this.calendarView = 'Month';
      this.generateMonthDates();
    }
  }

  openEventList() {
    this.dialog.open(EventListComponent, {
      width: '750px',
      data: this.events,
    });
  }

  deleteEvent($event: MouseEvent, eventId: number){
    $event.stopPropagation()
    if(confirm('Are you sure you want to delete event?')){
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
            this.events = this.events.filter(e => e.id !== eventId)
        },
        error: (err) => console.error('Error while deleting event: ', err)
      })
    }
  }
}
export interface Option {
  value: string;
  label: string;
}
