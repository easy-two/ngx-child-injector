import { Compiler, NgModuleFactory } from '@angular/core';

export class NgFactoryResolver {
  static resolve(ngModuleWebpackModule: any, compiler: Compiler) {
    const offlineMode = compiler instanceof Compiler;
    return offlineMode
      // in AOT we just resolve NgFactory
      ? NgFactoryResolver.resolveFactory(ngModuleWebpackModule)
      // in JIT we have to compile NgFactory
      : NgFactoryResolver.resolveAndCompileFactory(ngModuleWebpackModule, compiler);
  }

  private static resolveAndCompileFactory(ngModuleWebpackModule: any, compiler: Compiler): [string, NgModuleFactory<any>] {
    // does not work in jit with --optimization at the moment
    const moduleName = ngModuleWebpackModule.name;

    return [moduleName, compiler.compileModuleSync(ngModuleWebpackModule)];
  }

  private static resolveFactory(ngModuleWebpackModule: any): [string, NgModuleFactory<any>] {
    const moduleName = Object.keys(ngModuleWebpackModule).find(key => key.endsWith('ModuleNgFactory'));

    return [moduleName.replace('NgFactory', ''), ngModuleWebpackModule[moduleName]];
  }
}
