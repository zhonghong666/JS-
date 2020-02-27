/*
    地图类
*/
class Map{
    constructor(el, width, height, rect = 20){
        this.el = el;
        this.rect = rect;
        this.row = Math.ceil(width / rect);
        this.cell = Math.ceil(width / rect);
        this.width = this.row * this.rect;
        this.height = this.cell * this.rect;
        this.data = Map.initData(this.row, this.cell);
        this.openArr = [];
        this.closeArr = [];
        this.start = null;
        this.end = null;
        this.bar = null;
    }
    //添加开始节点
    setStart(start){
        if(start instanceof Array){
            if(start.length < 1){
                throw Error("开始节点缺失！！！");
            }
            if(start.length > 1){
                throw Error("开始节点只能有一个！！！");
            }
        }
        start.type = 'start';
        if(this.include(start)){
            throw Error("开始节点位置被占用！！！");
        }
        for(let i = 0; i < this.data.length; i++) {
            let item = this.data[i];
            if(item.x == start.x && item.y == start.y){
                this.data[i] = start;
                break;
            }
        }
        this.start = start;
    }
    //添加结束节点
    setEnd(end){
        if(end instanceof Array){
            if(start.length < 1){
                throw Error("结束节点缺失！！！");
            }
            if(start.length > 1){
                throw Error("结束节点只能有一个！！！");
            }
        }
        end.type = 'end';
        if(this.include(end)){
            throw Error("结束节点位置被占用！！！");
        }
        for(let i = 0; i < this.data.length; i++) {
            let item = this.data[i];
            if(item.x == end.x && item.y == end.y){
                this.data[i] = end;
                break;
            }
        }
        this.end = end;
    }
    //添加障碍物
    setBar(bar){
        // bar.map(item => item.type = 'bar');
        for(let i = 0; i < this.data.length; i++) {
            let item = this.data[i];
            for(let j = 0; j < bar.length; j++){
                bar[j].type = 'bar';
                let ele = bar[j];
                if(item.x == ele.x && item.y == ele.y){
                    if(item.type){
                        throw Error(`第${j+1}个障碍物的位置被占用！！！`);
                    }
                    this.data[i] = bar[j];
                    break;
                }
            }
        }
        this.bar = bar;
    }
    //判断节点是否存在
    include({x, y, type}){
        return this.data.some(item => item.x == x && item.y == y && type && item.type);
    }
    static initData(row, cell){
        let data = [];
        for(let i = 0; i < row; i++){
            for(let j = 0; j < cell; j++){
                data.push({
                    x: i,
                    y: j
                });
            }
        }
        return data;
    }
    setStyle(){
        this.el.style['width'] = this.width + 1 + 'px';
        this.el.style['height'] = this.height + 1 + 'px';
        this.el.style['border'] = '1px solid black';
        this.el.style['border-right'] = 'none';
        this.el.style['border-bottom'] = 'none';
        this.el.style['position'] = 'relative';
        this.el.style['margin'] = '0 auto';
    }
    //渲染地图
    render(){
        this.setStyle();
        this.data.map(item => {
            let span = document.createElement('span');
            span.style.position = 'absolute';
            span.style.left = item.x * this.rect + 'px';
            span.style.top = item.y * this.rect + 'px';
            span.style.width = this.rect + 'px';
            span.style.height = this.rect + 'px';
            if(item.color){
                span.style.backgroundColor = item.color;
            }
            span.style.borderRight = '1px solid black';
            span.style.borderBottom = '1px solid black';
            this.el.appendChild(span);
            switch(item.type){
                case 'start':
                    this.start = span;
                    this.openArr.push(span);
                    break;
                case 'bar':
                    this.closeArr.push(span);
                    break;
                case 'end':
                    this.end = span;
                    break;
            }
        });
    }
}

let openArr = null;
let closeArr = null;
let start = null;
let end = null;
let rect = null;
let path = [];

//估价函数 f(n) = g(n) + h(n)
function f(node){
    return g(node) + h(node);
}

function g(node){
    let a = node.offsetLeft - start.offsetLeft;
    let b = node.offsetTop - start.offsetTop;
    return Math.sqrt(a*a + b*b);
}

function h(node){
    let a = node.offsetLeft - end.offsetLeft;
    let b = node.offsetTop - end.offsetTop;
    return Math.sqrt(a*a + b*b);
}

//向open队列添加元素
let pv = 0;
function openAdd(map){
    if(pv == 0){
        openArr = map.openArr;
        closeArr = map.closeArr;
        start = map.start;
        end = map.end;
        rect = map.rect;
        pv++;
    }
    let item = openArr.shift();
    if(item == end){
        showPath();
        return;
    }
    closeAdd(item);
    findNode(item);
    openArr.sort((first, second) => {
        return first.num - second.num;
    })
    openAdd(map);
}
//向close队列添加元素
function closeAdd(node){
    closeArr.push(node);
}

function findNode(node){
    let result = [];
    let allSpan = document.querySelectorAll('span');
    allSpan.forEach(item => {
        if(filter(item)){
            result.push(item);
        }
    })
    result.forEach(item => {
        if((Math.abs(node.offsetLeft - item.offsetLeft) <= (rect + 1)) && (Math.abs(node.offsetTop - item.offsetTop) <= (rect + 1))){
            item.num = f(item);
            item.parent = node;
            openArr.push(item);
        }
    })
}

function filter(node){
    for(let i = 0; i < openArr.length; i++){
        if(node == openArr[i]){
            return false;
        }
    }
    for(let i = 0; i < closeArr.length; i++){
        if(node == closeArr[i]){
            return false;
        }
    }
    return true;
}

function findParent(node){
    path.unshift(node);
    console.log(path);
    if(node.parent == undefined || node.parent == start){
        return;
    }
    findParent(node.parent);
}

function showPath(){
    let last = closeArr.pop();
    let now = 0;
    findParent(last);
    let timer = setInterval(() => {
        path[now].style.backgroundColor = 'red';
        now++;
        if(now == path.length){
            clearInterval(timer);
        }
    }, 500);
}