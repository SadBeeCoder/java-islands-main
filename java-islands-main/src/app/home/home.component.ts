import { Component } from '@angular/core';
import {Greeting, GreetingService} from "../greeting.service";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  greeting ? : Greeting;
  greetingUser ?: Greeting;
  info ? : any;
  // username: string | undefined;

  constructor(private helloWorldService : GreetingService, private authService : AuthService){

  }


  getGreeting() {
    this.helloWorldService.getGreeting().subscribe(
      result => this.greeting = result
    );
  }

  getGreetingUser() {
    this.helloWorldService.getGreetingUser().subscribe(
      {
        next: result => this.greetingUser = result,
        error: err => this.info = err
      }
    );
  }

}
