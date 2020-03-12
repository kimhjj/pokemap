insert into public.pokestop_info (
	pokestop_id, code, name, location, use_yn
) values
	('1', 'STOP', '사랑의 교회', ST_SetSRID(st_point(126.942279, 37.482489), 4326), 'Y');
