import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { User, UserRole, USER_ROLES } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface RandomUserResult {
  login: { 
    uuid: string 
  };
  name: { 
    first: string; 
    last: string 
  };
  dob: { 
    age: number 
  };
  email: string;
}

interface RandomUserResponse {
  results: RandomUserResult[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly _users = signal<User[]>([]);
  private readonly _roleFilter = signal<UserRole | null>(null);

  readonly filteredUsers = computed(() => {
    const filter = this._roleFilter();
    return filter ? this._users().filter((u) => u.role === filter) : this._users();
  });

  readonly roleFilter = this._roleFilter.asReadonly();

  loadUsers(): Observable<void> {
    return this.http
      .get<RandomUserResponse>(environment.usersApiUrl)
      .pipe(
        map((res) =>
          res.results.map((r, i) => ({
            id: r.login.uuid,
            name: `${r.name.first} ${r.name.last}`,
            age: r.dob.age,
            email: r.email,
            role: USER_ROLES[i % USER_ROLES.length],
          })),
        ),
        tap((users) => this._users.set(users)),
        map(() => void 0),
      );
  }

  updateUser(updated: User): void {
    this._users.update((users) => users.map((u) => (u.id === updated.id ? updated : u)));
  }

  setRoleFilter(role: UserRole | null): void {
    this._roleFilter.set(role);
  }
}
