/**
 * @Author Mike白
 * @Date  2023/06/01
 * @FlyBird小游戏
 **/
!function () {
    const start = document.getElementById('start')
    const head = document.getElementById('head')
    const flyBird = document.getElementById('flyBird')
    const box = document.getElementById('box')
    const pipeBox = document.getElementById('pipeBox')
    const scoreBoard=document.getElementById('scoreBoard')
    const over = document.getElementById('over')
    const ok = document.getElementById('ok')

    const audios = document.getElementsByTagName('audio')


    let speed = 0, maxSpeed = 8
    let scoreNum=0

    let downTimer=null, upTimer=null,createPipeTimer=null
    function birdDown(){
        speed=0
        flyBird.src = 'img/down_bird0.png'
        /*每隔30毫秒，让小鸟的top，在下降 */
            downTimer = setInterval(function () {
            speed += .3//让小鸟自由落体
            flyBird.style.top = flyBird.offsetTop + speed + 'px'
                if (flyBird.offsetTop>=420){
                    gameOver()
                }
        }, 30)
    }

    function birdUp() {
        flyBird.src='img/up_bird1.png'

        //点击声音
        audios[1].play()
        //停止下降控制器
        clearInterval(downTimer)
        clearInterval(upTimer)
        maxSpeed=8
         upTimer = setInterval(function () {
             flyBird.style.top=flyBird.offsetTop-maxSpeed + 'px'
                maxSpeed-=.7

            if (maxSpeed<=0){
                clearInterval(upTimer)
                birdDown()
            }
            if (flyBird.offsetTop<=0){
                gameOver()
            }

        },30)
    }

    function isCrash (bird,pipe) {
        return !(bird.offsetLeft + bird.offsetWidth < pipe.parentNode.offsetLeft
            || bird.offsetTop + bird.offsetHeight < pipe.offsetTop
            || pipe.parentNode.offsetLeft + pipe.offsetWidth < bird.offsetLeft
            || pipe.offsetTop + pipe.offsetHeight < bird.offsetTop
        )
    }

    function gameOver() {

        console.log("啊！你死了!")

        clearInterval(upTimer)
        clearInterval(downTimer)
        clearInterval(createPipeTimer)

        const lis=pipeBox.getElementsByTagName('li')
        for (let li of lis ){
            clearInterval(li.pipeTimer)
        }

        box.onclick=null
        over.style.display='block'
        ok.style.display='block'
        audios[0].pause()
        audios[2].play()
    }

    ok.onclick=function (){
        location.reload()
    }

    start.onclick = function (event) {
        //取消事件冒泡
        const ev=event||window.event//如果event不存在，则把window赋值给ev
        if (ev.stopPropagation()){
            event.stopPropagation()//不支持IE
        }else {
             event.cancelBubble=true
            /*不符合W3C标准，而且只支持IE浏览器。所以很多时候，我们都要结合起来用。
            不过，cancelBubble在新版本chrome,opera浏览器中已经支持。*/
        }

        //游戏开始
        start.style.display = "none"
        head.style.display = "none"
        //flyBird出现
        flyBird.style.display = "block"

        //music
        audios[0].play()

        createPipeTimer=setInterval(function () {
            const li =document.createElement('li')
            const topHeight =Math.random()*(240-60)+60//240-60
            const bottomHeight = 300-topHeight
            li.innerHTML='<div class="topPipe" style="height: '+topHeight+'px"><img src="img/up_pipe.png"></div><div class="bottomPipe" style="height: '+bottomHeight+'px"><img src="img/down_pipe.png"></div>'
            pipeBox.appendChild(li)
            li.lock=false
            li.pipeTimer = setInterval(function () {
                li.style.left= li.offsetLeft-3+'px'
                if (li.offsetLeft<-70){
                    pipeBox.removeChild(li)
                }
                if (flyBird.offsetLeft>li.offsetLeft+li.offsetWidth&&!li.lock){
                    scoreNum++
                    li.lock=true
                    /*console.log(scoreNum)
                    scoreBoard.innerHTML='<img src="img/'+scoreNum+'.jpg">'*/
                    const scoreStr=scoreNum+''
                    scoreBoard.innerHTML=''
                    for (let i=0;i<scoreStr.length;i++){
                        const img =document.createElement('img')
                        img.src='img/'+scoreStr[i]+'.jpg'
                        scoreBoard.appendChild(img)
                    }
                }

                //撞管道死
                const topPipes=document.getElementsByClassName('topPipe')
                const bottomPipes =document.getElementsByClassName('bottomPipe')
                for (let i=0;i<topPipes.length;i++){
                    if (isCrash(flyBird,bottomPipes[i])||isCrash(flyBird,topPipes[i])){
                        clearInterval(li.pipeTimer)
                        gameOver()
                    }
                }
            },30)

        },3000)

        birdDown()

        box.onclick = birdUp
    }
}()
