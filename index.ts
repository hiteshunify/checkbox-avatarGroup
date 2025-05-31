import { fetchFromId, fetchFromUrl } from './fetchFigma';

async function main() {
  try {
    // Always run fetchFromUrl by default
    await fetchFromUrl();
    console.log('Files created: figmaResponse.json and IDs.txt');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();