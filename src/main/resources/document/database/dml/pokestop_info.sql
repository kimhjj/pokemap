insert into public.pokestop_info (
	pokestop_id, code, title, location, use_yn, research_yn
) values
	('1', 'STOP', '사랑의 교회', ST_SetSRID(st_point(126.941778556389, 37.4827102304631), 4326), 'Y', 'N'),
	('2', 'GYM', '봉천역 tworld', ST_SetSRID(st_point(126.943231240855, 37.4825527263394), 4326), 'Y', 'N');
