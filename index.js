// graph components
var bp_chart = d3.select("#bipartite");
var rl = d3.select('#related')
var rt = d3.select('#rating');

// default data
var search_index = 1712; // 預設為 Fight Club 這部電影
var search_words = "Fight Club"; 

// metadata
var rate_color = ["#00EC00", "#00CACA", "#0080FF", "#B15BFF", "#FF5151"];
var color_index = ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6", "#FFDD00", "#9393FF", "#FF7575", "#003060"];
var rate_index = [1, 2, 3, 4, 5];
var bp = viz.bP()

console.log(d3.select('#bipartite').node().getBoundingClientRect().width);
console.log(movie);

// graph---------------------------------------------------------------

function bipartite(n) {
	const width = d3.select('#bipartite').node().getBoundingClientRect().width, height = 1200;
	const padding = { top: 0, right: 240, bottom: 0, left: 256 }

	var color = {};

	let i = 0;
	for (let index = 0; index < eval("data" + n).length; index++) {
		if (eval("data" + n)[index][0] == eval("data" + n)[index][1]) {
			color[eval("data" + n)[index][0]] = color_index[i];
			i += 1;
		}
	}
	console.log("bp2 color: ", color);

	// remove old g and append a new one
	bp_chart.select('g').remove()
	var g = bp_chart.append('g').attr('transform', `translate(${padding.left},0)`);

	bp.duration(1000)
		.data(eval("data" + n))
		.min(12)
		.pad(0.5)
		.height(height)
		.width(width - padding.left - padding.right)
		.barSize(25)
		.sortPrimary(sortP(n))
		.sortSecondary(sortS(n))
		.fill(d => color[d.primary]);

	g.call(bp);
	g.selectAll(".mainBars")
		.on("mouseover", mouseover)
		.on("mouseout", mouseout)

	
	g.selectAll(".mainBars").append("text")
		.attr("x", d => (d.part == "primary" ? -60 : 30))
		.attr("y", d => +6)
		.text(function (d, i) {
			if (d.part == "primary") {
				if (d.key.length > 30) {
					return d.key.substr(0, d.key.length / 2);
				}
				else {
					return d.key;
				}
			}
			else {
				return truncateString(d.key, 30);
			}
		})
		.attr("text-anchor", d => (d.part == "primary" ? "end" : "start"))
		.attr("font-size", d => d.part == "primary" ? "1rem" : "");
	
	g.selectAll(".mainBars").append("text")
		.attr("x", d => (d.part == "primary" ? -60 : 30))
		.attr("y", d => +25)
		.text(function (d, i) {
			if (d.part == "primary") {
				if (d.key.length > 30) {
					return d.key.substr(d.key.length / 2);
				}
				else {
					return;
				}
			}
			else {
				return;
			}
		})
		.attr("text-anchor", d => (d.part == "primary" ? "end" : "start"))
		.attr("font-size", d => d.part == "primary" ? "1rem" : "");

	g.selectAll(".mainBars").append("text").attr("class", "perc")
		.attr("x", d => (d.part == "primary" ? -15 : 225))
		.attr("y", d => +6)
		.text(function (d) { return d3.format("0.0%")(d.percent) })
		.attr("text-anchor", d => (d.part == "primary" ? "end" : "start"));
}

function rating(n) {
	const width = d3.select('#rating').node().getBoundingClientRect().width, height = width * 0.65;
	const padding = {top: 0, right: 0, bottom: 25, left: 45}

	// set svg size
	rt.attr('height', height)

	// remove old g and append a new one
	rt.select('g').remove()
	var g = rt.append('g').attr("transform", `translate(${padding.left},0)`);

	// x axis
	var x = d3.scaleBand()
		.range([0, width - padding.left - padding.right])
		.domain([1, 2, 3, 4, 5])
		.padding(0.2);
	
	g.append("g")
		.attr("transform", `translate(0,${height - padding.bottom})`)
		.call(d3.axisBottom(x))
		.selectAll("text")
		.attr("transform", "translate(2.5,0)")
		.style("text-anchor", "end");
	
	// y axis
	var y = d3.scaleLinear()
		.domain([0, Math.max.apply(null, eval("movie_rate" + n)) + 100]) //自動調整y軸domain
		.range([height - padding.bottom, padding.top]);

	g.append("g")
		.call(d3.axisLeft(y));

	g.selectAll("mybar")
		.data(eval("movie_rate" + n))
		.enter()
		.append("rect")
		.attr("x", (_, i) => x(rate_index[i]))
		.attr("y", (_, i) => y(eval("movie_rate" + n)[i]))
		.attr("width", x.bandwidth())
		.attr("height", (_, i) => height - padding.bottom - y(eval("movie_rate" + n)[i]))
		.attr("fill", (_, i) => rate_color[i])
		.on("mouseover", function () {
			d3.select(this).style("opacity", 0.6)
		})
		.on("mouseout", function () {
			d3.select(this).style("opacity", 1)
		})

	avg_rate = 0;

	for (let index = 0; index < 5; index++) {
		avg_rate = avg_rate + eval("movie_rate" + n)[index] * (index + 1);
		if (index == 4) {
			avg_rate = avg_rate / (eval("movie_rate" + n).reduce((a, b) => a + b, 0));
			console.log((eval("movie_rate" + n).reduce((a, b) => a + b, 0)));
		}
	}

	console.log((eval("movie_rate" + n)));

	d3.select('#rating-ave')
		.text(Math.round(avg_rate * 100) / 100)
	
	d3.select('#rating-views')
		.text(eval("movie_rate" + n).reduce((a, b) => a + b, 0))
}

// actions-------------------------------------------------------------

// 在Google搜尋 片名+Movie
function searchGoogle() {
	var link = `https://www.google.com/search?q=${search_words}+movie`;
	return window.open(link, config = 'height=500,width=500');
}

// 更新左上角的電影資訊
function updateMetadata(n) {
	d3.select('#metadata-title')
		.text(eval("movie_info" + n)[0]);
	d3.select('#metadata-director')
		.text(`by ${eval("movie_info" + n)[5]}`);
	d3.select('#metadata-country')
		.text(eval("movie_info" + n)[4]);
	d3.select('#metadata-year')
		.text(eval("movie_info" + n)[1]);
	d3.select('#metadata-genre')
		.text(eval("movie_info" + n)[2]);
	d3.select('#metadata-duration')
		.text(`${eval("movie_info" + n)[3]} min.`);
	d3.select('#metadata-cast')
		.text(`Cast: ${eval("movie_info" + n)[6]}`);
	d3.select('#metadata-desc')
		.text(eval("movie_info" + n)[7]);
}

function updateTable(n) {
	var list = rl.select('tbody')

	list.selectAll('tr')
		.remove();

	var tr = list.selectAll('tr')
		.data(eval('tabledata' + n))
		.enter()
		.append('tr')
		.on('mouseover', function() {
			d3.select(this)
				.attr('class', 'table-primary');
		})
		.on('mouseout', function() {
			d3.select(this)
				.attr('class', '');
		})
	
	tr.append('th')
		.attr('scope', 'row')
		.text(d => d['Related 10 Movies'])

	tr.append('td')
		.text(d => d['Pearson\'s R'])
}

// search and update data
function updateData() {
	// 抓取搜尋字串並比對字串所對應到的index
	const wordsElement = document.getElementById("search_words");
	search_words = wordsElement.value;
	console.log("search_words= " + search_words);
	for (let index = 0; index < movie.length; index++) {
		if (search_words == movie[index]) {
			search_index = index;
			break;
		}
		else if (search_words != movie[index] && index == movie.length - 1) {
			alert("Cannot find this movie in database!");
		}
	}

	// redraw graph and refresh texts------------------------------------

	bipartite(search_index);
	rating(search_index);
	updateMetadata(search_index);
	updateTable(search_index);
}

// helpers-------------------------------------------------------------

// sort primary part of bipartite
function sortP(n) {
	var sortOrder = [];
	for (let i = 0; i < eval("data" + n).length; i++) {
		if (eval("data" + n)[i][0] == eval("data" + n)[i][1]) {
			sortOrder.push(eval("data" + n)[i][0])
		}
	}
	return function (a, b) { return d3.ascending(sortOrder.indexOf(a), sortOrder.indexOf(b)) }
}

// sort secondary part of bipartite
function sortS(n) {
	var sortOrder = [];
	for (let i = 0; i < eval("data" + n).length; i++) {
		sortOrder.push(eval("data" + n)[i][1])
	}
	return function (a, b) { return d3.ascending(sortOrder.indexOf(a), sortOrder.indexOf(b)) }
}

// 縮短片名長度
function truncateString(str, num) {
	// If the length of str is less than or equal to num
	// just return str--don't truncate it.
	if (str.length <= num) {
		return str
	}
	// Return str truncated with '...' concatenated to the end of str.
	return str.slice(0, num) + '...'
}

function mouseover(d) {
	bp.mouseover(d);
	g.selectAll(".mainBars")
		.select(".perc")
		.text(function (d) { return d3.format("0.0%")(d.percent) })
}

function mouseout(d) {
	bp.mouseout(d);
	g.selectAll(".mainBars")
		.select(".perc")
		.text(function (d) { return d3.format("0.0%")(d.percent) })
}

// main block----------------------------------------------------------

bipartite(search_index);
rating(search_index);

updateMetadata(search_index);
updateTable(search_index);
