import {InjectionToken} from '@angular/core';

export const ENUMERATIONS_PROVIDER: InjectionToken<EnumerationsProvider> = new InjectionToken<EnumerationsProvider>(
  'Common enumerations provider',
  {
    factory: () => new EnumerationsProvider(),
  },
);

export class EnumerationsProvider {
  //public readonly creditCheckNotification: typeof CreditCheckNotification = CreditCheckNotification;
}
