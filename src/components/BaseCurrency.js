import '../App.css'
import CurrencyNames from './CurrencyNames'

const BaseCurrency = (props) => {
  return (
    <div className="base-currency">
        <label for="standard-select">Base Currency</label>
        <div class="select">
          <select id="standard-select">
            {unpackCurrencies()}
          </select>
          <span class="focus"></span>
        </div>
      </div>
  )
}

function unpackCurrencies(){
  let options = []
  for (let currencyName of Object.keys(CurrencyNames)) {
    options.push(<option value={currencyName}>{`${CurrencyNames[currencyName]} (${currencyName})`}</option>)
  }
  return options
}

export default BaseCurrency