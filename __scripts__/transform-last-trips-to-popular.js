const fs = require('node:fs');

// Function to read and parse JSON file
function readJsonFile(filename) {
  const data = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(data);
}

function storeAllTrips(data) {
  const allTrips = [];

  for (const tripId in data) {
    if (data.hasOwnProperty(tripId)) {
      const trip = data[tripId];
      allTrips.push({
        id: trip.id,
        title: trip.title,
        stops: Object.values(trip.stops).sort((a, b) => a.order - b.order).map(stop => ({
          locality: stop.locality,
          images: stop.images
        }))
      });
    }
  }
  fs.writeFileSync('./data/popular/all.json', JSON.stringify(allTrips))
}

function storeEachTripSeparately(data) {
  Object.entries(data).forEach(([id, trip]) => {
    fs.writeFileSync(`./data/popular/trips/${id}.json`, JSON.stringify(trip))
  })
}

// Main function
function main(jsonFileName) {
  try {
    // Read and parse the JSON file
    const jsonData = readJsonFile(jsonFileName);

    // Check if the 'data' property exists
    if (!jsonData.hasOwnProperty('data')) {
      throw new Error('JSON file does not contain a "data" property.');
    }

    // Get the data object from the 'data' property
    const dataObject = jsonData.data;


    storeAllTrips(dataObject)
    storeEachTripSeparately(dataObject)
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Replace 'your_json_file.json' with the actual path to your JSON file
const jsonFileName = './raw/last-trips.json';
main(jsonFileName);
