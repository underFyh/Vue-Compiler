import { compileToRenderFunction } from "./compiler/index";
import { mountComponent } from "./lifecycle";

function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        vm._initData(options);
        // 初始化 initState(vm);
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }

    }

    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
        vm.$el = el;

        // render函数 > template > el   模板的优先级
        if (!options.render) {
            let template = options.template;
            // 如果没有模板但是有el
            if (!template && el) {
                template = vm.$el.outerHTML;
            }
            console.log(template, 'ttt');

            // compiler/index.js
            const render = compileToRenderFunction(template);
            options.render = render;
        }

        // 执行mountComponent挂载虚拟节点, Vue的实例其实就是一个组件
        mountComponent(vm);
    }
}

export {
    initMixin
}
