

import React , {Component} from 'react';


import './css/StockDetailManager.css';

export default class StorckDetailManager  extends Component{
  constructor (props) {

    super(props);
    this.state = {
      stockDetails: [],
      ticker: '',
      tickers: [],
      message:''
    }
  }

  componentDidMount() {
    fetch("/StockTracker/timeseries")
        .then(response => response.json())
        .then(
            (data) => {
                this.setState({
                  stockDetails: data
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
    const {tickers, ticker} = this.state;
    tickers.push(ticker);
    this.setState({
      tickers,
      ticker: ''
      
    })

  }

  handleClickGetSave = () => {
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

  }


  render()  {
    const {title} = this.props;
    const {ticker, tickers, stockDetails, message} = this.state;
    return (
            <div className="container">
            
            
              <div className="ticker-input">
                <input type='text' onChange={this.handleTickerChange} value={ticker} placeholder="add ticker here"/>
                <button type="button" onClick={this.handleClickAdd}>Add Ticker</button>
              </div>
               <div>
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
                      {tickers && tickers.length > 0 &&(<tbody>
                          {
                              tickers.map(
                                      ticker =>
                                      <tr>
                                          <td> {ticker }</td>
                                          <td></td>
                                          <td></td>
                                          <td></td>    
                                          <td></td>
                                          <td></td>
                                      </tr>

                              )
                          }

                      </tbody>)}
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
                <div className="action-button">
                  <button type="button" onClick={this.handleClickGetSave}>Save</button>
                  <button type="button" onClick={this.handleClickGetDetails}>Get Details</button>
                </div>
            
            </div>
        );
  }

}






