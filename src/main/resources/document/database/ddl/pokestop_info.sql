DROP TABLE IF EXISTS public.pokestop_info;
DROP SEQUENCE IF EXISTS public.pokestop_id_seq;

----------------------------------
--  포켓스탑 정보
----------------------------------
CREATE TABLE public.pokestop_info (
	pokestop_id				bigint				not null,
	code					varchar(5),
	title					varchar(256),
	location				geometry(Point, 4326),
	use_yn					char(1)				default 'Y',
	research_yn				char(1)				default 'N'
);

--
-- Type: COMMENT;
--
COMMENT ON TABLE public.pokestop_info IS '포켓스탑 정보';
COMMENT ON COLUMN public.pokestop_info.pokestop_id IS '포켓스탑 정보 고유번호(PK)';
COMMENT ON COLUMN public.pokestop_info.code IS '포켓스탑 종류';
COMMENT ON COLUMN public.pokestop_info.title IS '포켓스탑 명';
COMMENT ON COLUMN public.pokestop_info.location IS '위치';
COMMENT ON COLUMN public.pokestop_info.use_yn IS '사용여부';
COMMENT ON COLUMN public.pokestop_info.use_yn IS '리서치여부';

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.pokestop_info
    ADD CONSTRAINT pokestop_info_pk PRIMARY KEY (pokestop_id);

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.pokestop_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
