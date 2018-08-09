app.controller('SiteOwners_Ctrl', function ($scope, $uibModalInstance, $timeout) {
    
    $scope.exportSingleLetter = function(owner) {
        
        var fileType = $scope.params.fileType;
        var templateUrl = '';
        var letterIndex = '';
        var dayEvents = [];

        switch (fileType) {
            case 'letter1':
                if (owner.templateLetter1 == 'Land Agent Land Assembly Approach') {
                    templateUrl = 'templates/Land Agent Land Assembly Approach.docx';
                } else if (owner.templateLetter1 == 'Land Agent Approach') {
                    templateUrl = 'templates/Land Agent Approach.docx';
                } else if (owner.templateLetter1 == 'Partnership Approach') {
                    templateUrl = 'templates/Partnership Approach.docx';
                } else if (owner.templateLetter1 == 'Partnership Approach Land Assembly') {
                    templateUrl = 'templates/Partnership Approach Land Assembly.docx';
                } else if (owner.templateLetter1 == 'Partnership Approach Land Title Split') {
                    templateUrl = 'templates/Partnership Approach Land Title Split.docx';
                }
                letterIndex = 'L1';
                break;
            case 'letter2':
                templateUrl = 'templates/8 Week Land Agent Approach.docx';
                letterIndex = 'L2';
                break;
            case 'letter3':
                templateUrl = 'templates/16 Week Letter 3.docx';
                letterIndex = 'L3';
                break;
            case 'letter4':
                templateUrl = 'templates/stage4.docx';
                letterIndex = 'L4';
                break;
            case 'letter5':
                templateUrl = 'templates/stage5.docx';
                letterIndex = 'L5';
                break;
        }

        var parts = owner.individualsNames.split(' ');
        var title = parts[0];
        if (title.toUpperCase() == 'MR' || title.toUpperCase() == 'MS' || title.toUpperCase() == 'MRS' || title.toUpperCase() == 'MISS') {
            var lastName = parts.pop();
            title = title + ' ' + lastName;
        } else {
            title = owner.individualsNames;
        }
        var pre = '<w:p><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:rFonts w:ascii="Verdana" w:hAnsi="Verdana" w:cs="Verdana"/><w:t>';
        var post = '</w:t></w:r></w:p>';
        var lineBreak = '<w:br/>';

        var CC_Owners = $scope.params.owners.filter(function(item) {
            return (item.id != owner.id);
        });
        var CC = [];
        CC_Owners.map(function(item) {
            CC.push(item.individualsNames);
        });
        
        var owner_address = owner.ownerAddress.replace(new RegExp(', ', 'g'), ',');
        owner_address = pre + owner_address.replace(new RegExp(',', 'g'), lineBreak) + post;
        var companyName = owner.companyName;
        var individualsNames = owner.individualsNames;
        var site_address = owner.siteAddress;

        var letter_date = $scope.params.currentDate;
        letter_date = ('0' + letter_date.getDate()).slice(-2) + '/' + ('0' + (letter_date.getMonth() + 1)).slice(-2) + '/' + letter_date.getFullYear();

        var letter1_date = new Date(owner.stages.letter1);
        letter1_date = ('0' + letter1_date.getDate()).slice(-2) + '/' + ('0' + (letter1_date.getMonth() + 1)).slice(-2) + '/' + letter1_date.getFullYear();

        var letter2_date = new Date(owner.stages.letter2);
        letter2_date = ('0' + letter2_date.getDate()).slice(-2) + '/' + ('0' + (letter2_date.getMonth() + 1)).slice(-2) + '/' + letter2_date.getFullYear();

        var word_data = {
            companyName: companyName,
            individualsNames: individualsNames,
            owner_address: owner_address,
            site_address: site_address,
            letter_date: letter_date,
            letter1_date: letter1_date,
            letter2_date: letter2_date,
            title: $scope.toProperCase(title)
        };
        if (owner.companyName == undefined) {
            owner.companyName = '';
        }
        if (CC.length > 0 && companyName.length > 0) {
            word_data.CC = 'CC: ' + $scope.toProperCase(CC.join(', '));
        } else {
            word_data.CC = '';
        }
        var dateStamp = new Date($scope.params.currentDate);
        dateStamp = ('0' + dateStamp.getDate()).slice(-2) + '.' + ('0' + (dateStamp.getMonth() + 1)).slice(-2) + '.' + dateStamp.getFullYear().toString().substr(-2);
        var postCode = owner.sitePostcode == undefined ? '' : owner.sitePostcode;
        var streetName = owner.streetName == undefined ? '' : owner.streetName;

        var doorNumber = owner.siteAddress.split(' ')[0];
        if (!isNaN(doorNumber.substr(0, 1))) {
            postCode = postCode + ' ' + doorNumber;
        }

        var fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + owner.SiteLogNo + ".docx";
        fileName = fileName.replace("  ", " ");

        $scope.exportWordTemplate(templateUrl, word_data, fileName);
    };
    $scope.exportWordTemplate = function (templateUrl, word_data, fileName) {
        console.log(templateUrl);
        loadFile(templateUrl, function (error, content) {
            if (error) { throw error };
            var zip = new JSZip(content, { type: "uint8array" });
            var doc = new Docxtemplater().loadZip(zip);
            doc.setData(word_data);
            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render()
            }
            catch (error) {
                var e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties
                }
                console.log(JSON.stringify({ error: e }));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
            }
            var out = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }); //Output the document using Data-URI
            saveAs(out, fileName);
        });
    };
    $scope.toProperCase = function (str) {
		str = str.toLowerCase().split(' ');
		for (var i = 0; i < str.length; i++) {
			str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
		}
		return str.join(' ');
	};
    $scope.Close = function () {
        $uibModalInstance.close();
    };
});