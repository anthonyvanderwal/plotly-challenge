// get data from json
d3.json('./static/data/samples.json').then( d => {

    // list of participant ids
    var ids = d.names;

    // all relevant experiment data
    var data = {
        'value': unpack(d.samples, 'sample_values'),
        'id': unpack(d.samples, 'otu_ids'),
        'label': unpack(d.samples, 'otu_labels'),
        'demographics': d.metadata,
    };   
    
    // numercial scale for gauge chart
    var wfreqs = unpack(data.demographics, 'wfreq');
    var maxWfreq = Math.max.apply(Math, wfreqs.filter( d => { return d != null }));

    // colorscale for gauge chart
    var gaugeColor = [];
    for (i = 0; i < maxWfreq; i+= 0.1) {
        var rgbPct = i / maxWfreq;
        gaugeColor.push({ 
            range: [i, i+1], 
            color: `rgb(${(1 - rgbPct) * 255},${rgbPct * 255},0)` 
        });
    };
                
    // populate participant choice list
    idList(ids);

    // function to create options in select tag
    function idList(data) {
        var dropList = d3.select('#selDataset');
        dropList.selectAll('option')
            .data(data)
            .enter()
            .append('option')
                .attr( 'value', d => d )
                .text( d => d );
    }

    // highlight initial participant id in list
    d3.select('#selDataset').select('option').property('selected', true);

    // populate page with initial set of data
    init(data.value[0], data.id[0], data.label[0], data.demographics[0], maxWfreq);

    // function to create graphs and info-box
    function init(value, id, label, demographics, maxW) {
      
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
            .text(`${v[0]} : ${v[1]}`)
            .append('br');
        });

        // gauge
        var gaugeData = [{
            domain: { x:[0,1], y:[0,1]},
            value: demographics.wfreq,
            type: 'indicator',
            mode: 'gauge+number',
            title: { text: `Scrubs per Week | Participant: ${demographics.id}` },
            gauge: {
                axis: { range: [null, maxW] },
                bar: { color: 'black' },
                bordercolor: 'gray',
                steps: gaugeColor
            }
        }];
        var gaugeLayout = {
            plot_bgcolor: 'lightgrey',
            paper_bgcolor: 'lightgrey',
            // margin: { l: 80, r: 80, b: 0, t: 0, pad: 5 }
        };
        Plotly.newPlot('gauge', gaugeData, gaugeLayout, config);
    
    }

    // listen for changes to 'select' tag and update plots/info
    d3.selectAll('#selDataset').on('change', update);    

    //  function to restyle plots and info-box with selected participant
    function update() {
    
        // data
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
            .text(`${v[0]} : ${v[1]}`)
            .append('br');
        });

        // gauge
        Plotly.restyle('gauge', 'value', [newDemo.wfreq]);
        Plotly.restyle('gauge', 'title', [{ text: `Scrubs per Week | Participant: ${newDemo.id}` }]);

    }

    // helper function for unpacking json string
    function unpack(rows, index) {
        return rows.map(function(row) {
            return row[index];
        });
    }

});
