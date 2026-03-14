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

import { useMemo } from "react";
import { ObjectInspector } from "react-inspector";
import classNames from "classnames";

type ConsoleMethod = "log" | "info" | "warn" | "error" | "debug" | (string & {});

export type ConsoleEntry = {
    id: string;
    method: ConsoleMethod;
    data?: unknown[] | null;
    timestamp?: number;
};

export interface ConsolePanelProps {
    logs?: ConsoleEntry[] | null;
}

type MethodClassMap = Record<"log" | "info" | "warn" | "error" | "debug", string>;

type MethodLabelMap = Record<"log" | "info" | "warn" | "error" | "debug", string>;

const METHOD_CLASS_MAP: MethodClassMap = {
    log: "default",
    info: "info",
    warn: "warn",
    error: "error",
    debug: "debug",
};

const METHOD_LABEL: MethodLabelMap = {
    log: "LOG",
    info: "INFO",
    warn: "WARN",
    error: "ERROR",
    debug: "DEBUG",
};

const MAX_EXPAND_LEVEL = 1;

const isPrimitive = (value: unknown): value is string | number | boolean | null | undefined => {
    return (
        value === null ||
        value === undefined ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    );
};

const formatTimestamp = (timestamp?: number): string => {
    if (typeof timestamp !== "number") {
        return "";
    }

    try {
        return new Date(timestamp).toLocaleTimeString();
    } catch (error) {
        console.warn("Failed to format timestamp", error);
        return "";
    }
};

const renderValue = (value: unknown, index: number): JSX.Element => {
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
};

const ConsolePanel = ({ logs }: ConsolePanelProps): JSX.Element => {
    const items = useMemo(() => logs ?? [], [logs]);

    if (items.length === 0) {
        return (
            <div className="we-code-console we-code-console-empty">
                Console output will appear here
            </div>
        );
    }

    return (
        <div className="we-code-console">
            {items.map((log) => {
                const methodVariant =
                    (typeof log.method === "string" && METHOD_CLASS_MAP[log.method as keyof MethodClassMap]) ??
                    "default";
                const label =
                    (typeof log.method === "string" && METHOD_LABEL[log.method as keyof MethodLabelMap]) ??
                    (typeof log.method === "string" ? log.method.toUpperCase() : "");
                const dataArray = Array.isArray(log.data) ? log.data : [];

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
                            {dataArray.length > 0
                                ? dataArray.map((value, index) => renderValue(value, index))
                                : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ConsolePanel;
