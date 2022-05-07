function reactMixin(Vue) {
    Vue.prototype._initData = function (options) {
        const vm = this;
        vm.$data = options.data();
        for (let key in vm.$data) {
            Object.defineProperty(vm, key, {
                get() {
                    return vm.$data[key];
                },
                set(newVal) {
                    this.$data[key] = newVal;
                }
            })
        }
    }
}

export {
    reactMixin
}
