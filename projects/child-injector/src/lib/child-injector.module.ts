/**
 * @overview      ChildInjectorModule
 *                создает переданные модули с новым инжектором
 * @copyright     Copyright (c) Nexign, JSC, 1992-2019
 */

import { Compiler, Injector, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChildInjectorComponent } from './child-injector.component';
import { NgFactoryResolver } from './ng-factory-resolver';
import {
  IChildInjectorCompiledModules,
  IChildInjectorModules,
  INgModuleFactoryLoaderResult
} from './child-injector.interface';
import {
  CHILD_INJECTOR_COMPILED_MODULES,
  CHILD_INJECTOR_ENTRY_COMPONENTS,
  CHILD_INJECTOR_MODULES
} from './child-injector-tokens';

@NgModule({
  imports: [CommonModule],
  declarations: [ChildInjectorComponent],
  entryComponents: [ChildInjectorComponent],
  exports: [ChildInjectorComponent]
})
export class ChildInjectorModule {
  static forModules(modules: IChildInjectorModules): ModuleWithProviders {
    return {
      ngModule: ChildInjectorModule,
      providers: [
        {
          provide: CHILD_INJECTOR_MODULES,
          useValue: modules,
          multi: true
        },
        {
          provide: CHILD_INJECTOR_COMPILED_MODULES,
          useFactory: childInjectorModulesFactory,
          deps: [CHILD_INJECTOR_MODULES, Compiler, Injector]
        }
      ]
    };
  }

  static forChildModule<T>(components: Array<T>): ModuleWithProviders {
    return {
      ngModule: ChildInjectorModule,
      providers: [{ provide: CHILD_INJECTOR_ENTRY_COMPONENTS, useValue: components }]
    };
  }
}

export function childInjectorModulesFactory(
  modulesOfModules: Array<IChildInjectorModules> = [],
  compiler: Compiler,
  injector: Injector
): Array<IChildInjectorCompiledModules<Type<any>, Type<any>>> {
  const modulesOfModulesResult = modulesOfModules.map(modules => {
    const modulesMapResult = modules.map(ngModuleWebpackModule => {
      if (ngModuleWebpackModule.compiled) {
        return ngModuleWebpackModule.compiled;
      }

      const [name, factory]: INgModuleFactoryLoaderResult = NgFactoryResolver.resolve(ngModuleWebpackModule, compiler);
      const module = factory.create(injector);
      const components = module.injector.get(CHILD_INJECTOR_ENTRY_COMPONENTS);

      ngModuleWebpackModule.compiled = { name, module, components };

      return { name, module, components };
    });

    return modulesMapResult;
  });
  return modulesOfModulesResult;
}
