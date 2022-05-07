import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vdom";
import {reactMixin } from "./reactive";

function Vue(options) {
    this._init(options);
}

initMixin(Vue);
reactMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);


export default Vue;
