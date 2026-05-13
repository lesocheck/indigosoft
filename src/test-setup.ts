import '@angular/compiler';
import { TestBed, getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

afterEach(() => {
  TestBed.resetTestingModule();
});
