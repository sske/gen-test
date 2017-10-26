import { NgtestPage } from './app.po';
import { browser, by, element } from 'protractor';

var fs = require('fs'),
  Utils = {
    screenShotDirectory: '',

    writeScreenShot: function(data, filename) {
      var stream = fs.createWriteStream(this.screenShotDirectory + filename);

      stream.write(new Buffer(data, 'base64'));
      stream.end();
    },

    getSizes: function() {
      return browser.executeScript("return {innerHeight: window.innerHeight, scrollHeight: document.body.scrollHeight, clientHeight: document.body.clientHeight, scrollTop: document.body.scrollTop};");
    },

    scrollToBottom: function(height?: number, index?: number) {
      var self = this;

      if (!index || index < 10) {
        self.getSizes().then(function(data) {
          if (!height) {
            height = 0;
          }
          if (!index) {
            index = 1;
          }

          var allHeight = data.scrollHeight > data.clientHeight ? data.scrollHeight : data.clientHeight;
          if (height < allHeight) {
            if (index === 1) {
              browser.takeScreenshot().then(function(png) {
                self.writeScreenShot(png, "test" + index + ".png");
              });
            } else {
              browser.executeScript("window.scrollTo(0, arguments[0]);", height).then(function() {
                browser.takeScreenshot().then(function(png) {
                  self.writeScreenShot(png, "test" + index + ".png");
                });
              });
            }
            self.scrollToBottom(height + data.innerHeight, index + 1);
          }
        });
      }
    }
  };
describe('ngtest App', () => {
  let page: NgtestPage;

  beforeEach(() => {
    page = new NgtestPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    //expect(page.getParagraphText()).toEqual('Welcome to app!');
  });

  it('スクリーンショットを撮る', () => {
    Utils.scrollToBottom();
  });
});
