//Whole D3 scripting part

//Define tooltip
const tooltip = document.getElementById('tooltip');

// Fetching JSON data
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(res => res.json())
    .then(res => {
        const {
            data
        } = res;

        createSvg(data);
    })


function createSvg(data) {
    // ['1947-01-01', 243.1] with quarterly data for months 01, 04, 07, 10
    const dataset = data.map(d => [d[0], d[1]])

    //array of gdp only same index
    const gdpArr = dataset.map(d => [d[1]])

    //GDP values from flatten array
    const minGdp = d3.min(gdpArr.flat());
    const maxGdp = d3.max(gdpArr.flat());

    // Create an SVG with height, width and padding property
    const width = 900;
    const height = 500;

    //Padding 
    const padding = {
        top: 20,
        right: 30,
        bottom: 30,
        left: 50
    };

    //Actual bar chart area inside SVG element
    const chartArea = {
        'width': width - padding.left - padding.right,
        'height': height - padding.top - padding.bottom
    };

    //SVG creation
    const svg = d3.select('#container').append('svg')
        .attr('width', width)
        .attr('height', height);

    //Bar width
    const barWidth = chartArea.width / dataset.length;

    //Legends Y-Axis
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -350)
        .attr('y', 80)
        .text('Gross Domestic Product (in Billions)');

    //Legends X-Axis
    svg.append('text')
        .attr('transform', 0)
        .attr('x', 445)
        .attr('y', 498)
        .text('Year');

    //Y-Scale
    const yScale = d3.scaleLinear()
        .domain([0, maxGdp])
        .range([chartArea.height, 0]);

    //X-Scale
    const xScale = d3.scaleTime()
        .domain([d3.min(dataset, d => new Date(d[0])), d3.max(dataset, d => new Date(d[0]))])
        .range([0, chartArea.width]);

    //Y-Axis
    const yAxis = svg.append('g')
        .classed('yAxis', true)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        .call(d3.axisLeft(yScale));

    //X-Axis
    const xAxis = svg.append('g')
        .classed('xAxis', true)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(' + padding.left + ',' + (chartArea.height + padding.top) + ')')
        .call(d3.axisBottom(xScale));

    //Manipulate data to create rect bars
    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('x', (d, i) => padding.left + xScale(new Date(d[0])))
        .attr('y', (d, i) => padding.top + yScale(d[1]))
        .attr('width', barWidth)
        .attr('height', (d, i) => chartArea.height - yScale(d[1]))
        .on('mouseover', (d, i) => {
            tooltip.classList.add('show');

            tooltip.style.left = i * barWidth + (padding.left) + 'px';
            tooltip.style.top = chartArea.height - (padding.top * 2 + padding.bottom * 2) + 'px';
            tooltip.setAttribute('data-date', d[0])

            tooltip.innerHTML = `
              ${d[0]} <br>
              $${d[1]} billions
            `;
        })
        .on('mouseout', () => {
            tooltip.classList.remove('show');
        });

}
