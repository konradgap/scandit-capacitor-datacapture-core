import { MarginsWithUnit, Point, PointWithUnit, Quadrilateral, Rect, Anchor } from 'scandit-datacapture-frameworks-core';
import { HTMLElementState, HtmlElementPosition, HtmlElementSize } from 'scandit-datacapture-frameworks-core';
import { DataCaptureContext, Control, DataCaptureOverlay } from 'scandit-datacapture-frameworks-core';
import { FocusGesture, LogoStyle, ZoomGesture } from 'scandit-datacapture-frameworks-core';
import { BaseDataCaptureView, ignoreFromSerialization, DataCaptureViewListener } from 'scandit-datacapture-frameworks-core';
import { Optional } from '../definitions';

export class DataCaptureView {

  private baseDataCaptureView: BaseDataCaptureView;

  private get overlays(): DataCaptureOverlay[] {
    return this.baseDataCaptureView.overlays;
  }

  public get context(): DataCaptureContext | null {
    return this.baseDataCaptureView.context;
  }

  public set context(context: DataCaptureContext | null) {
    this.baseDataCaptureView.context = context
  }

  public get scanAreaMargins(): MarginsWithUnit {
    return this.baseDataCaptureView.scanAreaMargins;
  }

  public set scanAreaMargins(newValue: MarginsWithUnit) {
    this.baseDataCaptureView.scanAreaMargins = newValue;
  }

  public get pointOfInterest(): PointWithUnit {
    return this.baseDataCaptureView.pointOfInterest;
  }

  public set pointOfInterest(newValue: PointWithUnit) {
    this.baseDataCaptureView.pointOfInterest = newValue;
  }

  public get logoStyle(): LogoStyle {
    return this.baseDataCaptureView.logoStyle;
  }

  public set logoStyle(style: LogoStyle) {
    this.baseDataCaptureView.logoStyle = style;
  }

  public get logoAnchor(): Anchor {
    return this.baseDataCaptureView.logoAnchor;
  }

  public set logoAnchor(newValue: Anchor) {
    this.baseDataCaptureView.logoAnchor = newValue;
  }

  public get logoOffset(): PointWithUnit {
    return this.baseDataCaptureView.logoOffset;
  }

  public set logoOffset(newValue: PointWithUnit) {
    this.baseDataCaptureView.logoOffset = newValue;
  }

  public get focusGesture(): FocusGesture | null {
    return this.baseDataCaptureView.focusGesture;
  }

  public set focusGesture(newValue: FocusGesture | null) {
    this.baseDataCaptureView.focusGesture = newValue;
  }

  public get zoomGesture(): ZoomGesture | null {
    return this.baseDataCaptureView.zoomGesture;
  }

  public set zoomGesture(newValue: ZoomGesture | null) {
    this.baseDataCaptureView.zoomGesture = newValue;
  }
  
  @ignoreFromSerialization
  private htmlElement: Optional<HTMLElement> = null;

  @ignoreFromSerialization
  private _htmlElementState = new HTMLElementState();

  private set htmlElementState(newState: HTMLElementState) {
    const didChangeShown = this._htmlElementState.isShown !== newState.isShown;
    const didChangePositionOrSize = this._htmlElementState.didChangeComparedTo(newState);

    this._htmlElementState = newState;

    if (didChangePositionOrSize) {
      this.updatePositionAndSize();
    }

    if (didChangeShown) {
      if (this._htmlElementState.isShown) {
        this._show();
      } else {
        this._hide();
      }
    }
  }

  private get htmlElementState(): HTMLElementState {
    return this._htmlElementState;
  }

  @ignoreFromSerialization
  private scrollListener = this.elementDidChange.bind(this);
  @ignoreFromSerialization
  private domObserver = new MutationObserver(this.elementDidChange.bind(this));
  @ignoreFromSerialization
  private orientationChangeListener = (() => {
    this.elementDidChange();
    // SDC-1784 -> workaround because at the moment of this callback the element doesn't have the updated size.
    setTimeout(this.elementDidChange.bind(this), 100);
    setTimeout(this.elementDidChange.bind(this), 300);
    setTimeout(this.elementDidChange.bind(this), 1000);
  });

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public static forContext(context: Optional<DataCaptureContext>): DataCaptureView {
    const view = new DataCaptureView();
    view.context = context;
    return view;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public constructor() {
    this.baseDataCaptureView = new BaseDataCaptureView(null);
  }

  public connectToElement(element: HTMLElement): void {
    const viewId = (Date.now() / 1000) | 0;
    // add view to native hierarchy
    this.baseDataCaptureView.createNativeView(viewId).then( () => {
     
      this.htmlElement = element;
      this.htmlElementState = new HTMLElementState();

      // Initial update
      this.elementDidChange();

      this.subscribeToChangesOnHTMLElement();
    });
  }

  public detachFromElement(): void {
    this.unsubscribeFromChangesOnHTMLElement();
    this.htmlElement = null;
    this.elementDidChange();

    // Remove view from native hierarchy
    this.baseDataCaptureView.removeNativeView();
  }

  public async setFrame(frame: Rect, isUnderContent: boolean = false): Promise<void> {
    const viewId = (Date.now() / 1000) | 0;
    await this.baseDataCaptureView.createNativeView(viewId);
    return this.baseDataCaptureView.setFrame(frame, isUnderContent);
  }

  public show(): Promise<void> {
    if (this.htmlElement) {
      throw new Error("Views should only be manually shown if they're manually sized using setFrame");
    }

    return this._show();
  }

  public hide(): Promise<void> {
    if (this.htmlElement) {
      throw new Error("Views should only be manually hidden if they're manually sized using setFrame");
    }

    return this._hide();
  }

  public addOverlay(overlay: DataCaptureOverlay): Promise<void> {
    return this.baseDataCaptureView.addOverlay(overlay);
  }

  public removeOverlay(overlay: DataCaptureOverlay): Promise<void> {
    return this.baseDataCaptureView.removeOverlay(overlay);
  }

  public addListener(listener: DataCaptureViewListener): void {
    this.baseDataCaptureView.addListener(listener);
  }

  public removeListener(listener: DataCaptureViewListener): void {
    this.baseDataCaptureView.removeListener(listener);
  }

  public viewPointForFramePoint(point: Point): Promise<Point> {
    return this.baseDataCaptureView.viewPointForFramePoint(point);
  }

  public viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral): Promise<Quadrilateral> {
    return this.baseDataCaptureView.viewQuadrilateralForFrameQuadrilateral(quadrilateral);
  }

  public addControl(control: Control): void {
    this.baseDataCaptureView.addControl(control);
  }

  public addControlWithAnchorAndOffset(control: Control, anchor: Anchor, offset: PointWithUnit): void {
    return this.baseDataCaptureView.addControlWithAnchorAndOffset(control, anchor, offset);
  }

  public removeControl(control: Control): void {
    this.baseDataCaptureView.removeControl(control);
  }

  private subscribeToChangesOnHTMLElement(): void {
    this.domObserver.observe(document, { attributes: true, childList: true, subtree: true });
    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('orientationchange', this.orientationChangeListener);
  }

  private unsubscribeFromChangesOnHTMLElement(): void {
    this.domObserver.disconnect();
    window.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('orientationchange', this.orientationChangeListener);
  }

  private elementDidChange(): void {
    if (!this.htmlElement) {
      this.htmlElementState = new HTMLElementState();
      return;
    }

    const newState = new HTMLElementState();
    const boundingRect = this.htmlElement.getBoundingClientRect();
  
    newState.position = new HtmlElementPosition(boundingRect.top, boundingRect.left);
    newState.size = new HtmlElementSize(boundingRect.width, boundingRect.height);
    newState.shouldBeUnderContent = parseInt(this.htmlElement.style.zIndex || '1', 10) < 0
      || parseInt(getComputedStyle(this.htmlElement).zIndex || '1', 10) < 0;

    const isDisplayed = getComputedStyle(this.htmlElement).display !== 'none'
      && this.htmlElement.style.display !== 'none';

    const isInDOM = document.body.contains(this.htmlElement);
    newState.isShown = isDisplayed && isInDOM && !this.htmlElement.hidden;

    this.htmlElementState = newState;
  }

  private updatePositionAndSize(): void {
    if (!this.htmlElementState || !this.htmlElementState.isValid) {
      return;
    }

    this.baseDataCaptureView.setPositionAndSize(
      this.htmlElementState.position!.top,
      this.htmlElementState.position!.left,
      this.htmlElementState.size!.width,
      this.htmlElementState.size!.height,
      this.htmlElementState.shouldBeUnderContent,
    );
  }

  private _show(): Promise<void> {
    return this.baseDataCaptureView.show();
  }

  private _hide(): Promise<void> {
    return this.baseDataCaptureView.hide();
  }

  private toJSON(): object {
    return this.baseDataCaptureView.toJSON();
  }
}
