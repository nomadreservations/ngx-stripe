import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import {
  Element as StripeElement,
  ElementOptions
} from './interfaces/element';

import { StripeService } from './services/stripe.service';
import { Elements, ElementsOptions } from './interfaces/elements';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ngx-stripe-card',
  template: `<div class="field" #card></div>`
})
export class StripeCardComponent implements OnInit {
  @Output() public change = new EventEmitter<{card: any, element: StripeElement}>();
  @Output() public complete = new EventEmitter<{card: any, element: StripeElement}>();
  @Output() public error = new EventEmitter<any>();

  @ViewChild('card') private card: ElementRef;
  private element: StripeElement;
  @Input()
  private set options(optionsIn: ElementOptions) {
    this.options$.next(optionsIn);
  }
  private options$ = new BehaviorSubject<ElementOptions>({});

  private cardSubscription: Subscription;

  @Input()
  private set elementsOptions(optionsIn: ElementsOptions) {
    this.elementsOptions$.next(optionsIn);
  }
  private elementsOptions$ = new BehaviorSubject<ElementsOptions>({});

  constructor(private stripeService: StripeService) {}

  public ngOnInit() {
    const elements$: Observable<Elements> = this.elementsOptions$.asObservable().switchMap(options => {
      if (Object.keys(options).length > 0) {
        return this.stripeService.elements(options);
      }
      return this.stripeService.elements();
    });
    Observable.combineLatest(
      elements$,
      this.options$.asObservable().filter(options => Boolean(options))
    ).subscribe(([elements, options]) => {
      this.element = elements.create('card', options);
      this.element.mount(this.card.nativeElement);

      this.element.on('change', changedCard => {
        this.change.emit({
          card: changedCard,
          element: this.element
        });
        if (changedCard.complete) {
          this.complete.emit({
            card: changedCard,
            element: this.element
          });
        }
        if (changedCard.error) {
          this.error.emit(changedCard.error);
        }
      });
    });
  }

  public getCard(): StripeElement {
    return this.element;
  }
}
