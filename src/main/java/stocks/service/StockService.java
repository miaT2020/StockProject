package stocks.service;


import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;

import stocks.Main;
import stocks.domain.StockObject;

import stocks.repository.StockRepository;

public class StockService {
	private final StockRepository stockRepository;
	
	@Autowired
	public StockService(StockRepository stockRepository) {
		this.stockRepository = stockRepository;
	}
	
	
	public void fetchAvailableStockSymbols() throws Exception {
		String country = "United States";
		String stockURL = "https://api.twelvedata.com/stocks?country=" + country;
		  URL symbolRequest = new URL(stockURL);
	        HttpURLConnection connection = (HttpURLConnection)symbolRequest.openConnection();
	        StringBuffer responseData = new StringBuffer();
	        JSONParser parser = new JSONParser();
	 
	        connection.setRequestMethod("GET");
	        connection.setRequestProperty("User-Agent", "twelve_java/1.0");
	        connection.connect();
	        
	        int error = 200;
	        if (connection.getResponseCode() != error) {
	            throw new RuntimeException("Request failed. Error: " + connection.getResponseMessage());
	        }
	 
	        Scanner scanner = new Scanner(symbolRequest.openStream());
	        while (scanner.hasNextLine()) {
	            responseData.append(scanner.nextLine());
	        }
	        scanner.close();
	        System.out.println("response data ======================================================= " + responseData);
	        
	        JSONObject json = (JSONObject) parser.parse(responseData.toString());
	        JSONObject meta = (JSONObject) json.get("meta");
	        JSONArray values = (JSONArray) json.get("data");
	        
	        ArrayList<StockObject> symbolData = new ArrayList<StockObject>();
	        for(int i = 0; i < values.size(); i++) {
	        	JSONObject currentvalue = (JSONObject) values.get(i);
	        	StockObject stockValue = new StockObject((String)currentvalue.get("symbol"), (String)currentvalue.get("name"));
	           
	        	stockRepository.save(stockValue);
	        	symbolData.add(stockValue);
	        	
	        }
	        
	       
	        
	      
		
	}
	
	public List<StockObject> createStocks(String[] stocks) {
		ArrayList<StockObject> savedStocks = new ArrayList<StockObject>();
		for(String ticker : stocks) {
			StockObject currentStock = new StockObject(ticker.toUpperCase(), "yyy");
			
				currentStock = stockRepository.save(currentStock);
				savedStocks.add(currentStock);
			
		}
		return savedStocks;
	}
	
	public List<StockObject> deleteStocks(String[] tickers) {
		for(String ticker : tickers) {
			//stockRepository.deleteByTicker(ticker);
		}
		return stockRepository.findAll();
	}

	public List<StockObject> getAllSymbols() {
	
			try {
				fetchAvailableStockSymbols();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		
		
		return stockRepository.findAll();
	}
	
	public List<StockObject> getStocks() {
		
		return stockRepository.findAll();
	}
	
		
}
