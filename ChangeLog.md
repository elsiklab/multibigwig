# Version 0.6.0

- Fix global and local autoscaling
- Fix mouseover tooltip bug from 0.5.0
- Make colorizeAbout append to about box instead of replace contents

# Version 0.5.0

- Remove TooltipDialog class
- Add example of tooltips without labels

# Version 0.4.0

- Fix missing randomizeColors option
- Add clickTooltips option for click instead of mouseover tooltips
- Make lines more continuous around block boundaries

# Version 0.3.0

- Add randomizeColors option
- Add basic travis-ci testing
- Allow specifying "nonCont" attribute on urlTemplates to use "dotted" instead of continuous lines. Thanks to @keiranmraine for contributing
- Fix plotting negative values from BigWigs in continuous mode. Thanks again to @keiranmraine for reporting
- Add ability to specify labelWidth to keep a consistent width on subtrack labels. Thanks to @carrere for reporting

# Version 0.2.0

- Calculate global and local stats so that autoscale global/local work
- Add new track type called MultiXYPlot to render multiple BigWigs

# Version 0.1.0

- Allow specifying a list of BigWig to render in a single track called MultiDensity
- Allow specifying tooltips or labels to display over the "subtracks"
- Fix some bugs so that rendering happens properly when page is loaded
