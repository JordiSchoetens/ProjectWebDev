import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  // defines that components using this guard must implement canDeactivate method
  canDeactivate: () => boolean | Observable<boolean>;
}

// the actual guard function, used in the routing module
export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = 
(  // when navigating away, calls the component's canDeactivate method
  component: CanComponentDeactivate) => {
  return component.canDeactivate();
};
