import { Component } from '@angular/core';
import { HousingQuestionnaireComponent } from './housing-questionnaire/housing-questionnaire.component';
import { MapOverlayComponent } from './map-overlay/map-overlay.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HousingQuestionnaireComponent, MapOverlayComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'housing-questionnaire';
  mapOverlayVisible = false;

  showMapOverlay() {
    this.mapOverlayVisible = true;
  }
}
