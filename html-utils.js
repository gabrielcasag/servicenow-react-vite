function injectJellyWrappers(inputHTML) {
  const JELLY_WRAPPER_START = `<?xml version="1.0" encoding="utf-8" ?>
  <j:jelly
    trim="false"
    xmlns:j="jelly:core"
    xmlns:g="glide"
    xmlns:j2="null"
    xmlns:g2="null"
  >`;

  const JELLY_WRAPPER_END = `</j:jelly>`;

  return JELLY_WRAPPER_START + inputHTML + JELLY_WRAPPER_END;
}

/**
 * Inject code for ServiceNow production authentication
 * before the end of the head tag.
 */
function injectAuthLogic(inputHTML) {
  const AUTH_LOGIC_CODE = `<!-- handle security token for API requests -->
  <div style="display:none">
    <g:evaluate object="true">
      var session = gs.getSession(); var token = session.getSessionToken(); if
      (token=='' || token==undefined) token = gs.getSessionToken();
    </g:evaluate>
  </div>
  <script>
    window.servicenowUserToken = '$[token]'
  </script>
  <!-- handle security token for API requests -->
  `;

  const headEndIndex = inputHTML.indexOf("</head");

  return (
    inputHTML.substring(0, headEndIndex) +
    AUTH_LOGIC_CODE +
    inputHTML.substring(headEndIndex)
  );
}

function injectJellyDoctype(inputHTML) {
  const DOCTYPE_JELLY = `<g:evaluate> 
      var docType = '&lt;!DOCTYPE HTML&gt;'; 
  </g:evaluate> 
  <g2:no_escape> 
      $[docType] 
  </g2:no_escape>
    `;

  const headIndex = inputHTML.indexOf("<head");

  return (
    inputHTML.substring(0, headIndex) +
    DOCTYPE_JELLY +
    inputHTML.substring(headIndex)
  );
}

function removeHtmlTags(inputHTML) {
  return inputHTML.replace(/(<html>)|(<html.+>)/, "").replace("</html>", "");
}

function removeDocType(inputHTML) {
  return inputHTML
    .replace("<!DOCTYPE html>", "")
    .replace("<!doctype html>", "");
}

function removeDoubleNewlines(inputHTML) {
  return inputHTML.replace(/\s{2,}/gm, "\n");
}

export function decorateIndexHTML(inputHTML) {
  // const indexHTMLContent = fs.readFileSync(pathToHTML, 'utf-8')
  let decoratedHTML = inputHTML;
  decoratedHTML = removeDocType(decoratedHTML);
  decoratedHTML = removeHtmlTags(decoratedHTML);
  decoratedHTML = removeDoubleNewlines(decoratedHTML);
  decoratedHTML = injectJellyWrappers(decoratedHTML);
  decoratedHTML = injectJellyDoctype(decoratedHTML);
  decoratedHTML = injectAuthLogic(decoratedHTML);

  return decoratedHTML;
  // fs.writeFileSync(pathToHTML, decoratedHTML)
}
