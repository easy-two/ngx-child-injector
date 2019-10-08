child-injector-transformer
-

You need this package to allow using ChildInjectorModule NgModule. It works with ViewEngine only. Ivy does not need it.

Ivy is not supported at the moment.

### Install
Install the package using npm manager:
```
npm i --save @easy-two/ngx-child-injector-transformer
```
or yarn:
```
yarn add @easy-two/ngx-child-injector-transformer
```

This package contains `typescript` transformer for using with `AngularCompilerPlugin`. The transformation in it allows you to use ChildInjectorModule with Ahead-of-Time compilation.

This transformer is part of article in AngularInDepth.
### Usage
If you use @angular/cli, you need to:
 - use custom angular builder like `@angular-builders/custom-webpack`
 - add webpack configuration to the project with code below and specify the path to it in angular.json file

angular.json
```
      "architect": {
        "build": {
          "builder": "@angular-builders/custom-webpack:browser",
          "options": {
            "customWebpackConfig": {
              "path":"./webpack.config.js"
            },
```

webpack.config.js
```
const { childInjectorModuleTransformer } = require('@easy-two/ngx-child-injector-transformer');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

module.exports = function (initial) {
  const AngularCompilerPluginInstance = initial.plugins.find(plugin => plugin instanceof AngularCompilerPlugin);

  const defaultsTransformers = AngularCompilerPluginInstance._transformers;
  AngularCompilerPluginInstance._transformers = [childInjectorModuleTransformer(), ...defaultsTransformers];

  return initial;
};
```

If you don't use @angular/cli you just need to add the transformer from the package to your webpack configuration like in example above.
