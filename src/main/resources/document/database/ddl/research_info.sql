DROP TABLE IF EXISTS public.research_info;
DROP SEQUENCE IF EXISTS public.research_id_seq;

----------------------------------
--  리서치 정보
----------------------------------
CREATE TABLE public.research_info (
	research_id				bigint				not null,
	code					varchar(5),
	name					varchar(256),
	reward_type				varchar(3),
	reward_name				varchar(100),
	year					char(4),
	month					char(2)
);

--
-- Type: COMMENT;
--
COMMENT ON TABLE public.research_info IS '리서치 정보';
COMMENT ON COLUMN public.research_info.research_id IS '리서치 정보 고유번호(PK)';
COMMENT ON COLUMN public.research_info.code IS '리서치 종류';
COMMENT ON COLUMN public.research_info.name IS '리서치 명';
COMMENT ON COLUMN public.research_info.reward_type IS '보상 종류';
COMMENT ON COLUMN public.research_info.reward_name IS '보상 명';
COMMENT ON COLUMN public.research_info.year IS '해당 년도';
COMMENT ON COLUMN public.research_info.month IS '해당 월';

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.research_info
    ADD CONSTRAINT research_info_pk PRIMARY KEY (research_id);

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.research_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
