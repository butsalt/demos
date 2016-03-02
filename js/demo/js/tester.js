(function () {
    var timer = {};

    var isRunning = false;
    var startDate, endDate;

    function reset () {
        if (isRunning) {
            return;
        }
        startDate = null;
        endDate = null;
    }

    function start () {
        if (isRunning) {
            return;
        }
        isRunning = true;
        if (endDate) {
            endDate = null;
        } else {
            startDate = new Date();
        }
    }

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
        getDuration: function () {
            var duration = 0;
            if (startDate) {
                if (endDate) {
                    duration = endDate - startDate;
                } else {
                    duration = new Date() - startDate;
                }
            }

            return duration;
        },
        isRunning: function () {
            return isRunning;
        }
    };
})();
(function (doc, timer) {
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

    window.test = function (cb, title, needCounting) {
        var li = doc.createElement('li');
        var titleSpan = doc.createElement('span');
        var reportSpan = doc.createElement('span');

        li.appendChild(titleSpan);
        li.appendChild(reportSpan);

        var passed;
        timer.start();
        try {
            passed = cb() === true;
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
})(document, timer);