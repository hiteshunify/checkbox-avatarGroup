import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

const ids = {
  FileId: "vPbNKOqixr8HPOoswonSoO",
  NodeId: "3352-19070"
};

const fileUrl = "https://www.figma.com/design/4r7C2sI9cktH4T8atJhmrW/Component-Sheet?node-id=1-5710&t=8LnmvlwYcvtLFgLZ-4";
export async function fetchFromId() {
  const response = await fetch('https://api.qa.unifyapps.com/api-endpoint/figma/node-details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ids)
  });
  const data = await response.json();
  console.log('Node details:', data);
}

export async function fetchFromUrl() {
  const response = await fetch('https://api.qa.unifyapps.com/api-endpoint/figma/Fetch-Figma-Details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileUrl })
  });
  const data = await response.json();
  writeFileSync('figmaResponse.json', JSON.stringify(data, null, 2));

  const urlObj = new URL(fileUrl);
  const nodeId = urlObj.searchParams.get('node-id') || '';
  const fileId = ids.FileId;
  writeFileSync('IDs.txt', `NodeId: ${nodeId}\nFileId: ${fileId}`);
}