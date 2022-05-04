# Simple localStorage-based JS Data service
This small tool is intended to be used for simple frontend coding challenges/experiments. It requires no additional server/setup to access a REST-like data api.

The following documentation is based on the dataset that can be found [here](https://github.com/mpicpus/challenge-data-set-1), but the tool intends to be a bit more flexible than that.

Initial data is read from a `initialData.json` file by default. This can be configured, but for convenience just place the above data set in a /data public folder.

**Important note**: This is a work in progress, some bugs may still arise. If so please report them and we'll try to solve them as soon as possible. Suggestions and PRs are welcome.

#### Installation
```bash
npm i simple-localstorage-data-service-stub
```
or in your `package.json`:
```json
"simple-localstorage-data-service-stub": "^1.0.7"
```


#### Basic API
The service is intended to be used as a REST service. Thus the main public funtions have common rest verb names. All of them are asymetric and return a promise.

##### Initalization
```javascript
import DataService from "simple-localstorage-data-service-stub";
const dataService = DataService();
```

##### Data access api
- `get(resourceUrl)`
```javascript
dataService.get('products/6').then(product => console.log({product}));
dataService.get('suppliers').then(suppliers => console.log({suppliers}));
dataService.get('businessLogic').then(businessLogic => console.log({businessLogic}));
```
- `create(resourceUrl, payload)`
```javascript
// Returns the newly created item.
dataService.create('salads', newSalad).then(salad => setCurrentSalad(salad));
```
- `delete(resourceUrl)`
```javascript
// Returns the resulting collection after deletion.
dataService.delete('salads/4').then(salads => setSalads(salads));
```
- `update(resourceUrl, payload)`
```javascript
// Returns the updated item.
dataService.update('salads/4', {name: "my new shiny salad"}).then(salad => setCurrentSalad(salad));
```
##### Additional storage aids
Since there's no real DB to store the data, we provide two simple file read/write functions to preserve changes beyond localStorage.
- `saveData(fileName)` => default filename is `savedData.json`, but since a file save dialog will be open this is almost irrelevant.
- `uploadFileInput(event)` => saves a local file based on the resulting event of a file upload:
```javascript
const handleFileInput = (event) => {
  // It automatically updates the global data object with the parsed content, if successful.
  // Returns the parsed data (though no further action is needed).
  dataService.uploadFileInput(event).then(r => {
    // This response code is not required.
    event.target.value = null; // resets the input value.
    console.log("done!", {r})
  })
}

return <input type="file" id="input" onInput={handleFileInput}/>
```