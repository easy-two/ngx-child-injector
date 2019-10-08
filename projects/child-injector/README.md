# ChildInjector

This package provides `ChildInjectorModule` and component for using Angular child injectors in Angular application without lazy loading and RouterModule.

Usage
-

Install the package and transformer:

```
npm i --save @easy-two/ngx-child-injector
```

or

```
yarn add @easy-two/ngx-child-injector @easy-two/ngx-child-injector-transformer
```

Import dependency in your code:

```
import { ChildInjectorModule } from '@easy-two/ngx-child-injector';
```

Add the code to imports of the parent module:
```
ChildInjectorModule.forModules([
  AnotherModule
])
```

And also import `ChildInjectorModule` and add next code to the imports block of `AnotherModule`:L

```
ChildInjectorModule.forChildModule([SomeComponent])
```

Somewhere in HTML of some component of your parent module [you need to add next HTML](https://github.com/easy-two/ng-child-module-injector/blob/master/examples/production-ready-child-modules-injector-example/src/app/app.component.html#L9) to render component:

```
<app-child-injector [component]="WithCustomInjectorComponent" [inputs]="inputs"></app-child-injector>
```

Note that `WithCustomInjectorComponent` have to be declared in the component class (it is just a reference to the component class you want to render).

Full example is available in [this github repo](https://github.com/easy-two/ng-child-module-injector/tree/master/examples/production-ready-child-modules-injector-example).

 

This code is part of article in AngularInDepth.
