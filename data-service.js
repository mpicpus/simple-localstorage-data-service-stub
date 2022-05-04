const getData = (url = '') => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(r => {
        r.text().then(data => resolve(data))
      })
  })
}

const writeData = (data) => {
  window.localStorage.setItem('farmyChallengeData1', JSON.stringify(data))
}

const dataService = ({initialDataFile = 'data/initialData.json', savedDataFile = null, flush: flushStorage = false}) => {
  let data, resourceNames, actionNames, permissions;

  const processResponse = (r) => {
    return new Promise((resolve, reject) => {
      try{
        data = JSON.parse(r);
        resourceNames = data ? Object.keys(data) : [];
        actionNames = data ? Object.keys(actions): [];
        resolve(data)
      } catch (error) {
        reject(error)
      }
    })
  }

  const initData = () => {
    console.log("initData");
    return new Promise((resolve, reject) => {
      let storedData = flushStorage ? null : window.localStorage.getItem('farmyChallengeData');

      if (storedData) {
        processResponse(storedData).then(processedData => resolve(processedData));
      } else if (savedDataFile) {
        getData(savedDataFile).then(r => {
          if (r?.length) {
            processResponse(r).then(processedData => {
              writeData(processedData);
              resolve(processedData)
            });
            resolve(r);
          }
        }).catch(e => console.error(e))
      } else {
        getData(initialDataFile).then(r => {
          processResponse(r).then(processedData => {
            writeData(processedData);
            resolve(processedData)
          });
        })
      }
    })
  }

  initData().then(() => {});

  const hasPermission = (resource, action) => permissions[resource]?.includes(action) || false;

  const route = ({url = null, action = null, payload = null}) => {
    return new Promise((resolve, reject) => {
      if (!url || url.length === 0) {
        reject(Error('Malformed url'));
        return;
      }

      if (data) {
        let [resource, id] = url.split('/');
        let dataPool = data[resource];

        if (action === 'get')
          action = id ? 'show' : 'index';

        if (!dataPool) {
          reject(Error('Resource not found'));
          return;
        }

        let hasAction = !!actions[action];
        let response = hasAction && hasPermission(resource, action) ?
          actions[action]({dataPool, resource, id, payload, data}) :
          null;

        if (response) {
          resolve(response);
        } else {
          reject(Error(hasAction ? 'Permission Denied' : 'Resource not found'))
        }
      } else {
        initData().then(r => route({url, action, payload}).then(rr => resolve(rr)))
      }
    })
  }

  // Actions:
  const get = (url) => {
    return new Promise((resolve, reject) => {
      route({url, action: 'get'}).then(result => {
        resolve(result)
      }).catch(e => reject(e))
    })
  }

  const create = (url, payload = {}) => {
    return new Promise((resolve, reject) => {
      route({url, action: 'create', payload}).then(result => {
        resolve(result)
      }).catch(e => reject(e))
    })
  };

  // "delete" is a reserved name.
  const remove = (url) => {
    return new Promise((resolve, reject) => {
      route({url, action: 'delete'}).then(result => {
        resolve(result)
      }).catch(e => reject(e))
    })
  };

  const update = (url, payload = {}) => {
    return new Promise((resolve, reject) => {
      route({url, action: 'update', payload}).then(result => {
        resolve(result)
      }).catch(e => reject(e))
    })
  }

  const saveData = (url = 'savedData.json', data = null) => {
    return new Promise((resolve, reject) => {
      if (data) {
        const blob = new Blob([JSON.stringify(data)], { type: "text/json" });
        const link = document.createElement("a");

        link.download = url;
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

        const event = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        });

        link.dispatchEvent(event);
        link.remove();
        resolve()
      } else {
        initData().then((data) => saveData(url, data).then(() => resolve()))
      }
    })
  }

  const uploadFileInput = (event) => {
    return new Promise((resolve, reject) => {
      let files = event?.target?.files;
      let file = files ? files[0] : null;

      if (!file) {
        reject("No file passed to the function.");
        return
      }

      try {
        file.text().then(data => {
          processResponse(data).then(r => resolve(r)).catch(e => reject(e))
        });
      } catch (error) {
        reject(error)
      }
    })
  }

  return {get, create, delete: remove, update, saveData, uploadFileInput}
};

const actions = {
  index: ({dataPool}) => {
    return dataPool
  },
  show: ({dataPool, id}) => {
    return dataPool.find(i => i.id == id);
  },
  delete: ({dataPool, id, resource, data}) => {
    dataPool = dataPool.filter(i => i.id != id);
    data[resource] = dataPool;
    writeData(data);
    return dataPool
  },
  create: ({dataPool, payload, resource, data}) => {
    let newId = Math.max(...dataPool.map(i => i.id)) + 1;
    let newItem = {...payload, ...{id: newId}};
    dataPool.push(newItem);
    data[resource] = dataPool;
    writeData(data);
    return newItem
  },
  update: ({dataPool, id, payload, resource, data}) => {
    let item;
    const itemIndex = dataPool.indexOf(dataPool.find(i => i.id == id));
    if (~itemIndex) {
      item = dataPool[itemIndex];
      dataPool[itemIndex] = {...item, ...payload}
    }

    data[resource] = dataPool;
    writeData(data)
    return item
  }
}

export default dataService;
