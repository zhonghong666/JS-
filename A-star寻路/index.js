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
        console.log(this.data);
        this.setStyle();
        this.openArr = [this.start];
        this.closeArr = [...this.bar];
        this.el.innerHTML = this.data.map(item => {
            return `<span style="
                position:absolute;
                left:${item.x * this.rect}px;
                top:${item.y * this.rect}px;
                width:${this.rect}px;
                height:${this.rect}px;
                ${item.color?`background-color:`+item.color+';':''}
                border: 1px solid black;
                border-top: none;
                border-left: none;"
            ></span>`;
        }).join('');
    }
}



//估价函数 f(n) = g(n) + h(n)
function f(node){
    return g(node) + h(node);
}

function g(node, start){
    let a = node.offsetLeft - start.offsetLeft;
    let b = node.offsetTop - start.offsetTop;
    return Math.sqrt(a*a + b*b);
}

function h(node, end){
    let a = node.offsetLeft - end.offsetLeft;
    let b = node.offsetTop - end.offsetTop;
    return Math.sqrt(a*a + b*b);
}
//向open队列添加元素
function openAdd({openArr, closeArr, start}){
    let item = openArr.shift();
    if(item == start){
        return;
    }
    closeAdd(item, closeArr);
    findNode(item);
}
//向close队列添加元素
function closeAdd(node, closeArr){
    closeArr.push(node);
}

function findNode(node){

}