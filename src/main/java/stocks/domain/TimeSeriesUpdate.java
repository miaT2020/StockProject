package stocks.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A class that will contain the data for various Stocks
 * @author ktong
 *
 */
@Entity
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class TimeSeriesUpdate {
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank
	@Column(unique = true)
	private long lastUpdatTime;
	
	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "stock_id", nullable = false)
	private StockObject stock;
	
	
	public TimeSeriesUpdate() {}
	
	public TimeSeriesUpdate(StockObject stock, long lastUpdatTime) {
		this.stock = stock;
		this.lastUpdatTime = lastUpdatTime;
	}
	
	
	public long getId() {
		return id;
	}
	
	public void setId(long id) {
		this.id = id;
	}
	
	
	public long getLastUpdatTime() {
		return lastUpdatTime;
	}
	
	public void setLastUpdatTime(long lastUpdatTime) {
		this.lastUpdatTime = lastUpdatTime;
	}
	
	
	public StockObject getStock() {
		return stock;
	}
	
	public void setStock(StockObject stock) {
		this.stock = stock;
	}
}
