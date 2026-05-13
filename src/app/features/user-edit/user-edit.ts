import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, USER_ROLES, ROLE_LABELS } from '../../core/models/user.model';
import { InputField } from '../../shared/components/input-field/input-field';
import { SelectField } from '../../shared/components/select-field/select-field';
import type { SelectOption } from '../../shared/models/select-option';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, InputField, SelectField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss',
})
export class UserEdit {
  readonly user = input<User | null>(null);
  readonly save = output<User>();
  readonly cancel = output<void>();

  protected readonly roleOptions: SelectOption[] = USER_ROLES.map((r) => ({
    value: r,
    label: ROLE_LABELS[r],
  }));

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    age: [0, [Validators.required, Validators.min(1), Validators.max(120)]],
    email: ['', [Validators.required, Validators.email]],
    role: [USER_ROLES[0], Validators.required],
  });

  constructor() {
    toObservable(this.user)
      .pipe(takeUntilDestroyed())
      .subscribe((u) => {
        if (u) {
          this.form.reset({ name: u.name, age: u.age, email: u.email, role: u.role });
        }
      });
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const u = this.user();
    if (!u) return;
    this.save.emit({ ...u, ...this.form.getRawValue() });
  }
}
