import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {HttpClient} from "@angular/common/http";
import {AppServiceService} from "../app.service.service";
import {map} from "rxjs";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username: string | undefined;
  currentLevel ?: number;

  constructor(private authService: AuthService, private client: HttpClient, private appService: AppServiceService) {
    this.username = this.authService.getUsername();
    this.currentLevel = this.appService.getCurrentLevel();
  }

  ngOnInit(): void {
    this.getUserData()
    console.log('Current Level:', this.currentLevel);
  }


  private getUserData() {
    this.client.get<UserDTO>(`http://localhost:8080/user/${this.username}`)
      .subscribe(
        result => {
          console.log(result);
          this.appService.setCurrentLevel(result.level);
          console.log("Result currentlevel " + result.level);
          this.currentLevel = result.level;
          console.log(this.currentLevel)
        }
      );
  }
}


interface UserDTO {
    username: string;
    userId: number;
    level: number;
}
