$(function () {
    "use strict";

    var $idUpload = $('#id_upload-lc-register'),
        returnedData = [];

    var $amountInCents = $('[name=amount-cents]');

    $idUpload.on('input', function () {
        var results = Papa.parse($idUpload.val().trim(), {delimiter: '\t', header: true}).data;

        for (var i = 0; i < results.length; i++) {
            var obj = results[i],
                returnedObj = {};
            for (var key in obj) {
                if (key in mappings) {
                    var mappingsVal = mappings[key];
                    returnedObj[mappingsVal] = obj[key].trim();
                }
            }
            returnedData.push(returnedObj);
        }
        $idUpload.val(JSON.stringify(returnedData));
    });

    $('.upload-lc-register-form').submit(function (evt) {

        if (!$amountInCents.is(':checked') && !window.confirm('Amount is not in cents?')) evt.preventDefault();
    })
});
