import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from './register/register.component';
import {UserComponent} from './user/user.component';
import {QuestionsComponent} from './questions/questions.component';
import {ExplanationsComponent} from './explanations/explanations.component';

const routes: Routes = [
  {path : "", component: HomeComponent},
  // {path : "about", component: AboutComponent},
  {path : "login", component: LoginComponent},
  {path : "register", component: RegisterComponent},
  {path: "user", component: UserComponent},
  {path: "questions", component: QuestionsComponent},
  {path: "explanations", component: ExplanationsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
