import { lifecycleHooks } from "aurelia";
import { INavigationOptions, IRouteViewModel, Params, RouteNode } from "@aurelia/router";
import { animate, JSAnimation } from 'animejs';

const libraryAnimateIn = (element) =>
  animate(
    element,
    {
      translateX: () => ['100%', '0%'],
      duration: 1000,
      easing: 'easeInOutQuart'
  });

const libraryAnimateOut = (element) =>
  animate(
    element,
    {
      translateX: () => ['0%', '100%'],
      duration: 1000,
      easing: 'easeInOutQuart',
  });

  const nativeAnimateIn = (element: HTMLElement) =>
      element.animate([
      { transform: `translateX(100%)` },
      { transform: 'translateX(0)' }
    ], { duration: 300, easing: 'ease-out', fill: 'forwards' }).finished;

 const nativeAnimateOut = (element: HTMLElement) =>
    element.animate([
      { transform: 'translateX(0)' },
      { transform: `translateX(-100%)` }
    ], { duration: 300, easing: 'ease-in', fill: 'backwards' }).finished;

@lifecycleHooks()
export class PageTransitionHook {

  private element: HTMLElement;
  private backwards = false;

  created(vm, controller): void {
    this.element = controller.host;
    this.element.style.outline = '1px solid red';
  }

  loading(viewModel: IRouteViewModel,
    params: Params,
    next: RouteNode,
    current: RouteNode | null,
    options: INavigationOptions) {
    console.log("Loading...");
    console.log({ viewModel, params, next, current, options });
    this.backwards = options.isBack;
  }

  async attaching(vm): Promise<Animation | JSAnimation> {
    console.log(`attaching: ${this.element}`);
    return this.slideIn(this.element);
  }

  unloading(viewModel: IRouteViewModel,
    next: RouteNode,
    current: RouteNode | null,
    options: INavigationOptions) {
    console.log("Unloading...");
    console.log({ viewModel, next, current, options });
    this.backwards = options.isBack;
  }
 
  async detaching(vm): Promise<Animation | JSAnimation> {
    console.log(`detaching: ${this.element}`);
    return this.slideOut(this.element);
  }

  private useLibrary = true;

  private slideIn(element: HTMLElement): Promise<Animation | JSAnimation> {
     return this.useLibrary
      ? libraryAnimateIn(element.children[0]).then()
      : nativeAnimateIn(element.children[0]);
  }

  private slideOut(element: HTMLElement): Promise<Animation | JSAnimation> {
    return this.useLibrary
      ? libraryAnimateOut(element.children[0]).then()
      : nativeAnimateOut(element.children[0]);
  }
}   