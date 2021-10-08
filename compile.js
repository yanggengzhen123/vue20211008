// 编译器
// 递归遍历dom树
// 判断节点类型，如果是文本，则判断是否是插值绑定
// 如果是元素，则遍历其属性判断是否是指令或事件，然后递归子元素
class Compiler {
  // el是宿主元素 vm是vue实例
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    if (this.$el) {
      // 执行编译
      this.compile(this.$el);
    }
  }
  compile(el) {
    // 遍历el树
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      // 判断是否是元素
      if (this.isElement(node)) {
        console.log("编译元素" + node.nodeName);
        this.compileElement(node);
      } else if (this.isInter(node)) {
        console.log("编译插值绑定" + node.textContent);
        // node.textContent 从 {{counter}} 变成vm相对应的值
        this.compileText(node);
      }
      // 如果是元素的话，还需要考虑递归子节点
      // 递归子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }
  // node.nodeType === 1是元素，node.nodeType === 3是文本
  isElement(node) {
    return node.nodeType === 1;
  }
  isInter(node) {
    // 首先是文本标签，其次内容是{{xxx}} \是转义符 .代表若干字符,*代表若干个,()表示到时候可以通过RegExp.$1拿出来
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  compileText(node) {
    // node.textContent = this.$vm[RegExp.$1];
    this.update(node, RegExp.$1, "text");
  }
  //公共更新函数
  update(node, exp, dir) {
    // 1、初始化操作 node.textContent = this.$vm[RegExp.$1];
    // 指令对应更新函数xxupdater
    const fn = this[dir + "Updater"];
    fn && fn(node, this.$vm[exp]);

    // 更新处理 =>创建Watcher实例  第三个参数是更新函数(封装一个更新函数，可以更新对应dom元素)
    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val);
    });
  }
  textUpdater(node, value) {
    node.textContent = value;
  }
  compileElement(node) {
    //节点是元素
    // 遍历其属性列表
    const nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach((attr) => {
      // 规定:指令以z-xx="oo"定义
      const attrName = attr.name; //z-xx
      const exp = attr.value; //oo
      if (this.isDirective(attrName)) {
        //判断是否是指令(是否是z-开头)
        const dir = attrName.substring(2); //xx
        // 执行指令
        this[dir] && this[dir](node, exp);
      }
    });
  }
  isDirective(attr) {
    return attr.indexOf("z-") === 0;
  }

  // z-text
  text(node, exp) {
    this.update(node, exp, "text");
    // node.textContent = this.$vm[exp];
  }
  // z-html
  html(node, exp) {
    this.update(node, exp, "html");
    // node.innerHTML = this.$vm[exp];
  }
  htmlUpdater(node, value) {
    node.innerHTML = value;
  }
}
