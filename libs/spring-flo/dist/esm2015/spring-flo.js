import * as _joint from 'jointjs';
import { isFinite, template, isFunction, isEqual, partial, chain, omit, filter, each, isString, isNumber } from 'lodash';
import * as _$ from 'jquery';
import { Component, ElementRef, Input, Output, EventEmitter, Inject, ViewEncapsulation, Directive, NgModule } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { DOCUMENT } from '@angular/platform-browser';
import { CompositeDisposable, Disposable } from 'ts-disposables';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { sampleTime } from 'rxjs/operators/sampleTime';
import 'rxjs/add/observable/fromEvent';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { mergeMap } from 'rxjs/operators/mergeMap';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var Flo;
(function (Flo) {
    Flo.joint = _joint;
    class DnDEventType {
    }
    DnDEventType.DRAG = "DRAG";
    DnDEventType.DROP = "DROP";
    Flo.DnDEventType = DnDEventType;
    class Severity {
    }
    Severity.Error = 0;
    Severity.Warning = 1;
    Flo.Severity = Severity;
    function DnDEvent() { }
    Flo.DnDEvent = DnDEvent;
    function PropertyMetadata() { }
    Flo.PropertyMetadata = PropertyMetadata;
    function ExtraMetadata() { }
    Flo.ExtraMetadata = ExtraMetadata;
    function ElementMetadata() { }
    Flo.ElementMetadata = ElementMetadata;
    function ViewerDescriptor() { }
    Flo.ViewerDescriptor = ViewerDescriptor;
    function MetamodelListener() { }
    Flo.MetamodelListener = MetamodelListener;
    function Metamodel() { }
    Flo.Metamodel = Metamodel;
    function CreationParams() { }
    Flo.CreationParams = CreationParams;
    function ElementCreationParams() { }
    Flo.ElementCreationParams = ElementCreationParams;
    function LinkCreationParams() { }
    Flo.LinkCreationParams = LinkCreationParams;
    function EmbeddedChildCreationParams() { }
    Flo.EmbeddedChildCreationParams = EmbeddedChildCreationParams;
    function DecorationCreationParams() { }
    Flo.DecorationCreationParams = DecorationCreationParams;
    function HandleCreationParams() { }
    Flo.HandleCreationParams = HandleCreationParams;
    function Renderer() { }
    Flo.Renderer = Renderer;
    function EditorContext() { }
    Flo.EditorContext = EditorContext;
    function LinkEndDescriptor() { }
    Flo.LinkEndDescriptor = LinkEndDescriptor;
    function DnDDescriptor() { }
    Flo.DnDDescriptor = DnDDescriptor;
    function LinkEnd() { }
    Flo.LinkEnd = LinkEnd;
    function Marker() { }
    Flo.Marker = Marker;
    function Position() { }
    Flo.Position = Position;
    function Range() { }
    Flo.Range = Range;
    function Editor() { }
    Flo.Editor = Editor;
    function findMagnetByClass(view, className) {
        if (className && className.startsWith('.')) {
            className = className.substr(1);
        }
        return view.$('[magnet]').toArray().find((magnet) => magnet.getAttribute('class').split(/\s+/).indexOf(className) >= 0);
    }
    Flo.findMagnetByClass = findMagnetByClass;
    /**
     * @param {?} view
     * @param {?} port
     * @return {?}
     */
    function findMagnetByPort(view, port) {
        return view.$('[magnet]').toArray().find((magnet) => magnet.getAttribute('port') === port);
    }
    Flo.findMagnetByPort = findMagnetByPort;
    /**
     * Return the metadata for a particular palette entry in a particular group.
     * @param {?} metamodel
     * @param {?} name - name of the palette entry
     * @param {?} group - group in which the palette entry should exist (e.g. sinks)
     * @return {?}
     */
    function getMetadata(metamodel, name, group) {
        if (name && group && metamodel.get(group) && metamodel.get(group).get(name)) {
            return metamodel.get(group).get(name);
        }
        else {
            return {
                name: name,
                group: group,
                unresolved: true,
                get: (property) => new Promise(resolve => resolve()),
                properties: () => Promise.resolve(new Map())
            };
        }
    }
    Flo.getMetadata = getMetadata;
})(Flo || (Flo = {}));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const joint = Flo.joint;
const $ = _$;
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
const isFF = navigator.userAgent.indexOf("Firefox") > 0;
const IMAGE_W = 120;
const IMAGE_H = 35;
const ERROR_MARKER_SIZE = { width: 16, height: 16 };
const HANDLE_SIZE = { width: 10, height: 10 };
joint.shapes.flo = {};
joint.shapes.flo.NODE_TYPE = 'sinspctr.IntNode';
joint.shapes.flo.LINK_TYPE = 'sinspctr.Link';
joint.shapes.flo.DECORATION_TYPE = 'decoration';
joint.shapes.flo.HANDLE_TYPE = 'handle';
const HANDLE_ICON_MAP = new Map();
const REMOVE = 'remove';
HANDLE_ICON_MAP.set(REMOVE, 'icons/delete.svg');
const DECORATION_ICON_MAP = new Map();
const ERROR = 'error';
DECORATION_ICON_MAP.set(ERROR, 'icons/error.svg');
joint.util.filter.redscale = (args) => {
    let /** @type {?} */ amount = isFinite(args.amount) ? args.amount : 1;
    return template('<filter><feColorMatrix type="matrix" values="${a} ${b} ${c} 0 ${d} ${e} ${f} ${g} 0 0 ${h} ${i} ${k} 0 0 0 0 0 1 0"/></filter>', /** @type {?} */ ({
        a: 1 - 0.96 * amount,
        b: 0.95 * amount,
        c: 0.01 * amount,
        d: 0.3 * amount,
        e: 0.2 * amount,
        f: 1 - 0.9 * amount,
        g: 0.7 * amount,
        h: 0.05 * amount,
        i: 0.05 * amount,
        k: 1 - 0.1 * amount
    }));
};
joint.util.filter.orangescale = (args) => {
    let /** @type {?} */ amount = isFinite(args.amount) ? args.amount : 1;
    return template('<filter><feColorMatrix type="matrix" values="${a} ${b} ${c} 0 ${d} ${e} ${f} ${g} 0 ${h} ${i} ${k} ${l} 0 0 0 0 0 1 0"/></filter>', /** @type {?} */ ({
        a: 1.0 + 0.5 * amount,
        b: 1.4 * amount,
        c: 0.2 * amount,
        d: 0.3 * amount,
        e: 0.3 * amount,
        f: 1 + 0.05 * amount,
        g: 0.2 * amount,
        h: 0.15 * amount,
        i: 0.3 * amount,
        k: 0.3 * amount,
        l: 1 - 0.6 * amount
    }));
};
joint.shapes.flo.Node = joint.shapes.basic.Generic.extend({
    markup: '<g class="shape"><image class="image" /></g>' +
        '<rect class="border-white"/>' +
        '<rect class="border"/>' +
        '<rect class="box"/>' +
        '<text class="label"/>' +
        '<text class="label2"></text>' +
        '<rect class="input-port" />' +
        '<rect class="output-port"/>' +
        '<rect class="output-port-cover"/>',
    defaults: joint.util.deepSupplement({
        type: joint.shapes.flo.NODE_TYPE,
        position: { x: 0, y: 0 },
        size: { width: IMAGE_W, height: IMAGE_H },
        attrs: {
            '.': { magnet: false },
            // rounded edges around image
            '.border': {
                width: IMAGE_W,
                height: IMAGE_H,
                rx: 3,
                ry: 3,
                'fill-opacity': 0,
                // see through
                stroke: '#eeeeee',
                'stroke-width': 0
            },
            '.box': {
                width: IMAGE_W,
                height: IMAGE_H,
                rx: 3,
                ry: 3,
                //'fill-opacity':0, // see through
                stroke: '#6db33f',
                fill: '#eeeeee',
                'stroke-width': 1
            },
            '.input-port': {
                port: 'input',
                height: 8, width: 8,
                magnet: true,
                fill: '#eeeeee',
                transform: 'translate(' + -4 + ',' + ((IMAGE_H / 2) - 4) + ')',
                stroke: '#34302d',
                'stroke-width': 1
            },
            '.output-port': {
                port: 'output',
                height: 8, width: 8,
                magnet: true,
                fill: '#eeeeee',
                transform: 'translate(' + (IMAGE_W - 4) + ',' + ((IMAGE_H / 2) - 4) + ')',
                stroke: '#34302d',
                'stroke-width': 1
            },
            '.label': {
                'text-anchor': 'middle',
                'ref-x': 0.5,
                // jointjs specific: relative position to ref'd element
                // 'ref-y': -12, // jointjs specific: relative position to ref'd element
                'ref-y': 0.3,
                ref: '.border',
                // jointjs specific: element for ref-x, ref-y
                fill: 'black',
                'font-size': 14
            },
            '.label2': {
                'text': '\u21d2',
                'text-anchor': 'middle',
                'ref-x': 0.15,
                // jointjs specific: relative position to ref'd element
                'ref-y': 0.15,
                // jointjs specific: relative position to ref'd element
                ref: '.border',
                // jointjs specific: element for ref-x, ref-y
                transform: 'translate(' + (IMAGE_W / 2) + ',' + (IMAGE_H / 2) + ')',
                fill: 'black',
                'font-size': 24
            },
            '.shape': {},
            '.image': {
                width: IMAGE_W,
                height: IMAGE_H
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});
joint.shapes.flo.Link = joint.dia.Link.extend({
    defaults: joint.util.deepSupplement({
        type: joint.shapes.flo.LINK_TYPE,
        attrs: {
            '.connection': { stroke: '#34302d', 'stroke-width': 2 },
            // Lots of alternatives that have been played with:
            //	            '.smoooth': true
            //	            '.marker-source': { stroke: '#9B59B6', fill: '#9B59B6', d: 'M24.316,5.318,9.833,13.682,9.833,5.5,5.5,5.5,5.5,25.5,9.833,25.5,9.833,17.318,24.316,25.682z' },
            //	            '.marker-target': { stroke: '#F39C12', fill: '#F39C12', d: 'M14.615,4.928c0.487-0.986,1.284-0.986,1.771,0l2.249,4.554c0.486,0.986,1.775,1.923,2.864,2.081l5.024,0.73c1.089,0.158,1.335,0.916,0.547,1.684l-3.636,3.544c-0.788,0.769-1.28,2.283-1.095,3.368l0.859,5.004c0.186,1.085-0.459,1.553-1.433,1.041l-4.495-2.363c-0.974-0.512-2.567-0.512-3.541,0l-4.495,2.363c-0.974,0.512-1.618,0.044-1.432-1.041l0.858-5.004c0.186-1.085-0.307-2.6-1.094-3.368L3.93,13.977c-0.788-0.768-0.542-1.525,0.547-1.684l5.026-0.73c1.088-0.158,2.377-1.095,2.864-2.081L14.615,4.928z' },
            //	        	'.connection': { 'stroke':'black'},
            //	        	'.': { filter: { name: 'dropShadow', args: { dx: 1, dy: 1, blur: 2 } } },
            //	        	'.connection': { 'stroke-width': 10, 'stroke-linecap': 'round' },
            // This means: moveto 10 0, lineto 0 5, lineto, 10 10 closepath(z)
            //	        	'.marker-target': { d: 'M 5 0 L 0 7 L 5 14 z', stroke: '#34302d','stroke-width' : 1},
            //	        	'.marker-target': { d: 'M 14 2 L 9,2 L9,0 L 0,7 L 9,14 L 9,12 L 14,12 z', 'stroke-width' : 1, fill: '#34302d', stroke: '#34302d'},
            //	        	'.marker-source': {d: 'M 5 0 L 5,10 L 0,10 L 0,0 z', 'stroke-width' : 0, fill: '#34302d', stroke: '#34302d'},
            //	            '.marker-target': { stroke: '#E74C3C', fill: '#E74C3C', d: 'M 10 0 L 0 5 L 10 10 z' },
            '.marker-arrowheads': { display: 'none' },
            '.tool-options': { display: 'none' }
        },
    }, joint.dia.Link.prototype.defaults)
});
joint.shapes.flo.LinkView = joint.dia.LinkView.extend({
    options: joint.util.deepSupplement({}, joint.dia.LinkView.prototype.options),
    _beforeArrowheadMove: function () {
        if (this.model.get('source').id) {
            this._oldSource = this.model.get('source');
        }
        if (this.model.get('target').id) {
            this._oldTarget = this.model.get('target');
        }
        joint.dia.LinkView.prototype._beforeArrowheadMove.apply(this, arguments);
    },
    _afterArrowheadMove: function () {
        joint.dia.LinkView.prototype._afterArrowheadMove.apply(this, arguments);
        if (!this.model.get('source').id) {
            if (this._oldSource) {
                this.model.set('source', this._oldSource);
            }
            else {
                this.model.remove();
            }
        }
        if (!this.model.get('target').id) {
            if (this._oldTarget) {
                this.model.set('target', this._oldTarget);
            }
            else {
                this.model.remove();
            }
        }
        delete this._oldSource;
        delete this._oldTarget;
    }
});
// TODO: must do cleanup for the `mainElementView'
joint.shapes.flo.ElementView = joint.dia.ElementView.extend({
    // canShowTooltip: true,
    beingDragged: false,
    // _tempZorder: 0,
    _tempOpacity: 1.0,
    _hovering: false,
    pointerdown: function (evt, x, y) {
        // this.canShowTooltip = false;
        // this.hideTooltip();
        this.beingDragged = false;
        this._tempOpacity = this.model.attr('./opacity');
        this.model.trigger('batch:start');
        if (
        // target is a valid magnet start linking
        evt.target.getAttribute('magnet') &&
            this.paper.options.validateMagnet.call(this.paper, this, evt.target)) {
            let /** @type {?} */ link = this.paper.getDefaultLink(this, evt.target);
            if ($(evt.target).attr('port') === 'input') {
                link.set({
                    source: { x: x, y: y },
                    target: {
                        id: this.model.id,
                        selector: this.getSelector(evt.target),
                        port: evt.target.getAttribute('port')
                    }
                });
            }
            else {
                link.set({
                    source: {
                        id: this.model.id,
                        selector: this.getSelector(evt.target),
                        port: evt.target.getAttribute('port')
                    },
                    target: { x: x, y: y }
                });
            }
            this.paper.model.addCell(link);
            this._linkView = this.paper.findViewByModel(link);
            if ($(evt.target).attr('port') === 'input') {
                this._linkView.startArrowheadMove('source');
            }
            else {
                this._linkView.startArrowheadMove('target');
            }
            this.paper.__creatingLinkFromPort = true;
        }
        else {
            this._dx = x;
            this._dy = y;
            joint.dia.CellView.prototype.pointerdown.apply(this, arguments);
        }
    },
    pointermove: function (evt, x, y) {
        let /** @type {?} */ interactive = isFunction(this.options.interactive) ? this.options.interactive(this, 'pointermove') :
            this.options.interactive;
        if (interactive !== false && !this._linkView) {
            this.beingDragged = true;
            this.paper.trigger('dragging-node-over-canvas', { type: Flo.DnDEventType.DRAG, view: this, event: evt });
            this.model.attr('./opacity', 0.75);
        }
        joint.dia.ElementView.prototype.pointermove.apply(this, arguments);
    },
    pointerup: function (evt, x, y) {
        // jshint ignore:line
        delete this.paper.__creatingLinkFromPort;
        // this.canShowTooltip = true;
        if (this.beingDragged) {
            if (typeof this._tempOpacity === 'number') {
                this.model.attr('./opacity', this._tempOpacity);
            }
            else {
                // Joint JS view doesn't react to attribute removal.
                // TODO: fix in the mainElementView
                this.model.attr('./opacity', 1);
                //					this.model.removeAttr('./opacity');
            }
            this.paper.trigger('dragging-node-over-canvas', { type: Flo.DnDEventType.DROP, view: this, event: evt });
        }
        this.beingDragged = false;
        joint.dia.ElementView.prototype.pointerup.apply(this, arguments);
    },
});
joint.shapes.flo.ErrorDecoration = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"><image/></g></g>',
    defaults: joint.util.deepSupplement({
        type: joint.shapes.flo.DECORATION_TYPE,
        size: ERROR_MARKER_SIZE,
        attrs: {
            'image': ERROR_MARKER_SIZE
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});
var Constants;
(function (Constants) {
    Constants.REMOVE_HANDLE_TYPE = REMOVE;
    Constants.PROPERTIES_HANDLE_TYPE = 'properties';
    Constants.ERROR_DECORATION_KIND = ERROR;
    Constants.PALETTE_CONTEXT = 'palette';
    Constants.CANVAS_CONTEXT = 'canvas';
    Constants.FEEDBACK_CONTEXT = 'feedback';
})(Constants || (Constants = {}));
var Shapes;
(function (Shapes) {
    /**
     * @record
     */
    function CreationParams() { }
    Shapes.CreationParams = CreationParams;
    function ElementCreationParams() { }
    Shapes.ElementCreationParams = ElementCreationParams;
    function LinkCreationParams() { }
    Shapes.LinkCreationParams = LinkCreationParams;
    function EmbeddedChildCreationParams() { }
    Shapes.EmbeddedChildCreationParams = EmbeddedChildCreationParams;
    function DecorationCreationParams() { }
    Shapes.DecorationCreationParams = DecorationCreationParams;
    function HandleCreationParams() { }
    Shapes.HandleCreationParams = HandleCreationParams;
    function FilterOptions() { }
    Shapes.FilterOptions = FilterOptions;
    class Factory {
        /**
         * Create a JointJS node that embeds extra metadata (properties).
         * @param {?} params
         * @return {?}
         */
        static createNode(params) {
            let /** @type {?} */ renderer = params.renderer;
            let /** @type {?} */ paper = params.paper;
            let /** @type {?} */ metadata = params.metadata;
            let /** @type {?} */ position = params.position;
            let /** @type {?} */ props = params.props;
            let /** @type {?} */ graph = params.graph || (params.paper ? params.paper.model : undefined);
            let /** @type {?} */ node;
            if (!position) {
                position = { x: 0, y: 0 };
            }
            if (renderer && isFunction(renderer.createNode)) {
                node = renderer.createNode(metadata, props);
            }
            else {
                node = new joint.shapes.flo.Node();
                node.attr('.label/text', metadata.name);
            }
            node.set('type', joint.shapes.flo.NODE_TYPE);
            if (position) {
                node.set('position', position);
            }
            if (props) {
                Array.from(props.keys()).forEach(key => node.attr(`props/${key}`, props.get(key)));
            }
            node.attr('metadata', metadata);
            if (graph) {
                graph.addCell(node);
            }
            if (renderer && isFunction(renderer.initializeNewNode)) {
                let /** @type {?} */ descriptor = {
                    paper: paper,
                    graph: graph
                };
                renderer.initializeNewNode(node, descriptor);
            }
            return node;
        }
        /**
         * @param {?} params
         * @return {?}
         */
        static createLink(params) {
            let /** @type {?} */ renderer = params.renderer;
            let /** @type {?} */ paper = params.paper;
            let /** @type {?} */ metadata = params.metadata;
            let /** @type {?} */ source = params.source;
            let /** @type {?} */ target = params.target;
            let /** @type {?} */ props = params.props;
            let /** @type {?} */ graph = params.graph || (params.paper ? params.paper.model : undefined);
            let /** @type {?} */ link;
            if (renderer && isFunction(renderer.createLink)) {
                link = renderer.createLink(source, target, metadata, props);
            }
            else {
                link = new joint.shapes.flo.Link();
            }
            if (source) {
                link.set('source', source);
            }
            if (target) {
                link.set('target', target);
            }
            link.set('type', joint.shapes.flo.LINK_TYPE);
            if (metadata) {
                link.attr('metadata', metadata);
            }
            if (props) {
                Array.from(props.keys()).forEach(key => link.attr(`props/${key}`, props.get(key)));
            }
            if (graph) {
                graph.addCell(link);
            }
            if (renderer && isFunction(renderer.initializeNewLink)) {
                let /** @type {?} */ descriptor = {
                    paper: paper,
                    graph: graph
                };
                renderer.initializeNewLink(link, descriptor);
            }
            // prevent creation of link breaks
            link.attr('.marker-vertices/display', 'none');
            return link;
        }
        /**
         * @param {?} params
         * @return {?}
         */
        static createDecoration(params) {
            let /** @type {?} */ renderer = params.renderer;
            let /** @type {?} */ paper = params.paper;
            let /** @type {?} */ parent = params.parent;
            let /** @type {?} */ kind = params.kind;
            let /** @type {?} */ messages = params.messages;
            let /** @type {?} */ location = params.position;
            let /** @type {?} */ graph = params.graph || (params.paper ? params.paper.model : undefined);
            if (!location) {
                location = { x: 0, y: 0 };
            }
            let /** @type {?} */ decoration;
            if (renderer && isFunction(renderer.createDecoration)) {
                decoration = renderer.createDecoration(kind, parent);
            }
            else {
                decoration = new joint.shapes.flo.ErrorDecoration({
                    attrs: {
                        image: { 'xlink:href': DECORATION_ICON_MAP[kind] },
                    }
                });
            }
            decoration.set('type', joint.shapes.flo.DECORATION_TYPE);
            decoration.set('position', location);
            if ((isChrome || isFF) && parent && typeof parent.get('z') === 'number') {
                decoration.set('z', parent.get('z') + 1);
            }
            decoration.attr('./kind', kind);
            decoration.attr('messages', messages);
            if (graph) {
                graph.addCell(decoration);
            }
            parent.embed(decoration);
            if (renderer && isFunction(renderer.initializeNewDecoration)) {
                let /** @type {?} */ descriptor = {
                    paper: paper,
                    graph: graph
                };
                renderer.initializeNewDecoration(decoration, descriptor);
            }
            return decoration;
        }
        /**
         * @param {?} params
         * @return {?}
         */
        static createHandle(params) {
            let /** @type {?} */ renderer = params.renderer;
            let /** @type {?} */ paper = params.paper;
            let /** @type {?} */ parent = params.parent;
            let /** @type {?} */ kind = params.kind;
            let /** @type {?} */ location = params.position;
            let /** @type {?} */ graph = params.graph || (params.paper ? params.paper.model : undefined);
            let /** @type {?} */ handle;
            if (!location) {
                location = { x: 0, y: 0 };
            }
            if (renderer && isFunction(renderer.createHandle)) {
                handle = renderer.createHandle(kind, parent);
            }
            else {
                handle = new joint.shapes.flo.ErrorDecoration({
                    size: HANDLE_SIZE,
                    attrs: {
                        'image': {
                            'xlink:href': HANDLE_ICON_MAP[kind]
                        }
                    }
                });
            }
            handle.set('type', joint.shapes.flo.HANDLE_TYPE);
            handle.set('position', location);
            if ((isChrome || isFF) && parent && typeof parent.get('z') === 'number') {
                handle.set('z', parent.get('z') + 1);
            }
            handle.attr('./kind', kind);
            if (graph) {
                graph.addCell(handle);
            }
            parent.embed(handle);
            if (renderer && isFunction(renderer.initializeNewHandle)) {
                let /** @type {?} */ descriptor = {
                    paper: paper,
                    graph: graph
                };
                renderer.initializeNewHandle(handle, descriptor);
            }
            return handle;
        }
    }
    Shapes.Factory = Factory;
})(Shapes || (Shapes = {}));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const joint$1 = Flo.joint;
const $$1 = _$;
const DEBOUNCE_TIME = 300;
joint$1.shapes.flo.PaletteGroupHeader = joint$1.shapes.basic.Generic.extend({
    // The path is the open/close arrow, defaults to vertical (open)
    markup: '<g class="scalable"><rect/></g><text/><g class="rotatable"><path d="m 10 10 l 5 8.7 l 5 -8.7 z"/></g>',
    defaults: joint$1.util.deepSupplement({
        type: 'palette.groupheader',
        size: { width: 170, height: 30 },
        position: { x: 0, y: 0 },
        attrs: {
            'rect': { fill: '#34302d', 'stroke-width': 1, stroke: '#6db33f', 'follow-scale': true, width: 80, height: 40 },
            'text': {
                text: '',
                fill: '#eeeeee',
                'ref-x': 0.5,
                'ref-y': 7,
                'x-alignment': 'middle',
                'font-size': 18 /*, 'font-weight': 'bold', 'font-variant': 'small-caps', 'text-transform': 'capitalize'*/
            },
            'path': { fill: 'white', 'stroke-width': 2, stroke: 'white' /*,transform:'rotate(90,15,15)'*/ }
        },
        // custom properties
        isOpen: true
    }, joint$1.shapes.basic.Generic.prototype.defaults)
});
class Palette {
    /**
     * @param {?} element
     * @param {?} document
     */
    constructor(element, document) {
        this.element = element;
        this.document = document;
        this.paletteEntryPadding = { width: 12, height: 12 };
        this.onPaletteEntryDrop = new EventEmitter();
        this.paletteReady = new EventEmitter();
        this.paletteFocus = new EventEmitter();
        this._filterText = '';
        this.filterTextModel = new Subject();
        this.mouseMoveHanlder = (e) => this.handleDrag(e);
        this.mouseUpHanlder = (e) => this.handleMouseUp(e);
        this._metamodelListener = {
            metadataError: (data) => { },
            metadataAboutToChange: () => { },
            metadataChanged: () => this.rebuildPalette()
        };
        this.initialized = false;
        this.paletteGraph = new joint$1.dia.Graph();
        this.paletteGraph.set('type', Constants.PALETTE_CONTEXT);
        this._filterText = '';
        this.closedGroups = new Set();
    }
    /**
     * @param {?} size
     * @return {?}
     */
    set paletteSize(size) {
        console.log('Palette Size : ' + size);
        if (this._paletteSize != size) {
            this._paletteSize = size;
            this.rebuildPalette();
        }
    }
    /**
     * @return {?}
     */
    onFocus() {
        this.paletteFocus.emit();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        let /** @type {?} */ element = $$1('#palette-paper', this.element.nativeElement);
        // Create the paper for the palette using the specified element view
        this.palette = new joint$1.dia.Paper({
            el: element,
            gridSize: 1,
            model: this.paletteGraph,
            height: $$1(this.element.nativeElement.parentNode).height(),
            width: $$1(this.element.nativeElement.parentNode).width(),
            elementView: this.getPaletteView(this.renderer && this.renderer.getNodeView ? this.renderer.getNodeView() : joint$1.dia.ElementView)
        });
        this.palette.on('cell:pointerup', (cellview, evt) => {
            console.debug('pointerup');
            if (this.viewBeingDragged) {
                this.trigger({
                    type: Flo.DnDEventType.DROP,
                    view: this.viewBeingDragged,
                    event: evt
                });
                this.viewBeingDragged = undefined;
            }
            this.clickedElement = undefined;
            $$1('#palette-floater').remove();
            this.floaterpaper.remove();
        });
        // Toggle the header open/closed on a click
        this.palette.on('cell:pointerclick', (cellview, event) => {
            // TODO [design][palette] should the user need to click on the arrow rather than anywhere on the header?
            // Click position within the element would be: evt.offsetX, evt.offsetY
            let /** @type {?} */ element = cellview.model;
            if (cellview.model.attributes.header) {
                // Toggle the header open/closed
                if (element.get('isOpen')) {
                    this.rotateClosed(element);
                }
                else {
                    this.rotateOpen(element);
                }
            }
            // TODO [palette] ensure other mouse handling events do nothing for headers
            // TODO [palette] move 'metadata' field to the right place (not inside attrs I think)
        });
        $$1(this.document).on('mouseup', this.mouseUpHanlder);
        if (this.metamodel) {
            this.metamodel.load().then(data => {
                this.buildPalette(data);
                // Add listener to metamodel
                if (this.metamodel && this.metamodel.subscribe) {
                    this.metamodel.subscribe(this._metamodelListener);
                }
                // Add debounced listener to filter text changes
                this.filterTextModel
                    .pipe(debounceTime(DEBOUNCE_TIME))
                    .subscribe((value) => this.rebuildPalette());
                this.initialized = true;
            });
        }
        else {
            console.error('No Metamodel service specified for palette!');
        }
        this._paletteSize = this._paletteSize || $$1(this.element.nativeElement.parentNode).width();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.metamodel && this.metamodel.unsubscribe) {
            this.metamodel.unsubscribe(this._metamodelListener);
        }
        $$1(this.document).off('mouseup', this.mouseUpHanlder);
        this.palette.remove();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        console.log('Changed!!!');
        // if (changes.hasOwnProperty('paletteSize') || changes.hasOwnProperty('filterText')) {
        //   this.metamodel.load().then(metamodel => this.buildPalette(metamodel));
        // }
    }
    /**
     * @param {?} title
     * @param {?} isOpen
     * @return {?}
     */
    createPaletteGroup(title, isOpen) {
        let /** @type {?} */ newGroupHeader = new joint$1.shapes.flo.PaletteGroupHeader({ attrs: { text: { text: title } } });
        newGroupHeader.set('header', title);
        if (!isOpen) {
            newGroupHeader.attr({ 'path': { 'transform': 'rotate(-90,15,13)' } });
            newGroupHeader.set('isOpen', false);
        }
        this.paletteGraph.addCell(newGroupHeader);
        return newGroupHeader;
    }
    /**
     * @param {?} title
     * @param {?} metadata
     * @return {?}
     */
    createPaletteEntry(title, metadata) {
        return Shapes.Factory.createNode({
            renderer: this.renderer,
            paper: this.palette,
            metadata: metadata
        });
    }
    /**
     * @param {?} metamodel
     * @return {?}
     */
    buildPalette(metamodel) {
        let /** @type {?} */ startTime = new Date().getTime();
        this.paletteReady.emit(false);
        this.paletteGraph.clear();
        let /** @type {?} */ filterText = this.filterText;
        if (filterText) {
            filterText = filterText.toLowerCase();
        }
        let /** @type {?} */ paletteNodes = [];
        let /** @type {?} */ groupAdded = new Set();
        let /** @type {?} */ parentWidth = this._paletteSize;
        console.log(`Parent Width : ${parentWidth}`);
        // The field closedGroups tells us which should not be shown
        // Work out the list of active groups/nodes based on the filter text
        this.metamodel.groups().forEach(group => {
            if (metamodel.has(group)) {
                Array.from(metamodel.get(group).keys()).sort().forEach(name => {
                    let /** @type {?} */ node = metamodel.get(group).get(name);
                    let /** @type {?} */ nodeActive = !(node.metadata && node.metadata.noPaletteEntry);
                    if (nodeActive && filterText) {
                        nodeActive = false;
                        if (name.toLowerCase().indexOf(filterText) !== -1) {
                            nodeActive = true;
                        }
                        else if (group.toLowerCase().indexOf(filterText) !== -1) {
                            nodeActive = true;
                        }
                        // else if (node.description && node.description.toLowerCase().indexOf(filterText) !== -1) {
                        //   nodeActive = true;
                        // }
                        // else if (node.properties) {
                        //   Object.keys(node.properties).sort().forEach(function(propertyName) {
                        //     if (propertyName.toLowerCase().indexOf(filterText) !== -1 ||
                        //       (node.properties[propertyName].description &&
                        //       node.properties[propertyName].description.toLowerCase().indexOf(filterText) !== -1)) {
                        //       nodeActive=true;
                        //     }
                        //   });
                        // }
                    }
                    if (nodeActive) {
                        if (!groupAdded.has(group)) {
                            let /** @type {?} */ header = this.createPaletteGroup(group, !this.closedGroups.has(group));
                            header.set('size', { width: parentWidth, height: 30 });
                            paletteNodes.push(header);
                            groupAdded.add(group);
                        }
                        if (!this.closedGroups.has(group)) {
                            paletteNodes.push(this.createPaletteEntry(name, node));
                        }
                    }
                });
            }
        });
        let /** @type {?} */ cellWidth = 0, /** @type {?} */ cellHeight = 0;
        // Determine the size of the palette entry cell (width and height)
        paletteNodes.forEach(pnode => {
            if (pnode.attr('metadata/name')) {
                let /** @type {?} */ dimension = {
                    width: pnode.get('size').width,
                    height: pnode.get('size').height
                };
                if (cellWidth < dimension.width) {
                    cellWidth = dimension.width;
                }
                if (cellHeight < dimension.height) {
                    cellHeight = dimension.height;
                }
            }
        });
        // Adjust the palette entry cell size with paddings.
        cellWidth += 2 * this.paletteEntryPadding.width;
        cellHeight += 2 * this.paletteEntryPadding.height;
        // Align palette entries row to be at the center
        let /** @type {?} */ startX = parentWidth >= cellWidth ? (parentWidth - Math.floor(parentWidth / cellWidth) * cellWidth) / 2 : 0;
        let /** @type {?} */ xpos = startX;
        let /** @type {?} */ ypos = 0;
        let /** @type {?} */ prevNode;
        // Layout palette entry nodes
        paletteNodes.forEach(pnode => {
            let /** @type {?} */ dimension = {
                width: pnode.get('size').width,
                height: pnode.get('size').height
            };
            if (pnode.get('header')) {
                //attributes.attrs.header) {
                // Palette entry header
                xpos = startX;
                pnode.set('position', { x: 0, y: ypos });
                ypos += dimension.height + 5;
            }
            else {
                // Palette entry element
                if (xpos + cellWidth > parentWidth) {
                    // Not enough real estate to place entry in a row - reset x position and leave the y pos which is next line
                    xpos = startX;
                    pnode.set('position', { x: xpos + (cellWidth - dimension.width) / 2, y: ypos + (cellHeight - dimension.height) / 2 });
                }
                else {
                    // Enough real estate to place entry in a row - adjust y position
                    if (prevNode && prevNode.attr('metadata/name')) {
                        ypos -= cellHeight;
                    }
                    pnode.set('position', { x: xpos + (cellWidth - dimension.width) / 2, y: ypos + (cellHeight - dimension.height) / 2 });
                }
                // increment x position and y position (can be reorganized)
                xpos += cellWidth;
                ypos += cellHeight;
            }
            prevNode = pnode;
        });
        this.palette.setDimensions(parentWidth, ypos);
        this.paletteReady.emit(true);
        console.info('buildPalette took ' + (new Date().getTime() - startTime) + 'ms');
    }
    /**
     * @return {?}
     */
    rebuildPalette() {
        if (this.initialized && this.metamodel) {
            this.metamodel.load().then(metamodel => this.buildPalette(metamodel));
        }
    }
    /**
     * @param {?} text
     * @return {?}
     */
    set filterText(text) {
        if (this._filterText !== text) {
            this._filterText = text;
            this.filterTextModel.next(text);
        }
    }
    /**
     * @return {?}
     */
    get filterText() {
        return this._filterText;
    }
    /**
     * @param {?} view
     * @return {?}
     */
    getPaletteView(view) {
        let /** @type {?} */ self = this;
        return view.extend({
            pointerdown: function () {
                // Remove the tooltip
                // $('.node-tooltip').remove();
                // TODO move metadata to the right place (not inside attrs I think)
                self.clickedElement = this.model;
                if (self.clickedElement.attr('metadata')) {
                    $$1(self.document).on('mousemove', self.mouseMoveHanlder);
                }
            },
            pointermove: function () {
                // Nothing to prevent move within the palette canvas
            },
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleMouseUp(event) {
        $$1(this.document).off('mousemove', this.mouseMoveHanlder);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    trigger(event) {
        console.debug('EVENT: type=' + event.type + ' element=' + event.view.model.attr('metadata/name') + ' x=' + event.event.pageX + ' y=' + event.event.pageY);
        this.onPaletteEntryDrop.emit(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleDrag(event) {
        // TODO offsetX/Y not on firefox
        // console.debug("tracking move: x="+event.pageX+",y="+event.pageY);
        // console.log('Element = ' + (this.clickedElement ? this.clickedElement.attr('metadata/name') : 'null'));
        if (this.clickedElement && this.clickedElement.attr('metadata')) {
            if (!this.viewBeingDragged) {
                let /** @type {?} */ dataOfClickedElement = this.clickedElement.attr('metadata');
                // custom div if not already built.
                $$1('<div>', {
                    id: 'palette-floater'
                }).appendTo($$1('body'));
                let /** @type {?} */ floatergraph = new joint$1.dia.Graph();
                floatergraph.set('type', Constants.FEEDBACK_CONTEXT);
                this.floaterpaper = new joint$1.dia.Paper({
                    el: $$1('#palette-floater'),
                    elementView: this.renderer && this.renderer.getNodeView ? this.renderer.getNodeView() : joint$1.dia.ElementView,
                    gridSize: 10,
                    model: floatergraph,
                    height: 400,
                    width: 200,
                    validateMagnet: () => false,
                    validateConnection: () => false
                });
                // TODO float thing needs to be bigger otherwise icon label is missing
                // Initiative drag and drop - create draggable element
                let /** @type {?} */ floaternode = Shapes.Factory.createNode({
                    "renderer": this.renderer,
                    'paper': this.floaterpaper,
                    'graph': floatergraph,
                    'metadata': dataOfClickedElement
                });
                let /** @type {?} */ box = this.floaterpaper.findViewByModel(floaternode).getBBox();
                let /** @type {?} */ size = floaternode.get('size');
                // Account for node real size including ports
                floaternode.translate(box.width - size.width, box.height - size.height);
                this.viewBeingDragged = this.floaterpaper.findViewByModel(floaternode);
                $$1('#palette-floater').offset({ left: event.pageX + 5, top: event.pageY + 5 });
            }
            else {
                $$1('#palette-floater').offset({ left: event.pageX + 5, top: event.pageY + 5 });
                this.trigger({
                    type: Flo.DnDEventType.DRAG,
                    view: this.viewBeingDragged,
                    event: event
                });
            }
        }
    }
    /**
     * @param {?} element
     * @return {?}
     */
    rotateOpen(element) {
        setTimeout(() => this.doRotateOpen(element, 90));
    }
    /**
     * @param {?} element
     * @param {?} angle
     * @return {?}
     */
    doRotateOpen(element, angle) {
        angle -= 10;
        element.attr({ 'path': { 'transform': 'rotate(-' + angle + ',15,13)' } });
        if (angle <= 0) {
            element.set('isOpen', true);
            this.closedGroups.delete(element.get('header'));
            this.rebuildPalette();
        }
        else {
            setTimeout(() => this.doRotateOpen(element, angle), 10);
        }
    }
    /**
     * @param {?} element
     * @param {?} angle
     * @return {?}
     */
    doRotateClose(element, angle) {
        angle += 10;
        element.attr({ 'path': { 'transform': 'rotate(-' + angle + ',15,13)' } });
        if (angle >= 90) {
            element.set('isOpen', false);
            this.closedGroups.add(element.get('header'));
            this.rebuildPalette();
        }
        else {
            setTimeout(() => this.doRotateClose(element, angle), 10);
        }
    }
    /**
     * @param {?} element
     * @return {?}
     */
    rotateClosed(element) {
        setTimeout(() => this.doRotateClose(element, 0));
    }
}
Palette.decorators = [
    { type: Component, args: [{
                selector: 'flo-palette',
                template: `<div id="palette-filter" class="palette-filter">
  <input type="text" id="palette-filter-textfield" class="palette-filter-textfield" [(ngModel)]="filterText" (focus)="onFocus()"/>
</div>
<div id="palette-paper-container" style="height:calc(100% - 40px); width:100%; overflow:auto;">
  <div id="palette-paper" class="palette-paper" style="overflow:hidden;"></div>
</div>

`,
                styles: [`flo-view{width:100%;height:100%;margin:0;background-color:#eee;font-family:"Varela Round",sans-serif;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none}.canvas{border:1px solid #6db33f;border-radius:2px;margin-top:3px}.paper{padding:0;background-color:#fff}#sidebar-resizer{background-color:#34302d;position:absolute;top:0;bottom:0;width:6px;cursor:e-resize}#palette-container{background-color:#eee;position:absolute;top:0;bottom:0;left:0;overflow:auto}#paper-container{position:absolute;top:0;bottom:0;right:0;overflow:hidden;color:#fff}#palette-floater{width:170px;height:60px;opacity:.75;float:left;position:absolute;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none}.palette-filter{border:3px solid #6db33f}.palette-filter-textfield{width:100%;font-size:24px;font-family:"Varela Round",sans-serif}.palette-paper{background-color:#eee;border-color:#6db33f}.node-tooltip .tooltip-description{margin-top:5px;margin-left:0;margin-bottom:5px}.node-tooltip{display:none;position:absolute;border:1px solid #333;background-color:#34302d;border-radius:5px;padding:5px;color:#fff;font-family:"Varela Round",sans-serif;font-size:19px;z-index:100}.tooltip-title-type{font-size:24px;font-weight:700}.tooltip-title-group{padding-left:5px;font-size:20px;font-style:italic}.node-tooltip-option-name{font-family:monospace;font-size:17px;font-weight:700;padding-right:20px}.node-tooltip-option-description{font-family:"Varela Round",sans-serif;font-size:18px}.properties td{border-top:1px solid #34302d}.properties{border:8px #6db33f;margin-top:3px;background-color:#eee;font-family:monospace;z-index:2;position:absolute}.properties-node-name{width:100%;background:#34302d;color:#fff;padding-left:2px;border:0;font-size:18px;font-family:"Varela Round",sans-serif;font-weight:700}.properties-node-name-row{background:#34302d;width:100%;padding-left:2px}.properties-row-even{width:100%;border-top:1px #34302d;background-color:#fff}.properties-row-odd{width:100%;border-top:1px #34302d;background-color:#eee}.properties-row-text-even{background-color:#fff;border-left:0;border-right:0;border-bottom:0;border-top:1px #34302d}.properties-row-text-odd{background-color:#eee;border-left:0;border-right:0;border-bottom:0;border-top:1px #34302d}.properties-input{width:100%;font-size:18px;font-family:"Varela Round",sans-serif}.properties-key{width:30%;padding-left:2px;padding-right:4px}.properties-value{width:70%;padding-left:2px;padding-right:2px}.properties-table{border:1px solid #d1d1d1;padding:3px}.properties-new-property{color:#888}.error-tooltip p{margin-top:5px;margin-left:0;margin-bottom:5px;color:#fff}.error-tooltip{display:none;position:absolute;border:1px solid #333;background-color:red;border-radius:5px;padding:5px;color:#fff;font-family:"Varela Round",sans-serif;font-size:20px;z-index:100}.canvas-controls-container{position:absolute;right:15px;top:5px}.canvas-control{background:0 0;font-family:"Varela Round",sans-serif;font-size:11px;vertical-align:middle;margin:0}.zoom-canvas-control{border:0;padding:0;margin:0;outline:0}.zoom-canvas-input{text-align:right;font-weight:700;color:#000;background-color:transparent}.zoom-canvas-label{padding-right:4px;color:#000}.highlighted{outline:0}.joint-element.highlighted rect{stroke:#34302d;stroke-width:3}.joint-type-handle{cursor:pointer}.available-magnet{stroke-width:3}.link{fill:none;stroke:#ccc;stroke-width:1.5px}.link-tools .tool-options{display:none}.link-tools .tool-options circle{fill:transparent;stroke:transparent}.link-tools .tool-options path{fill:#000;stroke:#000}.link-tools .tool-remove circle{fill:red;stroke:red}.link-tools .tool-remove path{fill:#fff;stroke:#fff}.link-tools-container{stroke-width:0;fill:transparent}`],
                encapsulation: ViewEncapsulation.None
            },] },
];
/** @nocollapse */
Palette.ctorParameters = () => [
    { type: ElementRef, },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
];
Palette.propDecorators = {
    "metamodel": [{ type: Input },],
    "renderer": [{ type: Input },],
    "paletteEntryPadding": [{ type: Input },],
    "paletteSize": [{ type: Input },],
    "onPaletteEntryDrop": [{ type: Output },],
    "paletteReady": [{ type: Output },],
    "paletteFocus": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const joint$2 = Flo.joint;
const $$2 = _$;
class Utils {
    /**
     * @param {?} graph
     * @param {?} cell
     * @return {?}
     */
    static fanRoute(graph, cell) {
        if (cell instanceof joint$2.dia.Element) {
            chain(graph.getConnectedLinks(cell)).groupBy((link) => {
                // the key of the group is the model id of the link's source or target, but not our cell id.
                return omit([link.get('source').id, link.get('target').id], cell.id)[0];
            }).each((group, key) => {
                // If the member of the group has both source and target model adjust vertices.
                let /** @type {?} */ toRoute = {};
                if (key !== undefined) {
                    group.forEach((link) => {
                        if (link.get('source').id === cell.get('id') && link.get('target').id) {
                            toRoute[link.get('target').id] = link;
                        }
                        else if (link.get('target').id === cell.get('id') && link.get('source').id) {
                            toRoute[link.get('source').id] = link;
                        }
                    });
                    Object.keys(toRoute).forEach(key => {
                        Utils.fanRoute(graph, toRoute[key]);
                    });
                }
            });
            return;
        }
        // The cell is a link. Let's find its source and target models.
        let /** @type {?} */ srcId = cell.get('source').id || cell.previous('source').id;
        let /** @type {?} */ trgId = cell.get('target').id || cell.previous('target').id;
        // If one of the ends is not a model, the link has no siblings.
        if (!srcId || !trgId) {
            return;
        }
        let /** @type {?} */ siblings = filter(graph.getLinks(), (sibling) => {
            let /** @type {?} */ _srcId = sibling.get('source').id;
            let /** @type {?} */ _trgId = sibling.get('target').id;
            let /** @type {?} */ vertices = sibling.get('vertices');
            let /** @type {?} */ fanRouted = !vertices || vertices.length === 0 || sibling.get('fanRouted');
            return ((_srcId === srcId && _trgId === trgId) || (_srcId === trgId && _trgId === srcId)) && fanRouted;
        });
        switch (siblings.length) {
            case 0:
                // The link was removed and had no siblings.
                break;
            case 1:
                // There is only one link between the source and target. No vertices needed.
                let /** @type {?} */ vertices = cell.get('vertices');
                if (vertices && vertices.length && cell.get('fanRouted')) {
                    cell.unset('vertices');
                }
                break;
            default:
                // There is more than one siblings. We need to create vertices.
                // First of all we'll find the middle point of the link.
                let /** @type {?} */ source = graph.getCell(srcId);
                let /** @type {?} */ target = graph.getCell(trgId);
                if (!source || !target) {
                    // When clearing the graph it may happen that some nodes are gone and some are left
                    return;
                }
                let /** @type {?} */ srcCenter = (/** @type {?} */ (source)).getBBox().center();
                let /** @type {?} */ trgCenter = (/** @type {?} */ (target)).getBBox().center();
                let /** @type {?} */ midPoint = joint$2.g.line(srcCenter, trgCenter).midpoint();
                // Then find the angle it forms.
                let /** @type {?} */ theta = srcCenter.theta(trgCenter);
                // This is the maximum distance between links
                let /** @type {?} */ gap = 20;
                each(siblings, (sibling, index) => {
                    // We want the offset values to be calculated as follows 0, 20, 20, 40, 40, 60, 60 ..
                    let /** @type {?} */ offset = gap * Math.ceil(index / 2);
                    // Now we need the vertices to be placed at points which are 'offset' pixels distant
                    // from the first link and forms a perpendicular angle to it. And as index goes up
                    // alternate left and right.
                    //
                    //  ^  odd indexes
                    //  |
                    //  |---->  index 0 line (straight line between a source center and a target center.
                    //  |
                    //  v  even indexes
                    let /** @type {?} */ sign = index % 2 ? 1 : -1;
                    let /** @type {?} */ angle = joint$2.g.toRad(theta + sign * 90);
                    // We found the vertex.
                    let /** @type {?} */ vertex = joint$2.g.point.fromPolar(offset, angle, midPoint);
                    sibling.set('fanRouted', true);
                    (/** @type {?} */ (sibling)).set('vertices', [{ x: vertex.x, y: vertex.y }], { 'fanRouted': true });
                });
        }
    }
    /**
     * @param {?} args
     * @return {?}
     */
    static isCustomPaperEvent(args) {
        return args.length === 5 &&
            isString(args[0]) &&
            (args[0].indexOf('link:') === 0 || args[0].indexOf('element:') === 0) &&
            args[1] instanceof $$2.Event &&
            args[2] instanceof joint$2.dia.CellView &&
            isNumber(args[3]) &&
            isNumber(args[4]);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const joint$3 = Flo.joint;
const $$3 = _$;
/**
 * @record
 */

class EditorComponent {
    /**
     * @param {?} element
     */
    constructor(element) {
        this.element = element;
        /**
         * Min zoom percent value
         */
        this.minZoom = 5;
        /**
         * Max zoom percent value
         */
        this.maxZoom = 400;
        /**
         * Zoom percent increment/decrement step
         */
        this.zoomStep = 5;
        this.paperPadding = 0;
        this.floApi = new EventEmitter();
        this.validationMarkers = new EventEmitter();
        this.contentValidated = new EventEmitter();
        /**
         * Flag specifying whether the Flo-Editor is in read-only mode.
         */
        this._readOnlyCanvas = false;
        /**
         * Grid size
         */
        this._gridSize = 1;
        this._hiddenPalette = false;
        this._resizeHandler = () => this.autosizePaper();
        this.textToGraphEventEmitter = new EventEmitter();
        this.graphToTextEventEmitter = new EventEmitter();
        this._graphToTextSyncEnabled = true;
        this.validationEventEmitter = new EventEmitter();
        this._disposables = new CompositeDisposable();
        this._dslText = '';
        this.dslChange = new EventEmitter();
        this.textToGraphConversionCompleted = new Subject();
        this.graphToTextConversionCompleted = new Subject();
        this.paletteReady = new BehaviorSubject(false);
        let /** @type {?} */ self = this;
        this.editorContext = new (class DefaultRunnableContext {
            /**
             * @param {?} percent
             * @return {?}
             */
            set zoomPercent(percent) {
                self.zoomPercent = percent;
            }
            /**
             * @return {?}
             */
            get zoomPercent() {
                return self.zoomPercent;
            }
            /**
             * @param {?} noPalette
             * @return {?}
             */
            set noPalette(noPalette) {
                self.noPalette = noPalette;
            }
            /**
             * @return {?}
             */
            get noPalette() {
                return self.noPalette;
            }
            /**
             * @param {?} gridSize
             * @return {?}
             */
            set gridSize(gridSize) {
                self.gridSize = gridSize;
            }
            /**
             * @return {?}
             */
            get gridSize() {
                return self.gridSize;
            }
            /**
             * @param {?} readOnly
             * @return {?}
             */
            set readOnlyCanvas(readOnly) {
                self.readOnlyCanvas = readOnly;
            }
            /**
             * @return {?}
             */
            get readOnlyCanvas() {
                return self.readOnlyCanvas;
            }
            /**
             * @param {?} dsl
             * @return {?}
             */
            setDsl(dsl) {
                self.dsl = dsl;
            }
            /**
             * @return {?}
             */
            updateGraph() {
                return self.updateGraphRepresentation();
            }
            /**
             * @return {?}
             */
            updateText() {
                return self.updateTextRepresentation();
            }
            /**
             * @return {?}
             */
            performLayout() {
                return self.doLayout();
            }
            /**
             * @return {?}
             */
            clearGraph() {
                self.selection = undefined;
                self.graph.clear();
                if (self.metamodel && self.metamodel.load && self.editor && self.editor.setDefaultContent) {
                    return self.metamodel.load().then(data => {
                        self.editor.setDefaultContent(this, data);
                        if (!self.graphToTextSync) {
                            self.updateTextRepresentation();
                        }
                    });
                }
                else {
                    if (!self.graphToTextSync) {
                        self.updateTextRepresentation();
                    }
                }
            }
            /**
             * @return {?}
             */
            getGraph() {
                return self.graph;
            }
            /**
             * @return {?}
             */
            getPaper() {
                return self.paper;
            }
            /**
             * @return {?}
             */
            get graphToTextSync() {
                return self.graphToTextSync;
            }
            /**
             * @param {?} sync
             * @return {?}
             */
            set graphToTextSync(sync) {
                self.graphToTextSync = sync;
            }
            /**
             * @return {?}
             */
            getMinZoom() {
                return self.minZoom;
            }
            /**
             * @return {?}
             */
            getMaxZoom() {
                return self.maxZoom;
            }
            /**
             * @return {?}
             */
            getZoomStep() {
                return self.zoomStep;
            }
            /**
             * @return {?}
             */
            fitToPage() {
                self.fitToPage();
            }
            /**
             * @param {?} metadata
             * @param {?=} props
             * @param {?=} position
             * @return {?}
             */
            createNode(metadata, props, position) {
                return self.createNode(metadata, props, position);
            }
            /**
             * @param {?} source
             * @param {?} target
             * @param {?=} metadata
             * @param {?=} props
             * @return {?}
             */
            createLink(source, target, metadata, props) {
                return self.createLink(source, target, metadata, props);
            }
            /**
             * @return {?}
             */
            get selection() {
                return self.selection;
            }
            /**
             * @param {?} newSelection
             * @return {?}
             */
            set selection(newSelection) {
                self.selection = newSelection;
            }
            /**
             * @return {?}
             */
            deleteSelectedNode() {
                if (self.selection) {
                    if (self.editor && self.editor.preDelete) {
                        self.editor.preDelete(self.editorContext, self.selection.model);
                    }
                    else {
                        if (self.selection.model instanceof joint$3.dia.Element) {
                            self.graph.getConnectedLinks(self.selection.model).forEach((l) => l.remove());
                        }
                    }
                    self.selection.model.remove();
                    self.selection = undefined;
                }
            }
            /**
             * @return {?}
             */
            get textToGraphConversionObservable() {
                return self.textToGraphConversionCompleted;
            }
            /**
             * @return {?}
             */
            get graphToTextConversionObservable() {
                return self.graphToTextConversionCompleted;
            }
            /**
             * @return {?}
             */
            get paletteReady() {
                return self.paletteReady;
            }
        })();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        console.log('Initializing my component');
        this.initGraph();
        this.initPaper();
        this.initGraphListeners();
        this.initPaperListeners();
        this.initMetamodel();
        $$3(window).on('resize', this._resizeHandler);
        this._disposables.add(Disposable.create(() => $$3(window).off('resize', this._resizeHandler)));
        /*
             * Execute resize to get the right size for the SVG element on the editor canvas.
             * Executed via timeout to let angular render the DOM first and elements to have the right width and height
             */
        window.setTimeout(this._resizeHandler);
        this.floApi.emit(this.editorContext);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._disposables.dispose();
    }
    /**
     * @return {?}
     */
    get noPalette() {
        return this._hiddenPalette;
    }
    /**
     * @param {?} hidden
     * @return {?}
     */
    set noPalette(hidden) {
        this._hiddenPalette = hidden;
        // If palette is not shown ensure that canvas starts from the left==0!
        if (hidden) {
            $$3('#paper-container', this.element.nativeElement).css('left', 0);
        }
    }
    /**
     * @return {?}
     */
    get graphToTextSync() {
        return this._graphToTextSyncEnabled;
    }
    /**
     * @param {?} sync
     * @return {?}
     */
    set graphToTextSync(sync) {
        this._graphToTextSyncEnabled = sync;
        // Try commenting the sync out. Just set the flag but don't kick off graph->text conversion
        // this.performGraphToTextSyncing();
    }
    /**
     * @return {?}
     */
    performGraphToTextSyncing() {
        if (this._graphToTextSyncEnabled) {
            this.graphToTextEventEmitter.emit();
        }
    }
    /**
     * @param {?} element
     * @param {?} kind
     * @param {?} action
     * @param {?} location
     * @return {?}
     */
    createHandle(element, kind, action, location) {
        if (!location) {
            let /** @type {?} */ bbox = (/** @type {?} */ (element.model)).getBBox();
            location = bbox.origin().offset(bbox.width / 2, bbox.height / 2);
        }
        let /** @type {?} */ handle = Shapes.Factory.createHandle({
            renderer: this.renderer,
            paper: this.paper,
            parent: element.model,
            kind: kind,
            position: location
        });
        let /** @type {?} */ view = this.paper.findViewByModel(handle);
        view.on('cell:pointerdown', () => {
            if (action) {
                action();
            }
        });
        view.on('cell:mouseover', () => {
            handle.attr('image/filter', {
                name: 'dropShadow',
                args: { dx: 1, dy: 1, blur: 1, color: 'black' }
            });
        });
        view.on('cell:mouseout', () => {
            handle.removeAttr('image/filter');
        });
        // TODO: Look for ways to incorporate this option on the view when it's created
        (/** @type {?} */ (view)).options.interactive = false;
        return handle;
    }
    /**
     * @param {?} element
     * @param {?} types
     * @return {?}
     */
    removeEmbeddedChildrenOfType(element, types) {
        let /** @type {?} */ embeds = element.getEmbeddedCells();
        for (let /** @type {?} */ i = 0; i < embeds.length; i++) {
            if (types.indexOf(embeds[i].get('type')) >= 0) {
                embeds[i].remove();
            }
        }
    }
    /**
     * @return {?}
     */
    get selection() {
        return this._selection;
    }
    /**
     * @param {?} newSelection
     * @return {?}
     */
    set selection(newSelection) {
        if (newSelection && (newSelection.model.get('type') === joint$3.shapes.flo.DECORATION_TYPE || newSelection.model.get('type') === joint$3.shapes.flo.HANDLE_TYPE)) {
            newSelection = this.paper.findViewByModel(this.graph.getCell(newSelection.model.get('parent')));
        }
        if (newSelection && (!newSelection.model.attr('metadata') || newSelection.model.attr('metadata/metadata/unselectable'))) {
            newSelection = undefined;
        }
        if (newSelection !== this._selection) {
            if (this._selection) {
                var /** @type {?} */ elementview = this.paper.findViewByModel(this._selection.model);
                if (elementview) {
                    // May have been removed from the graph
                    this.removeEmbeddedChildrenOfType(elementview.model, joint$3.shapes.flo.HANDLE_TYPE);
                    elementview.unhighlight();
                }
            }
            if (newSelection) {
                newSelection.highlight();
                if (this.editor && this.editor.createHandles) {
                    this.editor.createHandles(this.editorContext, (owner, kind, action, location) => this.createHandle(owner, kind, action, location), newSelection);
                }
            }
            this._selection = newSelection;
        }
    }
    /**
     * @return {?}
     */
    get readOnlyCanvas() {
        return this._readOnlyCanvas;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set readOnlyCanvas(value) {
        if (this._readOnlyCanvas === value) {
            // Nothing to do
            return;
        }
        if (value) {
            this.selection = undefined;
        }
        if (this.graph) {
            this.graph.getLinks().forEach((link) => {
                if (value) {
                    link.attr('.link-tools/display', 'none');
                    link.attr('.marker-vertices/display', 'none');
                    link.attr('.connection-wrap/display', 'none');
                }
                else {
                    link.removeAttr('.link-tools/display');
                    if (this.editor && this.editor.allowLinkVertexEdit) {
                        link.removeAttr('.marker-vertices/display');
                    }
                    link.removeAttr('.connection-wrap/display');
                }
            });
        }
        this._readOnlyCanvas = value;
    }
    /**
     * Displays graphical feedback for the drag and drop in progress based on current drag and drop descriptor object
     *
     * @param {?} dragDescriptor DnD info object. Has on info on graph node being dragged (drag source) and what it is
     * being dragged over at the moment (drop target)
     * @return {?}
     */
    showDragFeedback(dragDescriptor) {
        if (this.editor && this.editor.showDragFeedback) {
            this.editor.showDragFeedback(this.editorContext, dragDescriptor);
        }
        else {
            let /** @type {?} */ magnet;
            if (dragDescriptor.source && dragDescriptor.source.view) {
                joint$3.V(dragDescriptor.source.view.el).addClass('dnd-source-feedback');
                if (dragDescriptor.source.cssClassSelector) {
                    magnet = Flo.findMagnetByClass(dragDescriptor.source.view, dragDescriptor.source.cssClassSelector);
                    if (magnet) {
                        joint$3.V(magnet).addClass('dnd-source-feedback');
                    }
                }
            }
            if (dragDescriptor.target && dragDescriptor.target.view) {
                joint$3.V(dragDescriptor.target.view.el).addClass('dnd-target-feedback');
                if (dragDescriptor.target.cssClassSelector) {
                    magnet = Flo.findMagnetByClass(dragDescriptor.target.view, dragDescriptor.target.cssClassSelector);
                    if (magnet) {
                        joint$3.V(magnet).addClass('dnd-target-feedback');
                    }
                }
            }
        }
    }
    /**
     * Hides graphical feedback for the drag and drop in progress based on current drag and drop descriptor object
     *
     * @param {?} dragDescriptor DnD info object. Has on info on graph node being dragged (drag source) and what it is
     * being dragged over at the moment (drop target)
     * @return {?}
     */
    hideDragFeedback(dragDescriptor) {
        if (this.editor && this.editor.hideDragFeedback) {
            this.editor.hideDragFeedback(this.editorContext, dragDescriptor);
        }
        else {
            let /** @type {?} */ magnet;
            if (dragDescriptor.source && dragDescriptor.source.view) {
                joint$3.V(dragDescriptor.source.view.el).removeClass('dnd-source-feedback');
                if (dragDescriptor.source.cssClassSelector) {
                    magnet = Flo.findMagnetByClass(dragDescriptor.source.view, dragDescriptor.source.cssClassSelector);
                    if (magnet) {
                        joint$3.V(magnet).removeClass('dnd-source-feedback');
                    }
                }
            }
            if (dragDescriptor.target && dragDescriptor.target.view) {
                joint$3.V(dragDescriptor.target.view.el).removeClass('dnd-target-feedback');
                if (dragDescriptor.target.cssClassSelector) {
                    magnet = Flo.findMagnetByClass(dragDescriptor.target.view, dragDescriptor.target.cssClassSelector);
                    if (magnet) {
                        joint$3.V(magnet).removeClass('dnd-target-feedback');
                    }
                }
            }
        }
    }
    /**
     * Sets the new DnD info object - the descriptor for DnD
     *
     * @param {?=} dragDescriptor DnD info object. Has on info on graph node being dragged (drag source) and what it is
     * being dragged over at the moment (drop target)
     * @return {?}
     */
    setDragDescriptor(dragDescriptor) {
        if (this.highlighted === dragDescriptor) {
            return;
        }
        if (this.highlighted && dragDescriptor && isEqual(this.highlighted.sourceComponent, dragDescriptor.sourceComponent)) {
            if (this.highlighted.source === dragDescriptor.source && this.highlighted.target === dragDescriptor.target) {
                return;
            }
            if (this.highlighted.source &&
                dragDescriptor.source &&
                this.highlighted.target &&
                dragDescriptor.target &&
                this.highlighted.source.view.model === dragDescriptor.source.view.model &&
                this.highlighted.source.cssClassSelector === dragDescriptor.source.cssClassSelector &&
                this.highlighted.target.view.model === dragDescriptor.target.view.model &&
                this.highlighted.target.cssClassSelector === dragDescriptor.target.cssClassSelector) {
                return;
            }
        }
        if (this.highlighted) {
            this.hideDragFeedback(this.highlighted);
        }
        this.highlighted = dragDescriptor;
        if (this.highlighted) {
            this.showDragFeedback(this.highlighted);
        }
    }
    /**
     * Handles DnD events when a node is being dragged over canvas
     *
     * @param {?} draggedView The Joint JS view object being dragged
     * @param {?} targetUnderMouse The Joint JS view under mouse cursor
     * @param {?} x X coordinate of the mouse on the canvas
     * @param {?} y Y coordinate of the mosue on the canvas
     * @param {?} sourceComponent
     * @return {?}
     */
    handleNodeDragging(draggedView, targetUnderMouse, x, y, sourceComponent) {
        if (this.editor && this.editor.calculateDragDescriptor) {
            this.setDragDescriptor(this.editor.calculateDragDescriptor(this.editorContext, draggedView, targetUnderMouse, joint$3.g.point(x, y), sourceComponent));
        }
    }
    /**
     * Handles DnD drop event when a node is being dragged and dropped on the main canvas
     * @return {?}
     */
    handleNodeDropping() {
        if (this.highlighted && this.editor && this.editor.handleNodeDropping) {
            this.editor.handleNodeDropping(this.editorContext, this.highlighted);
        }
        this.setDragDescriptor(undefined);
    }
    /**
     * Hides DOM Node (used to determine drop target DOM element)
     * @param {?} domNode DOM node to hide
     * @return {?}
     */
    _hideNode(domNode) {
        let /** @type {?} */ oldVisibility = {
            visibility: domNode.style ? domNode.style.display : undefined,
            children: []
        };
        for (var /** @type {?} */ i = 0; i < domNode.children.length; i++) {
            let /** @type {?} */ node = domNode.children.item(i);
            if (node instanceof HTMLElement) {
                oldVisibility.children.push(this._hideNode(/** @type {?} */ (node)));
            }
        }
        domNode.style.display = 'none';
        return oldVisibility;
    }
    /**
     * Restored DOM node original visibility (used to determine drop target DOM element)
     * @param {?} domNode DOM node to restore visibility of
     * @param {?} oldVisibility original visibility parameter
     * @return {?}
     */
    _restoreNodeVisibility(domNode, oldVisibility) {
        if (domNode.style) {
            domNode.style.display = oldVisibility.visibility;
        }
        let /** @type {?} */ j = 0;
        for (var /** @type {?} */ i = 0; i < domNode.childNodes.length; i++) {
            if (j < oldVisibility.children.length) {
                let /** @type {?} */ node = domNode.children.item(i);
                if (node instanceof HTMLElement) {
                    this._restoreNodeVisibility(/** @type {?} */ (node), oldVisibility.children[j++]);
                }
            }
        }
    }
    /**
     * Unfortunately we can't just use event.target because often draggable shape on the canvas overlaps the target.
     * We can easily find the element(s) at location, but only nodes :-( Unclear how to find links at location
     * (bounding box of a link for testing is bad).
     * The result of that is that links can only be the drop target when dragging from the palette currently.
     * When DnDing shapes on the canvas drop target cannot be a link.
     *
     * Excluded views enables you to choose to filter some possible answers (useful in the case where elements are stacked
     * - e.g. Drag-n-Drop)
     * @param {?} event
     * @param {?} x
     * @param {?} y
     * @param {?=} excludeViews
     * @return {?}
     */
    getTargetViewFromEvent(event, x, y, excludeViews = []) {
        if (!x && !y) {
            let /** @type {?} */ l = this.paper.snapToGrid({ x: event.clientX, y: event.clientY });
            x = l.x;
            y = l.y;
        }
        // TODO: See if next code paragraph is needed. Most likely it's just code executed for nothing
        // let elements = this.graph.findModelsFromPoint(joint.g.point(x, y));
        // let underMouse = elements.find(e => !_.isUndefined(excludeViews.find(x => x === this.paper.findViewByModel(e))));
        // if (underMouse) {
        //   return underMouse;
        // }
        let /** @type {?} */ oldVisibility = excludeViews.map(x => this._hideNode(x.el));
        let /** @type {?} */ targetElement = document.elementFromPoint(event.clientX, event.clientY);
        excludeViews.forEach((excluded, i) => {
            this._restoreNodeVisibility(excluded.el, oldVisibility[i]);
        });
        return this.paper.findView(targetElement);
    }
    /**
     * @param {?} dndEvent
     * @return {?}
     */
    handleDnDFromPalette(dndEvent) {
        switch (dndEvent.type) {
            case Flo.DnDEventType.DRAG:
                this.handleDragFromPalette(dndEvent);
                break;
            case Flo.DnDEventType.DROP:
                this.handleDropFromPalette(dndEvent);
                break;
            default:
                break;
        }
    }
    /**
     * @param {?} dnDEvent
     * @return {?}
     */
    handleDragFromPalette(dnDEvent) {
        console.log('Dragging from palette');
        if (dnDEvent.view && !this.readOnlyCanvas) {
            let /** @type {?} */ location = this.paper.snapToGrid({ x: dnDEvent.event.clientX, y: dnDEvent.event.clientY });
            this.handleNodeDragging(dnDEvent.view, this.getTargetViewFromEvent(dnDEvent.event, location.x, location.y, [dnDEvent.view]), location.x, location.y, Constants.PALETTE_CONTEXT);
        }
    }
    /**
     * @param {?} metadata
     * @param {?} props
     * @param {?} position
     * @return {?}
     */
    createNode(metadata, props, position) {
        return Shapes.Factory.createNode({
            renderer: this.renderer,
            paper: this.paper,
            metadata: metadata,
            props: props,
            position: position
        });
    }
    /**
     * @param {?} source
     * @param {?} target
     * @param {?} metadata
     * @param {?} props
     * @return {?}
     */
    createLink(source, target, metadata, props) {
        return Shapes.Factory.createLink({
            renderer: this.renderer,
            paper: this.paper,
            source: source,
            target: target,
            metadata: metadata,
            props: props
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleDropFromPalette(event) {
        let /** @type {?} */ cellview = event.view;
        let /** @type {?} */ evt = event.event;
        if (this.paper.el === evt.target || $$3.contains(this.paper.el, /** @type {?} */ (evt.target))) {
            if (this.readOnlyCanvas) {
                this.setDragDescriptor(undefined);
            }
            else {
                let /** @type {?} */ metadata = cellview.model.attr('metadata');
                let /** @type {?} */ props = cellview.model.attr('props');
                let /** @type {?} */ position = this.paper.snapToGrid({ x: evt.clientX, y: evt.clientY });
                /* Calculate target element before creating the new
                         * element under mouse location. Otherwise target
                         * element would be the newly created element because
                         * it's under the mouse pointer
                         */
                let /** @type {?} */ targetElement = this.getTargetViewFromEvent(evt, position.x, position.y, [event.view]);
                let /** @type {?} */ newNode = this.createNode(metadata, props, position);
                let /** @type {?} */ newView = this.paper.findViewByModel(newNode);
                this.handleNodeDragging(newView, targetElement, position.x, position.y, Constants.PALETTE_CONTEXT);
                this.handleNodeDropping();
            }
        }
    }
    /**
     * @return {?}
     */
    autosizePaper() {
        let /** @type {?} */ scrollBarSize = 17;
        let /** @type {?} */ parent = $$3('#paper', this.element.nativeElement);
        this.paper.fitToContent({
            padding: this.paperPadding,
            minWidth: parent.width() - scrollBarSize,
            minHeight: parent.height() - scrollBarSize,
        });
    }
    /**
     * @return {?}
     */
    fitToPage() {
        let /** @type {?} */ scrollBarSize = 17;
        let /** @type {?} */ parent = $$3('#paper', this.element.nativeElement);
        let /** @type {?} */ minScale = this.minZoom / 100;
        let /** @type {?} */ maxScale = 2;
        this.paper.scaleContentToFit({
            padding: this.paperPadding,
            minScaleX: minScale,
            minScaleY: minScale,
            maxScaleX: maxScale,
            maxScaleY: maxScale,
            fittingBBox: { x: 0, y: 0, width: parent.width() - scrollBarSize, height: parent.height() - scrollBarSize }
        });
        /**
             * #scaleContentToFit() sets some weird origin for the paper, so autosize to get the better origin.
             * If origins are different a sudden jump would flash when shape started being dragged on the
             * canvas after #fitToPage() has been called
             */
        this.autosizePaper();
    }
    /**
     * @return {?}
     */
    get zoomPercent() {
        return Math.round(joint$3.V(this.paper.viewport).scale().sx * 100);
    }
    /**
     * @param {?} percent
     * @return {?}
     */
    set zoomPercent(percent) {
        if (!isNaN(percent)) {
            if (percent < this.minZoom) {
                percent = this.minZoom;
            }
            else if (percent >= this.maxZoom) {
                percent = this.maxZoom;
            }
            else {
                if (percent <= 0) {
                    percent = 0.00001;
                }
            }
            this.paper.scale(percent / 100, percent / 100);
        }
    }
    /**
     * @return {?}
     */
    get gridSize() {
        return this._gridSize;
    }
    /**
     * @param {?} size
     * @return {?}
     */
    set gridSize(size) {
        if (!isNaN(size) && size >= 1) {
            this._gridSize = size;
            if (this.paper) {
                this.paper.setGridSize(size);
            }
        }
    }
    /**
     * @return {?}
     */
    validateContent() {
        return new Promise(resolve => {
            if (this.editor && this.editor.validate) {
                return this.editor
                    .validate(this.graph, this.dsl, this.editorContext)
                    .then(allMarkers => {
                    this.graph.getCells()
                        .forEach((cell) => this.markElement(cell, allMarkers.has(cell.id) ? allMarkers.get(cell.id) : []));
                    this.validationMarkers.emit(allMarkers);
                    this.contentValidated.emit(true);
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
    /**
     * @param {?} cell
     * @param {?} markers
     * @return {?}
     */
    markElement(cell, markers) {
        let /** @type {?} */ errorMessages = markers.map(m => m.message);
        let /** @type {?} */ errorCell = cell.getEmbeddedCells().find((e) => e.attr('./kind') === Constants.ERROR_DECORATION_KIND);
        if (errorCell) {
            if (errorMessages.length === 0) {
                errorCell.remove();
            }
            else {
                // Without rewrite we merge this list with existing errors
                (/** @type {?} */ (errorCell)).attr('messages', errorMessages, { rewrite: true });
            }
        }
        else if (errorMessages.length > 0) {
            let /** @type {?} */ error = Shapes.Factory.createDecoration({
                renderer: this.renderer,
                paper: this.paper,
                parent: cell,
                kind: Constants.ERROR_DECORATION_KIND,
                messages: errorMessages
            });
            let /** @type {?} */ pt;
            if (cell instanceof joint$3.dia.Element) {
                pt = (/** @type {?} */ ((/** @type {?} */ (cell)).getBBox())).topRight().offset(-error.get('size').width, 0);
            }
            else {
                // TODO: do something for the link perhaps?
            }
            error.set('position', pt);
            let /** @type {?} */ view = this.paper.findViewByModel(error);
            // Cast to <any>. Types are missing 'options' property
            (/** @type {?} */ (view)).options.interactive = false;
        }
    }
    /**
     * @return {?}
     */
    doLayout() {
        if (this.renderer && this.renderer.layout) {
            return this.renderer.layout(this.paper);
        }
    }
    /**
     * @param {?} dslText
     * @return {?}
     */
    set dsl(dslText) {
        if (this._dslText !== dslText) {
            this._dslText = dslText;
            this.textToGraphEventEmitter.emit();
        }
    }
    /**
     * @return {?}
     */
    get dsl() {
        return this._dslText;
    }
    /**
     * Ask the server to parse the supplied text into a JSON graph of nodes and links,
     * then update the view based on that new information.
     * @return {?}
     */
    updateGraphRepresentation() {
        console.debug(`Updating graph to represent '${this._dslText}'`);
        if (this.metamodel && this.metamodel.textToGraph) {
            return this.metamodel.textToGraph(this.editorContext, this._dslText).then(() => {
                this.textToGraphConversionCompleted.next();
                return this.validateContent();
            });
        }
        else {
            this.textToGraphConversionCompleted.next();
            return this.validateContent();
        }
    }
    /**
     * @return {?}
     */
    updateTextRepresentation() {
        if (this.metamodel && this.metamodel.graphToText) {
            return this.metamodel.graphToText(this.editorContext).then(text => {
                if (this._dslText != text) {
                    this._dslText = text;
                    this.dslChange.emit(text);
                }
                this.graphToTextConversionCompleted.next();
                return this.validateContent();
            });
        }
        else {
            this.graphToTextConversionCompleted.next();
            return this.validateContent();
        }
    }
    /**
     * @return {?}
     */
    initMetamodel() {
        this.metamodel.load().then(data => {
            this.updateGraphRepresentation();
            let /** @type {?} */ textSyncSubscription = this.graphToTextEventEmitter.pipe(debounceTime(100)).subscribe(() => {
                if (this._graphToTextSyncEnabled) {
                    this.updateTextRepresentation();
                }
            });
            this._disposables.add(Disposable.create(() => textSyncSubscription.unsubscribe()));
            // Setup content validated event emitter. Emit not validated when graph to text conversion required
            let /** @type {?} */ graphValidatedSubscription1 = this.graphToTextEventEmitter.subscribe(() => this.contentValidated.emit(false));
            this._disposables.add(Disposable.create(() => graphValidatedSubscription1.unsubscribe));
            // let validationSubscription = this.validationEventEmitter.pipe(debounceTime(100)).subscribe(() => this.validateGraph());
            // this._disposables.add(Disposable.create(() => validationSubscription.unsubscribe()));
            let /** @type {?} */ graphSyncSubscription = this.textToGraphEventEmitter.pipe(debounceTime(300)).subscribe(() => this.updateGraphRepresentation());
            this._disposables.add(Disposable.create(() => graphSyncSubscription.unsubscribe()));
            // Setup content validated event emitter. Emit not validated when text to graph conversion required
            let /** @type {?} */ graphValidatedSubscription2 = this.textToGraphEventEmitter.subscribe(() => this.contentValidated.emit(false));
            this._disposables.add(Disposable.create(() => graphValidatedSubscription2.unsubscribe));
            if (this.editor && this.editor.setDefaultContent) {
                this.editor.setDefaultContent(this.editorContext, data);
            }
        });
    }
    /**
     * @return {?}
     */
    initGraph() {
        this.graph = new joint$3.dia.Graph();
        this.graph.set('type', Constants.CANVAS_CONTEXT);
    }
    /**
     * @param {?} node
     * @return {?}
     */
    handleNodeCreation(node) {
        node.on('change:size', this._resizeHandler);
        node.on('change:position', this._resizeHandler);
        if (node.attr('metadata')) {
            node.on('change:attrs', (cell, attrs, changeData) => {
                let /** @type {?} */ propertyPath = changeData ? changeData.propertyPath : undefined;
                if (propertyPath) {
                    let /** @type {?} */ propAttr = propertyPath.substr(propertyPath.indexOf('/') + 1);
                    if (propAttr.indexOf('metadata') === 0 ||
                        propAttr.indexOf('props') === 0 ||
                        (this.renderer && this.renderer.isSemanticProperty && this.renderer.isSemanticProperty(propAttr, node))) {
                        this.performGraphToTextSyncing();
                    }
                    if (this.renderer && this.renderer.refreshVisuals) {
                        this.renderer.refreshVisuals(node, propAttr, this.paper);
                    }
                }
            });
        }
    }
    /**
     * Forwards a link event occurrence to any handlers in the editor service, if they are defined. Event examples
     * are 'change:source', 'change:target'.
     * @param {?} event
     * @param {?} link
     * @return {?}
     */
    handleLinkEvent(event, link) {
        if (this.renderer && this.renderer.handleLinkEvent) {
            this.renderer.handleLinkEvent(this.editorContext, event, link);
        }
    }
    /**
     * @param {?} link
     * @return {?}
     */
    handleLinkCreation(link) {
        this.handleLinkEvent('add', link);
        link.on('change:source', (link) => {
            this.autosizePaper();
            let /** @type {?} */ newSourceId = link.get('source').id;
            let /** @type {?} */ oldSourceId = link.previous('source').id;
            if (newSourceId !== oldSourceId) {
                this.performGraphToTextSyncing();
            }
            this.handleLinkEvent('change:source', link);
        });
        link.on('change:target', (link) => {
            this.autosizePaper();
            let /** @type {?} */ newTargetId = link.get('target').id;
            let /** @type {?} */ oldTargetId = link.previous('target').id;
            if (newTargetId !== oldTargetId) {
                this.performGraphToTextSyncing();
            }
            this.handleLinkEvent('change:target', link);
        });
        link.on('change:vertices', this._resizeHandler);
        link.on('change:attrs', (cell, attrs, changeData) => {
            let /** @type {?} */ propertyPath = changeData ? changeData.propertyPath : undefined;
            if (propertyPath) {
                let /** @type {?} */ propAttr = propertyPath.substr(propertyPath.indexOf('/') + 1);
                if (propAttr.indexOf('metadata') === 0 ||
                    propAttr.indexOf('props') === 0 ||
                    (this.renderer && this.renderer.isSemanticProperty && this.renderer.isSemanticProperty(propAttr, link))) {
                    let /** @type {?} */ sourceId = link.get('source').id;
                    let /** @type {?} */ targetId = link.get('target').id;
                    this.performGraphToTextSyncing();
                }
                if (this.renderer && this.renderer.refreshVisuals) {
                    this.renderer.refreshVisuals(link, propAttr, this.paper);
                }
            }
        });
        this.paper.findViewByModel(link).on('link:options', () => this.handleLinkEvent('options', link));
        if (this.readOnlyCanvas) {
            link.attr('.link-tools/display', 'none');
        }
    }
    /**
     * @return {?}
     */
    initGraphListeners() {
        this.graph.on('add', (element) => {
            if (element instanceof joint$3.dia.Link) {
                this.handleLinkCreation(/** @type {?} */ (element));
            }
            else if (element instanceof joint$3.dia.Element) {
                this.handleNodeCreation(/** @type {?} */ (element));
            }
            if (element.get('type') === joint$3.shapes.flo.NODE_TYPE || element.get('type') === joint$3.shapes.flo.LINK_TYPE) {
                this.performGraphToTextSyncing();
            }
            this.autosizePaper();
        });
        this.graph.on('remove', (element) => {
            if (element instanceof joint$3.dia.Link) {
                this.handleLinkEvent('remove', /** @type {?} */ (element));
            }
            if (this.selection && this.selection.model === element) {
                this.selection = undefined;
            }
            if (element.isLink()) {
                window.setTimeout(() => this.performGraphToTextSyncing(), 100);
            }
            else if (element.get('type') === joint$3.shapes.flo.NODE_TYPE) {
                this.performGraphToTextSyncing();
            }
            this.autosizePaper();
        });
        // Set if link is fan-routed. Should be called before routing call
        this.graph.on('change:vertices', (link, changed, opt) => {
            if (opt.fanRouted) {
                link.set('fanRouted', true);
            }
            else {
                link.unset('fanRouted');
            }
        });
        // adjust vertices when a cell is removed or its source/target was changed
        this.graph.on('add remove change:source change:target change:vertices change:position', partial(Utils.fanRoute, this.graph));
    }
    /**
     * @return {?}
     */
    initPaperListeners() {
        // http://stackoverflow.com/questions/20463533/how-to-add-an-onclick-event-to-a-joint-js-element
        this.paper.on('cell:pointerclick', (cellView) => {
            if (!this.readOnlyCanvas) {
                this.selection = cellView;
            }
        });
        this.paper.on('blank:pointerclick', () => {
            this.selection = undefined;
        });
        this.paper.on('scale', this._resizeHandler);
        this.paper.on('all', function () {
            if (Utils.isCustomPaperEvent(arguments)) {
                arguments[2].trigger.apply(arguments[2], [arguments[0], arguments[1], arguments[3], arguments[4]]);
            }
        });
        this.paper.on('dragging-node-over-canvas', (dndEvent) => {
            console.log(`Canvas DnD type = ${dndEvent.type}`);
            let /** @type {?} */ location = this.paper.snapToGrid({ x: dndEvent.event.clientX, y: dndEvent.event.clientY });
            switch (dndEvent.type) {
                case Flo.DnDEventType.DRAG:
                    this.handleNodeDragging(dndEvent.view, this.getTargetViewFromEvent(dndEvent.event, location.x, location.y, [dndEvent.view]), location.x, location.y, Constants.CANVAS_CONTEXT);
                    break;
                case Flo.DnDEventType.DROP:
                    this.handleNodeDropping();
                    break;
                default:
                    break;
            }
        });
        // JointJS now no longer grabs focus if working in a paper element - crude...
        $$3('#flow-view', this.element.nativeElement).on('mousedown', () => {
            $$3('#palette-filter-textfield', this.element.nativeElement).focus();
        });
    }
    /**
     * @return {?}
     */
    initPaper() {
        let /** @type {?} */ options = {
            el: $$3('#paper', this.element.nativeElement),
            gridSize: this._gridSize,
            drawGrid: true,
            model: this.graph,
            elementView: this.renderer && this.renderer.getNodeView ? this.renderer.getNodeView() : joint$3.shapes.flo.ElementView /*joint.dia.ElementView*/,
            linkView: this.renderer && this.renderer.getLinkView ? this.renderer.getLinkView() : joint$3.shapes.flo.LinkView,
            // Enable link snapping within 25px lookup radius
            snapLinks: { radius: 25 },
            // http://www.jointjs.com/tutorial/ports
            defaultLink: /*this.renderer && this.renderer.createDefaultLink ? this.renderer.createDefaultLink : new joint.shapes.flo.Link*/
            (cellView, magnet) => {
                if (this.renderer && this.renderer.createLink) {
                    let /** @type {?} */ linkEnd = {
                        id: cellView.model.id
                    };
                    if (magnet) {
                        linkEnd.selector = cellView.getSelector(magnet, undefined);
                    }
                    if (magnet.getAttribute('port')) {
                        linkEnd.port = magnet.getAttribute('port');
                    }
                    if (magnet.getAttribute('port') === 'input') {
                        return this.renderer.createLink(undefined, linkEnd);
                    }
                    else {
                        return this.renderer.createLink(linkEnd, undefined);
                    }
                }
                else {
                    return new joint$3.shapes.flo.Link();
                }
            },
            // decide whether to create a link if the user clicks a magnet
            validateMagnet: (cellView, magnet) => {
                if (this.readOnlyCanvas) {
                    return false;
                }
                else {
                    if (this.editor && this.editor.validatePort) {
                        return this.editor.validatePort(this.editorContext, cellView, magnet);
                    }
                    else {
                        return true;
                    }
                }
            },
            interactive: () => {
                if (this.readOnlyCanvas) {
                    return false;
                }
                else {
                    return this.editor && this.editor.interactive ? this.editor.interactive : true;
                }
            },
            highlighting: this.editor && this.editor.highlighting ? this.editor.highlighting : {
                'default': {
                    name: 'addClass',
                    options: {
                        className: 'highlighted'
                    }
                }
            },
            markAvailable: true
        };
        if (this.renderer && this.renderer.getLinkAnchorPoint) {
            options.linkConnectionPoint = this.renderer.getLinkAnchorPoint;
        }
        if (this.editor && this.editor.validateLink) {
            options.validateConnection = (cellViewS, magnetS, cellViewT, magnetT, end, linkView) => this.editor.validateLink(this.editorContext, cellViewS, magnetS, cellViewT, magnetT, end, linkView);
        }
        // The paper is what will represent the graph on the screen
        this.paper = new joint$3.dia.Paper(options);
        this._disposables.add(Disposable.create(() => this.paper.remove()));
    }
    /**
     * @param {?} ready
     * @return {?}
     */
    updatePaletteReadyState(ready) {
        this.paletteReady.next(ready);
    }
}
EditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'flo-editor',
                template: `<ng-content></ng-content>
<div id="flow-view" class="flow-view" style="position:relative">
  <div id="canvas" class="canvas" style="position:relative; display: block; width: 100%; height: 100%;">
    <div *ngIf="!noPalette" id="palette-container" class="palette-container" style="overflow:hidden;">
      <flo-palette [metamodel]="metamodel" [renderer]="renderer" [paletteSize]="paletteSize"
                   (onPaletteEntryDrop)="handleDnDFromPalette($event)"
                    (paletteReady)="updatePaletteReadyState($event)"
                    (paletteFocus)="graphToTextSync=true"></flo-palette>
    </div>

    <div id="sidebar-resizer" *ngIf="!noPalette"
      resizer
      [splitSize]="paletteSize"
      (sizeChange)="paletteSize = $event"
      [resizerWidth]="6"
      [resizerLeft]="'#palette-container'"
      [resizerRight]="'#paper-container'">
    </div>

    <div id="paper-container">
      <div id="paper" class="paper" tabindex="0" style="overflow: hidden; position: absolute; display: block; height:100%; width:100%; overflow:auto;"></div>

      <span class="canvas-controls-container" ng-if="canvasControls">
        <table ng-if="canvasControls.zoom" class="canvas-control zoom-canvas-control">
          <tbody>
            <tr>
              <td>
                <input class="zoom-canvas-input canvas-control zoom-canvas-control" type="text"
                                               data-inline="true" [(ngModel)]="zoomPercent"
                                               size="3">
              </td>
              <td>
                <label class="canvas-control zoom-canvas-label">%</label>
              </td>
              <td>
                <input type="range" data-inline="true" [(ngModel)]="zoomPercent"
                                               [step]="zoomStep"
                                               [max]="maxZoom" [min]="minZoom" data-type="range"
                                               name="range" class="canvas-control zoom-canvas-control">
              </td>
            </tr>
          </tbody>
        </table>
      </span>
    </div>
  </div>
</div>
`,
                styles: [`/*! JointJS v1.0.3 (2016-11-22) - JavaScript diagramming library


This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/.joint-viewport{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}[magnet=true]:not(.joint-element){cursor:crosshair}[magnet=true]:not(.joint-element):hover{opacity:.7}.joint-element{cursor:move}.joint-element *{vector-effect:non-scaling-stroke;user-drag:none}.marker-source,.marker-target{vector-effect:non-scaling-stroke}.joint-paper{position:relative}.joint-highlight-opacity{opacity:.3}.joint-link .connection,.joint-link .connection-wrap{fill:none}.marker-vertices{opacity:0;cursor:move}.marker-arrowheads{opacity:0;cursor:move;cursor:-webkit-grab;cursor:-moz-grab}.link-tools{opacity:0;cursor:pointer}.link-tools .tool-options{display:none}.joint-link:hover .link-tools,.joint-link:hover .marker-arrowheads,.joint-link:hover .marker-vertices{opacity:1}.marker-vertex-remove{cursor:pointer;opacity:.1}.marker-vertex-group:hover .marker-vertex-remove{opacity:1}.marker-vertex-remove-area{opacity:.1;cursor:pointer}.marker-vertex-group:hover .marker-vertex-remove-area{opacity:1}.joint-element .fobj{overflow:hidden}.joint-element .fobj body{background-color:transparent;margin:0;position:static}.joint-element .fobj div{text-align:center;vertical-align:middle;display:table-cell;padding:0 5px}.joint-paper.joint-theme-dark{background-color:#18191b}.joint-link.joint-theme-dark .connection-wrap{stroke:#8f8ff3;stroke-width:15;stroke-linecap:round;stroke-linejoin:round;opacity:0;cursor:move}.joint-link.joint-theme-dark .connection-wrap:hover{opacity:.4;stroke-opacity:.4}.joint-link.joint-theme-dark .connection{stroke-linejoin:round}.joint-link.joint-theme-dark .link-tools .tool-remove circle{fill:#f33636}.joint-link.joint-theme-dark .link-tools .tool-remove path{fill:#fff}.joint-link.joint-theme-dark .link-tools [event="link:options"] circle{fill:green}.joint-link.joint-theme-dark .marker-vertex{fill:#5652db}.joint-link.joint-theme-dark .marker-vertex:hover{fill:#8e8ce1;stroke:none}.joint-link.joint-theme-dark .marker-arrowhead{fill:#5652db}.joint-link.joint-theme-dark .marker-arrowhead:hover{fill:#8e8ce1;stroke:none}.joint-link.joint-theme-dark .marker-vertex-remove-area{fill:green;stroke:#006400}.joint-link.joint-theme-dark .marker-vertex-remove{fill:#fff;stroke:#fff}.joint-paper.joint-theme-default{background-color:#fff}.joint-link.joint-theme-default .connection-wrap{stroke:#000;stroke-width:15;stroke-linecap:round;stroke-linejoin:round;opacity:0;cursor:move}.joint-link.joint-theme-default .connection-wrap:hover{opacity:.4;stroke-opacity:.4}.joint-link.joint-theme-default .connection{stroke-linejoin:round}.joint-link.joint-theme-default .link-tools .tool-remove circle{fill:red}.joint-link.joint-theme-default .link-tools .tool-remove path{fill:#fff}.joint-link.joint-theme-default .marker-vertex{fill:#1abc9c}.joint-link.joint-theme-default .marker-vertex:hover{fill:#34495e;stroke:none}.joint-link.joint-theme-default .marker-arrowhead{fill:#1abc9c}.joint-link.joint-theme-default .marker-arrowhead:hover{fill:#f39c12;stroke:none}.joint-link.joint-theme-default .marker-vertex-remove{fill:#fff}@font-face{font-family:lato-light;src:url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAHhgABMAAAAA3HwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABqAAAABwAAAAcaLe9KEdERUYAAAHEAAAAHgAAACABFgAER1BPUwAAAeQAAAo1AAARwtKX0BJHU1VCAAAMHAAAACwAAAAwuP+4/k9TLzIAAAxIAAAAWQAAAGDX0nerY21hcAAADKQAAAGJAAAB4hcJdWJjdnQgAAAOMAAAADoAAAA6DvoItmZwZ20AAA5sAAABsQAAAmVTtC+nZ2FzcAAAECAAAAAIAAAACAAAABBnbHlmAAAQKAAAXMoAAK3EsE/AsWhlYWQAAGz0AAAAMgAAADYOCCHIaGhlYQAAbSgAAAAgAAAAJA9hCBNobXR4AABtSAAAAkEAAAOkn9Zh6WxvY2EAAG+MAAAByAAAAdTkvg14bWF4cAAAcVQAAAAgAAAAIAIGAetuYW1lAABxdAAABDAAAAxGYqFiYXBvc3QAAHWkAAAB7wAAAtpTFoINcHJlcAAAd5QAAADBAAABOUVnCXh3ZWJmAAB4WAAAAAYAAAAGuclXKQAAAAEAAAAAzD2izwAAAADJKrAQAAAAANNPakh42mNgZGBg4ANiCQYQYGJgBMIXQMwC5jEAAA5CARsAAHjafddrjFTlHcfxP+KCAl1XbKLhRWnqUmpp1Yba4GXV1ktXK21dby0erZumiWmFZLuNMaQQElgWJ00mtNxRQMXLcntz3GUIjsYcNiEmE5PNhoFl2GQgzKvJvOnLJk4/M4DiGzL57v/szJzn/P6/53ee80zMiIg5cXc8GNc9+vhTz0bna/3/WBUL4nrvR7MZrc+vPp7xt7/8fVXc0Dpqc31c1643xIyu/e1vvhpTMTWjHlPX/XXmbXi3o7tjbNY/O7pnvTv7ldm7bvh9R/eNKzq658Sc385+Zea7c9+avWvens7bZtQ7xjq/uOl6r+fVLZ1fXP5vuqur6983benqao0587aO7tbf9tHYN6/W+N+8XKf9mreno7s1zpVXe7z26+rjS695e2be1hq3pfvS39b/7XcejTnNvuhqdsTNzZ6Yr97i/+7ml7FIXawuwVLcg/tiWdyPHi4+rD7W/Dx+3RyJXjyBZ/AcVhlrNdZivXE2YAgbMYxNeBM5Y27FNmzHDuzEbuxzjfeMvx/v4wN8iI8wggOucxCHcBhHkGIUYziKAo7hODJjnlDHjXuKrjKm9HsO046rOI+Fui/rvKzzss7LOi/rsqbLmi5ruqzpskZ9mfoy9WXqy9SXqS9TX6auRl2Nuhp1Nepq1NWoq1FXo65GXY26GnU16srU1WJJzKJnLjrbczJIzTg149SMUzNOzXgsa/bGfbi/mY+e5uvxsOMVzXXxYrMUL6krnbvKuYPqanWNulbNOXcrtmE7dmAndmOfcTJ1XD3lu2Wcdt4ZnEWl7dMgnwb5NBgX/f8DanskqEJxD8U9kjQoRYNSVJGgymWlWyitxQPNk9Qm8WBzkuItVPZQ2ENdKyUVKalISUVKKlJSkZKKlFQoS6hKqOmhpjVrgxT1UNRj9lpKeuKVmCWPc5p7Y67aia7mI/zbQs0j1OyN7zVHYyFul97u5gR1e/k6wdeJuLP5Gm8neDsh05vN9mazvdlsb44nm9X4TfONeNq5fXjGe8+qz6nPqy80t8cfqPyj4xXN6Ugcv6S+3CzESjpW0TCovuHz1Y7XOF6rrnf9DRjCRgxjE95Ejo6t2Ibt2IGd2I33XHc/3scH+BAfYQQHcBCHcBhHkOJj1x5Vx3AUBRzDcXzisyI+xWfIXOOE90/RWMZpes9gio9nVXPK9UdkYYssbJGFLXHRe92y8KUZqMrCl/Edee5UuyRqPm7x/iIsaw7Jw4QsVGXhiCyksjARv/T9fqx0ziDWYL3vbMAQNmIYm/Am9jl3HKd97wymXOOsWsE5xxfVn1HUR00fJX2yUInbvdvt7MVYgju9lqr3tJXl4l5n3sf/+5sZdQOU7TWnBfNpLo2xyhiD6mp1jbpWzTl3K7ZhO3ZgJ3bjLeO9jT3Y277HBvhbpXyAvxX+VnTQp4M+6vuo7+Nrha8VvlZ00Rc3Ut7vyv2u2u+K/c7sd2a/b/b7Zr9v9sddnM9xu5fbvdzOyXsm75m8L+R8TsbvkOtUrlO5TuU5k+dMnlN5zuQ5ledMjjNZzbif436O+znu57if436O+zk5S+UslbNUzlI5S+UslbNMzlI5S+UslbNUzlI5S+Usk7NMzjI5y2QsNWu9ZqvX/TqHO11Wr/m4xfEirMcGDGEjhrEJb2LK987hp9w5+a05vTKfv25e0OsFvV5wD0/o84IeL7hXC+Z03Fo5bl7HOXuSsyc5e/Kac3nAuQdxCIdxBClGMYajKOAYjqM1zyfUU8YtYxpVnMevYtZXEzEXneiKe3SxMOart+upW64XYwmW4h4sa74gmX2S+bpkLpPMPh1O63Bah9O6m9bdtM7e0dkRnb0TK429yriD6mp1jbpWzfl8K7ZhO3ZgJ3Zjn7EPGOcgDuEwjiDFKMZwFAUcw3Fkzjuhjjv3lPHLOO1aZzClp7NqBeccT/usivO46L07zPywmb/VzN9q5ofN/LCs9lmHSzqs6rCqw6oOqzqsSsWwVAxLxbBUDEvFsFQMS8WwtbFkbSxZG0vWxpK1sWRtLFkbS7qq6qqqq6quqrqq6qqqq6quqrqq6qqqq6quWnNXlbJbpYwuczJpTibNyaQ5mTQnk+ZkwopR5eckPyf5OcnPSX5O8nOSn5NWgKoVoGoFqFoBqryajGe+vldv/tb9mrhfE1caat+vi9UluLO51BWHXHEoHvvqfzzp5kk3T7o9l+51Hyfu44Q/3e7jhEfd7uPEc+kh93IiEb0SMeC59Gep6PVcGpKKXvd4IhW9EtF7zXs95/tbsQ3bsQM7sRvv0bMf7+MDfIiPMIIDdBzEIRzGEaT42HVH1TEcRQHHcByf+KyIT/EZMtc44f1TNJZxZb2YRhXn8fDlJ3/xqid/nrM1zuY5W7QC/pCjRU7ul6pRDtY5WOdgnYO7OVfnWp1jZy4/sWvtJ/Zq9dLTusahIoeKHCpyqMihIoeKHCpK3ajUjUrdqNSNSt2o1I1K3SgX6lyoc6HOhToX6lyoc6DOgToH6hyoc6DOgbpu67qt6bZ21ZM3f9WTN6/7mu5ruq+1n7wvc2ABBwY4sIADCzjwOgcSDrzOgQHZystWvu1Ea3VZ5L0rK8ylfF1aZS7tfRLuJNxJuPOCfOXlK8+lRL7ynErkK8+tf8lXXr52ydeIfK2Tr10cXMDBhIMLZCzPxYSLC7iYcHGAiwNcHODiABcHuDjAxYFrrkrX3vMkHE44nHA44XDC4UTO8lxOuJxwOeFywuWEy4mc5eUsL2d5OctfXsESziect9Ok9wym+HdWreCc42mfVXEeF733Ey6nl10tcLTA0QI3C9wscLLEyRInS9wrca7EtTLHJjjVWptT7qScSXVf0H1B9wXdF3Rf0H1B9wUdlnRY0mFJhyUdlnRY0l1JdyXdlXRX0l1JdyXdFHRT0k2qm5TqlOqU6lQ6ZrXuFHRihQS92PwvNTX7m6K9TdG+pmhPUrQnKdqTFO1JivYhxfiuM0ecOWJvV3P2iOfRZs+jumfRZvu3mtEaUpAZrWEv1xpxxIgjRhwx4ogRR4w4YsQRI47ETXK7XGaXU7W8ndlWXlc6HsQanMYZXJqH5eZheXseLqrz+ZvxN+NvaxfT2sFkvMp4lfEq41XGq4xXrV1JxquMVxmvMl5lvGrtQrKY59rrXHtd+5lzrWfIlO+cw/fdbYWvz7rF8aL2fDfoadDToKdBT0PiCxJfkPiCxBckviDxBYlvzWuD1gatDVobtDZobdDaoLVBa4PWBq0NWhu0Nr5WcP3Xu6UrO6EZ8So/5+qm047iZv54asWiWBw/ih/b594Vd8fS+Lln8C+sGff6LX9/POC30IPxkDX0sXg8nogn46n4XTwdfZ5Rz8bzsSJejCReij+ZlVUxYF5Wm5e1sT42xFBsDE/eyMV/Ymtsi+2xI3bGW/F27Im9fr2/E+/F/ng/PogP46PwWz0OxeE4Eh/HaIzF0SjEsTgen8cJv8hPRdlcn7FbOGuOz8V0VON8XPw/fppwigAAAHjaY2BkYGDgYtBh0GNgcnHzCWHgy0ksyWOQYGABijP8/w8kECwgAACeygdreNpjYGYRZtRhYGVgYZ3FaszAwCgPoZkvMrgxMXAwM/EzMzExsTAzMTcwMKx3YEjwYoCCksoAHyDF+5uJrfBfIQMDuwbjUgWgASA55t+sK4GUAgMTABvCDMIAAAB42mNgYGBmgGAZBkYGELgD5DGC+SwMB4C0DoMCkMUDZPEy1DH8ZwxmrGA6xnRHgUtBREFKQU5BSUFNQV/BSiFeYY2ikuqf30z//4PN4QXqW8AYBFXNoCCgIKEgA1VtCVfNCFTN/P/r/yf/D/8v/O/7j+Hv6wcnHhx+cODB/gd7Hux8sPHBigctDyzuH771ivUZ1IVEA0Y2iNfAbCYgwYSugIGBhZWNnYOTi5uHl49fQFBIWERUTFxCUkpaRlZOXkFRSVlFVU1dQ1NLW0dXT9/A0MjYxNTM3MLSytrG1s7ewdHJ2cXVzd3D08vbx9fPPyAwKDgkNCw8IjIqOiY2Lj4hMYmhvaOrZ8rM+UsWL12+bMWqNavXrtuwfuOmLdu2bt+5Y++effsZilPTsu5VLirMeVqezdA5m6GEgSGjAuy63FqGlbubUvJB7Ly6+8nNbTMOH7l2/fadGzd3MRw6yvDk4aPnLxiqbt1laO1t6eueMHFS/7TpDFPnzpvDcOx4EVBTNRADAEXYio8AAAAAAAP7BakAVwA+AEMASQBNAFEAUwBbAF8AtABhAEgATQBVAFsAYQBoAGwAtQBPAEAAZQBZADsAYwURAAB42l1Ru05bQRDdDQ8DgcTYIDnaFLOZkMZ7oQUJxNWNYmQ7heUIaTdykYtxAR9AgUQN2q8ZoKGkSJsGIRdIfEI+IRIza4iiNDs7s3POmTNLypGqd+lrz1PnJJDC3QbNNv1OSLWzAPek6+uNjLSDB1psZvTKdfv+Cwab0ZQ7agDlPW8pDxlNO4FatKf+0fwKhvv8H/M7GLQ00/TUOgnpIQTmm3FLg+8ZzbrLD/qC1eFiMDCkmKbiLj+mUv63NOdqy7C1kdG8gzMR+ck0QFNrbQSa/tQh1fNxFEuQy6axNpiYsv4kE8GFyXRVU7XM+NrBXbKz6GCDKs2BB9jDVnkMHg4PJhTStyTKLA0R9mKrxAgRkxwKOeXcyf6kQPlIEsa8SUo744a1BsaR18CgNk+z/zybTW1vHcL4WRzBd78ZSzr4yIbaGBFiO2IpgAlEQkZV+YYaz70sBuRS+89AlIDl8Y9/nQi07thEPJe1dQ4xVgh6ftvc8suKu1a5zotCd2+qaqjSKc37Xs6+xwOeHgvDQWPBm8/7/kqB+jwsrjRoDgRDejd6/6K16oirvBc+sifTv7FaAAAAAAEAAf//AA942sR9B2Ab15H2vl0sOha76ABJgCgESIIESIAECPYqik2kSFEiqS5Rnaq2bMndlnvNJU7c27nKjpNdkO7lZPtK2uXSLOfuklxyyd0f3O9c7DgXRxIJ/fPeAiRFSy73N9kktoDYeTPzZr6ZN29A0VQnRdGT7CjFUCoqIiEq2phWKdjfxSQl+7PGNEPDISUx+DKLL6dVysLZxjTC1+OCVyjxCt5OujgbQPdmd7Kjp5/rVPw9BR9JvX/2Q3ScPU4JlIdaQaWNFBWWWH0mbaapMBKLoyJ1UtJaM/hn2qql1GHJZMiIpqhYEJescOSKSV4UlqwmwSQZ2VSKksysYBJdqarqZE0zHY+5aauFo/2+oFmIC3Ck8keY9zmnz2r2u4xGl99cmohtpBkl0wE/9GD+qsXn4hJMHd0792JkeHRDKrVhdBjT+zLzOp0AerWUlaqiYIBUWNTHZ1R6SqMIi6YYEm2EZobPiAwv6YA2js9IdhSmqqoxCSoOATGhkoXDl0c1NGfieBp5ckeM4ioUzr77kGCxCA/NHxF+jVGUYjU8P0HVoyEqHQN+iSXxtBHokHhzPD5To4gZDeFp1pOsC9jjUo0yMx2oqIwH7LEZrYrcUrpT9fiWFm7pBJMTbiGxISqWnZRKjJl0SZk2PN1a4tPAB/OSGQZgM2akRhQWE65Xmx/7ww8pa1grxiKcqD8hRdSnWJE/8WrzbX+YItdNcB3+LIyvm3jJqT4lxvhpNqY3w4PJbx3+LUb4aSHCm/Ezpt0lTrjuIb8D+LcY5qcrwib5bZXkbfAh8fwfJskVeE8dfs90Kv/OenydodL6cAT+oVYrq9TpeRih2xMIV1RGYvFkXao+cr5/YqsLy6cRtaC42ZtM2OPmZtSAGK85HrNaVExcpQz5GThWeRmQWW1N0uxlOBRGZjgr8Zq9YzTzL6uyc0pF+T+NK5ym8GZUvTlcjMb/XcmWvbHqf3jY7H9tKufMaCz7D2OsUwhveo0TUAJVr8r+A/oNq9Xy6K6QD6GHzZZsA/obj1qR3Q7n2YOuymy9IKgU6L7sVrsJ/a2hHt1FwSx8MHtK4VceoxqoZdRK6m+ptBVrIkyKdk1GDIJAh6Mif1JqFDJiIy/VgRRrOBB3TZ06PLOSo4pBWUMxsYaX+uFWRMhII7KAW/5j9hksSIUYAkm6Tkht7CnRdoKdtrbZgMshfrog5AKmB/FvsY2fbsfXGWra5gq1Eba/aLW5CoJt7QuclRpBCKIyJenq4FWbklbWwGt3SuwXRH9KjJgkrxtmblV1C0rAhFXYzRGmFiZvC8IyULmRXaX0+yJ0iHGzeDIbEeZ8MoLMFjdtN3MMaob3w/0HC/SCpjBU2z2R8i67fkdr7c57tmiQ0Vii3/Fgm13L68taN3a4q7aM99cVN+5/fKceGQ0l+mPvjFau2J4qWnHxihBKDl+zprJm9f7m50uNNl9pwMXQt9lqR46u7z62s4X5Omf+vmqg1S94y4Ls3EtGX1nt8g1NYw9e0s3+1GD+s3KS+X3L2taIha5VVA9sOfPXbN3aI12d69srzBTFUuNnf89+m32FMlMhsB2dMJe/TKVLYQanW7HZ62Uz6QqQYprFk9nPZmZWJVpZQ1haBYdOIzl0shkkjhMLYzFmRAsvuUF+WjjU8lI1HHbBYRcvDcJhA0zbCXh1WwRT2siWplIpabALjhOtlSlsKVf1gtFsqIbLficcaakUWE3zOVYzQieBx/FYM40Z7PdxtJkIBSn96DPeOB4dPtDSsn+kqnrVvuaWA8PRwUDTcCQy0hIItIxEIsNNgTKFUWnius783mCjV1atPNAK745Wj+xvajm4smpFoHk4GhlpCgSa4N0jzQHFwMQtayORtbdMjN+MX28eHzzQ7fN1HxgcPNDj8/UcODPJ3qPWnt5lQmMTt6yLRNbhd05EIhPwzv3Lvd7l+wcHDy33+ZYfAju69+wH7GGQRSs1TF1HpeNYCo1YCstUmbQBC8ANB24D2ELKbdOALxohXG8Dn9PGS2rgqx/mlh9MHByawNqDtSvHcwms/Sp4dfoF04yBbVy2ImBPiSZB7EuJ5aZ0qDpJeO9eBrcpdXUS35a5Dgpdm+OpXYk1PhiKMJiTVovNDlxPYsZzSIWdRhRxzGKmJ1EwxDF7a9dd3dvTU7P5xpGuy9YmaU7vMKg5RuVvHG9s2ra8dPVa9K1IUk3r9Sm6qwVVrzU5+B9F9l37lZUDX71k+dbGzYfrl199YH0oW65kO/f2l6GLem/cP1Y4fP/Y8ssm4tGhXSlGwRp0BV3N4WDXhrpV949lm3of7TMYN31vffZdtfHvayfaAvGtf7Fl8PBgyNswWI3+nlUVDW0+CK6LQth3IgPxnX7Zc+bcJhJ1eZ9JfvRLneW8h1zkF+HzvpH9kEbKAsoJMwqJLvIZBvj7AvnvMUvtNrDeSuCgCR8ZUYT5hrttajBsUF12xRWXq7jw4FSbm77hyL/+8tdHC1RGre5vsmv//d+ya/9apzWqXUf/9Ze/gudMZj9EL5HnJOTnaE+KVGzGIJtRAy+xsgrgB0sGLcwwWm0HKYusIDLYrtlrkglTbQ0dCoZqWpCbwVNGFQpOqi+//IqjKsSFV0y1FxW1T60Ic7/Q6v4aPflv/46e/BudllMXHP31L//1yJFf/fLXR1wqzMOrmHvoNHuKqqWSlFgSndHoKRXmYCIqlpyU1LFYbCZA6JK09lhMSgJFgRLBNM1yxWWgaZgvSTtY1AhqQnGrRalqBpdnBz6DmfUgVSiCQm5UhPy1NYkkh4woBFoHihm6quAt3sKpVbWsWm/l33KdMBaYTC7+Lec7RqtBiS/rbMYTrrc4l9ns4tiByEGt2WR2m/75n0xus2DRHIgc0GhpRqM+ED2oEQRTgfDP/yQUCEZBs7/ygFrDMFo10ZED1CuKasVfUjqYlyIVFVVxCSkzIhtLUwjjEkqrCacRhQ8Rg6elnoiDjkkasHyKWFqjxfc0KnibVoMPtZQGpCKrRK0XlMpr9Qp+4QB6eQi9ku0eom/pQ9/PxvqyVegHsp4ezM6hIPUNqoCKU2knNgqMHsxuIVYwkQPIC3gU/xQBc5UUuDIbTGjGSXwchp3gxGw5EWM2NjNJosYHq0srqmxlKb9RrVRoi4udCqVRE6xaE4g3VpePjazwGtVaVqvQlibbSmg6LtOynU7QHfQt4PF9mB8S0mTwDxIVUYlC4RnGimcQ1kB5fNbt6Od0YmQE/+0UYOsyGIdAlS1C1vkDhFH0ArrGSI/6BGieOhcpnwuP4Rlnz5x9lv5H9keUmjJSIhNFoiYqacknqVAC/ASMnKWvNJaWz12v9gqrlXTwNGWxUATL9p39UDGe84edOQqdmkzO/6mBwlLZ0xkWPJ05I5XlfFoO75/ju0zNCKhHJquFxjyPoE+4pb6Vd7w+NfXGHcPDd7y5Z+r1O1ZOdh66d9Wqew915l/pd99E9hfHx1/MZt58M5vBR8j+pnTqkeXLHzkliacf6el55DTm7yxg8RD7TYqnAIkrMfUqFaD+GLFt05wSqUE/haioBtNmyKQZNVZHhgXNVDP4UK0EzTTBaBg16A6CsSAODnR4JIjoKehrTRJ8rS80ix7vQ01zVjTAZN/SwrRRNKFDpx/q71fc4w9lfwNmAFHXAz1h4GeMWk+lKUxPpTaT9mBuGrHKxKOiS+ZmeSztsmASXDA5MG+12E4YMlIN5jHmLevBvK0E7ZYU5WDKjMI0a3MFiLOKY63OYS7MUuKr/KFmJq84KvBWcW/MVoSu12nQfzbtGqioHb+4teui8Xq91kMr6Wr9wOH7xkfuuagjtvpQc7be2x2gD/IWv86hRv/VfPjSK7qHLukPlPfubAog9fovT9ZUbf7y1uHbr72sJVutVpv5FJkb15/9QBGF8S6nbqfSnXi8HGgP14kHxoFxSMeIImkAPTk6Y3n01BMVK09KpcCFUlmnkiAbdxL/kdsB3HDzorn4pCC1ADt64XZpJfCAUQMP3MI0F2vsxGZUcoCkJKoFrjoFsTEl+k3p8krs2rGBxQbAg9zsvN7VnsusKFrEKzfKI6jrQ3q9zsKqlbZA7cDOjnW3rY+Ub3nskg1f2lQdX31Rc9dFYw2c2q1iY4b+w/ePj3zlQGvFwM6mRx9ffuXxySue3N2Atgis1mgxJesbIoVNGy9Jdlw0XL2Mjgztbx842Osr69nZkmMnxkbdh1bXG92v3TF+7/7m9j3Xw3xsA/05yj4H+myjeqm0DmMi4qYNgg4ZwiITlwyg4GqILuxRUXcSwl1JC8gHjK8D640up8WCAQ6olIgEsIx5XbYowwjMrhfceRK0OpFso3+6BmkMxt+NzY0aBWYzvZdm0G+Zd2Y7EjpDdhN61KBL0H8SSi1E1veCrBWAHaLUP1HpMJa1msmk7VjARdrMjNcUtgOF5rjkVWfEYqCwKioaTkpBEGJ1LnSd+yOJbEQ7BDYQ0UhFmlOc6D7xquFXb92Ib7BicURyF6nhGiuZbXDTekK08tMWq9kcflX7lRO/gnfpQD+mPe5iczgNv4tvLb7VrwRVSKXhXfBCzVhtbosnIgegGqvNXuQ2WzzFiwNNBFSB8jiceIaZYOqnKSZINEeOfxaZK6UqZMas83sZYtjmwfa9hVqLITY41b3qy3uaIuvv2lR/fU/rIfq2AvfcH9d0XVZ38OsXNwzd/OKOxr2bhg6WGj0l7sT2ezauOLa+BpvG68othdkiwdh68aMbLnrh6g5rIIrt8W3A4yrgcSFEJ2DRHJjLPnUmrcQ6wFU4lDCFOCVMoWpilotgChXxUghEbwY2x+A1VARQQ8c5VGSOVPjw2Mw6eVZgmyF7BNW5Y1lqoW9bvRXdJvhXZ4eKa22NT29Z//Ch1u4rpV3bnjnSvjG+7oaRsTsma2s2HRuauHNLDfr70ZM30BbH3PfKewPN3U0HHt665amjHW2XS2Mrb9maTG6+cXDkxvXxlq1Xy/70BtDxHpJvci3ScMmoJf4w5wSxHwVoRMJMlEiCzt7A/LVKObdTXWhvpx8ymGbf0PHs7pYKwaU5/TPeynoKrDz+fIa6HHhYBjYpBJH5IPUmlfYTOwyxBEnR9CkzM21JvxF0tS4utangqUOEmbI9Ehux5dHCsTYqNcomCvPVbchMW9wxNYQncHFZFBtxaaWs18Lzb1+J1ZcTWV7sOCGl7KdEJwTsdSknCcxZZ6qDqOMM66yTD0lQvqwRZGX0VyaJrJLYyrnBi0p9bXBk0abmoxKmdhEmUMno9byR4ZLzyyOrLu5q2drur9/7wOZND+xt8HduaVl20arosiue37nzG5cvm6zdcsvIyM1bEsv2Hmtqun5qWTQ4dNmqkcuGSsLDRwYGjo6E0dVDV65r4k2tY3uaB26aTKUmb+5vmhprNRmb1105tO7uncnkzrvX91wyGo2OXtKz8er+4uL+q+md9XtHY7HRqYbmqaHKyqEprNsiyD0GcnGDdwTdNlP5ODuizsy4AmYcXLtUspMEcXiAzR6eQA1tzi2WeTCMtrvMhF+RAOi2lrKnlsbMKgSGDkdrBH98gkli1+XHJzc9dnGrPdJenr3e6B9DX/fUWBuObxq/Z2/z5tj4Vf1rbtlQFV93Vd/QjRsTCuX6Rw63tx15envdju1TTXM/dtCrwwOB9uUNU/dNDl0zHm3cdKRpEKZ1fN01BFPdDZhvmPkF6LefqlxAfaI3Ktkx5gsQEIsNtzUjFpIXqeR8yE849/Ru42IgmDz3bEnWdGwJSiR0AaaW6aqkOnIW3Ap0GaMyFo1ERdNJiSqGmMUBlGnJixQFvjtM8+kLSrKGwbU4PpGmCJovBLqX0K08PwZnrj6H5DnqUzH5E8jIPKEYBD9JmWsRsRRKFYToOHB6gqH0/Nx3fKVhD50wGugHytGtHTpek/1XQavhs79UC7oOzI9n0X8yp5jLSD7dJSN7CHMA1LNYCdVRSTNviRD8PMsMzkrMIPrPvj7U2t9P6IB/RgWS6UAEkiVwpIaCTQhZEdIb6WRxmSUgzH27gKGQsUNnUqFiXsNyauTmbB3ZS8qBDt/ZD+kfwLwopeqpKSpdh+US0ecwuBdj8IaoaD4pmTic4Zi2m+IcTAWQUFlUiltJ1qMQTxKBpIglkxlPEm+kDic94oLIp8RCAOrE1XkjcI/SmoJyxmMeAimMyB8CG6PIzxGAu0vE6yvsGtlSv/yqTXVVvav7amh9B1vdM9pTHe7dVNu5pTOkMqpf5FzeRZEKGy6Ml9rDQxctX3FgtK2u3vfMN9nylsamgcmu5Jomj78ioD8zcB493X9WryxlR6gV1Gbq25TYG5Va2Ey6pRfDw5ZOgIfGqGiNS2FFRlwVE9dHJQ+bEWtBbBhabiG2ox5YVc9LLmDHIMSkgzzG+DNBOVsQ5KUqzC8uI22V7XdT5vffku33OC9OnJD8ylOi7wQ17fOPTxC7PX9EsINpUDC9yFo9tS2964GRUlUQT4/2bjI9jC0ksSqth2nygpZymarqc+klUyKwiJ8h2TjJht1mZzjQ4nPsFMIpE5siHktgMOtBSoXfFwjSJfl0kzmCsKT2H/khsj9yy+xbFzfsvG1wYi2d+otVqVV1Be3XvHZJYlNwvV5vD1a76vcMV2197tfX3D77xoGL/w5pvnrvme0qHafkL8q+/8zx7M/+8Ur0nqWssaxksKfFNuys8a+7Z1c9HXsOlbx32ejx008eePn6no3jG0dLuzYk13zz9jGTKftQtM9dWefVNR36y8l7//VrPVPvZD967IXs+69sXNbOcsH+4anvo4o1Zd1xt7N13yhqUqn7jn4NyxcMIusC/28AjFshR0mAa2WYq+EogLmSBs9AexRj2lxEZsZBD4qTXBSD8/5+sxfBVAMoY6RX7qJXruTM7HNzdc8qLMYP6VuyP1VxahWnYo+fXmM0oCeza3UCzdE/EyqdTpwJxjjhPfBHXwM6LJSHKqf25OI1K8QvBI+UQ9BS7CHkFGNywkSzrGaMbQGTkqSj0ZyZVhmdAAqCcD0YlVQQHFfAjaAVaNaDOnjwgTElFgtwKpabRBUeiOBdEnqUeGMJIneIN4kKBP3e99BjV7xwaX1p/97u515pv/LFi7NfRlN/9U7Nli+tzX4FNUzetTb86lvZv2OPV2+8dU1qz0S7yfXNv1j3lR2JVU9+tWtff9lAfNWeui/fQ+zl1Wc/YCMkLo1T6Qgep1ubszAW7bzLdVqIn6Uki1swzWgpQ7DsXN2VVwEUckY0p4cYSXrkXCiir97xOmIfHjx2cFtVsdqkKapoXn2w+/pfPDIx/sBPrlhx2faxMKtValVllbuvumfintMzk/S7TyL+r/fYK9rDEb21OFhsXXv8w6/e/+HT46COIYVSVVE1kCza9TYyEdsAMmMfAJnpKSdVl5OYgclJzMlk5nOQIA6DvHSmssjpSMmJY6J59ucTFCXe/JTzvkfzD2Rf3LbtxewD2Qn01LGf4mTET49lJ9jjk29k//j0M9k/vjE5uvqJ39137++eWE34inWoAejRUd05ajR5ahRMZoZVE/1hMWF6QpjGLKfISPpMowNrRsfkXFkuQSYnx+Sf95jJOSV92dyN9Gn2+Jq5F0fnnlhDnfNcDdUqP3fhmWqWPFONn6k9zzMhKs89ULfkgfLj7p6bwg97ZM3cdmped7aC7tRQ+6l0FdEdZkF3ZkrKqjByK8GOqjavRqKTl/zA/DAE9v4wfq6/FJ6YwDl7J1hLga3C2dmwIBm02GqWgMKJ4ZRkKSMOyuA8j97Np+JziocD2SbkFbDqgWG8evsbyPD0yO1Hd1UVagSN2tiw9Wu77/jNo2PjD//LjX2X7d5Ylf0PHY++lDh8w33rHspmX91Ov/sMEt7eZatoK680KpSV1aGJZz685/6Pjk8YPRUF6CZOk5qbCzaUWnPqJ/OdrSXybslZLpVsuUQ2PsNoCecZ1by0dWYcmos6sloBMiD2IS9nvCgfx/G48N5u5rZdu2YPs8fn1tFPnF5DvzjXKz9vDn5th+cxlHeRnHHqkWTr4dPwDzv/iXO7sMWT/3bt2Q/o78LfuiAOkiNJHZMBWkQljnAoiCoF8lkFZJnSDJ9TiKeJDqdTmZSoFEQFzqWSVY/5mFhewQcrvJZmEK3nNK5AxL3iyrHI7qb9j01GNhq4IqOGU6lV1dse2Ml8a7b+slevbuUIPX8C3vnY5ygflcrxzpbjnQF455V5h7XITwbnI7yTApgmxgs0mVLyGOXFFrIERnLmduIUUIQJI+FPO1ebixwWPb2cL7SOzt1kdpttPoF+cLTAZph7QGe2e53rwU1sZrScjh7nublLLKBbLuvccgCKh3SCjp1blpMz83vgHZv3UBKTm9dIVOZ5n2aofDpRUi0I1freTloEMYjj8zqj3A+f5cnPVVHIjdsYz9dXeAQS7OBMpAA4DtdTmCDYEdU4I4kzgOrClDx8wArIZgehEA6A+uDsZBj5QshmFd5bzgkaerlRrzRo6JRa4HrWK+b+hivgXca5Fxn2uNIwyxd5eS/H/N6gPL1G8eOColl9QQHzX+6CM5WL9duUt66iLkerBmg1E1pNAsGceP1NB7RaiI/GNCqNi2gMYlXx58iKA1nMs8y6mIObHQY6VPozDk+h4sTpNRbFf3gKzjRi237V2Q/ZXy/NRee9lF+7kIu2LOSiLf+7ueirtr2UvRes/uQkWP375l7atmf0gZPXHnvvvlWr7nvv2LUnHxil330arMTuXe9kfw8e4Pdv7wJrIDxz3wfPjI0988F99374zPj4Mx9i+kG/FfuIb7JT7Yutsh2QhM5A9FuHk8AOMgw9dlExUS97KRamnxNz0o69FCt7qWIFAQdeJ5oHBX9Cl1BnEdN9w19dmv0D4jbds7vu+9/N/oE9/i//sPHRi1vnXqYfrN1wTf/TMzKWvir7ltIDPMX5pMF8PinP0wrtQiLJMp9IwjydTySxVoeRBNs+B5BlTYkVQlprpFJL2YuDbjILP4vNFcOHe9HRMYtPn/1u211Dn8nxfW89fm0ku1fHoRUFhefnfJ73Pwfe28G6rM1prkHWXMkH7Lc5CPttqnnzYgf2O2KiXVYkzP4AViQ7aI9JKy8cCjjJbCP1EqJPyAslF+Pa8mYHhZETxRfkc/DMn1NT92xymtFHa3mHLlsllJa/Obvpvl113307+zF7/O3XRm7Z2a41uubugPiwz26aO0j/PLL6aP8DX5XtxfjZD5h3QWZN1D4q3YAlpgXbo20gK2k4p16ER1UK10qL8LVSP16Ea46KjpNSpSEjVvKSEYaSMGSkFnitdJBVMdEovKC1FJXEGnBcmDCJxTC6Ui12t47iBHG3udqPnNyU+dBEpVT5ZCmC61XmwpfxIj2vKSqr79vavPqmDdUt26+75bodzcndD00enO51agRD+fKpwcFLV5Y37yB3mi/9+v67/uH5SqMjUB5w1Exc0T2wtb0ynBi+YkPPjTubu3ujAgpGQpUrttf1buqMVCaGj4yvfezSzm0yTwIg31tAviqIkck6jyxaisGLPThYF5UnsRDTrBKzhMVsUrL4UInXHhciebzuGFBsyzI72aHx8dMiO0Q+/ztnf8+a4fOdVJJKW0luWyvbe5GL50ElmHxcUAb+W+LNuaVmhkyL3Fq5ZYmTjNDf2dV08KmdO5+8qHFn313fvfrq793ZT5cx18xeu+2b1/Usv1bcBsfXHPnB/WNj9/8A04FjIyfQwWN/z+NxUrKDxKtY2D1QEsXnYKw55wsSOWfoN45ADIT+02zQmdDvWLNxeO7ZDexxo+HMimhtslKR1gkADcBSU5Tqx/CMEPVzKh3Cz/AUB+PxOHmUxLnjcWxpsV3FsfHbH79/guTsqQgnKniR4iXGcYqFQynkOPVq4+/e30VuB3HV2QlJy58SdSdefcf3fiqf0OdE7wnJrD0lmk682lTxuyr5ugfXNvHY6Tl18HEumIe6UwwFGq7Q6kxmp8tbslAbhlp5Kn/d7Sn2lgRD5ysfk6gQYEuVzS/bp3gMJ4TmfWXMds4p8qNgSAlmS1jjVqN9Sg3L6lTofoWFK8JsvF+lY1m1Cu1lbNxQtm5DdpVaqdRkR9azxwvPjFuiLlfUonhaJwB7xy2VLmeEnIFPzTgLC51n7LLeAq8Vr5B8fnDB99N5tSqKYuNDSTT2niob8Z4aRMSap1IjWxmSCfcLtD6r38FxLHqZUbPouJLTTWZ1tGYHJ7DZpEKbbVWZ9fT/oN/Wa+ZuVBvV9ISam+ucMwMmeMDIzV2nETBNLqApTeLeqlwWlsqDEaucaALltuUySQSBUPJBXuUWMxGmk2steHf0MGdVq60celhp5tbNZXazxw2GuR2OCps97KDv0xlnn597ll6Nn38JPP9pEv+7c9gKcClZ4ZADJS6K7RdFFjmTyIsXAlTIa71Ez9w/e7HCzs3uZB4Omk2sak3AZjk9uwZ/5jQ4w1NKAT4zSjJ5ajYjqqISYsnn4cmr5jNpNcFragOJunIPMecXxuJ4sXQaLTNxP/4xZ8r+QeUJGIRT23hDCYXO/vnss/TJ/Bo7tXiNncFahmWkLi810leWCl41+6PgqazZiunaB3Sl83QZohIDdCnhT3N0KQAGAF0KPaZLgenS5Omy1yQwvJNDHO8+HlPFo87s6xkDr3yA5wJ/xnUxP2DizLcIXsvX81CkGoVYRXN0AZzll7TlBIqcOMFZlB+g9U1owzKdif1Yw7Esp/kTyxuYOH3J3K2cFr0peAS+WMi2q3lZn6nsb5nQ2QjEI3ZcayBRbAb/kFoIOQqxgo1lQrP/+COCo8cUT6KvgC/TgF8majaj1FNGXC1DQtMZ1koZFPlI1EzWbDGBYxucDv2jSb1Jzb7Cmf6o0mIfvw/84hqFHuxWkrqBShfg2eSN51Z32EzagiiSOUpryLq6htOEZ9i434IDcExi3aJVHoxwRDYmuXD9Mi8VGTN4MqbwWjNmlpASY0Kas2BDIhaZRDdMgjhenqHcqZSkYclb5Hx9Ert9kjGNotyimoCPlxSHQZS6r+ehj5+/7EjvjuWVRotOGBL3D1++sizkUXHlIxO7mmu29kU2+JK9pQ1bR3sDf/Hjm1s/bts3XK3Yc8e9ZdVl5qKh4ZrNt47O7Sy6rqy90u5u3dob76uyuyItJUirCDSPEhwknv1IwYKeWkAfVlJpDvOIiksO4IoSs6dYlRFRNLcGgau3JVqIkXQWrqTRGMhKhFRkxWiew3C6GNBDWiMwqRy0F/AYTbkYMARhedI9D358SpW4pTN94LUf1R96cs/u++uUjCNYf+e6iZvXRp55aNsTbeyP5i6d2Jmdy84eeOvO4ZGVV7p+MdbdfuTpyV+f3Lme6NfE2Y+YvQodRF1Ncl2mVACks5h0AQ4E4tIFPQY8lWQINiA5gpVcKAAoo6aK/fPFfAS7yFnWxXmD+WwVPdF8+Ln9Wx9IOVmtWhtoGG8du3l9LL7u2FDv1tagzqAucCyf2FW/+bGL2lD28InbBloSflZd6C1oPvzUjqknDzX6y/xar6c2ZF124zvA+3Gg/Rs53q+h0iY5eiK8JwPwAO81i3mP2Y5BhJqLxSRdjvcFmPesCfROJ4hGnEHEEqDUxkXLXDY7ia2iBG3TZosNJ4kFOR88Dryf2nFP3ZaES6HtfOHgaz+aJLxvuGti4qa1UXQGs36gh153OlLw6LoppEAKzH3ataa77cjTWIewDF4EGZSAf5ik0l4sBUt+EBXKzEyQ8+KMT1AxHz4YDbjiWTTmIgg+F0EYgXLW4sWTSCtIzkKsUBwuhaXwcUoMCgCtFy8kKf3eT4op6c0FERMth5/bu/rLU40Gbs6T2HLb6oGD/ZU6g6rAuXLrodTOr1/eMUk/Wjl8aNnglWvraNO+V27sbzj01B47b7no+UsavOU+LK2gbfnt3/7J8HUT1bF11xKd88Cgr2Rfg9c2Kl2IpQZwrygu2ZUwV2IYd6lVGUmHRwvBeiGpdCuAAdti6YJCrI8FToCY3hzEjC+GzcQyFCEZdoaCnucrhy9aVtzqZJBZX+6JjTb5UF/2pc1fcjPTpdeuuX6sQqeN4pxG+66Bq3pm9zFf0tJyrnogez3zM7B99dQQNYni4LexMDYpM9N28yZ1WHIpMmIiKrUCyX1RqQI0LRyDQEdajQ3fNiKjBj4jNvCSUgc2jicr3StxHoiDaB487kqBmMW1OAaCQzcvdcFhtZBJV3fhMVY7YIzbZUj4pw9OPCkvl/Tz4vITUrn6lBg5wU6HyyPm8KunzCc24SqN6Up8Cm+Z7ulfbg6n4XRRrQZcw7UaL/SXV0aW9+RQ3ov95eGFU3mxZW2pYGrVMGabX5doXb0JBy9uQSwATeprBU2qbsDBKISlOGXlB6tVCmerBUlXAq8u0zTnXrmWWATwp7nq3vkiX5vdiwtS89U/IbIEozzP2roixDFLl9YHdq+PN/LeiKdnZc2mm4Y7DlYituj+InftxhtWji0PVzdtv+7G67Y1tx55dtfUY/uSayLj165acePWVHzV3iNHa0LtVa6Wku7tbe3buwIly7a3tm3vLplaebhYaK+3RSNlfPltG3ovXR0tdvtctC60Odl7ZDRa4Oz0VERtSpU5MtLZcslEoqJvS0flQJ3X3zJWU9XgNQBANZbGGhkqtbGzpKRzQ738ulH23U+BIv0d2Ccr1ZXDovq47BWEnFewzVsmmvgEHOnoDWTrjGSwkjASDK2cH1zwBsTjCbL9F57a3P3CwVXXrApvOXbT5Nc7weJfvmZH7eSd43OH6dvuenzHxJwC25j7gaBB9gXKDDiimUpb5msBjPpM2opwms1xzsYjC9l4ZDeQLIlkn8/3fLJaHgdi93POYrPJ6+B5h9dk8jq5ss3shMnn5Dinz2Qqxq/Fp19mzsyyFH3277M35mgJ4ayuk6SbgAwtwnAdMJsGMFuMZJ80JzE/pu0aCwfzxConn/QaIMbpJ8QwpPAMzPFConQpfXEWGdRu18jQZk/j2mZ39KWltGYfrNarJ0YUV545VjvREdQqv7OEcpClCLJ8E2Tpns+lWuJpHRA8wxRROpxIZWWReggX3USkUjHJpRaB/Pj5XGrifKlUBHhY3FLFOXl0r85hXp1t1pp1vF2PfjrK2fTZVUKRO8r+aPZitRFdrzNmR7UmpdpumMvqDOg7Jm4uS/TtHfgVABoZsKwyjZigXOYaBIl/FjLX72xmf3Q6ktNT9ocEA+zLxQcOP0SnCEYny8QUl0pBY4tieRBQYcALHGIFT3I4fsP8pgCHjA6kCook1cQAdjhgJkQDKRo04RQIjr1YQz5z6SF1gTZ7bmk8p9jcOSpeW6DQuDsG1lQduMFh6li9rbb/6GjllmuP1G7pq9h86cGRO5PMGddXyrviBddd1LKuqSi25UvrsPp/7cHgwEX9+Ojuh7eOzWbzcxLGaqcGcjziciNV44lpVs2nC+3yGO1ycofLT4TcwIwCCdTM1HzykAzlE7MTk77slUMLExQovW9sz5IJKmOZ00DXObnYPAbwq85bF2z49FzsZ2xVabn0+X37nr+kpeUS/Hppy2R07c1r18rbTPBrFGWPvHVrb++tbx05cuLWnp5bTxzZ/uThlpbDT27f9hT+s6ewXXkqey/QrQcbF6DGqbSQp5uwVIOJ94Lm4ACuZB4BszYZAbtz1i6INzNSctLMLUgagVRO4FUrvUUpozCBRCrnQGEnOgcIP1VrEJAG8NfrP2w48OTUznuT9XetxQDs6Ye3PdmavZfdqjM+tG4qOytj4b6+rJHuHlsug+FdG/BYxmEs34CxYDw5LuNJAibxNF9AlNxSRMlhIF8AiNKQQ5TcPKI0yFpyXkSZJOGmcCFEueuBpAYVJbZ0Tu/PI8rkl9cuIMqhgUOu0w/RRRM75xFlwaoegihzc5r+PYzFga29nBmfl4hFlwEbyhefiMo10k4yGpi6JEDDJstIVhfs86sLMusXMpNYs+MCj9TVTxyJrPBzjKC0+6qLL747wpzhTO9dcbvZ3MEjjVZ9101zu/JrYwwL+t1I/ZBK15N1WyUEjvUkcFRowulCTFkIroUIxAv5cMjRFBXtYG0AH1XIfK4VMlKzDIren3zHIoMiMy8KJ6So85RYfQJOpk1mAXBQlJ+uilYDDoLfi3AQ3CQ4SDCZo1XVORx0zhlBQRU4L61UgAw5YVpTGMA1JWKtSfL4sHKGNDiNa/fU5tK4i9brzsnj+j+Zx13rYPU6Q2nz+q62LW2+6qFtU9uGqqNrrlyx/ktNNpVRV1I/2pRc1xqAO3vgTtXaG0anHpjyqTXeoDfQPBKJd0S93lDDaGtisr+yNukD9+Qqru0OVbVWFntLG1c3dRxaVd1JeF579gP6QXYT5aMOydG7HNIVkJDOpgnjLUieuKQmsDut1uXr80nG3k08r6iKpfVufEOPN6G4Sd7EjQvo9bzEcBmcksAugMHLyTRwRifki9Vqk2Q7KVnoztkeHGFgh1eL0yy133Aigz6CWrMnrMG4u6Q25ODVBaEjbTsu/rLOyDwb1KO9Gi57ec/cQHljyGxzWbXhcM2hI/TLBhjb7aBP32DOyHbcgPUbJ9YkZc70iNp43o6D18NJZA1ojTFG7A224xqG1LiIelyvRUlImfPRJKssT8aFiC9C37712I1bv961JVGENN2vHBq9elUYHaBvmzt81xPbJ+jsLFtwz9huMOpULt/HfA9oM+Gcsonk+1Au35fPEFGmCyb4/K5+zqRAQ1ody+o0aJg16Xuzw6uZM0bt7M8c5TZbhY0J6DhAUvhZdvDd/wAIr5z6M5Uux/6sME4eJ3EFOK8cjuLyGDxf3tG+f2w+r8ySvLLCcIqFQ6nccOrVt3/4u5Q8nXy86DkhCcpTouXEq43Z9x+S88eF8GcOXizkJTve6OyAUFp96tV3yt8vJiXiAsw7wQLzzsdPF/s85vC0F/9Ow8VFsw/uwIvoTVGtOgUrmCx2h6fY64sszjwbqdydgkJPcfk5N/PTExhYjtdo/amlLASjGsuv1+LKa7wgKiff8KKtvZczMwipNApWr0YmlbXUrkIGo1ahUSNaXbA8+9xyXpX9LatmGDWb/XeluXOB7WE7E7bbZ9+NhG0VdibgnGVtTIPRY4T/Z//GllszYW4DuRfM5575eJpGueWEwihO+eRzz9bFuefEeVLPAXQg+/B6nHoOKzhkZ3ntRPZBdGg9zjx/l9Vm31PxOlqD/qDXZIcEC7pVY8ia5/4gaNDbFmN2o8aIdQP82feBHhvBg7IKitboQqEXZb2gFpJ93vYhI2jiGqVWweqUaIQ16/rmXlRaTMtmCFt+aywW+GKecei4029wJnQnPKMfeLACnrko15xPhZEqzwvkmvuN9DVzX6F/aZw7Rh8KCVZm80CZTZj9ywHM17bsH9AZpUAtR4cosT4q1bAZUjwKIbgtKvG5DS4tELu0gheO8hmpMBKLpVuipIARacLTndEWCGZUHfG4VA63PWG4XU72zJSnwJYJMbzrhWyYeOOjdfJW8NaIGAZd46WI5pQY5qUOzalX31r1kYZMIW1E9ETw9uNCuOnhJRW+WfxHA5kJWn5arVXBBNDg3zBhposK8Xxw49+vNs/+8XHytgg/XREJw/VK/BueNN3W2gGn7fh3Go4Xpo3YnkrDu/BRRSoNn7boljuVhufgI0AarbxKrdEWFrk9eO9/a1t7x9JVG/SSWlPkrqic36uen081oJXleG8PBCIlKdFmknTFZHbV5kAj9moNiKTuc8m9RbXx+BQv+BTN11jiP2kLNJTbzHZzqGeqs86k9lUsr3Gb7CZnebLInSh3wqG7ZnmFT22q65zqCcEbbeWN9JYWW3nKW7dnz5765j0rKsI6vSc1HKvfP7UnGWyJFquUxVXNwcTU3n31seGUR68LVwzubknB2+t8deV4HiJ99l40DvrCyFXG8yGQMUN+5BAIgX1H+oHsvaqjf75JxkxT2T/QJUTPrqPE5fLaQV1USoKe+aNSKKdnEJJqC0HP2kGRIm2gSO1ky2V7HehZU7tGTZpfYD03OEHdmuBd1c3wLq6JbNFaDuoWXFC3b390j6xuzogIonDyUjVoVIQo1qtvRT/6K6JuhojYFsHldc1ws42XtPim4Y8XET0y8NM6gxYUR49/v9r84R93k+tOftrlLITrBfi3WM1PR6sjcFqFf7/6VtlHPydva+anW5rb4Hor/p2GP1mkXAWpNLwdH0VTaXjbolutqbQe7/tNiTqsd1qd3uB0FRRGAEY1t7S2fVLvdHpXQbSqpfVcvasDPyxx7aB3SQH7Y79JclSmUrnlmEWql9uTgU9BAYNN89tpSP7Sukglw2iK1/gqemrcZpvZWZ5wY12DQ3dNT4VPw9d17ukNWWwWe3l9IFBfbofDUO9UR92vZUVL7d8LitZcVaxUFUdbSxJTU/sa8oq2Yk9zamrP7hRWNNBSUDhQu1TznsEKoj93odcVFnoOrO1qCuyspFVn0layNdeKEZMrKrFwhXWRBXNeM9/rxWMktUg4zOSNci2S0YNDCCvGmi4t9nSOxTEdAZrxXGBHNtjd5W0eT9Xu272tItgcdgwWN0+kavbt2VYRagw7EHq9bvPystLq0oLqztK6zd34sBAOSS8amCvHAZdzVCHY7jSDDbVenwFvhVdLyTqeNYN/pgvUOCFUaMD3REucZGStMRLEFRQCiXoGU6uHQ9Ei733CpC6kZJJxMBWC//1E6aIuNPNNaDYyz5cmOJevFO7VzS2b7z8TmZN75jyenWPOKLJUlKqnbpL3UoglcakWAjJ7LF1LKh5rCzVynIZXARIqnDAmpfwwiCogtkpuVhAE1FpbfFIQw3HJDsdBXlLK1eliAudnbXCgi5HK/mCCRPeSHaPDEhhdohZwP0cJxfNrHov6dXCI9Osg6QycSs+37GCSuZYdj7dd9fJhHTJyJfrxWxMOVmPy1Q2nKgZ2dpXq1GqF07FsYk+DfH/LXx5u2VS19pqhyg1fnqxB2Yv+6tZB+kcGy5/UDVEfq3a4C9jZa2l/qVfBFrtjQTv9Hm7F0X/Da5dOPnKoTcVcybRe/ATWyS6KUkyxLwPXLpI7PkiVTEY+ADea1uHcm0uTmaEUcZ0hLBbH8eqiWCIzLnUSR4QhvC8olg6l8nFZOhXChykKF7am4powZhYlVeIOJ+UpyaUAbeDNsvMgi6r5Dg+Li0oFeY+fQLbjx+UTvGVU6DILxxO7Htm54tLxVltIYxA4S7RlrHno0uEy9B+CIVvT22oPO5ig0zrr8bfHi+ibvEYrqtz4xJHOYNtYtZ0VipuiBbUbb1yZ/XGpzpT99torKhSKMmNRh6GsYagWrZD1CVEQNm+ASD9JraAwIiqDMCgOU1Qpr1wWn5QCoAkBnuSzOC5DFivxFqiXaLVgcRX5daROK14GV9Q6coWW1SJpl6PlpJ1UmytVdlVIbuqgCpFceCKpWpKNeTz2cORAW8uByMOxh0rC5SUPxx+OHGyB80diD5eUl5WwFX3bU6ntfRX5V0V5/GF4Y+Ch+EO5P4yTNz6cP/95altvRUXvNnh3f0VF/3bQhTWgC+3scaqYuliuTMvXusy4ChyUvJUUr2tYYzNuD7lgjEtuuCCAOnhxuRPePYXzYqZY2u7AOmC3gmHjY2mHHZ85XHgvcUzy4USZg1TNALLwLJTPEIyZT4B6reQ/XJBbS/5bs7LAgLaoOVYjoC24nCa7Ak1mb0GXZm/ZLL/A5eOuuTWWgOAL0cd1xtnvNx5pzB5FN8ELqUtb5PtVME7i/dVk+5cihp2/qIxJKrCxmnkMwMg4YACQAFMw+2+K9Uzh7G/kGrc7z17GXEP2Wq+jHqHkuWJTZtI2EinbBBhsNCo1wJUGAjUbEtimrycGp4fPTCt7sMUsADTQw+NeQ1IALpYHRuBiK1xsjWIwipsrbMg3VYilxB5BTIDjNYl14GOFVr3OzHhC0YauwaHxCZyDGDGRMjlbg2B6QcmVx4YmcrYosWiZZWnmQTm/4zoYSp6brADjpAB9lRdd0J0bdtV1L8pGBBpGm1Ib2gLxVXv271kVX70q2UUyEg822VmDzhBq3bCsZWuHv3bswMX7xxJrSrsmtmyP9LSUNI+s21Sxtp/+58GrgsFt/cmtA5WJhN/g9LiKE8tLo8vqotWp7k0to1cFQpPdJGNR51ervcFiX/NIVc2KxupYbffavvL2RCRc4fJuaY4sT1WWl9pDm7FcShU/pKPsEYivS6gaCu9O8sXJhj9HDL9IjC0GChuMiogsZ2CcbiGL7Bm8WgpyN52bG0WBJeelBkcRRDZ2jrMX87zbgVYaHO75C4LbwZp8HnziEXi33WCwF517Ctq35uwflEVgdwvAY63DPY9IjZtXkUmrcFFGWEEFFOGZsX6ryhCWxkCF+sewCvWvxCjSqlKHZ2rbyb1abI+ITs0UytupCuXtVN1CRuzmcfJ0hpO7n2A1CnaDObJ6VeHa+tExYqCa+gXTi1xhsIrqHsUK1C6I9bLzUuDiQ7wZDW8xWZofti822osX9BO5rf5yYmRN7aabnnh9+/Y3nrxpYyKx8aYnX9+x7Y0nbtpU27j75Y/vuOPUK7t3v/LnO+/4+OXdH3Rd/uy22vH+do9DxWl9DeuXjd42mUhsvn5wzVVJvY7V0MWNT16y5anD7fS7297EH4E/+s1t29/IH7+x/c5Tr+7e/eqpO+889dqePa+dumP7s5d18kXlhT5dgacgse2u8XVf2lpTDngaPmt5x9Fn5Xm8lxmmO0AWQdCWq6m0Bc9jjWJx2Yroi85UEJGIsegMS47ymytC4AVCcqMpFuN+B7gCvK0ihON4TgDkWi3AR/nwqqjDJBblNoFLToBsYkyQqKLFFSzm81Sw2HAByyfbG9VyaG944z1Ty/oqGssKdUaVoXpv1449Xp2O1bpiiZaArzlauMziDTt8qViF7esPML8raY8V0zUrVtqdds5eHbl0W/Zqtb7LEXAaTMGGisJSl87o9FvuZJcRvjxC3UJ/h3mYzKMglZsxMy4rpQY+FMdIaYEL4aJks6Mo10in1my32S0qBm/+NMORES25hBd4H/nYzSP1awaNVv+aCgluDp+rXsfnr6sEN23g0DFea9Trsz+xaNWW7I91BqOWR9ef97Icmz2D1jKn6J9QLFWV3zma746j0Mh7BBSkm1JaQfqMKKj5PQK4A45feIZZuYq+pS97E4qAGzxnfi6jBqknLzBDu7rJLOwCrNTVjT+4qwrUpTE2Uz1IblSz+e3sS6bnMjDt3TFxGS/14bw1nNWeM1lXwtW+ZWDErd6wqo3sHa0VIKoSgyaxEXSou0swzcC0pcitQUGs/RyTlhTVyeZ+SbV0AnQujD7/bEVfnXvo0euP6C0aFBjWGpXZ/6l2FRy894qj+44+9bnn59zzzG2XHN1+TFCZjdmbVFq0Q8dl96MfTa7fsBpkamFpmJddC31+2IxcQLjQ50d9Tp8fC5h9uoPsJV7PjNF/y75K1svaqfn2cXhvNel4klst4xZWy7j/ndWy9VUjB1vbDo5UwWtb24GRqp6SltXV1WuaS0qaV8eqV7eUKG5pOTASjY7sxx3d4G37W/BV8q7VbSUlbatlW3SAGlZUKx6CMRupjYv2QOOQBaCnqImlFaTmSsHhYEZBYkUV1nA+KnInMX4xGHE/krSBw/cMDKijNpbmDCS9gONMQDqCvLtd3ki90P6JeWu2Jd8Carivj97Uhx7NburLbkMP4Dm2lbmf7lFeRVVSvYSyMuCnJSpq45irBQp5x7r2pFTMZdLa4vk+U1EM/stI15wgmDyLIClZ3D0HV7zLIUDLfOMcucfbfOEeaWxI+uYUoa1KzQdFsaDNUVpb1NJrVVloA+Pmrt5YOdTgdYbr3T8xl1qR08nc71ALqo+KUvVN3kCt39STMiPEbtlVEOurLlvW1uh5j2UdYWIzJpm/oPtgPC3USgrCGckAUNYenXHIhr4EMH4Ub2pGgMRE00mxICYlABpWgaK05TeGpClFghh2QYynpOISGGRBldzwhlhuD3IzizreoPlRqhaqExehrwg96VGoWLWRYRSWksZIeWuZzRbtS65fZy+tcbf1mpRmFe/krlpfuSJV3NPcNxhsH6tuGkl5FSsMNK1Wq/XlJUUFFbVOX23QGqMHWv1xH9/eaEGMYssuV1VnRee4RVjdWT1Y5/HUdGEe/ETxJC3k60EVuXrVC9aDknZ7uEr1J4/pnI5NP1cLBsWTfzRx2TmtSrbDt+M1UuYMVYRXSM1yTQvIe37VRSwAxO0mk88lkLIW1zlrLx7sU+T+YaKGZHz0pvkVGIm3pS60BhMMAROxn1y8FLP8Gzsnbw6yTLXFkX2HrVu8HDOxYbCnYqIkK9kI3cmzTYpfQexjxrU4xFroNfLqFplteo6UAiOs7xzpqCca+BlKdoVUFOfecLsoDZ+RrPOd9iBq9ZPthH4Bm4yWi5/ZTf/bv6/JimO7jl/comgbvmFDfNWp3yodp37L3JWavAXTcRz9GR2hvwV0RDBynWH1lAXcjPxCHg9C0VrJRfll8QMXWajjfGGJxRYqFITCkM1SUsjTG+bPgoU8D54DP++m7N3op+A1i6ijFMhmRk2UP60mi4Bq0k0OpCWcnDHJ3ssk9+/F7W89ub36sd91yjlKIcKJ/AmFZHKd4kTzCWqaF0xmktyDcD+/VV/A2aoCbF7VBaQlUq45FIGOpGNpMr4QjdykVWlZobDMXVPvirWXhpvdazcWxrrKyoeyf1Wk1xl0lSGX12Zgb9nCNzd6qn1mB4zpPrBTHcqjYEF7KHD8Myp5QjO4AzMelgrl7KWaJH0v0IRMWNSEDNMYF+JWb21cSOLJG7rvpw33ZK/4S8VX1Gqdmn39jbmRWIwuC16rRFpix8eZQfoJ9iWQo2fe/xQpiP+x5woXF/qVuuR+pSSz51rwP0X2T/E/NtlngzEZLx2YWtY51V9a2j/VuWxqoHTFnn27p6Z279ujONZ9cGU4vPJgd/718PXXH774hhtkXzMD+O6XgO8sVBkgPCSWk0BYG5sJyo41jOMFmItpJW9NkWqqZA1etMUdNZhgbU0LMluZULBk0cVQ/uKM6nUlXqBUvq4yuT/+2C0ghfo1+QpAPvnStE6PKnUGBcvpUIXOwGv47JVc9gpeI1zoBqZbQcFEYb/MPg/ydVKl4I0el3fmiP7czkhLXAryuHxB9MZnymThF8XSZUEs27JCTXhGpeSRIbygGMRzfZo24BXiAOh7eWzGn4NxMdKJJachYkBIuwrKsCvwk/1HUlmQtNzGu3YrU0v0BzfzyC+j+UsQvmMJI6u/1usjjcCSt/y08WvZK7F2aXSqx5i41mUJz35XV2hCZ9CuzmuFA63ZaQfdjkoYxYevz6ue5kyUvUEwn77UxJ1Cv856S/hvfYsvQWscRXLNKubbVI5v3dRjVNolr0FKHWwmz7mZsloX3phXBji3rJYwLEIY5lrCsOWfi2FSPbwhQKo4Ai6YVD3nsGzaGqttJUFohwu3WmoF9pUJaU+sPtc07kI88y4FDaoLgIZzGHmAqdE6rTIj6QGl+kOAE1Y7hhN9FqWVttIO7hqAE/U+gBOen5jLLMjlvAB/nWqeYIxmjDGE9hYzomnFlp0uDDK6W5sAZCidYayro0RX01Qb1UdNAKJ7jUq3Y66PxtOVmOPL4lKxIiONtRN9HYnPrJVZPBhLryUR/9oVwH5DU3slCAUAyozDjg9zIAWJm6JiwUmRj0kx3IwG56fr4CDGS6tBW9fFZkZlbV0RkzYD61fXwWzuH1iL9XRUELuB82vHQBr9KbFJEDem8pimLodpalNisSldUh5LfS5MU46X0s+Haj5d20fnMY+5pClS3lIOmKc/sX6tDTBPS79ZBbZDazIS1FPn7W3qW1GCUc+qOl9mYWYI6A9LZgZzXQ4SlQWLCsO1LoBEFoBEbf64V+hJWEBgzJZdzmqMiczCmo7qwZTbXds5+/iFphBIK3s7/Y8KHVjLBmoTlY7itZCUPgNIUbLjbfKNS3dja7jMtF1dzoWlGmtGaoIr5bgnP2sE7qoFXM6mMU3bS6IpMgdSdlw0pC4szpVHNytaUNyOQ7mFEnxbvgb/3E7TwXB1z+r+GlrXoYQD0gOopntze4lWo1G4SJ+g7qs31SEf5/JZFlZX2lbsG6yPJ/xPf4MNNyUS3Rs7kmONxYGKgEpZWhgvdZQPHlLUfqIfECP3i1FZSL+Y4k/tGOON4lzvZ3eMQfMbjT6td0z2Py922rn/6NEL2vO3kaHDGsOPFer/OzQyBPyycOnTaBzLcE7HRdl3tSb9+WlE7T82aH6uYvM0Kj8mNIY+lUZ59+fn4GMybifxE5zi5aVPJTU7++G6D/vUFtVxWkGrnlWZ1Rei+HvfY9kbYMKwN7ALdP+C0B2jDl6Qbgwo7HHJC2FiNCoVwksgRjrb2E/OxGS7FCNeYqZEznnglnKBmGB6AZnoQnM5mRW5IUtRL8wcD1n6vZCA5lc/E8mFxU/lp7Yj+jdzScLnb07VFoYrUdLkT/h9TfWJwnAFfQFeDPibI05vibeuItAYcXmD3vowwSQyT+YIT8qpRmrswlwJRnGfw0IwHJFYvoTRa82IXp4grriVlDBKYRjwNG1C5sVsuLDklwDEEnl5NX/6qXrwkcHu5nk5Q83jDDV6ttrHux0Gg8PNC3B+AV6c4D34PfhvbAaDzc37YovOqAW+qEpzfEl8mrYEozMR2fnVRGcKc/4tSbQlLGtLmKRZZ7yytuAvcKjGTb2ASYXBc9gk1URAW7z2z6Et50PUn8atLxVGmv3+lkhhYaTFD8pQmGivibe3x2vaL8ClB/2NYacz3OgPNIQdjnBDAL8bfggGP/s7ilL+hvTetFNfodL63P7AxU2LREtshjPpkbwAx6lwl4oZVq2fb2TkiOKSRRyLnbj24zOkIsQSETURHFooCk6JGl7Sw4uCn2YVGnN4Wo1/w81pgwV/+YgZ/2ZeUrBqjd5gtpz79R9+vAxnzv0AC5VwAfioMjPFzHuzb/bSR+a+MkA/Oqepn3s4Y3CjFrpySm3RzXdHQm9lx100x/QVRO2kd1H2btL3apC6lEr34dFG4ue0LwKJz7TLQWg7aUDc3oSjtaHFjYzwTqiYkXT7lLqceDuShXVHosn63j6iBe1J0IL6lNgniLHUf6t31sImpGBoSXQaoT9/U60dV9y9xp6PWAvOjWVLbs88te6zu21F+5NuNJCPbs2Lg95L1AfeQmoq34dL0QD+TkdZP7vzle2zOl/ZP9H5asFDL+qBNVe+yCHnBK6y5Hzw/wOa5j3yYpp+s9gD54hShnNOd4FX4Hd1VOFn01X0WXS5z0PXEi+8mLy6TzrdeSKX+FmZzjmg00NVUzs+nVLcNaoyLgngVvzgVmIXJJuYA5zCAZdj4/EWJKnUSha+458cyad7lcXjin62E8mP8/hn+g2awl/s8DjojgY8RxGV1uJqBB3p9sSRHLPBnMn3C5jXTLxUr5rXyMSunCqe+jZpwUVTb8EHr/t8nzmvWfgz31rQKP2uvCqdejfX2IsG7aboEdAnnmRSyB6XtIl8rhWnziRLrn2DRcBfg4F0ci7FvFRLcFrTulQ7Htx1rlrMPxb0Q4/HA/qB9+yV4V5WZNce+dIjYxRXP+E174JYLrGzeKkb99qx86RDeTHAjfB5M4iYHvO5AtcvFfKHu4bOlfInhHtqByZYefw8Mo4BNvhxrrfKjtyeJgG0myHJMtBuRBkZuegIAXh0w0h8UdFI9vsKZrzfLC0YyWaFYk04bRTwoRGvcAg82SGpsWRwz7tcMyyNXa44OqfZoFcwL7QbxEof+zktPDD30uTkS9n7536/Gz197D3cdPC9Y9lx9HB2C/1GO/3sQu9B+o25e/PtB+eea8/1Q6wFbGyiItQVn+jYhbEf+PAiGE04KjlYuS17dHHcaAaAE5HhToTMzhzcwfAw3+ELrx8WY4TjCKZSi3p9SeEivABRdoGuX+YLAOQl3cBOfQom/kSfMGXifICYkXuHwVzD62/V2Mqep3tY7Hzdw+K5NbhpI1taSbz5F2wgtuCpPruVGCqcNxefq6sY87Ts3P6/jm/eNn2O8Z1cMF2fa4D0m/OOMjdGsGt4jHUXGGPqfGOsXzTG8H9vjEts4+cYavlS0/k5B3yO01007l+QcXdQx84zblz8WBqXYiyp0qrE7Y5hHncu5kUpzNwOeeZ28FItnCXks8QCnzCOre2ACMbo9FeyDedySmqFSFiqav7cPLvA7P4crOu54Iz/fDz89vlsgCLHxznCxwZqgNp9Pk5CgNcTlyrBU7UAC1csYaEUs5JsJq627YTDzgXm4a9za4xhJXP62f+Wkn06uPkcfPN+Fub5fEal8TPxEKIeok4rGMUGwIKUWYOSGmTXIJUGPYSuyt6UQEfRpYnszejKmux12WtRFF2NjiazN6Ijyewt2WO16MrstbJe383+mn0fvG0llaI2UGkblkZ1XhpleD7Xy60+QQA+npQxCcDqBnj14UVZd0pMCC+pWZuT8wQjuPBEwFu3KamsWjC9RHGC06MuSeXDrFyVKymAtuUFEQypyN6hII647Uje0Wqe36orG+0r3h09pDdZ647vOIS5f8l3R240+ITKN/Yf3bN5DT3b89JezP//2f3N7VgeY0M5Pne23ccbf7Ml++sZwuzm+hmBp85uQSWvPXFmlYKtbwZuz/XUJDDzH/xoFcYgpM8c2HEn5cddWT/ZaS5wvk5zJblOc2mry5NDc+ftNreATc/Td+7jBd9zoQ507FbZ3/zfpnPBp5yHTiQtciIXolRxWd5x5GgFv+Gkys9Pa/h8tFYs0Fr06bQu8Q3nI1n5CWdwYcKXOAAmR/8c0F9JtVDrPjkCsSwqNsQlDxit6hgpD1kYDl7LDVjnC8MTcJhYGGRbrkZcsqo/TW0+3TKdZ8Bzn2mJLjj+P3+G9aHl/nSgexbK/ckOdZ75DnXFn79D3UIu/fy96poXx/Dna1vHvDuPUxb6vHIgsb5FfV5nDEYSHRs0mRnGKbcz1sx3JOeAZNoYi4kcj0soSCdouS25cb4t+QVavu5E3Pl7vmZ/Lnd9zf4zOkq6vk5j2/29sx8o2tjXqF7q8hx1xZTcuQkgg6TEBbx9hKReQ0bslb+Zlnyjs1xVWiBkpnUF1eqw1AIhQkuUhAD4K2rr8HeVlvlT+Ks0JWUnvLYAlLAVV9Q2En/YWYG/eajAH5K/oWzRt5coFm04X1LwrVj8rRNW4XsdR57esubmddGqnlU9Vb667r5lKV/NumsHd3y1ycZyOkOweW1r48Y2b+PEronG6r7VfdVFrbv6eq7enFSgHU8eaqwZ2R5v2diTqmsMlsRK3L7y5tHGZRevinTW5fast6yq6hquDcX722K9LY1do/XFvW3hiok7Ns0imIukxxz57qAk1UbdfZ4uc3X462E/q9Vc+2e2mus4p9XcDGfx1zVhB3ehZnNSHQBcsekLN51bcAlfuP3cjvkmfF+sEZ3i5lzLvs/Fz8b/T/xsxPys++L8nK9J+8L8/PV8EdsX4ydzcb7kLc/P44Sfy6kHzsPP1OfhZ89n8rP3HH6+gPlZ3zbPUNEliA3nZWvqv8tW7GWj+Ct0EfGyX5i7Vf+y5hftvP5RJUsr6cdYTvMFmXzF7Kz+aYVaoaSfZlWLdPdWwusR6t0v3HESW9m6uNQOdncoKjXBhS7w3qsWsx5M78yIHKeNLBbE9DJXTB2e6ZJvdUVnlslHC/IZXSSfOkHkUlLXCER2Fn9lkwavSkhFMeFCqj/UDldaV6S+uJQuEPN9YWElLKE6n78pUVNQUYkazcGk39dYV1MQrqS/oNSeLWmLunwhX11VSWu0wFfqa4iQdUBZdkeI7Hqp9dTbX1x63VFxIi41AegaArFtWCw2vPWuHZBW+zkyG8Uyk/rhej/Ix7p4Nm1cJK0UlpbYbpIqsSvtFySLBu/MMElDE3KZzP+RZqOftafoC4ss+VmbkL6g5H716VuW5mX4cyLDPmrNeWfgKMZdTfL63afLc2awm2syhGcGcyu9Y0vnYb88xfp5aRjO2uWz9guYx/Gl00/sN4n+lDgszFgqm7o1nzEDRwfhSnvdf38Gnm8Z+QuL9NbCqtZAoLWqqEh+LWzIry1/QYevKGmucDormktKGiudzsrGknhbW37NmdhRpVGhp9qpYZiJIpVuxlJMxKXlMMvKYqTdn1gQJ4vy47G0xjovvZFAs9UQFlfEpREF7gaVn4YdIIsOXhqQJRMAmDoSwxEQ/tL3Yj5DplsHRb4yRBwQ0py1GReYBUySA7+uEtIFZaSMvtgkRapxSjuwHNdCwTHZ0iiIxbhUSjLN73JfEFCu7s9mn68783uXdCzFXwO/WG5NcBXle5guFpLOyAqDz+299m571Ss3DtywpU7Lza2rnrh6Rc/2ZSEtp3Y6+tbtrL3x7SrLmv3/q7dzD46quuP4fe4z+7jZZ7J5bTbJ5r3Ze5MseUMChIQkBBLAPARDERGCgBgEX4hCK0lFKyhi29FSFehUu3fJjNba6YBV207/cqa0U1un49ROM+NMy1inLUjo+Z1z95l9JNX2D2DvJsy9v98595zfOef3+3wfWoaaxLeluG1YXHn/iATNx5xgtlf07GzvPTgs0prOAyMBrvvJFyrESr0GNdmxe+99vO3g6/c6zAdem2pxlxfrCgF++uQ3102uzC9cuWtd03opp2bzkfXH+YquMdqweXqr1HjHCWDwzp/GDN5u6igV6oK2KpNklyophjfo8802k9evGRedNjfA8fmaMJsXjvxwIpppDidjttnh+FzgXWVen9jZhdcNzT5SatolQLn20ji+dLqTczYj4Lf2h5M5Y3fkiasrKgdzdSodn51XkV/f4vJ3lpeOnNrVlIb72zLIrU96TH5Y1X/8J9DvMUcXxb7A0cX17hGSrp8JE9wScbotKXC6rQpOd5a3uv2g1pAGqCv7YZRpXAJYN7pIWBJidyayQFgUbJflo+uC1L5p+N/6pgF841+Cb+hIwL8k39DqSLS/KOfQ12LqWsL+uYj9syLOP2JK/3Sm8E9XrH/qM/hHXKp/FkTuS3LTcGLUvjhn/Ts+WOcUfx3C/uqiNlHT6bnVsIc2JMmNKLjrQbPK5gTPAby6xYZxyXBmMoA+DkT9eRukAbWgUcrqroaTAFnnhfraL0u3zhSxLcmvY5mitUX5mdmSPkhjKBSI0VtwPZeBqlRyHGCvDkMqI4kOBpLoIFN6BU8an0ThiYwj7RMK7/9GL4bzKnXBFP2HhHtwKe/B6SNlPuEXF+7xYuR1tE9EashujJG7MLc+hRvh3AAr1ajkVMCeXiibjkmsMMQlVmix3iedrdyPTXwR8GZrYv8+NcG9Ftt5bwwphrK3PkN2XsccATvJr8A7n1aa5FeUkfyKPJJfEUUJgHiUMtFCfoU7kl/BJPQfeJzEPmZI6CbvTNRkQAvc0MPzJn6L22ns1j/Yv/MvIv/1ArtHhPevVY21sjFrjWw6BtCzBsywMw0KwzXK3uKKAFq86vnc0nIRxwSgjB2ianRx2s6OWtqLtYU7YDMek0s6YKs34MBl3gtlsQME7jLWuv/VXY17dtzmNj29/4KgzjradmKtTkBNMj47+B0Lb7xvxe51VS33yVO3f/+B1RNNE492j57YIrGm1tHDA6NPjNfSH2x7/bG1ec2jbT/+V9/pfI1Ol7W3uM7MmIysnbMa28SZAo1Gb9hR9/C59w89+ZdXRjofkvdufW5H4+pjP7u/fucGqW3PM6QvEwb3NOWgJOpkCuIvnFc4JblYNRes8+HkDeDf1CdQgFFjz0pkkSKZ4eQlRt42TAhuiBKC5VIJ4qp8CzkgV0DBch2gAYpqm1Ijg1Ot+ReihL0pF/XJIMPch0mX7mjuw+xhRQfOTw3H0IfLI3MfRhCLyRDEaRIe5HKY3GoWUV8dHZ8yc4m/HRm9MhKK2U0kAkpnY/WXtLEabCxfhI3RwGYR7GVHZPjMaCTTGYlkwnZeVHI6Yu2siLezKZmdaRI75IrF2rkgQMls7vbEUTuz0b0J24cR26cT8zpiKNrhvA5VsrwOw+LyOgxLyuvI4KoU73pmj+1K+e5ndt2hFHt4xH+HsP+aY/M5Yj0Y8AV7ST7H8mg+B3FdRXw+xyr0cVXUaRnyOdI7KlOsltlhuzMFaJn99qMMO2jQB/dRH3N+DjTuLShWq6VAz0CdNRcGPbh9siNrDp/mc1eDVlHOskGIAdOJwrigY8+Cy4S4q33s5ZuXY/l5sZ+ZE2vXzr9ZvsycU2KxenJMAZaOuSDvxyXOwHXgeqlGaqOSH+ILbzSUw0FlANcI54uy24ArVqBkR0CtB2eW9W5AnfF2p7GglIyC5T6SFuIs0JQ0xu0fBBQsnqL0oSYoPDo2J8ROGpiM+KOnlo3orRbp6bbl0ISv3DNk8Aje6dXdW+tEhqs93D82vcX31Mj02PTtvg2kqcTa+03Gy6uuHIb2Wr9PML+16leP7brQwrxRVbvi4Pl5d/fyqVd3/HwKxwGYF43GfwflhhP/eGK0k1H46BgbXZwCG+1RsNEhixMSGBLQ0VBOmZ8aIB2d4JKgpN+NzmjJoNLcufA6PoMdeV+FHXkC4XcntyM6iSVDYq+IzlrJDGFPxqy5w7aAhmj5Qlty4mypSGFLZdQWVxJbctLasmCiSmLSyQUzU1LDnoufjVjFtkPItkqqDXh7SRnlQa8v2CzJ+WiAqBOxpGjUSqCUF9twnhakzjTYMEEoxnbQGsWkKYsKzTogirIolHmmoTSJE57NOHYmdcqNjOMlQxjVqD9DFSdaa7qYKC0do6rD1ZsKqjroEoKO1MBqNtI7U6OrhUgfTQ6x5o5EO6mib8F/gFnuir4biNoSonUBlrbAKivkZcsGfTeLKEJqh0vRd4PXzZUd0XcrsMfou1kS9d0SRS0mVob2pRC0UDffPDh6d1jbbbB/XhOvZ8Eqvj2EV7et1EAsAxwS1ZtIkaKPFCk644oU65UiRbeiQlwlyBo7PH4mZDiToXelbpefZupkKZrr0wy9DHSuP9PcjfpYEVVPPaEojtkkuYydC1pEgnU0hivU6ti5WVN2HmxbmaA8iDDg3FbsGUDA2KtEEdZ6wMA0YrivERiYWSL6IGircE6lDmpZebw/lQ2YCAfoxYQodxUMUcZsZZeKZLAyjph6HLeA96iSyDmPvfznma3nZ/aUsSPhkpwvzpftmTm/dfqTl8d2989cmTp4ebqvb/rywakrM/1KwqR//NgwvTFcqrdp+NhY3c4rtPnC2WvnR0bOXzv7/LWLo6MXr5HYWfUIp6dEajXq56epUC14CcXKy9RQY0KwugZJ7kSX/eJst70WXNQN26AbsIsk5BKJnD3A7ki3CBskayDTyTyH4ZdtaD0s1wIZyo46E3JFcE12yOAqbyL5TUWg5yTbl6GomiryVEk4maQbJIOCnUqPU0ILRSko+UEQnSx65MNbfiMt+87deer9KuuaOx7o7f/615bpTTdv948dGVh15+pKfZbG5ewbv6tx+r3aql88v/2lfS3bKzce2Tj8yHBlJfoLfaxkVcydFWt3tvdODYskCvnuzMrJgcqYg5/wtt7zz518KUkUaQmf+7Ak7051k7Ki+a+ZGorPvIMQsVGSc9EbWk1ovLarcqENk6ItOBMPJ5BBzO23kT35xSbnpc8+TJ6xt4ga4mR5fNzQInKf3dxrTAPeC6yJaqoKCodEwEQkBQWXHVFX1TaFK6xi5m934mQdv/UH9/Jyv2MCaI3oovqooMUHtbg6FJc7fTgFwSCCTgPc0EUWfS6c2hlm9oFkp8EF77YFOqsTk7nt8WTu+IVc6i2apNsxNLWDaWS6GOgdFKwGdtB/ZBqHhoif/tufnWGq2beZKaIhSxYi8CdGQxb+yxm2lKnu6SG/z7+f+ff5OuX3j3PNdAP/OerHzVQw2zfLZlE6jmziooFBb5oL6XGBoh64MZR51mSlJORN2NnVk0NjigBsYVtRDaKAZH+xlj4+0J6nUXmlEt603G7lfjN4qs2i0qhV9XcFWjs0WqPK5e0nNu7namk3/1f0DG34GbKiz8BflU2muaDJPKvFNw5qfSEtrivTAr4OHsMEextZ5DECQDwhm56E3uwt208eocNhHejIU3PrNCppZ6ClQ6MxqnO9fd7B060WFTzD/HXaTc1+6WdwZH6GTxY+QrYK5jrUFkwPbosKtBZFTxH0SkqDBJ2RUsFUbRLUk1zZIvTzIpwWUORCP7eZZ0usVL2CjFLaTLaZUPdnIZemSAh6U7ZhaeaGpa39HXBZDwamamdvisZnoO2Zetz2FdTusM3E+UE3sTm9/+EICud1I7NzS+DbXBuwzXMLtMRkpW0gC88LeQ0gYJOir5SGv/SmbDzagi49PG1uR9ft+Sk6lCZpL8P2zl9n6nE/+//a6/iK7E3aebXJezToeZTSy9hH2G/hmsugETPz1ISZp4bXy4IHbK0Nf0n+wSJLdX6oAIqZ2ehS34bJh/Zu8Pk27G1v27PBx2xr3wvMzns62ibh20myhzN56xpvp16nBMpDNQAvEO+CuSUJnwjJjgpRJF/xsJXTGFt8iyYoOQ+2dAgdqxbNzAHC4ozn+ZSmvZw05hTbojs79OemnGKrpSTHbM7xWNH1PzHnJ3K9Lo7hU57mioyVL1In6Hcx99dNhd1nslFGDmf3QP0w6L+hKDU58DeR7psC50vuNYvu9SFm0MG9bGECnYBvh8c9gSj/paLPLQDNXUoDj6OpolvXuGn+DbTaOUaFeqCRmrVzIROE9oUotKfoHpOhKuiTZIqbC9aLs1oN/qJCAiI05tesw2+PbgCF+dWWObmkAbV2Nc6/qfbDS1JdBmDWagxmhXdJI8qDeIXajIbDFSvRUrwQ9EmtTqUcGY7NAp4GiYStSmINplKoieqBymbFwrjoIwZvcdGzam/R92iGO3fBPH7yrf2de7cOlRVxOq3G7hFXjbWMv3Bfn4nZaRJuhliaZgSzad5i6D1wdrxjW29Daa5Wpy0r3bTzwTX3vT29ych0t1rL7aK/9Ru/fXbQUdNVXcKrbYVlhbblD795uFCfXSfZvbbCLOHI5aMrnGXVZTk6j68/kD949qOn8JjTy47zpShGU6N34gCJ0mStTSJ+ZMUwixnAihqHiBZDVAHkJaEgVnVV5o1odYXRjDyLnKfC3lSB83hS9OwxYgVROGJzkFALKpucHkAl5pNCmgYC28SEY4fF0aioy3mEAOqanmIv6xB66Y9/vYY+3azTqT/S89rf81pdy3L+TxohS9B8ouL3tLbe/BsjoD/9nGZ+psBspKc03M1L9Hs18w+aaYF+vGq+GfoQDAI32BtoJPDGaCcqMkIQisJAQ/5R4iG/4Bbgv8DBMta3Zh/lf4n+3aqsNh2SInFti0pcqxLlra0ihJtwpuwwzIUVFSiidC07UdgZ0giYLSBrQGRP35Sgfu0B9WtVPu1WmKQgfx3YdWaiuMfJ0QZ9dfG5ILNx27yJqF9v3nLm7qYsnV+nfvUHw1+Uss+E1a/J81/i36GKQY28kMLLkZABWlxAMbJghmefzc0v1JDa/VxsExYNLMTGgPhtjhgqKMRigXmgCWGWzTCsGObwsGguQMboNValDCxsBEhIoecm28OxIt4NO85u86ztbrP1TgQe8PcfHqqmvfMfEju6Rl/Yv5xXcdf7+H2Mpm7s6GBXRMj7P61y/VcAAHjaY2BkYGBgZOo//7DZK57f5iuDPAcDCFz2z/KA0f/P/mvhyGTXAHI5GJhAogBrnAx3AAB42mNgZGBg1/gXzcDA8eL/2f/PODIZgCIo4CUAogoHhnjabZNfSJNRGMaf7/z5VjD6A6bQjctWClFgEV1LiVR2FTHnMCjXruY/hCCCRdCwUApyYEWyZDUsKKUspJuI6MYKuggGIl5Eky4WXgQjarGe92uLJX7w4znnPd855z3vc44q4AhqPmcUUCkU1CrmTQZd5K7bhLC9ij7nLeZVDE9IVB9AgmODTgpDahoxalwtln8xdpyUyJUKbeQWGSVJcpHMOitICWzfJ49MxnFUEU3uTQzYZmy2AeTsPVxy65AzL8k4+yX2/cipKH7rKURsB4qmATlfO3ISd88wp1coilo/x/YhbB4jaJexIGv68thq3nlst1twnud4ppbKP6j9zOGj3s2zh9Clv7B/GrM6g25q2NSjW42j0WzECXMSWeZ9x/lc/qBXvXO8cXuQlTgJmw4q5+i9yOpBRNQiDjI+pvPcM48GPYOgFp1EJ/dtUzHHT41z/xtSf6k92xnSXtGQ/GMUrjO3FneY/Rn06QTSHJuWOV4shDodRI94oh6gl0QZ+yR72004pAJ4yP4I47dVifklMGef4prHC5xi7fd4dV8HX2/5m3jh+VADffCR12Qb8bud2F/1YS3Ma9LzRbyoQbwQz8wU3kvd18MdoIoX9f/D2u8kaWelXCDfzVFE/vmwFtal0h6rRbwQz0Q3fGWuy/yHObFWO0izTgG+FqCq6izfyAJp/Qvy1H7qOY7xHVTh2hO8FxN8F0l5I5V3kiSiQ7zvu+xlxGWuuoA0mZN1mWfAPscx/ZPtw7xzI2j8AyV25OAAAAB42mNgYNCBwxaGI4wnmBYxZ7AosXix1LEcYTVhLWPdw3qLjYdNi62L7RK7F/snDgeOT5wpnFO4EriucCtwt3Gv4D7F/YanhDeFdwWfHF8T3yl+Nn4b/kP8vwQkBBIEtgncETQSLBC8ICQl1Cf0RbhOeJ3wJxEVkVuiKqIpon2i+0RviXGJOYlFiTWIC4kXiV+QMJFYI/FPSkEqTWqNNJt0hHSJ9CsZM5lJMj9k42SXySXInZOXkQ9SkFBIUJilcETxjuIPZQnlIiA8ppKk8k41Q/WWGoPaGXU59ScaBRrHNN5pvNPcoHlOS0urQuuBdpJ2l/YzHS2dJJ0zuny6Cbp79CL0hfR/GNQYnDNUMKwxYjOaZKxkPMvEzWSCyR1TA9N1pjfMWMwczBaYc5n3mf+zKLB4YznByswqwuqRtZl1j/UbmxKbI7YitpvsouyZ7Hc4THOscIpxNnG+4ZLm8s21z83LrcZtndsH9wD3Rx4lHs88ozxveFV4S3lneD/z8fLZ4Cvnu8mPyS/B74l/WYBBwJaAV4FWOKBHYFhgSmBN4JTAa0ESQVFBV4J9go8E/wnJAcJFIbdCboW2hf4JkwmrCXsEAOI0m6EAAQAAAOkAZQAFAAAAAAACAAEAAgAWAAABAAGCAAAAAHja1VbNbuNkFL1OO5BJSwUIzYLFyKpYtFJJU9RBqKwQaMRI/GkG0SWT2E5iNYkzsd1MEQsegSUPwBKxYsWCNT9bNrwDj8CCc8+9jpOmw0yRWKAo9vX33d/znXttEbkV7MiGBJs3RYJtEZcDeQVPJjdkJwhd3pD7QdvlTXkt+MrlG/J+8K3Lz8H2T5efl4eNymdTOo2HLt+U242vXW7d+LHxvctb0mkOXd6WuPmNyy8EXzb/cnlHjluPXX5Rmq3vXH5JWq0fXP5ZbrV+cvkX6bR+d/lX2dnadPk32d562eQ/NuTVrdvyrmQylQuZSSoDGUohoexJJPu4vyEdOcI/lB40QuxdyCfQH0lXJhJj5QMp5QxPuXyBp/dwTSXBjt4jrMxxL+A1lPtYz/GfyTk1QrkLTxPG+wgexlgNZRceu1jLILXpX/0k0MvdqmRk9RPSs1o9kHvQDOVjVKK6y75XPRxg5TNa51jPqHuESEcezWKblaGheQ8QVWuePQWBy/WfPMHnyRK2V+2Hl6JelbFZv42nUyJbUEd3I/hQqy6kwpHS2otFrNeXYtXxU2iFeFJc1VpRHtPTGdYy6f8LBrSvbfG03fVsc3o2bqWLLJUJfWKgDOmTYSmyUB7HREwRmDirUiJX86mE9tixu9wFp8REo86BZI+5mpdVv7Nn6I+9FcaHjGnVaC8s57G7yNLQ1PqH6FLl7T1ypmD9CW0No4iZKg7KJKtd87WzMGRyaFrvTSEV7JQCfroLi4is6zNmxL0JKlT9GRk5Y49b5BNmWdDvEHsaN3b+KZtCeYS1lHG0QmOa1jv1XDX6LifH0Hu5XOBr9ffgN/Z5lMhjRutBq6BVHTMmRlNWe7FSaebTTv1pnRXjNa/8H2NbPw4WXZXiJLVuPYVPnT0RtXLuRu5fscqI8IxYZaz5gDtdX4sW/W64nzP/FLWN6HeVoyUsp8wjcgaqN63pnPuV3oidb3Ogz/hj1lh3RMqYoU+NMXO7YG9Zvyb0MVhwRmt9xxk3dA5V81vrGHsuFZo57RNOkfVeHSFexj2dNWfO34TVx86HOlLfp5qtdH3CVzNhTiSe3N9VJx94hGSBqLJmwPeUsTfGimUyYVeExG7EbOeOjfVGiUpmS3maHK8wIif3U0yLGSPZG6yaGAWZN2K0asqun12+crp1zV3mlvCUqs40L3M/T/V24KxOnUv1yRXMyezsqSTCJSupmFudRu5aXbDSuFOscKU62YydM6GFdceQlUwxIQ7xm/PX9kldvx3anDZjaFxX//LszbG2PH0/X5u+h//xt8/etWvY/199Ma1XmMNOsZyy89u0GOGecWYeItpdeN+/gg/PZllVWn+96LdPj71puduX0alX/qFP/lCO8e/geiJ35C1cj3GtzvhNoqOTRedvQXaX7IN8CZUH/uaybh/9DeeiFNJ42m3QV0xTcRTH8e+B0kLZe+Peq/eWMtwt5br3wK0o0FYRsFgVFxrBrdGY+KZxvahxz2jUBzXuFUfUB5/d8UF91cL9++Z5+eT3/+ecnBwiaK8/FZTzv/oEEiGRYiESC1FYsRFNDHZiiSOeBBJJIpkUUkkjnQwyySKbHHLJI58COtCRTnSmC13pRnd60JNe9KYPfelHfwbgQEPHSSEuiiimhFIGMojBDGEowxiOGw9leMM7GoxgJKMYzRjGMo7xTGAik5jMFKYyjelUMIOZzGI2c5jLPOazgEqJ4igttHKD/XxkM7vZwQGOc0ysbOc9m9gnNolml8Swldt8EDsHOcEvfvKbI5ziAfc4zUIWsYcqHlHNfR7yjMc84Wn4TjW85DkvOIOPH+zlDa94jZ8vfGMbiwmwhKXUUsch6llGA0EaCbGcFazkM6tYTRNrWMdarnKYZtazgY185TvXOMs5rvOWdxIrcRIvCZIoSZIsKZIqaZIuGZIpWZznApe5wh0ucom7bOGkZHOTW5IjueyUPMmXAquvtqnBr9lCdQGHw+E1o9OMbofSa+rRlerf41KWtqmH+5WaUlc6lYVKl7JIWawsUf6b5zbV1FxNs9cEfKFgdVVlo9980g1Tl2EpDwXr24PLKGvT8Jh7hNX/AtbOnHEAeNpFzqsOwkAQBdDdlr7pu6SKpOjVCIKlNTUETJuQ4JEILBgkWBzfMEsQhA/iN8qUbhc3507mZl60OQO9kBLMZcUpvda80Fk1gaAuIVnhcKrHoLNNRUDNclDZAqwsfxOV+kRhP5tZ/rC4gIEwdwI6wlgLaAh9LjBAaB8Buyv0+kIHl/ZNYIhw0g4UXPFDiKn7VBhXiwMyQIZbSR8ZTCW9tt+nMyKTqE3cY/NPYjyJ7pIJMt5LjpBJ2rOGhH0Bs3VX7QAAAAABVym5yAAA) format('woff');font-weight:400;font-style:normal}.joint-link.joint-theme-material .connection-wrap{stroke:#000;stroke-width:15;stroke-linecap:round;stroke-linejoin:round;opacity:0;cursor:move}.joint-link.joint-theme-material .connection-wrap:hover{opacity:.4;stroke-opacity:.4}.joint-link.joint-theme-material .connection{stroke-linejoin:round}.joint-link.joint-theme-material .link-tools .tool-remove circle{fill:#c64242}.joint-link.joint-theme-material .link-tools .tool-remove path{fill:#fff}.joint-link.joint-theme-material .marker-vertex{fill:#d0d8e8}.joint-link.joint-theme-material .marker-vertex:hover{fill:#5fa9ee;stroke:none}.joint-link.joint-theme-material .marker-arrowhead{fill:#d0d8e8}.joint-link.joint-theme-material .marker-arrowhead:hover{fill:#5fa9ee;stroke:none}.joint-link.joint-theme-material .marker-vertex-remove-area{fill:#5fa9ee}.joint-link.joint-theme-material .marker-vertex-remove{fill:#fff}.joint-link.joint-theme-modern .connection-wrap{stroke:#000;stroke-width:15;stroke-linecap:round;stroke-linejoin:round;opacity:0;cursor:move}.joint-link.joint-theme-modern .connection-wrap:hover{opacity:.4;stroke-opacity:.4}.joint-link.joint-theme-modern .connection{stroke-linejoin:round}.joint-link.joint-theme-modern .link-tools .tool-remove circle{fill:red}.joint-link.joint-theme-modern .link-tools .tool-remove path{fill:#fff}.joint-link.joint-theme-modern .marker-vertex{fill:#1abc9c}.joint-link.joint-theme-modern .marker-vertex:hover{fill:#34495e;stroke:none}.joint-link.joint-theme-modern .marker-arrowhead{fill:#1abc9c}.joint-link.joint-theme-modern .marker-arrowhead:hover{fill:#f39c12;stroke:none}.joint-link.joint-theme-modern .marker-vertex-remove{fill:#fff}`, `flo-view{width:100%;height:100%;margin:0;background-color:#eee;font-family:"Varela Round",sans-serif;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none}.canvas{border:1px solid #6db33f;border-radius:2px;margin-top:3px}.paper{padding:0;background-color:#fff}#sidebar-resizer{background-color:#34302d;position:absolute;top:0;bottom:0;width:6px;cursor:e-resize}#palette-container{background-color:#eee;position:absolute;top:0;bottom:0;left:0;overflow:auto}#paper-container{position:absolute;top:0;bottom:0;right:0;overflow:hidden;color:#fff}#palette-floater{width:170px;height:60px;opacity:.75;float:left;position:absolute;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none}.palette-filter{border:3px solid #6db33f}.palette-filter-textfield{width:100%;font-size:24px;font-family:"Varela Round",sans-serif}.palette-paper{background-color:#eee;border-color:#6db33f}.node-tooltip .tooltip-description{margin-top:5px;margin-left:0;margin-bottom:5px}.node-tooltip{display:none;position:absolute;border:1px solid #333;background-color:#34302d;border-radius:5px;padding:5px;color:#fff;font-family:"Varela Round",sans-serif;font-size:19px;z-index:100}.tooltip-title-type{font-size:24px;font-weight:700}.tooltip-title-group{padding-left:5px;font-size:20px;font-style:italic}.node-tooltip-option-name{font-family:monospace;font-size:17px;font-weight:700;padding-right:20px}.node-tooltip-option-description{font-family:"Varela Round",sans-serif;font-size:18px}.properties td{border-top:1px solid #34302d}.properties{border:8px #6db33f;margin-top:3px;background-color:#eee;font-family:monospace;z-index:2;position:absolute}.properties-node-name{width:100%;background:#34302d;color:#fff;padding-left:2px;border:0;font-size:18px;font-family:"Varela Round",sans-serif;font-weight:700}.properties-node-name-row{background:#34302d;width:100%;padding-left:2px}.properties-row-even{width:100%;border-top:1px #34302d;background-color:#fff}.properties-row-odd{width:100%;border-top:1px #34302d;background-color:#eee}.properties-row-text-even{background-color:#fff;border-left:0;border-right:0;border-bottom:0;border-top:1px #34302d}.properties-row-text-odd{background-color:#eee;border-left:0;border-right:0;border-bottom:0;border-top:1px #34302d}.properties-input{width:100%;font-size:18px;font-family:"Varela Round",sans-serif}.properties-key{width:30%;padding-left:2px;padding-right:4px}.properties-value{width:70%;padding-left:2px;padding-right:2px}.properties-table{border:1px solid #d1d1d1;padding:3px}.properties-new-property{color:#888}.error-tooltip p{margin-top:5px;margin-left:0;margin-bottom:5px;color:#fff}.error-tooltip{display:none;position:absolute;border:1px solid #333;background-color:red;border-radius:5px;padding:5px;color:#fff;font-family:"Varela Round",sans-serif;font-size:20px;z-index:100}.canvas-controls-container{position:absolute;right:15px;top:5px}.canvas-control{background:0 0;font-family:"Varela Round",sans-serif;font-size:11px;vertical-align:middle;margin:0}.zoom-canvas-control{border:0;padding:0;margin:0;outline:0}.zoom-canvas-input{text-align:right;font-weight:700;color:#000;background-color:transparent}.zoom-canvas-label{padding-right:4px;color:#000}.highlighted{outline:0}.joint-element.highlighted rect{stroke:#34302d;stroke-width:3}.joint-type-handle{cursor:pointer}.available-magnet{stroke-width:3}.link{fill:none;stroke:#ccc;stroke-width:1.5px}.link-tools .tool-options{display:none}.link-tools .tool-options circle{fill:transparent;stroke:transparent}.link-tools .tool-options path{fill:#000;stroke:#000}.link-tools .tool-remove circle{fill:red;stroke:red}.link-tools .tool-remove path{fill:#fff;stroke:#fff}.link-tools-container{stroke-width:0;fill:transparent}`],
                encapsulation: ViewEncapsulation.None
            },] },
];
/** @nocollapse */
EditorComponent.ctorParameters = () => [
    { type: ElementRef, },
];
EditorComponent.propDecorators = {
    "metamodel": [{ type: Input },],
    "renderer": [{ type: Input },],
    "editor": [{ type: Input },],
    "paletteSize": [{ type: Input },],
    "minZoom": [{ type: Input },],
    "maxZoom": [{ type: Input },],
    "zoomStep": [{ type: Input },],
    "paperPadding": [{ type: Input },],
    "floApi": [{ type: Output },],
    "validationMarkers": [{ type: Output },],
    "contentValidated": [{ type: Output },],
    "dslChange": [{ type: Output },],
    "dsl": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const $$4 = _$;
class ResizerDirective {
    /**
     * @param {?} element
     * @param {?} document
     */
    constructor(element, document) {
        this.element = element;
        this.document = document;
        this.dragInProgress = false;
        this.vertical = true;
        this._subscriptions = new CompositeDisposable();
        this.mouseMoveHandler = (e) => {
            if (this.dragInProgress) {
                this.mousemove(e);
            }
        };
        this.sizeChange = new EventEmitter();
    }
    /**
     * @param {?} splitSize
     * @return {?}
     */
    set splitSize(splitSize) {
        if (this.maxSplitSize && splitSize > this.maxSplitSize) {
            splitSize = this.maxSplitSize;
        }
        if (this.vertical) {
            // Handle vertical resizer
            $$4(this.element.nativeElement).css({
                left: splitSize + 'px'
            });
            $$4(this.first).css({
                width: splitSize + 'px'
            });
            $$4(this.second).css({
                left: (splitSize + this._size) + 'px'
            });
        }
        else {
            // Handle horizontal resizer
            $$4(this.element.nativeElement).css({
                bottom: splitSize + 'px'
            });
            $$4(this.first).css({
                bottom: (splitSize + this._size) + 'px'
            });
            $$4(this.second).css({
                height: splitSize + 'px'
            });
        }
        this._splitSize = splitSize;
        // Update the local field
        this.sizeChange.emit(splitSize);
    }
    /**
     * @param {?} width
     * @return {?}
     */
    set resizerWidth(width) {
        this._size = width;
        this.vertical = true;
    }
    /**
     * @param {?} height
     * @return {?}
     */
    set resizerHeight(height) {
        this._size = height;
        this.vertical = false;
    }
    /**
     * @param {?} first
     * @return {?}
     */
    set resizerLeft(first) {
        this.first = first;
    }
    /**
     * @param {?} first
     * @return {?}
     */
    set resizerTop(first) {
        this.first = first;
    }
    /**
     * @param {?} second
     * @return {?}
     */
    set resizerRight(second) {
        this.second = second;
    }
    /**
     * @param {?} second
     * @return {?}
     */
    set resizerBottom(second) {
        this.second = second;
    }
    /**
     * @return {?}
     */
    startDrag() {
        this.dragInProgress = true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    mousemove(event) {
        let /** @type {?} */ size;
        if (this.vertical) {
            // Handle vertical resizer. Calculate new size relative to palette container DOM node
            size = event.pageX - $$4(this.first).offset().left;
        }
        else {
            // Handle horizontal resizer Calculate new size relative to palette container DOM node
            size = window.innerHeight - event.pageY - $$4(this.second).offset().top;
        }
        this.splitSize = size;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // Need to set left and right elements width and fire events on init when DOM is built
        this.splitSize = this._splitSize;
        let /** @type {?} */ subscription1 = Observable.fromEvent($$4(this.document).get(0), 'mousemove')
            .pipe(sampleTime(300))
            .subscribe(this.mouseMoveHandler);
        this._subscriptions.add(Disposable.create(() => subscription1.unsubscribe()));
        let /** @type {?} */ subscription2 = Observable.fromEvent($$4(this.document).get(0), 'mouseup')
            .subscribe(e => {
            if (this.dragInProgress) {
                this.mousemove(e);
                this.dragInProgress = false;
            }
        });
        this._subscriptions.add(Disposable.create(() => subscription2.unsubscribe()));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._subscriptions.dispose();
    }
}
ResizerDirective.decorators = [
    { type: Directive, args: [{
                selector: '[resizer]',
                host: { '(mousedown)': 'startDrag()' }
            },] },
];
/** @nocollapse */
ResizerDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
];
ResizerDirective.propDecorators = {
    "maxSplitSize": [{ type: Input },],
    "splitSize": [{ type: Input },],
    "sizeChange": [{ type: Output },],
    "resizerWidth": [{ type: Input },],
    "resizerHeight": [{ type: Input },],
    "resizerLeft": [{ type: Input },],
    "resizerTop": [{ type: Input },],
    "resizerRight": [{ type: Input },],
    "resizerBottom": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class FloModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: FloModule
        };
    }
}
FloModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Palette,
                    EditorComponent,
                    ResizerDirective,
                ],
                imports: [
                    FormsModule,
                    CommonModule,
                ],
                exports: [
                    Palette,
                    EditorComponent,
                    ResizerDirective
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var Properties;
(function (Properties) {
    /** @enum {number} */
    const InputType = {
        TEXT: 0,
        NUMBER: 1,
        SELECT: 2,
        CHECKBOX: 3,
        PASSWORD: 4,
        EMAIL: 5,
        URL: 6,
        CODE: 7,
    };
    InputType[InputType.TEXT] = "TEXT";
    InputType[InputType.NUMBER] = "NUMBER";
    InputType[InputType.SELECT] = "SELECT";
    InputType[InputType.CHECKBOX] = "CHECKBOX";
    InputType[InputType.PASSWORD] = "PASSWORD";
    InputType[InputType.EMAIL] = "EMAIL";
    InputType[InputType.URL] = "URL";
    InputType[InputType.CODE] = "CODE";
    /**
     * @record
     */
    function Property() { }
    Properties.Property = Property;
    function SelectOption() { }
    Properties.SelectOption = SelectOption;
    function ErrorData() { }
    Properties.ErrorData = ErrorData;
    function Validation() { }
    Properties.Validation = Validation;
    function ControlModel() { }
    Properties.ControlModel = ControlModel;
    function CodeControlModel() { }
    Properties.CodeControlModel = CodeControlModel;
    class GenericControlModel {
        /**
         * @param {?} _property
         * @param {?} type
         * @param {?=} validation
         */
        constructor(_property, type, validation) {
            this._property = _property;
            this.type = type;
            this.validation = validation;
        }
        /**
         * @return {?}
         */
        get id() {
            return this.property.id;
        }
        /**
         * @return {?}
         */
        get name() {
            return this.property.name;
        }
        /**
         * @return {?}
         */
        get description() {
            return this.property.description;
        }
        /**
         * @return {?}
         */
        get defaultValue() {
            return this.property.defaultValue;
        }
        /**
         * @return {?}
         */
        get value() {
            return this.getValue();
        }
        /**
         * @param {?} value
         * @return {?}
         */
        set value(value) {
            this.setValue(value);
        }
        /**
         * @return {?}
         */
        get property() {
            return this._property;
        }
        /**
         * @param {?} value
         * @return {?}
         */
        setValue(value) {
            this.property.value = value;
        }
        /**
         * @return {?}
         */
        getValue() {
            return this.property.value;
        }
    }
    Properties.GenericControlModel = GenericControlModel;
    class CheckBoxControlModel extends GenericControlModel {
        /**
         * @param {?} _property
         * @param {?=} validation
         */
        constructor(_property, validation) {
            super(_property, InputType.CHECKBOX, validation);
        }
        /**
         * @return {?}
         */
        getValue() {
            const /** @type {?} */ res = super.getValue();
            if (typeof res !== 'boolean') {
                return this.property.defaultValue;
            }
            return res;
        }
    }
    Properties.CheckBoxControlModel = CheckBoxControlModel;
    /**
     * @abstract
     */
    class AbstractCodeControlModel extends GenericControlModel {
        /**
         * @param {?} _property
         * @param {?=} encode
         * @param {?=} decode
         * @param {?=} validation
         */
        constructor(_property, encode, decode, validation) {
            super(_property, InputType.CODE, validation);
            this.encode = encode;
            this.decode = decode;
        }
        /**
         * @param {?} value
         * @return {?}
         */
        set value(value) {
            if (value && this.encode) {
                super.setValue(this.encode(value));
            }
            else {
                super.setValue(value);
            }
        }
        /**
         * @return {?}
         */
        get value() {
            let /** @type {?} */ dsl = super.getValue();
            if (dsl && this.decode) {
                return this.decode(dsl);
            }
            else {
                return dsl;
            }
        }
    }
    Properties.AbstractCodeControlModel = AbstractCodeControlModel;
    class GenericCodeControlModel extends AbstractCodeControlModel {
        /**
         * @param {?} _property
         * @param {?} language
         * @param {?=} encode
         * @param {?=} decode
         * @param {?=} validation
         */
        constructor(_property, language, encode, decode, validation) {
            super(_property, encode, decode, validation);
            this.language = language;
        }
    }
    Properties.GenericCodeControlModel = GenericCodeControlModel;
    class CodeControlModelWithDynamicLanguageProperty extends AbstractCodeControlModel {
        /**
         * @param {?} _property
         * @param {?} _languagePropertyName
         * @param {?} _groupModel
         * @param {?=} encode
         * @param {?=} decode
         * @param {?=} validation
         */
        constructor(_property, _languagePropertyName, _groupModel, encode, decode, validation) {
            super(_property, encode, decode, validation);
            this._languagePropertyName = _languagePropertyName;
            this._groupModel = _groupModel;
        }
        /**
         * @return {?}
         */
        get language() {
            const /** @type {?} */ value = this.languageControlModel.value;
            return value ? value : this.languageControlModel.defaultValue;
        }
        /**
         * @return {?}
         */
        get languageControlModel() {
            if (!this._langControlModel) {
                this._langControlModel = this._groupModel.getControlsModels().find(c => c.id === this._languagePropertyName);
            }
            return this._langControlModel;
        }
    }
    Properties.CodeControlModelWithDynamicLanguageProperty = CodeControlModelWithDynamicLanguageProperty;
    class GenericListControlModel extends GenericControlModel {
        /**
         * @param {?} property
         * @param {?=} validation
         */
        constructor(property, validation) {
            super(property, InputType.TEXT, validation);
        }
        /**
         * @return {?}
         */
        get value() {
            return this.property.value ? this.property.value.join(', ') : '';
        }
        /**
         * @param {?} value
         * @return {?}
         */
        set value(value) {
            this.property.value = value && value.trim() ? value.split(/\s*,\s*/) : undefined;
        }
    }
    Properties.GenericListControlModel = GenericListControlModel;
    class SelectControlModel extends GenericControlModel {
        /**
         * @param {?} _property
         * @param {?} type
         * @param {?} options
         */
        constructor(_property, type, options) {
            super(_property, type);
            this.options = options;
            if (_property.defaultValue === undefined) {
                options.unshift({
                    name: 'SELECT',
                    value: _property.defaultValue
                });
            }
        }
    }
    Properties.SelectControlModel = SelectControlModel;
    function PropertiesSource() { }
    Properties.PropertiesSource = PropertiesSource;
    class DefaultCellPropertiesSource {
        /**
         * @param {?} cell
         */
        constructor(cell) {
            this.cell = cell;
        }
        /**
         * @return {?}
         */
        getProperties() {
            let /** @type {?} */ metadata = this.cell.attr('metadata');
            return Promise.resolve(metadata.properties().then(propsMetadata => Array.from(propsMetadata.values()).map(m => this.createProperty(m))));
        }
        /**
         * @param {?} metadata
         * @return {?}
         */
        createProperty(metadata) {
            return {
                id: metadata.id,
                name: metadata.name,
                type: metadata.type,
                defaultValue: metadata.defaultValue,
                attr: `props/${metadata.name}`,
                value: this.cell.attr(`props/${metadata.name}`),
                description: metadata.description,
                valueOptions: metadata["options"]
            };
        }
        /**
         * @param {?} properties
         * @return {?}
         */
        applyChanges(properties) {
            this.cell.trigger('batch:start', { batchName: 'update properties' });
            properties.forEach(property => {
                if ((typeof property.value === 'boolean' && !property.defaultValue && !property.value) ||
                    (property.value === property.defaultValue || property.value === '' || property.value === undefined || property.value === null)) {
                    let /** @type {?} */ currentValue = this.cell.attr(property["attr"]);
                    if (currentValue !== undefined && currentValue !== null) {
                        // Remove attr doesn't fire appropriate event. Set default value first as a workaround to schedule DSL resync
                        this.cell.attr(property["attr"], property.defaultValue === undefined ? null : property.defaultValue);
                        this.cell.removeAttr(property["attr"]);
                    }
                }
                else {
                    this.cell.attr(property["attr"], property.value);
                }
            });
            this.cell.trigger('batch:stop', { batchName: 'update properties' });
        }
    }
    Properties.DefaultCellPropertiesSource = DefaultCellPropertiesSource;
    class PropertiesGroupModel {
        /**
         * @param {?} propertiesSource
         */
        constructor(propertiesSource) {
            this.loading = true;
            this.propertiesSource = propertiesSource;
        }
        /**
         * @return {?}
         */
        load() {
            this.loading = true;
            this._loadedSubject = new Subject();
            this.propertiesSource.getProperties().then(properties => {
                this.controlModels = properties.map(p => this.createControlModel(p));
                this.loading = false;
                this._loadedSubject.next(true);
                this._loadedSubject.complete();
            });
        }
        /**
         * @return {?}
         */
        get isLoading() {
            return this.loading;
        }
        /**
         * @return {?}
         */
        get loadedSubject() {
            return this._loadedSubject;
        }
        /**
         * @return {?}
         */
        getControlsModels() {
            return this.controlModels;
        }
        /**
         * @param {?} property
         * @return {?}
         */
        createControlModel(property) {
            return new GenericControlModel(property, InputType.TEXT);
        }
        /**
         * @return {?}
         */
        applyChanges() {
            if (this.loading) {
                return;
            }
            let /** @type {?} */ properties = this.controlModels.map(cm => cm.property);
            this.propertiesSource.applyChanges(properties);
        }
    }
    Properties.PropertiesGroupModel = PropertiesGroupModel;
    let Validators;
    (function (Validators) {
        /**
         * @param {?} service
         * @param {?} debounce
         * @return {?}
         */
        function uniqueResource(service, debounce) {
            return (control) => {
                return new Observable(obs => {
                    if (control.valueChanges && control.value) {
                        control.valueChanges
                            .pipe(debounceTime(debounce), mergeMap(value => service(value)))
                            .subscribe(() => {
                            obs.next({ uniqueResource: true });
                            obs.complete();
                        }, () => {
                            obs.next(null);
                            obs.complete();
                        });
                    }
                    else {
                        obs.next(null);
                        obs.complete();
                    }
                });
            };
        }
        Validators.uniqueResource = uniqueResource;
        /**
         * @param {?} excluded
         * @return {?}
         */
        function noneOf(excluded) {
            return (control) => {
                return excluded.find(e => e === control.value) ? { 'noneOf': { value: control.value } } : null;
            };
        }
        Validators.noneOf = noneOf;
    })(Validators = Properties.Validators || (Properties.Validators = {}));
})(Properties || (Properties = {}));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { Palette, EditorComponent, ResizerDirective, Flo, FloModule, Properties, Constants, Shapes };
//# sourceMappingURL=spring-flo.js.map
