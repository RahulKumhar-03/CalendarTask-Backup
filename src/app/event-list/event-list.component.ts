import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FestivalEvent } from '../event.interface';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {

  constructor(private dialogRef: MatDialogRef<EventListComponent>, @Inject(MAT_DIALOG_DATA) public data:FestivalEvent[]){}
  events = this.data
  displayedColumns: string[] = ['eventName', 'desc', 'date', 'eventType'];
  dataSource = this.events

  onClose():void{
    this.dialogRef.close()
  }

}
