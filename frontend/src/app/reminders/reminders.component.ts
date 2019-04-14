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
    this.refreshData();
    this.onClickedEvent = (index: number) => {
      if (this.selectedRow != index) {
        this.selectedRow = index;
        this.eventService.getEventInformation(this.authService.getToken(), 
          this.reminders[index]._id);
      }
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
