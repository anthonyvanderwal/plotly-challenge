// get data from json
d3.json('./static/data/samples.json').then( d => {

    // list of participant ids
    var ids = d.names;

    // data
    var data = {
        'value': unpack(d.samples, 'sample_values'),
        'id': unpack(d.samples, 'otu_ids'),
        'label': unpack(d.samples, 'otu_labels'),
        'demographics': d.metadata,
    };   

    // populate list of id to choose from
    idList(ids);

    // populate dropdown list with participant id
    function idList(data) {
        var dropList = d3.select('#selDataset');
        dropList.selectAll('option')
            .data(data)
            .enter()
            .append('option')
                .attr( 'value', d => d )
                .text( d => d );
    }

    // populate site with an initial set of data
    init(data.value[0], data.id[0], data.label[0], data.demographics[0]);

    // function calls on the first set of data '[0]'
    function init(value, id, label, demographics) {

        // responsive charts
        var config = {responsive: true}

        // bar chart
        var barData = [{
            type: 'bar',
            orientation: 'h',
            x: value.slice(0,10).reverse(),
            y: id.slice(0,10).reverse().map( i => 'OTU ' + i.toString() ),
            text: label.slice(0,10).reverse(),
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
        
        // bubble chart
        var bubbleData = [{
            type: 'bubble',
            mode: 'markers',
            x: id,
            y: value,
            text: label,
            marker: { 
                size: value, 
                color: id,
                colorscale: 'Jet'
            }
        }];
        var bubbleLayout = {
            xaxis: { title: 'Microbe ID'},
            yaxis: { title: 'Value'},
            plot_bgcolor: 'lightgrey',
            paper_bgcolor: 'lightgrey',
            margin: { l: 50, r: 10, b: 50, t: 10, pad: 5 }
        };
        Plotly.newPlot('bubble', bubbleData, bubbleLayout, config);

        // info panel
        Object.entries(demographics).forEach( v => {
            d3.select('#sample-metadata')
            .append('text')
            .text(`${v[0].toUpperCase()} : ${v[1]}`)
            .append('br');
        });
    }

    // listen for changes to 'select' tag and update plots/info
    d3.selectAll('#selDataset').on('change', update);    

    //  restyle plots and info box with selected id info
    function update() {
    
        var key = Object.keys(ids).find( key => ids[key] == this.value) ;
        var newId = data.id[key];
        var newValue = data.value[key];
        var newDemo = data.demographics[key];
        
        // bar chart
        Plotly.restyle('bar', 'x', [newValue.slice(0,10).reverse()]);
        Plotly.restyle('bar', 'y', [newId.slice(0,10).reverse().map( i => 'OTU ' + i.toString() )]);

        // bubble chart
        Plotly.restyle('bubble', 'x', [newId]);
        Plotly.restyle('bubble', 'y', [newValue]);

        // info panel
        d3.selectAll('#sample-metadata text').remove();
        Object.entries(newDemo).forEach( v => {
            d3.select('#sample-metadata')
            .append('text')
            .text(`${v[0].toUpperCase()} : ${v[1]}`)
            .append('br');
        });
    }

    // helper function for unpacking json string
    function unpack(rows, index) {
        return rows.map(function(row) {
            return row[index];
        });
    }

});
