// helper function for unpacking json string
function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
}

// load data from json file supplied
d3.json('./static/data/samples.json').then( d => {

    // data
    var onePerson = {
        'value': unpack(d.samples, 'sample_values')[0],
        'id': unpack(d.samples, 'otu_ids')[0],
        'label': unpack(d.samples, 'otu_labels')[0]
    };

    // responsive charts
    var config = {responsive: true}

    // bar chart
    var barData = [{
        type: 'bar',
        orientation: 'h',
        x: onePerson.value.slice(0,10).reverse(),
        y: onePerson.id.slice(0,10).reverse().map(i => 'OTU ' + i.toString()),
        text: onePerson.label.slice(0,10).reverse(),
        marker: { color: '#0090ff' }
    }];
    
    var barLayout = {
        xaxis: { title: 'Value'},
        yaxis: { title: 'Microbe'},
        plot_bgcolor: 'lightgrey',
        paper_bgcolor: 'lightgrey',
        bargap: 0.05,
        margin: { l: 100, r: 10, b: 60, t: 10, pad: 5 }
    };
    
    Plotly.newPlot('bar', barData, barLayout, config);
      
    // scatter plot
    var bubbleData = [{
        type: 'bubble',
        mode: 'markers',
        x: onePerson.id,
        y: onePerson.value,
        text: onePerson.label,
        marker: { 
            size: onePerson.value, 
            color: onePerson.id,
            colorscale: 'Jet'
        }
    }];
    
    var bubbleLayout = {
        xaxis: { title: 'OTU ID'},
        yaxis: { title: 'Value'},
        plot_bgcolor: 'lightgrey',
        paper_bgcolor: 'lightgrey',
        margin: { l: 50, r: 10, b: 50, t: 10, pad: 5 }
    };
      
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, config);

    // info box
    var onePersonDem = d.metadata[0];
    Object.entries(onePersonDem).forEach( v => {
        d3.select('#sample-metadata')
        .append('text')
        .text(`${v[0]} : ${v[1]}`)
        .append('br');
    });

});
