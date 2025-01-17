import defaultsDeep from 'lodash.defaultsdeep';

import markerFactory from './marker';
import markerDraw from './markerDraw';
import axis from './axis';
import { getBreakpointLabel } from './breakpoint';
import bounds from './bounds';
import defaultConfiguration from './config';
import dropLine from './dropLine';
import zoom from './zoom';

import './style.css';
import { withinRange } from './withinRange';

// do not export anything else here to keep window.eventDrops as a function
export default ({
    d3 = window.d3,
    global = window,
    ...customConfiguration
}) => {
    let markerState = {
        date: new Date(),
    };

    let range = null;
    const initChart = selection => {
        selection.selectAll('svg').remove();

        const root = selection.selectAll('svg').data(selection.data());
        root.exit().remove();

        const config = defaultsDeep(
            customConfiguration || {},
            defaultConfiguration(d3)
        );

        const {
            drops,
            zoom: zoomConfig,
            drop: { onClick, onMouseOut, onMouseOver },
            label: { width: labelWidth },
            line: { height: lineHeight },
            range: { start: rangeStart, end: rangeEnd },
            margin,
            breakpoints,
        } = config;

        if (range == null) {
            range = [rangeStart, rangeEnd];
        }
        // Follow margins conventions (https://bl.ocks.org/mbostock/3019563)
        const width = selection.node().clientWidth - margin.left - margin.right;

        const xScale = d3
            .scaleTime()
            .domain(range)
            .range([0, width - labelWidth]);

        chart._scale = xScale;
        chart.currentBreakpointLabel = getBreakpointLabel(
            breakpoints,
            global.innerWidth
        );

        const svg = root
            .enter()
            .append('svg')
            .attr('width', width)
            .classed('event-drop-chart', true);

        svg
            .merge(root)
            .attr(
                'height',
                d =>
                    (d.length + 1) * lineHeight +
                    margin.top +
                    margin.bottom +
                    10
            );

        const zoomContainer = svg
            .append('g')
            .classed('viewport', true)
            .attr('height', '30')
            .attr('width', width)
            .attr('transform', `translate(${margin.left},${margin.top})`);

        zoomContainer
            .append('rect')
            .attr('height', '30')
            .attr('width', width)
            .attr('opacity', '0')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const stampContainer = svg
            .append('g')
            .classed('timeline-pf-timestamp', true)
            .attr('height', 30)
            .attr('transform', `translate(${margin.left},${margin.top})`);

        if (zoomConfig) {
            zoomContainer.call(zoom(d3, svg, config, xScale, draw));
        }

        markerFactory(
            d3,
            svg,
            stampContainer,
            d3.timeFormat('%H:%M:%S'),
            chart,
            config,
            markerState
        );
        chart.marker = markerState;

        const viewport = svg
            .append('g')
            .classed('viewport', true)
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .call(draw(config, xScale));
    };

    const chart = selection => {
        chart._initialize = () => initChart(selection);
        chart._initialize();

        global.addEventListener('resize', chart._initialize, true);
    };

    chart.scale = () => chart._scale;
    chart.filteredData = () => chart._filteredData;
    chart.destroy = (callback = () => {}) => {
        global.removeEventListener('resize', chart._initialize, true);
        callback();
    };

    const draw = (config, scale) => selection => {
        const { drop: { date: dropDate } } = config;

        range[0] = scale.domain()[0];
        range[1] = scale.domain()[1];
        const dateBounds = scale.domain().map(d => new Date(d));
        // const filteredData = selection.data().map(dataSet => {
        //     return dataSet.map(row => {
        //         if (!row.fullData) {
        //             row.fullData = config.drops(row);
        //
        //         }
        //
        //         row.data = row.fullData.filter(d =>
        //             withinRange(dropDate(d), dateBounds)
        //         );
        //
        //         return row;
        //     });
        // });

        chart._scale = scale;
        //chart._filteredData = filteredData[0];
        //marker.updateMarker();
        selection
            .data(selection.data())
            .call(axis(d3, config, scale, chart.currentBreakpointLabel))
            .call(dropLine(config, scale, d3))
            .call(bounds(config, scale))
            .call(markerDraw(config, scale, markerState));
    };

    chart.draw = draw;

    return chart;
};
