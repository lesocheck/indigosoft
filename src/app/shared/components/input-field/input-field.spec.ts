import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputField } from './input-field';

@Component({
  standalone: true,
  imports: [InputField, ReactiveFormsModule],
  template: `<app-input-field [formControl]="control" label="Test" />`,
})
class TestHost {
  control = new FormControl<string>('', { nonNullable: true });
}

describe('InputField', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const inputField = fixture.debugElement.query(By.directive(InputField));
    expect(inputField.componentInstance).toBeTruthy();
  });

  it('writeValue sets input value', async () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.control.setValue('Hello');
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.value).toBe('Hello');
  });

  it('onChange fires when user types', async () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'World';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('World');
  });

  it('setDisabledState disables the input', async () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.disabled).toBe(true);
  });

  it('renders label when label attribute is set', async () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input'));
    expect(inputEl).toBeTruthy();
    const fieldEl = fixture.debugElement.query(By.css('.field'));
    expect(fieldEl).toBeTruthy();
  });
});
