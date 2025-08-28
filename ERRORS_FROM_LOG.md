Seems there are a lot of errors and warnings here is that correct?

npm run start

> wick-editor@1.19.3 start
> vite

The CJS build of Vite's Node API is deprecated. See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.

  VITE v6.3.5  ready in 386 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import './_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/_editor.scss 20:9  root stylesheet

Deprecation Warning [strict-unary]: This operation is parsed as:

    0 - $splitter-width

but you may have intended it to mean:

    0 (-$splitter-width)

Add a space after - to clarify that it's meant to be a binary operation, or wrap
it in parentheses to make it a unary operation. This will be an error in future
versions of Sass.

More info and automated migrator: https://sass-lang.com/d/strict-unary

    ╷
288 │   margin: 0 -$splitter-width;
    │           ^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_editor.scss 288:11  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15  @import
    src/Editor/_editor.scss 20:9       root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15  @import
    src/Editor/_editor.scss 20:9       root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11  @import
    src/Editor/_editor.scss 20:9       root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11  @import
    src/Editor/_editor.scss 20:9       root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15  @import
    src/Editor/_editor.scss 20:9       root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15  @import
    src/Editor/_editor.scss 20:9       root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11  @import
    src/Editor/_editor.scss 20:9       root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11  @import
    src/Editor/_editor.scss 20:9       root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15  @import
    src/Editor/_editor.scss 20:9       root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15  @import
    src/Editor/_editor.scss 20:9       root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Canvas/_canvas.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/MenuBar/_menubar.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_editor.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/DockedPanel/_dockedpanel.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Outliner/_outliner.scss 1:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 1:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
2 │ @import '../CanvasTransforms/canvastransforms';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 2:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss 1:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/AssetLibrary/_assetlibrary.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/_inspector.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 20:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
21 │  @import '../_outliner.scss';
   │          ^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 21:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
21 │ @import '../_inspector.scss';
   │         ^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss 1:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss 1:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/AssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
21 │ @import '../_inspector.scss';
   │         ^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
21 │ @import '../_toolbox.scss';
   │         ^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Util/PlayButton/_playbutton.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 20:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
21 │  @import '../_outliner.scss';
   │          ^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 21:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Util/PopupMenu/_popupmenu.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import '../_inspector.scss';
   │         ^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
21 │ @import '../_inspector.scss';
   │         ^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Util/ToolIcon/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Util/ActionButton/_actionbutton.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Util/WickInput/_wickinput.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
2 │ @import '../toolbox.scss';
  │         ^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 2:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15           @import
    src/Editor/Panels/Canvas/_canvas.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15           @import
    src/Editor/Panels/Canvas/_canvas.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11           @import
    src/Editor/Panels/Canvas/_canvas.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11           @import
    src/Editor/Panels/Canvas/_canvas.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15           @import
    src/Editor/Panels/Canvas/_canvas.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15           @import
    src/Editor/Panels/Canvas/_canvas.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11           @import
    src/Editor/Panels/Canvas/_canvas.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11           @import
    src/Editor/Panels/Canvas/_canvas.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15           @import
    src/Editor/Panels/Canvas/_canvas.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15           @import
    src/Editor/Panels/Canvas/_canvas.scss 20:9  root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/MakeInteractive/_makeinteractive.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/WelcomeMessage/_welcomemessage.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import './_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/_editor.scss 20:9                    @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [strict-unary]: This operation is parsed as:

    0 - $splitter-width

but you may have intended it to mean:

    0 (-$splitter-width)

Add a space after - to clarify that it's meant to be a binary operation, or wrap
it in parentheses to make it a unary operation. This will be an error in future
versions of Sass.

More info and automated migrator: https://sass-lang.com/d/strict-unary

    ╷
288 │   margin: 0 -$splitter-width;
    │           ^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_editor.scss 288:11                  @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/ExportMedia/_exportmedia.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/ExportOptions/_exportoptions.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/GeneralWarning/_generalwarning.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/SettingsModal/_settingsmodal.scss 20:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/MobileMenu/_mobilemenu.scss 20:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/MakeAnimated/_makeanimated.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/AutosaveWarning/_autosavewarning.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                            @import
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                            @import
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15              @import
    src/Editor/Panels/Outliner/_outliner.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15              @import
    src/Editor/Panels/Outliner/_outliner.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                     @import
    src/Editor/Panels/DockedPanel/_dockedpanel.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                     @import
    src/Editor/Panels/DockedPanel/_dockedpanel.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                      @import
    src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                      @import
    src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                              @import
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                              @import
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15             @import
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15             @import
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                       @import
    src/Editor/Panels/AssetLibrary/_assetlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                       @import
    src/Editor/Panels/AssetLibrary/_assetlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                 @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                 @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15             @import
    src/Editor/Panels/MenuBar/_menubar.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15             @import
    src/Editor/Panels/MenuBar/_menubar.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                            @import
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                            @import
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11              @import
    src/Editor/Panels/Outliner/_outliner.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11              @import
    src/Editor/Panels/Outliner/_outliner.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                     @import
    src/Editor/Panels/DockedPanel/_dockedpanel.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                     @import
    src/Editor/Panels/DockedPanel/_dockedpanel.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                      @import
    src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                      @import
    src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                              @import
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                              @import
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11             @import
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11             @import
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                       @import
    src/Editor/Panels/AssetLibrary/_assetlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                       @import
    src/Editor/Panels/AssetLibrary/_assetlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                 @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                 @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11             @import
    src/Editor/Panels/MenuBar/_menubar.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11             @import
    src/Editor/Panels/MenuBar/_menubar.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                            @import
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                            @import
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15              @import
    src/Editor/Panels/Outliner/_outliner.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15              @import
    src/Editor/Panels/Outliner/_outliner.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                     @import
    src/Editor/Panels/DockedPanel/_dockedpanel.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                     @import
    src/Editor/Panels/DockedPanel/_dockedpanel.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                      @import
    src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                      @import
    src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                              @import
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                              @import
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15             @import
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15             @import
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                       @import
    src/Editor/Panels/AssetLibrary/_assetlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                       @import
    src/Editor/Panels/AssetLibrary/_assetlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                 @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                 @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15             @import
    src/Editor/Panels/MenuBar/_menubar.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15             @import
    src/Editor/Panels/MenuBar/_menubar.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                            @import
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                            @import
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11              @import
    src/Editor/Panels/Outliner/_outliner.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11              @import
    src/Editor/Panels/Outliner/_outliner.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                     @import
    src/Editor/Panels/DockedPanel/_dockedpanel.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                     @import
    src/Editor/Panels/DockedPanel/_dockedpanel.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                      @import
    src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                      @import
    src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                              @import
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                              @import
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11             @import
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11             @import
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                       @import
    src/Editor/Panels/AssetLibrary/_assetlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                       @import
    src/Editor/Panels/AssetLibrary/_assetlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                 @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                 @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11             @import
    src/Editor/Panels/MenuBar/_menubar.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11             @import
    src/Editor/Panels/MenuBar/_menubar.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                            @import
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                            @import
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15              @import
    src/Editor/Panels/Outliner/_outliner.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15              @import
    src/Editor/Panels/Outliner/_outliner.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                     @import
    src/Editor/Panels/DockedPanel/_dockedpanel.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                     @import
    src/Editor/Panels/DockedPanel/_dockedpanel.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                      @import
    src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                      @import
    src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                              @import
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                              @import
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15             @import
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15             @import
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                       @import
    src/Editor/Panels/AssetLibrary/_assetlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                       @import
    src/Editor/Panels/AssetLibrary/_assetlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                 @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                 @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15             @import
    src/Editor/Panels/MenuBar/_menubar.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15             @import
    src/Editor/Panels/MenuBar/_menubar.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/CanvasTransforms/_canvastransforms.scss 1:9  @import
    src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss 2:9    root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
21 │ @import 'Editor/Panels/Inspector/_inspector.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 1:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
2 │ @import '../_inspectorscriptwindow.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 2:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 1:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
2 │ @import '../../outliner';
  │         ^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 2:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
21 │ @import '../toolsettings.scss'; 
   │         ^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/SupportUs/_supportus.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Util/ColorPicker/_colorpicker.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
21 │ @import '../_mobileinspector.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/WickModal/_wickmodal.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                 @import
    src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                 @import
    src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                 @import
    src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                 @import
    src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                 @import
    src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                 @import
    src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                 @import
    src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                 @import
    src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                 @import
    src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                 @import
    src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss 20:9  root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss 20:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Util/TabbedInterface/_tabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss 20:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss 1:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss 20:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                @import
    src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                @import
    src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                              @import
    src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                              @import
    src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                              @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                              @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                         @import
    src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                         @import
    src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                   @import
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                   @import
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                   @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                   @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                      @import
    src/Editor/Panels/AssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                      @import
    src/Editor/Panels/AssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                     @import
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                     @import
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                           @import
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                           @import
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                 @import
    src/Editor/Util/PlayButton/_playbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                 @import
    src/Editor/Util/PlayButton/_playbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                               @import
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                               @import
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                        @import
    src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                        @import
    src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15               @import
    src/Editor/Util/PopupMenu/_popupmenu.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15               @import
    src/Editor/Util/PopupMenu/_popupmenu.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                 @import
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                 @import
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                               @import
    src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                               @import
    src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15               @import
    src/Editor/Util/ToolIcon/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15               @import
    src/Editor/Util/ToolIcon/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                             @import
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                             @import
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                     @import
    src/Editor/Util/ActionButton/_actionbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                     @import
    src/Editor/Util/ActionButton/_actionbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15               @import
    src/Editor/Util/WickInput/_wickinput.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15               @import
    src/Editor/Util/WickInput/_wickinput.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                   @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                   @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                   @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                   @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                @import
    src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                @import
    src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                              @import
    src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                              @import
    src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                              @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                              @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                         @import
    src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                         @import
    src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                   @import
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                   @import
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                   @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                   @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                      @import
    src/Editor/Panels/AssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                      @import
    src/Editor/Panels/AssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                     @import
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                     @import
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                           @import
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                           @import
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                 @import
    src/Editor/Util/PlayButton/_playbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                 @import
    src/Editor/Util/PlayButton/_playbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                               @import
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                               @import
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                        @import
    src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                        @import
    src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11               @import
    src/Editor/Util/PopupMenu/_popupmenu.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11               @import
    src/Editor/Util/PopupMenu/_popupmenu.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                 @import
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                 @import
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                               @import
    src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                               @import
    src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11               @import
    src/Editor/Util/ToolIcon/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11               @import
    src/Editor/Util/ToolIcon/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                             @import
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                             @import
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                     @import
    src/Editor/Util/ActionButton/_actionbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                     @import
    src/Editor/Util/ActionButton/_actionbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11               @import
    src/Editor/Util/WickInput/_wickinput.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11               @import
    src/Editor/Util/WickInput/_wickinput.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                   @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                   @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                   @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                   @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                @import
    src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                @import
    src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                              @import
    src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                              @import
    src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                              @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                              @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                         @import
    src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                         @import
    src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                   @import
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                   @import
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                   @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                   @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                      @import
    src/Editor/Panels/AssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                      @import
    src/Editor/Panels/AssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                     @import
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                     @import
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                           @import
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                           @import
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                 @import
    src/Editor/Util/PlayButton/_playbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                 @import
    src/Editor/Util/PlayButton/_playbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                               @import
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                               @import
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                        @import
    src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                        @import
    src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15               @import
    src/Editor/Util/PopupMenu/_popupmenu.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15               @import
    src/Editor/Util/PopupMenu/_popupmenu.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                 @import
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                 @import
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                               @import
    src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                               @import
    src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15               @import
    src/Editor/Util/ToolIcon/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15               @import
    src/Editor/Util/ToolIcon/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                             @import
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                             @import
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                     @import
    src/Editor/Util/ActionButton/_actionbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                     @import
    src/Editor/Util/ActionButton/_actionbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15               @import
    src/Editor/Util/WickInput/_wickinput.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15               @import
    src/Editor/Util/WickInput/_wickinput.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                   @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                   @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                   @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                   @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                @import
    src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                @import
    src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                              @import
    src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                              @import
    src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                              @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                              @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                         @import
    src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                         @import
    src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                   @import
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                   @import
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                   @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                   @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                      @import
    src/Editor/Panels/AssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                      @import
    src/Editor/Panels/AssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                     @import
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                     @import
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                           @import
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                           @import
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                 @import
    src/Editor/Util/PlayButton/_playbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                 @import
    src/Editor/Util/PlayButton/_playbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                               @import
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                               @import
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                        @import
    src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                        @import
    src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11               @import
    src/Editor/Util/PopupMenu/_popupmenu.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11               @import
    src/Editor/Util/PopupMenu/_popupmenu.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                 @import
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                 @import
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                               @import
    src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                               @import
    src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11               @import
    src/Editor/Util/ToolIcon/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11               @import
    src/Editor/Util/ToolIcon/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                             @import
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                             @import
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                     @import
    src/Editor/Util/ActionButton/_actionbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                     @import
    src/Editor/Util/ActionButton/_actionbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11               @import
    src/Editor/Util/WickInput/_wickinput.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11               @import
    src/Editor/Util/WickInput/_wickinput.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                   @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                   @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                   @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                   @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                @import
    src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                @import
    src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                              @import
    src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                              @import
    src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                              @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                              @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                         @import
    src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                         @import
    src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                   @import
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                   @import
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                   @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                   @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                      @import
    src/Editor/Panels/AssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                      @import
    src/Editor/Panels/AssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                     @import
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                     @import
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                           @import
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                           @import
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                 @import
    src/Editor/Util/PlayButton/_playbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                 @import
    src/Editor/Util/PlayButton/_playbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                               @import
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                               @import
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                        @import
    src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                        @import
    src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15               @import
    src/Editor/Util/PopupMenu/_popupmenu.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15               @import
    src/Editor/Util/PopupMenu/_popupmenu.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                 @import
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                 @import
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                               @import
    src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                               @import
    src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15               @import
    src/Editor/Util/ToolIcon/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15               @import
    src/Editor/Util/ToolIcon/_toolbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                             @import
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                             @import
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                     @import
    src/Editor/Util/ActionButton/_actionbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                     @import
    src/Editor/Util/ActionButton/_actionbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15               @import
    src/Editor/Util/WickInput/_wickinput.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15               @import
    src/Editor/Util/WickInput/_wickinput.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                   @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                   @import
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                   @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                   @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9                   @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 2:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Outliner/_outliner.scss 1:9                       @import
    src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss 21:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                    @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/_inspector.scss 20:9                      @import
    src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9                @import
    src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Outliner/_outliner.scss 1:9                   @import
    src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss 21:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/_inspector.scss 20:9                  @import
    src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss 21:9  root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │  @import 'Editor/_wickbrand.scss';
   │          ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Util/ColorPicker/_wickcolorpicker.scss 20:10  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Util/AudioPlayer/_audioplayer.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                             @import
    src/Editor/Modals/MakeInteractive/_makeinteractive.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                             @import
    src/Editor/Modals/MakeInteractive/_makeinteractive.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                           @import
    src/Editor/Modals/WelcomeMessage/_welcomemessage.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                           @import
    src/Editor/Modals/WelcomeMessage/_welcomemessage.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                             @import
    src/Editor/Modals/MakeInteractive/_makeinteractive.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                             @import
    src/Editor/Modals/MakeInteractive/_makeinteractive.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                           @import
    src/Editor/Modals/WelcomeMessage/_welcomemessage.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                           @import
    src/Editor/Modals/WelcomeMessage/_welcomemessage.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                             @import
    src/Editor/Modals/MakeInteractive/_makeinteractive.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                             @import
    src/Editor/Modals/MakeInteractive/_makeinteractive.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                           @import
    src/Editor/Modals/WelcomeMessage/_welcomemessage.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                           @import
    src/Editor/Modals/WelcomeMessage/_welcomemessage.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                             @import
    src/Editor/Modals/MakeInteractive/_makeinteractive.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                             @import
    src/Editor/Modals/MakeInteractive/_makeinteractive.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                           @import
    src/Editor/Modals/WelcomeMessage/_welcomemessage.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                           @import
    src/Editor/Modals/WelcomeMessage/_welcomemessage.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                             @import
    src/Editor/Modals/MakeInteractive/_makeinteractive.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                             @import
    src/Editor/Modals/MakeInteractive/_makeinteractive.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                           @import
    src/Editor/Modals/WelcomeMessage/_welcomemessage.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                           @import
    src/Editor/Modals/WelcomeMessage/_welcomemessage.scss 20:9  root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15               @import
    src/Editor/_editor.scss 20:9                    @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15               @import
    src/Editor/_editor.scss 20:9                    @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                     @import
    src/Editor/Modals/ExportMedia/_exportmedia.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                     @import
    src/Editor/Modals/ExportMedia/_exportmedia.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                           @import
    src/Editor/Modals/GeneralWarning/_generalwarning.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                           @import
    src/Editor/Modals/GeneralWarning/_generalwarning.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                         @import
    src/Editor/Modals/ExportOptions/_exportoptions.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                         @import
    src/Editor/Modals/ExportOptions/_exportoptions.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                    @import
    src/Editor/Modals/MobileMenu/_mobilemenu.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                    @import
    src/Editor/Modals/MobileMenu/_mobilemenu.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                       @import
    src/Editor/Modals/MakeAnimated/_makeanimated.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                       @import
    src/Editor/Modals/MakeAnimated/_makeanimated.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                             @import
    src/Editor/Modals/AutosaveWarning/_autosavewarning.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                             @import
    src/Editor/Modals/AutosaveWarning/_autosavewarning.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                          @import
    src/Editor/Modals/SettingsModal/_settingsmodal.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                          @import
    src/Editor/Modals/SettingsModal/_settingsmodal.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11               @import
    src/Editor/_editor.scss 20:9                    @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11               @import
    src/Editor/_editor.scss 20:9                    @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                     @import
    src/Editor/Modals/ExportMedia/_exportmedia.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                     @import
    src/Editor/Modals/ExportMedia/_exportmedia.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                           @import
    src/Editor/Modals/GeneralWarning/_generalwarning.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                           @import
    src/Editor/Modals/GeneralWarning/_generalwarning.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                         @import
    src/Editor/Modals/ExportOptions/_exportoptions.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                         @import
    src/Editor/Modals/ExportOptions/_exportoptions.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                    @import
    src/Editor/Modals/MobileMenu/_mobilemenu.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                    @import
    src/Editor/Modals/MobileMenu/_mobilemenu.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                       @import
    src/Editor/Modals/MakeAnimated/_makeanimated.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                       @import
    src/Editor/Modals/MakeAnimated/_makeanimated.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                             @import
    src/Editor/Modals/AutosaveWarning/_autosavewarning.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                             @import
    src/Editor/Modals/AutosaveWarning/_autosavewarning.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                          @import
    src/Editor/Modals/SettingsModal/_settingsmodal.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                          @import
    src/Editor/Modals/SettingsModal/_settingsmodal.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15               @import
    src/Editor/_editor.scss 20:9                    @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15               @import
    src/Editor/_editor.scss 20:9                    @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                     @import
    src/Editor/Modals/ExportMedia/_exportmedia.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                     @import
    src/Editor/Modals/ExportMedia/_exportmedia.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                           @import
    src/Editor/Modals/GeneralWarning/_generalwarning.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                           @import
    src/Editor/Modals/GeneralWarning/_generalwarning.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                         @import
    src/Editor/Modals/ExportOptions/_exportoptions.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                         @import
    src/Editor/Modals/ExportOptions/_exportoptions.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                    @import
    src/Editor/Modals/MobileMenu/_mobilemenu.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                    @import
    src/Editor/Modals/MobileMenu/_mobilemenu.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                       @import
    src/Editor/Modals/MakeAnimated/_makeanimated.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                       @import
    src/Editor/Modals/MakeAnimated/_makeanimated.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                             @import
    src/Editor/Modals/AutosaveWarning/_autosavewarning.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                             @import
    src/Editor/Modals/AutosaveWarning/_autosavewarning.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                          @import
    src/Editor/Modals/SettingsModal/_settingsmodal.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                          @import
    src/Editor/Modals/SettingsModal/_settingsmodal.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11               @import
    src/Editor/_editor.scss 20:9                    @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11               @import
    src/Editor/_editor.scss 20:9                    @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                     @import
    src/Editor/Modals/ExportMedia/_exportmedia.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                     @import
    src/Editor/Modals/ExportMedia/_exportmedia.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                           @import
    src/Editor/Modals/GeneralWarning/_generalwarning.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                           @import
    src/Editor/Modals/GeneralWarning/_generalwarning.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                         @import
    src/Editor/Modals/ExportOptions/_exportoptions.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                         @import
    src/Editor/Modals/ExportOptions/_exportoptions.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                    @import
    src/Editor/Modals/MobileMenu/_mobilemenu.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                    @import
    src/Editor/Modals/MobileMenu/_mobilemenu.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                       @import
    src/Editor/Modals/MakeAnimated/_makeanimated.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                       @import
    src/Editor/Modals/MakeAnimated/_makeanimated.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                             @import
    src/Editor/Modals/AutosaveWarning/_autosavewarning.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                             @import
    src/Editor/Modals/AutosaveWarning/_autosavewarning.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                          @import
    src/Editor/Modals/SettingsModal/_settingsmodal.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                          @import
    src/Editor/Modals/SettingsModal/_settingsmodal.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15               @import
    src/Editor/_editor.scss 20:9                    @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15               @import
    src/Editor/_editor.scss 20:9                    @import
    src/Editor/Panels/Timeline/_timeline.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                     @import
    src/Editor/Modals/ExportMedia/_exportmedia.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                     @import
    src/Editor/Modals/ExportMedia/_exportmedia.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                           @import
    src/Editor/Modals/GeneralWarning/_generalwarning.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                           @import
    src/Editor/Modals/GeneralWarning/_generalwarning.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                         @import
    src/Editor/Modals/ExportOptions/_exportoptions.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                         @import
    src/Editor/Modals/ExportOptions/_exportoptions.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                    @import
    src/Editor/Modals/MobileMenu/_mobilemenu.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                    @import
    src/Editor/Modals/MobileMenu/_mobilemenu.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                       @import
    src/Editor/Modals/MakeAnimated/_makeanimated.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                       @import
    src/Editor/Modals/MakeAnimated/_makeanimated.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                             @import
    src/Editor/Modals/AutosaveWarning/_autosavewarning.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                             @import
    src/Editor/Modals/AutosaveWarning/_autosavewarning.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                          @import
    src/Editor/Modals/SettingsModal/_settingsmodal.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                          @import
    src/Editor/Modals/SettingsModal/_settingsmodal.scss 20:10  root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 8 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                            @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                            @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                      @import
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                      @import
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                         @import
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                         @import
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                            @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                            @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                                                            @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                                                            @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                           @import
    src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                           @import
    src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                 @import
    src/Editor/Modals/SupportUs/_supportus.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                 @import
    src/Editor/Modals/SupportUs/_supportus.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                   @import
    src/Editor/Util/ColorPicker/_colorpicker.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                   @import
    src/Editor/Util/ColorPicker/_colorpicker.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                      @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                      @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                                   @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                                   @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                            @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                            @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                      @import
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                      @import
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                         @import
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                         @import
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                            @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                            @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                                                            @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                                                            @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                           @import
    src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                           @import
    src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                 @import
    src/Editor/Modals/SupportUs/_supportus.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                 @import
    src/Editor/Modals/SupportUs/_supportus.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                   @import
    src/Editor/Util/ColorPicker/_colorpicker.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                   @import
    src/Editor/Util/ColorPicker/_colorpicker.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                      @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                      @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                                   @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                                   @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                            @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                            @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                      @import
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                      @import
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                         @import
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                         @import
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                            @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                            @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                                                            @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                                                            @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                           @import
    src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                           @import
    src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                 @import
    src/Editor/Modals/SupportUs/_supportus.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                 @import
    src/Editor/Modals/SupportUs/_supportus.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                   @import
    src/Editor/Util/ColorPicker/_colorpicker.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                   @import
    src/Editor/Util/ColorPicker/_colorpicker.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                      @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                      @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                                   @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                                   @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                            @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                            @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                      @import
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                      @import
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                         @import
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                         @import
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                            @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                            @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                                                            @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                                                            @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                           @import
    src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                           @import
    src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                 @import
    src/Editor/Modals/SupportUs/_supportus.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                 @import
    src/Editor/Modals/SupportUs/_supportus.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                   @import
    src/Editor/Util/ColorPicker/_colorpicker.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                   @import
    src/Editor/Util/ColorPicker/_colorpicker.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                      @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                      @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                                   @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                                   @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                            @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                            @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                      @import
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                      @import
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                         @import
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                         @import
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                            @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                            @import
    src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                                                            @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                                                            @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                           @import
    src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                           @import
    src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                 @import
    src/Editor/Modals/SupportUs/_supportus.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                 @import
    src/Editor/Modals/SupportUs/_supportus.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                   @import
    src/Editor/Util/ColorPicker/_colorpicker.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                   @import
    src/Editor/Util/ColorPicker/_colorpicker.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                      @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                      @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                                   @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                                   @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 20:9           @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 2:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
21 │ @import '../_inspector.scss';
   │         ^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 21:9           @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 2:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Outliner/_outliner.scss 1:9                                          @import
    src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss 2:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
1 │ @import 'Editor/_wickbrand.scss';
  │         ^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 1:9                          @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

  ╷
2 │ @import '../toolbox.scss';
  │         ^^^^^^^^^^^^^^^^^
  ╵
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 2:9                          @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss 20:9                        @import
    src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss 21:9  root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                 @import
    src/Editor/Modals/WickModal/_wickmodal.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                 @import
    src/Editor/Modals/WickModal/_wickmodal.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                 @import
    src/Editor/Modals/WickModal/_wickmodal.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                 @import
    src/Editor/Modals/WickModal/_wickmodal.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                 @import
    src/Editor/Modals/WickModal/_wickmodal.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                 @import
    src/Editor/Modals/WickModal/_wickmodal.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                 @import
    src/Editor/Modals/WickModal/_wickmodal.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                 @import
    src/Editor/Modals/WickModal/_wickmodal.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                 @import
    src/Editor/Modals/WickModal/_wickmodal.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                 @import
    src/Editor/Modals/WickModal/_wickmodal.scss 20:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Toolbox/_toolbox.scss 20:9                                           @import
    src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss 2:9                          @import
    src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss 21:9  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/_inspector.scss 20:9                                             @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss 21:9           @import
    src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss 2:9  root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                            @import
    src/Editor/Util/TabbedInterface/_tabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                            @import
    src/Editor/Util/TabbedInterface/_tabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                            @import
    src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                            @import
    src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                            @import
    src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                            @import
    src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                @import
    src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                                @import
    src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                         @import
    src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                         @import
    src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                          @import
    src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                                          @import
    src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                            @import
    src/Editor/Util/TabbedInterface/_tabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                            @import
    src/Editor/Util/TabbedInterface/_tabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                            @import
    src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                            @import
    src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                            @import
    src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                            @import
    src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                @import
    src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                                @import
    src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                         @import
    src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                         @import
    src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                          @import
    src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                                          @import
    src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                            @import
    src/Editor/Util/TabbedInterface/_tabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                            @import
    src/Editor/Util/TabbedInterface/_tabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                            @import
    src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                            @import
    src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                            @import
    src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                            @import
    src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                @import
    src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                                @import
    src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                         @import
    src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                         @import
    src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                          @import
    src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                                          @import
    src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                            @import
    src/Editor/Util/TabbedInterface/_tabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                            @import
    src/Editor/Util/TabbedInterface/_tabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                            @import
    src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                            @import
    src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                            @import
    src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                            @import
    src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                @import
    src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                                @import
    src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                         @import
    src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                         @import
    src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                          @import
    src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                                          @import
    src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                            @import
    src/Editor/Util/TabbedInterface/_tabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                            @import
    src/Editor/Util/TabbedInterface/_tabbedinterface.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                            @import
    src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss 1:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                            @import
    src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss 1:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                            @import
    src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                            @import
    src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                @import
    src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                                @import
    src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                         @import
    src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                         @import
    src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                          @import
    src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                                          @import
    src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss 20:10  root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                        @import
    src/Editor/Util/ColorPicker/_wickcolorpicker.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                        @import
    src/Editor/Util/ColorPicker/_wickcolorpicker.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                   @import
    src/Editor/Util/AudioPlayer/_audioplayer.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
287 │   background: darken($interface-warning-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 287:15                   @import
    src/Editor/Util/AudioPlayer/_audioplayer.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                        @import
    src/Editor/Util/ColorPicker/_wickcolorpicker.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                        @import
    src/Editor/Util/ColorPicker/_wickcolorpicker.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                   @import
    src/Editor/Util/AudioPlayer/_audioplayer.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -15.6762295082%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
288 │   border: darken($interface-warning-dark, 7.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 288:11                   @import
    src/Editor/Util/AudioPlayer/_audioplayer.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                        @import
    src/Editor/Util/ColorPicker/_wickcolorpicker.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                        @import
    src/Editor/Util/ColorPicker/_wickcolorpicker.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                   @import
    src/Editor/Util/AudioPlayer/_audioplayer.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
291 │   background: darken($interface-warning-dark, 12.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 291:15                   @import
    src/Editor/Util/AudioPlayer/_audioplayer.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                        @import
    src/Editor/Util/ColorPicker/_wickcolorpicker.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                        @import
    src/Editor/Util/ColorPicker/_wickcolorpicker.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                   @import
    src/Editor/Util/AudioPlayer/_audioplayer.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -26.1270491803%)
color.adjust($color, $lightness: -12.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
292 │   border: darken($interface-warning-dark, 12.5%);
    │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 292:11                   @import
    src/Editor/Util/AudioPlayer/_audioplayer.scss 20:9  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                        @import
    src/Editor/Util/ColorPicker/_wickcolorpicker.scss 20:10  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                        @import
    src/Editor/Util/ColorPicker/_wickcolorpicker.scss 20:10  root stylesheet

Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use color.adjust instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                   @import
    src/Editor/Util/AudioPlayer/_audioplayer.scss 20:9  root stylesheet

Deprecation Warning [color-functions]: darken() is deprecated. Suggestions:

color.scale($color, $lightness: -19.8186528497%)
color.adjust($color, $lightness: -7.5%)

More info: https://sass-lang.com/d/color-functions

    ╷
301 │   background: darken($wick-green-dark, 7.5%);
    │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵
    src/Editor/_wickbrand.scss 301:15                   @import
    src/Editor/Util/AudioPlayer/_audioplayer.scss 20:9  root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

   ╷
20 │ @import 'Editor/_wickbrand.scss';
   │         ^^^^^^^^^^^^^^^^^^^^^^^^
   ╵
    src/Editor/Panels/Inspector/_inspector.scss 20:9                          @import
    src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss 21:9  root stylesheet

Warning: 6 repetitive deprecation warnings omitted.
Run in verbose mode to see all warnings.

