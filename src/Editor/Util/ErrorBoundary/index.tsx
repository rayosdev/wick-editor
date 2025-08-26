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

class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  }

  static defaultProps = {
    fallback: () => null
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo);
    if(this.props.processError) {
      this.props.processError(error, errorInfo)
    }
  }

  render() {
    if(this.state.hasError) {
      // console.log("error234", this.state.hasError);
      const ErrorComponent = this.props.fallback;

      return <ErrorComponent />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
