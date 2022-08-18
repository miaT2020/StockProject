package stocks.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import stocks.domain.StockObject;
import stocks.domain.TimeSeriesUpdate;

@Repository
public interface TimeSeriesUpdateRepository extends JpaRepository<TimeSeriesUpdate, Long>{
	TimeSeriesUpdate findByStock(StockObject stock);	
	
}
