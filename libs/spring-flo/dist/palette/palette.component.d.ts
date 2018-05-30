import { ElementRef, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { dia } from 'jointjs';
import { Flo } from '../shared/flo-common';
export declare class Palette implements OnInit, OnDestroy, OnChanges {
    private element;
    private document;
    metamodel: Flo.Metamodel;
    renderer: Flo.Renderer;
    paletteEntryPadding: dia.Size;
    paletteSize: number;
    onPaletteEntryDrop: EventEmitter<Flo.DnDEvent>;
    paletteReady: EventEmitter<boolean>;
    paletteFocus: EventEmitter<void>;
    private _paletteSize;
    private _filterText;
    private paletteGraph;
    private palette;
    private floaterpaper;
    private filterTextModel;
    private mouseMoveHanlder;
    private mouseUpHanlder;
    private _metamodelListener;
    /**
     * The names of any groups in the palette that have been deliberately closed (the arrow clicked on)
     */
    private closedGroups;
    /**
     * Model of the clicked element
     */
    private clickedElement;
    private viewBeingDragged;
    private initialized;
    constructor(element: ElementRef, document: any);
    onFocus(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private createPaletteGroup(title, isOpen);
    private createPaletteEntry(title, metadata);
    private buildPalette(metamodel);
    rebuildPalette(): void;
    filterText: string;
    private getPaletteView(view);
    private handleMouseUp(event);
    private trigger(event);
    private handleDrag(event);
    private rotateOpen(element);
    private doRotateOpen(element, angle);
    private doRotateClose(element, angle);
    private rotateClosed(element);
}
