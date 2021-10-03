import enLocale from 'd3-time-format/locale/en-US.json';

export default d3 => ({
    locale: enLocale,
    bound: {
        format: d3.timeFormat('%d %B %Y'),
    },
    axis: {
        formats: {
            milliseconds: '%L',
            seconds: ':%S',
            minutes: '%I:%M',
            hours: '%I %p',
            days: '%a %d',
            weeks: '%b %d',
            months: '%B',
            year: '%Y',
        },
        verticalGrid: false,
        tickPadding: 6,
    },
    drops: row => row.data,
    drop: {
        color: null,
        radius: 5,
        onClick: () => {},
        onMouseOver: () => {},
        onMouseOut: () => {},
    },
    marker: {
        onSeek: () => {},
        onSeekEnd: () => {},
    },
    label: {
        padding: 0,
        width: 0,
    },
    line: {
        color: (_, index) => d3.schemeCategory10[index],
        height: 20,
    },
    margin: {
        top: 30,
        right: 0,
        bottom: 0,
        left: 0,
    },
    range: {
        start: new Date(new Date().getTime() - 1000 * 3600 * 1),
        end: new Date(new Date().getTime() + 1000 * 3600 * 1),
    },
    zoom: {
        onZoomStart: null,
        onZoom: null,
        onZoomEnd: null,
        minimumScale: 0,
        maximumScale: Infinity,
    },
    numberDisplayedTicks: {
        small: 3,
        medium: 5,
        large: 7,
        extra: 12,
    },
    breakpoints: {
        small: 576,
        medium: 768,
        large: 992,
        extra: 1200,
    },
});
