/**
 * Optimized Name Correction Script
 * Strictly replaces ONLY "Zahirul Islam Akash" with "Jahirul Islam Akash"
 * while preserving all scanning mechanisms
 */
(function() {
  // 1. Keep original English detection system
  function isEnglishMode() {
    return (
      document.documentElement.lang === 'en' ||
      document.documentElement.getAttribute('lang') === 'en' ||
      document.documentElement.hasAttribute('translate') ||
      document.querySelector('html[translated-ltr], html[translated-rtl]') !== null ||
      document.body.classList.contains('translated-ltr') ||
      document.body.classList.contains('translated-rtl') ||
      document.querySelector('.goog-te-banner-frame') !== null ||
      document.querySelector('.skiptranslate') !== null
    );
  }

  // 2. Simplified replacement function (ONLY targets full name)
  function replaceIfFound(text) {
    return text.replace(/\bZahirul Islam Akash\b/gi, 'Jahirul Islam Akash');
  }

  // 3. Core processor with original scanning logic
  function scanAndReplace(root) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      { acceptNode: node => 
        node.nodeValue.includes('Zahirul Islam Akash') ? 
        NodeFilter.FILTER_ACCEPT : 
        NodeFilter.FILTER_SKIP 
      },
      false
    );

    let node;
    while ((node = walker.nextNode())) {
      node.nodeValue = replaceIfFound(node.nodeValue);
    }

    // Preserve shadow DOM scanning
    root.querySelectorAll('*').forEach(el => {
      if (el.shadowRoot) scanAndReplace(el.shadowRoot);
    });
  }

  // 4. Main function with all original triggers
  function executeCorrection() {
    if (!isEnglishMode()) return;
    
    scanAndReplace(document.body);

    // Preserve iframe handling
    document.querySelectorAll('iframe').forEach(iframe => {
      try {
        if (iframe.contentDocument?.body) {
          scanAndReplace(iframe.contentDocument.body);
        }
      } catch (e) {}
    });

    // Preserve title correction
    if (document.title.includes('Zahirul Islam Akash')) {
      document.title = replaceIfFound(document.title);
    }
  }

  // 5. Mutation Observer with optimized filtering
  const observer = new MutationObserver(mutations => {
    if (!isEnglishMode()) return;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            scanAndReplace(node);
          } else if (node.nodeType === Node.TEXT_NODE && 
                    node.nodeValue.includes('Zahirul Islam Akash')) {
            node.nodeValue = replaceIfFound(node.nodeValue);
          }
        });
      }
    });
  });

  // 6. Initialization (preserve all original triggers)
  function init() {
    executeCorrection();
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: false // Disabled for optimization
    });

    // Preserve secondary execution triggers
    const backupCheck = setInterval(() => {
      if (document.body) {
        executeCorrection();
        clearInterval(backupCheck);
      }
    }, 100);
    
    window.addEventListener('load', executeCorrection);
  }

  // Start the script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();