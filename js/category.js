/**
 * Created by Administrator on 2017/6/15.
 */
window.onload = function () {
     // 重置main的高度
    resetMainH();

    // 让底部主要内容能活动
    activeCategoryMain();

    // 快捷栏的出现与消失切换
    changeShortcutState();
}

window.onresize = function () {
    setTimeout(function () {
        resetMainH();
    }, 111);
}

/** 重置main的高度
 *  mainH = screenH - headerH
 * */
function resetMainH() {
    // 1.获取标签
    var header = document.getElementsByClassName('jd_base_header')[0];
    var mainBox = document.getElementsByClassName('jd_category_main')[0];
    // 2.获取用到的参数

    var screenH = window.screen.height;
    // console.log(window.screen.height);
    // console.log(window.screen.availHeight);
    var headerH = header.offsetHeight;
    var mainH = screenH - headerH;
    // 3.赋值
    mainBox.style.height = mainH + 'px';
}

/*
* 让分类的主要内容动起来
* 1. 左边列表动起来, 左边列表的选中切换效果也动起来
*
* 2. 右边内容也动起来
*
* */
function activeCategoryMain() {
    // 1.拿到标签
    var mainBox = document.getElementsByClassName('jd_category_main')[0];
    var main_left = mainBox.getElementsByClassName('category_main_left')[0];
    var main_right = mainBox.getElementsByClassName('category_main_right')[0];
    var ul_list = main_left.getElementsByClassName('category_left_con')[0];
    var all_li = ul_list.getElementsByTagName('li');

    // 2.获取用到的参数
    var ul_list_topY = 0;
    var maxY = 0;
    var minY = mainBox.offsetHeight - ul_list.offsetHeight;
    var bufferH = 150;
    var buffer_minY = minY - bufferH;
    var buffer_maxY = maxY + bufferH;

    var startY,movingY,changedY;
    startY = 0;
    movingY = 0;
    changedY = 0;
    var tempY = 0;

    // 3.设置相应过渡效果
    // 3.1 设置过渡
    var setTransition = function () {
        ul_list.style.transition = 'all .2s ease';
        ul_list.style.webkitTransition = 'all .2s ease';
    }
    // 3.2 移除过渡效果
    var removeTransition = function () {
        ul_list.style.transition = 'none';
        ul_list.style.webkitTransition = 'none';
    }
    // 3.3 垂直方向位移
    var translateY = function (y) {
        ul_list.style.transform = 'translateY(' + y + 'px)';
        ul_list.style.webkitTransform = 'translateY(' + y + 'px)';
    }


    // 4.滑动手势
    // 4.1 触摸开始
    ul_list.addEventListener('touchstart', function (e) {
        // 记录触摸点
        startY = e.touches[0].clientY;
    });
    // 4.2 滑动中
    ul_list.addEventListener('touchmove', function (e) {
        // 清除默认效果
        e.preventDefault();
        // 拿到移动向量
        movingY = e.touches[0].clientY;
        changedY = movingY - startY;
        // 根据移动过的向量,获得临时Y值
        tempY = ul_list_topY + changedY;

        // console.log(tempY);
        removeTransition();
        // tempY 的生效范围  buffer_minY < tempY < buffer_maxY
        // 注意:并未限制 tempY 的取值
        if(tempY > buffer_minY &&　tempY < buffer_maxY){
            translateY(tempY);
        }

    });
    // 4.3 手势结束
    ul_list.addEventListener('touchend', function (e) {
        // 记录y值变化
        ul_list_topY = tempY;
        // 对y值,进行合理化
        if (ul_list_topY > maxY){// 超过最大的,就变回最大的
            ul_list_topY = maxY;
            setTransition();
        }else if(ul_list_topY < minY){// 小于最小的,就变回最小的
            ul_list_topY = minY;
            setTransition();
        }else { // 如果在正常范围内,就不需要过渡效果
            removeTransition();
        }
        translateY(ul_list_topY);

        // 数据还原
        startY = 0;
        movingY = 0;
        changedY = 0;
        tempY = 0;
    });


   // 5.选中切换: 先取消选中,在把点击的li的className设置一下即可
    mjd.tap(ul_list, function (e) {
        // console.log(e.target);
        // 1.拿到当前点击的li
        var cur_li = e.target;
        if (e.target.parentNode.className == 'category_left_con'){ // 当tap到的是li的时候
            cur_li = e.target;
        }else {
            cur_li = e.target.parentNode;
        }

        // 2.若当前是重复选中,那只进行位移
        if (cur_li.className == 'current'){
            // 先进行过渡到最顶部
            setTransition();
            ul_list_topY = -cur_li.index * cur_li.offsetHeight;
            if (ul_list_topY < minY) ul_list_topY = minY;
            // console.log(cur_li.index);
            translateY(ul_list_topY);
            /*
            * 潜在风险分析
            * cur_li.index 可能 是undefined
            * 当刚进入界面点击.默认选中的下标为0的li的时候,
            * 只要切换过选中就不会出现风险,也就是风险只存在于点击 已选中的下标为0的li的时候
            *
            * 所以,潜在风险可以排除
            * */

            return;
        }

        // 3.切换选中
        // 3.1 取消选中
        // console.log(ul_list.childNodes);
        // 注意:慎用childNodes
        for (var i = 0; i < all_li.length; i++){
            all_li[i].className = '';
            // for the translateY
            all_li[i].index = i;
        }
        // 3.2 设置选中
        cur_li.className = 'current';

        // 4.过渡位移
        setTransition();
        ul_list_topY = -cur_li.index * cur_li.offsetHeight;
        if (ul_list_topY < minY) ul_list_topY = minY;
        // console.log(cur_li.index);
        translateY(ul_list_topY);

        // 5.刷新右边数据
        main_right.style.display = 'none';
        setTimeout(function () {
            main_right.style.display = 'block';
        }, 222);
    })
}

