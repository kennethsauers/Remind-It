import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateReminderComponent } from '../create-reminder/create-reminder.component';
import { EventService } from '../services/event.service';
import { AuthenticationService } from '../services/authentication.service';
import { Reminder } from '../schema/reminders';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {
  reminderWatcher;
  public reminders: Reminder[];
  selectedRow: number;
  onClickedEvent: Function;
  today: Date;

  constructor(private modalService: NgbModal,
    private eventService: EventService,
    private authService: AuthenticationService) {
    this.reminderWatcher = this.eventService.onEventListLoad.subscribe({
      next: (reminders: Reminder[]) => {
        this.reminders = reminders;
      }
    });
  }

  ngOnInit() {
    this.today = new Date();
    this.refreshData();
    this.onClickedEvent = (index: number) => {
      if (this.selectedRow != index) {
        this.selectedRow = index;
        this.eventService.getEventInformation(this.authService.getToken(), 
          this.reminders[index]._id);
      }
    }
  }

  dateCompare (then: Date, now: Date): number {
    var a: Date = new Date (then.getFullYear(), then.getMonth(), then.getDate());
    var b: Date = new Date (now.getFullYear(), now.getMonth(), now.getDate());

    // this is today
    if (a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear())
      return 0;
    // This was yesterday
    else if (a < b)
      return -1;
    // this is in the future
    else if (a > b)
      return 1;
  }

  getClass(index: number): string {
    const reminder: Reminder = this.reminders[index];
    const then = new Date(reminder.dueDate)
    
    console.log(this.dateCompare(then, this.today))
    if (this.dateCompare(then, this.today) == 0) {
      return "table-secondary";
    } else if (this.dateCompare(then, this.today) < 0) {
      return "table-warning";
    } else if (this.dateCompare(then, this.today) > 0) {
      return "table-default"
    }
  }

  refreshData() {
    this.eventService.getMyReminders(this.authService.getToken());
  }

  createReminder() {
    const modalRef = this.modalService.open(CreateReminderComponent);
    modalRef.result.then(() => this.refreshData());
  }
}
