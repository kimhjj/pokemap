package pokemap.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Research {

	private String researchId;
	private String code;
	private String name;
	private String rewardType;
	private String rewardName;
	private String year;
	private String month;
}
