import * as d3 from 'd3';

import eventDrops from '../src';
import '../src/style.css';

const newJson = require('./new.json');
const storedJson = require('./stored.json');
const alertsJson = require('./alerts.json');

const tooltip = d3
    .select('body')
    .append('div')
    .classed('tooltip', true)
    .style('opacity', 0)
    .style('pointer-events', 'auto');

const chart = eventDrops({
    d3,
    drop: {
        date: d => new Date(d.date),
        onMouseOver: (event, alert) => {
            //window.document.getElementById("debug").innerText = event
            tooltip.style('opacity', 1).style('pointer-events', 'auto');

            tooltip
                .html(
                    `
                    <div class="content">
                        <h3 class="message">${alert.memo}</h3>
                        <img src="http://10.10.10.105:81/thumbs/${alert.path}"/>
                    </div>
                `
                )
                .style('left', `${event.pageX - 30}px`)
                .style('top', `${event.pageY - 350}px`);
        },
        onMouseOut: () => {
            tooltip.style('opacity', 0).style('pointer-events', 'none');
        },
    },
    marker: {
        onSeek: date => {
            console.log('onSeek ' + date);
        },
        onSeekEnd: date => {
            console.log('onSeekEnd ' + date);
        },
    },
});

let maxDate = new Date(0);
let repositoriesData = [
    {
        name: 'alerts',
        data: alertsJson.data.map(d => {
            let date = new Date(d.date * 1000);
            if (date > maxDate) maxDate = date;
            return {
                date: date,
                memo: d.memo,
                path: d.path,
            };
        }),
    },
    {
        name: 'clips',
        data: [
            ...newJson.data.map(d => {
                let date = new Date(d.date * 1000);
                if (date > maxDate) maxDate = date;
                return {
                    date: date,
                    memo: d.file,
                    msec: d.msec,
                    path: d.path,
                    type: 'new',
                };
            }),
            ...storedJson.data.filter(d => d.path.endsWith('bvr')).map(d => {
                let date = new Date(d.date * 1000);
                if (date > maxDate) maxDate = date;
                return {
                    date: date,
                    memo: d.file,
                    msec: d.msec,
                    path: d.path,
                    type: 'stored',
                };
            }),
        ],
    },
];
let dateDiff = new Date() - maxDate;
//move dates from json files to current time for easier development
repositoriesData[0].data.forEach(
    d => (d.date = new Date(d.date.getTime() + dateDiff))
);
repositoriesData[1].data.forEach(
    d => (d.date = new Date(d.date.getTime() + dateDiff))
);
d3
    .select('#eventdrops-demo')
    .data([repositoriesData])
    .call(chart);

chart.marker.updateMarker(new Date(new Date().getTime()));

//setInterval(()=> {chart.marker.updateMarker(new Date(chart.marker.date.getTime() + 3600000));}, 1000);
