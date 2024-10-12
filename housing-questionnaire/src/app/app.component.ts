import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HousingQuestionnaireComponent } from './housing-questionnaire/housing-questionnaire.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HousingQuestionnaireComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'housing-questionnaire';
}
