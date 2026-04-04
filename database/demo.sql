-- MySQL Compatible Data Population Script
-- Converted from Oracle HR demo schema
-- Original Copyright (c) 2023 Oracle
--
-- NAME
--   hr_populate.sql - populates the HR (Human Resources) tables with data
--
-- DESCRIPTION
--   This script populates the HR tables with rows of data
--
-- SCHEMA VERSION
--   21
--
-- NOTES
--   There is a circular foreign key reference between
--   EMPLOYEES and DEPARTMENTS.  The dept_mgr_fk constraint is initially
--   disabled, data is loaded, and then enabled at the end of the script

USE hr_db;

-- Disable foreign key checks to allow data insertion in any order
SET FOREIGN_KEY_CHECKS=0;

-- *************************** insert data into the REGIONS table

INSERT INTO regions VALUES
    (10, 'Europe'),
    (20, 'Americas'),
    (30, 'Asia'),
    (40, 'Oceania'),
    (50, 'Africa');

-- *************************** insert data into the COUNTRIES table

INSERT INTO countries VALUES
    ('IT', 'Italy', 10),
    ('JP', 'Japan', 30),
    ('US', 'United States of America', 20),
    ('CA', 'Canada', 20),
    ('CN', 'China', 30),
    ('IN', 'India', 30),
    ('AU', 'Australia', 40),
    ('ZW', 'Zimbabwe', 50),
    ('SG', 'Singapore', 30),
    ('GB', 'United Kingdom of Great Britain and Northern Ireland', 10),
    ('FR', 'France', 10),
    ('DE', 'Germany', 10),
    ('ZM', 'Zambia', 50),
    ('EG', 'Egypt', 50),
    ('BR', 'Brazil', 20),
    ('CH', 'Switzerland', 10),
    ('NL', 'Netherlands', 10),
    ('MX', 'Mexico', 20),
    ('KW', 'Kuwait', 30),
    ('IL', 'Israel', 30),
    ('DK', 'Denmark', 10),
    ('ML', 'Malaysia', 30),
    ('NG', 'Nigeria', 50),
    ('AR', 'Argentina', 20),
    ('BE', 'Belgium', 10);

-- *************************** insert data into the LOCATIONS table

INSERT INTO locations VALUES
    (1000, '1297 Via Cola di Rie', '00989', 'Roma', NULL, 'IT'),
    (1100, '93091 Calle della Testa', '10934', 'Venice', NULL, 'IT'),
    (1200, '2017 Shinjuku-ku', '1689', 'Tokyo', 'Tokyo Prefecture', 'JP'),
    (1300, '9450 Kamiya-cho', '6823', 'Hiroshima', NULL, 'JP'),
    (1400, '2014 Jabberwocky Rd', '26192', 'Southlake', 'Texas', 'US'),
    (1500, '2011 Interiors Blvd', '99236', 'Seattle', 'Washington', 'US'),
    (1600, '2007 Zagora St', '50090', 'South Brunswick', 'New Jersey', 'US'),
    (1700, '2004 Charade Rd', '98199', 'Seattle', 'Washington', 'US'),
    (1800, '147 Spadina Ave', 'M5V 2L7', 'Toronto', 'Ontario', 'CA'),
    (1900, '6092 BOB Street', '02896', 'Cambridge', 'Massachusetts', 'US'),
    (2000, '8204 Arthur St', NULL, 'London', NULL, 'GB'),
    (2100, 'Obere Str. 57', '12209', 'Berlin', NULL, 'DE'),
    (2200, 'Wirth Gasse 75', '6900', 'Feldkirch', NULL, 'CH'),
    (2300, 'Starenweg 4', '8600', 'Zurich', NULL, 'CH'),
    (2400, '200 Bureaux', '75002', 'Paris', NULL, 'FR'),
    (2500, 'Pieter Breughelstraat 837', '3029SK', 'Rotterdam', NULL, 'NL'),
    (2600, 'Mariano Escobedo 9991', '11932', 'Mexico City', 'Distrito Federal', 'MX'),
    (2700, '9450 Kamiya-cho', '6823', 'Hiroshima', NULL, 'JP'),
    (2800, '2017 Shinjuku-ku', '1689', 'Tokyo', 'Tokyo Prefecture', 'JP'),
    (2900, 'Sanzamboidense 891', '14400', 'Buenos Aires', NULL, 'AR'),
    (3000, '9450 Kamiya-cho', '6823', 'Hiroshima', 'Hiroshima', 'JP'),
    (3100, 'Admiralty Street 71', 'AUSMEL', 'Melbourne', 'Victoria', 'AU'),
    (3200, '200 Sporting Even Blvd', 'TX 75020', 'Dallas', 'Texas', 'US'),
    (3300, '100 MG Road', '560001', 'Bangalore', 'Karnataka', 'IN'),
    (3400, 'Bandra Kurla Complex 201', '400051', 'Mumbai', 'Maharashtra', 'IN'),
    (3500, 'DLF Cyber City Phase 3', '122002', 'Gurugram', 'Haryana', 'IN'),
    (3600, 'Av. Paseo de la Reforma 505', '06500', 'Mexico City', 'Ciudad de Mexico', 'MX'),
    (3700, 'Blvd. Manuel Avila Camacho 1', '11000', 'Mexico City', 'Ciudad de Mexico', 'MX');

-- *************************** insert data into the DEPARTMENTS table

INSERT INTO departments (department_id, department_name, manager_id, location_id) VALUES
    (10, 'Administration', 200, 1700),
    (20, 'Marketing', 201, 1800),
    (30, 'Purchasing', 114, 1700),
    (40, 'Human Resources', 203, 2400),
    (50, 'Shipping', 121, 1500),
    (60, 'IT', 103, 1400),
    (70, 'Public Relations', 204, 2700),
    (80, 'Sales', 145, 2500),
    (90, 'Executive', 100, 1700),
    (100, 'Finance', 108, 1700),
    (110, 'Accounting', 205, 1700),
    (120, 'Treasury', NULL, 1700),
    (130, 'Corporate Tax', NULL, 1700),
    (140, 'Control And Audit', NULL, 1700),
    (150, 'Shareholder Services', NULL, 1700),
    (160, 'Benefits', NULL, 1700),
    (170, 'Manufacturing', NULL, 1700),
    (180, 'Construction', NULL, 1700),
    (190, 'Contracting', NULL, 1700),
    (200, 'Operations', NULL, 1700),
    (210, 'IT Support', NULL, 1700),
    (220, 'NOC', NULL, 1700),
    (230, 'IT Help Desk', NULL, 1700),
    (240, 'Government Sales', NULL, 1700),
    (250, 'Retail Sales', NULL, 1700),
    (260, 'Recruiting', NULL, 1700),
    (270, 'Payroll', NULL, 1700),
    (280, 'IT Development - India', NULL, 3300),
    (290, 'IT QA - India', NULL, 3400),
    (300, 'IT Infrastructure - India', NULL, 3500),
    (310, 'Sales - Mexico', NULL, 3600),
    (320, 'Customer Support - Mexico', NULL, 3700);

-- *************************** insert data into the JOBS table

INSERT INTO jobs VALUES
    ('AD_PRES', 'President', 20000, 40000),
    ('AD_VP', 'Administration Vice President', 15000, 30000),
    ('AD_ASST', 'Administration Assistant', 3000, 6000),
    ('FI_MGR', 'Finance Manager', 8200, 16400),
    ('FI_ACCOUNT', 'Accountant', 4200, 9000),
    ('AC_MGR', 'Accounting Manager', 8200, 16400),
    ('AC_ACCOUNT', 'Public Accountant', 4200, 9000),
    ('SA_MAN', 'Sales Manager', 10000, 20000),
    ('SA_REP', 'Sales Representative', 6000, 12000),
    ('PU_MAN', 'Purchasing Manager', 8000, 15000),
    ('PU_CLERK', 'Purchasing Clerk', 2500, 5500),
    ('ST_MAN', 'Stock Manager', 5500, 8500),
    ('ST_CLERK', 'Stock Clerk', 2000, 5000),
    ('SH_CLERK', 'Shipping Clerk', 2500, 5500),
    ('IT_PROG', 'Programmer', 4000, 10000),
    ('MK_MAN', 'Marketing Manager', 9000, 15000),
    ('MK_REP', 'Marketing Representative', 4000, 9000),
    ('HR_REP', 'Human Resources Representative', 4000, 9000),
    ('PR_REP', 'Public Relations Representative', 4500, 10500);

-- *************************** insert data into the EMPLOYEES table

INSERT INTO employees (employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id) VALUES
    (100, 'Steven', 'King', 'steven.king@sqltutorial.org', '515.1234567', STR_TO_DATE('17-06-2013', '%d-%m-%Y'), 'AD_PRES', 24000.00, NULL, NULL, 90),
    (101, 'Neena', 'Kochhar', 'neena.kochhar@sqltutorial.org', '515.1234568', STR_TO_DATE('21-09-2015', '%d-%m-%Y'), 'AD_VP', 17000.00, NULL, 100, 90),
    (102, 'Lex', 'De Haan', 'lex.dehaan@sqltutorial.org', '515.1234569', STR_TO_DATE('13-01-2011', '%d-%m-%Y'), 'AD_VP', 17000.00, NULL, 100, 90),
    (103, 'Alexander', 'Hunold', 'alexander.hunold@sqltutorial.org', '590.221.2004', STR_TO_DATE('03-01-2016', '%d-%m-%Y'), 'IT_PROG', 9000.00, NULL, 102, 60),
    (104, 'Bruce', 'Ernst', 'bruce.ernst@sqltutorial.org', '590.221.2004', STR_TO_DATE('21-05-2017', '%d-%m-%Y'), 'IT_PROG', 6000.00, NULL, 103, 60),
    (105, 'David', 'Austin', 'david.austin@sqltutorial.org', '590.221.2004', STR_TO_DATE('25-06-2015', '%d-%m-%Y'), 'IT_PROG', 4800.00, NULL, 103, 60),
    (106, 'Valli', 'Pataballa', 'valli.pataballa@sqltutorial.org', '590.221.2004', STR_TO_DATE('05-02-2016', '%d-%m-%Y'), 'IT_PROG', 4800.00, NULL, 103, 60),
    (107, 'Diana', 'Lorentz', 'diana.lorentz@sqltutorial.org', '590.221.1843', STR_TO_DATE('07-02-2017', '%d-%m-%Y'), 'IT_PROG', 4200.00, NULL, 103, 60),
    (108, 'Nancy', 'Greenberg', 'nancy.greenberg@sqltutorial.org', '515.204.4569', STR_TO_DATE('17-08-2012', '%d-%m-%Y'), 'FI_MGR', 12000.00, NULL, 101, 100),
    (109, 'Daniel', 'Faviet', 'daniel.faviet@sqltutorial.org', '515.204.4169', STR_TO_DATE('16-08-2012', '%d-%m-%Y'), 'FI_ACCOUNT', 9000.00, NULL, 108, 100),
    (110, 'John', 'Chen', 'john.chen@sqltutorial.org', '515.204.4269', STR_TO_DATE('28-09-2015', '%d-%m-%Y'), 'FI_ACCOUNT', 8200.00, NULL, 108, 100),
    (111, 'Ismael', 'Sciarra', 'ismael.sciarra@sqltutorial.org', '515.204.4369', STR_TO_DATE('30-09-2015', '%d-%m-%Y'), 'FI_ACCOUNT', 7700.00, NULL, 108, 100),
    (112, 'Jose Manuel', 'Urman', 'josemanuel.urman@sqltutorial.org', '515.204.4469', STR_TO_DATE('07-03-2016', '%d-%m-%Y'), 'FI_ACCOUNT', 7800.00, NULL, 108, 100),
    (113, 'Luis', 'Popp', 'luis.popp@sqltutorial.org', '515.204.4567', STR_TO_DATE('07-12-2017', '%d-%m-%Y'), 'FI_ACCOUNT', 6900.00, NULL, 108, 100),
    (114, 'Den', 'Raphaely', 'den.raphaely@sqltutorial.org', '515.127.4561', STR_TO_DATE('07-12-2012', '%d-%m-%Y'), 'PU_MAN', 11000.00, NULL, 100, 30),
    (115, 'Alexander', 'Khoo', 'alexander.khoo@sqltutorial.org', '515.127.4562', STR_TO_DATE('18-05-2013', '%d-%m-%Y'), 'PU_CLERK', 3100.00, NULL, 114, 30),
    (116, 'Shelli', 'Baida', 'shelli.baida@sqltutorial.org', '515.127.4563', STR_TO_DATE('24-12-2015', '%d-%m-%Y'), 'PU_CLERK', 2900.00, NULL, 114, 30),
    (117, 'Sigal', 'Tobias', 'sigal.tobias@sqltutorial.org', '515.127.4564', STR_TO_DATE('24-07-2015', '%d-%m-%Y'), 'PU_CLERK', 2800.00, NULL, 114, 30),
    (118, 'Guy', 'Himuro', 'guy.himuro@sqltutorial.org', '515.127.4565', STR_TO_DATE('15-11-2016', '%d-%m-%Y'), 'PU_CLERK', 2600.00, NULL, 114, 30),
    (119, 'Karen', 'Colmenares', 'karen.colmenares@sqltutorial.org', '515.127.4566', STR_TO_DATE('10-08-2012', '%d-%m-%Y'), 'PU_CLERK', 2500.00, NULL, 114, 30),
    (120, 'Matthew', 'Weiss', 'matthew.weiss@sqltutorial.org', '650.123.1234', STR_TO_DATE('18-07-2014', '%d-%m-%Y'), 'ST_MAN', 8000.00, NULL, 100, 50),
    (121, 'Adam', 'Johnson', 'adam.johnson@sqltutorial.org', '650.123.3214', STR_TO_DATE('09-04-2015', '%d-%m-%Y'), 'ST_MAN', 7000.00, NULL, 100, 50),
    (122, 'Payam', 'Kaufling', 'payam.kaufling@sqltutorial.org', '650.123.3235', STR_TO_DATE('01-05-2013', '%d-%m-%Y'), 'ST_MAN', 7500.00, NULL, 100, 50),
    (123, 'Shanta', 'Vollman', 'shanta.vollman@sqltutorial.org', '650.123.4234', STR_TO_DATE('10-10-2005', '%d-%m-%Y'), 'ST_MAN', 6500.00, NULL, 100, 50),
    (124, 'Kevin', 'Mourgos', 'kevin.mourgos@sqltutorial.org', '650.123.5234', STR_TO_DATE('16-11-2007', '%d-%m-%Y'), 'ST_MAN', 5800.00, NULL, 100, 50),
    (125, 'Julia', 'Nayer', 'julia.nayer@sqltutorial.org', '650.124.1214', STR_TO_DATE('16-07-2014', '%d-%m-%Y'), 'ST_CLERK', 3200.00, NULL, 120, 50),
    (126, 'Irene', 'Mikkilineni', 'irene.mikkilineni@sqltutorial.org', '650.124.1224', STR_TO_DATE('28-09-2015', '%d-%m-%Y'), 'ST_CLERK', 2700.00, NULL, 120, 50),
    (127, 'James', 'Landry', 'james.landry@sqltutorial.org', '650.124.1334', STR_TO_DATE('14-01-2007', '%d-%m-%Y'), 'ST_CLERK', 2400.00, NULL, 120, 50),
    (128, 'Steven', 'Markle', 'steven.markle@sqltutorial.org', '650.124.1434', STR_TO_DATE('08-03-2008', '%d-%m-%Y'), 'ST_CLERK', 2200.00, NULL, 120, 50),
    (129, 'Laura', 'Bissot', 'laura.bissot@sqltutorial.org', '650.124.1534', STR_TO_DATE('20-08-2011', '%d-%m-%Y'), 'ST_CLERK', 3300.00, NULL, 121, 50),
    (130, 'Lois', 'Doran', 'lois.doran@sqltutorial.org', '650.124.2234', STR_TO_DATE('24-12-2015', '%d-%m-%Y'), 'ST_CLERK', 3600.00, NULL, 121, 50),
    (131, 'Saralia', 'Carr', 'saralia.carr@sqltutorial.org', '650.124.3214', STR_TO_DATE('29-01-2011', '%d-%m-%Y'), 'ST_CLERK', 4200.00, NULL, 121, 50),
    (132, 'Britney', 'Pierce', 'britney.pierce@sqltutorial.org', '650.124.4214', STR_TO_DATE('03-03-2014', '%d-%m-%Y'), 'ST_CLERK', 3900.00, NULL, 121, 50),
    (133, 'Mario', 'SFoote', 'mario.sfoote@sqltutorial.org', '650.124.4334', STR_TO_DATE('30-12-2015', '%d-%m-%Y'), 'ST_CLERK', 3200.00, NULL, 121, 50),
    (134, 'Nandita', 'Sarchand', 'nandita.sarchand@sqltutorial.org', '650.124.5214', STR_TO_DATE('27-01-2012', '%d-%m-%Y'), 'ST_CLERK', 4200.00, NULL, 121, 50),
    (135, 'Alexa', 'Tena', 'alexa.tena@sqltutorial.org', '650.124.6214', STR_TO_DATE('26-03-2013', '%d-%m-%Y'), 'ST_CLERK', 3800.00, NULL, 121, 50),
    (136, 'Hazel', 'Burton', 'hazel.burton@sqltutorial.org', '650.124.7214', STR_TO_DATE('20-02-2013', '%d-%m-%Y'), 'ST_CLERK', 3200.00, NULL, 122, 50),
    (137, 'Renske', 'Ladwig', 'renske.ladwig@sqltutorial.org', '650.124.8214', STR_TO_DATE('14-07-2013', '%d-%m-%Y'), 'ST_CLERK', 3600.00, NULL, 122, 50),
    (138, 'Stephen', 'Stiles', 'stephen.stiles@sqltutorial.org', '650.124.9214', STR_TO_DATE('26-10-2005', '%d-%m-%Y'), 'ST_CLERK', 3200.00, NULL, 122, 50),
    (139, 'John', 'Seo', 'john.seo@sqltutorial.org', '650.124.1213', STR_TO_DATE('12-02-2006', '%d-%m-%Y'), 'ST_CLERK', 2700.00, NULL, 122, 50),
    (140, 'Joshua', 'Turner', 'joshua.turner@sqltutorial.org', '650.124.1214', STR_TO_DATE('24-03-2006', '%d-%m-%Y'), 'ST_CLERK', 2800.00, NULL, 122, 50),
    (141, 'Jean', 'Fleaur', 'jean.fleaur@sqltutorial.org', '650.124.1216', STR_TO_DATE('23-01-2013', '%d-%m-%Y'), 'ST_CLERK', 3100.00, NULL, 122, 50),
    (142, 'Martha', 'Sullivan', 'martha.sullivan@sqltutorial.org', '650.124.4234', STR_TO_DATE('21-06-2002', '%d-%m-%Y'), 'ST_CLERK', 3200.00, NULL, 122, 50),
    (143, 'Randall', 'Matos', 'randall.matos@sqltutorial.org', '650.124.2334', STR_TO_DATE('15-03-2012', '%d-%m-%Y'), 'ST_CLERK', 2600.00, NULL, 123, 50),
    (144, 'Peter', 'Vargas', 'peter.vargas@sqltutorial.org', '650.124.4334', STR_TO_DATE('09-07-2006', '%d-%m-%Y'), 'ST_CLERK', 2500.00, NULL, 123, 50),
    (145, 'John', 'Russell', 'john.russell@sqltutorial.org', '011.44.1344.429268', STR_TO_DATE('01-10-2004', '%d-%m-%Y'), 'SA_MAN', 14000.00, 0.40, 100, 80),
    (146, 'Karen', 'Partners', 'karen.partners@sqltutorial.org', '011.44.1344.467268', STR_TO_DATE('05-01-2005', '%d-%m-%Y'), 'SA_MAN', 13500.00, 0.30, 100, 80),
    (147, 'Alberto', 'Errazuriz', 'alberto.errazuriz@sqltutorial.org', '011.44.1344.429278', STR_TO_DATE('10-03-2005', '%d-%m-%Y'), 'SA_MAN', 12000.00, 0.30, 100, 80),
    (148, 'Gerald', 'Cambrault', 'gerald.cambrault@sqltutorial.org', '011.44.1344.619268', STR_TO_DATE('15-10-2007', '%d-%m-%Y'), 'SA_MAN', 11000.00, 0.30, 100, 80),
    (149, 'Eleni', 'Zlotkey', 'eleni.zlotkey@sqltutorial.org', '011.44.1344.429018', STR_TO_DATE('29-01-2008', '%d-%m-%Y'), 'SA_MAN', 10500.00, 0.20, 100, 80),
    (150, 'Peter', 'Tucker', 'peter.tucker@sqltutorial.org', '011.44.1344.129268', STR_TO_DATE('30-01-2005', '%d-%m-%Y'), 'SA_REP', 10000.00, 0.30, 145, 80),
    (151, 'David', 'Bernstein', 'david.bernstein@sqltutorial.org', '011.44.1344.345268', STR_TO_DATE('24-03-2005', '%d-%m-%Y'), 'SA_REP', 9500.00, 0.25, 145, 80),
    (152, 'Peter', 'Hall', 'peter.hall@sqltutorial.org', '011.44.1344.478968', STR_TO_DATE('20-08-2005', '%d-%m-%Y'), 'SA_REP', 9000.00, 0.25, 145, 80),
    (153, 'Christopher', 'Olsen', 'christopher.olsen@sqltutorial.org', '011.44.1344.498718', STR_TO_DATE('30-03-2006', '%d-%m-%Y'), 'SA_REP', 8000.00, 0.20, 145, 80),
    (154, 'Nanette', 'Cambrault', 'nanette.cambrault@sqltutorial.org', '011.44.1344.987668', STR_TO_DATE('09-12-2006', '%d-%m-%Y'), 'SA_REP', 7500.00, 0.20, 145, 80),
    (155, 'Oliver', 'Tuvault', 'oliver.tuvault@sqltutorial.org', '011.44.1344.486465', STR_TO_DATE('23-10-2007', '%d-%m-%Y'), 'SA_REP', 7000.00, 0.15, 145, 80),
    (156, 'Janette', 'King', 'janette.king@sqltutorial.org', '011.44.1345.429268', STR_TO_DATE('30-01-2004', '%d-%m-%Y'), 'SA_REP', 8500.00, 0.35, 146, 80),
    (157, 'Patrick', 'Sully', 'patrick.sully@sqltutorial.org', '011.44.1345.929268', STR_TO_DATE('04-03-2004', '%d-%m-%Y'), 'SA_REP', 9500.00, 0.35, 146, 80),
    (158, 'Allan', 'McEwen', 'allan.mcewen@sqltutorial.org', '011.44.1345.829268', STR_TO_DATE('01-08-2004', '%d-%m-%Y'), 'SA_REP', 9000.00, 0.35, 146, 80),
    (159, 'Lindsey', 'Smith', 'lindsey.smith@sqltutorial.org', '011.44.1345.729268', STR_TO_DATE('10-03-2005', '%d-%m-%Y'), 'SA_REP', 8000.00, 0.30, 146, 80),
    (160, 'Louise', 'Doran', 'louise.doran@sqltutorial.org', '011.44.1345.629268', STR_TO_DATE('15-12-2005', '%d-%m-%Y'), 'SA_REP', 7500.00, 0.30, 146, 80),
    (161, 'Sarath', 'Sewall', 'sarath.sewall@sqltutorial.org', '011.44.1345.529268', STR_TO_DATE('03-11-2006', '%d-%m-%Y'), 'SA_REP', 7000.00, 0.25, 146, 80),
    (162, 'Clara', 'Vishney', 'clara.vishney@sqltutorial.org', '011.44.1345.429268', STR_TO_DATE('11-11-2005', '%d-%m-%Y'), 'SA_REP', 10500.00, 0.25, 147, 80),
    (163, 'Danielle', 'Greene', 'danielle.greene@sqltutorial.org', '011.44.1345.329268', STR_TO_DATE('19-03-2007', '%d-%m-%Y'), 'SA_REP', 9500.00, 0.15, 147, 80),
    (164, 'Mattea', 'Martin', 'mattea.martin@sqltutorial.org', '011.44.1345.229268', STR_TO_DATE('17-11-2009', '%d-%m-%Y'), 'SA_REP', 7200.00, 0.10, 147, 80),
    (165, 'David', 'Lee', 'david.lee@sqltutorial.org', '011.44.1345.129268', STR_TO_DATE('13-02-2008', '%d-%m-%Y'), 'SA_REP', 6800.00, 0.10, 147, 80),
    (166, 'Sundar', 'Ande', 'sundar.ande@sqltutorial.org', '011.44.1346.129268', STR_TO_DATE('24-03-2008', '%d-%m-%Y'), 'SA_REP', 6400.00, 0.10, 147, 80),
    (167, 'Amit', 'Banda', 'amit.banda@sqltutorial.org', '011.44.1346.229268', STR_TO_DATE('21-04-2008', '%d-%m-%Y'), 'SA_REP', 6200.00, 0.10, 147, 80),
    (168, 'Lisa', 'Ozer', 'lisa.ozer@sqltutorial.org', '011.44.1346.329268', STR_TO_DATE('11-03-2005', '%d-%m-%Y'), 'SA_REP', 11500.00, 0.25, 148, 80),
    (169, 'Harrison', 'Bloom', 'harrison.bloom@sqltutorial.org', '011.44.1346.429268', STR_TO_DATE('23-03-2006', '%d-%m-%Y'), 'SA_REP', 10000.00, 0.20, 148, 80),
    (170, 'Tayler', 'Fox', 'tayler.fox@sqltutorial.org', '011.44.1346.529268', STR_TO_DATE('24-01-2006', '%d-%m-%Y'), 'SA_REP', 9600.00, 0.20, 148, 80),
    (171, 'William', 'Smith', 'william.smith@sqltutorial.org', '011.44.1346.629268', STR_TO_DATE('23-02-2007', '%d-%m-%Y'), 'SA_REP', 7400.00, 0.15, 148, 80),
    (172, 'Elizabeth', 'Bates', 'elizabeth.bates@sqltutorial.org', '011.44.1346.729268', STR_TO_DATE('24-03-2007', '%d-%m-%Y'), 'SA_REP', 7300.00, 0.15, 148, 80),
    (173, 'Sundita', 'Kumar', 'sundita.kumar@sqltutorial.org', '011.44.1346.829268', STR_TO_DATE('21-04-2008', '%d-%m-%Y'), 'SA_REP', 6100.00, 0.10, 148, 80),
    (174, 'Ellen', 'Abel', 'ellen.abel@sqltutorial.org', '011.44.1346.929268', STR_TO_DATE('11-05-2004', '%d-%m-%Y'), 'SA_REP', 11000.00, 0.30, 149, 80),
    (175, 'Alyssa', 'Hutton', 'alyssa.hutton@sqltutorial.org', '011.44.1346.829268', STR_TO_DATE('19-03-2005', '%d-%m-%Y'), 'SA_REP', 8800.00, 0.25, 149, 80),
    (176, 'Jonathon', 'Taylor', 'jonathon.taylor@sqltutorial.org', '011.44.1346.719268', STR_TO_DATE('24-03-2006', '%d-%m-%Y'), 'SA_REP', 8600.00, 0.20, 149, 80),
    (177, 'Jack', 'Livingston', 'jack.livingston@sqltutorial.org', '011.44.1346.619268', STR_TO_DATE('23-04-2006', '%d-%m-%Y'), 'SA_REP', 8400.00, 0.15, 149, 80),
    (178, 'Kimberely', 'Grant', 'kimberely.grant@sqltutorial.org', '011.44.1346.519268', STR_TO_DATE('24-05-2007', '%d-%m-%Y'), 'SA_REP', 7000.00, 0.15, 149, 80),
    (179, 'Charles', 'Johnson', 'charles.johnson@sqltutorial.org', '011.44.1346.419268', STR_TO_DATE('04-01-2008', '%d-%m-%Y'), 'SA_REP', 6200.00, 0.10, 149, 80),
    (180, 'Winston', 'Taylor', 'winston.taylor@sqltutorial.org', '650.507.9222', STR_TO_DATE('24-01-2006', '%d-%m-%Y'), 'SH_CLERK', 3200.00, NULL, 120, 50),
    (181, 'Jean', 'Fleaur', 'jean.fleaur2@sqltutorial.org', '650.507.9877', STR_TO_DATE('13-02-2016', '%d-%m-%Y'), 'SH_CLERK', 3100.00, NULL, 120, 50),
    (182, 'Martha', 'Sullivan', 'martha.sullivan2@sqltutorial.org', '650.507.9811', STR_TO_DATE('30-06-2017', '%d-%m-%Y'), 'SH_CLERK', 2500.00, NULL, 120, 50),
    (183, 'Girard', 'Geoni', 'girard.geoni@sqltutorial.org', '650.507.4850', STR_TO_DATE('03-02-2017', '%d-%m-%Y'), 'SH_CLERK', 2800.00, NULL, 120, 50),
    (184, 'Oscar', 'Turon', 'oscar.turon@sqltutorial.org', '656.343.3322', STR_TO_DATE('23-11-2006', '%d-%m-%Y'), 'SH_CLERK', 2600.00, NULL, 121, 50),
    (185, 'Evette', 'Saylor', 'evette.saylor@sqltutorial.org', '656.343.4192', STR_TO_DATE('12-03-2005', '%d-%m-%Y'), 'SH_CLERK', 2500.00, NULL, 121, 50),
    (186, 'Parker', 'Hutton', 'parker.hutton@sqltutorial.org', '636.345.3071', STR_TO_DATE('23-05-2015', '%d-%m-%Y'), 'SH_CLERK', 2500.00, NULL, 121, 50),
    (187, 'Pradeep', 'Nayer', 'pradeep.nayer@sqltutorial.org', '650.505.1647', STR_TO_DATE('16-12-2016', '%d-%m-%Y'), 'SH_CLERK', 2400.00, NULL, 121, 50),
    (188, 'Gloria', 'Greene', 'gloria.greene@sqltutorial.org', '650.505.2143', STR_TO_DATE('13-07-2002', '%d-%m-%Y'), 'SH_CLERK', 3500.00, NULL, 121, 50),
    (189, 'Douglas', 'Grant', 'douglas.grant@sqltutorial.org', '650.505.3426', STR_TO_DATE('13-01-2008', '%d-%m-%Y'), 'SH_CLERK', 3300.00, NULL, 122, 50),
    (190, 'Elyssa', 'Hutton', 'elyssa.hutton@sqltutorial.org', '650.507.9633', STR_TO_DATE('11-02-2011', '%d-%m-%Y'), 'SH_CLERK', 3100.00, NULL, 122, 50),
    (191, 'TaVid', 'Bernstein', 'tavid.bernstein@sqltutorial.org', '650.507.4103', STR_TO_DATE('24-03-2005', '%d-%m-%Y'), 'SH_CLERK', 2800.00, NULL, 123, 50),
    (192, 'Peter', 'Smith', 'peter.smith@sqltutorial.org', '650.507.3908', STR_TO_DATE('30-07-2005', '%d-%m-%Y'), 'SH_CLERK', 2600.00, NULL, 123, 50),
    (193, 'Britney', 'Everett', 'britney.everett@sqltutorial.org', '650.508.1135', STR_TO_DATE('21-03-2013', '%d-%m-%Y'), 'SH_CLERK', 3900.00, NULL, 123, 50),
    (194, 'Samuel', 'Kiss', 'samuel.kiss@sqltutorial.org', '650.508.2858', STR_TO_DATE('24-07-2014', '%d-%m-%Y'), 'SH_CLERK', 3800.00, NULL, 123, 50),
    (195, 'Vance', 'Jones', 'vance.jones@sqltutorial.org', '650.505.1949', STR_TO_DATE('12-03-2007', '%d-%m-%Y'), 'SH_CLERK', 2800.00, NULL, 120, 50),
    (196, 'Barry', 'Bacon', 'barry.bacon@sqltutorial.org', '650.508.1090', STR_TO_DATE('24-06-2006', '%d-%m-%Y'), 'SH_CLERK', 2800.00, NULL, 120, 50),
    (197, 'Francesca', 'Cross', 'francesca.cross@sqltutorial.org', '650.504.2758', STR_TO_DATE('23-05-2012', '%d-%m-%Y'), 'SH_CLERK', 3000.00, NULL, 120, 50),
    (198, 'Donna', 'Snythia', 'donna.snythia@sqltutorial.org', '650.507.3369', STR_TO_DATE('30-03-2010', '%d-%m-%Y'), 'SH_CLERK', 2800.00, NULL, 123, 50),
    (199, 'Dorothy', 'Wallin', 'dorothy.wallin@sqltutorial.org', '650.507.9833', STR_TO_DATE('24-04-2014', '%d-%m-%Y'), 'SH_CLERK', 3300.00, NULL, 123, 50),
    (200, 'Jennifer', 'Whalen', 'jennifer.whalen@sqltutorial.org', '515.123.4444', STR_TO_DATE('17-09-2005', '%d-%m-%Y'), 'AD_ASST', 4400.00, NULL, 101, 10),
    (201, 'Michael', 'Hartstein', 'michael.hartstein@sqltutorial.org', '515.123.5555', STR_TO_DATE('17-02-2004', '%d-%m-%Y'), 'MK_MAN', 13000.00, NULL, 100, 20),
    (202, 'Pat', 'Fay', 'pat.fay@sqltutorial.org', '603.123.6666', STR_TO_DATE('17-08-2005', '%d-%m-%Y'), 'MK_REP', 6000.00, NULL, 201, 20),
    (203, 'Susan', 'Mavris', 'susan.mavris@sqltutorial.org', '515.123.7777', STR_TO_DATE('07-06-2002', '%d-%m-%Y'), 'HR_REP', 6500.00, NULL, 101, 40),
    (204, 'Hermann', 'Baer', 'hermann.baer@sqltutorial.org', '515.123.8888', STR_TO_DATE('07-06-2002', '%d-%m-%Y'), 'PR_REP', 10000.00, NULL, 101, 70),
    (205, 'Shelley', 'Higgins', 'shelley.higgins@sqltutorial.org', '515.123.8080', STR_TO_DATE('07-06-2002', '%d-%m-%Y'), 'AC_MGR', 12000.00, NULL, 101, 110),
    (206, 'William', 'Gietz', 'william.gietz@sqltutorial.org', '515.123.8181', STR_TO_DATE('07-06-2002', '%d-%m-%Y'), 'AC_ACCOUNT', 8300.00, NULL, 205, 110),
    -- India — IT Development (Bangalore, dept 280)
    (207, 'Rajesh', 'Kumar', 'rajesh.kumar@sqltutorial.org', '91.80.4567.1001', STR_TO_DATE('10-03-2018', '%d-%m-%Y'), 'IT_PROG', 8500.00, NULL, 103, 280),
    (208, 'Priya', 'Sharma', 'priya.sharma@sqltutorial.org', '91.80.4567.1002', STR_TO_DATE('15-06-2019', '%d-%m-%Y'), 'IT_PROG', 7200.00, NULL, 207, 280),
    (209, 'Arjun', 'Patel', 'arjun.patel@sqltutorial.org', '91.80.4567.1003', STR_TO_DATE('22-01-2020', '%d-%m-%Y'), 'IT_PROG', 6800.00, NULL, 207, 280),
    (210, 'Ananya', 'Reddy', 'ananya.reddy@sqltutorial.org', '91.80.4567.1004', STR_TO_DATE('05-08-2021', '%d-%m-%Y'), 'IT_PROG', 5500.00, NULL, 207, 280),
    (211, 'Vikram', 'Singh', 'vikram.singh@sqltutorial.org', '91.80.4567.1005', STR_TO_DATE('14-11-2022', '%d-%m-%Y'), 'IT_PROG', 5000.00, NULL, 207, 280),
    -- India — IT QA (Mumbai, dept 290)
    (212, 'Deepa', 'Nair', 'deepa.nair@sqltutorial.org', '91.22.6789.2001', STR_TO_DATE('03-04-2019', '%d-%m-%Y'), 'IT_PROG', 7800.00, NULL, 103, 290),
    (213, 'Suresh', 'Iyer', 'suresh.iyer@sqltutorial.org', '91.22.6789.2002', STR_TO_DATE('18-09-2020', '%d-%m-%Y'), 'IT_PROG', 6200.00, NULL, 212, 290),
    (214, 'Kavitha', 'Menon', 'kavitha.menon@sqltutorial.org', '91.22.6789.2003', STR_TO_DATE('07-02-2021', '%d-%m-%Y'), 'IT_PROG', 5800.00, NULL, 212, 290),
    (215, 'Amit', 'Gupta', 'amit.gupta@sqltutorial.org', '91.22.6789.2004', STR_TO_DATE('25-07-2023', '%d-%m-%Y'), 'IT_PROG', 4800.00, NULL, 212, 290),
    (216, 'Meera', 'Joshi', 'meera.joshi@sqltutorial.org', '91.22.6789.2005', STR_TO_DATE('12-01-2025', '%d-%m-%Y'), 'IT_PROG', 4500.00, NULL, 212, 290),
    -- India — IT Infrastructure (Gurugram, dept 300)
    (217, 'Rahul', 'Verma', 'rahul.verma@sqltutorial.org', '91.124.5678.3001', STR_TO_DATE('20-05-2017', '%d-%m-%Y'), 'IT_PROG', 8800.00, NULL, 103, 300),
    (218, 'Sneha', 'Chatterjee', 'sneha.chatterjee@sqltutorial.org', '91.124.5678.3002', STR_TO_DATE('11-08-2020', '%d-%m-%Y'), 'IT_PROG', 6500.00, NULL, 217, 300),
    (219, 'Karthik', 'Rajan', 'karthik.rajan@sqltutorial.org', '91.124.5678.3003', STR_TO_DATE('02-03-2022', '%d-%m-%Y'), 'IT_PROG', 5200.00, NULL, 217, 300),
    (220, 'Divya', 'Krishnan', 'divya.krishnan@sqltutorial.org', '91.124.5678.3004', STR_TO_DATE('15-10-2025', '%d-%m-%Y'), 'IT_PROG', 4200.00, NULL, 217, 300),
    -- Mexico — Sales (Mexico City, dept 310)
    (221, 'Carlos', 'Garcia', 'carlos.garcia@sqltutorial.org', '52.55.1234.5001', STR_TO_DATE('08-06-2016', '%d-%m-%Y'), 'SA_MAN', 12000.00, 0.30, 145, 310),
    (222, 'Maria', 'Lopez', 'maria.lopez@sqltutorial.org', '52.55.1234.5002', STR_TO_DATE('14-02-2018', '%d-%m-%Y'), 'SA_REP', 8500.00, 0.20, 221, 310),
    (223, 'Alejandro', 'Martinez', 'alejandro.martinez@sqltutorial.org', '52.55.1234.5003', STR_TO_DATE('22-09-2019', '%d-%m-%Y'), 'SA_REP', 7800.00, 0.20, 221, 310),
    (224, 'Sofia', 'Rodriguez', 'sofia.rodriguez@sqltutorial.org', '52.55.1234.5004', STR_TO_DATE('05-03-2021', '%d-%m-%Y'), 'SA_REP', 7000.00, 0.15, 221, 310),
    (225, 'Diego', 'Hernandez', 'diego.hernandez@sqltutorial.org', '52.55.1234.5005', STR_TO_DATE('19-07-2022', '%d-%m-%Y'), 'SA_REP', 6500.00, 0.15, 221, 310),
    (226, 'Valentina', 'Flores', 'valentina.flores@sqltutorial.org', '52.55.1234.5006', STR_TO_DATE('10-11-2024', '%d-%m-%Y'), 'SA_REP', 6200.00, 0.10, 221, 310),
    -- Mexico — Customer Support (Mexico City, dept 320)
    (227, 'Fernando', 'Morales', 'fernando.morales@sqltutorial.org', '52.55.6789.6001', STR_TO_DATE('17-04-2017', '%d-%m-%Y'), 'SH_CLERK', 4200.00, NULL, 221, 320),
    (228, 'Lucia', 'Sanchez', 'lucia.sanchez@sqltutorial.org', '52.55.6789.6002', STR_TO_DATE('28-08-2019', '%d-%m-%Y'), 'SH_CLERK', 3800.00, NULL, 227, 320),
    (229, 'Miguel', 'Ramirez', 'miguel.ramirez@sqltutorial.org', '52.55.6789.6003', STR_TO_DATE('03-01-2021', '%d-%m-%Y'), 'SH_CLERK', 3500.00, NULL, 227, 320),
    (230, 'Camila', 'Torres', 'camila.torres@sqltutorial.org', '52.55.6789.6004', STR_TO_DATE('15-06-2023', '%d-%m-%Y'), 'SH_CLERK', 3200.00, NULL, 227, 320),
    (231, 'Andres', 'Diaz', 'andres.diaz@sqltutorial.org', '52.55.6789.6005', STR_TO_DATE('20-02-2025', '%d-%m-%Y'), 'SH_CLERK', 2800.00, NULL, 227, 320),

    -- ========================
    -- USA — Fill empty departments
    -- ========================

    -- Treasury (120, Seattle 1700)
    (232, 'Sarah', 'Mitchell', 'sarah.mitchell@sqltutorial.org', '515.204.5001', STR_TO_DATE('10-06-2014', '%d-%m-%Y'), 'FI_MGR', 10500.00, NULL, 108, 120),
    (233, 'David', 'Anderson', 'david.anderson@sqltutorial.org', '515.204.5002', STR_TO_DATE('22-03-2016', '%d-%m-%Y'), 'FI_ACCOUNT', 7200.00, NULL, 232, 120),
    (234, 'Lisa', 'Park', 'lisa.park@sqltutorial.org', '515.204.5003', STR_TO_DATE('14-09-2019', '%d-%m-%Y'), 'FI_ACCOUNT', 5800.00, NULL, 232, 120),

    -- Corporate Tax (130, Seattle 1700)
    (235, 'Robert', 'Thompson', 'robert.thompson@sqltutorial.org', '515.204.6001', STR_TO_DATE('05-08-2012', '%d-%m-%Y'), 'FI_MGR', 11200.00, NULL, 108, 130),
    (236, 'Emily', 'Chen', 'emily.chen@sqltutorial.org', '515.204.6002', STR_TO_DATE('18-04-2018', '%d-%m-%Y'), 'FI_ACCOUNT', 6800.00, NULL, 235, 130),
    (237, 'James', 'Wilson', 'james.wilson@sqltutorial.org', '515.204.6003', STR_TO_DATE('02-11-2020', '%d-%m-%Y'), 'FI_ACCOUNT', 5500.00, NULL, 235, 130),

    -- Control And Audit (140, Seattle 1700)
    (238, 'Michelle', 'Davis', 'michelle.davis@sqltutorial.org', '515.204.7001', STR_TO_DATE('25-01-2015', '%d-%m-%Y'), 'AC_MGR', 10800.00, NULL, 205, 140),
    (239, 'Kevin', 'Brown', 'kevin.brown@sqltutorial.org', '515.204.7002', STR_TO_DATE('07-07-2019', '%d-%m-%Y'), 'AC_ACCOUNT', 6200.00, NULL, 238, 140),

    -- Shareholder Services (150, Seattle 1700)
    (240, 'Richard', 'White', 'richard.white@sqltutorial.org', '515.204.8001', STR_TO_DATE('12-03-2017', '%d-%m-%Y'), 'FI_ACCOUNT', 6500.00, NULL, 108, 150),
    (241, 'Amanda', 'Green', 'amanda.green@sqltutorial.org', '515.204.8002', STR_TO_DATE('30-06-2021', '%d-%m-%Y'), 'FI_ACCOUNT', 5200.00, NULL, 240, 150),

    -- Benefits (160, Seattle 1700, under HR)
    (242, 'Angela', 'Harris', 'angela.harris@sqltutorial.org', '515.123.9001', STR_TO_DATE('14-11-2013', '%d-%m-%Y'), 'HR_REP', 7500.00, NULL, 203, 160),
    (243, 'Nicole', 'Taylor', 'nicole.taylor@sqltutorial.org', '515.123.9002', STR_TO_DATE('20-05-2018', '%d-%m-%Y'), 'HR_REP', 5800.00, NULL, 242, 160),
    (244, 'Brian', 'Jackson', 'brian.jackson@sqltutorial.org', '515.123.9003', STR_TO_DATE('08-02-2020', '%d-%m-%Y'), 'HR_REP', 5200.00, NULL, 242, 160),

    -- Manufacturing (170, Seattle 1700)
    (245, 'Thomas', 'Clark', 'thomas.clark@sqltutorial.org', '650.505.3001', STR_TO_DATE('09-09-2008', '%d-%m-%Y'), 'ST_MAN', 7800.00, NULL, 100, 170),
    (246, 'Jason', 'Lee', 'jason.lee@sqltutorial.org', '650.505.3002', STR_TO_DATE('17-03-2015', '%d-%m-%Y'), 'ST_CLERK', 3800.00, NULL, 245, 170),
    (247, 'Ryan', 'Moore', 'ryan.moore@sqltutorial.org', '650.505.3003', STR_TO_DATE('24-08-2017', '%d-%m-%Y'), 'ST_CLERK', 3400.00, NULL, 245, 170),
    (248, 'Stephanie', 'Hill', 'stephanie.hill@sqltutorial.org', '650.505.3004', STR_TO_DATE('11-01-2019', '%d-%m-%Y'), 'ST_CLERK', 3100.00, NULL, 245, 170),
    (249, 'Brandon', 'Young', 'brandon.young@sqltutorial.org', '650.505.3005', STR_TO_DATE('05-06-2021', '%d-%m-%Y'), 'ST_CLERK', 2800.00, NULL, 245, 170),
    (250, 'Chris', 'Hall', 'chris.hall@sqltutorial.org', '650.505.3006', STR_TO_DATE('19-02-2023', '%d-%m-%Y'), 'ST_CLERK', 2500.00, NULL, 245, 170),

    -- Construction (180, Seattle 1700)
    (251, 'Mark', 'Lewis', 'mark.lewis@sqltutorial.org', '650.505.4001', STR_TO_DATE('23-04-2010', '%d-%m-%Y'), 'ST_MAN', 7200.00, NULL, 100, 180),
    (252, 'Paul', 'Robinson', 'paul.robinson@sqltutorial.org', '650.505.4002', STR_TO_DATE('15-09-2016', '%d-%m-%Y'), 'ST_CLERK', 3500.00, NULL, 251, 180),
    (253, 'Laura', 'Walker', 'laura.walker@sqltutorial.org', '650.505.4003', STR_TO_DATE('07-03-2018', '%d-%m-%Y'), 'ST_CLERK', 3200.00, NULL, 251, 180),
    (254, 'Nathan', 'King', 'nathan.king@sqltutorial.org', '650.505.4004', STR_TO_DATE('28-11-2022', '%d-%m-%Y'), 'ST_CLERK', 2600.00, NULL, 251, 180),

    -- Contracting (190, Seattle 1700)
    (255, 'Eric', 'Scott', 'eric.scott@sqltutorial.org', '650.505.5001', STR_TO_DATE('13-07-2017', '%d-%m-%Y'), 'ST_CLERK', 3400.00, NULL, 100, 190),
    (256, 'Jennifer', 'Adams', 'jennifer.adams@sqltutorial.org', '650.505.5002', STR_TO_DATE('22-04-2019', '%d-%m-%Y'), 'ST_CLERK', 3000.00, NULL, 255, 190),
    (257, 'Scott', 'Miller', 'scott.miller@sqltutorial.org', '650.505.5003', STR_TO_DATE('10-08-2021', '%d-%m-%Y'), 'ST_CLERK', 2700.00, NULL, 255, 190),

    -- Operations (200, Seattle 1700)
    (258, 'Catherine', 'Wright', 'catherine.wright@sqltutorial.org', '650.505.6001', STR_TO_DATE('18-06-2011', '%d-%m-%Y'), 'ST_MAN', 7500.00, NULL, 100, 200),
    (259, 'Daniel', 'Thomas', 'daniel.thomas@sqltutorial.org', '650.505.6002', STR_TO_DATE('04-02-2016', '%d-%m-%Y'), 'ST_CLERK', 3600.00, NULL, 258, 200),
    (260, 'Andrew', 'Martin', 'andrew.martin@sqltutorial.org', '650.505.6003', STR_TO_DATE('27-09-2018', '%d-%m-%Y'), 'ST_CLERK', 3200.00, NULL, 258, 200),
    (261, 'Rachel', 'Edwards', 'rachel.edwards@sqltutorial.org', '650.505.6004', STR_TO_DATE('15-03-2020', '%d-%m-%Y'), 'ST_CLERK', 2900.00, NULL, 258, 200),
    (262, 'Tyler', 'Collins', 'tyler.collins@sqltutorial.org', '650.505.6005', STR_TO_DATE('08-01-2023', '%d-%m-%Y'), 'ST_CLERK', 2500.00, NULL, 258, 200),

    -- IT Help Desk (230, Seattle 1700)
    (263, 'Greg', 'Phillips', 'greg.phillips@sqltutorial.org', '515.127.7001', STR_TO_DATE('21-08-2014', '%d-%m-%Y'), 'IT_PROG', 7200.00, NULL, 103, 230),
    (264, 'Ashley', 'Cooper', 'ashley.cooper@sqltutorial.org', '515.127.7002', STR_TO_DATE('06-05-2018', '%d-%m-%Y'), 'IT_PROG', 5500.00, NULL, 263, 230),
    (265, 'Justin', 'Reed', 'justin.reed@sqltutorial.org', '515.127.7003', STR_TO_DATE('14-10-2021', '%d-%m-%Y'), 'IT_PROG', 4800.00, NULL, 263, 230),
    (266, 'Samantha', 'Morris', 'samantha.morris@sqltutorial.org', '515.127.7004', STR_TO_DATE('03-06-2024', '%d-%m-%Y'), 'IT_PROG', 4200.00, NULL, 263, 230),

    -- Recruiting (260, Seattle 1700, under HR)
    (267, 'Megan', 'Stewart', 'megan.stewart@sqltutorial.org', '515.123.9101', STR_TO_DATE('19-05-2015', '%d-%m-%Y'), 'HR_REP', 7000.00, NULL, 203, 260),
    (268, 'Tyler', 'Ross', 'tyler.ross@sqltutorial.org', '515.123.9102', STR_TO_DATE('28-01-2020', '%d-%m-%Y'), 'HR_REP', 5500.00, NULL, 267, 260),
    (269, 'Hannah', 'Bell', 'hannah.bell@sqltutorial.org', '515.123.9103', STR_TO_DATE('16-07-2023', '%d-%m-%Y'), 'HR_REP', 4800.00, NULL, 267, 260),

    -- Payroll (270, Seattle 1700, under HR)
    (270, 'Christina', 'Evans', 'christina.evans@sqltutorial.org', '515.123.9201', STR_TO_DATE('22-09-2013', '%d-%m-%Y'), 'HR_REP', 7200.00, NULL, 203, 270),
    (271, 'Marcus', 'Howard', 'marcus.howard@sqltutorial.org', '515.123.9202', STR_TO_DATE('11-06-2019', '%d-%m-%Y'), 'HR_REP', 5200.00, NULL, 270, 270),
    (272, 'Diane', 'Foster', 'diane.foster@sqltutorial.org', '515.123.9203', STR_TO_DATE('03-04-2022', '%d-%m-%Y'), 'HR_REP', 4600.00, NULL, 270, 270),

    -- ========================
    -- India — Fill IT Support (210 Bangalore) and NOC (220 Mumbai)
    -- ========================

    -- IT Support (210, Bangalore 3300)
    (273, 'Arun', 'Mehta', 'arun.mehta@sqltutorial.org', '91.80.4567.4001', STR_TO_DATE('12-07-2017', '%d-%m-%Y'), 'IT_PROG', 8200.00, NULL, 103, 210),
    (274, 'Pooja', 'Desai', 'pooja.desai@sqltutorial.org', '91.80.4567.4002', STR_TO_DATE('25-03-2019', '%d-%m-%Y'), 'IT_PROG', 6000.00, NULL, 273, 210),
    (275, 'Sanjay', 'Rao', 'sanjay.rao@sqltutorial.org', '91.80.4567.4003', STR_TO_DATE('08-11-2021', '%d-%m-%Y'), 'IT_PROG', 5200.00, NULL, 273, 210),
    (276, 'Naveen', 'Reddy', 'naveen.reddy@sqltutorial.org', '91.80.4567.4004', STR_TO_DATE('20-06-2023', '%d-%m-%Y'), 'IT_PROG', 4500.00, NULL, 273, 210),
    (277, 'Priti', 'Kulkarni', 'priti.kulkarni@sqltutorial.org', '91.80.4567.4005', STR_TO_DATE('13-01-2025', '%d-%m-%Y'), 'IT_PROG', 4000.00, NULL, 273, 210),

    -- NOC (220, Mumbai 3400)
    (278, 'Manoj', 'Tiwari', 'manoj.tiwari@sqltutorial.org', '91.22.6789.5001', STR_TO_DATE('04-09-2018', '%d-%m-%Y'), 'IT_PROG', 7800.00, NULL, 103, 220),
    (279, 'Rashmi', 'Bhat', 'rashmi.bhat@sqltutorial.org', '91.22.6789.5002', STR_TO_DATE('18-02-2020', '%d-%m-%Y'), 'IT_PROG', 5800.00, NULL, 278, 220),
    (280, 'Anil', 'Prasad', 'anil.prasad@sqltutorial.org', '91.22.6789.5003', STR_TO_DATE('29-09-2022', '%d-%m-%Y'), 'IT_PROG', 4800.00, NULL, 278, 220),
    (281, 'Harish', 'Srinivasan', 'harish.srinivasan@sqltutorial.org', '91.22.6789.5004', STR_TO_DATE('15-05-2024', '%d-%m-%Y'), 'IT_PROG', 4200.00, NULL, 278, 220),

    -- Additional India staff in existing depts for volume
    (282, 'Ravi', 'Shankar', 'ravi.shankar@sqltutorial.org', '91.80.4567.1006', STR_TO_DATE('11-04-2020', '%d-%m-%Y'), 'IT_PROG', 6200.00, NULL, 207, 280),
    (283, 'Lakshmi', 'Venkatesh', 'lakshmi.venkatesh@sqltutorial.org', '91.80.4567.1007', STR_TO_DATE('03-08-2021', '%d-%m-%Y'), 'IT_PROG', 5600.00, NULL, 207, 280),
    (284, 'Ganesh', 'Pillai', 'ganesh.pillai@sqltutorial.org', '91.22.6789.2006', STR_TO_DATE('17-12-2022', '%d-%m-%Y'), 'IT_PROG', 5000.00, NULL, 212, 290),
    (285, 'Sunita', 'Das', 'sunita.das@sqltutorial.org', '91.22.6789.2007', STR_TO_DATE('22-05-2024', '%d-%m-%Y'), 'IT_PROG', 4300.00, NULL, 212, 290),
    (286, 'Prakash', 'Hegde', 'prakash.hegde@sqltutorial.org', '91.124.5678.3005', STR_TO_DATE('06-09-2023', '%d-%m-%Y'), 'IT_PROG', 4800.00, NULL, 217, 300),
    (287, 'Nisha', 'Agarwal', 'nisha.agarwal@sqltutorial.org', '91.124.5678.3006', STR_TO_DATE('28-02-2025', '%d-%m-%Y'), 'IT_PROG', 4000.00, NULL, 217, 300),

    -- ========================
    -- Mexico — Fill Gov Sales (240) and Retail Sales (250)
    -- ========================

    -- Government Sales (240, Mexico City 3600)
    (288, 'Roberto', 'Castillo', 'roberto.castillo@sqltutorial.org', '52.55.2345.7001', STR_TO_DATE('26-04-2017', '%d-%m-%Y'), 'SA_MAN', 11500.00, 0.25, 145, 240),
    (289, 'Ana', 'Gutierrez', 'ana.gutierrez@sqltutorial.org', '52.55.2345.7002', STR_TO_DATE('10-10-2019', '%d-%m-%Y'), 'SA_REP', 7500.00, 0.15, 288, 240),
    (290, 'Pablo', 'Mendoza', 'pablo.mendoza@sqltutorial.org', '52.55.2345.7003', STR_TO_DATE('15-06-2021', '%d-%m-%Y'), 'SA_REP', 6800.00, 0.15, 288, 240),
    (291, 'Isabel', 'Cruz', 'isabel.cruz@sqltutorial.org', '52.55.2345.7004', STR_TO_DATE('08-03-2024', '%d-%m-%Y'), 'SA_REP', 6200.00, 0.10, 288, 240),

    -- Retail Sales (250, Mexico City 3700)
    (292, 'Patricia', 'Vega', 'patricia.vega@sqltutorial.org', '52.55.3456.8001', STR_TO_DATE('18-08-2016', '%d-%m-%Y'), 'SA_MAN', 11000.00, 0.25, 145, 250),
    (293, 'Jorge', 'Ortega', 'jorge.ortega@sqltutorial.org', '52.55.3456.8002', STR_TO_DATE('05-04-2018', '%d-%m-%Y'), 'SA_REP', 7200.00, 0.15, 292, 250),
    (294, 'Elena', 'Ruiz', 'elena.ruiz@sqltutorial.org', '52.55.3456.8003', STR_TO_DATE('21-11-2020', '%d-%m-%Y'), 'SA_REP', 6500.00, 0.15, 292, 250),
    (295, 'Marco', 'Perez', 'marco.perez@sqltutorial.org', '52.55.3456.8004', STR_TO_DATE('14-07-2022', '%d-%m-%Y'), 'SA_REP', 6000.00, 0.10, 292, 250),
    (296, 'Rosa', 'Jimenez', 'rosa.jimenez@sqltutorial.org', '52.55.3456.8005', STR_TO_DATE('06-02-2025', '%d-%m-%Y'), 'SA_REP', 6000.00, 0.10, 292, 250),

    -- Additional Mexico staff in existing depts for volume
    (297, 'Hector', 'Vargas', 'hector.vargas@sqltutorial.org', '52.55.1234.5007', STR_TO_DATE('23-01-2020', '%d-%m-%Y'), 'SA_REP', 7200.00, 0.15, 221, 310),
    (298, 'Gabriela', 'Reyes', 'gabriela.reyes@sqltutorial.org', '52.55.1234.5008', STR_TO_DATE('09-08-2021', '%d-%m-%Y'), 'SA_REP', 6800.00, 0.15, 221, 310),
    (299, 'Luis', 'Navarro', 'luis.navarro@sqltutorial.org', '52.55.6789.6006', STR_TO_DATE('17-05-2022', '%d-%m-%Y'), 'SH_CLERK', 3100.00, NULL, 227, 320),
    (300, 'Teresa', 'Aguilar', 'teresa.aguilar@sqltutorial.org', '52.55.6789.6007', STR_TO_DATE('04-12-2023', '%d-%m-%Y'), 'SH_CLERK', 2900.00, NULL, 227, 320),

    -- ========================
    -- Terminated employees (last 12 months) — for attrition KPIs
    -- ========================

    -- USA terminations
    (301, 'Kevin', 'OBrien', 'kevin.obrien@sqltutorial.org', '515.127.9001', STR_TO_DATE('12-04-2016', '%d-%m-%Y'), 'IT_PROG', 5800.00, NULL, 103, 60),
    (302, 'Sarah', 'Nguyen', 'sarah.nguyen@sqltutorial.org', '011.44.1346.129001', STR_TO_DATE('09-07-2018', '%d-%m-%Y'), 'SA_REP', 7200.00, 0.15, 145, 80),
    (303, 'Michael', 'Torres', 'michael.torres@sqltutorial.org', '650.505.9001', STR_TO_DATE('23-05-2015', '%d-%m-%Y'), 'ST_CLERK', 3600.00, NULL, 121, 50),
    (304, 'Rebecca', 'Foster', 'rebecca.foster@sqltutorial.org', '515.204.9001', STR_TO_DATE('11-09-2017', '%d-%m-%Y'), 'FI_ACCOUNT', 6800.00, NULL, 108, 100),
    (305, 'Robert', 'Kim', 'robert.kim@sqltutorial.org', '650.505.9002', STR_TO_DATE('26-03-2019', '%d-%m-%Y'), 'ST_CLERK', 3200.00, NULL, 245, 170),
    (306, 'Jennifer', 'Liu', 'jennifer.liu@sqltutorial.org', '515.123.9003', STR_TO_DATE('14-02-2018', '%d-%m-%Y'), 'HR_REP', 6200.00, NULL, 203, 40),
    (307, 'Chris', 'Williams', 'chris.williams@sqltutorial.org', '515.127.9002', STR_TO_DATE('05-08-2016', '%d-%m-%Y'), 'PU_CLERK', 3400.00, NULL, 114, 30),

    -- India terminations
    (308, 'James', 'Patel', 'james.patel@sqltutorial.org', '91.80.4567.9001', STR_TO_DATE('18-06-2020', '%d-%m-%Y'), 'IT_PROG', 5500.00, NULL, 207, 280),
    (309, 'David', 'Basu', 'david.basu@sqltutorial.org', '91.80.4567.9002', STR_TO_DATE('30-01-2021', '%d-%m-%Y'), 'IT_PROG', 5000.00, NULL, 273, 210),

    -- Mexico terminations
    (310, 'Amanda', 'Rivera', 'amanda.rivera@sqltutorial.org', '52.55.1234.9001', STR_TO_DATE('07-04-2019', '%d-%m-%Y'), 'SA_REP', 7000.00, 0.15, 221, 310),
    (311, 'Michelle', 'Santos', 'michelle.santos@sqltutorial.org', '52.55.6789.9001', STR_TO_DATE('16-11-2021', '%d-%m-%Y'), 'SH_CLERK', 3200.00, NULL, 227, 320),
    (312, 'Samantha', 'Bravo', 'samantha.bravo@sqltutorial.org', '52.55.3456.9001', STR_TO_DATE('22-08-2020', '%d-%m-%Y'), 'SA_REP', 6500.00, 0.10, 292, 250),

    -- ========================
    -- Additional recent hires (last 6 months) — for new hire KPI trend
    -- ========================

    -- USA recent hires
    (313, 'Olivia', 'Bennett', 'olivia.bennett@sqltutorial.org', '515.127.8001', STR_TO_DATE('15-10-2025', '%d-%m-%Y'), 'IT_PROG', 5000.00, NULL, 103, 60),
    (314, 'Ethan', 'Murphy', 'ethan.murphy@sqltutorial.org', '650.505.8001', STR_TO_DATE('03-11-2025', '%d-%m-%Y'), 'ST_CLERK', 2400.00, NULL, 120, 50),
    (315, 'Sophia', 'Carter', 'sophia.carter@sqltutorial.org', '515.204.8003', STR_TO_DATE('20-12-2025', '%d-%m-%Y'), 'FI_ACCOUNT', 5000.00, NULL, 108, 100),
    (316, 'Liam', 'Brooks', 'liam.brooks@sqltutorial.org', '515.127.8002', STR_TO_DATE('06-01-2026', '%d-%m-%Y'), 'PU_CLERK', 2800.00, NULL, 114, 30),
    (317, 'Emma', 'Price', 'emma.price@sqltutorial.org', '515.123.8003', STR_TO_DATE('18-02-2026', '%d-%m-%Y'), 'HR_REP', 4500.00, NULL, 267, 260),
    (318, 'Noah', 'Henderson', 'noah.henderson@sqltutorial.org', '650.505.8002', STR_TO_DATE('01-03-2026', '%d-%m-%Y'), 'ST_CLERK', 2200.00, NULL, 245, 170),

    -- India recent hires
    (319, 'Aditi', 'Saxena', 'aditi.saxena@sqltutorial.org', '91.80.4567.8001', STR_TO_DATE('25-10-2025', '%d-%m-%Y'), 'IT_PROG', 4200.00, NULL, 207, 280),
    (320, 'Rohan', 'Kapoor', 'rohan.kapoor@sqltutorial.org', '91.22.6789.8001', STR_TO_DATE('10-12-2025', '%d-%m-%Y'), 'IT_PROG', 4000.00, NULL, 278, 220),
    (321, 'Neha', 'Mishra', 'neha.mishra@sqltutorial.org', '91.124.5678.8001', STR_TO_DATE('17-01-2026', '%d-%m-%Y'), 'IT_PROG', 4000.00, NULL, 273, 210),
    (322, 'Varun', 'Bhatt', 'varun.bhatt@sqltutorial.org', '91.80.4567.8002', STR_TO_DATE('03-03-2026', '%d-%m-%Y'), 'IT_PROG', 4000.00, NULL, 212, 290),

    -- Mexico recent hires
    (323, 'Daniel', 'Espinoza', 'daniel.espinoza@sqltutorial.org', '52.55.2345.8001', STR_TO_DATE('12-11-2025', '%d-%m-%Y'), 'SA_REP', 6000.00, 0.10, 288, 240),
    (324, 'Laura', 'Dominguez', 'laura.dominguez@sqltutorial.org', '52.55.6789.8001', STR_TO_DATE('05-01-2026', '%d-%m-%Y'), 'SH_CLERK', 2800.00, NULL, 227, 320),
    (325, 'Ricardo', 'Soto', 'ricardo.soto@sqltutorial.org', '52.55.3456.8006', STR_TO_DATE('20-02-2026', '%d-%m-%Y'), 'SA_REP', 6000.00, 0.10, 292, 250);

COMMIT;

-- *************************** insert data into the JOB_HISTORY table

INSERT INTO job_history VALUES
    (102, STR_TO_DATE('13-01-2011', '%d-%m-%Y'), STR_TO_DATE('24-07-2016', '%d-%m-%Y'), 'IT_PROG', 60),
    (101, STR_TO_DATE('21-09-2007', '%d-%m-%Y'), STR_TO_DATE('27-10-2011', '%d-%m-%Y'), 'AC_ACCOUNT', 110),
    (101, STR_TO_DATE('28-10-2011', '%d-%m-%Y'), STR_TO_DATE('15-03-2015', '%d-%m-%Y'), 'AC_MGR', 110),
    (201, STR_TO_DATE('17-02-2014', '%d-%m-%Y'), STR_TO_DATE('19-12-2017', '%d-%m-%Y'), 'MK_REP', 20),
    (114, STR_TO_DATE('24-03-2016', '%d-%m-%Y'), STR_TO_DATE('31-12-2017', '%d-%m-%Y'), 'ST_CLERK', 50),
    (122, STR_TO_DATE('01-01-2017', '%d-%m-%Y'), STR_TO_DATE('31-12-2017', '%d-%m-%Y'), 'ST_CLERK', 50),
    (200, STR_TO_DATE('17-09-2005', '%d-%m-%Y'), STR_TO_DATE('17-06-2011', '%d-%m-%Y'), 'AD_ASST', 90),
    (176, STR_TO_DATE('24-03-2016', '%d-%m-%Y'), STR_TO_DATE('31-12-2016', '%d-%m-%Y'), 'SA_REP', 80),
    (176, STR_TO_DATE('01-01-2017', '%d-%m-%Y'), STR_TO_DATE('31-12-2017', '%d-%m-%Y'), 'SA_MAN', 80),
    (200, STR_TO_DATE('01-07-2012', '%d-%m-%Y'), STR_TO_DATE('31-12-2016', '%d-%m-%Y'), 'AC_ACCOUNT', 90),
    -- India career history: Rajesh Kumar started as junior dev, promoted to lead
    (207, STR_TO_DATE('10-03-2018', '%d-%m-%Y'), STR_TO_DATE('31-12-2020', '%d-%m-%Y'), 'IT_PROG', 280),
    -- India: Deepa Nair transferred from Dev to QA as lead
    (212, STR_TO_DATE('03-04-2019', '%d-%m-%Y'), STR_TO_DATE('31-03-2025', '%d-%m-%Y'), 'IT_PROG', 280),
    -- Mexico: Carlos Garcia started as SA_REP, promoted to SA_MAN
    (221, STR_TO_DATE('08-06-2016', '%d-%m-%Y'), STR_TO_DATE('31-12-2019', '%d-%m-%Y'), 'SA_REP', 310),
    -- Mexico: Maria Lopez started in Customer Support, moved to Sales
    (222, STR_TO_DATE('14-02-2018', '%d-%m-%Y'), STR_TO_DATE('30-06-2020', '%d-%m-%Y'), 'SH_CLERK', 320),
    -- USA: Sarah Mitchell transferred from Finance to Treasury as manager
    (232, STR_TO_DATE('10-06-2014', '%d-%m-%Y'), STR_TO_DATE('31-12-2017', '%d-%m-%Y'), 'FI_ACCOUNT', 100),
    -- USA: Thomas Clark promoted from ST_CLERK to ST_MAN in Manufacturing
    (245, STR_TO_DATE('09-09-2008', '%d-%m-%Y'), STR_TO_DATE('30-06-2012', '%d-%m-%Y'), 'ST_CLERK', 50),
    -- USA: Catherine Wright promoted from ST_CLERK to ST_MAN in Operations
    (258, STR_TO_DATE('18-06-2011', '%d-%m-%Y'), STR_TO_DATE('31-12-2015', '%d-%m-%Y'), 'ST_CLERK', 50),
    -- India: Arun Mehta started in IT Dev India, promoted to IT Support manager
    (273, STR_TO_DATE('12-07-2017', '%d-%m-%Y'), STR_TO_DATE('28-02-2020', '%d-%m-%Y'), 'IT_PROG', 280),
    -- Mexico: Roberto Castillo started in Sales Mexico, promoted to Gov Sales manager
    (288, STR_TO_DATE('26-04-2017', '%d-%m-%Y'), STR_TO_DATE('31-12-2020', '%d-%m-%Y'), 'SA_REP', 310),
    -- Mexico: Patricia Vega started in Customer Support, promoted to Retail Sales manager
    (292, STR_TO_DATE('18-08-2016', '%d-%m-%Y'), STR_TO_DATE('30-06-2019', '%d-%m-%Y'), 'SH_CLERK', 320),
    -- Terminated employees — capture their last known positions
    (301, STR_TO_DATE('12-04-2016', '%d-%m-%Y'), STR_TO_DATE('15-04-2025', '%d-%m-%Y'), 'IT_PROG', 60),
    (302, STR_TO_DATE('09-07-2018', '%d-%m-%Y'), STR_TO_DATE('30-06-2025', '%d-%m-%Y'), 'SA_REP', 80),
    (303, STR_TO_DATE('23-05-2015', '%d-%m-%Y'), STR_TO_DATE('22-08-2025', '%d-%m-%Y'), 'ST_CLERK', 50),
    (304, STR_TO_DATE('11-09-2017', '%d-%m-%Y'), STR_TO_DATE('15-09-2025', '%d-%m-%Y'), 'FI_ACCOUNT', 100),
    (306, STR_TO_DATE('14-02-2018', '%d-%m-%Y'), STR_TO_DATE('10-02-2026', '%d-%m-%Y'), 'HR_REP', 40),
    (310, STR_TO_DATE('07-04-2019', '%d-%m-%Y'), STR_TO_DATE('20-11-2025', '%d-%m-%Y'), 'SA_REP', 310);

COMMIT;

-- ========================
-- Set up department hierarchy (parent_department_id)
-- ========================

-- Assign managers to new India/Mexico departments
UPDATE departments SET manager_id = 207 WHERE department_id = 280;   -- Rajesh Kumar manages IT Dev India
UPDATE departments SET manager_id = 212 WHERE department_id = 290;   -- Deepa Nair manages IT QA India
UPDATE departments SET manager_id = 217 WHERE department_id = 300;   -- Rahul Verma manages IT Infra India
UPDATE departments SET manager_id = 221 WHERE department_id = 310;   -- Carlos Garcia manages Sales Mexico
UPDATE departments SET manager_id = 227 WHERE department_id = 320;   -- Fernando Morales manages Cust Support Mexico

-- Assign managers to previously empty USA departments
UPDATE departments SET manager_id = 232 WHERE department_id = 120;   -- Sarah Mitchell manages Treasury
UPDATE departments SET manager_id = 235 WHERE department_id = 130;   -- Robert Thompson manages Corporate Tax
UPDATE departments SET manager_id = 238 WHERE department_id = 140;   -- Michelle Davis manages Control And Audit
UPDATE departments SET manager_id = 242 WHERE department_id = 160;   -- Angela Harris manages Benefits
UPDATE departments SET manager_id = 245 WHERE department_id = 170;   -- Thomas Clark manages Manufacturing
UPDATE departments SET manager_id = 251 WHERE department_id = 180;   -- Mark Lewis manages Construction
UPDATE departments SET manager_id = 258 WHERE department_id = 200;   -- Catherine Wright manages Operations
UPDATE departments SET manager_id = 263 WHERE department_id = 230;   -- Greg Phillips manages IT Help Desk
UPDATE departments SET manager_id = 267 WHERE department_id = 260;   -- Megan Stewart manages Recruiting
UPDATE departments SET manager_id = 270 WHERE department_id = 270;   -- Christina Evans manages Payroll
UPDATE departments SET manager_id = 273 WHERE department_id = 210;   -- Arun Mehta manages IT Support Bangalore
UPDATE departments SET manager_id = 278 WHERE department_id = 220;   -- Manoj Tiwari manages NOC Mumbai
UPDATE departments SET manager_id = 288 WHERE department_id = 240;   -- Roberto Castillo manages Gov Sales Mexico
UPDATE departments SET manager_id = 292 WHERE department_id = 250;   -- Patricia Vega manages Retail Sales Mexico

-- Move departments to India/Mexico locations
UPDATE departments SET location_id = 3300 WHERE department_id = 210; -- IT Support → Bangalore
UPDATE departments SET location_id = 3400 WHERE department_id = 220; -- NOC → Mumbai
UPDATE departments SET location_id = 3600 WHERE department_id = 240; -- Government Sales → Mexico City
UPDATE departments SET location_id = 3700 WHERE department_id = 250; -- Retail Sales → Mexico City

UPDATE departments SET parent_department_id = 90 WHERE department_id IN (10, 20, 30, 40, 50, 60, 70, 80, 100, 110);  -- All report to Executive
UPDATE departments SET parent_department_id = 60 WHERE department_id IN (210, 220, 230);     -- IT Support, NOC, IT Help Desk under IT
UPDATE departments SET parent_department_id = 80 WHERE department_id IN (240, 250);           -- Gov Sales, Retail Sales under Sales
UPDATE departments SET parent_department_id = 100 WHERE department_id IN (120, 130, 140);     -- Treasury, Corp Tax, Control under Finance
UPDATE departments SET parent_department_id = 40 WHERE department_id IN (160, 260, 270);      -- Benefits, Recruiting, Payroll under HR
UPDATE departments SET parent_department_id = 50 WHERE department_id IN (170, 180, 190, 200); -- Manufacturing, Construction, Contracting, Operations under Shipping
UPDATE departments SET parent_department_id = 60 WHERE department_id IN (280, 290, 300);   -- India IT depts under IT
UPDATE departments SET parent_department_id = 80 WHERE department_id IN (310);              -- Sales Mexico under Sales
UPDATE departments SET parent_department_id = 80 WHERE department_id IN (320);              -- Customer Support Mexico under Sales

-- ========================
-- Set employee statuses and employment types for demo variety
-- ========================

-- Probation employees (recent hires)
UPDATE employees SET employment_status = 'PROBATION' WHERE employee_id IN (107, 181, 183, 187);

-- On leave
UPDATE employees SET employment_status = 'ON_LEAVE' WHERE employee_id IN (104, 178, 196);

-- Terminated (soft-deleted)
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('15-01-2026', '%d-%m-%Y') WHERE employee_id IN (198, 199);

-- Contract employees with end dates
UPDATE employees SET employment_type = 'CONTRACT', contract_end_date = STR_TO_DATE('30-06-2026', '%d-%m-%Y') WHERE employee_id IN (118, 119, 143, 144);

-- Part-time
UPDATE employees SET employment_type = 'PART_TIME' WHERE employee_id IN (182, 186, 192);

-- Interns
UPDATE employees SET employment_type = 'INTERN', employment_status = 'PROBATION', contract_end_date = STR_TO_DATE('31-08-2026', '%d-%m-%Y') WHERE employee_id IN (128, 136);

-- India — recent hires on probation
UPDATE employees SET employment_status = 'PROBATION' WHERE employee_id IN (220, 216);  -- Divya Krishnan (Oct 2025), Meera Joshi (Jan 2025)

-- Mexico — recent hire on probation, one contract employee
UPDATE employees SET employment_status = 'PROBATION' WHERE employee_id IN (231);       -- Andres Diaz (Feb 2025)
UPDATE employees SET employment_type = 'CONTRACT', contract_end_date = STR_TO_DATE('31-12-2026', '%d-%m-%Y') WHERE employee_id IN (226); -- Valentina Flores (Nov 2024 contract)

-- New India recent hires on probation
UPDATE employees SET employment_status = 'PROBATION' WHERE employee_id IN (277, 287, 319, 320, 321, 322);

-- New Mexico recent hires on probation
UPDATE employees SET employment_status = 'PROBATION' WHERE employee_id IN (296, 323, 324, 325);

-- New USA recent hires on probation
UPDATE employees SET employment_status = 'PROBATION' WHERE employee_id IN (266, 313, 314, 315, 316, 317, 318);

-- Mexico contract employees
UPDATE employees SET employment_type = 'CONTRACT', contract_end_date = STR_TO_DATE('30-09-2026', '%d-%m-%Y') WHERE employee_id IN (291, 323);

-- India contract employees
UPDATE employees SET employment_type = 'CONTRACT', contract_end_date = STR_TO_DATE('31-07-2026', '%d-%m-%Y') WHERE employee_id IN (281, 285);

-- ========================
-- Terminated employees — staggered across last 12 months for realistic attrition curve
-- ========================
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('15-04-2025', '%d-%m-%Y') WHERE employee_id = 301;  -- Kevin OBrien, USA IT
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('30-06-2025', '%d-%m-%Y') WHERE employee_id = 302;  -- Sarah Nguyen, USA Sales
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('22-08-2025', '%d-%m-%Y') WHERE employee_id = 303;  -- Michael Torres, USA Shipping
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('15-09-2025', '%d-%m-%Y') WHERE employee_id = 304;  -- Rebecca Foster, USA Finance
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('31-10-2025', '%d-%m-%Y') WHERE employee_id = 308;  -- James Patel, India IT Dev
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('20-11-2025', '%d-%m-%Y') WHERE employee_id = 310;  -- Amanda Rivera, Mexico Sales
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('15-12-2025', '%d-%m-%Y') WHERE employee_id = 305;  -- Robert Kim, USA Manufacturing
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('10-01-2026', '%d-%m-%Y') WHERE employee_id = 311;  -- Michelle Santos, Mexico Support
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('05-02-2026', '%d-%m-%Y') WHERE employee_id = 309;  -- David Basu, India IT Support
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('10-02-2026', '%d-%m-%Y') WHERE employee_id = 306;  -- Jennifer Liu, USA HR
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('01-03-2026', '%d-%m-%Y') WHERE employee_id = 307;  -- Chris Williams, USA Purchasing
UPDATE employees SET employment_status = 'TERMINATED', deleted_at = STR_TO_DATE('15-03-2026', '%d-%m-%Y') WHERE employee_id = 312;  -- Samantha Bravo, Mexico Retail Sales

-- *************************** insert data into the HR_ROLES table

INSERT INTO hr_roles (role_id, role_name, description) VALUES
    (1, 'ROLE_ADMIN', 'System Administrator with full access'),
    (2, 'ROLE_HR_SPECIALIST', 'HR Specialist with full lifecycle management'),
    (3, 'ROLE_MANAGER', 'Line Manager with team self-service'),
    (4, 'ROLE_EMPLOYEE', 'Employee with self-service access');

-- *************************** insert data into the HR_USERS table
-- Passwords are BCrypt hashes of 'password123' (strength 12) — demo only

INSERT INTO hr_users (user_id, employee_id, username, password_hash, is_active, last_login) VALUES
    ( 1, 100, 'steven.king',       '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 08:15', '%d-%m-%Y %H:%i')),
    ( 2, 101, 'neena.kochhar',     '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 09:02', '%d-%m-%Y %H:%i')),
    ( 3, 102, 'lex.dehaan',        '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 14:30', '%d-%m-%Y %H:%i')),
    ( 4, 103, 'alexander.hunold',  '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 07:45', '%d-%m-%Y %H:%i')),
    ( 5, 200, 'jennifer.whalen',   '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 16:10', '%d-%m-%Y %H:%i')),
    ( 6, 203, 'susan.mavris',      '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 08:55', '%d-%m-%Y %H:%i')),
    ( 7, 114, 'den.raphaely',      '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 10:20', '%d-%m-%Y %H:%i')),
    ( 8, 145, 'john.russell',      '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 11:00', '%d-%m-%Y %H:%i')),
    ( 9, 108, 'nancy.greenberg',   '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 15:45', '%d-%m-%Y %H:%i')),
    (10, 201, 'michael.hartstein', '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 09:30', '%d-%m-%Y %H:%i')),
    (11, 205, 'shelley.higgins',   '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 13:15', '%d-%m-%Y %H:%i')),
    (12, 204, 'hermann.baer',      '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('21-03-2026 10:00', '%d-%m-%Y %H:%i')),
    (13, 121, 'adam.johnson',      '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 06:30', '%d-%m-%Y %H:%i')),
    (14, 120, 'matthew.weiss',     '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 07:00', '%d-%m-%Y %H:%i')),
    (15, 104, 'bruce.ernst',       '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('20-03-2026 09:00', '%d-%m-%Y %H:%i')),
    (16, 107, 'diana.lorentz',     '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 08:00', '%d-%m-%Y %H:%i')),
    (17, 206, 'william.gietz',     '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 11:30', '%d-%m-%Y %H:%i')),
    (18, 202, 'pat.fay',           '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 10:45', '%d-%m-%Y %H:%i')),
    (19, 146, 'karen.partners',    '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 12:00', '%d-%m-%Y %H:%i')),
    (20, 174, 'ellen.abel',        '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('23-03-2026 14:20', '%d-%m-%Y %H:%i')),
    (21, 198, 'donna.snythia',     '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', FALSE, NULL),  -- terminated, account deactivated
    (22, 199, 'dorothy.wallin',    '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', FALSE, NULL),  -- terminated, account deactivated
    -- India team
    (23, 207, 'rajesh.kumar',      '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 10:30', '%d-%m-%Y %H:%i')),
    (24, 208, 'priya.sharma',      '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 10:45', '%d-%m-%Y %H:%i')),
    (25, 209, 'arjun.patel',       '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 11:00', '%d-%m-%Y %H:%i')),
    (26, 210, 'ananya.reddy',      '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 12:15', '%d-%m-%Y %H:%i')),
    (27, 211, 'vikram.singh',      '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 11:30', '%d-%m-%Y %H:%i')),
    (28, 212, 'deepa.nair',        '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 10:00', '%d-%m-%Y %H:%i')),
    (29, 213, 'suresh.iyer',       '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 10:20', '%d-%m-%Y %H:%i')),
    (30, 214, 'kavitha.menon',     '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 09:45', '%d-%m-%Y %H:%i')),
    (31, 215, 'amit.gupta',        '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 14:00', '%d-%m-%Y %H:%i')),
    (32, 216, 'meera.joshi',       '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 09:30', '%d-%m-%Y %H:%i')),
    (33, 217, 'rahul.verma',       '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 10:10', '%d-%m-%Y %H:%i')),
    (34, 218, 'sneha.chatterjee',  '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 11:00', '%d-%m-%Y %H:%i')),
    (35, 219, 'karthik.rajan',     '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 09:15', '%d-%m-%Y %H:%i')),
    (36, 220, 'divya.krishnan',    '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 10:50', '%d-%m-%Y %H:%i')),
    -- Mexico team
    (37, 221, 'carlos.garcia',     '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 09:00', '%d-%m-%Y %H:%i')),
    (38, 222, 'maria.lopez',       '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 09:30', '%d-%m-%Y %H:%i')),
    (39, 223, 'alejandro.martinez','$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 10:00', '%d-%m-%Y %H:%i')),
    (40, 224, 'sofia.rodriguez',   '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 11:15', '%d-%m-%Y %H:%i')),
    (41, 225, 'diego.hernandez',   '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 08:45', '%d-%m-%Y %H:%i')),
    (42, 226, 'valentina.flores',  '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 09:10', '%d-%m-%Y %H:%i')),
    (43, 227, 'fernando.morales',  '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 08:30', '%d-%m-%Y %H:%i')),
    (44, 228, 'lucia.sanchez',     '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 09:00', '%d-%m-%Y %H:%i')),
    (45, 229, 'miguel.ramirez',    '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('24-03-2026 10:30', '%d-%m-%Y %H:%i')),
    (46, 230, 'camila.torres',     '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 08:00', '%d-%m-%Y %H:%i')),
    (47, 231, 'andres.diaz',       '$2a$12$LJ3m4ys3uz0GFTkBs0MmDeYBGFr/PNWeHEuDKM3S1jVqKHBNUvUa6', TRUE,  STR_TO_DATE('25-03-2026 09:45', '%d-%m-%Y %H:%i'));

-- *************************** insert data into the HR_USER_ROLES table

INSERT INTO hr_user_roles (user_id, role_id) VALUES
    ( 1, 1),  -- Steven King: Admin
    ( 1, 3),  -- Steven King: also Manager (CEO)
    ( 2, 2),  -- Neena Kochhar: HR Specialist
    ( 2, 3),  -- Neena Kochhar: also Manager (VP)
    ( 3, 3),  -- Lex De Haan: Manager (VP)
    ( 3, 4),  -- Lex De Haan: also Employee
    ( 4, 3),  -- Alexander Hunold: Manager (IT)
    ( 4, 4),  -- Alexander Hunold: also Employee
    ( 5, 4),  -- Jennifer Whalen: Employee (Admin Asst)
    ( 6, 2),  -- Susan Mavris: HR Specialist
    ( 6, 4),  -- Susan Mavris: also Employee
    ( 7, 3),  -- Den Raphaely: Manager (Purchasing)
    ( 7, 4),  -- Den Raphaely: also Employee
    ( 8, 3),  -- John Russell: Manager (Sales)
    ( 9, 3),  -- Nancy Greenberg: Manager (Finance)
    ( 9, 4),  -- Nancy Greenberg: also Employee
    (10, 3),  -- Michael Hartstein: Manager (Marketing)
    (10, 4),  -- Michael Hartstein: also Employee
    (11, 3),  -- Shelley Higgins: Manager (Accounting)
    (11, 4),  -- Shelley Higgins: also Employee
    (12, 4),  -- Hermann Baer: Employee (PR)
    (13, 3),  -- Adam Johnson: Manager (Shipping)
    (14, 3),  -- Matthew Weiss: Manager (Shipping)
    (15, 4),  -- Bruce Ernst: Employee (IT)
    (16, 4),  -- Diana Lorentz: Employee (IT, Probation)
    (17, 4),  -- William Gietz: Employee (Accounting)
    (18, 4),  -- Pat Fay: Employee (Marketing)
    (19, 3),  -- Karen Partners: Manager (Sales)
    (20, 4),  -- Ellen Abel: Employee (Sales)
    (21, 4),  -- Donna Snythia: Employee (terminated)
    (22, 4),  -- Dorothy Wallin: Employee (terminated)
    -- India managers & employees
    (23, 3),  -- Rajesh Kumar: Manager (IT Dev India)
    (23, 4),  -- Rajesh Kumar: also Employee
    (24, 4),  -- Priya Sharma: Employee
    (25, 4),  -- Arjun Patel: Employee
    (26, 4),  -- Ananya Reddy: Employee
    (27, 4),  -- Vikram Singh: Employee
    (28, 3),  -- Deepa Nair: Manager (IT QA India)
    (28, 4),  -- Deepa Nair: also Employee
    (29, 4),  -- Suresh Iyer: Employee
    (30, 4),  -- Kavitha Menon: Employee
    (31, 4),  -- Amit Gupta: Employee
    (32, 4),  -- Meera Joshi: Employee (Probation)
    (33, 3),  -- Rahul Verma: Manager (IT Infra India)
    (33, 4),  -- Rahul Verma: also Employee
    (34, 4),  -- Sneha Chatterjee: Employee
    (35, 4),  -- Karthik Rajan: Employee
    (36, 4),  -- Divya Krishnan: Employee (Probation)
    -- Mexico managers & employees
    (37, 3),  -- Carlos Garcia: Manager (Sales Mexico)
    (37, 4),  -- Carlos Garcia: also Employee
    (38, 4),  -- Maria Lopez: Employee
    (39, 4),  -- Alejandro Martinez: Employee
    (40, 4),  -- Sofia Rodriguez: Employee
    (41, 4),  -- Diego Hernandez: Employee
    (42, 4),  -- Valentina Flores: Employee (Contract)
    (43, 3),  -- Fernando Morales: Manager (Cust Support Mexico)
    (43, 4),  -- Fernando Morales: also Employee
    (44, 4),  -- Lucia Sanchez: Employee
    (45, 4),  -- Miguel Ramirez: Employee
    (46, 4),  -- Camila Torres: Employee
    (47, 4);  -- Andres Diaz: Employee (Probation)

-- *************************** insert data into the HR_USER_PREFERENCES table

INSERT INTO hr_user_preferences (user_id, language_code, timezone, date_format, currency_code, number_format) VALUES
    ( 1, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    ( 2, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    ( 3, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    ( 4, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    ( 5, 'en', 'America/New_York',   'MM/DD/YYYY', 'USD', '1,000.00'),
    ( 6, 'fr', 'Europe/Paris',       'DD/MM/YYYY', 'EUR', '1.000,00'),
    ( 7, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    ( 8, 'en', 'Europe/London',      'DD/MM/YYYY', 'GBP', '1,000.00'),
    ( 9, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    (10, 'en', 'America/New_York',   'MM/DD/YYYY', 'USD', '1,000.00'),
    (11, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    (12, 'de', 'Europe/Berlin',      'DD.MM.YYYY', 'EUR', '1.000,00'),
    (13, 'en', 'America/Los_Angeles','MM/DD/YYYY', 'USD', '1,000.00'),
    (14, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    (15, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    (16, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    (17, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    (18, 'en', 'America/New_York',   'MM/DD/YYYY', 'USD', '1,000.00'),
    (19, 'nl', 'Europe/Amsterdam',   'DD-MM-YYYY', 'EUR', '1.000,00'),
    (20, 'en', 'Europe/London',      'DD/MM/YYYY', 'GBP', '1,000.00'),
    (21, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    (22, 'en', 'America/Chicago',    'MM/DD/YYYY', 'USD', '1,000.00'),
    -- India team — IST timezone, INR currency, Indian English or Hindi
    (23, 'en', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (24, 'en', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (25, 'en', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (26, 'hi', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (27, 'hi', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (28, 'en', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (29, 'en', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (30, 'en', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (31, 'hi', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (32, 'en', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (33, 'en', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (34, 'en', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (35, 'en', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    (36, 'en', 'Asia/Kolkata',       'DD/MM/YYYY', 'INR', '1,00,000.00'),
    -- Mexico team — CST timezone, MXN currency, Spanish
    (37, 'es', 'America/Mexico_City','DD/MM/YYYY', 'MXN', '1,000.00'),
    (38, 'es', 'America/Mexico_City','DD/MM/YYYY', 'MXN', '1,000.00'),
    (39, 'es', 'America/Mexico_City','DD/MM/YYYY', 'MXN', '1,000.00'),
    (40, 'es', 'America/Mexico_City','DD/MM/YYYY', 'MXN', '1,000.00'),
    (41, 'es', 'America/Mexico_City','DD/MM/YYYY', 'MXN', '1,000.00'),
    (42, 'es', 'America/Mexico_City','DD/MM/YYYY', 'MXN', '1,000.00'),
    (43, 'es', 'America/Mexico_City','DD/MM/YYYY', 'MXN', '1,000.00'),
    (44, 'es', 'America/Mexico_City','DD/MM/YYYY', 'MXN', '1,000.00'),
    (45, 'en', 'America/Mexico_City','MM/DD/YYYY', 'MXN', '1,000.00'),
    (46, 'es', 'America/Mexico_City','DD/MM/YYYY', 'MXN', '1,000.00'),
    (47, 'es', 'America/Mexico_City','DD/MM/YYYY', 'MXN', '1,000.00');

-- *************************** insert data into the HR_EMPLOYEE_DOCUMENTS table

INSERT INTO hr_employee_documents (document_id, employee_id, document_name, document_category, file_path, file_type, file_size_bytes, uploaded_by, uploaded_at) VALUES
    -- Steven King — President
    ( 1, 100, 'Steven_King_Employment_Contract.pdf',       'Contract',    '/uploads/employees/100/contract_2013.pdf',        'application/pdf', 245760,  2, STR_TO_DATE('17-06-2013', '%d-%m-%Y')),
    ( 2, 100, 'Steven_King_Passport.pdf',                  'ID',          '/uploads/employees/100/passport.pdf',             'application/pdf', 1048576, 2, STR_TO_DATE('17-06-2013', '%d-%m-%Y')),
    ( 3, 100, 'Steven_King_NDA.pdf',                       'Contract',    '/uploads/employees/100/nda_2013.pdf',             'application/pdf', 102400,  2, STR_TO_DATE('17-06-2013', '%d-%m-%Y')),
    -- Neena Kochhar — VP
    ( 4, 101, 'Neena_Kochhar_Employment_Contract.pdf',     'Contract',    '/uploads/employees/101/contract_2015.pdf',        'application/pdf', 230400,  6, STR_TO_DATE('21-09-2015', '%d-%m-%Y')),
    ( 5, 101, 'Neena_Kochhar_DriversLicense.jpg',          'ID',          '/uploads/employees/101/drivers_license.jpg',      'image/jpeg',      512000,  6, STR_TO_DATE('21-09-2015', '%d-%m-%Y')),
    -- Lex De Haan — VP
    ( 6, 102, 'Lex_DeHaan_Employment_Contract.pdf',        'Contract',    '/uploads/employees/102/contract_2011.pdf',        'application/pdf', 218000,  6, STR_TO_DATE('13-01-2011', '%d-%m-%Y')),
    -- Alexander Hunold — IT Manager
    ( 7, 103, 'Alexander_Hunold_Contract.pdf',             'Contract',    '/uploads/employees/103/contract_2016.pdf',        'application/pdf', 225280,  2, STR_TO_DATE('03-01-2016', '%d-%m-%Y')),
    ( 8, 103, 'Alexander_Hunold_AWS_Certification.pdf',    'Certificate', '/uploads/employees/103/aws_cert.pdf',             'application/pdf', 184320,  4, STR_TO_DATE('15-06-2020', '%d-%m-%Y')),
    ( 9, 103, 'Alexander_Hunold_Java_Certification.pdf',   'Certificate', '/uploads/employees/103/java_cert.pdf',            'application/pdf', 163840,  4, STR_TO_DATE('22-11-2018', '%d-%m-%Y')),
    -- Bruce Ernst — IT Programmer (On Leave)
    (10, 104, 'Bruce_Ernst_Contract.pdf',                  'Contract',    '/uploads/employees/104/contract_2017.pdf',        'application/pdf', 220160,  2, STR_TO_DATE('21-05-2017', '%d-%m-%Y')),
    (11, 104, 'Bruce_Ernst_MedicalLeave.pdf',              'Other',       '/uploads/employees/104/medical_leave_2026.pdf',   'application/pdf', 89600,   6, STR_TO_DATE('01-03-2026', '%d-%m-%Y')),
    -- Diana Lorentz — IT Programmer (Probation)
    (12, 107, 'Diana_Lorentz_Contract.pdf',                'Contract',    '/uploads/employees/107/contract_2017.pdf',        'application/pdf', 215040,  2, STR_TO_DATE('07-02-2017', '%d-%m-%Y')),
    (13, 107, 'Diana_Lorentz_Degree_Certificate.png',      'Certificate', '/uploads/employees/107/degree_cert.png',          'image/png',       2097152, 16,STR_TO_DATE('07-02-2017', '%d-%m-%Y')),
    -- Nancy Greenberg — Finance Manager
    (14, 108, 'Nancy_Greenberg_Contract.pdf',              'Contract',    '/uploads/employees/108/contract_2012.pdf',        'application/pdf', 230400,  6, STR_TO_DATE('17-08-2012', '%d-%m-%Y')),
    (15, 108, 'Nancy_Greenberg_CPA_License.pdf',           'Certificate', '/uploads/employees/108/cpa_license.pdf',          'application/pdf', 153600,  9, STR_TO_DATE('10-01-2015', '%d-%m-%Y')),
    -- Den Raphaely — Purchasing Manager
    (16, 114, 'Den_Raphaely_Contract.pdf',                 'Contract',    '/uploads/employees/114/contract_2012.pdf',        'application/pdf', 225280,  6, STR_TO_DATE('07-12-2012', '%d-%m-%Y')),
    -- Guy Himuro — Purchasing Clerk (Contract employee)
    (17, 118, 'Guy_Himuro_FixedTerm_Contract.pdf',         'Contract',    '/uploads/employees/118/contract_fixed_2024.pdf',  'application/pdf', 204800,  7, STR_TO_DATE('15-11-2024', '%d-%m-%Y')),
    -- John Russell — Sales Manager (London)
    (18, 145, 'John_Russell_Contract.pdf',                 'Contract',    '/uploads/employees/145/contract_2004.pdf',        'application/pdf', 245760,  2, STR_TO_DATE('01-10-2004', '%d-%m-%Y')),
    (19, 145, 'John_Russell_UK_WorkPermit.pdf',            'ID',          '/uploads/employees/145/uk_work_permit.pdf',       'application/pdf', 1536000, 6, STR_TO_DATE('01-10-2004', '%d-%m-%Y')),
    -- Jennifer Whalen — Admin Assistant
    (20, 200, 'Jennifer_Whalen_Contract.pdf',              'Contract',    '/uploads/employees/200/contract_2005.pdf',        'application/pdf', 210944,  6, STR_TO_DATE('17-09-2005', '%d-%m-%Y')),
    -- Michael Hartstein — Marketing Manager
    (21, 201, 'Michael_Hartstein_Contract.pdf',            'Contract',    '/uploads/employees/201/contract_2004.pdf',        'application/pdf', 235520,  6, STR_TO_DATE('17-02-2004', '%d-%m-%Y')),
    -- Susan Mavris — HR Representative
    (22, 203, 'Susan_Mavris_Contract.pdf',                 'Contract',    '/uploads/employees/203/contract_2002.pdf',        'application/pdf', 220160,  2, STR_TO_DATE('07-06-2002', '%d-%m-%Y')),
    (23, 203, 'Susan_Mavris_SHRM_Certification.pdf',       'Certificate', '/uploads/employees/203/shrm_cert.pdf',            'application/pdf', 174080,  6, STR_TO_DATE('14-03-2019', '%d-%m-%Y')),
    -- Shelley Higgins — Accounting Manager
    (24, 205, 'Shelley_Higgins_Contract.pdf',              'Contract',    '/uploads/employees/205/contract_2002.pdf',        'application/pdf', 230400,  6, STR_TO_DATE('07-06-2002', '%d-%m-%Y')),
    -- Payslip samples (January–March 2026)
    (25, 100, 'Steven_King_Payslip_Jan2026.pdf',           'Payslip',     '/uploads/employees/100/payslip_2026_01.pdf',      'application/pdf', 51200,   2, STR_TO_DATE('31-01-2026', '%d-%m-%Y')),
    (26, 100, 'Steven_King_Payslip_Feb2026.pdf',           'Payslip',     '/uploads/employees/100/payslip_2026_02.pdf',      'application/pdf', 51200,   2, STR_TO_DATE('28-02-2026', '%d-%m-%Y')),
    (27, 100, 'Steven_King_Payslip_Mar2026.pdf',           'Payslip',     '/uploads/employees/100/payslip_2026_03.pdf',      'application/pdf', 51200,   2, STR_TO_DATE('25-03-2026', '%d-%m-%Y')),
    (28, 101, 'Neena_Kochhar_Payslip_Mar2026.pdf',         'Payslip',     '/uploads/employees/101/payslip_2026_03.pdf',      'application/pdf', 51200,   2, STR_TO_DATE('25-03-2026', '%d-%m-%Y')),
    (29, 200, 'Jennifer_Whalen_Payslip_Mar2026.pdf',       'Payslip',     '/uploads/employees/200/payslip_2026_03.pdf',      'application/pdf', 51200,   2, STR_TO_DATE('25-03-2026', '%d-%m-%Y')),
    -- Terminated employee documents kept for compliance
    (30, 198, 'Donna_Snythia_Contract.pdf',                'Contract',    '/uploads/employees/198/contract_2010.pdf',        'application/pdf', 210944,  6, STR_TO_DATE('30-03-2010', '%d-%m-%Y')),
    (31, 198, 'Donna_Snythia_TerminationLetter.pdf',       'Other',       '/uploads/employees/198/termination_2026.pdf',     'application/pdf', 76800,   2, STR_TO_DATE('15-01-2026', '%d-%m-%Y')),
    -- India employees — contracts, IDs, certifications
    (32, 207, 'Rajesh_Kumar_Contract.pdf',                 'Contract',    '/uploads/employees/207/contract_2018.pdf',        'application/pdf', 225280, 2, STR_TO_DATE('10-03-2018', '%d-%m-%Y')),
    (33, 207, 'Rajesh_Kumar_Aadhaar.pdf',                  'ID',          '/uploads/employees/207/aadhaar.pdf',              'application/pdf', 512000, 6, STR_TO_DATE('10-03-2018', '%d-%m-%Y')),
    (34, 207, 'Rajesh_Kumar_PAN_Card.pdf',                 'ID',          '/uploads/employees/207/pan_card.pdf',             'application/pdf', 358400, 6, STR_TO_DATE('10-03-2018', '%d-%m-%Y')),
    (35, 207, 'Rajesh_Kumar_Azure_Certification.pdf',      'Certificate', '/uploads/employees/207/azure_cert.pdf',           'application/pdf', 174080, 23,STR_TO_DATE('20-09-2022', '%d-%m-%Y')),
    (36, 208, 'Priya_Sharma_Contract.pdf',                 'Contract',    '/uploads/employees/208/contract_2019.pdf',        'application/pdf', 220160, 6, STR_TO_DATE('15-06-2019', '%d-%m-%Y')),
    (37, 208, 'Priya_Sharma_Aadhaar.pdf',                  'ID',          '/uploads/employees/208/aadhaar.pdf',              'application/pdf', 491520, 6, STR_TO_DATE('15-06-2019', '%d-%m-%Y')),
    (38, 212, 'Deepa_Nair_Contract.pdf',                   'Contract',    '/uploads/employees/212/contract_2019.pdf',        'application/pdf', 230400, 6, STR_TO_DATE('03-04-2019', '%d-%m-%Y')),
    (39, 212, 'Deepa_Nair_ISTQB_Certification.pdf',        'Certificate', '/uploads/employees/212/istqb_cert.pdf',           'application/pdf', 163840, 28,STR_TO_DATE('12-08-2020', '%d-%m-%Y')),
    (40, 217, 'Rahul_Verma_Contract.pdf',                  'Contract',    '/uploads/employees/217/contract_2017.pdf',        'application/pdf', 235520, 6, STR_TO_DATE('20-05-2017', '%d-%m-%Y')),
    (41, 217, 'Rahul_Verma_CCNA_Certification.pdf',        'Certificate', '/uploads/employees/217/ccna_cert.pdf',            'application/pdf', 153600, 33,STR_TO_DATE('05-03-2019', '%d-%m-%Y')),
    (42, 220, 'Divya_Krishnan_Contract.pdf',               'Contract',    '/uploads/employees/220/contract_2025.pdf',        'application/pdf', 210944, 6, STR_TO_DATE('15-10-2025', '%d-%m-%Y')),
    (43, 220, 'Divya_Krishnan_Degree_Certificate.pdf',     'Certificate', '/uploads/employees/220/degree_cert.pdf',          'application/pdf', 1048576,36,STR_TO_DATE('15-10-2025', '%d-%m-%Y')),
    -- India payslips (March 2026)
    (44, 207, 'Rajesh_Kumar_Payslip_Mar2026.pdf',          'Payslip',     '/uploads/employees/207/payslip_2026_03.pdf',      'application/pdf', 51200,  2, STR_TO_DATE('25-03-2026', '%d-%m-%Y')),
    (45, 212, 'Deepa_Nair_Payslip_Mar2026.pdf',            'Payslip',     '/uploads/employees/212/payslip_2026_03.pdf',      'application/pdf', 51200,  2, STR_TO_DATE('25-03-2026', '%d-%m-%Y')),
    (46, 217, 'Rahul_Verma_Payslip_Mar2026.pdf',           'Payslip',     '/uploads/employees/217/payslip_2026_03.pdf',      'application/pdf', 51200,  2, STR_TO_DATE('25-03-2026', '%d-%m-%Y')),
    -- Mexico employees — contracts, IDs
    (47, 221, 'Carlos_Garcia_Contract.pdf',                'Contract',    '/uploads/employees/221/contract_2016.pdf',        'application/pdf', 245760, 2, STR_TO_DATE('08-06-2016', '%d-%m-%Y')),
    (48, 221, 'Carlos_Garcia_INE.pdf',                     'ID',          '/uploads/employees/221/ine_id.pdf',               'application/pdf', 614400, 6, STR_TO_DATE('08-06-2016', '%d-%m-%Y')),
    (49, 221, 'Carlos_Garcia_CURP.pdf',                    'ID',          '/uploads/employees/221/curp.pdf',                 'application/pdf', 204800, 6, STR_TO_DATE('08-06-2016', '%d-%m-%Y')),
    (50, 222, 'Maria_Lopez_Contract.pdf',                  'Contract',    '/uploads/employees/222/contract_2018.pdf',        'application/pdf', 230400, 6, STR_TO_DATE('14-02-2018', '%d-%m-%Y')),
    (51, 222, 'Maria_Lopez_INE.pdf',                       'ID',          '/uploads/employees/222/ine_id.pdf',               'application/pdf', 583680, 6, STR_TO_DATE('14-02-2018', '%d-%m-%Y')),
    (52, 226, 'Valentina_Flores_FixedTerm_Contract.pdf',   'Contract',    '/uploads/employees/226/contract_fixed_2024.pdf',  'application/pdf', 204800, 37,STR_TO_DATE('10-11-2024', '%d-%m-%Y')),
    (53, 227, 'Fernando_Morales_Contract.pdf',             'Contract',    '/uploads/employees/227/contract_2017.pdf',        'application/pdf', 225280, 6, STR_TO_DATE('17-04-2017', '%d-%m-%Y')),
    (54, 231, 'Andres_Diaz_Contract.pdf',                  'Contract',    '/uploads/employees/231/contract_2025.pdf',        'application/pdf', 210944, 6, STR_TO_DATE('20-02-2025', '%d-%m-%Y')),
    -- Mexico payslips (March 2026)
    (55, 221, 'Carlos_Garcia_Payslip_Mar2026.pdf',         'Payslip',     '/uploads/employees/221/payslip_2026_03.pdf',      'application/pdf', 51200,  2, STR_TO_DATE('25-03-2026', '%d-%m-%Y')),
    (56, 222, 'Maria_Lopez_Payslip_Mar2026.pdf',           'Payslip',     '/uploads/employees/222/payslip_2026_03.pdf',      'application/pdf', 51200,  2, STR_TO_DATE('25-03-2026', '%d-%m-%Y'));

-- *************************** insert data into the HR_AUDIT_LOGS table

INSERT INTO hr_audit_logs (table_name, record_id, action, old_value, new_value, changed_by, changed_at) VALUES
    -- Historical promotions/transfers matching job_history
    ('employees', '101', 'UPDATE',
     '{"job_id":"AC_ACCOUNT","department_id":110}',
     '{"job_id":"AC_MGR","department_id":110}',
     1, STR_TO_DATE('28-10-2011', '%d-%m-%Y')),
    ('employees', '101', 'UPDATE',
     '{"job_id":"AC_MGR","department_id":110}',
     '{"job_id":"AD_VP","department_id":90}',
     1, STR_TO_DATE('16-03-2015', '%d-%m-%Y')),
    ('employees', '114', 'UPDATE',
     '{"job_id":"ST_CLERK","department_id":50}',
     '{"job_id":"PU_MAN","department_id":30}',
     2, STR_TO_DATE('24-03-2016', '%d-%m-%Y')),
    ('employees', '200', 'UPDATE',
     '{"department_id":90,"job_id":"AD_ASST"}',
     '{"department_id":10,"job_id":"AD_ASST"}',
     2, STR_TO_DATE('18-06-2011', '%d-%m-%Y')),
    ('employees', '176', 'UPDATE',
     '{"job_id":"SA_REP"}',
     '{"job_id":"SA_MAN"}',
     2, STR_TO_DATE('01-01-2017', '%d-%m-%Y')),
    -- Recent salary adjustments (2025–2026)
    ('employees', '103', 'UPDATE',
     '{"salary":8500.00}',
     '{"salary":9000.00,"reason":"Annual Increase"}',
     2, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    ('employees', '104', 'UPDATE',
     '{"salary":5500.00}',
     '{"salary":6000.00,"reason":"Market Adjustment"}',
     2, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    ('employees', '108', 'UPDATE',
     '{"salary":11500.00}',
     '{"salary":12000.00,"reason":"Annual Increase"}',
     1, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    ('employees', '145', 'UPDATE',
     '{"salary":13000.00}',
     '{"salary":14000.00,"reason":"Performance Bonus Adjustment"}',
     2, STR_TO_DATE('15-02-2026', '%d-%m-%Y')),
    ('employees', '174', 'UPDATE',
     '{"salary":10500.00}',
     '{"salary":11000.00,"reason":"Market Adjustment"}',
     19, STR_TO_DATE('01-03-2026', '%d-%m-%Y')),
    -- Hire events
    ('employees', '107', 'INSERT',
     NULL,
     '{"first_name":"Diana","last_name":"Lorentz","job_id":"IT_PROG","salary":4200.00,"department_id":60}',
     2, STR_TO_DATE('07-02-2017', '%d-%m-%Y')),
    ('employees', '128', 'INSERT',
     NULL,
     '{"first_name":"Steven","last_name":"Markle","job_id":"ST_CLERK","salary":2200.00,"department_id":50,"employment_type":"INTERN"}',
     6, STR_TO_DATE('08-03-2008', '%d-%m-%Y')),
    -- Terminations
    ('employees', '198', 'UPDATE',
     '{"employment_status":"ACTIVE"}',
     '{"employment_status":"TERMINATED","deleted_at":"2026-01-15"}',
     1, STR_TO_DATE('15-01-2026', '%d-%m-%Y')),
    ('employees', '199', 'UPDATE',
     '{"employment_status":"ACTIVE"}',
     '{"employment_status":"TERMINATED","deleted_at":"2026-01-15"}',
     1, STR_TO_DATE('15-01-2026', '%d-%m-%Y')),
    -- Status changes
    ('employees', '104', 'UPDATE',
     '{"employment_status":"ACTIVE"}',
     '{"employment_status":"ON_LEAVE","reason":"Medical Leave"}',
     6, STR_TO_DATE('01-03-2026', '%d-%m-%Y')),
    -- Department structure change
    ('departments', '210', 'UPDATE',
     '{"parent_department_id":null}',
     '{"parent_department_id":60}',
     1, STR_TO_DATE('10-01-2026', '%d-%m-%Y')),
    ('departments', '220', 'UPDATE',
     '{"parent_department_id":null}',
     '{"parent_department_id":60}',
     1, STR_TO_DATE('10-01-2026', '%d-%m-%Y')),
    -- Document uploads logged
    ('hr_employee_documents', '8', 'INSERT',
     NULL,
     '{"document_name":"Alexander_Hunold_AWS_Certification.pdf","document_category":"Certificate","employee_id":103}',
     4, STR_TO_DATE('15-06-2020', '%d-%m-%Y')),
    -- India audit entries
    ('employees', '207', 'INSERT',
     NULL,
     '{"first_name":"Rajesh","last_name":"Kumar","job_id":"IT_PROG","salary":7000.00,"department_id":280}',
     2, STR_TO_DATE('10-03-2018', '%d-%m-%Y')),
    ('employees', '207', 'UPDATE',
     '{"salary":7000.00}',
     '{"salary":8000.00,"reason":"Annual Increase"}',
     2, STR_TO_DATE('01-01-2025', '%d-%m-%Y')),
    ('employees', '207', 'UPDATE',
     '{"salary":8000.00}',
     '{"salary":8500.00,"reason":"Annual Increase"}',
     2, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    ('employees', '212', 'UPDATE',
     '{"salary":7200.00}',
     '{"salary":7800.00,"reason":"Promotion to QA Lead"}',
     2, STR_TO_DATE('01-04-2025', '%d-%m-%Y')),
    ('employees', '220', 'INSERT',
     NULL,
     '{"first_name":"Divya","last_name":"Krishnan","job_id":"IT_PROG","salary":4200.00,"department_id":300,"employment_status":"PROBATION"}',
     6, STR_TO_DATE('15-10-2025', '%d-%m-%Y')),
    ('departments', '280', 'INSERT',
     NULL,
     '{"department_name":"IT Development - India","location_id":3300,"parent_department_id":60}',
     1, STR_TO_DATE('01-03-2018', '%d-%m-%Y')),
    ('departments', '290', 'INSERT',
     NULL,
     '{"department_name":"IT QA - India","location_id":3400,"parent_department_id":60}',
     1, STR_TO_DATE('01-03-2019', '%d-%m-%Y')),
    -- Mexico audit entries
    ('employees', '221', 'INSERT',
     NULL,
     '{"first_name":"Carlos","last_name":"Garcia","job_id":"SA_MAN","salary":10000.00,"department_id":310}',
     2, STR_TO_DATE('08-06-2016', '%d-%m-%Y')),
    ('employees', '221', 'UPDATE',
     '{"salary":10000.00}',
     '{"salary":11000.00,"reason":"Market Adjustment"}',
     2, STR_TO_DATE('01-01-2024', '%d-%m-%Y')),
    ('employees', '221', 'UPDATE',
     '{"salary":11000.00}',
     '{"salary":12000.00,"reason":"Annual Increase"}',
     2, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    ('employees', '226', 'INSERT',
     NULL,
     '{"first_name":"Valentina","last_name":"Flores","job_id":"SA_REP","salary":6200.00,"department_id":310,"employment_type":"CONTRACT","contract_end_date":"2026-12-31"}',
     6, STR_TO_DATE('10-11-2024', '%d-%m-%Y')),
    ('employees', '231', 'INSERT',
     NULL,
     '{"first_name":"Andres","last_name":"Diaz","job_id":"SH_CLERK","salary":2800.00,"department_id":320,"employment_status":"PROBATION"}',
     6, STR_TO_DATE('20-02-2025', '%d-%m-%Y')),
    ('departments', '310', 'INSERT',
     NULL,
     '{"department_name":"Sales - Mexico","location_id":3600,"parent_department_id":80}',
     1, STR_TO_DATE('01-06-2016', '%d-%m-%Y')),
    ('departments', '320', 'INSERT',
     NULL,
     '{"department_name":"Customer Support - Mexico","location_id":3700,"parent_department_id":80}',
     1, STR_TO_DATE('01-04-2017', '%d-%m-%Y')),
    -- Termination audit trail (all 14 terminated employees)
    ('employees', '301', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Voluntary Resignation"}', 2, STR_TO_DATE('15-04-2025', '%d-%m-%Y')),
    ('employees', '302', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Performance"}', 2, STR_TO_DATE('30-06-2025', '%d-%m-%Y')),
    ('employees', '303', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Voluntary Resignation"}', 6, STR_TO_DATE('22-08-2025', '%d-%m-%Y')),
    ('employees', '304', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Role Elimination"}', 2, STR_TO_DATE('15-09-2025', '%d-%m-%Y')),
    ('employees', '308', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Voluntary Resignation"}', 6, STR_TO_DATE('31-10-2025', '%d-%m-%Y')),
    ('employees', '310', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Contract End"}', 6, STR_TO_DATE('20-11-2025', '%d-%m-%Y')),
    ('employees', '305', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Voluntary Resignation"}', 2, STR_TO_DATE('15-12-2025', '%d-%m-%Y')),
    ('employees', '311', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Relocation"}', 6, STR_TO_DATE('10-01-2026', '%d-%m-%Y')),
    ('employees', '309', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Better Opportunity"}', 6, STR_TO_DATE('05-02-2026', '%d-%m-%Y')),
    ('employees', '306', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Voluntary Resignation"}', 2, STR_TO_DATE('10-02-2026', '%d-%m-%Y')),
    ('employees', '307', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Performance"}', 2, STR_TO_DATE('01-03-2026', '%d-%m-%Y')),
    ('employees', '312', 'UPDATE', '{"employment_status":"ACTIVE"}', '{"employment_status":"TERMINATED","reason":"Contract End"}', 6, STR_TO_DATE('15-03-2026', '%d-%m-%Y')),
    -- Recent salary adjustments across all three countries (Q1 2026 comp cycle)
    ('employees', '232', 'UPDATE', '{"salary":10000.00}', '{"salary":10500.00,"reason":"Annual Increase"}', 2, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    ('employees', '245', 'UPDATE', '{"salary":7500.00}', '{"salary":7800.00,"reason":"Annual Increase"}', 1, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    ('employees', '263', 'UPDATE', '{"salary":6800.00}', '{"salary":7200.00,"reason":"Market Adjustment"}', 2, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    ('employees', '273', 'UPDATE', '{"salary":7800.00}', '{"salary":8200.00,"reason":"Promotion"}', 2, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    ('employees', '278', 'UPDATE', '{"salary":7200.00}', '{"salary":7800.00,"reason":"Annual Increase"}', 2, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    ('employees', '288', 'UPDATE', '{"salary":11000.00}', '{"salary":11500.00,"reason":"Annual Increase"}', 2, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    ('employees', '292', 'UPDATE', '{"salary":10500.00}', '{"salary":11000.00,"reason":"Market Adjustment"}', 2, STR_TO_DATE('01-01-2026', '%d-%m-%Y')),
    -- New hire INSERT audit entries
    ('employees', '313', 'INSERT', NULL, '{"first_name":"Olivia","last_name":"Bennett","job_id":"IT_PROG","salary":5000.00,"department_id":60}', 2, STR_TO_DATE('15-10-2025', '%d-%m-%Y')),
    ('employees', '319', 'INSERT', NULL, '{"first_name":"Aditi","last_name":"Saxena","job_id":"IT_PROG","salary":4200.00,"department_id":280}', 6, STR_TO_DATE('25-10-2025', '%d-%m-%Y')),
    ('employees', '323', 'INSERT', NULL, '{"first_name":"Daniel","last_name":"Espinoza","job_id":"SA_REP","salary":6000.00,"department_id":240}', 6, STR_TO_DATE('12-11-2025', '%d-%m-%Y')),
    ('employees', '316', 'INSERT', NULL, '{"first_name":"Liam","last_name":"Brooks","job_id":"PU_CLERK","salary":2800.00,"department_id":30}', 2, STR_TO_DATE('06-01-2026', '%d-%m-%Y')),
    ('employees', '322', 'INSERT', NULL, '{"first_name":"Varun","last_name":"Bhatt","job_id":"IT_PROG","salary":4000.00,"department_id":290}', 6, STR_TO_DATE('03-03-2026', '%d-%m-%Y')),
    ('employees', '325', 'INSERT', NULL, '{"first_name":"Ricardo","last_name":"Soto","job_id":"SA_REP","salary":6000.00,"department_id":250}', 6, STR_TO_DATE('20-02-2026', '%d-%m-%Y'));

-- *************************** insert data into the HR_NOTIFICATIONS table

INSERT INTO hr_notifications (recipient_user_id, notification_type, title, message, reference_table, reference_id, is_read, created_at) VALUES
    -- Probation alerts (due in next 15 days)
    ( 4, 'PROBATION_ALERT', 'Probation ending: Diana Lorentz',
     'Employee Diana Lorentz (ID: 107) in IT department has a probation period ending on 2026-04-07. Please schedule a review.',
     'employees', '107', FALSE, STR_TO_DATE('23-03-2026 08:00', '%d-%m-%Y %H:%i')),
    ( 2, 'PROBATION_ALERT', 'Probation ending: Diana Lorentz',
     'Employee Diana Lorentz (ID: 107) in IT department has a probation period ending on 2026-04-07. HR review required.',
     'employees', '107', FALSE, STR_TO_DATE('23-03-2026 08:00', '%d-%m-%Y %H:%i')),
    (13, 'PROBATION_ALERT', 'Probation ending: Steven Markle',
     'Intern Steven Markle (ID: 128) in Shipping department — probation review due by 2026-04-08.',
     'employees', '128', FALSE, STR_TO_DATE('24-03-2026 08:00', '%d-%m-%Y %H:%i')),
    (14, 'PROBATION_ALERT', 'Probation ending: Hazel Burton',
     'Intern Hazel Burton (ID: 136) in Shipping department — probation review due by 2026-04-10.',
     'employees', '136', FALSE, STR_TO_DATE('25-03-2026 08:00', '%d-%m-%Y %H:%i')),
    -- Contract expiry alerts (due in next 30 days)
    ( 7, 'CONTRACT_EXPIRY', 'Contract expiring: Guy Himuro',
     'Fixed-term contract for Guy Himuro (ID: 118) in Purchasing expires on 2026-06-30. Please initiate renewal or offboarding.',
     'employees', '118', FALSE, STR_TO_DATE('25-03-2026 08:00', '%d-%m-%Y %H:%i')),
    ( 2, 'CONTRACT_EXPIRY', 'Contract expiring: Guy Himuro',
     'Fixed-term contract for Guy Himuro (ID: 118) in Purchasing expires on 2026-06-30. HR action needed.',
     'employees', '118', FALSE, STR_TO_DATE('25-03-2026 08:00', '%d-%m-%Y %H:%i')),
    ( 7, 'CONTRACT_EXPIRY', 'Contract expiring: Karen Colmenares',
     'Fixed-term contract for Karen Colmenares (ID: 119) in Purchasing expires on 2026-06-30. Please initiate renewal or offboarding.',
     'employees', '119', FALSE, STR_TO_DATE('25-03-2026 08:00', '%d-%m-%Y %H:%i')),
    ( 2, 'CONTRACT_EXPIRY', 'Contract expiring: Karen Colmenares',
     'Fixed-term contract for Karen Colmenares (ID: 119) in Purchasing expires on 2026-06-30. HR action needed.',
     'employees', '119', TRUE, STR_TO_DATE('24-03-2026 08:00', '%d-%m-%Y %H:%i')),
    -- Completed action notifications
    ( 5, 'ACTION_COMPLETE', 'Transfer processed',
     'Your transfer from Executive (Dept 90) to Administration (Dept 10) has been processed effective 2011-06-18.',
     'employees', '200', TRUE, STR_TO_DATE('18-06-2011', '%d-%m-%Y')),
    (15, 'ACTION_COMPLETE', 'Medical leave approved',
     'Your medical leave request has been approved. Status changed to ON_LEAVE effective 2026-03-01.',
     'employees', '104', TRUE, STR_TO_DATE('01-03-2026 09:15', '%d-%m-%Y %H:%i')),
    (20, 'ACTION_COMPLETE', 'Salary adjustment processed',
     'Your salary has been adjusted from $10,500 to $11,000 (Market Adjustment) effective 2026-03-01.',
     'employees', '174', TRUE, STR_TO_DATE('01-03-2026 10:00', '%d-%m-%Y %H:%i')),
    ( 4, 'ACTION_COMPLETE', 'Salary adjustment processed',
     'Salary for Alexander Hunold has been adjusted from $8,500 to $9,000 (Annual Increase) effective 2026-01-01.',
     'employees', '103', TRUE, STR_TO_DATE('01-01-2026 08:00', '%d-%m-%Y %H:%i')),
    ( 8, 'ACTION_COMPLETE', 'Salary adjustment processed',
     'Salary for John Russell has been adjusted from $13,000 to $14,000 (Performance Bonus Adjustment) effective 2026-02-15.',
     'employees', '145', TRUE, STR_TO_DATE('15-02-2026 09:00', '%d-%m-%Y %H:%i')),
    -- System notifications
    ( 1, 'SYSTEM', 'Annual compensation review window open',
     'The Q1 2026 annual compensation review cycle is now open. All manager salary proposals are due by 2026-04-15.',
     NULL, NULL, FALSE, STR_TO_DATE('20-03-2026 06:00', '%d-%m-%Y %H:%i')),
    ( 2, 'SYSTEM', 'Annual compensation review window open',
     'The Q1 2026 annual compensation review cycle is now open. Please coordinate with department managers for salary proposals by 2026-04-15.',
     NULL, NULL, FALSE, STR_TO_DATE('20-03-2026 06:00', '%d-%m-%Y %H:%i')),
    ( 6, 'SYSTEM', 'Annual compensation review window open',
     'The Q1 2026 annual compensation review cycle is now open. Please coordinate with department managers for salary proposals by 2026-04-15.',
     NULL, NULL, TRUE, STR_TO_DATE('20-03-2026 06:00', '%d-%m-%Y %H:%i')),
    ( 1, 'SYSTEM', '2 employees terminated in January',
     'Donna Snythia (198) and Dorothy Wallin (199) were terminated on 2026-01-15. User accounts have been deactivated.',
     NULL, NULL, TRUE, STR_TO_DATE('15-01-2026 17:00', '%d-%m-%Y %H:%i')),
    ( 2, 'SYSTEM', 'New intern onboarded',
     'Steven Markle (128) and Hazel Burton (136) have been reclassified as INTERN with probation status. Contract end dates set to 2026-08-31.',
     NULL, NULL, TRUE, STR_TO_DATE('01-02-2026 09:00', '%d-%m-%Y %H:%i')),
    -- India notifications
    (23, 'PROBATION_ALERT', 'Probation ending: Divya Krishnan',
     'Employee Divya Krishnan (ID: 220) in IT Infrastructure - India has a probation period ending on 2026-04-15. Please schedule a review.',
     'employees', '220', FALSE, STR_TO_DATE('25-03-2026 10:30', '%d-%m-%Y %H:%i')),
    ( 2, 'PROBATION_ALERT', 'Probation ending: Divya Krishnan',
     'Employee Divya Krishnan (ID: 220) in IT Infrastructure - India (Gurugram). HR review required.',
     'employees', '220', FALSE, STR_TO_DATE('25-03-2026 10:30', '%d-%m-%Y %H:%i')),
    (28, 'PROBATION_ALERT', 'Probation ending: Meera Joshi',
     'Employee Meera Joshi (ID: 216) in IT QA - India has a probation period ending on 2026-04-12. Please schedule a review.',
     'employees', '216', FALSE, STR_TO_DATE('25-03-2026 10:30', '%d-%m-%Y %H:%i')),
    ( 2, 'PROBATION_ALERT', 'Probation ending: Meera Joshi',
     'Employee Meera Joshi (ID: 216) in IT QA - India (Mumbai). HR review required.',
     'employees', '216', FALSE, STR_TO_DATE('25-03-2026 10:30', '%d-%m-%Y %H:%i')),
    (23, 'ACTION_COMPLETE', 'Salary adjustment processed',
     'Salary for Rajesh Kumar has been adjusted from INR 8,000 to INR 8,500 (Annual Increase) effective 2026-01-01.',
     'employees', '207', TRUE, STR_TO_DATE('01-01-2026 10:30', '%d-%m-%Y %H:%i')),
    (28, 'ACTION_COMPLETE', 'Salary adjustment processed',
     'Salary for Deepa Nair has been adjusted from INR 7,200 to INR 7,800 (Promotion to QA Lead) effective 2025-04-01.',
     'employees', '212', TRUE, STR_TO_DATE('01-04-2025 10:30', '%d-%m-%Y %H:%i')),
    (33, 'SYSTEM', 'Welcome to IT Infrastructure - India',
     'Your department IT Infrastructure - India (Gurugram) is now active. You have been assigned as department manager.',
     'departments', '300', TRUE, STR_TO_DATE('20-05-2017 06:00', '%d-%m-%Y %H:%i')),
    -- Mexico notifications
    (37, 'PROBATION_ALERT', 'Probation ending: Andres Diaz',
     'Employee Andres Diaz (ID: 231) in Customer Support - Mexico has a probation period ending on 2026-05-20. Please schedule a review.',
     'employees', '231', FALSE, STR_TO_DATE('25-03-2026 09:00', '%d-%m-%Y %H:%i')),
    ( 6, 'PROBATION_ALERT', 'Probation ending: Andres Diaz',
     'Employee Andres Diaz (ID: 231) in Customer Support - Mexico (Mexico City). HR review required.',
     'employees', '231', FALSE, STR_TO_DATE('25-03-2026 09:00', '%d-%m-%Y %H:%i')),
    (37, 'CONTRACT_EXPIRY', 'Contract expiring: Valentina Flores',
     'Fixed-term contract for Valentina Flores (ID: 226) in Sales - Mexico expires on 2026-12-31. Please initiate renewal or offboarding.',
     'employees', '226', FALSE, STR_TO_DATE('25-03-2026 09:00', '%d-%m-%Y %H:%i')),
    ( 2, 'CONTRACT_EXPIRY', 'Contract expiring: Valentina Flores',
     'Fixed-term contract for Valentina Flores (ID: 226) in Sales - Mexico expires on 2026-12-31. HR action needed.',
     'employees', '226', FALSE, STR_TO_DATE('25-03-2026 09:00', '%d-%m-%Y %H:%i')),
    (37, 'ACTION_COMPLETE', 'Salary adjustment processed',
     'Salary for Carlos Garcia has been adjusted from MXN 11,000 to MXN 12,000 (Annual Increase) effective 2026-01-01.',
     'employees', '221', TRUE, STR_TO_DATE('01-01-2026 09:00', '%d-%m-%Y %H:%i')),
    (43, 'SYSTEM', 'Welcome to Customer Support - Mexico',
     'Your department Customer Support - Mexico (Mexico City) is now active. You have been assigned as department manager.',
     'departments', '320', TRUE, STR_TO_DATE('17-04-2017 06:00', '%d-%m-%Y %H:%i')),
    ( 1, 'SYSTEM', 'India & Mexico offices fully staffed',
     'All India offices (Bangalore, Mumbai, Gurugram) and Mexico offices (Mexico City) are now operational with department managers assigned.',
     NULL, NULL, TRUE, STR_TO_DATE('01-01-2026 06:00', '%d-%m-%Y %H:%i'));

COMMIT;

-- Enable foreign key checks - all data is now loaded
SET FOREIGN_KEY_CHECKS=1;
