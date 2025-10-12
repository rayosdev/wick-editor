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

import { ReactNode, ErrorInfo } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: () => JSX.Element;
  processError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * ErrorBoundary component - catches JavaScript errors in child components
 * Displays a fallback UI instead of crashing the entire component tree
 * 
 * Now using react-error-boundary library for functional component compatibility
 */
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
  processError
}) => {
  const FallbackComponent = fallback || (() => null);

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={(error, errorInfo) => {
        console.log("error234", true);
        if (processError) {
          processError(error, errorInfo);
        }
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;

