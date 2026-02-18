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

interface InspectorTitleProps {
  title?: string;
  type?: string;
}

const InspectorTitle: React.FC<InspectorTitleProps> = ({ title, type }) => {
  const renderSelectionType = (): JSX.Element => {
    return (
      <div className="inspector-title-selection-type ml-2 inline-flex h-[80%] items-center text-[11px] font-bold text-[#BDBDBD]">
        {title}
      </div>
    );
  };

  return (
    <div className="inspector-title flex h-[36px] items-center whitespace-nowrap px-[10px]">
      <div className="inspector-title-name inline-block font-['Nunito_Sans'] text-[12px] font-bold uppercase tracking-[0.03em] text-white">Inspector</div>
      {type && title && renderSelectionType()}
    </div>
  );
};

export default InspectorTitle;
