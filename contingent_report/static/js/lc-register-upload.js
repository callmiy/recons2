$(function () {
    "use strict";

    var $uploadText, $mf, $estbDate, $lcNo, $appl, $bene,
        $advBank, $ccy, $amount, $expDate, $brn;
    $mf = $('#mf');
    $estbDate = $('#estb-date');
    $lcNo = $('#lc-no');
    $appl = $('#appl');
    $bene = $('#bene');
    $advBank = $('#adv_bank');
    $ccy = $('#ccy');
    $amount = $('#amount');
    $expDate = $('#exp_date');
    $brn = $('#brn');

    $uploadText = $('#id_upload-lc-register')
        .on('input', function () {
            var $elm, val, firstNewLineIndex, headers, headerText, colAlphas, validator, headerRegexp;

            validator = {
                isMf: function (text) {
                    return text.indexOf('Form') >= 0 && text.indexOf('M') >= 0;
                },

                isEstbDate: function (text) {
                    return text.indexOf('Establishment') >= 0 && text.indexOf('Date') >= 0;
                },

                isLcNo: function (text) {
                    return text.indexOf('LC') >= 0 && text.indexOf('No') >= 0;
                },

                isAppl: function (text) {
                    return text.indexOf('Name') >= 0 && text.indexOf('Importer') >= 0;
                },

                isBene: function (text) {
                    return text.indexOf('Beneficiary') >= 0;
                },

                isAdvBank: function (text) {
                    return text.indexOf('Advising') >= 0 && text.indexOf('Bank') >= 0;
                },

                isCcy: function (text) {
                    return text.indexOf('LC Currency') >= 0;
                },

                isAmount: function (text) {
                    return text.indexOf('LC') >= 0 && text.indexOf('Amount') >= 0;
                },

                isExpDate: function (text) {
                    return text.indexOf('Expiry Date') >= 0;
                },

                isBrn: function (text) {
                    return text.indexOf('Customer Branch') >= 0;
                }
            };

            colAlphas = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
                'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'];

            $elm = $(this);
            val = $elm.val().trim();
            $elm.val(val);
            firstNewLineIndex = val.indexOf('\n');
            headerRegexp = /^S\/N.+\n?.+\n/.exec(val)[0];
            headers = headerRegexp.split('\t');

            for (var i = 0; i < headers.length; i++) {
                headerText = headers[i];

                switch (true) {
                    case validator.isMf(headerText):
                        $mf.val(colAlphas[i]).trigger('can-enable-submit-btn');
                        break;

                    case validator.isEstbDate(headerText):
                        $estbDate.val(colAlphas[i]).trigger('can-enable-submit-btn');
                        break;

                    case validator.isLcNo(headerText):
                        $lcNo.val(colAlphas[i]).trigger('can-enable-submit-btn');
                        break;

                    case validator.isAppl(headerText):
                        $appl.val(colAlphas[i]).trigger('can-enable-submit-btn');
                        break;

                    case validator.isBene(headerText):
                        $bene.val(colAlphas[i]).trigger('can-enable-submit-btn');
                        break;

                    case validator.isAdvBank(headerText):
                        $advBank.val(colAlphas[i]).trigger('can-enable-submit-btn');
                        break;

                    case validator.isAmount(headerText):
                        $amount.val(colAlphas[i]).trigger('can-enable-submit-btn');
                        break;

                    case validator.isCcy(headerText):
                        $ccy.val(colAlphas[i]).trigger('can-enable-submit-btn');
                        break;

                    case validator.isExpDate(headerText):
                        $expDate.val(colAlphas[i]).trigger('enabled');
                        break;

                    case validator.isBrn(headerText):
                        $brn.val(colAlphas[i]).trigger('enabled');
                        break;
                }
            }
        });

    $('.column-inputs input')
        .on('keypress', function (evt) {
            var key, elm, val;

            key = evt.which;

//			only letters [a-zA-Z] are allowed. All other keys are ignored
            if (key === 0 || key === 8 || (15 < key && key < 19) ||
                (37 <= key && key <= 40) || (91 <= key && key <= 96)) {
                return false;
            }

            if (!(65 <= key && key <= 122)) {
                return false;
            }

            elm = $(this);
            val = elm.val();
//			this fields allow users to input only one letter
//			I wanted to use val.length > 1 (which is what makes sense),
//          but somehow 'keypress' seems to be lagging
            if (val.length > 0) {
                return false;
            }
        })
        .on('keyup', function () {
            var elm, val;
            elm = $(this);
            val = elm.val().toLowerCase();
            elm.val(val);
        });

    $('input[type=submit]').on('enabled', function () {
        console.log('submit btn triggered');
        $(this).prop('disabled', false);
    });

});
