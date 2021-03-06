(function () {
    'use strict';

    angular.module('ariaNg').factory('ariaNgMonitorService', ['$filter', '$translate', 'moment', 'ariaNgConstants', function ($filter, $translate, moment, ariaNgConstants) {
        var storagesInMemory = {};
        var globalStorageKey = 'global';

        var getStorageCapacity = function (key) {
            if (key === globalStorageKey) {
                return ariaNgConstants.globalStatStorageCapacity;
            } else {
                return ariaNgConstants.taskStatStorageCapacity;
            }
        };

        var initStorage = function (key) {
            var data = {
                legend: {
                    show: false
                },
                grid: {
                    x: 50,
                    y: 10,
                    x2: 10,
                    y2: 10
                },
                tooltip: {
                    show: true,
                    formatter: function (params) {
                        if (params[0].name === '') {
                            return '<div>' + $translate.instant('No Data') + '</div>';
                        }

                        var time = moment(params[0].name, 'X').format('HH:mm:ss');
                        var uploadSpeed = $filter('readableVolumn')(params[0].value) + '/s';
                        var downloadSpeed = $filter('readableVolumn')(params[1].value) + '/s';

                        return '<div>' + time + '</div>'
                            + '<div><i class="icon-download fa fa-arrow-down"></i> ' + downloadSpeed +'</div>'
                            + '<div><i class="icon-upload fa fa-arrow-up"></i> ' + uploadSpeed + '</div>';
                    }
                },
                xAxis: {
                    data: [],
                    type: 'category',
                    boundaryGap: false,
                    axisLabel: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: function (value) {
                            return $filter('readableVolumn')(value, 0);
                        }
                    }
                },
                series: [{
                    type: 'line',
                    areaStyle: {
                        normal: {
                            opacity: 0.1
                        }
                    },
                    smooth: true,
                    symbolSize: 6,
                    showAllSymbol: false,
                    data: []
                }, {
                    type: 'line',
                    areaStyle: {
                        normal: {
                            opacity: 0.1
                        }
                    },
                    smooth: true,
                    symbolSize: 6,
                    showAllSymbol: false,
                    data: []
                }]
            };

            var timeData = data.xAxis.data;
            var uploadData = data.series[0].data;
            var downloadData = data.series[1].data;

            for (var i = 0; i < getStorageCapacity(key); i++) {
                timeData.push('');
                uploadData.push('');
                downloadData.push('');
            }

            storagesInMemory[key] = data;

            return data;
        };

        var isStorageExist = function (key) {
            return angular.isDefined(storagesInMemory[key]);
        };

        var pushToStorage = function (key, stat) {
            var storage = storagesInMemory[key];
            var timeData = storage.xAxis.data;
            var uploadData = storage.series[0].data;
            var downloadData = storage.series[1].data;

            if (timeData.length >= getStorageCapacity(key)) {
                timeData.shift();
                uploadData.shift();
                downloadData.shift();
            }

            timeData.push(stat.time);
            uploadData.push(stat.uploadSpeed);
            downloadData.push(stat.downloadSpeed);
        };

        var getStorage = function (key) {
            return storagesInMemory[key];
        };

        var removeStorage = function (key) {
            delete storagesInMemory[key];
        };

        return {
            recordStat: function (key, stat) {
                if (!isStorageExist(key)) {
                    initStorage(key);
                }

                stat.time = moment().format('X');
                pushToStorage(key, stat);
            },
            getStatsData: function (key) {
                if (!isStorageExist(key)) {
                    initStorage(key);
                }

                return getStorage(key);
            },
            getEmptyStatsData: function (key) {
                if (isStorageExist(key)) {
                    removeStorage(key);
                }

                return this.getStatsData(key);
            },
            recordGlobalStat: function (stat) {
                return this.recordStat(globalStorageKey, stat);
            },
            getGlobalStatsData: function () {
                return this.getStatsData(globalStorageKey);
            }
        }
    }]);
}());
