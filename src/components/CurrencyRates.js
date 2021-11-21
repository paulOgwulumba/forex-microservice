import '../App.css'
import CurrencyNames from './CurrencyNames'

const CurrencyRates = (props) => {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Currency Pair</th>
            <th>Currency Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {unpackRates(props.data)}
        </tbody>
      </table>
    </div>
  )
}

function unpackRates(obj) {
  let unpacked = [];

  if(!obj.rates) {
    return unpacked
  }

  for(let rate of Object.keys(obj.rates)) {
    unpacked.push(
      <tr>
        <th>{`${rate}/${obj.base}`}</th>
        <td>{CurrencyNames[rate]}</td>
        <td>{obj.rates[rate]}</td>
      </tr>)
  }

  return unpacked
}

export default CurrencyRates