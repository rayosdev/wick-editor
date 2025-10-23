/*
 * Copyright 2020 WICKLETS LLC
 *
 * This file is part of Paper.js-drawing-tools.
 *
 * Paper.js-drawing-tools is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Paper.js-drawing-tools is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Paper.js-drawing-tools.  If not, see <https://www.gnu.org/licenses/>.
 */

(function () {
    // Create textarea element with native DOM API (no jQuery)
    var editElem: HTMLTextAreaElement = document.createElement('textarea');
    Object.assign(editElem.style, {
        position: 'absolute',
        overflow: 'hidden',
        width: '100px',
        height: '100px',
        left: '0px',
        top: '0px',
        resize: 'none',
        lineHeight: '1.2',
        backgroundColor: '#ffffff',
        boxSizing: 'content-box',
        MozBoxSizing: 'content-box',
        WebkitBoxSizing: 'content-box',
        border: 'none'
    });

    paper.TextItem.inject({
        attachTextArea: function (paper: any) {
            // Just in case the textbox is still on screen somehow...
            if(editElem && editElem.parentNode) {
                editElem.parentNode.removeChild(editElem);
            }

            paper.view.element.offsetParent.appendChild(editElem);
            editElem.focus();

            var clone = this.clone();
            clone.rotation = 0;
            clone.scaling = new paper.Point(1, 1);
            clone.position = this.position;

            var bounds = clone.bounds;
            var viewBounds = paper.view.bounds;
            var topLeft = paper.view.projectToView(bounds.topLeft);
            var bottomRight = paper.view.projectToView(bounds.bottomRight);

            editElem.value = this.content;
            editElem.style.left = topLeft.x + 'px';
            editElem.style.top = topLeft.y + 'px';
            editElem.style.width = (bottomRight.x - topLeft.x) + 'px';
            editElem.style.height = (bottomRight.y - topLeft.y) + 'px';
            editElem.style.fontSize = this.fontSize + 'px';
            editElem.style.fontFamily = this.fontFamily;
            editElem.style.color = this.fillColor.toCSS();
            editElem.style.textAlign = this.justification;
            editElem.style.fontWeight = this.fontWeight;
            editElem.style.fontStyle = this.fontStyle;

            var self = this;
            var updateText = function() {
                self.content = editElem.value;
            };

            editElem.onkeyup = updateText;
            editElem.oninput = updateText;
            editElem.onblur = function() {
                self.content = editElem.value;
                if(editElem.parentNode) {
                    editElem.parentNode.removeChild(editElem);
                }
            };

            editElem.select();
        }
    });
})();
