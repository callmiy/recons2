
/**
 * Created by aademiju on 30/10/2014.
 */

$(function () {
    "use strict";

    var $idUpload = $('#id_upload-lc-register'),
        returnedData = [];

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
});
