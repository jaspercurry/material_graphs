$(document).ready(function() {

		// ** datafile format **
		// Property, Unit
		// Datapoint, lowval, highval
		// Datapoint_drilldown, lowval, highval, drilldown_id
		// # drilldown_point, lowval, highval
		// # drilldown_pt2, lowval, highval
		// Datapt_2, lowval, highval
		// so forth
		function dothework (lines) {


			var this_series = { data: []};

            var error = {
                    color: 'rgba(0,0,0,0.3)',
                    name: "variation",
                    type: 'errorbar',
                    stemWidth: 29,
                    whiskerLength: 0,
                    pointPadding: 0,
                    data: [],
                    tooltip: {
	                    pointFormat: ""
                    }
                    };
            var drilldown_series= new Array();

				$.each(lines, function(lineNo, line) {
						var items = line.split(', ');
						var highval = parseFloat(items[4]);
						var lowval = parseFloat(items[2]);
						var high_reason = items[3];
						var low_reason = items[1];
						var valuepoint = highval;

						if (items.length == 5 && line.charAt(0) != '#') {
							this_series.data.push({name: items[0], y: valuepoint, highreason: high_reason, lowreason: low_reason, unit: lines[0].split(', ')[1]});
	                        error.data.push({high: highval, low: lowval});
	                    };
						if (items.length == 6) {
							this_series.data.push({name: items[0], y: valuepoint, drilldown: items[5], highreason: high_reason, lowreason: low_reason, unit: lines[0].split(', ')[1]});
							error.data.push({high: highval, low: lowval});
							decider = 0; next = lineNo+1; this_data = [];
							while (decider==0) {
								this_line=lines[next].split(', ');
								this_data.push({name: this_line[0].substring(2), y: parseFloat(this_line[4]), unit: lines[0].split(', ')[1]});
								next=next+1;
								if (lines[next].charAt(0) == '#') {decider = 0} else {decider = 1};
							};
							drilldown_series.push({id: items[5], data: this_data});
						};
	                });
	                this_series.name = lines[0].split(', ')[0];
	                this_series.colorByPoint = true;
	                this_series.pointWidth = 30;
	                var options = {
						chart: {
							renderTo: 'chartcontainer',
							type: 'column'
						},
						xAxis: {
							type: 'category'
						},
						legend: {
			                enabled: false
			            },
			            yAxis: {
				        	title:{
	                        	text: lines[0].split(', ')[1]
	                    	}},
	                    title:	 {
		                    text: lines[0].split(', ')[0]
	                    },
			            tooltip: {
				            shared: true,
			            },
						series: [],
						drilldown:{ series: []},
					};


					options.series.push(this_series);
					for (i=0; i < drilldown_series.length; i++) {
						options.drilldown.series.push(drilldown_series[i]);
					}
	                options.series.push(error);
	               // options.tooltip.push({pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f}°C</b>'});
	                // AND FINALLY
	                var chart = new Highcharts.Chart(options);

	                chart.tooltip.options.formatter = function() {
		               	var points = this.points;
			            var pointsLength = points.length;
			            var tooltipMarkup = pointsLength ? '<span style="font-size: 10px">' + points[0].key + '</span><br/>' : '';
			            var index;
			            var y_value;

			            for(index = 0; index < pointsLength; index += 2) {
			              y_value = (points[index].y);
			              highpoint = (points[index+1].point.high);
			              lowpoint = (points[index+1].point.low);
			              unit = (points[index].point.unit);
			              high_reason = (points[index].point.highreason);
			              low_reason = (points[index].point.lowreason);
						  if (highpoint == lowpoint) {
							  tooltipMarkup += '<span style="color:' + points[index].series.color + '">\u25CF</span> ' + points[index].series.name + ': <b>' + y_value  + '</b> ' + unit;
						  } else {
							  tooltipMarkup += '<span style="color:' + points[index].series.color + '">\u25CF</span> ' + points[index].series.name + ';<br /><b>' + high_reason + ':</b>' + highpoint + ' ' + unit + ', <b>' + low_reason + ':</b>  ' + lowpoint + ' ' + unit ;

						  }
			              }

			           	  return tooltipMarkup;

		            }

		            chart.tooltip.options.positioner = function (labelWidth, labelHeight, point) {
					    var tooltipX, tooltipY;
					    tooltipX = point.plotX - chart.plotLeft/2;
					    tooltipY = point.plotY + chart.plotTop - 60;
					    return {
					        x: tooltipX,
					        y: tooltipY
					    };
					}
	                /*
chart.yAxis[0].update({
		                title:{
	                        text: lines[0].split(', ')[1]
	                    }});

	                chart.setTitle({
	                        text: lines[0].split(', ')[0]
	                    });

*/

		}
		$.get('http://www.precision-ceramics.com/compressive_strength.csv', function(data) {
				// Split the lines
				var lines = data.split('\n');
				dothework(lines);
			});

		var button1 = $('#button1');
        button1.click(function () {
        $.get('http://www.precision-ceramics.com/compressive_strength.csv', function(data) {
				// Split the lines
				var lines = data.split('\n');
				dothework(lines);
			});
		});

		var button2 = $('#button2');
        button2.click(function () {
        $.get('http://www.precision-ceramics.com/density.csv', function(data) {
				// Split the lines
				var lines = data.split('\n');
				dothework(lines);

			});
		});

		var button2 = $('#button3');
        button2.click(function () {
        $.get('http://www.precision-ceramics.com/flexural_strength.csv', function(data) {
				// Split the lines
				var lines = data.split('\n');
				dothework(lines);

			});
		});

		var button4 = $('#button4');
        button4.click(function () {
        $.get('http://www.precision-ceramics.com/fracture_toughness.csv', function(data) {
				// Split the lines
				var lines = data.split('\n');
				dothework(lines);

			});
		});

		var button5 = $('#button5');
        button5.click(function () {
        $.get('http://www.precision-ceramics.com/hardness.csv', function(data) {
				// Split the lines
				var lines = data.split('\n');
				dothework(lines);

			});
		});

		var button6 = $('#button6');
        button6.click(function () {
        $.get('http://www.precision-ceramics.com/maximum_temperature.csv', function(data) {
				// Split the lines
				var lines = data.split('\n');
				dothework(lines);

			});
		});

		var button7 = $('#button7');
        button7.click(function () {
        $.get('http://www.precision-ceramics.com/thermal_conductivity.csv', function(data) {
				// Split the lines
				var lines = data.split('\n');
				dothework(lines);

			});
		});

		var button8 = $('#button8');
        button8.click(function () {
        $.get('http://www.precision-ceramics.com/thermal_expansion.csv', function(data) {
				// Split the lines
				var lines = data.split('\n');
				dothework(lines);

			});
		});



		});
