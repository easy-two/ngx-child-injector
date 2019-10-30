import {Compiler, NgModuleFactory} from '@angular/core';

export class NgFactoryResolver {
  static resolve(ngModuleWebpackModule: any, compiler: Compiler) {
    const offlineMode = compiler instanceof Compiler;

    // ivy (aot + jit)
    if (Object.getOwnPropertyDescriptor(ngModuleWebpackModule, 'ɵmod')) {
      return NgFactoryResolver.resolveAndCompileFactory(ngModuleWebpackModule, compiler);
    }

    return offlineMode
      // in AOT we just resolve NgFactory
      // view engine aot
      ? NgFactoryResolver.resolveFactory(ngModuleWebpackModule)
      // in JIT we have to compile NgFactory
      // view engine jit
      : NgFactoryResolver.resolveAndCompileFactory(ngModuleWebpackModule, compiler);
  }

  private static resolveAndCompileFactory(ngModuleWebpackModule: any, compiler: Compiler): NgModuleFactory<any> {
    return compiler.compileModuleSync(ngModuleWebpackModule);
  }

  private static resolveFactory(ngModuleWebpackModule: any): NgModuleFactory<any> {
    const moduleName = Object.keys(ngModuleWebpackModule).find(key => key.endsWith('ModuleNgFactory'));

    return ngModuleWebpackModule[moduleName];
  }
}
