var radius = 15
var nodeId = null
var div = document.createElement('div')

var callbacksOnStart = []
var callbacksOnEnd = []


div.style.boarderRadius = radius
div.style.background = '#767676'
div.setAttribute('id', 'tmpNode')
div.style.height = '30px'
div.style.width = '30px'
div.style.opacity = '0.5'
div.style.position = 'absolute'
div.style.visibility = 'hidden'

$(document).mousemove(function (e) {
    if (nodeId != null) {
        $("#tmpNode").css({left: e.pageX - 15, top: e.pageY - 15, cursor: 'pointer'});
    }
});
document.ontouchmove = function (e) {
    if (nodeId != null) {
        $("#tmpNode").css({left: e.targetTouches[0].pageX - 15, top: e.targetTouches[0].pageY - 15, cursor: 'pointer'});
    }
}
document.ondrag = function (e) {
    if (nodeId != null) {
        $("#tmpNode").css({left: e.pageX - 15, top: e.pageY - 15, cursor: 'pointer'});
    }
}

function registerDragZone(element, id) {
    element.onselectstart = function () {
        return false
    }
    element.onmousedown = function () {
        var mouseUp = false
        var moveX = 0
        var moveY = 0

        let onMouseMove = function (e) {
            if (!mouseUp) {
                if (moveX == 0 && moveY == 0) {
                    moveX = e.clientX
                    moveY = e.clientY
                } else {
                    if (Math.abs(moveX - e.clientX) > 10 || Math.abs(moveY - e.clientY) > 10) {
                        showNodePlaceHolder(id, e)
                        element.removeEventListener('mousemove', onMouseMove)
                    }
                }
            }
        }
        element.addEventListener('mousemove', onMouseMove)

        element.onmouseup = function () {
            mouseUp = true
            element.onmousemove = null
        }
    }

    element.ontouchstart = function () {
        var touchEnd = false
        var moveX = 0
        var moveY = 0

        let onTouchMove = function (e) {
            e.preventDefault();
            if (!touchEnd) {
                if (moveX == 0 && moveY == 0) {
                    moveX = e.targetTouches[0].clientX
                    moveY = e.targetTouches[0].clientY
                } else {
                    if (Math.abs(moveX - e.targetTouches[0].clientX) > 10 || Math.abs(moveY - e.targetTouches[0].clientY) > 10) {
                        showNodePlaceHolder(id, e)
                        notifyCallbacksForStart()
                        element.removeEventListener('touchmove', onTouchMove)
                    }
                }
            }
        }

        element.addEventListener('touchmove', onTouchMove)

        element.ontouchend = function () {
            touchEnd = true
            element.ontouchmove = null
        }
    }
    element.ondragstart = onDragStart

}

function showNodePlaceHolder(id, e) {
    nodeId = id
    setInitPositionOfPlaceHolder(e)
    setInitStyleOfPlaceHolder()
}

function setInitPositionOfPlaceHolder(e) {
    if (e.type == 'mousemove') {
        $("#tmpNode").css({left: e.pageX - 15, top: e.pageY - 15, cursor: 'pointer'});
    }
    if (e.type == 'touchmove') {
        $("#tmpNode").css({left: e.targetTouches[0].pageX - 15, top: e.targetTouches[0].pageY - 15, cursor: 'pointer'});
    }
}

function setInitStyleOfPlaceHolder() {
    div.style.visibility = 'visible'
    document.body.style["-webkit-touch-callout"] = "none"
    document.body.style["-webkit-user-select"] = "none"
    document.body.style["-khtml-user-select"] = "none"
    document.body.style["-moz-user-select"] = "none"
    document.body.style["-ms-user-select"] = "none"
    document.body.style["user-select"] = "none"
}

function setEndStyleOfPlaceHolder() {
    document.body.style["-webkit-touch-callout"] = ""
    document.body.style["-webkit-user-select"] = ""
    document.body.style["-khtml-user-select"] = ""
    document.body.style["-moz-user-select"] = ""
    document.body.style["-ms-user-select"] = ""
    document.body.style["user-select"] = ""

    div.style.visibility = 'hidden'
}

function onDragStart(e) {
    e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
}

function registerDropZone(onDrop) {
    function moveEnd(e) {
        var container = document.getElementById('ikc-visual')
        var containerBox = container.getBoundingClientRect()

        var dropX = 0
        var dropY = 0
        var element = null

        if (e.type == 'mouseup') {
            dropX = e.clientX
            dropY = e.clientY
        }

        if (e.type == 'touchend') {
            dropX = div.getBoundingClientRect().left
            dropY = div.getBoundingClientRect().top
        }


        var element = document.elementFromPoint(dropX, dropY)
        console.log(element)

        var dropOnContainer = containerBox.left < dropX && containerBox.right > dropX && containerBox.top < dropY && containerBox.bottom > dropY
        if (dropOnContainer) {
            onDrop({
                clientX: getOffset(div).left + radius,
                clientY: getOffset(div).top + radius,
                id: nodeId
            })
        }
        setEndStyleOfPlaceHolder()
        nodeId = null
        notifyCallbacksForEnd()
    }

    document.body.appendChild(div)

    document.addEventListener("mouseup", function (e) {
        if (nodeId != null) {
            moveEnd(e)
        }
    });
    document.addEventListener("drop", function (e) {
        if (nodeId != null) {
            moveEnd(e)
        }
    });
    document.addEventListener("touchend", function (e) {
        if (nodeId != null) {
            moveEnd(e)
        }
    });
}

function getOffset(el) {
    el = el.getBoundingClientRect();
    return {
        left: el.left + window.scrollX,
        top: el.top + window.scrollY
    }
}

function registerCallbackForStart(callback) {
    callbacksOnStart.push(callback)
}

function notifyCallbacksForStart() {
    callbacksOnStart.forEach((callback) = > {
        callback()
    }
)
}


function registerCallbackForEnd(callback) {
    callbacksOnEnd.push(callback)
}

function notifyCallbacksForEnd() {
    callbacksOnEnd.forEach((callback) = > {
        callback()
    }
)
}

