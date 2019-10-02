import {InjectionToken, Type} from '@angular/core';
import { IChildInjectorModules, IChildInjectorCompiledModules } from './child-injector.interface';

export const CHILD_INJECTOR_MODULES = new InjectionToken<IChildInjectorModules>('CHILD_INJECTOR_MODULES');
export const CHILD_INJECTOR_COMPILED_MODULES = new InjectionToken<IChildInjectorCompiledModules<Type<any>, Type<any>>>(
  'CHILD_INJECTOR_COMPILED_MODULES'
);
export const CHILD_INJECTOR_ENTRY_COMPONENTS = new InjectionToken<Array<Type<any>>>('CHILD_INJECTOR_ENTRY_COMPONENTS');
