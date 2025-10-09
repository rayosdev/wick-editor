import React, { useMemo } from "react";
import { ObjectInspector } from "react-inspector";
import classNames from "classnames";

const METHOD_CLASS_MAP = {
  log: "default",
  info: "info",
  warn: "warn",
  error: "error",
  debug: "debug",
};

const METHOD_LABEL = {
  log: "LOG",
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
  debug: "DEBUG",
};

const MAX_EXPAND_LEVEL = 1;

function isPrimitive(value) {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function formatTimestamp(timestamp) {
  try {
    return new Date(timestamp).toLocaleTimeString();
  } catch (error) {
    return "";
  }
}

function renderValue(value, index) {
  if (isPrimitive(value)) {
    return (
      <span key={`primitive-${index}`} className="we-code-console-text">
        {String(value)}
      </span>
    );
  }

  return (
    <ObjectInspector
      key={`object-${index}`}
      data={value}
      expandLevel={MAX_EXPAND_LEVEL}
      theme="chromeDark"
      className="we-code-console-object"
    />
  );
}

function ConsolePanel({ logs }) {
  const items = useMemo(() => logs ?? [], [logs]);

  if (!items.length) {
    return (
      <div className="we-code-console we-code-console-empty">
        Console output will appear here
      </div>
    );
  }

  return (
    <div className="we-code-console">
      {items.map((log) => {
        const methodVariant = METHOD_CLASS_MAP[log.method] || "default";
        const label = METHOD_LABEL[log.method] || log.method?.toUpperCase();
        return (
          <div
            key={log.id}
            className={classNames(
              "we-code-console-entry",
              `we-code-console-${methodVariant}`
            )}
          >
            <div className="we-code-console-meta">
              <span className="we-code-console-label">{label}</span>
              <span className="we-code-console-time">
                {formatTimestamp(log.timestamp)}
              </span>
            </div>
            <div className="we-code-console-data">
              {log.data && log.data.length
                ? log.data.map((value, index) => renderValue(value, index))
                : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ConsolePanel;
