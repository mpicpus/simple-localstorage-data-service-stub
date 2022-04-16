import dataService from './data-service.js';

const App = () => {
  const data = dataService();
  window.data = data;
}

App();