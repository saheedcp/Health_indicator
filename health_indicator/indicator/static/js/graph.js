var trace1 = {
  x: [1, 2, 3, 4], 
  y: [10, 15, 13, 17], 
  type: 'scatter'
  
};
var trace2 = {
  x: [1, 2, 3, 4], 
  y: [16, 5, 11, 9], 
  type: 'scatter'
};
var data = [trace1, trace2];

var layout1 = {showlegend: false,
  yaxis: {rangemode: 'tozero',
          showline: true,
          zeroline: true},

};

var layout2 = {showlegend: false,
  yaxis: {rangemode: 'tozero',
          zeroline: true}
};

Plotly.newPlot('div1', data, layout1);

Plotly.newPlot('div2', data, layout2);