import 'babel-polyfill';
import './index.css';

const ready = (fn) => {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

const getBrowserLanguage = () => {
  try {
    return (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2);
  } catch (e) {
    return undefined;
  }
};

ready(() => {
  // set browser language
  if (getBrowserLanguage === 'ja') {
    document.body.classList.add('ja');
  } else {
    document.body.classList.add('en');
  }
});

// Accept HMR
if (module.hot) {
  module.hot.accept();
}
