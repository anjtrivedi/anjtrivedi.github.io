    let apikey = ""
    // if you want to execute this application more than twice per day, supply an API key below and uncomment the line
    apikey = "?registrationkey="

    let response = 0
    const SUPER_SECTOR = {
      '00': 'Total nonfarm',
      '05': 'Total private',
      '06': 'Goods-producing',
      '07': 'Service-providing',
      '08': 'Private service-providing',
      '10': 'Mining and logging',
      '20': 'Construction',
      '30': 'Manufacturing',
      '31': 'Durable Goods',
      '32': 'Nondurable Goods',
      '40': 'Trade, transportation, and utilities',
      '41': 'Wholesale trade',
      '42': 'Retail trade',
      '43': 'Transportation and warehousing',
      '44': 'Utilities',
      '50': 'Information',
      '55': 'Financial activities',
      '60': 'Professional and business services',
      '65': 'Education and health services',
      '70': 'Leisure and hospitality',
      '80': 'Other services',
      '90': 'Government'

    };
    
    let SUPER_SECTOR_keys = Object.keys(SUPER_SECTOR)

// These are colors from chart.js utils
    const CHART_COLORS = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(201, 203, 207)',
      darkpurple: 'rgb(102,0,0)',
      darkblue: 'rgb(0, 51, 153)',
      darkred: 'rgb(128, 0, 0)',
      darkgreen: 'rgb(0, 51, 0)',
      darkorange: 'rgb(255, 192, 0',
      navygreen: 'rgb(51, 51, 0)',
      brown: 'rgb(102, 51, 0)',
      oceanblue: 'rgb(102, 153, 153)',
      babypink: 'rgb(255, 204, 255)',
      skyblue: 'rgb(102, 153, 255)',
      lightyellow: 'rgb(255, 255, 153)',
      pinkred: 'rgb(255, 0, 102)',
      lightpurple: 'rgb(204, 153, 255)',
      greenblue: 'rgb(0, 102, 102)',
      lightgreen: 'rgb(0, 255, 0)',
    };
    let CHART_COLORS_keys = Object.keys(CHART_COLORS);
//    console.dir(CHART_COLORS);

    const CHART_COLORS_50_Percent = {
      red: 'rgba(255, 99, 132, 0.5)',
      orange: 'rgba(255, 159, 64, 0.5)',
      yellow: 'rgba(255, 205, 86, 0.5)',
      green: 'rgba(75, 192, 192, 0.5)',
      blue: 'rgba(54, 162, 235, 0.5)',
      purple: 'rgba(153, 102, 255, 0.5)',
      grey: 'rgba(201, 203, 207, 0.5)',
      darkpurple: 'rgba(102,0,0, 0.5)',
      darkblue: 'rgba(0, 51, 153, 0.5)',
      darkred: 'rgba(128, 0, 0, 0.5)',
      darkgreen: 'rgba(0, 51, 0, 0.5)',
      darkorange: 'rgba(255, 192, 0, 0.5)',
      navygreen: 'rgba(51, 51, 0, 0.5)',
      brown: 'rgba(102, 51, 0, 0.5)',
      oceanblue: 'rgba(102, 153, 153, 0.5)',
      babypink: 'rgba(255, 204, 255, 0.5)',
      skyblue: 'rgba(102, 153, 255, 0.5)',
      lightyellow: 'rgba(255, 255, 153, 0.5)',
      pinkred: 'rgba(255, 0, 102, 0.5)',
      lightpurple: 'rgba(204, 153, 255, 0.5)',
      greenblue: 'rgba(0, 102, 102, 0.5)',
      lightgreen: 'rgba(0, 255, 0, 0.5)',
    };

//    console.log(CHART_COLORS_50_Percent);
//    end utils

    const data = {
      labels:[],
      datasets: []
    };
  //  console.dir(data);

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Number of Employees in Thousands'
          }
        }
      }
    };
//    console.log(config);
//    console.dir(myChart);
//    console.log("Ending");
function responseReceivedHandler() {
  if (this.status == 200) {
    let dataArray = this.response.Results.series[0].data;
    let seriesID = this.response.Results.series[0].seriesID;
    let sectorID = seriesID.substring(3,5);
    let gridline = {
        label: 'Dataset 1',
        data: [],
        borderColor: CHART_COLORS.red,
        backgroundColor: CHART_COLORS_50_Percent.red,
        hidden: true
      }
    for (let i = dataArray.length-1; i >= 0; i--) {
      gridline.data.push(dataArray[i].value)
      if(response==0){
      data.labels.push(dataArray[i].period.substring(1)+'/'+ dataArray[i].year)
      }
    }
    gridline.label = SUPER_SECTOR[sectorID]
    gridline.borderColor = CHART_COLORS[CHART_COLORS_keys[response]]
    gridline.backgroundColor = CHART_COLORS_50_Percent[CHART_COLORS_keys[response]]
    data.datasets.push(gridline)
    response++
  } else {
    console.log ("error");
  } 
  if(response == SUPER_SECTOR_keys.length){
    const myChart = new Chart(
      document.getElementById('myChart'),
        config);
  }
}

for(let i=0; i<SUPER_SECTOR_keys.length; i++){
  let startquery = "https://api.bls.gov/publicAPI/v2/timeseries/data/CEU"
  let endquery = "00000001" + apikey
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", responseReceivedHandler);
  xhr.responseType = "json";
  xhr.open("GET", startquery + SUPER_SECTOR_keys[i]+ endquery);
  xhr.send();
}