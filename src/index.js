import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: Object.create(null),
      city: {
        Tokyo: '1118370',
        'New York': '2459115',
        London: '44418'
      }
    };
    this.fetchWeather(this.state.city['Tokyo'])
  }

  fetchWeather(woeid) {
    const q = `select item.condition from weather.forecast where woeid = ${woeid}`;
    const URL = `https://query.yahooapis.com/v1/public/yql?format=json&q=${encodeURIComponent(q)}`;
    fetch(URL).then((response) => {
      if (response.ok) {
        response.json().then((data)=>{
          this.setState({
            weather: data.query.results.channel.item.condition
          })
        })
      } else {
        console.log(response)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  toCelsius(temperature) {
    return Number.parseInt((temperature - 32) / 1.8, 10);
  }

  render() {
    return (
      <div className="weather">
        <div className="weather-city">
          Tokyo
        </div>
        <div className="weather-desc">
          <div className="weather-icon">
            <img src={`/images/${this.state.weather.code}.svg`} alt="weather icon" />
          </div>
          <div className="weather-info">
            <p> {this.state.weather.text} </p>
            <p> {this.toCelsius(this.state.weather.temp)} °C </p>
          </div>
        </div>
      </div>
    )
  }
}
ReactDOM.render(<Weather />, document.getElementById("root"));
