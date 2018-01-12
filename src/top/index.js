import 'babel-polyfill';
import './index.css';

const loadingEffect = () => {
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 300);
};

const getBrowserLanguage = () => {
  try {
    return (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2);
  } catch (e) {
    return undefined;
  }
};

loadingEffect();

if (getBrowserLanguage === 'ja') {
  document.body.classList.add('ja');
} else {
  document.body.classList.add('en');
}

// Accept HMR
if (module.hot) {
  module.hot.accept();
}
