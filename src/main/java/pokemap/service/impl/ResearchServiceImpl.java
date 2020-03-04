package pokemap.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pokemap.domain.Research;
import pokemap.persistence.ResearchMapper;
import pokemap.service.ResearchService;

@Service
public class ResearchServiceImpl implements ResearchService {

	@Autowired
	private ResearchMapper researchMapper;

	/**
	 * 리서치 목록
	 * @return
	 */
	@Transactional(readOnly=true)
	public List<Research> getResearchList(Research research) {
		return researchMapper.getResearchList(research);
	}

}
