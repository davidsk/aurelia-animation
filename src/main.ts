import Aurelia from 'aurelia';
import { RouterConfiguration } from '@aurelia/router';
import { PageTransitionHook } from './page-transition-hook';
import { MyApp } from './my-app';

Aurelia
//.register(PageTransitionHook)  
.register(RouterConfiguration)
  // To use HTML5 pushState routes, replace previous line with the following
  // customized router config.
  // .register(RouterConfiguration.customize({ useUrlFragmentHash: false }))
  .app(MyApp)
  .start();
