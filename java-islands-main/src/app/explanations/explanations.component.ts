import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {AppServiceService} from "../app.service.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-explanations',
  templateUrl: './explanations.component.html',
  styleUrls: ['./explanations.component.css']
})
export class ExplanationsComponent implements OnInit {
  response?: ExplanationDTO;
  sanitizedExplanation ?: SafeHtml;
  taskId = 0;

  constructor(private client: HttpClient, private sanitizer: DomSanitizer, private appService: AppServiceService) {}

  ngOnInit() {
    const currentLevel = this.appService.getCurrentLevel();
    this.taskId = currentLevel + 1; // Setzen Sie hier die Task-ID, die Sie abrufen möchten
    this.getExplanation(this.taskId);
  }
  getExplanation(id: number) {
    this.client.get<ExplanationDTO>( environment.baseUrl +`/tasks/${id}`).subscribe(
      result => {
        this.response = result;
        this.sanitizedExplanation = this.sanitizer.bypassSecurityTrustHtml(
          this.response.explanation.replace(/\n/g, '<br>')
        );
      }
    );
  }
}

interface ExplanationDTO {
  id: number,
  explanation: string
}



