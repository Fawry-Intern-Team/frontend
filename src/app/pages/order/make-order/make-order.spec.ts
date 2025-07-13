import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeOrder } from './make-order';

describe('MakeOrder', () => {
  let component: MakeOrder;
  let fixture: ComponentFixture<MakeOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
