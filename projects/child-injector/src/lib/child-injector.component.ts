import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  ViewContainerRef,
  Input,
  ComponentRef,
  ComponentFactory,
  OnDestroy,
  OnChanges,
  OnInit,
  ChangeDetectorRef,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CHILD_INJECTOR_COMPILED_MODULES } from './child-injector-tokens';
import {
  IChildInjectorCompiledModule,
  IChildInjectorCompiledModules
} from './child-injector.interface';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'child-injector',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildInjectorComponent<T> implements OnInit, OnChanges, OnDestroy {
  constructor(
    @Inject(CHILD_INJECTOR_COMPILED_MODULES)
    private compiledModules: IChildInjectorCompiledModules<any, T>,
    private vc: ViewContainerRef
  ) {}

  @Input() component: T;
  @Input() className: string;
  @Input() inputs: any = {};
  @Input() outputs: any = {};


  sub: Subscription = new Subscription();
  componentRef: ComponentRef<T>;

  ngOnInit() {
    if (!this.component) {
      throw new Error('[ChildInjectorComponent]: component is not passed to ChildInjectorComponent');
    }
    const compiledModule = (this.compiledModules || []).reduce(
      (res, modules: any) => {
        if (res) {
          return res;
        }
        return modules.find((module: IChildInjectorCompiledModule<any, T>) =>
          module.components.some(component => component === this.component)
        );
      },
      null
    );

    if (!compiledModule) {
      throw new Error(`[ChildInjectorComponent]: can not find compiled module for component ${(this.component as any).name}`);
    }

    const factory: ComponentFactory<T> = compiledModule.module
      .componentFactoryResolver.resolveComponentFactory(this.component);

    this.componentRef = this.vc.createComponent(factory);

    if (this.className) {
      const classNames = this.className.split(' ');
      classNames.forEach(className => this.componentRef.location.nativeElement.classList.add(className));
    }

    this.setInputs({ inputs: this.inputs, firstChange: true });
    this.setOutputs({ outputs: this.outputs });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.componentRef) {
      return;
    }
    if (changes.inputs) {
      this.setInputs({ inputs: this.inputs, firstChange: false });
    }
    if (changes.outputs) {
      this.setOutputs({ outputs: this.outputs });
    }
  }

  setInputs({ inputs, firstChange } ): void {
    const { instance } = this.componentRef;
    const changeDetectorRef = this.componentRef.injector.get(ChangeDetectorRef);
    const prevInputsKeys = Object.keys(inputs);
    const prevInputs = {};

    prevInputsKeys.forEach(key => {
      prevInputs[key] = instance[key];
    });

    Object.assign(instance, inputs);

    const changes: SimpleChanges = {};
    const inputKeys = Object.keys(inputs);

    inputKeys.forEach(key => {
      changes[key] = new SimpleChange(prevInputs[key], inputs[key], firstChange);
    });

    if ((instance as any).ngOnChanges) {
      (instance as any).ngOnChanges(changes);
    }
    changeDetectorRef.markForCheck();
  }

  setOutputs({ outputs }): void {
    this.sub.unsubscribe();
    this.sub = new Subscription();

    Object.keys(outputs).forEach((key) => {
      this.sub.add(
        this.componentRef.instance[key].subscribe(outputs[key])
      );
    });
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    this.vc.clear();
    this.sub.unsubscribe();
  }
}
