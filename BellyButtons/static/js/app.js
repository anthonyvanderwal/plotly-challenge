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
    onePerson10.id = onePerson10.id.map(i => 'OTU ' + i.toString());

    var barData = [{
        type: 'bar',
        orientation: 'h',
        x: onePerson10.value,
        y: onePerson10.id,
        text: onePerson10.label
    }];
    
    var barLayout = {
          barmode: 'group'
    };
    
    Plotly.newPlot('bar', barData, barLayout);
      
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
    };
      
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // info box


});
