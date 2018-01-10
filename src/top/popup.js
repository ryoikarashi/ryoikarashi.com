import $ from 'jquery';
import 'magnific-popup';

const jQueryBridget = require('jquery-bridget');
const Masonry = require('masonry-layout');
const ImagesLoaded = require('imagesloaded');

jQueryBridget('masonry', Masonry, $);
jQueryBridget('imagesLoaded', ImagesLoaded, $);

export default class Popup {
  constructor(opts = {
    mainContent: '.content',
    footer: '.footer',
    popupsContent: '.popups',
    popupItems: '.popups__item',
    exhibitionContent: '.exhibition',
    logo: '.hero__logo',
    galleryContent: '.gallery',
    galleryItem: '.gallery__img',
    duration: 2000,
    logoDuration: 7000,
  }) {
    const { mainContent, footer, popupsContent, popupItems, galleryContent,
            galleryItem, exhibitionContent, logo, duration, logoDuration } = opts;
    this.$mainContent = $(mainContent);
    this.$footer = $(footer);
    this.$popupsContainer = $(popupsContent);
    this.$exhibitionItems = $(`${exhibitionContent} > ul li a`);
    this.$exhibitionContents = $(popupItems);
    this.$logo = $(logo);
    this.$galleryContent = $(galleryContent);
    this.galleryContentClass = galleryContent;
    this.galleryItem = galleryItem;
    this.duration = duration;
    this.logoDuration = logoDuration;
  }

  _arrangeGalleryItems() {
    const options = {
      itemSelector: this.galleryItem,
      percentPosition: true,
    };
    this.$galleryContent.masonry(options);
  }

  _gallerySwipe(matchedItem) {
    const $targetContent = this._getTargetContent(matchedItem);
    const $targetGalleryItems = $targetContent.find(this.galleryItem);
    this.$galleryContent.magnificPopup({
      delegate: 'a',
      type: 'image',
      tLoading: '',
      gallery: {
        enabled: true,
      },
      image: {
        markup: '<div class="mfp-figure f12px f14px-ns lh24px c-gray ff-nsjp">' +
           '<figure>' +
           '<div class="mfp-img"></div>' +
           '<figcaption>' +
             '<div class="mfp-bottom-bar">' +
               '<div class="mfp-title"></div>' +
             '</div>' +
           '</figcaption>' +
           '</figure>' +
         '</div>',
      },
      mainClass: 'mfp-zoom-in',
      removalDelay: 300, // delay removal by X to allow out-animation
      callbacks: {
        beforeOpen: () => {
          $targetGalleryItems.each(() => {
            $(this).attr('title', $(this).find('img').attr('alt'));
          });
        },
        open: () => {
          // overwrite default prev + next function. Add timeout for css3 crossfade animation
          $.magnificPopup.instance.next = () => {
            const self = this;
            $('.mfp-wrap').removeClass('mfp-image-loaded');
            setTimeout(() => { $.magnificPopup.proto.next.call(self); }, 120);
          };
          $.magnificPopup.instance.prev = () => {
            const self = this;
            $('.mfp-wrap').removeClass('mfp-image-loaded');
            setTimeout(() => { $.magnificPopup.proto.prev.call(self); }, 120);
          };
        },
        imageLoadComplete: () => {
          setTimeout(() => { $('.mfp-wrap').addClass('mfp-image-loaded'); }, 16);
        },
      },
    });
  }

  _openPopupsContainer($targetContent) {
    document.body.scrollTop = 0;
    $('body').addClass('overflow-hidden');
    this.$popupsContainer.addClass('visible');
    $targetContent.removeClass('a-fadeOutDown');
    $targetContent.addClass('a-fadeInUp');
    this.$mainContent.addClass('blur');
    this.$footer.addClass('blur');

    if (location.hash) {
      setTimeout(() => {
        this.$logo.addClass('blur');
      }, this.duration);
    } else { this.$logo.addClass('blur'); }
  }

  _closePopupsContainer($targetContent) {
    $(document).off('click touchend');
    $(document).on('click touchend', (e) => {
      const isOutOfExhibitionList = !$(e.target).parents('.exhibition').length;
      const isOutOfContent = $(e.target).attr('id') === $targetContent.attr('id');
      const isOutOfImagePopup = !$(e.target).closest('.mfp-wrap').length;
      if (isOutOfExhibitionList && isOutOfContent && isOutOfImagePopup) {
        $('body').removeClass('overflow-hidden');
        this.$popupsContainer.removeClass('visible');
        $targetContent.removeClass('a-fadeInUp');
        $targetContent.addClass('a-fadeOutDown');
        this.$mainContent.removeClass('blur');
        this.$footer.removeClass('blur');
        this.$logo.removeClass('blur');
        this.$exhibitionContents.removeClass('hidden');
        history.pushState('', document.title, window.location.pathname);
      }
    });
  }

  _getExhibitionItemIndex(item) {
    return this.$exhibitionItems.index(item);
  }

  _getTargetContentByIndex(index) {
    return this.$exhibitionContents.eq(index).find('.popups__item__inner');
  }

  _getTargetContent(item) {
    const index = this._getExhibitionItemIndex(item);
    return this._getTargetContentByIndex(index);
  }

  _hideOtherExhibitionContents(item) {
    return this.$exhibitionContents.not(`:eq(${this._getExhibitionItemIndex(item)})`).addClass('hidden');
  }

  _popupStart(matchedItem, event) {
    const $targetContent = this._getTargetContent(matchedItem);
    this._hideOtherExhibitionContents(matchedItem);
    this._openPopupsContainer($targetContent);
    this._closePopupsContainer($targetContent, event);
  }

  _fixLogoForSafari() {
    setTimeout(() => {
      this.$logo.removeClass('fixed');
      this.$logo.addClass('absolute');
    }, this.logoDuration);
  }

  init() {
    this._fixLogoForSafari();
    this._arrangeGalleryItems();

    if (location.hash) {
      const matchedItem = [].slice.call(this.$exhibitionItems).filter(item => $(item).attr('href') === location.hash)[0];
      this._popupStart(matchedItem);
      this._gallerySwipe(matchedItem);
    }

    this.$exhibitionItems.on('click touchend', (e) => {
      const matchedItem = e.currentTarget;
      this._popupStart(matchedItem, e);
      this._gallerySwipe(matchedItem);
    });
  }
}
