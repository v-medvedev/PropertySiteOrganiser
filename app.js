angular.module('myCalendarApp', ['app.controllers', 'ui.calendar', 'ui.bootstrap', 'ngMaterial', 'ngRoute', 'smart-table', 'chart.js', 'ngFileUpload'])

.factory('Excel',function($window){
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format = function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
    return {
        tableToExcel: function(tableId,worksheetName) {
            var table = $(tableId),
                ctx = {
                    worksheet: worksheetName,
                    table: table.html()
                },
                href = uri + base64(format(template,ctx));
            return href;
        }
    };
})

.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}])

.config(function ($routeProvider, $httpProvider) {

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $routeProvider
    .when('/', {
        templateUrl: 'Calendar.html',
        controller: 'myCalendarCtrl'
    })
    .when('/database', {
        templateUrl: 'Database.html',
        controller: 'myCalendarCtrl'
    })
    .when('/database2', {
        templateUrl: 'Database2.html',
        controller: 'myCalendarCtrl'
    })
    .when('/charts', {
        templateUrl: 'Charts.html',
        controller: 'myCalendarCtrl'
    });

});