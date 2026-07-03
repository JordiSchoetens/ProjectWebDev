import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { unsavedChangesGuard } from './unsaved-changes-guard';

// Mock component implementing CanComponentDeactivate
class MockComponent {
  canDeactivate = jasmine.createSpy('canDeactivate').and.returnValue(true);
}

describe('unsavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn<MockComponent> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => unsavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const mockComponent = new MockComponent();
    expect(executeGuard(mockComponent, null as any, null as any, null as any)).toBeTruthy();
  });
});
