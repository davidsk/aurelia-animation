import { PageTransitionHook } from './page-transition-hook';

export class WelcomePage {
  static dependencies = [PageTransitionHook]  ;
  public message = 'Welcome to Aurelia 2!';
}
