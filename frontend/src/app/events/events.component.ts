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
  eventWatcher;
  public events: Reminder[];
  selectedRow: number;
  onClickedEvent: Function;

  constructor(private modalService: NgbModal,
    private eventService: EventService,
    private authService: AuthenticationService) {
    this.eventWatcher = this.eventService.onEventListLoad.subscribe({
      next: (events: Reminder[]) => {
        this.events = events;
      }
    });
  }

  ngOnInit() {
    this.refreshData();
    this.onClickedEvent = (index: number) => {
      if (this.selectedRow != index) {
        this.selectedRow = index;
        this.eventService.getEventInformation(this.authService.getToken(), 
          this.events[index]._id);
      }
    }
  }
  refreshData() {
    this.eventService.getPublicEvents(this.authService.getToken());
  }
  createEvent() {
    const modalRef = this.modalService.open(CreateEventComponent);
    modalRef.result.then(() => this.refreshData());
  }
}
