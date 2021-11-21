import logo from './logo.svg';
import './App.css';
import BaseCurrency from './components/BaseCurrency'
import CurrencyRates from './components/CurrencyRates'
import React from 'react'

class App extends React.Component {
  state = {data: {}}
  componentDidMount(){
    fetch('https://my-forex-microservice.herokuapp.com/forex/latest/currencies/usd')
      .then(response => response.json())
      .then(data => {
        this.setState({data: data})
      })
      .catch(err => console.error)
  }

  render(){
    return (
      <div className="App">
        <BaseCurrency />
        <CurrencyRates data={this.state.data}/>
      </div>
    );
  }
}

export default App;
