// src/app/housing-questionnaire/housing-questionnaire.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-housing-questionnaire',
  templateUrl: './housing-questionnaire.component.html',
  styleUrls: ['./housing-questionnaire.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class HousingQuestionnaireComponent {
  questionnaireForm: FormGroup;
  formResult: any = null;

  constructor(private fb: FormBuilder) {
    // Initialize the form with form controls
    this.questionnaireForm = this.fb.group({
      stayDuration: [''],
      priceRange: [''],
      schooling: [false],
      jobs: [false],
      otherPreferences: ['']
    });
  }

  @Output() formSubmittedEvent = new EventEmitter<void>();
  formSubmitted = false;

  onSubmit() {
    this.formSubmitted = true;
    this.formSubmittedEvent.emit();
  }
}