import { ChangeDetectionStrategy, Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';
import { UserService } from './core/services/user.service';
import { User, UserRole } from './core/models/user.model';
import { UserList } from './features/user-list/user-list';
import { UserEdit } from './features/user-edit/user-edit';
import { RoleBadge } from './shared/components/role-badge/role-badge';

type LoadState = { status: 'loading' } | { status: 'success' } | { status: 'error' };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserList, UserEdit, RoleBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly userService = inject(UserService);

  @ViewChild('cardTemplate') cardTemplate!: TemplateRef<unknown>;

  protected readonly selectedUser = signal<User | null>(null);
  private readonly retry$ = new Subject<void>();

  protected readonly loadState = toSignal(
    this.retry$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.userService.loadUsers().pipe(
          map((): LoadState => ({ status: 'success' })),
          catchError(() => of<LoadState>({ status: 'error' })),
          startWith<LoadState>({ status: 'loading' }),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as LoadState },
  );

  protected readonly filteredUsers = this.userService.filteredUsers;
  protected readonly roleFilter = this.userService.roleFilter;

  protected retry(): void {
    this.retry$.next();
  }

  protected setRoleFilter(role: UserRole | null): void {
    this.userService.setRoleFilter(role);
  }

  protected openEdit(user: User): void {
    this.selectedUser.set(user);
  }

  protected onSave(user: User): void {
    this.userService.updateUser(user);
    this.selectedUser.set(null);
  }

  protected onCancel(): void {
    this.selectedUser.set(null);
  }
}
