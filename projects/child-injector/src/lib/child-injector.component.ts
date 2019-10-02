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
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CHILD_INJECTOR_COMPILED_MODULES } from './child-injector-tokens';
import {
  IChildInjectorCompiledModule,
  IChildInjectorCompiledModules
} from './child-injector.interface';

@Component({
  selector: 'app-child-injector',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildInjectorComponent<T> implements OnInit, OnChanges, OnDestroy {
  constructor(
    @Inject(CHILD_INJECTOR_COMPILED_MODULES)
    private compiledModules: IChildInjectorCompiledModules<any, T>,
    private vc: ViewContainerRef
  ) {
  }

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

    const factory: ComponentFactory<T> = compiledModule.module.componentFactoryResolver.resolveComponentFactory(
      this.component
    );
    this.componentRef = this.vc.createComponent(factory);
    const { instance, location } = this.componentRef;

    if (this.className) {
      const classNames = this.className.split(' ');
      classNames.forEach(className => location.nativeElement.classList.add(className));
    }

    this.setInputs(instance);
    this.setOutputs(instance);
  }

  ngOnChanges(changes) {
    if (!this.componentRef) {
      return;
    }
    if (changes.inputs) {
      this.setInputs(this.componentRef.instance);
    }
    if (changes.outputs) {
      this.setOutputs(this.componentRef.instance);
    }
  }

  setInputs(instance: T): void {
    Object.assign(instance, this.inputs);
    if ((instance as any).ngOnChanges) {
      (instance as any).ngOnChanges({ ...this.inputs });
    }
    this.componentRef.changeDetectorRef.markForCheck();
  }

  setOutputs(instance: T): void {
    this.sub.unsubscribe();
    const outputKeys = Object.keys(this.outputs);

    outputKeys.forEach((key) => {
      this.sub.add(instance[key].subscribe(this.outputs[key]));
    });
  }

  ngOnDestroy() {
    this.vc.clear();
    this.sub.unsubscribe();
  }
}
