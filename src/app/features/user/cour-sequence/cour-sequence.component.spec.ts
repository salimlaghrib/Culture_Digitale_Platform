import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourSequenceComponent } from './cour-sequence.component';

describe('CourSequenceComponent', () => {
  let component: CourSequenceComponent;
  let fixture: ComponentFixture<CourSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourSequenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
