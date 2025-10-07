// Ensure a global invert function exists, even if module resolution changes.
// Prefer the bundled UMD from invert.min.js, but fall back to a simple light/dark heuristic.
(function(){
  try {
    if (typeof window !== 'undefined') {
      // Try to capture the UMD module export set by invert.min.js, which may have assigned to module.exports
      var inv = null;
      if (typeof module !== 'undefined' && module && typeof module.exports === 'function') {
        inv = module.exports;
      } else if (typeof invert === 'function') {
        inv = invert;
      }
      if (inv && typeof window.invert !== 'function') {
        window.invert = inv;
      }
      if (typeof window.invert !== 'function') {
        // Lightweight fallback: choose black/white contrast for stroke
        window.invert = function(color) {
          try {
            // Expect hex like #rrggbb or rgb/rgba strings.
            var r=0,g=0,b=0;
            if (typeof color === 'string') {
              var m = color.match(/^#?([0-9a-f]{6})$/i);
              if (m) {
                var v = m[1];
                r = parseInt(v.substring(0,2),16);
                g = parseInt(v.substring(2,4),16);
                b = parseInt(v.substring(4,6),16);
              } else {
                var m2 = color.match(/rgba?\((\d+),(\d+),(\d+)/i);
                if (m2) { r = +m2[1]; g = +m2[2]; b = +m2[3]; }
              }
            } else if (color && typeof color === 'object') {
              r = color.r|0; g = color.g|0; b = color.b|0;
            }
            var luminance = (0.2126*(r/255)) + (0.7152*(g/255)) + (0.0722*(b/255));
            return luminance > 0.5 ? '#000000' : '#ffffff';
          } catch (e) {
            return '#000000';
          }
        };
      }
    }
  } catch (e) {}
})();
