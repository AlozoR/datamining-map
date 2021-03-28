'use strict'

const ReadLine = require('readline')
const axios = require('axios');
const http = require('http')

const rl = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const URL = 'http://triplestore:3030/datamining/query'

const CONFIG = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};


const selectQuery = query => {
  query = 'query=' + encodeURIComponent(query)
  return axios.post(URL, query, CONFIG)
    .then(response => {
      console.log('Query OK')
      return response.data.results.bindings
    })
    .catch(error => {
      console.log('Error')
    });
}

const bike = (long, lat, long2, lat2) => {
  query = `
        PREFIX onto: <http://www.semanticweb.org/yves/ontologies/2021/2/untitled-ontology-5#>
        PREFIX schema: <http://schema.org/>
        
        SELECT distinct ?name ?dist ?lat ?lon ?avail
        WHERE {
          ?subject schema:Velo ?object .
          ?object onto:Latitude ?lat .
          ?object onto:Longitude ?lon .
          ?object onto:AvailableBikes ?avail .
          optional { ?object onto:Nom ?name } .
          BIND (((?lon - ${long}) * (?lon - ${long})) + ((?lat - ${lat}) * (?lat - ${lat})) AS ?dist)
        }
        order by ?dist
        LIMIT 1
        `
  selectQuery(query).then(data => {
    const name = data[0].name ? data[0].name.value : '{undefined_name}'
    console.log(`The nearest bike station is ${name} at the coordinates:
        long: ${data[0].lon.value}
        lat: ${data[0].lat.value}.
    Available bikes: ${data[0].avail.value}`)
  })

  query = `
        PREFIX onto: <http://www.semanticweb.org/yves/ontologies/2021/2/untitled-ontology-5#>
        PREFIX schema: <http://schema.org/>
        
        SELECT distinct ?name ?dist ?lat ?lon
        WHERE {
          ?subject schema:Velo ?object .
          ?object onto:Latitude ?lat .
          ?object onto:Longitude ?lon .
          optional { ?object onto:Nom ?name } .
          BIND (((?lon - ${long2}) * (?lon - ${long2})) + ((?lat - ${lat2}) * (?lat - ${lat2})) AS ?dist)
        }
        order by ?dist
        LIMIT 1
        `
  selectQuery(query).then(data => {
    const name = data[0].name ? data[0].name.value : '{undefined_name}'
    console.log(`The closest bike station of your destination is ${name} at the coordinates:
        long: ${data[0].lon.value}
        lat: ${data[0].lat.value}.`)
  })
}

const bus = (long, lat, long2, lat2) => {
  query = `
        PREFIX onto: <http://www.semanticweb.org/yves/ontologies/2021/2/untitled-ontology-5#>
        PREFIX schema: <http://schema.org/>
        
        SELECT distinct ?name ?dist ?lat ?lon
        WHERE {
          ?subject schema:StasStation ?object .
          ?object onto:Latitude ?lat .
          ?object onto:Longitude ?lon .
          ?object onto:Nom ?name .
          BIND (((?lon - ${long}) * (?lon - ${long})) + ((?lat - ${lat}) * (?lat - ${lat})) AS ?dist)
        }
        order by ?dist
        LIMIT 1
        `
  selectQuery(query).then(data => {
    const name = data[0].name ? data[0].name.value : '{undefined_name}'
    console.log(`The nearest bus station is ${name} at the coordinates:
        long: ${data[0].lon.value}
        lat: ${data[0].lat.value}.`)
  })

  query = `
        PREFIX onto: <http://www.semanticweb.org/yves/ontologies/2021/2/untitled-ontology-5#>
        PREFIX schema: <http://schema.org/>
        
        SELECT distinct ?name ?dist ?lat ?lon
        WHERE {
          ?subject schema:StasStation ?object .
          ?object onto:Latitude ?lat .
          ?object onto:Longitude ?lon .
          ?object onto:Nom ?name .
          BIND (((?lon - ${long2}) * (?lon - ${long2})) + ((?lat - ${lat2}) * (?lat - ${lat2})) AS ?dist)
        }
        order by ?dist
        LIMIT 1
        `
  selectQuery(query).then(data => {
    const name = data[0].name ? data[0].name.value : '{undefined_name}'
    console.log(`The closest bus station of your destination is ${name} at the coordinates:
        long: ${data[0].lon.value}
        lat: ${data[0].lat.value}.`)
  })
}

const train = (long, lat, long2, lat2) => {
  query = `
        PREFIX onto: <http://www.semanticweb.org/yves/ontologies/2021/2/untitled-ontology-5#>
        PREFIX schema: <http://schema.org/>
        
        SELECT distinct ?name ?dist ?lat ?lon
        WHERE {
          ?subject schema:TgvStation ?object .
          ?object onto:Latitude ?lat .
          ?object onto:Longitude ?lon .
          ?object onto:Nom ?name .
          BIND (((?lon - ${long}) * (?lon - ${long})) + ((?lat - ${lat}) * (?lat - ${lat})) AS ?dist)
        }
        order by ?dist
        LIMIT 1
        `
  selectQuery(query).then(data => {
    const name = data[0].name ? data[0].name.value : '{undefined_name}'
    console.log(`The nearest train station is ${name} at the coordinates:
        long: ${data[0].lon.value}
        lat: ${data[0].lat.value}.`)
  })
  query = `
        PREFIX onto: <http://www.semanticweb.org/yves/ontologies/2021/2/untitled-ontology-5#>
        PREFIX schema: <http://schema.org/>
        
        SELECT distinct ?name ?dist ?lat ?lon
        WHERE {
          ?subject schema:TgvStation ?object .
          ?object onto:Latitude ?lat .
          ?object onto:Longitude ?lon .
          ?object onto:Nom ?name .
          BIND (((?lon - ${long2}) * (?lon - ${long2})) + ((?lat - ${lat2}) * (?lat - ${lat2})) AS ?dist)
        }
        order by ?dist
        LIMIT 1
        `
  selectQuery(query).then(data => {
    const name = data[0].name ? data[0].name.value : '{undefined_name}'
    console.log(`The closest train station of your destination is ${name} at the coordinates:
        long: ${data[0].lon.value}
        lat: ${data[0].lat.value}.`)
  })
}

const next = (long, lat, long2, lat2) => {
  rl.question(`Please choose your mean of transportation (default: 1):
    1. Car
    2. Bike
    3. Bus
    4. Train`, choice => {
    switch (choice) {
    case '2':
      bike(long, lat, long2, lat2)
      break
    case '3':
      bus(long, lat, long2, lat2)
      break
    case '4':
      train(long, lat, long2, lat2)
      break
    default:
      query = `
        PREFIX onto: <http://www.semanticweb.org/yves/ontologies/2021/2/untitled-ontology-5#>
        PREFIX schema: <http://schema.org/>
        
        SELECT distinct ?name ?ville ?dist ?lat ?lon
        WHERE {
          ?subject schema:Bibliotheque ?object .
          ?object ?prdeicate2 ?classe .
          ?object onto:Latitude ?lat .
          ?object onto:Longitude ?lon .
          ?classe onto:Nom ?name .
          ?classe onto:Commune ?ville .
          BIND (((?lon - ${long}) * (?lon - ${long})) + ((?lat - ${lat}) * (?lat - ${lat})) AS ?dist)
        }
        order by ?dist
        LIMIT 1
        `
      break
    }
  })
}


let query = ''
rl.setPrompt('> ');
console.log("Hello! Tell us where you are!")
rl.question("Please enter a longitude (default: 5.0): ", long => {
  rl.question("Please enter a latitude (default 45.0): ", lat => {
    if (long === '' || isNaN(+long)) {
      long = 5.0;
    }
    if (lat === '' || isNaN(+lat)) {
      lat = 45.0;
    }
    rl.question(`Please choose a destination type (default: 1):
    1. Hospitals
    2. Libraries
    3. Custom coordinates`, choice => {
      if (choice === '2') {
        choice = 'Bibliotheque'
        query = `
        PREFIX onto: <http://www.semanticweb.org/yves/ontologies/2021/2/untitled-ontology-5#>
        PREFIX schema: <http://schema.org/>
        
        SELECT distinct ?name ?ville ?dist ?lat ?lon
        WHERE {
          ?subject schema:Bibliotheque ?object .
          ?object ?prdeicate2 ?classe .
          ?object onto:Latitude ?lat .
          ?object onto:Longitude ?lon .
          ?classe onto:Nom ?name .
          ?classe onto:Commune ?ville .
          BIND (((?lon - ${long}) * (?lon - ${long})) + ((?lat - ${lat}) * (?lat - ${lat})) AS ?dist)
        }
        order by ?dist
        LIMIT 1
        `
        selectQuery(query).then(data => {
          console.log(`The nearest library is ${data[0].name.value} in the city of ${data[0].ville.value}.`)
          next(long, lat, data[0].lon.value, data[0].lat.value)
        })
      } else if (choice === '3') {
        rl.question("Please enter a longitude (default: 7.0): ", long2 => {
          rl.question("Please enter a latitude (default 48.0): ", lat2 => {
            if (long2 === '' || isNaN(+long2)) {
              long2 = 7.0;
            }
            if (lat2 === '' || isNaN(+lat2)) {
              lat2 = 48.0;
            }
            next(long, lat, long2, lat2)
          })
        })

      } else {
        query = `
        PREFIX onto: <http://www.semanticweb.org/yves/ontologies/2021/2/untitled-ontology-5#>
        PREFIX schema: <http://schema.org/>
        
        SELECT distinct ?name ?ville ?lat ?lon
        WHERE {
          ?subject schema:Hopital ?object .
          ?object ?predicate ?classe .
          ?classe onto:Latitude ?lat .
          ?classe onto:Longitude ?lon .
          ?classe onto:Commune ?ville .
          ?classe onto:Nom ?name .
          BIND (((?lon - ${long}) * (?lon - ${long})) + ((?lat - ${lat}) * (?lat - ${lat})) AS ?dist)
        }
        order by ?dist
        LIMIT 1
        `
        selectQuery(query).then(data => {
          console.log(`The nearest hospital is ${data[0].name.value} in the city of ${data[0].ville.value}.`)
          next(long, lat, data[0].lon.value, data[0].lat.value)
        })
      }

    })
  })
})
