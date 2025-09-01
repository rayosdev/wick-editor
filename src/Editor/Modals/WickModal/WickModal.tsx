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

import React, { Component } from 'react';
import Modal from 'react-modal';
import ToolIcon from 'Editor/Util/ToolIcon/ToolIcon';
import ActionButton from 'Editor/Util/ActionButton/ActionButton';

import './_wickmodal.scss';

import classNames from 'classnames';

interface WickModalProps {
  icon?: string;
  open?: boolean;
  toggle?: () => void;
  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
}

class WickModal extends Component<WickModalProps, any> {
  renderIcon () {
    return (
      <div id="modal-icon-container">
        <ToolIcon name={this.props.icon} /> 
      </div> 
    );
  }

  componentDidMount() {
    // Set the app element to the app root so react-modal only hides app content
    // from screen readers when modals are open. Avoid using 'body' which hides
    // the entire accessibility tree and triggers browser blocking warnings.
    Modal.setAppElement('#root');
 }

  render() {
    return (
      <Modal 
      isOpen={this.props.open} 
      toggle={() => {
        this.props.toggle();
      }}
      onRequestClose={this.props.toggle}
      className={classNames("modal-body", this.props.className)}
      overlayClassName={classNames("modal-overlay", this.props.overlayClassName)}>
      <div id="modal-close-icon-container">
        <ActionButton 
          color="tool" 
          icon="cancel-white" 
          action={this.props.toggle}
        />
      </div>
      <div className="modal-generic-container">
        {this.props.icon && this.renderIcon()}    
        {this.props.children}
      </div>
      </Modal>
    );
  }
}

export default WickModal