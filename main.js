//Make it responsive
var containerWidth = document.getElementById("container");
    w = parseInt(containerWidth.clientWidth);
    h = w*0.6;

var margin = { top: 0.04*w, right: 0.03*w, bottom: 0.07*w, left: 0.07*w },
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom,
    gridSize = Math.floor(width / 62),
    legendElementWidth = gridSize*3,
    buckets = 9,
		colors = ["#ffffcc","#a1dab4","#41b6c4","#2c7fb8","#253494"],        
    months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ],
    years = ["1953","1954","1955","1956","1957","1958","1959","1960",
              "1961","1962","1963","1964","1965","1966","1967","1968","1969","1970",
              "1971","1972","1973","1974","1975","1976","1977","1978","1979","1980","1981","82","83","84","1985","86","87","88","89","1990","91","92","93","94","1995","96","97","98","99","2000","01","02","03","04","2005","06","07","08","09","2010","11","12","13","14","2015"];
    datasets = ["data.csv","men.csv","women.csv"];

      var svg = d3.select("#container").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dayLabels = svg.selectAll(".dayLabel")
          .data(months)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * height/12; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 0.6 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = svg.selectAll(".timeLabel")
          .data(years)
          .enter().append("text")
            .text(function(d) { if (d%5===0){return d;} })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

      var heatmapChart = function(csvFile) {
        d3.csv(csvFile,
        function(d) {
          return {
            month: +d.month,
            year: +d.year,
            value: +d.value,
            man: +d.man,
            woman: +d.woman
          };
        },
        function(error, data) {
          var min = d3.min(data, function(d){
          			    return d.value;
          			});
          var max = d3.max(data, function(d,i){
          				return d.value;
          			});
          var colorScale = d3.scale.quantile()
              .domain([min, max])
              .range(colors);

          var cards = svg.selectAll(".hour")
              .data(data, function(d) {return d.month+':'+d.year;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d,i) { return (d.year - 1952) * gridSize - gridSize; })
              .attr("y", function(d) { return (d.month - 1) * height/12; })
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", height/12)
              .style("fill", colors[2]);

          cards.transition().delay(function(d,i){return i * 5;}).duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.on("mouseover", function(d){
          		d3.select(this)
          			.style("opacity", .3);
          		cards.on("click", function(d){
          			//Show the tooltip
				var x = d3.event.pageX - 60;
				var y = d3.event.pageY - 120;

				d3.select("#tooltip")
					.style("left", x + "px")
					.style("top", y + "px")
					.style("opacity", 1)
					.html("Year: <span>" + d.year + "</span><br/>Month: <span>" + d.month + "</span><br/>Rate: <span>" + d.value + "%</span>");
          		});
				
				})
				.on("mouseout", function(){
					d3.select(this).style("opacity", 1);
					//Hide the tooltip
					d3.select("#tooltip")
						.style("opacity", 0);
				});

          cards.select("title").text(function(d) { return d.value; });
        
          cards.exit().remove();

          var legend = svg.selectAll(".legend")
              .data([min].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", 0.843 * h )
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; })
            .attr('transform', 'translate(' + (w/3) + ',' + 0 + ')');

          legend.append("text")
            .classed("mono", true)
            .text(function(d) { return  Math.round(d) ; })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", 0.843 * (h + gridSize) )
            .attr('transform', 'translate(' + (w/3) + ',' + 5 + ')');

          legend.exit().remove();

        });  
      };

      heatmapChart(datasets[0]);
  
      d3.select("#dataset-picker").selectAll(".dataset-button")
        .data(datasets).on("click", function(d) {
          heatmapChart(d);
        });


      






