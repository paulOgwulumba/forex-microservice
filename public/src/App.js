import logo from './logo.svg';
import './App.css';
import CurrencyRates from './components/CurrencyRates'
import makeBaseCurrency from './components/makeBaseCurrency'
import React from 'react'

class App extends React.Component {
  state = {data: {}, baseCurrency: 'USD'}
  componentDidMount(){
    fetch('http://localhost:20290/forex/latest/currencies/usd')
      .then(response => response.json())
      .then(data => {
        this.setState({data: data})
      })
      .catch(err => console.error)
  }

  render(){
    console.log(this.state)
    return (
      <div className="App">
        <CurrencyRates data={this.state.data}/>
      </div>
    );
  }

  handleChange(event) {
    this.setState({data: makeBaseCurrency(event.target.value, this.state.baseCurrency, this.state.data)})
  }
}

export default App;
