# Async Functions in ES7

上次在[这篇文章](http://blog.xhu.me/post/67*ES6:%20%E5%9B%9E%E8%B0%83%E5%B0%86%E6%AD%BB,%20Promise%E6%B0%B8%E7%94%9F*20151018*JavaScript-Promise.md)里介绍了[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)的应用, 这是ES6里关于异步操作的解决方案, 但是这个方案其实有一些问题:

1. 如果使用的话, 那么基本上Promise的过程会'污染'整个代码, 整个代码会被then填满
2. 基于```resolve```/```reject```函数的处理方式, 看起来还是不够直观

所以在JS的世界里, 很需要一种侵入性不那么强而且易读的异步回调解决方案, ES7的规范里, ECMAScript又提出了async/await, 使用这个方案不用像Promise这样对异步过程改动太大, 而且阅读性也非常好. 这个方案的[spec](https://tc39.github.io/ecmascript-asyncawait/)已经完全确定下来了, 这里我就对这个spce做一个简单的讲解吧.

### 示例

    function chainAnimationsPromise(elem, animations) {
      let ret = null;
      let p = currentPromise;
      for(const anim of animations) {
        p = p.then(function(val) {
          ret = val;
          return anim(elem);
        })
      }
      return p.catch(function(e) {
        /* ignore and keep going */
      }).then(function() {
        return ret;
      });
    }
    
首先是Promise, 在这个例子里, 在for循环内部形成了Promise链, 这要求```animations```内部的每一个```anim```函数的返回值都是Promise, 最后结果的获取也是通过Promise进行的, 这样就对传统的代码编写方式进行了很大改动, 而且代码量也多了不少.

    function chainAnimationsGenerator(elem, animations) {
      return spawn(function*() {
        let ret = null;
        try {
          for(const anim of animations) {
            ret = yield anim(elem);
          }
        } catch(e) { /* ignore and keep going */ }
        return ret;
      });
    }

然后是```Generator```的方式, 这个例子在返回一个generator函数后, 虽然代码少了不少, 但是在调用的时候我们需要手动执行```next```方法, 并且一般使用Generator还需要在真正的星号函数外面加一个wrapper层, 这样一来, 还是不算简便.

    async function chainAnimationsAsync(elem, animations) {
      let ret = null;
      try {
        for(const anim of animations) {
          ret = await anim(elem);
        }
      } catch(e) { /* ignore and keep going */ }
      return ret;
    }

最后就是```async/await```方案了, 使用起来非常简单, 就是在声明有异步过程的函数的时候, 加上```async```关键字, 在执行异步操作的地方加上```await```关键字, 这样基本就可以用同步的写法来处理JS里的异步过程了.

