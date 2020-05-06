define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/promise/all',
    'JBrowse/Store/SeqFeature',
    'JBrowse/Store/SeqFeature/BigWig'
],
function (
    declare,
    lang,
    array,
    all,
    SeqFeatureStore,
    BigWig
) {
    return declare([SeqFeatureStore], {
        constructor: function (args) {
            var thisB = this;
            const alreadySeen = {}
            this.stores = array.map(args.urlTemplates, function (urlTemplate) {
                if (lang.isObject(urlTemplate)) {
                    const name = urlTemplate.name || urlTemplate.url.substr(urlTemplate.url.lastIndexOf('/') + 1)
                    if(alreadySeen[name]) {
                        throw new Error('duplicate name found, please check configuration')
                    }
                    alreadySeen[name] = true

                    const c = Object.assign(args, urlTemplate, {
                        urlTemplate: urlTemplate.url,
                        name: name
                    });
                    if (urlTemplate.storeClass) {
                        const CLASS = dojo.global.require(urlTemplate.storeClass);
                        return new CLASS(Object.assign(c, { config: c }));
                    }
                    return new BigWig(Object.assign(c, { config: c }));
                }
                const name = urlTemplate.substr(urlTemplate.lastIndexOf('/') + 1)
                if(alreadySeen[name]) {
                    throw new Error('duplicate name found, please check configuration')
                }
                alreadySeen[name] = true
                const c = Object.assign(args, {
                    urlTemplate: urlTemplate,
                    name: urlTemplate.substr(urlTemplate.lastIndexOf('/') + 1)
                });
                return new BigWig(Object.assign(c, { config: c }));
            });
        },

        getFeatures: function (query, featureCallback, endCallback, errorCallback) {
            var thisB = this;
            var finished = 0;
            var finishCallback = function () {
                if (thisB.stores.length === ++finished) {
                    endCallback();
                }
            };
            array.forEach(this.stores, function (store) {
                var f = (function (name) {
                    return function (feat) {
                        if (!feat.data.source) { feat.data.source = name; }
                        featureCallback(feat);
                    };
                })(store.name);
                store.getFeatures(query,
                    f, finishCallback, errorCallback
                );
            });
        },

        getIndividualStats: function (successCallback, errorCallback) {
            var thisB = this;
            var finished = 0;
            var stats = {};

            array.forEach(this.stores, function (store) {
                store.getGlobalStats((function (name) {
                    return function (t) {
                        stats[name] = t;
                        if (thisB.stores.length === ++finished) {
                            successCallback(stats);
                        }
                    };
                })(store.name), errorCallback);
            });
        },
        getGlobalStats: function (successCallback, errorCallback) {
            var thisB = this;
            var finished = 0;
            var stats = { scoreMin: 100000000, scoreMax: -10000000 };

            var finishCallback = function (t) {
                if (t.scoreMin < stats.scoreMin) {
                    stats.scoreMin = t.scoreMin;
                }
                if (t.scoreMax > stats.scoreMax) {
                    stats.scoreMax = t.scoreMax;
                }
                if (thisB.stores.length === ++finished) {
                    successCallback(stats);
                }
            };
            array.forEach(this.stores, function (store) {
                store.getGlobalStats(finishCallback, errorCallback);
            });
        },
        getRegionStats: function (query, successCallback, errorCallback) {
            var thisB = this;
            var finished = 0;
            var stats = { scoreMin: 100000000, scoreMax: -10000000 };

            var finishCallback = function (t) {
                if (!thisB.config.useStdDev) {
                    if (t.scoreMin < stats.scoreMin) {
                        stats.scoreMin = t.scoreMin;
                    }
                    if (t.scoreMax > stats.scoreMax) {
                        stats.scoreMax = t.scoreMax;
                    }
                } else {
                    const newMax = t.scoreMean + 3 * t.scoreStdDev;
                    if (newMax > stats.scoreMax) {
                        stats.scoreMax = newMax;
                    }
                    stats.scoreMin = 0;
                }
                if (thisB.stores.length === ++finished) {
                    successCallback(stats);
                }
            };
            array.forEach(this.stores, function (store) {
                store.getRegionStats(query, finishCallback, errorCallback);
            });
        },

        saveStore: function () {
            return {
                urlTemplates: this.config.urlTemplates
            };
        }
    });
});
