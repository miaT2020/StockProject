

import React , {Component, Fragment} from 'react';
import Select, { components } from 'react-select';
import stockList from './tickers.json'
import './css/LoginComponent.css';
import './css/StockManager.css';


export default class StorckManager  extends Component{
  constructor (props) {
    super(props);
    
    this.toggle = this.toggle.bind(this);

    this.state = {
      stockDetails: [],

     // testData:  rows.flatMap(item => item),
      ticker: '',
      tickers: [],
      avaialbeTickers: stockList,
      tickerList: [],
      selectedOption: null,
      message:'', 
      collapse: false,
      trShow: false,
      
      requestInput: {
                      interval: 1,
                      timeUnit: 'day',
                      outputSize: 5
                    }
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

  toggle() {
    const {trShow} = this.state;
   
    this.setState({ trShow: !trShow });
  }

  mapStockDetail(demoData,  prop) {
  
    return demoData.reduce((acc, item) => {
  
      let key = item[prop]
  
      if (!acc[key]) {
  
        acc[key] = [{ticker: key, isParent: true}];
  
      }
  
      acc[key].push(item)

  
      return acc
  
    }, {})
  
  }
  


  handleTickerChange = e => {
    this.setState({
      ticker: e.target.value,
    })
  }

  handleClickAdd = () => {   
    
    const {selectedOption, tickerList} = this.state;

    if ( selectedOption === null) {
      return;
     }

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
        message: 'Delete failed'}));
  }

  handleClickGetDetails = () => {
    const {tickers, requestInput} = this.state;

    fetch('/stocks/timeseries', 
    {
      method: "POST", 
      headers: {
          'Content-type': 'application/json'
      },
      body:  JSON.stringify(tickers)
    
      })
    .then(res => {    /* IF statement checks server response: .catch() does not do this! */ 
        if (res.ok) { console.log("HTTP request successful") }
        else { console.log("HTTP request unsuccessful") }
        return res
    })
    .then(res => res.json())
    .then(data => {
      const formatedData = this.mapStockDetail(data, 'ticker');
      const rows = formatedData ? Object.values(formatedData) : [];
     
      this.setState({
      stockDetails: rows.flatMap(item => item),
      
    })})
    .catch(error => console.log(error)) // error handling
    /* .catch handles a failure with fetch (e.g. syntax error, no internet connection) */ 
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


  handleClickDelete = () => {
    const {tickers} = this.state;
    fetch('/stocks/timeseries', 
    {
      method: "DELETE", 
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
      .then( data => {
          const {tickers, tickerList} = this.state;
          this.setState({
          message: "Delete successed",
          tickers: [],
          tickerList: this.extractSelection(tickerList, tickers),
          stockDetails: []
        })}
      ) // the data
      .catch(error => this.setState({
        message: 'Delete failed'}));    
  }

  
  handleClickUpdate = () => {
    const {tickers} = this.state;
    fetch('/stocks/realtime', 
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
      .then( data => {
          const formatedData = this.mapStockDetail(data, 'ticker');
          const rows = formatedData ? Object.values(formatedData) : [];
        
          this.setState({
          message: "update successed",
          stockDetails: rows.flatMap(item => item),
        })}
      ) // the data
      .catch(error => this.setState({
        message: 'Delete failed'}));    

  }


  render()  {
    const {title} = this.props;
    const {ticker, tickers, stockDetails, message, avaialbeTickers,   selectedOption, tickerList, trShow} = this.state;

    // const SingleValue = ({ children, ...props }) => (
    //   <components.SingleValue {...props}>
    //     {children}
    //   </components.SingleValue>
    // );
    
    return (
            <div className="flex-container">
              <div className="flex-item-left">
               
                <h2 >Select a company</h2>                
                <div>
                <span>{message}</span>
                <Select
                    onChange={this.handleOptionChange}
                    value={selectedOption}
                    // components={{ SingleValue }}
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
                      <button type="button" onClick={this.handleClickGetDetails}>Get Stock Detail</button>
                      <button type="button" onClick={this.handleClickRemove}>Remove from List</button>
                      <button type="button" onClick={this.handleClickDelete}>Delete Selected Stock</button>
                  </div>

              </div>
               <div class="flex-item-right">
                  <h1 className="title-center">{title}</h1>
                  <button className="add-ticker-button" onClick={this.handleClickUpdate}>Realtime Update</button>

                  


                    <table className="stockDetail">
                      <thead>
                        <th />
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
                                      <Fragment>
                                        {ticker.isParent && <tr >
                                          <th scope="row" onClick={this.toggle}>
                                                <i className={trShow ? "arrow down" : "arrow right"} />
                                          </th>                                        
                                          <td> 
                                            {ticker.ticker}
                                            </td>
                                          <td> {ticker.date }</td>
                                          <td> {ticker.openPrice }</td>
                                          <td> {ticker.closePrice }</td>    
                                          <td> {ticker.highPrice }</td>
                                          <td> {ticker.lowPrice }</td>
                                        </tr>}
                                        {trShow && !ticker.isParent && (
                                          <tr >
                                            <th>
                                            </th>
                                          
                                            <td>                                            
                                              </td>
                                            <td> {ticker.date }</td>
                                            <td> {ticker.openPrice }</td>
                                            <td> {ticker.closePrice }</td>    
                                            <td> {ticker.highPrice }</td>
                                            <td> {ticker.lowPrice }</td>
                                        </tr>)}
                                      </Fragment>)
                          }

                      </tbody>)}
                    </table>
                  
                </div>              
            
            </div>
        );
  }

}






