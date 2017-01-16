$(document).mousemove(function(e){
    if(nodeId != null) {
        $("#tmpNode").css({left: e.pageX - 15, top: e.pageY - 15,  cursor: 'pointer'});
    }
});

document.ondrag = function (e) {
    if(nodeId != null) {
        $("#tmpNode").css({left: e.pageX - 15, top: e.pageY - 15,  cursor: 'pointer'});
    }
}

var radius = 15
var nodeId = null
var div = document.createElement('div')
div.style.boarderRadius = radius
div.style.background = '#767676'
div.setAttribute('id','tmpNode')
div.style.height = '30px'
div.style.width = '30px'
div.style.opacity = '0.5'
div.style.position = 'absolute'
div.style.visibility = 'hidden'

function registerDragZone(id, event){
    nodeId = id
    $("#tmpNode").css({left: event.pageX - 15, top: event.pageY - 15,  cursor: 'pointer'});
    div.style.visibility = 'visible'
    document.body.style["-webkit-touch-callout"] = "none"
    document.body.style["-webkit-user-select"] = "none"
    document.body.style["-khtml-user-select"] = "none"
    document.body.style["-moz-user-select"] = "none"
    document.body.style["-ms-user-select"] = "none"
    document.body.style["user-select"] = "none"
}

function registerDropZone(onDrop){
    var container = document.getElementById('ikc-visual')

    function moveEnd(e) {
        var containerBox = container.getBoundingClientRect()

        var dropX = e.clientX
        var dropY = e.clientY

        var element = document.elementFromPoint(e.clientX, e.clientY)
        console.log(element)

        var dropOnContainer = containerBox.left < dropX && containerBox.right > dropX && containerBox.top < dropY && containerBox.bottom > dropY
        if(dropOnContainer){
            onDrop({
                clientX: getOffset(div).left + radius ,
                clientY: getOffset(div).top + radius,
                id: nodeId
            })
        }

        document.body.style["-webkit-touch-callout"] = ""
        document.body.style["-webkit-user-select"] = ""
        document.body.style["-khtml-user-select"] = ""
        document.body.style["-moz-user-select"] = ""
        document.body.style["-ms-user-select"] = ""
        document.body.style["user-select"] = ""
    }
        div.style.visibility = 'hidden'
        nodeId = null
    }
    document.body.appendChild(div)

    document.addEventListener("mouseup", function(e){
        if(nodeId != null){
            moveEnd(e)
        }
    });
    document.addEventListener("drop", function(e){
        if(nodeId != null){
            moveEnd(e)
        }
    });


    document.addEventListener("touchmove",  function(e){
        ele = document.elementFromPoint(e.targetTouches[0].clientX,e.targetTouches[0].clientY)
        if(ele.parentElement && ele.parentElement.parentElement && ele.parentElement.parentElement.id == 'ikc-visual'){

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
