

import React , {Component} from 'react';
import Select, { components } from 'react-select';
import stockList from './tickers.json'
import './css/LoginComponent.css';
import './css/StockManager.css';

export default class StorckManager  extends Component{
  constructor (props) {

    super(props);
    this.state = {
      stockDetails: [],
      ticker: '',
      tickers: [],
      avaialbeTickers: stockList,
      tickerList: [],
      selectedTicker: null,
      message:''
    }
  }

  componentDidMount() {
    fetch("/stocks/alltickers")
        .then(response => response.json())
        .then(
            (data) => {
                this.setState({
                  tickerList: data
                });
            },
            (error) => {
              //alert(error);
              //some code here to handle error;
            }
        )

  }

  handleTickerChange = e => {
    this.setState({
      ticker: e.target.value,
    })
  }

  handleClickAdd = () => {
    const {tickers, selectedOption, tickerList} = this.state;
    const index = tickerList.findIndex(ticker => ticker.ticker === selectedOption.value);

    const tickerListUpdate = [...tickerList];

    if (index >= 0) {
      tickerListUpdate[index].displayText = selectedOption ? selectedOption.value + " (" + selectedOption.label + ")" : '';
      this.setState({
        message: 'The selected ticker is already in the list.',
        tickerList: tickerListUpdate,
      });
      return;
    }

    
    tickerList.push(
      {
        ticker: selectedOption ? selectedOption.value : '', 
        displayText:  selectedOption ? selectedOption.value + " (" + selectedOption.label + ")" : ''
      });
    this.setState({
      tickerList,
      message: '',      
    })

  }

  handleOptionChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  }

  saveTickers = () => {
    const {tickers} = this.state;
    fetch('/stocks/newstocks', 
    {
      method: "POST", 
      headers: {
          'Content-type': 'application/json'
      },
      body:  JSON.stringify(tickers)
    
      })
      .then(res => {
        if (res.ok) { console.log("HTTP request successful") }
        else { console.log("HTTP request unsuccessful") }
        return res
      })
      .then(res => res.json())
      .then( data => this.setState({
        stockDetails: data,
        message: "successed"
      })) // the data
      .catch(error => this.setState({
        message: error}));
  }

  handleClickGetDetails = () => {

    fetch('/timeseries/alltimeseries')
    .then(res => {    /* IF statement checks server response: .catch() does not do this! */ 
        if (res.ok) { console.log("HTTP request successful") }
        else { console.log("HTTP request unsuccessful") }
        return res
    })
    .then(res => res.json())
    .then(data => this.setState({
      stockDetails: data,
      tickers: []
    }))
    .catch(error => console.log(error)) // error handling
    /* .catch handles a failure with fetch (e.g. syntax error, no internet connection) */ 

    
    // const {tickers} = this.state;
    // fetch('/timeseries/timeseries',
    // {
    //   body:  JSON.stringify(tickers)
    // })
    // .then(res => {    /* IF statement checks server response: .catch() does not do this! */ 
    //     if (res.ok) { console.log("HTTP request successful") }
    //     else { console.log("HTTP request unsuccessful") }
    //     return res
    // })
    // .then(res => res.json())
    // .then(data => this.setState({
    //   stockDetails: data,
    //   tickers: []
    // }))
    // .catch(error => console.log(error)) // error handling
    // /* .catch handles a failure with fetch (e.g. syntax error, no internet connection) */ 

  }

  handleCheckboxChange = (e) => {
    const {id, checked} = e.target;
    const {tickers} = this.state;
    if (checked) {
      tickers.push(id);
    } else {
      tickers = tickers.filter(ticker => ticker !== id);
    }
    this.setState({
      tickers,
    })

  }

  
  extractSelection = (completeArray, arrayToRemove) => {
  if (completeArray.length === 0 || arrayToRemove.length === 0) {
    return completeArray;
  }
  return completeArray.filter(
    arrayItem => !arrayToRemove.some(removeItem => removeItem === arrayItem.ticker),
  );
};

  handleClickRemove = () => {
    const {tickers, tickerList} = this.state;
    this.setState({
      tickerList: this.extractSelection(tickerList, tickers),
      tickers: []
    });
    
  }



  render()  {
    const {title} = this.props;
    const {ticker, tickers, stockDetails, message, avaialbeTickers,   selectedOption, tickerList} = this.state;

    const SingleValue = ({ children, ...props }) => (
      <components.SingleValue {...props}>
        {children}
      </components.SingleValue>
    );
    
    return (
            <div className="flex-container">
              <div className="flex-item-left">
               
                <h2 >Select a company</h2>                
                <div>
                <span>{message}</span>
                <Select
                    onChange={this.handleOptionChange}
                    value={selectedOption}
                    components={{ SingleValue }}
                    options={avaialbeTickers}
                  />
                  <button className="add-ticker-button" onClick={this.handleClickAdd}>Add to stock list</button>
                </div>          

                <h2>My Stocks List</h2>
                <div className="inbox">
                  
                {tickerList.map(
                    ticker => 
                      <div className="list-item">
                      <input type='checkbox' id={ticker.ticker} onClick={this.handleCheckboxChange}/>
                      <p>{ticker.displayText}</p>
                    </div>)}
                  </div>

                  <div className="update-ticker-button">
                      <button type="button" onClick={this.handleClickGetDetails}>Get Details</button>
                      <button type="button" onClick={this.handleClickRemove}>Remove</button>
                      
                  </div>

              </div>
               <div class="flex-item-right">
                  <h1 className="title-center">{title}</h1>

                    <table id="stockDetail">
                      <thead>
                        <th>Ticker</th>
                        <th>Date/Time</th>
                        <th>Open Price</th>
                        <th>Close Price</th>
                        <th>Highest Price</th>
                        <th>Lowest Price</th>
                      </thead>
                   
                      {stockDetails && stockDetails.length > 0 &&(<tbody>
                          {
                              stockDetails.map(
                                      ticker =>
                                      <tr key = {ticker.id}>
                                        <td> {ticker.ticker }</td>
                                        <td> {ticker.date }</td>
                                        <td> {ticker.openPrice }</td>
                                        <td> {ticker.closePrice }</td>    
                                        <td> {ticker.highPrice }</td>
                                        <td> {ticker.lowPrice }</td>
                                     </tr>

                              )
                          }

                      </tbody>)}
                    </table>
                  
                </div>              
            
            </div>
        );
  }

}






