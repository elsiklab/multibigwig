define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/_base/Color',
    'dojo/on',
    '../MultiWiggleBase',
    'JBrowse/View/Track/_YScaleMixin',
    'JBrowse/Util',
    'JBrowse/View/Track/Wiggle/_Scale'
],
function (
    declare,
    array,
    lang,
    Color,
    on,
    WiggleBase,
    YScaleMixin,
    Util,
    Scale
) {
    return declare([WiggleBase, YScaleMixin], {
        _defaultConfig: function () {
            return Util.deepUpdate(lang.clone(this.inherited(arguments)), {
                autoscale: 'local',
                style: {
                    pos_color: 'blue',
                    neg_color: 'red',
                    origin_color: '#888',
                    variance_band_color: 'rgba(0,0,0,0.3)'
                }
            });
        },
        _getScaling: function (viewArgs, successCallback, errorCallback) {
            if (this.config.normalizeEach) {
                this.store.getIndividualStats(function (stats) {
                    Object.keys(stats).forEach(function (key) {
                        stats[key].normalize = function (val) { return (val - stats[key].scoreMin) / (stats[key].scoreMax - stats[key].scoreMin); };
                    });
                    stats.compare = function () { return true; };
                    successCallback(stats);
                }, errorCallback);
            } else {
                this._getScalingStats(viewArgs, dojo.hitch(this, function (stats) {
                    if (!this.lastScaling || !this.lastScaling.sameStats(stats) || this.trackHeightChanged) {
                        var scaling = new Scale(this.config, stats);

                        // bump minDisplayed to 0 if it is within 0.5% of it
                        if (Math.abs(scaling.min / scaling.max) < 0.005) {
                            scaling.min = 0;
                        }

                        // update our track y-scale to reflect it
                        this.makeYScale({
                            fixBounds: true,
                            fixBounds: 'fixBounds' in this.config ? this.config.fixBounds : true,
                            min: scaling.min,
                            max: scaling.max
                        });

                        // and finally adjust the scaling to match the ruler's scale rounding
                        scaling.min = this.ruler.scaler.bounds.lower;
                        scaling.max = this.ruler.scaler.bounds.upper;
                        scaling.range = scaling.max - scaling.min;

                        this.lastScaling = scaling;
                        this.trackHeightChanged = false; // reset flag
                    }

                    successCallback(this.lastScaling);
                }), errorCallback);
            }
        },

        updateStaticElements: function (coords) {
            this.inherited(arguments);
            this.updateYScaleFromViewDimensions(coords);
        },

        _drawFeatures: function (scale, leftBase, rightBase, block, canvas, pixels, dataScale) {
            var thisB = this;
            var context = canvas.getContext('2d');
            var canvasHeight = canvas.height;

            var ratio = Util.getResolution(context, this.browser.config.highResolutionMode);
            var toY;
            var originY;
            if (this.config.normalizeEach) {
                toY = lang.hitch(this, function (val, name) {
                    return canvasHeight * (1 - dataScale[name].normalize(val)) / ratio;
                });
                originY = 1;
            } else {
                toY = lang.hitch(this, function (val) {
                    return canvasHeight * (1 - dataScale.normalize(val)) / ratio;
                });
                originY = toY(dataScale.origin);
            }
            var initMap = {};
            array.forEach(pixels[0], function (s) {
                if (!s) {
                    return;
                }
                var f = s.feat;
                var source = f.get('source');
                var score = toY(s.score, source);
                initMap[source] = score;
            });

            array.forEach(pixels, function (p, i) {
                array.forEach(p, function (s) {
                    if (!s) {
                        return;
                    }

                    var f = s.feat;
                    var source = f.get('source');
                    var score = toY(s.score, source);
                    var elt = this.labels.find(function (l) { return l.name === f.get('source'); });
                    var color = elt.color;
                    var height = elt.lineWidth || 1;
                    var nonCont = elt.nonCont;
                    if (score <= canvasHeight || score > originY) { // if the rectangle is visible at all
                        if (score <= originY) {
                            // bar goes upward
                            if (nonCont) {
                                context.fillStyle = color;
                                if (elt.fill) {
                                    height = originY - score + 1;
                                }
                                thisB._fillRectMod(context, i, score, 1, height);
                            } else {
                                context.strokeStyle = color;
                                context.lineWidth = height;
                                context.beginPath();
                                context.moveTo(i, initMap[source]);
                                context.lineTo(i + 1, score);
                                context.stroke();
                                initMap[source] = score;
                            }
                        } else if (nonCont) {
                            context.fillStyle = color;

                            var top = score - 1;
                            var heightm = 1;
                            if (elt.fill) {
                                top = originY;
                                heightm = score - originY;
                            }
                            thisB._fillRectMod(context, i, top, 1,  heightm);
                        } else {
                            context.strokeStyle = color;
                            context.lineWidth = height;
                            context.beginPath();
                            context.moveTo(i, initMap[source]);
                            context.lineTo(i + 1, score);
                            context.stroke();
                            initMap[source] = score;
                        }
                    }
                }, this);
            }, this);
        }
    });
});
