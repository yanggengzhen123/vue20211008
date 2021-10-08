// 创建构造函数
class zhenVue {
  constructor(option) {
    this.$option = option;
    this.$data = option.data;
    // 响应化处理
    observe(this.$data);
    // 代理 this.$data.xx ==> this.xx
    proxy(this, "$data");
    // 创建编译器
    new Compiler(option.el, this);
  }
}
// 根据对象类型决定如何做响应化
class Observer {
  constructor(value) {
    this.value = value;
    // 判断类型(是对象还是数组)
    if (typeof value === "object") {
      this.walk(value);
    }
  }
  // 对象数据响应化
  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
  // 数组数据响应化（待补充）
}
function observe(obj) {
  if (typeof obj !== "object" || obj == null) return; //希望传入的是obj
  // 创建Observer实例（根据对象类型决定如何做响应化）
  new Observer(obj);
}
// 响应式
function defineReactive(obj, key, val) {
  observe(val);
  Object.defineProperty(obj, key, {
    get() {
      console.log("get " + key);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        observe(newVal); //新值是对象的情况
        console.log("set " + key + ":" + newVal);
        val = newVal;
        return val;
      }
    },
  });
}
// 代理函数 this.$data.xx ==> this.xx
function proxy(vm, sourceKey) {
  //sourceKey $data
  Object.keys(vm[sourceKey]).forEach((key) => {
    // 将$data中的key代理到vm属性中
    Object.defineProperty(vm, key, {
      get() {
        return vm[sourceKey][key];
      },
      set(newVal) {
        vm[sourceKey][key] = newVal;
      },
    });
  });
}
// 观察者：保存更新函数，值发生变化调用更新函数
const watchers = [];
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;
    watchers.push(this);
  }
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
