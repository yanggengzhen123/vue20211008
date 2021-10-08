// 编译器
// 递归遍历dom树
// 判断节点类型，如果是文本，则判断是否是插值绑定
// 如果是元素，则遍历其属性判断是否是指令或事件，然后递归子元素
class Compile {
    // el是宿主元素 vm是vue实例
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)
        if (this.$el) {
            // 执行编译
            this.compile()
        }
    }
    compile() {
        // 遍历el树
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            // 判断是否是元素
            if (this.isElement(node)) {
                console.log('编译元素' + node.nodeName);
            } else if (this.isInter(node)) {
                console.log("编译插值绑定" + node.textContent);
            }
            // 如果是元素的话，还需要考虑递归子节点
            // 递归子节点
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }
}