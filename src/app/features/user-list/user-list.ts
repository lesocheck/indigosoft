import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { User, UserRole } from '../../core/models/user.model';
import { UserCard } from '../user-card/user-card';
import { UserListFilters } from './user-list-filters/user-list-filters';

export interface UserCardContext {
  $implicit: User;
  edit: (user: User) => void;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgTemplateOutlet, UserCard, UserListFilters],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  readonly users = input<User[]>([]);
  readonly activeRoleFilter = input<UserRole | null>(null);
  readonly edit = output<User>();
  readonly filterChange = output<UserRole | null>();

  @Input() userCardTemplate?: TemplateRef<UserCardContext>;

  protected readonly onEdit = (user: User): void => {
    this.edit.emit(user);
  };

  static ngTemplateContextGuard(
    _dir: UserList,
    _ctx: unknown,
  ): _ctx is UserCardContext {
    return true;
  }
}
