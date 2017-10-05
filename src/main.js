import Vue from 'vue'
import App from './App'
import router from './router'
import AuthMixin from './mixins/Auth'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

Vue.use(Vuetify);

Vue.mixin(AuthMixin);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
