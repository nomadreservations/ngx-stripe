import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Element as StripeElement, ElementOptions, ElementType } from './interfaces/element';
import { Elements, ElementsOptions } from './interfaces/elements';
import { StripeService } from './services/stripe.service';

@Component({
  selector: 'ngx-stripe-card',
  template: `
    <div class="field" #card>
      <div [class]="type" *ngFor="let type of elementTypes"></div>
    </div>
  `
})
export class StripeCardComponent implements OnInit {
  @Input()
  private set options(optionsIn: ElementOptions) {
    this.options$.next(optionsIn);
  }

  @Input()
  public set elementsOptions(optionsIn: ElementsOptions) {
    this.elementsOptions$.next(optionsIn);
  }

  constructor(private stripeService: StripeService) {}
  @Output() public change = new EventEmitter<{ card: any; element: StripeElement }>();
  @Output() public complete = new EventEmitter<{ card: any; element: StripeElement }>();
  @Output() public error = new EventEmitter<any>();
  @Input() public elementTypes: Array<ElementType> = ['card'];

  @ViewChild('card', { static: false })
  private card?: ElementRef;
  private cardElement?: StripeElement;
  private elements?: Array<StripeElement>;
  private options$ = new BehaviorSubject<ElementOptions>({});
  private elementsOptions$ = new BehaviorSubject<ElementsOptions>({});

  public ngOnInit() {
    const elements$: Observable<Elements> = this.elementsOptions$.asObservable().pipe(
      switchMap(options => {
        if (Object.keys(options).length > 0) {
          return this.stripeService.elements(options);
        }
        return this.stripeService.elements();
      })
    );
    let complete = {};
    observableCombineLatest(
      elements$,
      this.options$.asObservable().pipe(filter(options => Boolean(options)))
    ).subscribe(([elements, options]) => {
      this.elements = [];
      if (this.card) {
        for (const type of this.elementTypes) {
          const element = elements.create(type, options);
          complete = {
            ...complete,
            [type]: element
          };

          if (['card', 'cardNumber'].indexOf(type) !== -1) {
            this.cardElement = element;
          }
          const mountTo = this.card.nativeElement.querySelector(`.${type}`);

          element.mount(mountTo);

          element.on('change', changedCard => {
            let isComplete = changedCard.complete;
            for (const key in complete) {
              if (complete) {
                const value = complete[key];
                if (key !== changedCard.elementType && !value._complete) {
                  isComplete = false;
                }
              }
            }
            this.change.emit({
              card: changedCard,
              elements: this.elements,
              type: changedCard.elementType,
              complete: isComplete,
              element: element
            } as any);
            if (isComplete) {
              this.complete.emit({
                card: changedCard,
                elements: this.elements,
                type: changedCard.elementType,
                complete: isComplete,
                element: element
              } as any);
            }
            if (changedCard.error) {
              this.error.emit(changedCard.error);
            }
          });
          this.elements = [...this.elements, element];
        }
      }
    });
  }

  public getCard(): StripeElement | undefined {
    return this.cardElement;
  }
}
