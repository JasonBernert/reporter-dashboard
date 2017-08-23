function LineChart() {
  let x;
  let y;
  let width;
  let height;
  const xScale = d3.scaleTime();
  const yScale = d3.scaleLinear();
  const margin = { top: 10, bottom: 20, left: 40, right: 10 };

  function my(selection) {
    selection.each(function (data) {
      const svg = d3.select(this)
        .attr('width', width)
        .attr('height', height);

      const area = d3.area()
                     .curve(d3.curveStepAfter)
                     .x(d => xScale(d[x]))
                     .y1(d => yScale(d[y]));

      let g = svg.selectAll('g').data([1]);
      g = g.enter().append('g').merge(g)
          .attr('transform', `translate( ${margin.left} , ${margin.top} )`);

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      xScale.domain(d3.extent(data, d => d[x])).range([0, innerWidth]);
      yScale.domain([0, d3.max(data, d => d[y])]).range([innerHeight, 0]);
      area.y0(yScale(0));

      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale)
                .ticks(6)
                .tickSizeOuter(0)
              );

      g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(yScale)
                .ticks(6)
                .tickSizeInner(-innerWidth)
              );

      g.append('path')
          .datum(data)
          .attr('fill', '#ae017e')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 1.5)
          .attr('d', area);
    });
  }

  my.width = function (_) {
    return arguments.length ? (width = _, my) : width;
  };

  my.height = function (_) {
    return arguments.length ? (height = _, my) : height;
  };

  my.x = function (_) {
    return arguments.length ? (x = _, my) : x;
  };

  my.y = function (_) {
    return arguments.length ? (y = _, my) : y;
  };

  return my;
}

function createLineChart(endpoint, element, x, y) {
  const parent =  document.getElementById(element).parentNode;
  const lineChart = LineChart()
    .x(x)
    .y(y)
    .width(parent.offsetWidth)
    .height(parent.offsetHeight);

  d3.json(endpoint, (data) => {
    const parseDate = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
    data.forEach((d) => {
      d[x] = parseDate(d[x]);
      return d;
    });
    d3.select(`#${element}`)
      .datum(data)
      .call(lineChart);
  });
}
