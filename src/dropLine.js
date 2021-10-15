export default (config, xScale, d3) => selection => {
    const {
        label: { text: labelText, padding: labelPadding, width: labelWidth },
        line: { color: lineColor, height: lineHeight },
        drop: { onClick, onMouseOver, onMouseOut },
    } = config;

    const lines = selection.selectAll('.drop-line').data(d => d);

    const g = lines
        .enter()
        .append('g')
        .classed('drop-line', true)
        .attr('fill', lineColor)
        .attr('transform', (_, index) => `translate(0, ${index * lineHeight})`);

    g
        .append('line')
        .classed('line-separator', true)
        .attr('x1', labelWidth)
        .attr('x2', '100%')
        .attr('y1', () => lineHeight)
        .attr('y2', () => lineHeight);

    const drops = g
        .append('g')
        .classed('drops', true)
        .attr('transform', () => `translate(${labelWidth}, ${lineHeight / 2})`)
        .each((d, idx, nodes) => {
            if (idx == 0) {
                d3
                    .select(nodes[idx])
                    .selectAll('.drop')
                    .data(d => d.data)
                    .enter()
                    .append('circle')
                    .classed('drop', true)
                    .on('click', onClick)
                    .on('mouseover', onMouseOver)
                    .on('mouseout', onMouseOut)
                    .attr('r', 5)
                    .attr('fill', d => {
                        const memo = d.memo;
                        if (memo.includes('person')) {
                            return d3.schemeCategory10[2];
                        } else if (memo.includes('car')) {
                            return d3.schemeCategory10[0];
                        } else if (memo.includes('truck')) {
                            return d3.schemeCategory10[3];
                        }
                        return d3.schemeCategory10[7];
                    })
                    .attr('cx', d => xScale(d.date));
            } else {
                d3
                    .select(nodes[idx])
                    .selectAll('.clip')
                    .data(d => d.data)
                    .enter()
                    .append('rect')
                    .classed('clip', true)
                    .on('click', onClick)
                    .on('mouseover', onMouseOver)
                    .on('mouseout', onMouseOut)
                    .on('touchmove', onMouseOver)
                    .on('touchend', onMouseOut)
                    .attr('height', 3)
                    .attr('fill', d => {
                        if (d.type === 'new') {
                            return d3.schemeCategory10[2];
                        } else {
                            return d3.schemeCategory10[8];
                        }
                    })
                    .attr('y', '-9')
                    .attr('x', d => xScale(d.date))
                    .attr(
                        'width',
                        d =>
                            xScale(new Date(d.date.getTime() + d.msec)) -
                            xScale(d.date)
                    );
            }
        });

    lines.selectAll('.line-label').text(labelText);

    selection.selectAll('.drop').attr('cx', d => xScale(d.date));
    selection
        .selectAll('.clip')
        .attr('x', d => xScale(d.date))
        .attr(
            'width',
            d => xScale(new Date(d.date.getTime() + d.msec)) - xScale(d.date)
        );

    lines.exit().remove();
};
