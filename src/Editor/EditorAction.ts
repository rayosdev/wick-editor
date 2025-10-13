/**
 * An object which describes properties of actions throughout the editor.
 */

interface EditorActionArgs {
  action: () => void;
  id: string;
  icon?: string;
  tooltip?: string;
  color?: string;
}

class EditorAction {
  action: () => void;
  id: string;
  icon: string;
  tooltip?: string;
  color: string;

  constructor(args: EditorActionArgs) {
    // Initialize required params
    if (!args.action) throw new Error("Missing Required Parameter: action.");
    if (!args.id) throw new Error("Missing Required Parameter: id.");

    this.action = args.action;
    this.id = args.id;

    // Initialize optional params with defaults
    this.icon = args.icon ?? "action";
    this.tooltip = args.tooltip;
    this.color = args.color ?? "gray";
  }
}

export default EditorAction;
