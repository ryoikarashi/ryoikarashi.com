import 'babel-polyfill';
import $ from 'jquery';
import './index.css';
import Popup from './popup';

$(() => {
  document.body.scrollTop = 0;
  const exhibitionPopup = new Popup();
  exhibitionPopup.init();
});

// Accept HMR
if (module.hot) {
  module.hot.accept();
}
