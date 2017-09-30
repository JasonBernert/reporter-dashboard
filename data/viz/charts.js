const d3 = require('d3');
const jsdom = require('jsdom');
const util = require('util');

const { JSDOM } = jsdom;

exports.test = () => {
  const dom = new JSDOM('<!DOCTYPE html><html></html><body></body>');
  const body = d3.select(dom.window.document.body);
  console.log(util.inspect(body, true, 3));
  // console.log(svg);
  // return svg;
};

function BarChart() {
  let x;
  let y;
  let width;
  let height;
  const xScale = d3.scaleBand().padding(0.5);
  const yScale = d3.scaleLinear();
  const margin = { top: 15, bottom: 20, left: 10, right: 10 };

  function my(selection) {
    selection.each(function (data) {
      const svg = d3.select(this)
        .attr('width', width)
        .attr('height', height);

      const addCommas = d3.format(',');
      const maxLabelLength = addCommas(d3.max(data, d => d[y])).toString().length;
      margin.left += maxLabelLength * 7;

      let g = svg.selectAll('g').data([1]);
      g = g.enter().append('g').merge(g)
          .attr('transform', `translate( ${margin.left} , ${margin.top} )`);

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      xScale.domain(data.map(d => d[x])).range([0, innerWidth]);
      yScale.domain([0, d3.max(data, d => d[y])]).range([innerHeight, 0]);

      const dateRange = data.map(d => d[x]);
      // 64800000 = a day and a half in  milliseconds
      const tickFormat = dateRange[dateRange.length - 1] - dateRange[0] < 64800000 ? '%H:%M' : '%a';

      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale)
                .ticks(6)
                .tickSizeOuter(0)
                .tickFormat(d3.timeFormat(tickFormat))
             );

      g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(yScale).tickSizeInner(-innerWidth).ticks(3));

      g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', d => xScale(d[x]))
          .attr('y', d => yScale(d[y]))
          .attr('width', xScale.bandwidth())
          .attr('height', d => innerHeight - yScale(d[y]));
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


exports.createBarChart = () => {
  // const document = new Document();
  // const svg = dom.window.document.querySelector('svg');
  // console.log(svg);
  // const svg = d3.select(document.body).append('svg');
  return '<g></g>';

  // const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>');
  // console.log(dom.window.document.querySelector('p').textContent); // "Hello world"

  // const parent =  document.getElementById(element).parentNode;
  // console.log(parent);
  // const barChart = BarChart()
  //   .x(x)
  //   .y(y)
  //   .width(parent.offsetWidth)
  //   .height(parent.offsetHeight);

  // d3.json(endpoint, (data) => {
  //   const parseDate = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
  //   data.forEach((d) => {
  //     d[x] = parseDate(d[x]);
  //     d[y] = +d[y];
  //     return d;
  //   });
  //   d3.select(`#${element}`)
  //     .datum(data)
  //     .call(barChart);
  // });
};

// function createBarChart(endpoint, element, x, y) {
//   const parent =  document.getElementById(element).parentNode;
//   const barChart = BarChart()
//     .x(x)
//     .y(y)
//     .width(parent.offsetWidth)
//     .height(parent.offsetHeight);
//
//   d3.json(endpoint, (data) => {
//     const parseDate = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
//     data.forEach((d) => {
//       d[x] = parseDate(d[x]);
//       d[y] = +d[y];
//       return d;
//     });
//     d3.select(`#${element}`)
//       .datum(data)
//       .call(barChart);
//   });
// }
