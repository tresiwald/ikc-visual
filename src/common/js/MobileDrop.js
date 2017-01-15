$(document).mousemove(function(e){
    $("#tmpNode").css({left:e.pageX - 15, top:e.pageY - 15});
});

document.ondrag = function (e) {
    $("#tmpNode").css({left:e.pageX - 15, top:e.pageY - 15});
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

function registerDragZone(id){
    nodeId = id
    div.style.visibility = 'visible'
}

function registerDropZone(onDrop){
    function moveEnd(e) {
        var container = document.getElementById('ikc-visual')
        var containerBox = container.getBoundingClientRect()

        var dropX = e.clientX
        var dropY = e.clientY

        var element = document.elementFromPoint(e.clientX, e.clientY)
        console.log(element)

        var dropOnContainer = containerBox.left < dropX && containerBox.right > dropX && containerBox.top < dropY && containerBox.bottom > dropY
        if(dropOnContainer){
            div.style.visibility = 'hidden'
            onDrop({
                clientX: getOffset(div).left + radius ,
                clientY: getOffset(div).top + radius,
                id: nodeId
            })
            nodeId = null
        }
    }
    document.body.appendChild(div)


    document.addEventListener("mouseup", function(e){
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



function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}