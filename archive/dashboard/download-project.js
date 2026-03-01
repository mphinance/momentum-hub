// Run this in your browser console to download all files
const downloadFile = (filename, content) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// Download package.json
fetch('/package.json')
  .then(response => response.text())
  .then(content => downloadFile('package.json', content));

// You'll need to manually copy other files from the editor
console.log('Download package.json first, then manually copy other files');