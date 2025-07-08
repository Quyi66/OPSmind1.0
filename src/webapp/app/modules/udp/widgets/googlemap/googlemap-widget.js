/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/14/2018
 */
(function () {
    'use strict';

    var app = angular.module('oplus.udp');

    app.run(['$q', 'widgetFactory', 'widgetInteraction', 'widgetUiHelper', googlemapWidget]);

    /**
     *
     * @param widgetFactory {widgetFactory}
     * @param widgetInteraction {widgetInteraction}
     * @param widgetUiHelper {widgetUiHelper}
     */
    function googlemapWidget($q, widgetFactory, widgetInteraction, widgetUiHelper) {
        widgetFactory.defineWidget({
            type: 'googlemap',
            name: '谷歌地图',
            group: 'data',
            tag: 'dev',
            configController: GooglemapWidgetConfigCtrl,
            controlRenderer: {
                // 必须，控件的静态模板，类似于定义一个页面的template
                getTemplateForCompilation: getTemplateForCompilation,
                // 可选，用于刷新控件的数据
                // onReloadData: onReloadData,
                // 可选，用于初始化页面控件
                onInitControl: onInitControl
            }
        });

        function GooglemapWidgetConfigCtrl(scope, props) {
            upgradeWidgetProps(props);
        }

        function upgradeWidgetProps(props) {
        }


        /**
         *
         * @param {object} props Widget properties
         * @param {object} props.display Display options
         * @param {object} props.interaction Interaction config
         * @returns {string} HTML
         */
        function getTemplateForCompilation(props) {
            upgradeWidgetProps(props);
            return '<div class="js-googlemap" style="height:400px;">' +
                '<div class="op-blank-slate">' +
                '<div class="op-blank-slate-body">' +
                '<div class="op-blank-slate-icon"><i class="fa fa-4x fa-spin fa-cog"></i></div>' +
                '<p>正在初始化谷歌地图</p>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        /**
         *
         * @param scope
         * @param element
         * @param props
         * @param props.interaction
         */
        function onInitControl(scope, element, props) {
            upgradeWidgetProps(props);
            window.onGoogleReady = function () {
                console.log('Google maps API ready');
            };

            loadGoogleApi().then(function () {
                initMap();
            }).catch(function (err) {
                throw err;
            });

            function initMap() {
                var center = {lat: 41.669782, lng: 105.070944};
                var locations = [
                    {position: {lat: 41.669782, lng: 105.070944}, title: 'A'},
                    {position: {lat: 41.82, lng: 106}, title: 'C'},
                    {position: {lat: 42, lng: 105}, title: 'B'}
                ];
                var zoomLevel = 5;
                var el = element.find('.js-googlemap')[0];
                var map = new google.maps.Map(el, {
                    zoom: zoomLevel,
                    center: center
                });
                locations.forEach(function (location) {
                    new google.maps.Marker({
                        position: location.position,
                        map: map,
                        animation: google.maps.Animation.DROP,
                        title: location.title
                    });
                });
            }

            function loadGoogleApi() {
                var d = $q.defer();
                if (window.googleMapApiLoaded) {
                    d.resolve();
                } else {
                    var googleMapApiKey = 'AIzaSyCefM-ixNVR_xOQZiq4ulEupvpUI9UFamo';
                    showLoading(true);
                    $.getScript('https://maps.googleapis.com/maps/api/js?key=' + googleMapApiKey + '&sensor=false&callback=onGoogleReady')
                        .done(function (script, textStatus) {
                            window.googleMapApiLoaded = true;
                            d.resolve();
                            showLoading(false);
                        })
                        .fail(function (xhr, settings, err) {
                            d.reject(new Error('Cannot load Google maps API'));
                            showLoading(false);
                        });
                }
                return d.promise;

                function showLoading(status) {

                    // var elem = angular.element('<div><i class="fa fa-spin fa-spinner fa-4x"></i><p>正在加载Google地图</p></div>');
                }
            }
        }
    }
})();

