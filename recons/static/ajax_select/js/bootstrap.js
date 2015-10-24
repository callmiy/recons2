// load jquery and jquery-ui if needed
// into window.jQuery
if (typeof window.jQuery === 'undefined') {
  document.write('<script type="text/javascript"  src="/static/jquery/dist/jquery.min.js"><\/script><script type="text/javascript"  src="/static/jquery-ui/jquery-ui.min.js"><\/script><link rel="stylesheet" href="/static/jquery-ui/themes/smoothness/jquery-ui.min.css" />');
} else if (typeof window.jQuery.ui === 'undefined' || typeof window.jQuery.ui.autocomplete === 'undefined') {
  document.write('<script type="text/javascript"  src="/static/js/jquery-ui-1.10.4.min.js"><\/script><link type="text/css" rel="stylesheet" href="/static/css/ui-lightness/jquery-ui-1.10.4.min.css" />');
}
