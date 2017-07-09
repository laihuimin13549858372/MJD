/**
 * Created by Administrator on 2017/6/17.
 */
window.onload = function () {
    // 快捷栏的出现与消失切换
    changeShortcutState();
    // 垃圾篓子 点击
    ashcanClick();

    // 选中盒子的点击
    checkBoxClick();
}

/* 垃圾篓子 点击
*  1.打开盖子(让up过渡效果旋转)
*
*  2.遮盖出现
*
*  3.jd_alert弹簧动画出现
*
* 4. cancle点击
*       4.1 盖子合上
*       4.2 alert以及遮盖消失
*
*  5.确定按钮点击(前两部和cancle一样)
*       5.3 删除当前的goods
*
* */
function ashcanClick() {
    // 1.拿标签
    var all_ashcan = document.getElementsByClassName('delete_goods');
    var jd_cover = document.getElementsByClassName('jd_alert_cover')[0];
    var jd_alert = jd_cover.getElementsByClassName('jd_alert')[0];

    var cancle = jd_alert.getElementsByClassName('left_cancle')[0];
    var sure = jd_alert.getElementsByClassName('right_sure')[0];

    // 2.每个垃圾篓子都添加tap事件
    var up; // 用来标记当前点击的垃圾篓子要打开的盖子
    for (var i = 0; i < all_ashcan.length; i++){
        (function (index) {
            var ashcan = all_ashcan[index];
            mjd.tap(ashcan, function (e) {
                // 2.1 拿到盖子
                up = ashcan.getElementsByClassName('up')[0];
                // 2.2 盖子旋转
                // 2.2.1 过渡效果
                up.style.transition = 'all .2s ease';
                up.style.webkitTransition = 'all .2s ease';
                // 2.2.2 打开的角度和旋转的圆心
                up.style.transformOrigin = 'right 3px';
                up.style.webkitTransformOrigin = 'right 3px';
                up.style.transform = 'rotate(30deg)';
                up.style.webkitTransform = 'rotate(30deg)';

                // 3.遮盖出现
                jd_cover.style.display = 'block';
                // 4.弹簧出现的动画
                jd_alert.className = 'jd_alert jd_spring_jump';
            });
        })(i);
    }

    mjd.tap(cancle, function (e) {
        up.style.transform = 'none';
        up.style.webkitTransform = 'none';

        /* 注意: display的切换,会导致 过渡/动画 效果的失效: 处理方式,可以通过 setTimeOut的时间差,将他们的效果隔离开 */
        setTimeout(function () {
            jd_cover.style.display = 'none';
        }, 201);
    })

    mjd.tap(sure, function (e) {
        up.style.transform = 'none';
        up.style.webkitTransform = 'none';

        /* 注意: display的切换,会导致 过渡/动画 效果的失效: 处理方式,可以通过 setTimeOut的时间差,将他们的效果隔离开 */
        setTimeout(function () {
            jd_cover.style.display = 'none';

            // 要拿到goods并且删除它
             for (var i = 0; i < all_ashcan.length; i = i+1)
            for (var ele = up; ele.className != 'ul_shop_goods'; ele = ele.parentNode){
                // console.log(ele);
                if (ele.className == 'goods'){
                    // 找他爹,让他爹删掉他
                    ele.parentNode.removeChild(ele);
                    break;
                }
            }


            // (function findGoods(ele) {
            //     // 递归结束的条件
            //     if (ele.className == 'goods'){
            //         // 找他爹,让他爹删掉他
            //         ele.parentNode.removeChild(ele);
            //         return;
            //     }
            //     // 递归的二重安全结束条件
            //     if (ele == document.body) return;
            //
            //     // 执行递归
            //     findGoods(ele.parentNode);
            // })(up);

        }, 201);


    })


}

/* 选中与否的点击
* ]
* */
function checkBoxClick() {
    // get elements
    var all_checkBox = document.getElementsByClassName('checkbox');

    // add tap events for every checkbox
    for (var i = 0; i < all_checkBox.length; i++){
        mjd.tap(all_checkBox[i], function (e) {
            var checkBox = e.target;
            if (checkBox.hasAttribute('checked')){
                checkBox.removeAttribute('checked');
            }else {
                checkBox.setAttribute('checked', '');
            }
        });
    }
}