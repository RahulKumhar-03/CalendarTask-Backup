import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { FestivalEvent } from '../event.interface';
import { EventFormComponent } from '../event-form/event-form.component';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailsComponent } from '../event-details/event-details.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  months=['January','February','March','April','May','June','July','August','September','October','November','Decemeber']
  days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  currentMonth: number = new Date().getMonth()
  currentYear = new Date().getFullYear()
  monthDates: Date[] = []
  events: FestivalEvent[] = []
  selectedValue: string = 'option1'
  filteredDays: string[] = []
  currentDate: Date = new Date()
  options: Option[] =[
    {value:'option1',label:'Week'},
    {value:'option2',label:'Work Week'}
  ]
  calendarView: 'Month' | 'Week' = 'Month';
  weekStartDate:Date = new Date();
  
  constructor(private eventService: EventsService, public dialog: MatDialog){}

  ngOnInit(){
    this.generateMonthDates();
    this.loadEvents();
    this.filteredDays = this.days
  }

  applyFilters(value:string){
    if(value === 'option2'){
      this.filteredDays = this.days.filter(day => day !== 'Sunday' && day !== 'Saturday')
    } else {
      this.filteredDays = this.days
    }
  }
  loadEvents(){
    this.eventService.getAllEvents().subscribe({
      next: (response) =>{
        this.events = response
      },
      error:(err) => {
        alert('Error occured while fetching events');
        console.error("Error fetching all events",err)
      }
    })
  }

  generateMonthDates(){
    const dates = []
    const startDateOfMonth = new Date(this.currentYear,this.currentMonth,1); //1 Aug
    
    const lastDateOfMonth = new Date(this.currentYear, this.currentMonth+1,0); //31 Aug

    const startWeekDayOfMonth = startDateOfMonth.getDay();    
    
    for(let i=startWeekDayOfMonth-1; i>=0; i--){
      dates.push(new Date(this.currentYear,this.currentMonth,-i))
    }

    for(let i=startDateOfMonth.getDate(); i<=lastDateOfMonth.getDate(); i++){
      dates.push(new Date(this.currentYear, this.currentMonth,i))
    }

    for(let i=1; i<=6 - lastDateOfMonth.getDay(); i++){
      dates.push(new Date(this.currentYear, this.currentMonth+1,i))
    }

    this.monthDates = dates
  }

  generateWeekDates(){
    const weekDates = []
    const startdate = new Date(this.weekStartDate)
    startdate.setDate(this.weekStartDate.getDate() - this.weekStartDate.getDay())

    for(let i=0; i<7; i++){
      const start = new Date(startdate);
      start.setDate(startdate.getDate() + i)
      weekDates.push(start)      
    }
    this.currentMonth = startdate.getMonth();
    this.currentYear = startdate.getFullYear();
    this.monthDates = weekDates
  }
  previousMonth(){
    this.currentMonth--;
    if(this.currentMonth < 0){
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateMonthDates()
  }
  
  nextMonth(){
    this.currentMonth++;
    if(this.currentMonth > 11){
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateMonthDates();
  }

  previousWeek(){
    this.weekStartDate.setDate(this.weekStartDate.getDate() - 7)
    this.generateWeekDates()
  }

  nextWeek(){
    this.weekStartDate.setDate(this.weekStartDate.getDate() + 7)
    this.generateWeekDates()
  }
  toggleWeek(date: Date){
    if(this.calendarView === 'Month'){
      this.calendarView = 'Week'
      this.weekStartDate = new Date(date)
      this.generateWeekDates()
    }
  }

  openEventForm(){
   const dialog = this.dialog.open(EventFormComponent,{
    width: '400px',
   })

   dialog.afterClosed().subscribe(eventData => {
    this.eventService.createEvent(eventData).subscribe({
      next:(newEvent)=>{
        this.events.push(newEvent)
      },
      error:(err)=>console.log('Error creating event: ',err)
    })
   })
  }

  openForEventDetail(event:FestivalEvent,event$:MouseEvent){
    event$.stopPropagation()
    this.dialog.open(EventDetailsComponent,{
      width:'350px',
      data:event
    })
  }

  changeCalendarView(){
    if(this.calendarView === 'Month'){
      this.calendarView = 'Week';
      const todayMonth = new Date()
      if(this.currentMonth === todayMonth.getMonth() && this.currentYear === todayMonth.getFullYear()){
        this.weekStartDate = new Date(todayMonth) 
      } else{
        this.weekStartDate = new Date(this.currentYear, this.currentMonth, 1)
      }
      this.generateWeekDates();
    }
    else {
      this.calendarView = 'Month'
      this.generateMonthDates();
    } 
  }
}
export interface Option{
  value:string;
  label:string;
}
