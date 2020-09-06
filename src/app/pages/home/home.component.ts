import { Component, OnInit, NgZone } from '@angular/core';
import { MessagingService } from 'src/app/messaging.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public todos: any[] = null;
  show;

  constructor(
    private messagingService: MessagingService,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    this.ngZone.run(() => {
      this.messagingService.requestPermission();
      this.messagingService.receiveMessage();
      this.show = this.messagingService.currentMessage;
    })
  }
}
