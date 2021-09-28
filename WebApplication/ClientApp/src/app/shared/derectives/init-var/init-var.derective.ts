import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";

interface InitVarContext<T> {
  initVar: T;
}

{
  selector: "[initVar]"
}
export class InitVarDirective<T> implements OnInit {
  private _context: InitVarContext<T> = { initVar: null };

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<InitVarContext<T>
) {}

)
set initVar(value: T {
  this._context.initVar = value;
}

ngOnInit(): void {
  this.viewContainer.createEmbeddedView(this.templateRef, this._context);
}
}
