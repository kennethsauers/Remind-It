import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Reminder } from '../schema/reminders';
import { EventService } from '../services/event.service';
import { AuthenticationService } from '../services/authentication.service';
import { CreateEventComponent } from '../create-event/create-event.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  public events: Reminder[];

  constructor(private modalService: NgbModal,
    private eventService: EventService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.eventService.getPublicEvents(this.authService.getToken()).subscribe(newEvents => {
      this.events = newEvents
    }, err => {
      console.log(err);
      return false;
    });
  }

  createEvent() {
    const modalRef = this.modalService.open(CreateEventComponent);
  }
}
