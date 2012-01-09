/** 
 * Version 1.0, Jan 2012
 */
var Markit = {};
/**
 * Define the TimeseriesService.
 * First argument is symbol (string) for the quote. Examples: AAPL, MSFT, JNJ, GOOG.
 * Second argument is duration (int) for how many days of history to retrieve.
 * Third argument is fCallback, a callback function executed onSuccess of API.
 */
Markit.TimeseriesService = function(symbol,duration,fCallback){
    this.symbol = symbol;
    this.duration = duration;
    this.fCallback = fCallback;
    this.PlotChart();
};

Markit.TimeseriesService.prototype.PlotChart = function(){
    
    //Make JSON request for timeseries data
    $.ajax({
        beforeSend:function(){
            $("#chartDemoContainer").text("Loading chart...");
        },
        data: { 
            symbol: this.symbol, 
            duration: this.duration 
        },
        url: "http://jobs.markitondemand.com/Api/Timeseries/jsonp",
        dataType: "jsonp",
        context: this,
        success: function(json){
            this.BuildDataAndChart(json);
        },
        error: function(){
            alert("Couldn't generate chart.");
        }
    });
};

Markit.TimeseriesService.prototype.BuildDataAndChart = function(json){
    var dateDS = json.Data.SeriesDates,
        closeDS = json.Data.Series.close.values,
        openDS = json.Data.Series.open.values,
        closeDSLen = closeDS.length,
        irregularIntervalDS = [];
	
    //Build array of arrays of date & price values
    //Market data is inherently irregular 
    //and HighCharts likes regularity (for axis intervals)
    for (var i=0; i<closeDSLen;i++){
        var dat = new Date(dateDS[i]);
        var dateIn = Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
        var val = closeDS[i];
        irregularIntervalDS.push([dateIn,val]);	
    }
	
    //set dataset and chart label
    this.oChartOptions.series[0].data = irregularIntervalDS;
    this.oChartOptions.title.text = "Price History of " + json.Data.Name + " (1 year)";
    
    //init chart
    new Highcharts.Chart(this.oChartOptions);
};

//Define the HighCharts options
Markit.TimeseriesService.prototype.oChartOptions = {
	chart: {
		renderTo: 'chartDemoContainer'
	},
	title:{},
	subtitle: {
		text: 'Source: Thomson Reuters DataScope / Markit On Demand'
	},
	xAxis: {
		type: 'datetime'
	},
	yAxis: [{ // left y axis
		title: {
			text: null
		},
		labels: {
			align: 'left',
			x: 3,
			y: 16,
			formatter: function() {
				return Highcharts.numberFormat(this.value, 0);
			}
		},
		showFirstLabel: false
	}, { // right y axis
		linkedTo: 0,
		gridLineWidth: 0,
		opposite: true,
		title: {
			text: null
		},
		labels: {
			align: 'right',
			x: -3,
			y: 16,
			formatter: function() {
				return Highcharts.numberFormat(this.value, 0);
			}
		},
		showFirstLabel: false
	}],
	tooltip: {
		shared: true,
		crosshairs: true
	},
	plotOptions: {
		series: {
			marker: {
				lineWidth: 1
			}
		}
	},
	series: [{
		name: "Close price",
		lineWidth: 2,
		marker: {
			radius: 0
		}
	}]
	//,credits:{ enabled:false },
};

new Markit.TimeseriesService("GOOG", 365);

/**
* Need help? Visit the API documentation at:
* http://jobs.markitondemand.com/MarketDataApi
*/