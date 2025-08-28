/**
 * An object which describes properties of actions throughout the editor.
 * @extends Object
 */
class EditorAction extends Object {
  [key: string]: any;
  constructor(args: any) {
    super();
    let requiredParams = ['action', 'id'];
    let optionalParams = ['icon', 'tooltip', 'color'];

    let defaults: Record<string, any> = {
      'icon': 'action',
      'tooltip': undefined,
      'color': 'gray',
    }

    requiredParams.forEach(param => {
      if (param in args) {
        this[param] = args[param];
      } else {
        throw new Error("Missing Required Parameter: " + param + ".");
      }
    });

    optionalParams.forEach(param => {
      if (param in args) {
        this[param] = args[param];
      } else {
        this[param] = defaults[param];
      }
    })
  }
}
