import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const enterScorePochaAnimation = trigger('animatePlayer', [
  transition(':increment', [
    group([
      query(
        ':enter',
        [style({ transform: 'translateX(100%)', opacity: '0' }), animate('300ms', style({ transform: 'translateX(0%)', opacity: '1' }))],
        {
          optional: true,
        }
      ),
      query(':leave', [style({ position: 'absolute', top: '0' }), animate('300ms', style({ transform: 'translateX(-100%)', opacity: '0' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition(':decrement', [
    group([
      query(
        ':enter',
        [style({ transform: 'translateX(-100%)', opacity: '0' }), animate('300ms', style({ transform: 'translateX(0%)', opacity: '1' }))],
        {
          optional: true,
        }
      ),
      query(':leave', [style({ position: 'absolute', top: '0' }), animate('300ms', style({ transform: 'translateX(100%)', opacity: '0' }))], {
        optional: true,
      }),
    ]),
  ]),
]);
