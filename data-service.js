const dataService = () => {
  const data = {...initialData};
  const resourceNames = Object.keys(data);
  const actionNames = Object.keys(actions);

  const permissions = {
    business_logic: ['index'],
    suppliers: ['show', 'index'],
    products: ['show', 'index'],
    salads: ['show', 'index', 'delete', 'update', 'create']
  }

  const hasPermission = (resource, action) => permissions[resource]?.includes(action) || false;

  const route = ({url = null, action = null, payload = null}) => {
    return new Promise((resolve, reject) => {
      if (!url || url.length === 0) {
        reject(Error('Malformed url'));
        return;
      }

      let [resource, id] = url.split('/');
      let dataPool = data[resource];
      
      if (action === 'get')
        action = id ? 'show' : 'index';
      
      console.log({resource, id, action, dataPool, payload, data});

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
        return
      } else {
        reject(Error(hasAction ? 'Permission Denied' : 'Resource not found'))
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

  return {get, create, delete: remove, update}
};

const actions = {
  index: ({dataPool, id, resource, data}) => {
    return dataPool
  },
  show: ({dataPool, id}) => {
    return dataPool.find(i => i.id == id);
  },
  delete: ({dataPool, id, resource, data}) => {
    dataPool = dataPool.filter(i => i.id != id);
    data[resource] = dataPool;
    return dataPool
  },
  create: ({dataPool, payload}) => {
    let newId = Math.max(...dataPool.map(i => i.id)) + 1;
    let newItem = {...payload, ...{id: newId}};
    dataPool.push(newItem);
    return newItem
  },
  update: ({dataPool, id, payload}) => {
    let item = dataPool.find(i => i.id == id);
    if (item) {
      item = {...item, ...payload}
    }

    return item
  }
}

const initialData = {
  business_logic: {
    margin: 0.2,
  },
  suppliers: [
    {
      id: 1,
      name: "Brand new Veggies",
      productsToOrder: []
    },
    {
      id: 2,
      name: "Fruits Marcel",
      productsToOrder: []
    },
    {
      id: 3,
      name: "HypeMart",
      productsToOrder: []
    },
    {
      id: 4,
      name: "DaShop",
      productsToOrder: []
    }
  ],
  products: [
    {
      id: 1,
      name: 'Lettuce',
      costPerServing: 0.3,
      weightInGramsPerServing: 100,
      supplierId: 1
    },
    {
      id: 2,
      name: 'Tomato',
      costPerServing: 0.4,
      weightInGramsPerServing: 100,
      supplierId: 1
    },
    {
      id: 3,
      name: 'Cherry Tomato',
      costPerServing: 0.5,
      weightInGramsPerServing: 75,
      supplierId: 1
    },
    {
      id: 4,
      name: 'Pasta',
      costPerServing: 0.2,
      weightInGramsPerServing: 100,
      supplierId: 3
    },
    {
      id: 5,
      name: 'Cous-cous',
      costPerServing: 0.25,
      weightInGramsPerServing: 100,
      supplierId: 3
    },
    {
      id: 6,
      name: 'Rice',
      costPerServing: 0.25,
      weightInGramsPerServing: 100,
      supplierId: 3
    },
    {
      id: 7,
      name: 'Potato',
      costPerServing: 0.2,
      weightInGramsPerServing: 100,
      supplierId: 2
    },
    {
      id: 8,
      name: 'Red Pepper',
      costPerServing: 0.4,
      weightInGramsPerServing: 50,
      supplierId: 2
    },
    {
      id: 9,
      name: 'Green Pepper',
      costPerServing: 0.35,
      weightInGramsPerServing: 50,
      supplierId: 1
    },
    {
      id: 10,
      name: 'Cucumber',
      costPerServing: 0.34,
      weightInGramsPerServing: 50,
      supplierId: 2
    },
    {
      id: 11,
      name: 'Onion',
      costPerServing: 0.3,
      weightInGramsPerServing: 50,
      supplierId: 1
    },
    {
      id: 12,
      name: 'Chive',
      costPerServing: 0.65,
      weightInGramsPerServing: 35,
      supplierId: 2
    },
    {
      id: 13,
      name: 'Pea',
      costPerServing: 0.65,
      weightInGramsPerServing: 50,
      supplierId: 2
    },
    {
      id: 14,
      name: 'Pickle',
      costPerServing: 0.4,
      weightInGramsPerServing: 35,
      supplierId: 3
    },
    {
      id: 15,
      name: 'Carrot',
      costPerServing: 0.35,
      weightInGramsPerServing: 75,
      supplierId: 1
    },
    {
      id: 16,
      name: 'Cellery',
      costPerServing: 0.75,
      weightInGramsPerServing: 50,
      supplierId: 1
    },
    {
      id: 17,
      name: 'Corn',
      costPerServing: 0.3,
      weightInGramsPerServing: 50,
      supplierId: 4
    },
    {
      id: 18,
      name: 'Beet',
      costPerServing: 0.4,
      weightInGramsPerServing: 30,
      supplierId: 2
    },
    {
      id: 19,
      name: 'Olives',
      costPerServing: 0.6,
      weightInGramsPerServing: 45,
      supplierId: 4
    },
    {
      id: 20,
      name: 'Egg',
      costPerServing: 0.7,
      weightInGramsPerServing: 50,
      supplierId: 4
    },
    {
      id: 21,
      name: 'Tuna',
      costPerServing: 0.6,
      weightInGramsPerServing: 45,
      supplierId: 4
    },{
      id: 22,
      name: 'Smoked Salmon',
      costPerServing: 1.1,
      weightInGramsPerServing: 35,
      supplierId: 4
    },{
      id: 23,
      name: 'Chicken',
      costPerServing: 0.8,
      weightInGramsPerServing: 100,
      supplierId: 4
    },{
      id: 24,
      name: 'Feta Cheese',
      costPerServing: 0.85,
      weightInGramsPerServing: 45,
      supplierId: 3
    },{
      id: 25,
      name: 'Crunchy Onion',
      costPerServing: 0.5,
      weightInGramsPerServing: 25,
      supplierId: 3
    },{
      id: 26,
      name: 'Crunchy Bacon',
      costPerServing: 0.65,
      weightInGramsPerServing: 25,
      supplierId: 3
    },{
      id: 27,
      name: 'Apple',
      costPerServing: 0.7,
      weightInGramsPerServing: 75,
      supplierId: 1
    },{
      id: 28,
      name: 'Nuts',
      costPerServing: 0.8,
      weightInGramsPerServing: 35,
      supplierId: 2
    },{
      id: 29,
      name: 'Sesame Seeds',
      costPerServing: 0.7,
      weightInGramsPerServing: 25,
      supplierId: 2
    },
    {
      id: 30,
      name: 'Sunflower Seeds',
      costPerServing: 0.65,
      weightInGramsPerServing: 25,
      supplierId: 2
    },
    {
      id: 31,
      name: 'Oil and Vinegar',
      costPerServing: 0.15,
      weightInGramsPerServing: 25,
      supplierId: 4
    },
    {
      id: 32,
      name: 'Caesar Sauce',
      costPerServing: 0.1,
      weightInGramsPerServing: 25,
      supplierId: 4
    },
    {
      id: 33,
      name: 'Cocktail Sauce',
      costPerServing: 0.1,
      weightInGramsPerServing: 25,
      supplierId: 4
    },
    {
      id: 34,
      name: 'Oriental Sauce',
      costPerServing: 0.1,
      weightInGramsPerServing: 25,
      supplierId: 4
    },
    {
      id: 35,
      name: 'Curry Mayo',
      costPerServing: 0.1,
      weightInGramsPerServing: 25,
      supplierId: 3
    }
  ],
  salads: [
    {
      id: 0,
      size: 'small',
      ingredients: [
        {
          id: 1,
          numOfServings: 1
        }
      ],
      cost: 0.3,
      targetStock: 20,
      currentStock: 0,
      price: 0.33
    }
  ]
}

export default dataService;
