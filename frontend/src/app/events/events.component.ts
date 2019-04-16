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
  today: Date = new Date();
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

  dateCompare(then: Date, now: Date): number {
    var a: Date = new Date(then.getFullYear(), then.getMonth(), then.getDate());
    var b: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

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
    const event: Reminder = this.events[index];
    const then = new Date(event.dueDate)

    if (this.dateCompare(then, this.today) == 0) {
      return "table-secondary";
    } else if (this.dateCompare(then, this.today) > 0) {
      return "table-default"
    } else {
      // We basically shouldn't even receive old sponsored events.
      return "hidden";
    }
  }
}
