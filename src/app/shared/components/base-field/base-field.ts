import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

@Directive()
export abstract class BaseField<T> implements ControlValueAccessor, OnInit {
  readonly label = input('');
  readonly errorMessages = input<Partial<Record<string, string>>>({});

  protected value: T = '' as T;
  protected disabled = false;
  protected readonly control = signal<AbstractControl | null>(null);

  private static nextId = 0;
  protected readonly id = `field-${++BaseField.nextId}`;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly ngControl = inject(NgControl, { self: true, optional: true });

  protected _onChange: (value: T) => void = () => {};
  protected _onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    const ctrl = this.ngControl?.control ?? null;
    if (ctrl) {
      this.control.set(ctrl);
      ctrl.events
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.control.set(this.ngControl!.control));
    }
  }

  protected get activeErrors(): string[] {
    const ctrl = this.control();
    if (!ctrl?.touched || !ctrl.errors) return [];
    return Object.keys(ctrl.errors)
      .map((key) => this.errorMessages()[key])
      .filter((msg): msg is string => Boolean(msg));
  }

  writeValue(value: T): void {
    this.value = value ?? ('' as T);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: T) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  protected onTouched(): void {
    this._onTouched();
  }
}
