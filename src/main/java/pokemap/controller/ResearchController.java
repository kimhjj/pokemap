package pokemap.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;
import pokemap.domain.Research;
import pokemap.service.ResearchService;

@Slf4j
@Controller
@CrossOrigin(origins = "*")
@RequestMapping("/research")
public class ResearchController {

	@Autowired
	private ResearchService researchService;

	@GetMapping
	public String list(@ModelAttribute Research research, HttpServletRequest request, Model model) {
		List<Research> researchList = researchService.getResearchList(research);
		model.addAttribute("researchList", researchList);
		return "search/research :: researchListTemplate";
	}
}
