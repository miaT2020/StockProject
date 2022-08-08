package stocks.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import stocks.domainbean.TimeSeriesBean;
import stocks.domain.StockObject;
import stocks.domain.TimeSeries;
import stocks.repository.ProductRepository;
import stocks.repository.StockRepository;
import stocks.repository.TimeSeriesRepository;
import stocks.service.StockService;
import stocks.service.TimeSeriesService;
import stocks.domainbean.TimeSeriesBean;

@RestController
@RequestMapping(path="/timeseries", produces=MediaType.APPLICATION_JSON_VALUE)
public class TimeSeriesController {
	
	private final StockRepository stockRepository;
	
	private TimeSeriesService timeSeriesService;	
	
	private StockService stockService;
	
	public TimeSeriesController(StockRepository stockRepository,  TimeSeriesRepository timeSeriesRepository) {
	
		this.stockRepository = stockRepository;
	
		this.stockService = new StockService(stockRepository);
		timeSeriesService = new TimeSeriesService(timeSeriesRepository, stockRepository);
	}

	@GetMapping("/alltimeseries")
	public ArrayList<TimeSeriesBean> getTimerSeries() throws Exception{
		
		ArrayList<TimeSeriesBean> timeSeriesList = new ArrayList<>();
		List<TimeSeries> tsList = timeSeriesService.createTimeSeries();
		//List<TimeSeries> tsList = timeSeriesRepository.findAll();
		
		for (TimeSeries ts : tsList) {
			  TimeSeriesBean timeSeriesBean = new TimeSeriesBean();
	       	  timeSeriesBean.setId(ts.getId());
	       	  timeSeriesBean.setTicker(ts.getStock().getTicker());
	       	  timeSeriesBean.setDisplayText(ts.getStock().getTicker() + " (" + ts.getStock().getCompanyName() + ")");
	       	  timeSeriesBean.setDate(ts.getTime());
	       	  timeSeriesBean.setOpenPrice(String.valueOf(ts.getopenPrice()));
	       	  timeSeriesBean.setClosePrice(String.valueOf(ts.getclosePrice()));
	       	  timeSeriesBean.setHighPrice(String.valueOf(ts.gethighPrice()));
	       	  timeSeriesBean.setLowPrice(String.valueOf(ts.getlowPrice()));
	       	  timeSeriesList.add(timeSeriesBean);
	       	 
			}
		
		return timeSeriesList;
	}
	
	@GetMapping("/timeseries")
	public ArrayList<TimeSeriesBean> fetchAvailableStocks(@RequestBody String[] tickers) throws Exception{
		
		ArrayList<TimeSeriesBean> timeSeriesList = new ArrayList<>();
		List<StockObject> stocks = stockService.createStocks(tickers);
		List<TimeSeries> tsList = timeSeriesService.createTimeSeries(stocks);
		
		
		for (TimeSeries ts : tsList) {
			  TimeSeriesBean timeSeriesBean = new TimeSeriesBean();
	       	  timeSeriesBean.setId(ts.getId());
	       	  timeSeriesBean.setTicker(ts.getStock().getTicker());
	       	  timeSeriesBean.setDisplayText(ts.getStock().getTicker() + " (" + ts.getStock().getCompanyName() + ")");
	       	  timeSeriesList.add(timeSeriesBean);
	       	 
			}
		
		return timeSeriesList;
	}
}
