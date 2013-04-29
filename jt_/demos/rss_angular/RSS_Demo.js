angular.module('RSS_Demo', ['ngSanitize', 'jt_AJS'])

	.config(function($routeProvider) {
		$routeProvider
			.when('/', { templateUrl: "list_view.html", controller: 'ListCtrl' } )
			.when('/detail', { templateUrl: "detail_view.html", controller: 'DetailCtrl' } )
			.when('/choose_feed', { templateUrl: "choose_feed.html", controller: 'FeedCtrl' } )
			.otherwise({redirectTo: '/'})
	})

	.service('rssFeed', function($q, $rootScope) {
		this.get = function(url, maxItems) {
			var d = $q.defer();
			var feed = new google.feeds.Feed(url);
			feed.setNumEntries(maxItems);
			feed.load(function(result) {
				$rootScope.$apply(d.resolve(result));
			});
			return d.promise;
		}
	})

	.controller('AppCtrl', function($scope, $location, $timeout, jt_AJS_LocalStorage, rssFeed) {
		$scope.prefs = {};
		$scope.defaultPrefs = {
			maxItems: 10,
			feedList: [
				'http://feeds.feedburner.com/TEDTalks_video',
				'http://feeds.nationalgeographic.com/ng/photography/photo-of-the-day/',
				'http://sfbay.craigslist.org/eng/index.rss',
				'http://www.slate.com/blogs/trending.fulltext.all.10.rss',
				'http://feeds.current.com/homepage/en_US.rss',
				'http://feeds.current.com/items/popular.rss',
				'http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml'
			]
		};

		$scope.prefsKey = 'RSS_feed_list';

		jt_AJS_LocalStorage.get($scope.prefsKey).then(
			function(prefs) {
				console.log("local storage", prefs);
				$scope.prefs = prefs;
				$scope.loadFeed($scope.prefs.feedList[0]);
			},
			function() {
				console.log("local storage empty", $scope.defaultPrefs);
				$scope.prefs = $scope.defaultPrefs;
				$scope.loadFeed($scope.prefs.feedList[0]);
			}
		)

		$scope.setLoading = function(loading) {
			$scope.isLoading = loading;
		}

		$scope.loadFeed = function(url, addFeed) {
			$scope.setLoading(true);
			rssFeed.get(url, $scope.prefs.maxItems).then(function(result) {
				//console.log(result);
				if (result.error) {
					alert("ERROR " + result.error.code + ": " + result.error.message + "\nurl: " + url);
					$scope.setLoading(false);
				}
				else {
					if (addFeed) addFeed();
					var urlParser = document.createElement('a');
					urlParser.href = result.feed.link;
					result.feed.viewAt = urlParser.hostname;
					$scope.feed_result = result.feed;
					$scope.jt_AJS.scrollClear('/');
					$location.path('/');
					if ($scope.feed_result.entries == 0) {
						$scope.setLoading(false);
					}
				}
			});
		}

		$scope.mediaOne = function(entry) { // return first media object for 'entry'
			return (entry && entry.mediaGroups) ? entry.mediaGroups[0].contents[0] : {url:''};
		}

		$scope.hasVideo = function(entry) {
			var media = $scope.mediaOne(entry);
			return media.type ? (media.type == "video/mp4") : (media.url ? (media.url.indexOf(".mp4") != -1) : false);
		}

		$scope.ifPathNot = function(path) {
			return $location.path() != path;
		}

		$scope.beenViewed = function(entry) {
			return entry.wasViewed ? 'beenViewed' : '';
		}

		$scope.setCurrEntry = function(entry) {
			$scope.currEntry = entry;
		}

	})

	.controller('ListCtrl', function($scope, $location, $timeout) {
		$scope.layoutDone = function() {
			console.log('layoutDone');
			$scope.setLoading(false);
			$timeout(function() { $('a[data-toggle="tooltip"]').tooltip(); }, 0); // wait for DOM
		}

		$scope.viewDetail = function(entry) {
			entry.wasViewed = true;
			$scope.setCurrEntry(entry);
			$location.path('/detail');
		}
	})

	.controller('DetailCtrl', function($scope, $location) {
		$scope.jt_AJS.scrollClear($location.path());

		$scope.vPlayer = $('#vPlayer')[0];
		$scope.videoPlay = $scope.hasVideo($scope.currEntry); // show errors only after "Play" video
		$($scope.vPlayer).on('error', function() {
			if ($scope.videoPlay) {
				$scope.vidTagAlert.show();
			}
		});

		$scope.vidTagAlert = $('#vidTagAlert');
		$('#btnTagAlert').on('click', function() {
			$scope.vidTagAlert.hide();
		});

		$scope.videoStop = function() {
			$scope.vPlayer.pause();
		}
	})

	.controller('FeedCtrl', function($scope, $timeout, jt_AJS_LocalStorage) {
		$scope.addFeed = function() {
			var http = "http://";
			var url = $scope.newFeedUrl;
			if (url.indexOf(http) == -1) {
				url = http + url; // add http if missing
			}
			$scope.loadFeed(url, function() {
				$scope.prefs.feedList.unshift(url); // add to list of feeds
				jt_AJS_LocalStorage.set($scope.prefsKey, $scope.prefs);
			});
		}

		$scope.removeFeed = function(idx) {
			$scope.prefs.feedList.splice(idx, 1);
			jt_AJS_LocalStorage.set($scope.prefsKey, $scope.prefs);
		}

		$scope.chooseFeed = function(idx) {
			$scope.prefs.feedList.splice(0, 0, $scope.prefs.feedList.splice(idx, 1)[0]); // move to top
			jt_AJS_LocalStorage.set($scope.prefsKey, $scope.prefs);
			$scope.loadFeed($scope.prefs.feedList[0]);
		}

		$scope.layoutDone = function() {
			$timeout(function() { $('a[data-toggle="tooltip"]').tooltip(); }, 0); // wait for DOM
		}
	})
