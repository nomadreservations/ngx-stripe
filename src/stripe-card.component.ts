import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable
} from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Element as StripeElement, ElementOptions } from './interfaces/element';
import { Elements, ElementsOptions } from './interfaces/elements';
import { StripeService } from './services/stripe.service';

@Component({
  selector: 'ngx-stripe-card',
  template: `<div class="field" #card></div>`
})
export class StripeCardComponent implements OnInit {
  @Output()
  public change = new EventEmitter<{ card: any; element: StripeElement }>();
  @Output()
  public complete = new EventEmitter<{ card: any; element: StripeElement }>();
  @Output()
  public error = new EventEmitter<any>();

  @ViewChild('card')
  private card?: ElementRef;
  private element?: StripeElement;
  @Input()
  private set options(optionsIn: ElementOptions) {
    this.options$.next(optionsIn);
  }
  private options$ = new BehaviorSubject<ElementOptions>({});

  @Input()
  public set elementsOptions(optionsIn: ElementsOptions) {
    this.elementsOptions$.next(optionsIn);
  }
  private elementsOptions$ = new BehaviorSubject<ElementsOptions>({});

  constructor(private stripeService: StripeService) {}

  public ngOnInit() {
    const elements$: Observable<
      Elements
    > = this.elementsOptions$.asObservable().pipe(
      switchMap(options => {
        if (Object.keys(options).length > 0) {
          return this.stripeService.elements(options);
        }
        return this.stripeService.elements();
      })
    );
    observableCombineLatest(
      elements$,
      this.options$.asObservable().pipe(filter(options => Boolean(options)))
    ).subscribe(([elements, options]) => {
      if (this.card) {
        this.element = elements.create('card', options);
        this.element.mount(this.card.nativeElement);

        this.element.on('change', changedCard => {
          this.change.emit({
            card: changedCard,
            element: this.element
          } as any);
          if (changedCard.complete) {
            this.complete.emit({
              card: changedCard,
              element: this.element
            } as any);
          }
          if (changedCard.error) {
            this.error.emit(changedCard.error);
          }
        });
      }
    });
  }

  public getCard(): StripeElement | undefined {
    return this.element;
  }
}
