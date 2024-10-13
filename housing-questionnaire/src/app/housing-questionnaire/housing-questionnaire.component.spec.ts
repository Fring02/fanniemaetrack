import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingQuestionnaireComponent } from './housing-questionnaire.component';

describe('HousingQuestionnaireComponent', () => {
  let component: HousingQuestionnaireComponent;
  let fixture: ComponentFixture<HousingQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingQuestionnaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HousingQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
