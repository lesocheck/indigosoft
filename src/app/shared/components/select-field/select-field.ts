import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseField } from '../base-field/base-field';
import { SelectOption } from '../../models/select-option';

export type { SelectOption };

@Component({
  selector: 'app-select-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select-field.html',
  styleUrl: './select-field.scss',
})
export class SelectField extends BaseField<string> {
  readonly options = input<SelectOption[]>([]);

  protected onSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value = val;
    this._onChange(val);
  }
}
