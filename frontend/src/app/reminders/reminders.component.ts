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
  public reminders: Reminder[];

  constructor(private modalService: NgbModal,
              private eventService: EventService,
              private authService: AuthenticationService) { }

  ngOnInit() {
    this.eventService.getMyReminders(this.authService.getToken()).subscribe(newReminders => {
      this.reminders = newReminders;
    }, err => {
      console.log(err);
      return false;
    });
  }

  createReminder() {
    const modalRef = this.modalService.open(CreateReminderComponent);
  }
}
