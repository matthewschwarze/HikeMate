--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Friendship; Type: TABLE; Schema: public; Owner: HikeMateAdmin
--

CREATE TABLE "Friendship" (
    "InitUser" integer NOT NULL,
    "RecUser" integer NOT NULL,
    "Active" boolean,
    "Blocked" boolean,
    "Id" integer NOT NULL
);


ALTER TABLE "Friendship" OWNER TO "HikeMateAdmin";

--
-- Name: Friendship_Id_seq; Type: SEQUENCE; Schema: public; Owner: HikeMateAdmin
--

CREATE SEQUENCE "Friendship_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Friendship_Id_seq" OWNER TO "HikeMateAdmin";

--
-- Name: Friendship_Id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: HikeMateAdmin
--

ALTER SEQUENCE "Friendship_Id_seq" OWNED BY "Friendship"."Id";


--
-- Name: Location; Type: TABLE; Schema: public; Owner: HikeMateAdmin
--

CREATE TABLE "Location" (
    "Uid" integer NOT NULL,
    "UTCTime" date,
    "Longitude" double precision,
    "Latitude" double precision
);


ALTER TABLE "Location" OWNER TO "HikeMateAdmin";

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Users" (
    "UserName" character varying NOT NULL,
    "Email" character varying NOT NULL,
    "Password" character varying(64) NOT NULL,
    "Salt" character varying(64) NOT NULL,
    uid integer NOT NULL
);


ALTER TABLE "Users" OWNER TO postgres;

--
-- Name: COLUMN "Users"."Password"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "Users"."Password" IS 'password for user';


--
-- Name: COLUMN "Users"."Salt"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "Users"."Salt" IS 'salt to add';


--
-- Name: Users_uid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "Users_uid_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Users_uid_seq" OWNER TO postgres;

--
-- Name: Users_uid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "Users_uid_seq" OWNED BY "Users".uid;


--
-- Name: Friendship Id; Type: DEFAULT; Schema: public; Owner: HikeMateAdmin
--

ALTER TABLE ONLY "Friendship" ALTER COLUMN "Id" SET DEFAULT nextval('"Friendship_Id_seq"'::regclass);


--
-- Name: Users uid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Users" ALTER COLUMN uid SET DEFAULT nextval('"Users_uid_seq"'::regclass);


--
-- Name: Friendship Friendship_pkey; Type: CONSTRAINT; Schema: public; Owner: HikeMateAdmin
--

ALTER TABLE ONLY "Friendship"
    ADD CONSTRAINT "Friendship_pkey" PRIMARY KEY ("Id");


--
-- Name: Location prkey; Type: CONSTRAINT; Schema: public; Owner: HikeMateAdmin
--

ALTER TABLE ONLY "Location"
    ADD CONSTRAINT prkey PRIMARY KEY ("Uid");


--
-- Name: Users uid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Users"
    ADD CONSTRAINT uid UNIQUE (uid);


--
-- Name: Users userName_Unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Users"
    ADD CONSTRAINT "userName_Unique" UNIQUE ("UserName");


--
-- Name: Friendship Init_fkey; Type: FK CONSTRAINT; Schema: public; Owner: HikeMateAdmin
--

ALTER TABLE ONLY "Friendship"
    ADD CONSTRAINT "Init_fkey" FOREIGN KEY ("InitUser") REFERENCES "Users"(uid);


--
-- Name: Friendship Rec_fkey; Type: FK CONSTRAINT; Schema: public; Owner: HikeMateAdmin
--

ALTER TABLE ONLY "Friendship"
    ADD CONSTRAINT "Rec_fkey" FOREIGN KEY ("RecUser") REFERENCES "Users"(uid);


--
-- Name: Location foreign_uid; Type: FK CONSTRAINT; Schema: public; Owner: HikeMateAdmin
--

ALTER TABLE ONLY "Location"
    ADD CONSTRAINT foreign_uid FOREIGN KEY ("Uid") REFERENCES "Users"(uid);


--
-- Name: Users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "Users" TO "HikeMateAdmin" WITH GRANT OPTION;


--
-- Name: Users_uid_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "Users_uid_seq" TO "HikeMateAdmin" WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

