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
    var editElem = document.createElement('textarea');
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
        attachTextArea: function (paper) {
            // Just in case the textbox is still on screen somehow...
            if(editElem && editElem.parentNode) {
                editElem.parentNode.removeChild(editElem);
            }

            paper.view.element.offsetParent.appendChild(editElem);
            editElem.focus();

            var clone = this.clone();
            clone.rotation = 0;
            clone.scaling = new paper.Point(1,1);
            clone.remove();

            var extraPadding = 3; // Extra padding so edit item doesn't get cut off.

            var width = (clone.bounds.width * paper.view.zoom) + extraPadding;
            var height = (clone.bounds.height * paper.view.zoom) + extraPadding;
            editElem.style.width = width + 'px';
            editElem.style.height = height + 'px';

            var outlineWidth = 1;
            editElem.style.outline = (outlineWidth * paper.view.zoom) + 'px dashed black';

            var position = paper.view.projectToView(clone.bounds.topLeft.x, clone.bounds.topLeft.y);
            position.x -= extraPadding/2 + outlineWidth;
            position.y -= extraPadding/2 + outlineWidth;
            var scale = this.scaling;
            var rotation = this.rotation;

            var fontSize = this.fontSize * paper.view.zoom;
            var fontFamily = this.fontFamily;
            var content = this.content;
            editElem.style.fontFamily = fontFamily;
            editElem.style.fontSize = fontSize + 'px';
            editElem.value = content;

            var transformString = '';
            transformString += 'translate('+position.x+'px,'+position.y+'px) ';
            transformString += 'rotate('+rotation+'deg) ';
            transformString += 'scale('+scale.x+','+scale.y+') ';
            editElem.style.transform = transformString;
        },
        edit: function(paper) {
            this.attachTextArea(paper);
            var self = this;
            editElem.oninput = function () {
                self.content = editElem.value;
                self.attachTextArea(paper);
            }
        },
        finishEditing: function() {
            if (editElem.parentNode) {
                editElem.parentNode.removeChild(editElem);
            }
        },
    });

})()
