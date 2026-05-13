import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { User } from '../../core/models/user.model';
import { RoleBadge } from '../../shared/components/role-badge/role-badge';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RoleBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  readonly user = input.required<User>();
  readonly edit = output<void>();

  protected readonly initials = computed(() =>
    this.user()
      .name.split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
  );
}
