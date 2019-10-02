import { NgModuleRef, NgModuleFactory } from '@angular/core';

export type IChildInjectorModules = Array<any>;
export interface IChildInjectorCompiledModule<M, C> {
  name: string;
  module: NgModuleRef<M>;
  components: Array<C>;
}
export type IChildInjectorCompiledModules<M, C> = Array<IChildInjectorCompiledModule<M, C>>;
export type INgModuleFactoryLoaderResult = [string, NgModuleFactory<any>];

