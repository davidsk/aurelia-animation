import { lifecycleHooks } from "aurelia";

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@lifecycleHooks()
export class PageTransitionHook {

  private currentElement: HTMLElement;
  private previousElement: HTMLElement;
  private backwards = false;

  created(vm, controller): void {
    if(this.currentElement){
      this.previousElement = this.currentElement;
    }
    this.currentElement = controller.host;
  }

  loaded(vm, params, next, current, options) {
    console.log("Loaded...");
    console.log({ vm, params, next, current, options });
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
    console.log(`attaching: ${this.currentElement}`);
    return await this.slideIn(this.currentElement, this.backwards ? 'left': 'right');
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
    console.log(`detaching: ${this.currentElement}`);
    return await this.slideOut(this.currentElement, this.backwards ? 'right' : 'left');
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