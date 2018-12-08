var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/core/watchUtils", "esri/widgets/support/widget", "esri/geometry/support/webMercatorUtils", "esri/request"], function (require, exports, decorators_1, Widget, watchUtils, widget_1, webMercatorUtils, request) {
    "use strict";
    console.log(config);
    var CSS = {
        base: "recenter-tool"
    };
    var wgs = /** @class */ (function (_super) {
        __extends(wgs, _super);
        function wgs() {
            var _this = _super.call(this) || this;
            _this._onViewChange = _this._onViewChange.bind(_this);
            return _this;
        }
        wgs.prototype.postInitialize = function () {
            var _this = this;
            watchUtils.init(this, "view.center, view.interacting, view.scale", function () { return _this._onViewChange(); });
        };
        wgs.prototype.render = function () {
            var _a = this.state, x = _a.x, y = _a.y, scale = _a.scale;
            var lng = webMercatorUtils.xyToLngLat(x, y)[0];
            var lat = webMercatorUtils.xyToLngLat(x, y)[1];
            var options = {
                query: {
                    f: 'json'
                },
                responseType: 'json'
            };
            request("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "," + lng + "&pretty=1&key=" + config.geocoderAPI, options).then(function (response) {
                document.getElementById("city").innerHTML = response.data.results[0].formatted;
                request("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid=" + config.weatherAPI, options).then(function (response) {
                    document.getElementById("weather").innerHTML = response.data.main.temp;
                });
            });
            return (widget_1.tsx("div", { bind: this, class: CSS.base, onclick: this._defaultCenter },
                "City: ",
                widget_1.tsx("p", { id: "city" }, location),
                "Longitude: ",
                widget_1.tsx("p", null, lng.toFixed(3)),
                "Latitude: ",
                widget_1.tsx("p", null, lat.toFixed(3)),
                "Forecast temperature: ",
                widget_1.tsx("p", { id: "weather" })));
        };
        wgs.prototype._onViewChange = function () {
            var _a = this.view, interacting = _a.interacting, center = _a.center, scale = _a.scale;
            this.state = {
                x: center.x,
                y: center.y,
                interacting: interacting,
                scale: scale
            };
        };
        wgs.prototype._defaultCenter = function () {
            this.view.goTo(this.initialCenter);
        };
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], wgs.prototype, "view", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], wgs.prototype, "initialCenter", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], wgs.prototype, "state", void 0);
        wgs = __decorate([
            decorators_1.subclass("esri.widgets.wgs")
        ], wgs);
        return wgs;
    }(decorators_1.declared(Widget)));
    return wgs;
});
//# sourceMappingURL=wgs.js.map