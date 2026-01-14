/*
 * Copyright 2020 WICKLETS LLC
 *
 * This file is part of Wick Engine.
 *
 * Wick Engine is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Engine is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Engine.  If not, see <https://www.gnu.org/licenses/>.
 */

Wick.Tools.Text = class extends Wick.Tool {
    public name: string;
    public hoveredOverText: any; // paper.PointText
    public editingText: any; // paper.PointText

    /**
     * Creates an instance of the text tool.
     */
    constructor () {
        super();

        this.name = 'text';

        this.hoveredOverText = null;
        this.editingText = null;
    }

    get doubleClickEnabled (): boolean {
        return false;
    }

    /**
     * A text cursor.
     * @type {string}
     */
    get cursor (): string {
        return 'text';
    }

    get isDrawingTool (): boolean {
        return true;
    }

    onActivate (e: any): void {

    }

    onDeactivate (e: any): void {
        if(this.editingText) {
            this.finishEditingText();
        }
        this.hoveredOverText = null;
    }

    onMouseMove (e: any): void {
        super.onMouseMove(e);

        if(e.item && e.item.className === 'PointText' && !e.item.parent.parent) {
            this.hoveredOverText = e.item;
            this.setCursor('text');
        } else {
            this.hoveredOverText = null;
            this.setCursor('url(cursors/text.png) 32 32, auto');
        }
    }

    onMouseDown (e: any): void {
        if (this.editingText) {
            this.finishEditingText();
        } else if(this.hoveredOverText) {
            this.editingText = this.hoveredOverText;
            e.item.edit(this.project.view.paper);
        } else {
            var text = new this.paper.PointText(e.point);
            text.justification = 'left';
            text.fillColor = this.getSetting('fillColor').rgba;
            text.content = 'Text';
            text.fontSize = 24;

            var wickText = new Wick.Path({json: text.exportJSON({asString:false})})
            this.project.activeFrame.addPath(wickText);

            this.project.view.render();

            this.editingText = wickText.view.item;
            this.editingText.edit(this.project.view.paper);

            //this.fireEvent('canvasModified');
        }
    }

    onMouseDrag (e: any): void {

    }

    onMouseUp (e: any): void {

    }

    reset (): void {
        this.finishEditingText();
    }

    /**
     * Stop editing the current text and apply changes.
     */
    finishEditingText (): void {
        if(!this.editingText) return;
        this.editingText.finishEditing();
        if(this.editingText.content === '') {
            this.editingText.remove();
        }
        this.editingText = null;
        this.fireEvent({eventName: 'canvasModified', actionName: 'text'});
    }
}
