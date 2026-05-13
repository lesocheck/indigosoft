import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { User, UserRole } from './core/models/user.model';

@Component({ selector: 'app-user-list', standalone: true, template: '' })
class UserListStub {
  @Input() users: User[] = [];
  @Input() activeRoleFilter: UserRole | null = null;
  @Input() userCardTemplate?: TemplateRef<unknown>;
  @Output() edit = new EventEmitter<User>();
  @Output() filterChange = new EventEmitter<UserRole | null>();
}

@Component({ selector: 'app-user-edit', standalone: true, template: '' })
class UserEditStub {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();
}

@Component({ selector: 'app-role-badge', standalone: true, template: '' })
class RoleBadgeStub {
  @Input() role: UserRole = 'admin';
}

describe('App', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(App, {
        set: { imports: [UserListStub, UserEditStub, RoleBadgeStub] },
      })
      .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.includes('randomuser.me')).flush({ results: [] });
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render header', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.includes('randomuser.me')).flush({ results: [] });
    fixture.detectChanges();
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(h1?.textContent).toContain('Управление пользователями');
  });
});
