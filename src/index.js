import React from 'react';
import ReactDOM from 'react-dom';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import './index.css';

class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: Object.create(null),
      current: 0,
      show: false,
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
    this.fetchWeather(this.state.citys[this.state.current].woeid);
  }

  fetchWeather(woeid) {
    const q = `select item.condition from weather.forecast where woeid = ${woeid}`;
    const URL = `https://query.yahooapis.com/v1/public/yql?format=json&q=${encodeURIComponent(q)}`;
    fetch(URL).then((response) => {
      if (response.ok) {
        response.json().then((data)=>{
          this.setState({
            weather: data.query.results.channel.item.condition,
            show: !this.state.show
          })
        })
      } else {
        console.log(response);
        this.setState({
          weather: {
            code: 3200,
            text: 'API unavailable!'
          },
          show: !this.state.show
        })
      }
    }).catch((err) => {
      console.log(err);
      this.setState({
        weather: {
          code: 3200,
          text: 'network unavailable!'
        },
        show: !this.state.show
      })
    })
  }

  toCelsius(temperature) {
    return Number.parseInt((temperature - 32) / 1.8, 10);
  }

  handleChange = (event, index, value) => {
    this.setState({
      current: value,
      show: !this.state.show
    }, () => {
      this.fetchWeather(this.state.citys[this.state.current].woeid);
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      show: !this.state.show
    }, () => {
      this.fetchWeather(this.state.citys[this.state.current].woeid);
    });
  }

  render() {
    const citys = this.state.citys.map((info, index) => {
      return (
        <MenuItem value={index} key={index} primaryText={info.city} />
      )
    })

    return (
      <div className="weather">
        <div className="weather-select">
          <MuiThemeProvider>
          <form onSubmit={this.handleSubmit} className="weather-form">
               <DropDownMenu value={this.state.current} onChange={this.handleChange}>
                {citys}
               </DropDownMenu>
               <RaisedButton type="submit" label="Submit" primary={true} />
           </form>
           </MuiThemeProvider>
        </div>
        <div className="weather-content-wrapper">
          <div className={`weather-content ${this.state.show ? 'show' : 'loading'}`}>
            <div className="weather-city">
              {this.state.citys[this.state.current].city}
            </div>
            <div className="weather-desc">
              <div className="weather-icon">
                <img src={this.state.weather.code ? `/images/${this.state.weather.code}.svg` : ''} alt="weather icon" />
              </div>
              <div className="weather-info">
                <p> {this.state.weather.text} </p>
                <p> {this.toCelsius(this.state.weather.temp)} °C </p>
              </div>
            </div>
          </div>
          <img className={`weather-content-loading ${this.state.show ? 'hide' : ''}`} src="images/loading.svg" alt="loading icon" />
        </div>
      </div>
    )
  }
}
ReactDOM.render(<Weather />, document.getElementById("root"));
