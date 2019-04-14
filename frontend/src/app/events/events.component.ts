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
  selectedRow: number;
  onClickedEvent: Function;

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

    this.onClickedEvent = (index) => {
      if (this.selectedRow != index) {
        this.selectedRow = index;
        this.eventService.getEventInformation(this.authService.getToken(), 
          this.events[index]._id);
      }
    }
  }

  createEvent() {
    const modalRef = this.modalService.open(CreateEventComponent);
  }
}
