import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterSalonComponent } from './ajouter-salon.component';

describe('AjouterSalonComponent', () => {
  let component: AjouterSalonComponent;
  let fixture: ComponentFixture<AjouterSalonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterSalonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
