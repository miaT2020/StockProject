package stocks.service;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;
import java.util.Date;
import java.text.SimpleDateFormat;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;

import stocks.repository.StockRepository;
import stocks.repository.TimeSeriesRepository;
import stocks.repository.TimeSeriesUpdateRepository;
import stocks.service.StockService;
import stocks.domain.TimeSeries;
import stocks.domain.TimeSeriesUpdate;
import stocks.domainbean.TimeSeriesBean;
import stocks.Main;

import stocks.domain.Client;
import stocks.domain.StockObject;

public class TimeSeriesService {
	private final TimeSeriesRepository timeSeriesRepository;
	private final StockRepository stockRepository;
    private final TimeSeriesUpdateRepository timeSeriesUpdateRepository;
	
	@Autowired
	public TimeSeriesService(TimeSeriesRepository timeSeriesRepository, StockRepository stockRepository, TimeSeriesUpdateRepository timeSeriesUpdateRepository) {
		this.timeSeriesRepository = timeSeriesRepository;
		this.stockRepository = stockRepository;
		this.timeSeriesUpdateRepository = timeSeriesUpdateRepository;
	
	}
	
	public List<TimeSeries> createTimeSeries() throws Exception{
		List<StockObject> stocks = stockRepository.findAll();
		try {
			int counter = 1; //NOPMD
			for(StockObject currentStock : stocks){
				String ticker = currentStock.getTicker();
	    		obtainTimeSeries(ticker, currentStock);
	    		if(counter%4 == 0 && counter < stocks.size()) {
					TimeUnit.MINUTES.sleep(1);
				}
	    		counter++;
	    	}
		} catch (Exception e) {
			System.out.println("error");
		}
		return timeSeriesRepository.findAll();
	}

	public List<TimeSeries> createTimeSeries(String[] tickers) {
	
		try {
			int counter = 1; //NOPMD
			for(String ticker : tickers) {
				StockObject stock = stockRepository.findByTicker(ticker);
				if(stock == null) {
					stock = stockRepository.save(new StockObject(ticker, ""));
				}
				
	    		obtainTimeSeries(ticker, stock);
	    		if(counter%4 == 0 && counter < tickers.length) {
					TimeUnit.MINUTES.sleep(1);
				}
	    		counter++;
	    		
//	    		long unpdateTime = System.currentTimeMillis();
//	    		TimeSeriesUpdate lastTimeUpdate = new TimeSeriesUpdate(stock,  unpdateTime);
//	    		timeSeriesUpdateRepository.save(lastTimeUpdate);
//	    		SimpleDateFormat sdf = new SimpleDateFormat("MMM dd,yyyy HH:mm");    
//	    		Date resultdate = new Date(unpdateTime);
//	    		System.out.println(sdf.format(resultdate));
	    	}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}

		
		
		return fetchTimeSeriesByTickers(tickers);
		
	}
	
		
	private void obtainTimeSeries(String ticker, StockObject currentStock) throws Exception{
		Client c = new Client();
		c.initParams();
    	String TimeSeriesURL = "https://api.twelvedata.com/time_series?symbol=" + ticker + "&interval=" + c.getInterval()
    			+ "&outputsize=" + c.getOutputsize() + "&apikey=" + Main.API_KEY;
        URL tsRequest = new URL(TimeSeriesURL);
        HttpURLConnection connection = (HttpURLConnection)tsRequest.openConnection();
        StringBuffer responseData = new StringBuffer();
        JSONParser parser = new JSONParser();
 
        connection.setRequestMethod("GET");
        connection.setRequestProperty("User-Agent", "twelve_java/1.0");
        connection.connect();
        
        int error = 200;
        if (connection.getResponseCode() != error) {
            throw new RuntimeException("Request failed. Error: " + connection.getResponseMessage());
        }
 
        Scanner scanner = new Scanner(tsRequest.openStream());
        while (scanner.hasNextLine()) {
            responseData.append(scanner.nextLine());
        }
        scanner.close();
        System.out.println(responseData);
        
        JSONObject json = (JSONObject) parser.parse(responseData.toString());
        JSONArray values = (JSONArray) json.get("values");
        for(int i = 0; i < values.size(); i++) {
        	JSONObject currentvalue = (JSONObject) values.get(i);
        	TimeSeries tsValue = new TimeSeries((String)currentvalue.get("datetime"), Double.parseDouble((String)currentvalue.get("open")), 
        			Double.parseDouble((String)currentvalue.get("close")), Double.parseDouble((String)currentvalue.get("high")), 
        			Double.parseDouble((String)currentvalue.get("low")), currentStock);
        	timeSeriesRepository.save(tsValue);
        }
        
       
        connection.disconnect();
	}

//	public List<TimeSeries> fetchAvailableStocks() {
//		return timeSeriesRepository.findAll();
//		
//	}

	public void deleteTimeSeries() {
		timeSeriesRepository.deleteAll();
		
	}
	
	public boolean deleteTimeSeriesByStocks(String[] tickers) {

		for(String ticker : tickers) {
			StockObject stock = stockRepository.findByTicker(ticker);
			if(stock != null){
				List<TimeSeries> ts = timeSeriesRepository.findByStock(stock);
				for (TimeSeries timeSeries : ts) {
					timeSeriesRepository.deleteById(timeSeries.getId());
				}
				
				stockRepository.deleteById(stock.getId());
			}
		}
		return true;
	
	}
		

	public List<TimeSeries> fetchTimeSeriesByTickers(String[] tickers) {
		List<TimeSeries> timeSeries = new ArrayList<TimeSeries>();
		for(String ticker : tickers) {
			StockObject stock = stockRepository.findByTicker(ticker);
			
			if(stock != null) {
				List<TimeSeries> ts = timeSeriesRepository.findByStock(stock);
				timeSeries.addAll(ts);
				
			}
			else {
				StockObject newStock = stockRepository.save(new StockObject(ticker, ""));
				TimeSeries t = new TimeSeries();
				t.setStock(newStock);
				timeSeries.add(t);
			}
			
			
		
		}
		return timeSeries;
	}

	
	public List<TimeSeries> fetchStocks(String[] tickers) throws Exception{
		
		List<TimeSeries> result= new ArrayList<TimeSeries>();

		List<TimeSeries> timeSeries = createTimeSeries(tickers);
		for(String ticker : tickers){
			StockObject stock = stockRepository.findByTicker(ticker);
			
			if(stock != null) {
				List<TimeSeries> ts = timeSeriesRepository.findByStock(stock);
				timeSeries.addAll(ts);
				
			}
			else {
				StockObject newStock = stockRepository.save(new StockObject(ticker, ""));
				TimeSeries t = new TimeSeries();
				t.setStock(newStock);
				timeSeries.add(t);
			}
			
			
			if(stockRepository.findByTicker(ticker) != null){
				List<TimeSeries> ts = timeSeriesRepository.findByStock(stock);
				result.addAll(ts);
			}
		}
		return result;
	}

	public boolean isUpdated() {
		// TODO Auto-generated method stub
		return false;
	}

	
//	public void deleteTimeSeriesByStocks(String[] tickers) {
//		Iterable<String> iterableTicker = Arrays.asList(tickers);
//		
//		Iterable<StockObject> stocks = stockRepository.findByTicker(iterableTicker);
//		timeSeriesRepository.deleteByStock(stocks);
//		
//	}
}
