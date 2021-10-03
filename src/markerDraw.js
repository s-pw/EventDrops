export default (config, xScale, markerState) => selection => {
    const marker = selection.selectAll('.markerGrp').data([markerState]);

    const markerGrp = marker
        .enter()
        .append('g')
        .classed('markerGrp', true)
        .attr('transform', d => `translate(${xScale(d.date)})`);

    markerGrp
        .append('rect')
        .classed('marker', true)
        .attr('x', -1)
        .attr('y', -20)
        .attr('height', '20')
        .attr('width', '3');

    selection
        .selectAll('.markerGrp')
        .attr('transform', d => `translate(${xScale(d.date)})`);
};
