package pokemap.service;

import java.util.List;

import pokemap.domain.Research;

public interface ResearchService {

	/**
	 * 리서치 목록
	 * @return
	 */
	List<Research> getResearchList(Research research);

}
