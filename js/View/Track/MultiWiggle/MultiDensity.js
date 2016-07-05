define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/Color',
    'MultiBigWig/View/Track/MultiWiggleBase',
    'JBrowse/Util',
    'dijit/Tooltip'
],
function(
    declare,
    array,
    Color,
    MultiWiggleBase,
    Util,
    Tooltip
) {
    return declare(MultiWiggleBase, {

        _defaultConfig: function() {
            return Util.deepUpdate(dojo.clone(this.inherited(arguments)), {
                maxExportSpan: 500000,
                autoscale: 'local',
                style: {
                    pos_color: '#00f',
                    neg_color: '#f00',
                    bg_color: 'rgba(230,230,230,0.6)',
                    clip_marker_color: 'black',
                    height: 100
                }
            });
        },
        _drawFeatures: function(scale, leftBase, rightBase, block, canvas, pixels, dataScale) {
            var thisB = this;
            var context = canvas.getContext('2d');
            var canvasHeight = canvas.height;
            var featureColor = typeof this.config.style.color === 'function' ? this.config.style.color :
                (function() { // default color function uses conf variables
                    var disableClipMarkers = thisB.config.disable_clip_markers;
                    var normOrigin = dataScale.normalize(dataScale.origin);

                    return function(p, n) {
                        var feature = p.feat;
                        var ret;
                        // not clipped
                        if (disableClipMarkers || n <= 1 && n >= 0) {
                            ret = Color.blendColors(
                                new Color(thisB.getConfForFeature('style.bg_color', feature)),
                                new Color(thisB.getConfForFeature(n >= normOrigin ? 'style.pos_color' : 'style.neg_color', feature)),
                                Math.abs(n - normOrigin)
                            ).toString();
                        } else {
                            ret = (n > 1 ? thisB.getConfForFeature('style.pos_color', feature)
                                       : thisB.getConfForFeature('style.neg_color', feature));
                        }
                        return ret;
                    };
                })();

            var resolution = Util.getResolution(context, this.browser.config.highResolutionMode);
            var kheight = canvasHeight / (Object.keys(this.map).length * resolution);

            array.forEach(pixels, function(p, i) {
                if (p) {
                    array.forEach(p, function(pi, j) {
                        if (pi) {
                            var score = pi.score;
                            var n = dataScale.normalize(score);
                            context.fillStyle = '' + featureColor(pi, n);
                            thisB._fillRectMod(context, i, j * kheight, 1, kheight);
                        }
                    });
                }
            });
        },
        makeTrackLabel: function() {
            var canvasHeight = this.config.style.height;
            var kheight = canvasHeight / (Object.keys(this.map).length);
            var thisB = this;

            this.inherited(arguments);
            if (this.config.showLabels || this.config.showTooltips) {
                this.sublabels = array.map(Object.keys(this.map), function(key) {
                    var elt = dojo.create('div', {
                        className: 'track-sublabel',
                        id: key,
                        style: {
                            position: 'absolute',
                            height: kheight + 'px',
                            width: this.config.showLabels ? (this.config.labelWidth?this.config.labelWidth+'px':null) : '10px',
                            font: this.config.labelFont,
                            fontSize: this.config.labelFontSize,
                            backgroundColor: this.config.urlTemplates[this.map[key]].color
                        },
                        innerHTML: this.config.showLabels ? key : ''
                    }, this.div);
                    elt.tooltip = new Tooltip({
                        connectId: key,
                        label: key,
                        showDelay: 0
                    });

                    return elt;
                }, this);
            }
        },
        updateStaticElements: function(/** Object*/ coords) {
            this.inherited(arguments);
            var height = this.config.style.height;
            if (this.sublabels && 'x' in coords) {
                var len = this.sublabels.length;
                array.forEach(this.sublabels, function(sublabel, i) {
                    sublabel.style.left = coords.x + 'px';
                    sublabel.style.top = i * height / len + 'px';
                }, this);
            }
        }

    });
});
