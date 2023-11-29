import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular-github-pages';
  info ? : any;
  username: string | undefined;

    constructor(private authService: AuthService, private router: Router){

    }

  isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  sendLogout() {
    this.authService.postLogout().subscribe(
        {
          next: result => {
            this.info = "Logged out!";
            this.authService.logout();
            this.router.navigate(["/"]);
          },

          error: err => {
            this.info = err;
          }
        }
    );
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }
}
