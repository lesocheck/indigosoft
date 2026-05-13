import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UserRole, USER_ROLES, ROLE_LABELS } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list-filters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list-filters.html',
  styleUrl: './user-list-filters.scss',
})
export class UserListFilters {
  readonly value = input<UserRole | null>(null);
  readonly filterChange = output<UserRole | null>();

  readonly roles: UserRole[] = USER_ROLES;
  readonly roleLabels = ROLE_LABELS;
}
