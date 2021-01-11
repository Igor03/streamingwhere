var app = angular.module('app', ['caph.ui', 'caph.focus']);

var url = "https://apis.justwatch.com/content/titles/pt_BR/popular?body=%7B%22fields%22:[%22cinema_release_date%22,%22full_path%22,%22full_paths%22,%22id%22,%22localized_release_date%22,%22object_type%22,%22poster%22,%22scoring%22,%22title%22,%22tmdb_popularity%22,%22backdrops%22,%22offers%22,%22original_release_year%22,%22backdrops%22],%22enable_provider_filter%22:false,%22query%22:%22{nameof}%22,%22monetization_types%22:[],%22page%22:1,%22page_size%22:20,%22matching_offers_only%22:false%7D&language=pt";
var imagesBaseUrl = "https://images.justwatch.com";
var descriptionUrl = "https://apis.justwatch.com/content/titles/movie/{itemId}/locale/pt_BR?language=pt"
var urlProviders = "https://apis.justwatch.com/content/providers/locale/pt_BR";


var profile = "s166";
var iconProviderProfile = "s100";




app.controller('MainController', ['$scope', 'focusController', '$http', function ($scope, focusController, $http) {

    $scope.formatedResults = []
    var providers = []

    $scope.selectedItemDescription = undefined;
    $scope.focusedItem = undefined;

    $scope.getTemplatePath = function (templateName) {

        var _templateName = templateName.toLowerCase();
        var templatePath = 'views/';
        switch (_templateName) {
            case 'header':
                templatePath += 'header.html';
                break;
            case 'footer':
                templatePath += 'footer.html';
                break;
            case 'searchbar':
                templatePath += 'searchBar.html';
                break;
            case 'searchresults':
                templatePath += 'searchResults.html';
                break;
            case 'itemdetail':
                templatePath += 'itemDetail.html';
                break;
            default:
                templatePath += 'holder.html';
        }
        return templatePath;
    };


    $http.get(urlProviders).then(function (response) {
        data = response.data;
        for (var i = 0; i < data.length; i++) {
            providers.push({
                id: data[i].id,
                name: data[i].clear_name,
                iconUrl: imagesBaseUrl + data[i].icon_url.replace('{profile}', iconProviderProfile)
            });
        }
    });

    $scope.change = function (value) {
        // console.log(providers.find(obj => obj.id === 47))
        $scope.teste = url.replace('{nameof}', formatQuery(value))
        $http.get(url.replace('{nameof}', formatQuery(value))).then(function (response) {
            $scope.step = response.data
            $scope.formatedResults = []
            for (var i = 0; i < response.data.items.length; i++) {
                _offers = response.data.items[i].offers;
                $scope.formatedResults.push({
                    title: response.data.items[i].title,
                    poster: imagesBaseUrl + response.data.items[i].poster.replace("{profile}", "s166"),
                    providers: _offers === undefined ? [] : getProviers(_offers),
                    id: response.data.items[i].id
                });
            };
            console.log($scope.formatedResults)
            $('caph-list').trigger('reload');
        });
    };

    $scope.loadDetails = function (item) {
        $scope.focusedItem = item
        $http.get(descriptionUrl.replace('{itemId}', item.id)).then(function (response) {
            $scope.focusedItem.description = response.data.short_description === undefined ?
                "Indisponivel" : response.data.short_description;
        });
        return $scope.focusedItem
    }

    formatQuery = function (queryName) {
        console.log(queryName)
        if (queryName === undefined || queryName.trim() === "") return "";
        var auxQueryName = queryName.split(" ");
        var newQueryName = "";
        for (var i = 0; i < auxQueryName.length; i++) {
            if (auxQueryName[i] !== "")
                newQueryName = newQueryName + "+" + auxQueryName[i];
        };
        // console.log(newQueryName.replaceAll(' ', '+').replace('+', ''))
        return newQueryName.replace('+', '');
    }

    getProviers = function (offers) {
        var _providers = []
        for (var i = 0; i < offers.length; i++) {
            _provider = providers.find(obj => obj.id === offers[i].provider_id);
            if (!_providers.includes(_provider)) {
                _providers.push(_provider);
            }
        }
        return _providers;
    }

    $scope.focus = function ($event, $originalEvent, item) {
        var _lastSelectedIndex = $event.currentTarget.id;
        $($event.currentTarget).css({
            border: "5px solid #0054A5",
            opacity: "0.7",
            "border-radius": "20px"
        });
    };

    $scope.blur = function ($event, $originalEvent) {
        $($event.currentTarget).css({
            border: "",
            "background-color": "",
            opacity: "1"
        });
    };


}]);