import logo from './logo.svg';
import './App.css';
import BaseCurrency from './components/BaseCurrency'
import CurrencyRates from './components/CurrencyRates'
import makeBaseCurrency from './components/makeBaseCurrency'
// import test from './test'
import React from 'react'

class App extends React.Component {
  state = {data: {}, baseCurrency: 'USD'}
  componentDidMount(){
    fetch('https://my-forex-microservice.herokuapp.com/forex/latest/currencies/usd')
      .then(response => response.json())
      .then(data => {
        this.setState({data: data})
      })
      .catch(err => console.error)

    // let data = JSON.parse(test)
    // this.setState({data: data})
    // this.handleChange = this.handleChange.bind(this) 
  }

  render(){
    console.log(this.state)
    return (
      <div className="App">
        <BaseCurrency handleChange={this.handleChange}/>
        <CurrencyRates data={this.state.data}/>
      </div>
    );
  }

  handleChange(event) {
    this.setState({data: makeBaseCurrency(event.target.value, this.state.baseCurrency, this.state.data)})
  }
}

export default App;
