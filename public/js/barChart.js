function BarChart() {
  let width;
  let height;
  const xScale = d3.scaleBand().padding(0.5);
  const yScale = d3.scaleLinear();
  const margin = { top: 10, bottom: 20, left: 40, right: 10 };

  function my(selection) {
    selection.each(function (data) {
      const svg = d3.select(this)
        .attr('width', width)
        .attr('height', height);

      const [y, x] = Object.keys(data[0]);

      let g = svg.selectAll('g').data([1]);
      g = g.enter().append('g').merge(g)
          .attr('transform', `translate( ${margin.left} , ${margin.top} )`);

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      xScale.domain(data.map(d => d[x])).range([0, innerWidth]);
      yScale.domain([0, d3.max(data, d => d[y])]).range([innerHeight, 0]);

      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale)
                .ticks(6)
                .tickSizeOuter(0)
                .tickFormat(d3.timeFormat('%b %Y'))
              );

      g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(yScale)
                .ticks(6)
                .tickSizeInner(-innerWidth)
              )
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Frequency');

      g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', d => xScale(d[x]))
          .attr('y', d => yScale(d[y]))
          .attr('width', xScale.bandwidth())
          .attr('height', d => innerHeight - yScale(d[y]));
          // .attr('rx', xScale.bandwidth() / 2)
          // .attr('ry', xScale.bandwidth() / 2);
    });
  }

  my.width = function (_) {
    return arguments.length ? (width = _, my) : width;
  };

  my.height = function (_) {
    return arguments.length ? (height = _, my) : height;
  };

  return my;
}

function createBarChart(endpoint, element) {
  const parent =  document.getElementById(element).parentNode;
  const barChart = BarChart()
    .width(parent.offsetWidth)
    .height(parent.offsetHeight);

  d3.json(endpoint, (data) => {
    const parseDate = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
    data.forEach((d) => {
      d.date = parseDate(d.date);
      return d;
    });
    d3.select(`#${element}`)
      .datum(data)
      .call(barChart);
  });
}
