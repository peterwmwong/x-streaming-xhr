(() => {

// Take advantage of Github's API pretty printed JSON for an easy delimeter
// to determine a fully formed event object from a partial response.
// The top level list's entries (event objects) have a dependable start and end
// indentation preceding the braces '{' '}'.
const DELIMITER = "\n  }";

function streamJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  let pos = 0;

  xhr.onload = xhr.onprogress = function() {
    const parts = xhr.response.slice(pos).split(DELIMITER);
    const max = parts.length - 1;
    let part;

    performance.mark('data');
    for(let i=0; i<max; ++i){
      part = parts[i];
      pos += part.length + DELIMITER.length;
      callback(JSON.parse(part.slice(1) + "}"));
    }
    performance.measure(`chunk(${max+1})`, 'data');
  }

  xhr.responseType = 'text';
  xhr.open('GET', url);
  xhr.send();
}

// streamJSON('https://api.github.com/users/webassembly/events', event => {
streamJSON('test.json', event => {
  const div = document.createElement('div');
  div.textContent = event.type;
  document.body.appendChild(div);
});

})();
