export default (
    d3,
    gridContainer,
    stampContainer,
    dateFormat,
    chart,
    config
) => {
    let markerState = {
        date: new Date(),
    };

    const { marker: { onSeek: onSeek, onSeekEnd: onSeekEnd } } = config;

    gridContainer
        .on('mouseover', function() {
            //marker.style("display", null);
            timeStamp.style('display', null);
            timeBox.style('display', null);
        })
        .on('mouseout', function() {
            //marker.style("display", "none");
            timeStamp.style('display', 'none');
            timeBox.style('display', 'none');
        })
        .on('mousemove', moveMarker)
        .on('mousedown', startDrag)
        .on('mouseup', stopDrag)
        .on('touchmove', moveMarker)
        .on('touchstart', startDrag)
        .on('touchend', stopDrag);

    function startDrag(event) {
        markerState.isDragging = true;
        moveMarker(event, true);
    }

    function stopDrag() {
        markerState.isDragging = false;
        onSeekEnd(markerState.date);
    }
    //
    // let marker = gridContainer.append('rect')
    //     .classed('marker', true)
    //     .attr('x', -1)
    //     .attr('y', 0)
    //     .attr('height', '20')
    //     .attr('width', '3');

    const domain = chart._scale.domain();

    let timeBox = stampContainer
        .append('rect')
        .attr('height', '13')
        .attr('width', '50')
        .style('display', 'none');

    let timeStamp = stampContainer
        .append('text')
        .text(dateFormat(domain[1]))
        .attr('transform', `translate(${chart._scale.range()[1]})`)
        .attr('text-anchor', 'middle');

    function moveMarker(event) {
        if (markerState.isDragging) {
            const date = chart._scale.invert(d3.pointers(event)[0][0]);
            onSeek(date);
            updateMarker(date);
        }
        event.preventDefault();
        return false;
    }
    function updateMarker(date) {
        markerState.date = date;
        const pos = chart._scale(date);
        timeBox.attr('transform', `translate(${pos - 25}, -30)`);
        timeStamp
            .attr('transform', `translate(${pos}, -19)`)
            .text(dateFormat(date));

        gridContainer
            .selectAll('.markerGrp')
            .data([markerState])
            .attr('transform', d => `translate(${pos})`);
    }
    markerState.updateMarker = updateMarker;

    return markerState;
};
