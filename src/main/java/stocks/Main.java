package stocks;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import stocks.domain.Product;
import stocks.domain.StockObject;
import stocks.domain.TimeSeries;
import stocks.domainbean.TimeSeriesBean;
import stocks.repository.ProductRepository;
import stocks.repository.StockRepository;
import stocks.repository.TimeSeriesRepository;
import stocks.service.StockReader;
import stocks.service.StockService;
import stocks.service.TimeSeriesService;


 /**
  * StockProject main class
  * @author ktong
  *
  */
@SpringBootApplication
@RestController
public class Main {
	
	/**
	 * the api key
	 */
	public static String API_KEY = "e62aab1c906045bdb4eb84f23b6e3bbe";
   
	/**
	 * starts the program
	 * @param args				command line arguments
	 * @throws Exception		whenever exceptions are thrown within the StockReader class
	 */
    public static void main(String[] args) throws Exception {
    	//StockReader.start();
    	SpringApplication.run(Main.class, args);
    }
    
//    @Bean
//    CommandLineRunner runner(ProductRepository productRepository) {
//		return args -> {
//			
//			Product product1 = new Product("Xbox 360");
//			product1.setPrice(323);
//			productRepository.save(product1);
//			
//			Product product2 = new Product("Wii");
//			product2.setPrice(124);
//			productRepository.save(product2);
//			
//			Product product3 = new Product("Chess");
//			product3.setPrice(24);
//			productRepository.save(product3);
//			
//		};
//    	
//    }
//    
    @Bean
    CommandLineRunner stockRunner(StockRepository stockRepository, TimeSeriesRepository timeSeriesRepository) {
		return args -> {
//			
//			String[] tickers = {"TSLA",	"F"};
//			StockService stockService = new StockService(stockRepository);
//			//stockService.deleteStocks(tickers);
//			TimeSeriesService timeSeriesService = new TimeSeriesService(timeSeriesRepository, stockRepository);
//			List<TimeSeries> t = timeSeriesService.createTimeSeries(tickers);
//			
//			ArrayList<TimeSeriesBean> timeSeriesList = new ArrayList<>();
//			List<StockObject> stocks = stockService.createStocks(tickers);
//			List<TimeSeries> tsList = timeSeriesService.createTimeSeries(stocks);
//			
//			
//			for (TimeSeries ts : tsList) {
//				  TimeSeriesBean timeSeriesBean = new TimeSeriesBean();
//		       	  timeSeriesBean.setId(ts.getId());
//		       	  timeSeriesBean.setTicker(ts.getStock().getTicker());
//		       	  timeSeriesBean.setDisplayText(ts.getStock().getTicker() + " (" + ts.getStock().getCompanyName() + ")");
//		       	  timeSeriesList.add(timeSeriesBean);
//		       	 
//				}
//			
			
//			for(int i = 0; i < StockReader.stocks.size(); i++) {
//				StockObject currentStock = new StockObject(StockReader.stocks.get(i).getTicker());
//				currentStock = stockRepository.save(currentStock);
//				//currentStock = stockRepository.findByTicker(currentStock.getTicker());
//				for(int j = 0; j < StockReader.stocks.get(i).getTimeSeries().size(); j++) {
//					TimeSeries currentTimeSeries = StockReader.stocks.get(i).getTimeSeries().get(j);
//					TimeSeries newTimeSeries = new TimeSeries(currentTimeSeries.getTime(),currentTimeSeries.getopenPrice(), 
//							currentTimeSeries.getclosePrice(), currentTimeSeries.gethighPrice(), currentTimeSeries.getlowPrice(), currentStock);
//					timeSeriesRepository.save(newTimeSeries);
//				}
//			}
//			
		};
    
    }
    
  
}