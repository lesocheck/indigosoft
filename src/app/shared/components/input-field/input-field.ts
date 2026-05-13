import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseField } from '../base-field/base-field';

@Component({
  selector: 'app-input-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
})
export class InputField extends BaseField<string | number> {
  readonly type = input<'text' | 'number' | 'email'>('text');
  readonly placeholder = input('');

  protected onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const val = this.type() === 'number' ? Number(el.value) : el.value;
    this.value = val;
    this._onChange(val);
  }
}
