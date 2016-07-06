$( function () {
  "use strict";

  var $processSwift = document.getElementById( 'process-swift' )
  var $messageArea = $( '#swift-messages' )
  var $messageArea1 = $( '#swift-messages-20' )

  $( '#process-swift-form' ).submit( function (evt) {
    evt.preventDefault()
    $messageArea.hide().val( '' )

    var file = $processSwift.files[ 0 ]
    if ( !file ) return

    var reader = new FileReader()
    reader.readAsText( file )
    reader.onload = function (e) {
      var $swift = $( e.target.result.trim() )

      var $obj
      for ( var i = 0; i < $swift.size(); i++ ) {
        $obj = $( $swift[ i ] )
        if ( $obj.is( 'table' ) ) break
        $obj = null
      }

      if ( !$obj ) {
        window.alert( 'No table selector found, exiting...' )
        return
      }

      var messageSelector = [
        "div:contains(F20: Transaction Reference Number)",
        "div:contains(F20: Sender's Reference)",
        "div:contains(F20: Documentary Credit Number)"
      ].join( ',' )

      var string = '',
        tabbedStr = 'Message type\tOur ref\tTheir ref\tDelivery Status\tAck Time\tValue Date\tCurrency\tAmount\t' +
          'Debit Bank\tDebit A/C\tIntermediary\tAccount With Institution Bank\tAccount With Institution A\C\t' +
          'Beneficiary Institution Bank\tBeneficiary Institution A/C\tDeal No.\n'

      $obj.find( "div[id^=AUTOGENBOOKMARK_]:contains(Start of Message)" ).each( function () {
        var $td = $( this ).parent()
        var type = $td.find( 'div:contains(fin.)' ).text()
        var $receiver = getInner( $td, "div[id^=AUTOGENBOOKMARK_]:contains(Receiver Institution)" )
        var receiverBic = $receiver.text()
        //var receiverName = getInner( $receiver.parent().next(), "div[id^=AUTOGENBOOKMARK_]:contains(Expansion:)",
        // true )
        var ourRef = getInner( $td, "div[id^=AUTOGENBOOKMARK_]:contains(Transaction Reference:)", true )
        var $theirRef = getInner( $td, "div[id^=AUTOGENBOOKMARK_]:contains(Related Reference:)" )
        var theirRef = $theirRef.size() ? processText( $theirRef.text() ) : ''
        //var id = getInner( $td, "div[id^=AUTOGENBOOKMARK_]:contains(Unique Message Identifier:)", true )
        var $finishedTime = getInner( $td, "div[id^=AUTOGENBOOKMARK_]:contains(ACK/NAK Reception Date/Time (GMT):)" )
        var finishedTime = $finishedTime.size() ? new Date( processText( $finishedTime.text() ).replace( /\//g, '-' ) ) : null
        var message = processText( $td.find( messageSelector ).html() )

        var $auth = $td.find( "td>div:contains(Routed from rp [_MP_authorisation] to rp [_SI_to_SWIFT]; On Processing by Function mpa with result Success;)" ).eq( 0 )
        var auth = getOperator( $auth )

        var $verifier = $td.find( "td>div:contains(Routed from rp [_MP_verification] to rp [_MP_authorisation]; On Processing by Function mpa with result Success;)" )
        var verifierSize = $verifier.size()
        var verifier = verifierSize ? getOperator( $verifier.eq( verifierSize - 1 ) ) : ''

        var $modifier = $td.find( "td>div:contains(Routed from rp [_MP_creation] to rp [_MP_verification]; On Processing by Function mpc with result Success;)" )
        var modifierSize = $modifier.size()
        var modifier = modifierSize ? getOperator( $modifier.eq( modifierSize - 1 ) ) : ''

        var $deliveryStatus = getInner( $td, "div[id^=AUTOGENBOOKMARK_]:contains(Network Delivery Status:)" )
        var deliveryStatus = $deliveryStatus.size() ? processText( $deliveryStatus.text() ) : 'Message has not been authorized'

        string += type + '\n' + receiverBic + '\n' + ourRef + '\n' + theirRef + '\n' + '\n' +
          message + '\n\nInput by:\t         ' + modifier + '\nVerified by:\t  ' + verifier +
          '\nAuthorized by:\t  ' + auth + '\nAuthorization completed at:\t' + finishedTime +
          '\nDelivery status:\t' + deliveryStatus + '\n================================================\n\n\n\n'

        if ( type === 'fin.200x' || type === 'fin.202x' ) {
          var msg = (type === 'fin.200') ? extractFields200( message ) : extractFields202( message )

          var keys = [
            'date', 'ccy', 'amount', 'debitBank', 'debitAcct', 'intermediary', 'acctWithBank', 'acctWithAcct',
            'beneBank', 'beneAcct', 'dealNo'
          ]

          var str = ''

          keys.forEach( function (key) {
            str += key === 'debitBank' ? receiverBic : (msg[ key ] || '').trim()
            str += '\t'
          } )

          finishedTime = finishedTime ? finishedTime.toString().replace( /:\d+\s*GMT.+/, '' ) : ''
          tabbedStr += type + '\t' + ourRef + '\t' + theirRef + '\t' + deliveryStatus + '\t' + finishedTime + '\t' +
            str + '\n'
        }
      } )

      $messageArea.show().val( string )
      $messageArea1.show().val( tabbedStr )
    }
  } )

  function getOperator($selection) {
    if ( !$selection.size() ) return ''
    return getInner( $selection.parent(), "div[id^=AUTOGENBOOKMARK_]:contains(Operator:)", true )
  }

  function getInner($context, selector, text) {
    var $selection = $context.find( selector ).parent().next().children( 'div' )
    return text ? processText( $selection.html() ) : $selection
  }

  function processText(html) {
    return html.trim().replace( /<br>/ig, '\n' ).replace( /&nbsp;/ig, ' ' )
  }

  /**
   *
   * @param {String} message
   */
  function extractFields200(message) {
    var pattern = new RegExp(
      "F32A: Value Date, Currency Code, Amount[.\\s]*" +
      "Date:\\s+\\d+\\s+(\\d{4}\\s+[a-zA-Z]+\\s+\\d+)[.\\s]*" + // extract date
      "Currency:\\s+([A-Z]{3})\\s+.+\\s*" +  //extract currency
      "Amount:\\s+([\\d,]+)\\s+.+\\s*" + // amount
      "F53B: Sender's Correspondent(?: - Party Identifier - Location)?\\s*" +
      "Party Identifier:\\s+/(.+)\\s*" + // account to debit
      "F57A: Account With Institution - Party Identifier - Identifier Code\\s*" +
      "Party Identifier:\\s*/(.+)\\s*" + // field 57A a/c
      "Identifier Code:\\s*(.+)\\s*[\\s\\S]+" + // field 57A bank
      "Narrative[\\s\\S]+?((?:\\d+/)?\\d{3,})" // deal slip no.
    )

    var exec = pattern.exec( message )

    if ( exec ) {
      return {
        date: exec[ 1 ],
        ccy: exec[ 2 ],
        amount: exec[ 3 ].replace( ',', '.' ),
        debitAcct: exec[ 4 ],
        beneAcct: exec[ 5 ],
        beneBank: exec[ 6 ],
        dealNo: exec[ 7 ]
      }
    }

    return {}
  }

  /**
   *
   * @param {String} message
   */
  function extractFields202(message) {
    var pattern = new RegExp(
      "F32A: Value Date, Currency Code, Amount[.\\s]*" +
      "Date:\\s+\\d+\\s+(\\d{4}\\s+[a-zA-Z]+\\s+\\d+)[.\\s]*" + // extract date
      "Currency:\\s+([A-Z]{3})\\s+.+\\s*" +  //extract currency
      "Amount:\\s+([\\d,]+)\\s+.+\\s*" + // amount
      "F53B: Sender's Correspondent - Party Identifier - Location\\s*" +
      "Party Identifier:\\s+/(.+)\\s*" + // account to debit
      "(?:F56A: Intermediary - Party Identifier - Identifier Code\\s+Identifier Code:\\s+(\\S+)\\s+)?" + // field 56a
      "[\\s\\S]+?F57A: Account With Institution - Party Identifier - Identifier Code\\s*" +
      "(?:Party Identifier:\\s*/(.+))?" + // field 57A a/c
      "[\\s\\S]+?Identifier Code:\\s*(.+)\\s*[\\s\\S]+" + // field 57A bank
      "F58A: Beneficiary Institution - Party Identifier - Identifier Code\\s+" +
      "(?:Party Identifier:\\s*/(\\S+))?" + // field 58A a/c
      "[\\s\\S]+?Identifier Code:\\s*(.+)\\s*[\\s\\S]+" + // field 58A bank
      "Narrative[\\s\\S]+?((?:\\d+/)?\\d{3,})" // deal slip no.
    )

    var exec = pattern.exec( message )

    if ( exec ) {
      return {
        date: exec[ 1 ],
        ccy: exec[ 2 ],
        amount: exec[ 3 ].replace( ',', '.' ),
        debitAcct: exec[ 4 ],
        intermediary: exec[ 5 ],
        acctWithAcct: exec[ 6 ],
        acctWithBank: exec[ 7 ],
        beneAcct: exec[ 8 ],
        beneBank: exec[ 9 ],
        dealNo: exec[ 10 ]
      }
    }

    return {}
  }
} )
