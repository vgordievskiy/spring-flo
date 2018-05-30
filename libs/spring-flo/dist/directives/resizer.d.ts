import { EventEmitter, ElementRef, OnInit, OnDestroy } from '@angular/core';
import 'rxjs/add/observable/fromEvent';
export declare class ResizerDirective implements OnInit, OnDestroy {
    private element;
    private document;
    private dragInProgress;
    private vertical;
    private first;
    private second;
    private _size;
    private _splitSize;
    private _subscriptions;
    private mouseMoveHandler;
    maxSplitSize: number;
    splitSize: number;
    sizeChange: EventEmitter<number>;
    resizerWidth: number;
    resizerHeight: number;
    resizerLeft: string;
    resizerTop: string;
    resizerRight: string;
    resizerBottom: string;
    constructor(element: ElementRef, document: any);
    private startDrag();
    private mousemove(event);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
