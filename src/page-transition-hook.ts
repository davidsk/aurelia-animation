import { lifecycleHooks } from "aurelia";
import { INavigationOptions, IRouteViewModel, Params, RouteNode } from "@aurelia/router";

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

  async attaching(vm): Promise<Animation> {
    console.log(`attaching: ${this.element}`);
    return await this.slideIn(this.element, this.backwards ? 'left': 'right');
  }

  unloading(viewModel: IRouteViewModel,
    next: RouteNode,
    current: RouteNode | null,
    options: INavigationOptions) {
    console.log("Unloading...");
    console.log({ viewModel, next, current, options });
    this.backwards = options.isBack;
  }
 
  async detaching(vm): Promise<Animation> {
    console.log(`detaching: ${this.element}`);
    return await this.slideOut(this.element, this.backwards ? 'right' : 'left');
  }

  private slideIn(element: HTMLElement, from: 'left' | 'right'): Promise<Animation> {
    const animation = element.children[0].animate([
      { transform: `translateX(${from === 'left' ? '-' : ''}100%)` },
      { transform: 'translateX(0)' }
    ], { duration: 300, easing: 'ease-out', fill: 'forwards' });

    return animation.finished;
  }

  private slideOut(element: HTMLElement, to: 'left' | 'right'): Promise<Animation> {
    const animation = element.children[0].animate([
      { transform: 'translateX(0)' },
      { transform: `translateX(${to === 'left' ? '-' : ''}100%)` }
    ], { duration: 300, easing: 'ease-in', fill: 'forwards' });

    animation.finished.then(() => {
      // Clear the previous element's content after the animation completes
      console.log(`Slide out animation finished for ${element}`);
    })
    
    return animation.finished;
  }
}   