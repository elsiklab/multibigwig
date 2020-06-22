define([
    'dojo/_base/declare',
    'JBrowse/Store/SeqFeature/BigWig',
    'JBrowse/Model/SimpleFeature'
], function (declare, BigWig, SimpleFeature) {
    return declare(BigWig, {
        getFeatures: function (query, featureCallback, endCallback, errorCallback) {
            this.inherited(arguments, [
                query,
                (feature) => {
                    const feat = feature.toJSON();
                    const uid = feat._uniqueID;
                    Object.assign(feat.data, {
                        source: 'test1',
                        score: feature.get('score') + 50
                    });
                    feat._uniqueID = uid + '_1';

                    featureCallback(new SimpleFeature(dojo.clone(feat)));

                    Object.assign(feat.data, {
                        source: 'test2',
                        score: feature.get('score') - 50
                    });
                    feat._uniqueID = uid + '_2';
                    featureCallback(new SimpleFeature(dojo.clone(feat)));
                },
                endCallback,
                errorCallback
            ]);
        }
    });
});
