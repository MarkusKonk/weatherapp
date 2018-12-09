import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import watchUtils = require("esri/core/watchUtils");

import { renderable, tsx } from "esri/widgets/support/widget";

import Point = require("esri/geometry/Point");
import MapView = require("esri/views/MapView");
import webMercatorUtils = require("esri/geometry/support/webMercatorUtils");
import request = require("esri/request");

type Coordinates = Point | number[] | any;

interface Center {
  x: number;
  y: number;
}

interface State extends Center {
  interacting: boolean;
  scale: number;
}

interface Style {
  textShadow: string;
}

const CSS = {
  base: "recenter-tool"
};

@subclass("esri.widgets.wgs")
class wgs extends declared(Widget) {

  constructor() {
    super();
    this._onViewChange = this._onViewChange.bind(this)
  }

  postInitialize() {
    watchUtils.init(this, "view.center, view.interacting, view.scale", () => this._onViewChange());
  }

  @property()
  @renderable()
  view: MapView;

  @property()
  @renderable()
  initialCenter: Coordinates;

  @property()
  @renderable()
  state: State;

  render() {
    const { x, y, scale } = this.state;
    var lng = webMercatorUtils.xyToLngLat(x, y)[0];
    var lat = webMercatorUtils.xyToLngLat(x, y)[1];
    var options = {
      query: {
        f: 'json'
      },
      responseType: 'json'
    };
    
    request("https://api.opencagedata.com/geocode/v1/json?q="+lat + "," + lng + "&pretty=1&key=" + config.geocoderAPI, options).then(function(response) {
      document.getElementById("city").innerHTML=response.data.results[0].formatted;
      request("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&appid=" + config.weatherAPI, options).then(function(response){
        document.getElementById("weather").innerHTML=response.data.main.temp;
      });
    });

    return (
      <div
        bind={this}
        class={CSS.base}
        onclick={this._defaultCenter}>
        City: <p id="city">{location}</p>
        Longitude: <p>{lng.toFixed(3)}</p>
        Latitude: <p>{lat.toFixed(3)}</p>
        Forecast temperature: <p id="weather">{}</p>
      </div>
    );
  }

  private _onViewChange() {
    let { interacting, center, scale } = this.view;
    
    this.state = {
      x: center.x,
      y: center.y,
      interacting,
      scale
    };
  }

  private _defaultCenter() {
    this.view.goTo(this.initialCenter);
  }
}

export = wgs;