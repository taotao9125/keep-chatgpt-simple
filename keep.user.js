// ==UserScript==
// @name         Keep ChatGPT Simple
// @namespace    http://sorrycc.com/
// @version      0.1.0
// @description  try to take over the world!
// @author       sorrycc
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ai.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(() => {
  let apiUrl = '/api/auth/session';
  let timer = -1;


  async function keepChat() {
    const res = await fetch(apiUrl);
    const contentType = res.headers.get('Content-Type');
    const text = await res.text();
    const isJSON = contentType && contentType.includes('application/json');
    const is403 = res.status === 403;

    const isValid = isJSON && !is403 && text.includes('expires');
    if (!isValid) {
      throw new Error('Invalid response');
    }
  }

  document.addEventListener('visibilitychange', () => {
    var isHidden = document.hidden;
    if (isHidden) {
      run(10);
    } else {
      run(20);
    }

  });





  function run(threshold) {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        await keepChat();
        run(threshold)
      } catch (e) {
        console.error(e.message)
        var iframe = document.createElement('iframe');
        iframe.id = 'keepChat';
        iframe.style = `height: 0px; width: 100%;`;
        iframe.src = apiUrl;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.parentNode.removeChild(iframe);
          run(threshold)
        }

      }
    }, threshold * 1000)
  }

  run(20);


})();
