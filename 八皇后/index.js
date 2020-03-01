var name = 'M';
var obj = {
    name: 'K',
    prop: {
        name: 'A',
        getName: function(){
            return this.name;
        }
    }
}

console.log(obj.prop.getName());

var test = obj.prop.getName;

console.log(test());

console.log(new Proxy(obj,{
    get(){

    },
    set(){
        
    }
}))