import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ROLE_LABELS, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-role-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './role-badge.html',
  styleUrl: './role-badge.scss',
})
export class RoleBadge {
  readonly role = input.required<UserRole>();
  protected readonly label = computed(() => ROLE_LABELS[this.role()]);
}
