import 'babel-polyfill';
import './index.css';

const ready = (fn) => {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

ready(() => {});

// Accept HMR
if (module.hot) {
  module.hot.accept();
}
