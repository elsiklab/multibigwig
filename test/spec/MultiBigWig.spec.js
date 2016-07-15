require([
    'dojo/_base/declare',
    'dojo/_base/array',
    'JBrowse/Browser',
    'MultiBigWig/View/Track/MultiWiggle/MultiXYPlot',
    'MultiBigWig/Store/SeqFeature/MultiBigWig'
],
function(
    declare,
    array,
    Browser,
    MultiXYPlot,
    MultiBigWigStore
) {

    describe('Can initialize track', function() {

        var track = new MultiXYPlot({
            browser: new Browser({unitTestMode: true}),
            config: {
                urlTemplates: [
                    {"url": "volvox_microarray.bw","name": "microarray_positive"},
                    {"url": "volvox_microarray_negative.bw","name": "microarray_negative"}
                ],
                label: "testtrack"
            }
        });
        it('track', function() {
            expect(track).toBeTruthy();
        });

    });

    describe('Can initialize store', function() {

        var store = new MultiBigWigStore({
            browser: new Browser({unitTestMode: true}),
            urlTemplates: [
                {"url": "../data/volvox_microarray.bw","name": "microarray_positive"},
                {"url": "../data/volvox_microarray_negative.bw","name": "microarray_negative"}
            ]
        });

        var features = [];
        beforeEach(function(done) {
                store.getFeatures({ref: "ctgA", start: 1, end: 1000}, function(feature) {
                    features.push(feature);
                }, function() {
                    done();
                }, function() {
                    console.error(error);
                    done();
                });
            });
        it('store', function() {
            expect(store).toBeTruthy();
        });

        it('get bigwig values', function() {
            var f = array.filter(features, function(f) { return f.get('score')>0&&f.get('source')=="microarray_positive"; })
            var g = array.filter(features, function(f) { return f.get('score')<0&&f.get('source')=="microarray_negative"; })
            expect(f.length).toEqual(22);
            expect(g.length).toEqual(22);
        });

    });


});

