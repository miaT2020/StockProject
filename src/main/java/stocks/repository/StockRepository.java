package stocks.repository;
import java.util.Iterator;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import stocks.domain.StockObject;

@Repository
public interface StockRepository extends JpaRepository<StockObject, Long>{

	StockObject findByTicker(String ticker);
	void deleteByTicker(String ticker);
	
	//Iterable<StockObject> findByTickers(Iterable<String> tickers);
	
	//Iterable<StockObject> findByTicker(Iterable<String> iterableTicker);
	
	//void deleteByTicker(Iterable<String> iterableTicker);
}
