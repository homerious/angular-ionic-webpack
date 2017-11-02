# 基于webpack构建的angular 1.x工程（angular篇）  

&emsp;&emsp;上一篇[基于webpack构建的angular 1.x 工程（一）webpack篇](./webpack-part.md)里我们已经成功构建了整个项目的打包配置。
接下来我们要继续让angular在工程里跑起来。
## 首先要知道怎么改写
之前的工程由于是用gulp打包的，具体原理我不太懂，不过貌似会把所有的js自动注入到index.html中。
由于js很多，所以为了不互相干扰，产生全局变量污染的问题，它里面所有angular都是用立即执行函数表达式（IIFE）来写的：
```
(function(){
    'use strict';

    angular.module("app.core",[ 
        'ngCookies',
        'angular-cache'
    ]);
})();
```
&emsp;&emsp;这样的写法在webpack是不必要的了，webpack是根据js之间的依赖关系来加载打包项目的。
不同的模块之间webpack都会有标识来标志，所以不会说存在干扰和污染的问题。那我们应该怎么写呢？
要写成AMD/CMD规范形式的。为了方便理解，我们把立即执行函数表达式去掉，改成这样的：
```
const ngCookies = require('angular-cookies')
const ngCache = require('angular-cache')
module.exports = angular.module("app.core",[ 
                         ngCookies,
                         ngCache
                     ]);
```
&emsp;&emsp;这个是符合webpack要求的写法。首先先引入我们需要的模块，然后编写我们的模块，最后输出我们要暴露给外部调用的接口。
于是我就把所有IIFE都改成了这种形式。
## controller那些要怎么办？
接下来问题就来了，在同一个angular应用模块（module）中，各个控制器（controller）、过滤器（filters）、服务（services）等之间都是并列的兄弟关系，都是从属于模块。
那我们应该来处理这些关系呢？
经过查阅过别人的项目之后，我发现其实有两种写法：
1. 把各个从属的具体方法都写成一个模块，然后在模块声明时进行引入并声明，就像这样：
>main.controller.js
```
module.exports =function mainCtrl($scope, $http, $stateParams, $state, $rootScope, $filter) {
    // your controller goes here
}
```
>index.js
```
angular.module("app",[])
    .controller("mainCtrl",  [$scope, $http, $stateParams, $state, $rootScope, $filter,require('./main.controller')]);
```
&emsp;&emsp;这样的其实也可以输出一个数组，像这样：
>main.controller.js
```
module.exports =[[$scope, $http, $stateParams, $state, $rootScope, $filter, function mainCtrl($scope, $http, $stateParams, $state, $rootScope, $filter) {
    // your controller goes here
}]
```
&emsp;&emsp;相对应的，主要入口要这样写：
>index.js
```
angular.module("app",[])
    .controller("mainCtrl",  require('./main.controller'));
```
&emsp;&emsp;这样的写法适合从头开始的项目，好处是分的比较清晰。
但是对于我这个重构的项目，就会有麻烦：要改写的文件有太多了。
这么麻烦，我只能抛弃这种方式。

2. 每个模块都直接输出的是模块声明，然后只要把这个文件引入即可。
&emsp;&emsp;熟悉angular的都知道，angular在整个应用中其实一个全局定义的对象。
每个模块在angular里注册之后，都会在angular里找得到。
这样的话，只要确保运行下面这段代码即可：
```
angular.module("app")
    .controller("mainCtrl",  [$scope,mainCtrl($scope){
      // your controller goes here
    }]);
```
&emsp;&emsp;也就是说，我只要引用了这段代码，也算把这段代码运行了。
那这样的我就可以这样写：
>main.controller.js
```
module.exports = angular.module("app")
    .controller("mainCtrl",  [$scope,mainCtrl($scope){
      // your controller goes here
    }]);
```
>index.js
```
angular.module("app",[])
require('./main.controller')
```
&emsp;&emsp;在`main.controller.js`我直接输出的是angular声明app模块的controller，然后在`index.js`定义模块之后,把这个文件引入之后，就相当于同时声明了这个controller，免去大量改动代码的麻烦。
不过另一个问题出现了：我这里虽然免去了大量改动代码的麻烦，但是我那么多的controller，真的要一一写路径来引用吗？这样还是麻烦啊。
不要惊慌。webpack已经预想到你这有这个问题了，特意写了一个可以引用大量文件的方法给你：`require.context`。
这个方法可以让你查询指定路径的指定文件类型，然后引用进来。
我们这里由于已经分类放好了，所有的controller都放在`/app/module`目录下面，因此查找也是轻而易举的事。所以我们的`index.js`可以写成这样：
```
module.exports = angular.module("app",[]);

//把所有js文件引入
function importAll (r) {
    r.keys().forEach(r);
}
importAll(require.context('./', true, /\.js$/));

```
&emsp;&emsp;这样就解决了那些controller，filters等的问题。具体`require.context`的用法[参考这里]()
## 模块之间引用的问题
&emsp;&emsp;当我们往我们的模块注入其他模块（自己写的或者angular插件）的时候，这个环节也有些要注意的地方。  
&emsp;&emsp;首先，我们知道，angular注入其他模块的时候，其实只需要写注入模块的名字就可以了，angular可以自行去寻找相应的模块。
这样的话，我们像上面那样写的模块声明，直接输出其实会有问题：
>app.core.module.js
```
module.exports = angular.module("app.core",[])
```
&emsp;&emsp;这里其实输出的是angular的模块，并不是模块的名字。如果我们直接引用的话，像这样：
>index.js
```
var appCore = require('./modules/appCore.module.js')
module.exports = angular.module("app",[appCore]);
```
&emsp;&emsp;这样的话，angular就会报错：
```
Error: [ng:areq] Argument 'module' is not a function, got Object
```
&emsp;&emsp;要解决这个问题其实很简单，只要调用angular的`.name`方法就可以了，所以上面可以改写成这样：
>app.core.module.js
```
module.exports = angular.module("app.core",[]).name
```
&emsp;&emsp;或者这样改：
>index.js
```
var appCore = require('./modules/appCore.module.js')
module.exports = angular.module("app",[appCore.name]);
```
&emsp;&emsp;两种方法选一个执行即可。 

&emsp;&emsp;其实如果是插件的话，你在`npm`安装的插件一般都不用担心这个问题，毕竟人家早就想到会有这个问题了。
但是如果是其他途径弄来的话，这个就复杂了。

## 插件注入的另一种问题
&emsp;&emsp;上面提到的是插件注入可能会遇到的问题之一。然而还有一种情况。
这种情况就是插件也使用了IIFE（立即执行函数表达式）。
听起来就很烦。自己的代码，自己知道怎么写的，所以改起来不会怎么出问题，但是别人的代码的话就不一定了。
为了避免错误，我选择不改动插件的代码。而是，直接在打包的时候分开打包，然后直接注入的时候写上插件名字即可以注入成功。详细可以看我的webpack配置。
 
以上就是用webpack打包angular 1.x 的时候写angular所需要注意的地方。如果想看webpack的配置可以查看我前一篇文章： 
  
  
[基于webpack构建的angular 1.x 工程（一）webpack篇](./webpack-part.md)
  
用于参考的一位前辈的类似项目,让大家也参考一下：  
[https://github.com/IamBusy/webpack-angular](https://github.com/IamBusy/webpack-angular)  
 
  
想看详细代码，可以访问我的项目地址  
[https://github.com/homerious/angular-ionic-webpack](https://github.com/homerious/angular-ionic-webpack)

有什么问题或者不对的地方欢迎指出，谢谢阅读！  

本文原创，未经授权请勿转载。
