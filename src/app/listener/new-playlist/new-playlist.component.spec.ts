import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlaylistComponent } from './new-playlist.component';

describe('NewPlaylistComponent', () => {
  let component: NewPlaylistComponent;
  let fixture: ComponentFixture<NewPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPlaylistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
