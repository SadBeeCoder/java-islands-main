// import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import {Router} from "@angular/router";
import {AppServiceService} from "../app.service.service";
import {AuthService} from "../auth.service";
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  response?: QuestionDTO;
  questions: any[] = [];
  currentQuestion?: Question;
  selectedAnswer?: Answer;
  currentQuestionShuffled?: Question;
  feedback?: any;
  questionNumber = 0;
  isAnswerCorrect = false;
  currentUserLevel = 0;
  aiAnswer: SafeHtml | undefined;
  islandNumber = this.appService.getCurrentLevel() + 2;
  showAiAnswer = false;

  constructor(private client: HttpClient, private sanitizer: DomSanitizer, private router: Router, private appService: AppServiceService, private authService: AuthService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    // Call the method to fetch questions when the component is initialized
    this.getQuestion(this.appService.getCurrentLevel() + 1); // You can pass the desired taskId here
    this.currentUserLevel = this.appService.getCurrentLevel();
  }

  getQuestion(id: number) {
    this.client.get<QuestionDTO>(environment.baseUrl + `/tasks/${id}`)
      .subscribe(
        result => {
          console.log(result);
          this.response = result;
          // Store all questions in the 'questions' array
          this.questions = this.response?.questions;
          console.log(this.questions);
          this.showQuestion();

          console.log(this.currentQuestion);
        }
      );
  }

  private showQuestion() {
    // Set the current question to the first question in the array
    this.currentQuestion = this.questions[this.questionNumber];
    if (this.currentQuestion) {
      const answersWithId: Answer[] = [];
      // Iterate over answers and save original sorting in id field
      for (let i = 0; i < this.currentQuestion.answers.length; i++) {
        answersWithId.push({answer: this.questions[this.questionNumber].answers[i], id: i});
      }
      this.currentQuestion.answers = answersWithId;
      // Shuffle the answers for the current question
      this.currentQuestionShuffled = this.shuffleAnswers(this.currentQuestion);
    }
  }

  shuffleAnswers(question: Question): Question {
    // Shuffle the answers using a Fisher-Yates shuffle algorithm
    for (let i = question.answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [question.answers[i], question.answers[j]] = [question.answers[j], question.answers[i]];
    }
    return question;
  }

  selectAnswer(answerIndex: number) {
    if (this.currentQuestionShuffled !== undefined) {
      this.selectedAnswer = this.currentQuestionShuffled.answers[answerIndex];
    }
  }

  validateAnswer() {
    if (this.selectedAnswer !== undefined && this.currentQuestion !== undefined) {
      if (this.selectedAnswer.id === 0) {
        this.feedback = "Correct Answer!"
        this.isAnswerCorrect = true;
      } else {
        this.feedback = "Incorrect Answer! Please try again!"
      }
    }
  }

  nextQuestion() {
    if (this.questionNumber === 4) {
      // Redirect to the explanations route when the "Finish Island" button is clicked
      this.router.navigate(['/explanations']);
      console.log('Before incrementing currentLevel:', this.appService.getCurrentLevel());
      console.log('Current user level:', this.currentUserLevel);
      this.currentUserLevel += 1;
      this.appService.setCurrentLevel(this.currentUserLevel);
      console.log('After incrementing currentLevel:', this.appService.getCurrentLevel());
      console.log('Current user level:', this.currentUserLevel);
      // this.cdr.detectChanges();
      this.updateLevel();
      this.showAiAnswer = false;
    } else {
      // Handle next question logic here
      this.questionNumber++;
      this.showQuestion();
      this.feedback = undefined;
      this.selectedAnswer = undefined;
      this.isAnswerCorrect = false;
      this.showAiAnswer = false;
    }
  }

  updateLevel() {
    const requestBody: {username: string, level: number}  = {
      username: this.authService.getUsername()!,
      level: this.appService.getCurrentLevel()!
    };
    console.log('Request Body:', requestBody);
    this.client.post(environment.baseUrl + '/user', requestBody)
      .subscribe(
        (response) => {
          console.log('Level updated successfully:', response);
        },
        (error) => {
          console.error('Error updating level:', error);
          // Handle error appropriately
        }
      );
  }

  askAI() {
    if (this.currentQuestion) {
      const apiUrl = environment.baseUrl + '/ai'; // Specify your API URL

      // Create a URLSearchParams object to encode the request data
      const params = new URLSearchParams();
      params.set('prompt', this.currentQuestion.question);

      this.client.post(apiUrl, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'text'
      })
        .subscribe(
          (response) => {
            const sanitizedResponse = response.replace(/\n/g, '<br>');
            this.aiAnswer = this.sanitizer.bypassSecurityTrustHtml(sanitizedResponse);
            this.showAiAnswer = true;
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    } else {
      console.error('No current question available.');
    }
    console.log('AI Answer:', this.aiAnswer)
  }
}

interface QuestionDTO {
  id: number;
  questions: Question[];
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  answer: string;
}


