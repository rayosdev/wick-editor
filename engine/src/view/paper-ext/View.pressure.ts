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

paper.View.inject({
  pressure: 1,
  enablePressure: function(args: any) {
    let self = this;
    const element = this.element.parentElement;

    // Use native Pointer Events API for pressure sensitivity
    const handlePointerMove = function(event: PointerEvent) {
      // PointerEvent.pressure ranges from 0.0 to 1.0
      // Default to 0.5 if pressure is not supported
      self.pressure = event.pressure || 0.5;
    };

    const handlePointerEnd = function() {
      self.pressure = 0;
    };

    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerEnd);
    element.addEventListener('pointerleave', handlePointerEnd);
    element.addEventListener('pointercancel', handlePointerEnd);
  },
});
