// 响应式

function defineReactive(obj, key, val) {
    observe(val)
    Object.defineProperty(obj, key, {
        get() {
            console.log('get ' + key);
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                observe(newVal) //新值是对象的情况
                console.log('set ' + key + ':' + newVal);
                val = newVal
                return val
            }
        }
    })
}
function observe(obj) {
    if (typeof obj !== 'object' || obj == null) return //希望传入的是obj
    Object.keys(obj).forEach(key => {
        console.log(obj);
        defineReactive(obj, key, obj[key])
    })
}
// $set
function set(obj, key, val) {
    defineReactive(obj, key, val)
}
const obj = { foo: 'foo', bar: 'bar', baz: { a: 1 } }
observe(obj)
// defineReactive(obj, 'foo', 'foo')
obj.foo
obj.foo = 'foooooooo'
obj.bar
obj.bar = "barrrrrrrrrr"
obj.baz.a = 10
console.log(obj);

// Object.defineProperty()对数组无效
// 解决方法：替换数组实例的原型方法，让他们在修改数组的同时可以通知更新