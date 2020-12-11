// helper function for unpacking json string
function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
}

// load data from json file supplied
d3.json('./static/data/samples.json').then( d => {

    // console.log(unpack(d.samples, 'sample_values')[0]); 
    // console.log(unpack(d.samples, 'otu_ids')[0]); 
    // console.log(unpack(d.samples, 'otu_labels')[0]); 

    // bar chart
    var onePerson10 = {
        'value': unpack(d.samples, 'sample_values')[0].slice(0,10).reverse(),
        'id': unpack(d.samples, 'otu_ids')[0].slice(0,10).reverse(),
        'label': unpack(d.samples, 'otu_labels')[0].slice(0,10).reverse()
    };
    var barColor = onePerson10.id;
    onePerson10.id = onePerson10.id.map(i => 'OTU ' + i.toString());
    
    var barData = [{
        type: 'bar',
        orientation: 'h',
        x: onePerson10.value,
        y: onePerson10.id,
        text: onePerson10.label,
        marker: { color: '#0090ff' }
    }];
    
    var barLayout = {
          barmode: 'group',
          xaxis: { title: 'Value'},
          plot_bgcolor: 'lightgrey',
          paper_bgcolor: 'lightgrey',
          margin: {
            l: 100,
            r: 10,
            b: 60,
            t: 10,
            pad: 5
          }
    };
    
    var config = {responsive: true}

    Plotly.newPlot('bar', barData, barLayout, config);
      
    // scatter plot
    var onePersonAll = {
        'value': unpack(d.samples, 'sample_values')[0],
        'id': unpack(d.samples, 'otu_ids')[0],
        'label': unpack(d.samples, 'otu_labels')[0]
    };

    var bubbleData = [{
        type: 'bubble',
        mode: 'markers',
        x: onePersonAll.id,
        y: onePersonAll.value,
        text: onePersonAll.label,
        marker: { 
            size: onePersonAll.value, 
            color: onePersonAll.id,
            colorscale: 'Jet'
        }

    }];
    
    var bubbleLayout = {
        xaxis: { title: 'OTU ID'},
        yaxis: { title: 'Value'},
        plot_bgcolor: 'lightgrey',
        paper_bgcolor: 'lightgrey',
        margin: {
          l: 100,
          r: 10,
          b: 50,
          t: 10,
          pad: 5
        }
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
