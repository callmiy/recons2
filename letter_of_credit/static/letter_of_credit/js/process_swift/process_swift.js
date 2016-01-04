$(function () {
  "use strict";

  var $processSwift = document.getElementById('process-swift')
  var $messageArea = $('.message-area')

  $('#process-swift-form').submit(function (evt) {
    evt.preventDefault()
    var file = $processSwift.files[0]
    if (!file) return

    var reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function (e) {
      var $swift = $(e.target.result.trim())

      var $obj
      for (var i = 0; i < $swift.size(); i++) {
        $obj = $($swift[i])
        if ($obj.is('table')) break
        $obj = null
      }

      if (!$obj) {
        window.alert('No table selector found, exiting...')
        return
      }

      var messageSelector = [
        "div:contains(F20: Transaction Reference Number)",
        "div:contains(F20: Sender's Reference)",
        "div:contains(F20: Documentary Credit Number)"
      ].join(',')

      $obj.find("div[id^=AUTOGENBOOKMARK_]:contains(Start of Message)").each(function () {
        var $td = $(this).parent()
        var type = $td.find('div:contains(fin.)').text()
        var $receiver = getInner($td, "div[id^=AUTOGENBOOKMARK_]:contains(Receiver Institution)")
        var receiverBic = $receiver.text()
        var receiverName = getInner($receiver.parent().next(), "div[id^=AUTOGENBOOKMARK_]:contains(Expansion:)", true)
        var ourRef = getInner($td, "div[id^=AUTOGENBOOKMARK_]:contains(Transaction Reference:)", true)
        var $theirRef = getInner($td, "div[id^=AUTOGENBOOKMARK_]:contains(Related Reference:)")
        var theirRef = $theirRef.size() ? processText($theirRef.text()) : ''
        var id = getInner($td, "div[id^=AUTOGENBOOKMARK_]:contains(Unique Message Identifier:)", true)
        var $finishedTime = getInner($td, "div[id^=AUTOGENBOOKMARK_]:contains(ACK/NAK Reception Date/Time (GMT):)")
        var finishedTime = $finishedTime.size() ? new Date(processText($finishedTime.text()).replace(/\//g, '-')) : null
        var message = processText($td.find(messageSelector).html())

        var $auth = $td.find("td>div:contains(Routed from rp [_MP_authorisation] to rp [_SI_to_SWIFT]; On Processing by Function mpa with result Success;)").eq(0)
        var auth = getOperator($auth)

        var $verifier = $td.find("td>div:contains(Routed from rp [_MP_verification] to rp [_MP_authorisation]; On Processing by Function mpa with result Success;)")
        var verifierSize = $verifier.size()
        var verifier = verifierSize ? getOperator($verifier.eq(verifierSize - 1)) : ''

        var $modifier = $td.find("td>div:contains(Routed from rp [_MP_creation] to rp [_MP_verification]; On Processing by Function mpc with result Success;)")
        var modifierSize = $modifier.size()
        var modifier = modifierSize ? getOperator($modifier.eq(modifierSize - 1)) : ''

        var $deliveryStatus = getInner($td, "div[id^=AUTOGENBOOKMARK_]:contains(Network Delivery Status:)")
        var deliveryStatus = $deliveryStatus.size() ? processText($deliveryStatus.text()) : 'Message has not been authorized'
        console.log(deliveryStatus)
      })
    }
  })

  function getOperator($selection) {
    if (!$selection.size()) return ''
    return getInner($selection.parent(), "div[id^=AUTOGENBOOKMARK_]:contains(Operator:)", true)
  }

  function getInner($context, selector, text) {
    var $selection = $context.find(selector).parent().next().children('div')
    return text ? processText($selection.html()) : $selection
  }

  function processText(html) {
    return html.trim().replace(/<br>/ig, '\n').replace(/&nbsp;/ig, ' ')
  }
})
