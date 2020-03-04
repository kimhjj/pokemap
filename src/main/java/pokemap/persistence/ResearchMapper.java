package pokemap.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import pokemap.domain.Research;

@Repository
public interface ResearchMapper {

	/**
	 * 리서치 목록
	 * @return
	 */
	List<Research> getResearchList(Research research);

}
