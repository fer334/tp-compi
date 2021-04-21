var w = 800;
var h = 450;
var margin = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20,
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var svg = d3
  .select("body")
  .append("svg")
  .attr("id", "chart")
  .attr("height", h)
  .attr("width", w);

var linkScale = d3.scale.linear().range([0.25, 1.0]);

var colorScale = d3.scale.category20();

var makeGraph = function (nodes, links) {
  // var nodes={}

  let id = 0;
  links.forEach(function (link) {
    link.source =
      nodes[link.source] || (nodes[link.source] = { name: link.source });
    link.target =
      nodes[link.target] || (nodes[link.target] = { name: link.target });
    link.value = +link.value;
    link.id = "link-" + id++;
  });

  // console.log(JSON.stringify(nodes));

  linkScale.domain(
    d3.extent(links, function (d) {
      return d.value;
    })
  );

  var force = d3.layout
    .force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(200)
    .charge(-300)
    .on("tick", tick)
    .start().on("end", function() {
        d3.selectAll(".node").each(function(d){
            d.fixed=true;
        });
    });
    

  var endMark = svg
    .append("svg:defs")
    .selectAll("marker")
    .data(["end"])
    .enter()
    .append("svg:marker")
    .attr("id", function (d) {
      return d;
    })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 29)
    .attr("refY", -1)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

  var startMark = svg
    .append("svg:defs")
    .selectAll("marker")
    .data(["start"])
    .enter()
    .append("svg:marker")
    .attr("id", function (d) {
      return d;
    })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 28)
    .attr("refY", -8)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M 0 -5 L 10 -4 L 2 3");

  var path = svg
    .append("svg:g")
    .selectAll("path")
    .data(force.links())
    .enter()
    .append("svg:path")
    .classed("link", true)
    // aligns the text at the middle of the path (only with text-anchor=middle)
    .attr("startOffset", "50%")
    .attr("id", function (d) {
      return d.id;
    });

  var linkText = svg
    .append("svg:g")
    .selectAll(".link-label")
    .data(force.links())
    var linkTextPath= linkText
    .enter()
    .append("svg:text")
    .attr("text-anchor", "middle")
    .attr("class", "link-label")
    .append("svg:textPath")
    // aligns the text at the middle of the path (only with text-anchor=middle)
    .attr("startOffset", "50%")
    // attach this label to the correct path using its id
    .attr("xlink:href", function (d) {
      return "#" + d.id;
    })
    .text(function (d) {
      return d.label;
    });
  // .append('svg:text')
  // .classed('link-label',true)
  // .selectAll('.link-label')
  // .append('svg:textPath')
  // .attr('class', 'link-label')
  // .attr('text-anchor', 'middle')
  // // aligns the text at the middle of the path (only with text-anchor=middle)
  // .attr('startOffset', '50%')
  // // attach this label to the correct path using its id
  // .attr('xlink:href', function (d) {
  //     return '#' + d.id;
  // })
  // .text(function (d) {
  //     return 'd.label';
  // });

  var node = svg
    .selectAll(".node")
    .data(force.nodes())
    .enter()
    .append("g")
    .classed("node", true)
    // .on("click", click)
    // .on("dblclick", dblclick)
    .call(force.drag());

  node
    .append("circle")
    .attr("r", 16)
    .style("fill", function (d) {
      return colorScale(d.name);
    });

  node
    .append("text")
    .attr("x", -3)
    .attr("dy", ".35em")
    .text(function (d) {
      return d.name;
    });

  function tick() {
    path.attr("marker-end", (d) => {
      if (d.source.x === d.target.x && d.source.y === d.target.y) return "";
      else return "url(#end)";
    });
    path.attr("marker-start", (d) => {
      if (d.source.x === d.target.x && d.source.y === d.target.y)
        return "url(#start)";
      else return;
    });

    var autoLinks=[]
    path.attr("d", function (d) {
      var x1 = d.source.x,
        y1 = d.source.y,
        x2 = d.target.x,
        y2 = d.target.y,
        dx = x2 - x1,
        dy = y2 - y1,
        dr = Math.sqrt(dx * dx + dy * dy),
        // Defaults for normal edge.
        drx = dr,
        dry = dr,
        xRotation = 0, // degrees
        largeArc = 0, // 1 or 0
        sweep = 1; // 1 or 0

      // Self edge.
      if (x1 === x2 && y1 === y2) {
        const a=autoLinks.filter(x=>x.x==x1)
        if(a.length==0){
            // Make drx and dry different to get an ellipse
            // instead of a circle.
            drx = 20;
            dry = 30;
            autoLinks.push({x:x1})
        }else{
            drx= 20 +a.length*10
            dry= 30 +a.length*10
            autoLinks.push({x:x1})

        }
        // Fiddle with this angle to get loop oriented.
        xRotation = 135;

        // Needs to be 1.
        largeArc = 1;

        // Change sweep to change orientation of loop.
        sweep = 1;


        // For whatever reason the arc collapses to a point if the beginning
        // and ending points of the arc are the same, so kludge it.
        x2 = x2 + 1;
        y2 = y2 + 1;
      }

      return(x2>x1)
            ?
            "M" +
            x1 +
            "," +
            y1 +
            "A" +
            drx +
            "," +
            dry +
            " " +
            xRotation +
            "," +
            largeArc +
            "," +
            sweep +
            " " +
            x2 +
            "," +
            y2
            :
            "M" +
            x1 +
            "," +
            y1 +
            "A" +
            drx +
            "," +
            dry +
            " " +
            xRotation +
            "," +
            largeArc +
            "," +
            1 +
            " " +
            x2 +
            "," +
            y2
       
    });

    node.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
    
  }

  // function click() {
  //     d3.select(this).select("text").transition()
  //             .duration(750)
  //             .attr("x", 22)
  //             .style("fill", "steelblue")
  //             .style("stroke", "lightsteelblue")
  //             .style("stroke-width", ".5px")
  //             .style("font", "20px sans-serif");

  //     d3.select(this).select("circle").transition()
  //             .duration(750)
  //             .attr("r", 16);
  // }

  // function dblclick() {
  //     d3.select(this).select("text").transition()
  //             .duration(750)
  //             .attr("x", 12)
  //             .style("fill", "black")
  //             .style("stroke", "none")
  //             .style("stroke-width", "none")
  //             .style("font", "10px sans-serif");

  //     d3.select(this).select("circle").transition()
  //             .duration(750)
  //             .attr("r", 6);
  // }
};

export default makeGraph