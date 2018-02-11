import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: Object.create(null),
      current: 0,
      citys: [
        {
          city: 'Tokyo',
          woeid: '1118370'
        },
        {
          city: 'New York',
          woeid: '2459115'
        },
        {
          city: 'London',
          woeid: '44418'
        }
      ]
    };
    this.handleChange = this.handleChange.bind(this);
    this.fetchWeather(this.state.citys[this.state.current].woeid);
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

  handleChange(event) {
    this.setState({current: event.target.value}, () => {
      this.fetchWeather(this.state.citys[this.state.current].woeid);
    });
  }

  render() {
    const citys = this.state.citys.map((info, index) => {
      return (
        <option value={index} key={index}> {info.city} </option>
      )
    })

    return (
      <div className="weather">
        <div className="weather-select">
          <label>
             Pick one city:
             <select value={this.state.current} onChange={this.handleChange}>
               {citys}
             </select>
           </label>
        </div>
        <div className="weather-city">
          {this.state.citys[this.state.current].city}
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
