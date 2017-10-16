//计时器
(function () {
  var timer = {};

  //isRuning为true时，说明计时器正在计时
  var isRunning = false;
  var startDate, endDate;
  //已经经过的毫秒数
  var passedMillis = 0;

  //如果正在计时，则无效
  //如果未在计时，则清空计时记录
  function reset () {
    if (isRunning) {
      return;
    }
    startDate = null;
    endDate = null;
    passedMillis = 0;
  }

  //如果没有开始计时，则开始计时
  //如果正在计时，则无效
  //如果已经暂停，则继续计时
  function start () {
    if (isRunning) {
      return;
    }
    isRunning = true;
    if (endDate) {
      passedMillis += endDate - startDate;
      endDate = null;
    }
    startDate = new Date();
  }

  //如果正在计时，暂停计时
  //如果未在计时，则无效
  function pause () {
    if (isRunning) {
      isRunning = false;
      endDate = new Date();
    }
  }

  window.timer = {
    start: start,
    pause: pause,
    reset: reset,
    //返回已经经过的毫秒数
    //如果未开始计时，返回0
    //如果正在计时，返回从开始到现在已经经过的毫秒数
    //如果已经暂停，返回从开始到暂停经过的毫秒数
    getDuration: function () {
      var duration = passedMillis;
      if (startDate) {
        if (endDate) {
          duration += endDate - startDate;
        } else {
          duration += new Date() - startDate;
        }
      }

      return duration;
    },
    isRunning: function () {
      return isRunning;
    }
  };
})();
//由常用方法组合而成的工具对象，按照需要添加
(function () {
  function getType (val) {
    return Object.prototype.toString.call(val);
  }
  window.util = {
    //类型判断
    isObject: function(val){
      return typeof val === 'object';
    },
    isString: function(val){
      return getType(val) === '[object String]';
    },
    isNumber: function(val){
      return getType(val) === '[object Number]';
    },
    isArray: function(val){
      return getType(val) === '[object Array]';
    },
    isFunction: function(val){
      return getType(val) === '[object Function]';
    }
  };
})();
//组合成测试工具
(function (doc, timer, _) {
  var ul = doc.createElement('ul');

  function appendList () {
    doc.body.appendChild(ul);
    doc.removeEventListener('DOMContentLoaded', appendList);
  }
  doc.addEventListener('DOMContentLoaded', appendList);

  var STATUS_CLASS = {
    true: 'success-test-unit',
    false: 'error-test-unit'
  };

  var STATUS_REPORT = {
    true: '验证成功',
    false: '验证失败'
  };

  //参数列表：
  // Function 当函数的执行结果为true时，证明验证成功
  // String 用来标明验证目标的字符串
  // Boolean 为true时，证明要计算函数执行所耗费的时长
  window.test = function (cb, title, needCounting) {
    var li = doc.createElement('li');
    var titleSpan = doc.createElement('span');
    var reportSpan = doc.createElement('span');

    li.appendChild(titleSpan);
    li.appendChild(reportSpan);

    var passed;
    timer.start();
    try {
      passed = cb(_) === true;
    } catch (e) {
      passed = false;
    }
    timer.pause();
    li.classList.add(STATUS_CLASS[passed]);

    var report = STATUS_REPORT[passed];
    var duration;
    if (needCounting) {
      duration = timer.getDuration();
      report += '，耗时' + duration + '毫秒';
    }
    timer.reset();

    titleSpan.textContent = title + '：';
    reportSpan.textContent = report;

    ul.appendChild(li);
  };
})(document, timer, util);