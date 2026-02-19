/*
 * Copyright 2020 WICKLETS LLC
 *
 * This file is part of Wick Editor.
 *
 * Wick Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Editor.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';

const OutlinerTitle: React.FC = () => {
  return (
    <div className="outliner-title flex h-[36px] items-center whitespace-nowrap px-[10px]">
      <div className="outliner-title-name inline-block font-['Nunito_Sans'] text-[12px] font-bold uppercase tracking-[0.03em] text-editor-text-primary">
        Outliner
      </div>
    </div>
  );
};

export default OutlinerTitle;
