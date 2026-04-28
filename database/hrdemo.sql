-- PostgreSQL 16 demo data for Vertex Software.
-- Derived from the aihrdemo logical model, but rewritten as PostgreSQL-native seed data.

BEGIN;

TRUNCATE TABLE
    aihr_notifications,
    aihr_employee_documents,
    aihr_audit_logs,
    aihr_user_preferences,
    aihr_translations,
    aihr_assessment_cycles,
    aihr_user_roles,
    aihr_users,
    aihr_roles,
    aihr_job_history,
    aihr_employees,
    aihr_pay_grades,
    aihr_departments,
    aihr_locations,
    aihr_countries,
    aihr_jobs,
    aihr_regions
RESTART IDENTITY CASCADE;

INSERT INTO aihr_regions (region_id, region_name) VALUES
    (10, 'Europe'),
    (20, 'Americas'),
    (30, 'Asia'),
    (40, 'Oceania'),
    (50, 'Africa');

INSERT INTO aihr_countries (country_id, country_name, region_id) VALUES
    ('AU', 'Australia', 40),
    ('BE', 'Belgium', 10),
    ('BR', 'Brazil', 20),
    ('CA', 'Canada', 20),
    ('CH', 'Switzerland', 10),
    ('DE', 'Germany', 10),
    ('DK', 'Denmark', 10),
    ('ES', 'Spain', 10),
    ('FR', 'France', 10),
    ('GB', 'United Kingdom', 10),
    ('IE', 'Ireland', 10),
    ('IN', 'India', 30),
    ('IT', 'Italy', 10),
    ('JP', 'Japan', 30),
    ('MX', 'Mexico', 20),
    ('NL', 'Netherlands', 10),
    ('SG', 'Singapore', 30),
    ('US', 'United States of America', 20);

INSERT INTO aihr_locations (location_id, street_address, postal_code, city, state_province, country_id) VALUES
    (1400, '500 Congress Ave', '78701', 'Austin', 'Texas', 'US'),
    (1500, '1101 2nd Ave', '98101', 'Seattle', 'Washington', 'US'),
    (1700, '10800 NE 8th St', '98004', 'Bellevue', 'Washington', 'US'),
    (1800, '151 Front St W', 'M5J2N1', 'Toronto', 'Ontario', 'CA'),
    (2000, '20 Finsbury Circus', 'EC2M7EB', 'London', NULL, 'GB'),
    (2100, 'Unter den Linden 17', '10117', 'Berlin', NULL, 'DE'),
    (2200, 'Talstrasse 18', '8001', 'Zurich', NULL, 'CH'),
    (2300, 'Via Monte Napoleone 8', '20121', 'Milan', NULL, 'IT'),
    (2400, '18 Rue de Londres', '75009', 'Paris', NULL, 'FR'),
    (2500, 'Wilhelminaplein 32', '3072DE', 'Rotterdam', NULL, 'NL'),
    (3300, '100 MG Road', '560001', 'Bengaluru', 'Karnataka', 'IN'),
    (3400, 'Bandra Kurla Complex 201', '400051', 'Mumbai', 'Maharashtra', 'IN'),
    (3500, 'DLF Cyber City Phase 3', '122002', 'Gurugram', 'Haryana', 'IN'),
    (3600, 'Avenida Paseo de la Reforma 250', '06600', 'Mexico City', 'Ciudad de Mexico', 'MX'),
    (3800, 'Grand Canal Quay 7', 'D02X525', 'Dublin', NULL, 'IE'),
    (3900, 'Passeig de Gracia 54', '08007', 'Barcelona', NULL, 'ES');

INSERT INTO aihr_departments (department_id, department_name, manager_id, location_id, parent_department_id, deleted_at) VALUES
    (10, 'Strategy & Operations', NULL, 1700, NULL, NULL),
    (20, 'Product Marketing', NULL, 1700, NULL, NULL),
    (30, 'Procurement & Vendor Ops', NULL, 1700, NULL, NULL),
    (40, 'People Team', NULL, 1700, NULL, NULL),
    (50, 'Workplace Experience', NULL, 1500, NULL, NULL),
    (60, 'Engineering', NULL, 1400, NULL, NULL),
    (70, 'Brand & Communications', NULL, 1700, NULL, NULL),
    (80, 'Revenue', NULL, 1700, NULL, NULL),
    (90, 'Executive Leadership', NULL, 1700, NULL, NULL),
    (100, 'Finance', NULL, 1700, NULL, NULL),
    (110, 'Accounting', NULL, 1700, NULL, NULL),
    (120, 'FP&A', NULL, 1700, NULL, NULL),
    (130, 'Legal Operations', NULL, 1700, NULL, NULL),
    (140, 'Risk & Compliance', NULL, 1700, NULL, NULL),
    (150, 'Investor Relations', NULL, 1700, NULL, NULL),
    (160, 'Compensation & Benefits', NULL, 1700, NULL, NULL),
    (170, 'Enterprise Systems', NULL, 1700, NULL, NULL),
    (200, 'Corporate Operations', NULL, 1700, NULL, NULL),
    (210, 'Technical Support India', NULL, 3300, NULL, NULL),
    (220, 'Cloud Infrastructure India', NULL, 3400, NULL, NULL),
    (230, 'Developer Platform', NULL, 1500, NULL, NULL),
    (240, 'Enterprise Sales Europe', NULL, 2000, NULL, NULL),
    (250, 'Customer Success Europe', NULL, 2500, NULL, NULL),
    (260, 'Talent Acquisition', NULL, 1700, NULL, NULL),
    (270, 'Payroll Operations', NULL, 1700, NULL, NULL),
    (280, 'Product Eng India', NULL, 3300, NULL, NULL),
    (290, 'Quality Eng India', NULL, 3400, NULL, NULL),
    (300, 'Site Reliability India', NULL, 3500, NULL, NULL),
    (310, 'Solutions Eng Germany', NULL, 2100, NULL, NULL),
    (320, 'Customer Support Ireland', NULL, 3800, NULL, NULL),
    (330, 'Growth Marketing France', NULL, 2400, NULL, NULL),
    (340, 'Product Eng Netherlands', NULL, 2500, NULL, NULL),
    (350, 'Regional Sales Mexico', NULL, 3600, 80, NULL);

INSERT INTO aihr_jobs (job_id, job_title, min_salary, max_salary) VALUES
    ('AD_ASST', 'Executive Assistant', 3000, 6000),
    ('AD_PRES', 'Chief Executive Officer', 20000, 40000),
    ('AD_VP', 'Chief Operating Officer', 15000, 30000),
    ('AC_ACCOUNT', 'Accountant', 4200, 9000),
    ('AC_MGR', 'Accounting Manager', 8200, 16400),
    ('CS_MGR', 'Customer Success Lead', 6000, 11000),
    ('CS_SPEC', 'Customer Success Specialist', 3500, 7500),
    ('DEVOPS', 'DevOps Engineer', 4500, 11000),
    ('DIR_ENG', 'Senior Director, Engineering', 12000, 20000),
    ('ENG_MGR', 'Engineering Manager', 8500, 14000),
    ('FI_ACCOUNT', 'Accountant', 4200, 9000),
    ('FI_MGR', 'Director, Finance', 8200, 16400),
    ('HR_DIR', 'Head of People', 9000, 17000),
    ('HR_REP', 'Human Resources Representative', 4000, 9000),
    ('IT_PROG', 'Software Engineer', 4000, 10000),
    ('MK_MAN', 'Director, Marketing', 9000, 15000),
    ('MK_REP', 'Marketing Specialist', 4000, 9000),
    ('PR_REP', 'Communications Specialist', 4500, 10500),
    ('PROD_MGR', 'Product Manager', 6500, 14000),
    ('PU_CLERK', 'Procurement Coordinator', 2500, 5500),
    ('PU_MAN', 'Director, Procurement', 8000, 15000),
    ('QA_ENG', 'Quality Engineer', 3800, 8500),
    ('SA_MAN', 'Regional Sales Director', 10000, 20000),
    ('SA_REP', 'Sales Representative', 6000, 12000),
    ('SALES_VP', 'Chief Revenue Officer', 15000, 26000),
    ('SH_CLERK', 'Logistics Coordinator', 2500, 5500),
    ('ST_CLERK', 'Operations Coordinator', 2000, 5000),
    ('ST_MAN', 'Director, Workplace Operations', 5500, 8500),
    ('SUP_ENG', 'Technical Support Engineer', 3500, 9000),
    ('TECH_VP', 'Vice President, Engineering', 17000, 30000),
    ('UX_DES', 'UX Designer', 4500, 9500);

INSERT INTO aihr_assessment_cycles (
    cycle_code,
    default_label,
    period_type,
    start_date,
    end_date,
    cycle_status,
    display_order,
    is_active
) VALUES
    ('FY2024', 'FY2024 Annual Assessment', 'ANNUAL', DATE '2024-01-01', DATE '2024-12-31', 'CLOSED', 10, 0),
    ('FY2025', 'FY2025 Annual Assessment', 'ANNUAL', DATE '2025-01-01', DATE '2025-12-31', 'CLOSED', 20, 0),
    ('FY2026-H1', 'FY2026 Mid-Year Assessment', 'HALF', DATE '2026-01-01', DATE '2026-06-30', 'CLOSED', 30, 1),
    ('FY2026-H2', 'FY2026 Year-End Assessment', 'HALF', DATE '2026-07-01', DATE '2026-12-31', 'OPEN', 40, 1);

INSERT INTO aihr_translations (entity_type, entity_key, field_name, locale_code, translated_value) VALUES
    ('REGION', '10', 'region_name', 'es-MX', 'Europa'),
    ('REGION', '20', 'region_name', 'es-MX', 'Américas'),
    ('REGION', '30', 'region_name', 'es-MX', 'Asia'),
    ('REGION', '40', 'region_name', 'es-MX', 'Oceanía'),
    ('REGION', '50', 'region_name', 'es-MX', 'África'),
    ('COUNTRY', 'AU', 'country_name', 'es-MX', 'Australia'),
    ('COUNTRY', 'BE', 'country_name', 'es-MX', 'Bélgica'),
    ('COUNTRY', 'BR', 'country_name', 'es-MX', 'Brasil'),
    ('COUNTRY', 'CA', 'country_name', 'es-MX', 'Canadá'),
    ('COUNTRY', 'CH', 'country_name', 'es-MX', 'Suiza'),
    ('COUNTRY', 'DE', 'country_name', 'es-MX', 'Alemania'),
    ('COUNTRY', 'DK', 'country_name', 'es-MX', 'Dinamarca'),
    ('COUNTRY', 'ES', 'country_name', 'es-MX', 'España'),
    ('COUNTRY', 'FR', 'country_name', 'es-MX', 'Francia'),
    ('COUNTRY', 'GB', 'country_name', 'es-MX', 'Reino Unido'),
    ('COUNTRY', 'IE', 'country_name', 'es-MX', 'Irlanda'),
    ('COUNTRY', 'IN', 'country_name', 'es-MX', 'India'),
    ('COUNTRY', 'IT', 'country_name', 'es-MX', 'Italia'),
    ('COUNTRY', 'JP', 'country_name', 'es-MX', 'Japón'),
    ('COUNTRY', 'MX', 'country_name', 'es-MX', 'México'),
    ('COUNTRY', 'NL', 'country_name', 'es-MX', 'Países Bajos'),
    ('COUNTRY', 'SG', 'country_name', 'es-MX', 'Singapur'),
    ('COUNTRY', 'US', 'country_name', 'es-MX', 'Estados Unidos'),
    ('LOCATION', '1400', 'city', 'es-MX', 'Austin'),
    ('LOCATION', '1500', 'city', 'es-MX', 'Seattle'),
    ('LOCATION', '1700', 'city', 'es-MX', 'Bellevue'),
    ('LOCATION', '1800', 'city', 'es-MX', 'Toronto'),
    ('LOCATION', '2000', 'city', 'es-MX', 'Londres'),
    ('LOCATION', '2100', 'city', 'es-MX', 'Berlín'),
    ('LOCATION', '2200', 'city', 'es-MX', 'Zúrich'),
    ('LOCATION', '2300', 'city', 'es-MX', 'Milán'),
    ('LOCATION', '2400', 'city', 'es-MX', 'París'),
    ('LOCATION', '2500', 'city', 'es-MX', 'Róterdam'),
    ('LOCATION', '3300', 'city', 'es-MX', 'Bengaluru'),
    ('LOCATION', '3400', 'city', 'es-MX', 'Mumbai'),
    ('LOCATION', '3500', 'city', 'es-MX', 'Gurugram'),
    ('LOCATION', '3800', 'city', 'es-MX', 'Dublín'),
    ('LOCATION', '3900', 'city', 'es-MX', 'Barcelona'),
    ('DEPARTMENT', '10', 'department_name', 'es-MX', 'Estrategia y Operaciones'),
    ('DEPARTMENT', '20', 'department_name', 'es-MX', 'Marketing de Producto'),
    ('DEPARTMENT', '30', 'department_name', 'es-MX', 'Compras y Operaciones de Proveedores'),
    ('DEPARTMENT', '40', 'department_name', 'es-MX', 'Equipo de Personas'),
    ('DEPARTMENT', '50', 'department_name', 'es-MX', 'Experiencia del Lugar de Trabajo'),
    ('DEPARTMENT', '60', 'department_name', 'es-MX', 'Ingeniería'),
    ('DEPARTMENT', '70', 'department_name', 'es-MX', 'Marca y Comunicaciones'),
    ('DEPARTMENT', '80', 'department_name', 'es-MX', 'Ingresos'),
    ('DEPARTMENT', '90', 'department_name', 'es-MX', 'Liderazgo Ejecutivo'),
    ('DEPARTMENT', '100', 'department_name', 'es-MX', 'Finanzas'),
    ('DEPARTMENT', '110', 'department_name', 'es-MX', 'Contabilidad'),
    ('DEPARTMENT', '120', 'department_name', 'es-MX', 'Planificación y Análisis Financiero'),
    ('DEPARTMENT', '130', 'department_name', 'es-MX', 'Operaciones Legales'),
    ('DEPARTMENT', '140', 'department_name', 'es-MX', 'Riesgo y Cumplimiento'),
    ('DEPARTMENT', '150', 'department_name', 'es-MX', 'Relaciones con Inversionistas'),
    ('DEPARTMENT', '160', 'department_name', 'es-MX', 'Compensación y Beneficios'),
    ('DEPARTMENT', '170', 'department_name', 'es-MX', 'Sistemas Empresariales'),
    ('DEPARTMENT', '200', 'department_name', 'es-MX', 'Operaciones Corporativas'),
    ('DEPARTMENT', '210', 'department_name', 'es-MX', 'Soporte Técnico India'),
    ('DEPARTMENT', '220', 'department_name', 'es-MX', 'Infraestructura Cloud India'),
    ('DEPARTMENT', '230', 'department_name', 'es-MX', 'Plataforma para Desarrolladores'),
    ('DEPARTMENT', '240', 'department_name', 'es-MX', 'Ventas Empresariales Europa'),
    ('DEPARTMENT', '250', 'department_name', 'es-MX', 'Éxito del Cliente Europa'),
    ('DEPARTMENT', '260', 'department_name', 'es-MX', 'Adquisición de Talento'),
    ('DEPARTMENT', '270', 'department_name', 'es-MX', 'Operaciones de Nómina'),
    ('DEPARTMENT', '280', 'department_name', 'es-MX', 'Ingeniería de Producto India'),
    ('DEPARTMENT', '290', 'department_name', 'es-MX', 'Ingeniería de Calidad India'),
    ('DEPARTMENT', '300', 'department_name', 'es-MX', 'Confiabilidad del Sitio India'),
    ('DEPARTMENT', '310', 'department_name', 'es-MX', 'Ingeniería de Soluciones Alemania'),
    ('DEPARTMENT', '320', 'department_name', 'es-MX', 'Soporte al Cliente Irlanda'),
    ('DEPARTMENT', '330', 'department_name', 'es-MX', 'Marketing de Crecimiento Francia'),
    ('DEPARTMENT', '340', 'department_name', 'es-MX', 'Ingeniería de Producto Países Bajos'),
    ('JOB', 'AD_ASST', 'job_title', 'es-MX', 'Asistente Ejecutivo'),
    ('JOB', 'AD_PRES', 'job_title', 'es-MX', 'Director Ejecutivo'),
    ('JOB', 'AD_VP', 'job_title', 'es-MX', 'Director de Operaciones'),
    ('JOB', 'AC_ACCOUNT', 'job_title', 'es-MX', 'Contador'),
    ('JOB', 'AC_MGR', 'job_title', 'es-MX', 'Gerente de Contabilidad'),
    ('JOB', 'CS_MGR', 'job_title', 'es-MX', 'Líder de Éxito del Cliente'),
    ('JOB', 'CS_SPEC', 'job_title', 'es-MX', 'Especialista de Éxito del Cliente'),
    ('JOB', 'DEVOPS', 'job_title', 'es-MX', 'Ingeniero DevOps'),
    ('JOB', 'DIR_ENG', 'job_title', 'es-MX', 'Director Senior de Ingeniería'),
    ('JOB', 'ENG_MGR', 'job_title', 'es-MX', 'Gerente de Ingeniería'),
    ('JOB', 'FI_ACCOUNT', 'job_title', 'es-MX', 'Contador'),
    ('JOB', 'FI_MGR', 'job_title', 'es-MX', 'Director de Finanzas'),
    ('JOB', 'HR_DIR', 'job_title', 'es-MX', 'Director de Personas'),
    ('JOB', 'HR_REP', 'job_title', 'es-MX', 'Representante de Recursos Humanos'),
    ('JOB', 'IT_PROG', 'job_title', 'es-MX', 'Ingeniero de Software'),
    ('JOB', 'MK_MAN', 'job_title', 'es-MX', 'Director de Marketing'),
    ('JOB', 'MK_REP', 'job_title', 'es-MX', 'Especialista de Marketing'),
    ('JOB', 'PR_REP', 'job_title', 'es-MX', 'Especialista de Comunicaciones'),
    ('JOB', 'PROD_MGR', 'job_title', 'es-MX', 'Gerente de Producto'),
    ('JOB', 'PU_CLERK', 'job_title', 'es-MX', 'Coordinador de Compras'),
    ('JOB', 'PU_MAN', 'job_title', 'es-MX', 'Director de Compras'),
    ('JOB', 'QA_ENG', 'job_title', 'es-MX', 'Ingeniero de Calidad'),
    ('JOB', 'SA_MAN', 'job_title', 'es-MX', 'Director Regional de Ventas'),
    ('JOB', 'SA_REP', 'job_title', 'es-MX', 'Representante de Ventas'),
    ('JOB', 'SALES_VP', 'job_title', 'es-MX', 'Director de Ingresos'),
    ('JOB', 'SH_CLERK', 'job_title', 'es-MX', 'Coordinador de Logística'),
    ('JOB', 'ST_CLERK', 'job_title', 'es-MX', 'Coordinador de Operaciones'),
    ('JOB', 'ST_MAN', 'job_title', 'es-MX', 'Director de Operaciones del Lugar de Trabajo'),
    ('JOB', 'SUP_ENG', 'job_title', 'es-MX', 'Ingeniero de Soporte Técnico'),
    ('JOB', 'TECH_VP', 'job_title', 'es-MX', 'Vicepresidente de Ingeniería'),
    ('JOB', 'UX_DES', 'job_title', 'es-MX', 'Diseñador UX');

INSERT INTO aihr_translations (entity_type, entity_key, field_name, locale_code, translated_value) VALUES
    ('REGION', '10', 'region_name', 'fr-FR', 'Europe'),
    ('REGION', '20', 'region_name', 'fr-FR', 'Amériques'),
    ('REGION', '30', 'region_name', 'fr-FR', 'Asie'),
    ('REGION', '40', 'region_name', 'fr-FR', 'Océanie'),
    ('REGION', '50', 'region_name', 'fr-FR', 'Afrique'),
    ('COUNTRY', 'AU', 'country_name', 'fr-FR', 'Australie'),
    ('COUNTRY', 'BE', 'country_name', 'fr-FR', 'Belgique'),
    ('COUNTRY', 'BR', 'country_name', 'fr-FR', 'Brésil'),
    ('COUNTRY', 'CA', 'country_name', 'fr-FR', 'Canada'),
    ('COUNTRY', 'CH', 'country_name', 'fr-FR', 'Suisse'),
    ('COUNTRY', 'DE', 'country_name', 'fr-FR', 'Allemagne'),
    ('COUNTRY', 'DK', 'country_name', 'fr-FR', 'Danemark'),
    ('COUNTRY', 'ES', 'country_name', 'fr-FR', 'Espagne'),
    ('COUNTRY', 'FR', 'country_name', 'fr-FR', 'France'),
    ('COUNTRY', 'GB', 'country_name', 'fr-FR', 'Royaume-Uni'),
    ('COUNTRY', 'IE', 'country_name', 'fr-FR', 'Irlande'),
    ('COUNTRY', 'IN', 'country_name', 'fr-FR', 'Inde'),
    ('COUNTRY', 'IT', 'country_name', 'fr-FR', 'Italie'),
    ('COUNTRY', 'JP', 'country_name', 'fr-FR', 'Japon'),
    ('COUNTRY', 'MX', 'country_name', 'fr-FR', 'Mexique'),
    ('COUNTRY', 'NL', 'country_name', 'fr-FR', 'Pays-Bas'),
    ('COUNTRY', 'SG', 'country_name', 'fr-FR', 'Singapour'),
    ('COUNTRY', 'US', 'country_name', 'fr-FR', 'États-Unis'),
    ('LOCATION', '1400', 'city', 'fr-FR', 'Austin'),
    ('LOCATION', '1500', 'city', 'fr-FR', 'Seattle'),
    ('LOCATION', '1700', 'city', 'fr-FR', 'Bellevue'),
    ('LOCATION', '1800', 'city', 'fr-FR', 'Toronto'),
    ('LOCATION', '2000', 'city', 'fr-FR', 'Londres'),
    ('LOCATION', '2100', 'city', 'fr-FR', 'Berlin'),
    ('LOCATION', '2200', 'city', 'fr-FR', 'Zurich'),
    ('LOCATION', '2300', 'city', 'fr-FR', 'Milan'),
    ('LOCATION', '2400', 'city', 'fr-FR', 'Paris'),
    ('LOCATION', '2500', 'city', 'fr-FR', 'Rotterdam'),
    ('LOCATION', '3300', 'city', 'fr-FR', 'Bengaluru'),
    ('LOCATION', '3400', 'city', 'fr-FR', 'Mumbai'),
    ('LOCATION', '3500', 'city', 'fr-FR', 'Gurugram'),
    ('LOCATION', '3800', 'city', 'fr-FR', 'Dublin'),
    ('LOCATION', '3900', 'city', 'fr-FR', 'Barcelone'),
    ('DEPARTMENT', '10', 'department_name', 'fr-FR', 'Stratégie et opérations'),
    ('DEPARTMENT', '20', 'department_name', 'fr-FR', 'Marketing produit'),
    ('DEPARTMENT', '30', 'department_name', 'fr-FR', 'Achats et opérations fournisseurs'),
    ('DEPARTMENT', '40', 'department_name', 'fr-FR', 'Équipe People'),
    ('DEPARTMENT', '50', 'department_name', 'fr-FR', 'Expérience du lieu de travail'),
    ('DEPARTMENT', '60', 'department_name', 'fr-FR', 'Ingénierie'),
    ('DEPARTMENT', '70', 'department_name', 'fr-FR', 'Marque et communications'),
    ('DEPARTMENT', '80', 'department_name', 'fr-FR', 'Revenus'),
    ('DEPARTMENT', '90', 'department_name', 'fr-FR', 'Direction exécutive'),
    ('DEPARTMENT', '100', 'department_name', 'fr-FR', 'Finance'),
    ('DEPARTMENT', '110', 'department_name', 'fr-FR', 'Comptabilité'),
    ('DEPARTMENT', '120', 'department_name', 'fr-FR', 'Planification et analyse financière'),
    ('DEPARTMENT', '130', 'department_name', 'fr-FR', 'Opérations juridiques'),
    ('DEPARTMENT', '140', 'department_name', 'fr-FR', 'Risque et conformité'),
    ('DEPARTMENT', '150', 'department_name', 'fr-FR', 'Relations investisseurs'),
    ('DEPARTMENT', '160', 'department_name', 'fr-FR', 'Rémunération et avantages'),
    ('DEPARTMENT', '170', 'department_name', 'fr-FR', 'Systèmes d''entreprise'),
    ('DEPARTMENT', '200', 'department_name', 'fr-FR', 'Opérations d''entreprise'),
    ('DEPARTMENT', '210', 'department_name', 'fr-FR', 'Support technique Inde'),
    ('DEPARTMENT', '220', 'department_name', 'fr-FR', 'Infrastructure cloud Inde'),
    ('DEPARTMENT', '230', 'department_name', 'fr-FR', 'Plateforme développeur'),
    ('DEPARTMENT', '240', 'department_name', 'fr-FR', 'Ventes entreprises Europe'),
    ('DEPARTMENT', '250', 'department_name', 'fr-FR', 'Réussite client Europe'),
    ('DEPARTMENT', '260', 'department_name', 'fr-FR', 'Acquisition de talents'),
    ('DEPARTMENT', '270', 'department_name', 'fr-FR', 'Opérations paie'),
    ('DEPARTMENT', '280', 'department_name', 'fr-FR', 'Ingénierie produit Inde'),
    ('DEPARTMENT', '290', 'department_name', 'fr-FR', 'Ingénierie qualité Inde'),
    ('DEPARTMENT', '300', 'department_name', 'fr-FR', 'Fiabilité du site Inde'),
    ('DEPARTMENT', '310', 'department_name', 'fr-FR', 'Ingénierie solutions Allemagne'),
    ('DEPARTMENT', '320', 'department_name', 'fr-FR', 'Support client Irlande'),
    ('DEPARTMENT', '330', 'department_name', 'fr-FR', 'Marketing de croissance France'),
    ('DEPARTMENT', '340', 'department_name', 'fr-FR', 'Ingénierie produit Pays-Bas'),
    ('JOB', 'AD_ASST', 'job_title', 'fr-FR', 'Assistant exécutif'),
    ('JOB', 'AD_PRES', 'job_title', 'fr-FR', 'Directeur général'),
    ('JOB', 'AD_VP', 'job_title', 'fr-FR', 'Directeur des opérations'),
    ('JOB', 'AC_ACCOUNT', 'job_title', 'fr-FR', 'Comptable'),
    ('JOB', 'AC_MGR', 'job_title', 'fr-FR', 'Responsable comptable'),
    ('JOB', 'CS_MGR', 'job_title', 'fr-FR', 'Lead réussite client'),
    ('JOB', 'CS_SPEC', 'job_title', 'fr-FR', 'Spécialiste réussite client'),
    ('JOB', 'DEVOPS', 'job_title', 'fr-FR', 'Ingénieur DevOps'),
    ('JOB', 'DIR_ENG', 'job_title', 'fr-FR', 'Directeur principal ingénierie'),
    ('JOB', 'ENG_MGR', 'job_title', 'fr-FR', 'Responsable ingénierie'),
    ('JOB', 'FI_ACCOUNT', 'job_title', 'fr-FR', 'Comptable'),
    ('JOB', 'FI_MGR', 'job_title', 'fr-FR', 'Directeur financier'),
    ('JOB', 'HR_DIR', 'job_title', 'fr-FR', 'Responsable People'),
    ('JOB', 'HR_REP', 'job_title', 'fr-FR', 'Représentant ressources humaines'),
    ('JOB', 'IT_PROG', 'job_title', 'fr-FR', 'Ingénieur logiciel'),
    ('JOB', 'MK_MAN', 'job_title', 'fr-FR', 'Directeur marketing'),
    ('JOB', 'MK_REP', 'job_title', 'fr-FR', 'Spécialiste marketing'),
    ('JOB', 'PR_REP', 'job_title', 'fr-FR', 'Spécialiste communication'),
    ('JOB', 'PROD_MGR', 'job_title', 'fr-FR', 'Chef de produit'),
    ('JOB', 'PU_CLERK', 'job_title', 'fr-FR', 'Coordinateur achats'),
    ('JOB', 'PU_MAN', 'job_title', 'fr-FR', 'Directeur achats'),
    ('JOB', 'QA_ENG', 'job_title', 'fr-FR', 'Ingénieur qualité'),
    ('JOB', 'SA_MAN', 'job_title', 'fr-FR', 'Directeur régional des ventes'),
    ('JOB', 'SA_REP', 'job_title', 'fr-FR', 'Représentant commercial'),
    ('JOB', 'SALES_VP', 'job_title', 'fr-FR', 'Directeur des revenus'),
    ('JOB', 'SH_CLERK', 'job_title', 'fr-FR', 'Coordinateur logistique'),
    ('JOB', 'ST_CLERK', 'job_title', 'fr-FR', 'Coordinateur opérations'),
    ('JOB', 'ST_MAN', 'job_title', 'fr-FR', 'Directeur opérations du lieu de travail'),
    ('JOB', 'SUP_ENG', 'job_title', 'fr-FR', 'Ingénieur support technique'),
    ('JOB', 'TECH_VP', 'job_title', 'fr-FR', 'Vice-président ingénierie'),
    ('JOB', 'UX_DES', 'job_title', 'fr-FR', 'Designer UX');

INSERT INTO aihr_translations (entity_type, entity_key, field_name, locale_code, translated_value) VALUES
    ('REGION', '10', 'region_name', 'hi-IN', 'यूरोप'),
    ('REGION', '20', 'region_name', 'hi-IN', 'अमेरिका'),
    ('REGION', '30', 'region_name', 'hi-IN', 'एशिया'),
    ('REGION', '40', 'region_name', 'hi-IN', 'ओशिनिया'),
    ('REGION', '50', 'region_name', 'hi-IN', 'अफ्रीका'),
    ('COUNTRY', 'AU', 'country_name', 'hi-IN', 'ऑस्ट्रेलिया'),
    ('COUNTRY', 'BE', 'country_name', 'hi-IN', 'बेल्जियम'),
    ('COUNTRY', 'BR', 'country_name', 'hi-IN', 'ब्राज़ील'),
    ('COUNTRY', 'CA', 'country_name', 'hi-IN', 'कनाडा'),
    ('COUNTRY', 'CH', 'country_name', 'hi-IN', 'स्विट्ज़रलैंड'),
    ('COUNTRY', 'DE', 'country_name', 'hi-IN', 'जर्मनी'),
    ('COUNTRY', 'DK', 'country_name', 'hi-IN', 'डेनमार्क'),
    ('COUNTRY', 'ES', 'country_name', 'hi-IN', 'स्पेन'),
    ('COUNTRY', 'FR', 'country_name', 'hi-IN', 'फ्रांस'),
    ('COUNTRY', 'GB', 'country_name', 'hi-IN', 'यूनाइटेड किंगडम'),
    ('COUNTRY', 'IE', 'country_name', 'hi-IN', 'आयरलैंड'),
    ('COUNTRY', 'IN', 'country_name', 'hi-IN', 'भारत'),
    ('COUNTRY', 'IT', 'country_name', 'hi-IN', 'इटली'),
    ('COUNTRY', 'JP', 'country_name', 'hi-IN', 'जापान'),
    ('COUNTRY', 'MX', 'country_name', 'hi-IN', 'मेक्सिको'),
    ('COUNTRY', 'NL', 'country_name', 'hi-IN', 'नीदरलैंड्स'),
    ('COUNTRY', 'SG', 'country_name', 'hi-IN', 'सिंगापुर'),
    ('COUNTRY', 'US', 'country_name', 'hi-IN', 'संयुक्त राज्य अमेरिका'),
    ('LOCATION', '1400', 'city', 'hi-IN', 'ऑस्टिन'),
    ('LOCATION', '1500', 'city', 'hi-IN', 'सिएटल'),
    ('LOCATION', '1700', 'city', 'hi-IN', 'बेलव्यू'),
    ('LOCATION', '1800', 'city', 'hi-IN', 'टोरंटो'),
    ('LOCATION', '2000', 'city', 'hi-IN', 'लंदन'),
    ('LOCATION', '2100', 'city', 'hi-IN', 'बर्लिन'),
    ('LOCATION', '2200', 'city', 'hi-IN', 'ज्यूरिख'),
    ('LOCATION', '2300', 'city', 'hi-IN', 'मिलान'),
    ('LOCATION', '2400', 'city', 'hi-IN', 'पेरिस'),
    ('LOCATION', '2500', 'city', 'hi-IN', 'रॉटरडैम'),
    ('LOCATION', '3300', 'city', 'hi-IN', 'बेंगलुरु'),
    ('LOCATION', '3400', 'city', 'hi-IN', 'मुंबई'),
    ('LOCATION', '3500', 'city', 'hi-IN', 'गुरुग्राम'),
    ('LOCATION', '3800', 'city', 'hi-IN', 'डबलिन'),
    ('LOCATION', '3900', 'city', 'hi-IN', 'बार्सिलोना'),
    ('DEPARTMENT', '10', 'department_name', 'hi-IN', 'रणनीति और संचालन'),
    ('DEPARTMENT', '20', 'department_name', 'hi-IN', 'उत्पाद विपणन'),
    ('DEPARTMENT', '30', 'department_name', 'hi-IN', 'प्रोक्योरमेंट और विक्रेता संचालन'),
    ('DEPARTMENT', '40', 'department_name', 'hi-IN', 'पीपल टीम'),
    ('DEPARTMENT', '50', 'department_name', 'hi-IN', 'कार्यस्थल अनुभव'),
    ('DEPARTMENT', '60', 'department_name', 'hi-IN', 'इंजीनियरिंग'),
    ('DEPARTMENT', '70', 'department_name', 'hi-IN', 'ब्रांड और संचार'),
    ('DEPARTMENT', '80', 'department_name', 'hi-IN', 'राजस्व'),
    ('DEPARTMENT', '90', 'department_name', 'hi-IN', 'कार्यकारी नेतृत्व'),
    ('DEPARTMENT', '100', 'department_name', 'hi-IN', 'वित्त'),
    ('DEPARTMENT', '110', 'department_name', 'hi-IN', 'लेखांकन'),
    ('DEPARTMENT', '120', 'department_name', 'hi-IN', 'वित्तीय योजना और विश्लेषण'),
    ('DEPARTMENT', '130', 'department_name', 'hi-IN', 'कानूनी संचालन'),
    ('DEPARTMENT', '140', 'department_name', 'hi-IN', 'जोखिम और अनुपालन'),
    ('DEPARTMENT', '150', 'department_name', 'hi-IN', 'निवेशक संबंध'),
    ('DEPARTMENT', '160', 'department_name', 'hi-IN', 'मुआवजा और लाभ'),
    ('DEPARTMENT', '170', 'department_name', 'hi-IN', 'एंटरप्राइज सिस्टम्स'),
    ('DEPARTMENT', '200', 'department_name', 'hi-IN', 'कॉर्पोरेट ऑपरेशंस'),
    ('DEPARTMENT', '210', 'department_name', 'hi-IN', 'तकनीकी सहायता भारत'),
    ('DEPARTMENT', '220', 'department_name', 'hi-IN', 'क्लाउड इन्फ्रास्ट्रक्चर भारत'),
    ('DEPARTMENT', '230', 'department_name', 'hi-IN', 'डेवलपर प्लेटफ़ॉर्म'),
    ('DEPARTMENT', '240', 'department_name', 'hi-IN', 'एंटरप्राइज़ बिक्री यूरोप'),
    ('DEPARTMENT', '250', 'department_name', 'hi-IN', 'ग्राहक सफलता यूरोप'),
    ('DEPARTMENT', '260', 'department_name', 'hi-IN', 'टैलेंट एक्विज़िशन'),
    ('DEPARTMENT', '270', 'department_name', 'hi-IN', 'पेरोल ऑपरेशंस'),
    ('DEPARTMENT', '280', 'department_name', 'hi-IN', 'प्रोडक्ट इंजीनियरिंग भारत'),
    ('DEPARTMENT', '290', 'department_name', 'hi-IN', 'क्वालिटी इंजीनियरिंग भारत'),
    ('DEPARTMENT', '300', 'department_name', 'hi-IN', 'साइट रिलायबिलिटी भारत'),
    ('DEPARTMENT', '310', 'department_name', 'hi-IN', 'सॉल्यूशंस इंजीनियरिंग जर्मनी'),
    ('DEPARTMENT', '320', 'department_name', 'hi-IN', 'ग्राहक सहायता आयरलैंड'),
    ('DEPARTMENT', '330', 'department_name', 'hi-IN', 'ग्रोथ मार्केटिंग फ्रांस'),
    ('DEPARTMENT', '340', 'department_name', 'hi-IN', 'प्रोडक्ट इंजीनियरिंग नीदरलैंड्स'),
    ('JOB', 'AD_ASST', 'job_title', 'hi-IN', 'कार्यकारी सहायक'),
    ('JOB', 'AD_PRES', 'job_title', 'hi-IN', 'मुख्य कार्यकारी अधिकारी'),
    ('JOB', 'AD_VP', 'job_title', 'hi-IN', 'मुख्य परिचालन अधिकारी'),
    ('JOB', 'AC_ACCOUNT', 'job_title', 'hi-IN', 'लेखाकार'),
    ('JOB', 'AC_MGR', 'job_title', 'hi-IN', 'लेखा प्रबंधक'),
    ('JOB', 'CS_MGR', 'job_title', 'hi-IN', 'ग्राहक सफलता लीड'),
    ('JOB', 'CS_SPEC', 'job_title', 'hi-IN', 'ग्राहक सफलता विशेषज्ञ'),
    ('JOB', 'DEVOPS', 'job_title', 'hi-IN', 'DevOps इंजीनियर'),
    ('JOB', 'DIR_ENG', 'job_title', 'hi-IN', 'सीनियर इंजीनियरिंग निदेशक'),
    ('JOB', 'ENG_MGR', 'job_title', 'hi-IN', 'इंजीनियरिंग प्रबंधक'),
    ('JOB', 'FI_ACCOUNT', 'job_title', 'hi-IN', 'लेखाकार'),
    ('JOB', 'FI_MGR', 'job_title', 'hi-IN', 'वित्त निदेशक'),
    ('JOB', 'HR_DIR', 'job_title', 'hi-IN', 'पीपल प्रमुख'),
    ('JOB', 'HR_REP', 'job_title', 'hi-IN', 'मानव संसाधन प्रतिनिधि'),
    ('JOB', 'IT_PROG', 'job_title', 'hi-IN', 'सॉफ्टवेयर इंजीनियर'),
    ('JOB', 'MK_MAN', 'job_title', 'hi-IN', 'विपणन निदेशक'),
    ('JOB', 'MK_REP', 'job_title', 'hi-IN', 'विपणन विशेषज्ञ'),
    ('JOB', 'PR_REP', 'job_title', 'hi-IN', 'संचार विशेषज्ञ'),
    ('JOB', 'PROD_MGR', 'job_title', 'hi-IN', 'उत्पाद प्रबंधक'),
    ('JOB', 'PU_CLERK', 'job_title', 'hi-IN', 'प्रोक्योरमेंट समन्वयक'),
    ('JOB', 'PU_MAN', 'job_title', 'hi-IN', 'प्रोक्योरमेंट निदेशक'),
    ('JOB', 'QA_ENG', 'job_title', 'hi-IN', 'गुणवत्ता इंजीनियर'),
    ('JOB', 'SA_MAN', 'job_title', 'hi-IN', 'क्षेत्रीय बिक्री निदेशक'),
    ('JOB', 'SA_REP', 'job_title', 'hi-IN', 'बिक्री प्रतिनिधि'),
    ('JOB', 'SALES_VP', 'job_title', 'hi-IN', 'मुख्य राजस्व अधिकारी'),
    ('JOB', 'SH_CLERK', 'job_title', 'hi-IN', 'लॉजिस्टिक्स समन्वयक'),
    ('JOB', 'ST_CLERK', 'job_title', 'hi-IN', 'ऑपरेशंस समन्वयक'),
    ('JOB', 'ST_MAN', 'job_title', 'hi-IN', 'कार्यस्थल संचालन निदेशक'),
    ('JOB', 'SUP_ENG', 'job_title', 'hi-IN', 'तकनीकी सहायता इंजीनियर'),
    ('JOB', 'TECH_VP', 'job_title', 'hi-IN', 'इंजीनियरिंग उपाध्यक्ष'),
    ('JOB', 'UX_DES', 'job_title', 'hi-IN', 'UX डिज़ाइनर');

INSERT INTO aihr_translations (entity_type, entity_key, field_name, locale_code, translated_value) VALUES
    ('LOCATION', '3600', 'city', 'es-MX', 'Ciudad de México'),
    ('LOCATION', '3600', 'state_province', 'es-MX', 'Ciudad de México'),
    ('DEPARTMENT', '350', 'department_name', 'es-MX', 'Ventas Regionales México'),
    ('ASSESSMENT_CYCLE', 'FY2024', 'label', 'es-MX', 'Evaluación anual FY2024'),
    ('ASSESSMENT_CYCLE', 'FY2025', 'label', 'es-MX', 'Evaluación anual FY2025'),
    ('ASSESSMENT_CYCLE', 'FY2026-H1', 'label', 'es-MX', 'Evaluación de mitad de año FY2026'),
    ('ASSESSMENT_CYCLE', 'FY2026-H2', 'label', 'es-MX', 'Evaluación de fin de año FY2026'),
    ('LOCATION', '3600', 'city', 'fr-FR', 'Mexico'),
    ('LOCATION', '3600', 'state_province', 'fr-FR', 'Ville de Mexico'),
    ('DEPARTMENT', '350', 'department_name', 'fr-FR', 'Ventes régionales Mexique'),
    ('ASSESSMENT_CYCLE', 'FY2024', 'label', 'fr-FR', 'Évaluation annuelle FY2024'),
    ('ASSESSMENT_CYCLE', 'FY2025', 'label', 'fr-FR', 'Évaluation annuelle FY2025'),
    ('ASSESSMENT_CYCLE', 'FY2026-H1', 'label', 'fr-FR', 'Évaluation semestrielle FY2026'),
    ('ASSESSMENT_CYCLE', 'FY2026-H2', 'label', 'fr-FR', 'Évaluation de fin d''année FY2026'),
    ('LOCATION', '3600', 'city', 'hi-IN', 'मेक्सिको सिटी'),
    ('LOCATION', '3600', 'state_province', 'hi-IN', 'मेक्सिको सिटी'),
    ('DEPARTMENT', '350', 'department_name', 'hi-IN', 'मेक्सिको क्षेत्रीय बिक्री'),
    ('ASSESSMENT_CYCLE', 'FY2024', 'label', 'hi-IN', 'FY2024 वार्षिक आकलन'),
    ('ASSESSMENT_CYCLE', 'FY2025', 'label', 'hi-IN', 'FY2025 वार्षिक आकलन'),
    ('ASSESSMENT_CYCLE', 'FY2026-H1', 'label', 'hi-IN', 'FY2026 मध्य-वर्ष आकलन'),
    ('ASSESSMENT_CYCLE', 'FY2026-H2', 'label', 'hi-IN', 'FY2026 वर्षांत आकलन');

INSERT INTO aihr_pay_grades (pay_grade_id, grade_code, grade_name, min_salary, max_salary, currency_code, display_order, description, is_active) VALUES
    (1, 'PG1', 'Entry Support', 2000.00, 3999.99, 'USD', 1, 'Entry-level support and clerical roles used in Vertex Software training exercises.', 1),
    (2, 'PG2', 'Associate Professional', 4000.00, 6999.99, 'USD', 2, 'Associate-level individual contributor roles.', 1),
    (3, 'PG3', 'Senior Professional', 7000.00, 9999.99, 'USD', 3, 'Senior individual contributor roles across product, finance, and customer operations.', 1),
    (4, 'PG4', 'Manager', 10000.00, 14999.99, 'USD', 4, 'Managerial pay band for department and line managers.', 1),
    (5, 'PG5', 'Senior Manager', 15000.00, 24999.99, 'USD', 5, 'Senior manager and vice president pay band.', 1),
    (6, 'PGX', 'Archived Legacy Grade', 25000.00, 40000.00, 'USD', 99, 'Inactive sample grade retained for filtering and data-quality exercises.', 0);

INSERT INTO aihr_employees (
    employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary,
    commission_pct, manager_id, department_id, employment_status, employment_type, contract_end_date, deleted_at
) VALUES
    (100, 'Steven', 'King', 'steven.king@vertexsoftware.example', '1.425.555.0100', DATE '2013-06-17', 'AD_PRES', 26000.00, NULL, NULL, 90, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (101, 'Alicia', 'Rowan', 'alicia.rowan@vertexsoftware.example', '1.425.555.0101', DATE '2014-09-12', 'AD_VP', 21800.00, NULL, 100, 10, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (102, 'Marcus', 'Vale', 'marcus.vale@vertexsoftware.example', '1.425.555.0102', DATE '2014-11-03', 'TECH_VP', 20600.00, NULL, 100, 60, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (103, 'Dominic', 'Hale', 'dominic.hale@vertexsoftware.example', '1.425.555.0103', DATE '2015-03-09', 'SALES_VP', 19100.00, 0.25, 100, 80, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (104, 'Helena', 'Mercer', 'helena.mercer@vertexsoftware.example', '1.512.555.0104', DATE '2015-05-18', 'DIR_ENG', 17600.00, NULL, 102, 60, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (105, 'Victor', 'Lang', 'victor.lang@vertexsoftware.example', '1.425.555.0105', DATE '2014-07-21', 'FI_MGR', 14900.00, NULL, 101, 100, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (106, 'Nisha', 'Banerjee', 'nisha.banerjee@vertexsoftware.example', '1.425.555.0106', DATE '2015-02-02', 'HR_DIR', 14600.00, NULL, 101, 40, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (107, 'Petra', 'Novak', 'petra.novak@vertexsoftware.example', '1.646.555.0107', DATE '2016-01-19', 'SA_MAN', 15200.00, 0.18, 103, 80, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (108, 'Briar', 'Coleman', 'briar.coleman@vertexsoftware.example', '1.206.555.0108', DATE '2015-09-14', 'ST_MAN', 11200.00, NULL, 101, 50, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (109, 'Tomas', 'Ionescu', 'tomas.ionescu@vertexsoftware.example', '1.425.555.0109', DATE '2015-12-07', 'PU_MAN', 11800.00, NULL, 101, 30, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (110, 'Rohan', 'Bedi', 'rohan.bedi@vertexsoftware.example', '1.206.555.0110', DATE '2017-01-09', 'ENG_MGR', 12100.00, NULL, 104, 230, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (111, 'Asha', 'Menon', 'asha.menon@vertexsoftware.example', '91.80.555.0111', DATE '2017-03-13', 'ENG_MGR', 9700.00, NULL, 104, 280, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (112, 'Kiran', 'Bhatia', 'kiran.bhatia@vertexsoftware.example', '91.22.555.0112', DATE '2017-05-08', 'ENG_MGR', 9500.00, NULL, 104, 290, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (113, 'Dev', 'Malhotra', 'dev.malhotra@vertexsoftware.example', '91.124.555.0113', DATE '2017-08-14', 'ENG_MGR', 9600.00, NULL, 104, 300, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (114, 'Saanvi', 'Kulkarni', 'saanvi.kulkarni@vertexsoftware.example', '91.80.555.0114', DATE '2018-01-22', 'ENG_MGR', 9100.00, NULL, 104, 210, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (115, 'Farhan', 'Qureshi', 'farhan.qureshi@vertexsoftware.example', '91.22.555.0115', DATE '2018-03-19', 'ENG_MGR', 9200.00, NULL, 104, 220, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (116, 'Lukas', 'Reinhardt', 'lukas.reinhardt@vertexsoftware.example', '44.20.555.0116', DATE '2016-06-06', 'SA_MAN', 12800.00, 0.20, 103, 240, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (117, 'Chiara', 'Bellini', 'chiara.bellini@vertexsoftware.example', '31.10.555.0117', DATE '2017-04-17', 'CS_MGR', 10400.00, NULL, 103, 250, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (118, 'Mireille', 'Dubois', 'mireille.dubois@vertexsoftware.example', '49.30.555.0118', DATE '2017-09-11', 'ENG_MGR', 11700.00, NULL, 104, 310, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (119, 'Soren', 'Veldt', 'soren.veldt@vertexsoftware.example', '353.1.555.0119', DATE '2018-02-12', 'CS_MGR', 10200.00, NULL, 103, 320, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (120, 'Amelie', 'Laurent', 'amelie.laurent@vertexsoftware.example', '33.1.555.0120', DATE '2017-11-13', 'MK_MAN', 13800.00, NULL, 122, 330, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (121, 'Elise', 'Mertens', 'elise.mertens@vertexsoftware.example', '31.10.555.0121', DATE '2018-01-08', 'ENG_MGR', 11500.00, NULL, 104, 340, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (122, 'Camille', 'Porter', 'camille.porter@vertexsoftware.example', '1.425.555.0122', DATE '2016-10-10', 'MK_MAN', 13600.00, NULL, 101, 20, 'ACTIVE', 'FULL_TIME', NULL, NULL),
    (123, 'Malcolm', 'Ritter', 'malcolm.ritter@vertexsoftware.example', '1.425.555.0123', DATE '2016-08-29', 'AC_MGR', 13100.00, NULL, 105, 110, 'ACTIVE', 'FULL_TIME', NULL, NULL);

INSERT INTO aihr_employees (
    employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary,
    commission_pct, manager_id, department_id, employment_status, employment_type, contract_end_date, deleted_at
) VALUES
    (229, 'Valeria', 'Cruz', 'valeria.cruz@vertexsoftware.example', '52.55.555.0229', DATE '2019-05-06', 'HR_REP', 7800.00, NULL, 106, 260, 'ACTIVE', 'FULL_TIME', NULL, NULL);

WITH first_names AS (
    SELECT ord::int AS idx, first_name
    FROM unnest(ARRAY[
        'Harper','Nolan','Quinn','Jocelyn','Xavier','Talia','Everett','Maren','Wesley','Sabrina','Griffin','Dahlia',
        'Bennett','Celeste','Julian','Teagan','Reid','Mallory','Gideon','Piper','Kellan','Noelle','Desmond','Eliza',
        'Ronan','Keira','Thane','Autumn','Brendan','Esme','Colton','Marisol','Adrian','Selene','Jonah','Micah'
    ]::text[]) WITH ORDINALITY AS t(first_name, ord)
),
last_names AS (
    SELECT ord::int AS idx, last_name
    FROM unnest(ARRAY[
        'Whitaker','Donnelly','Prescott','Halvorsen','Kerrigan','Bramwell','Hollis','Trenton','Winslow','Carver','Lockridge','Finnegan',
        'Ashford','Pritchard','Callahan','Maddox','Ellison','Kincaid','Thornton','Beauregard','Harrow','Langston','Ridley','Blackwell',
        'Telford','Merrick','Chastain','Norwood','Galloway','Corbett','Valerian','Rawlins','Cormier','Dempsey','Fairchild','Lennox'
    ]::text[]) WITH ORDINALITY AS t(last_name, ord)
)
INSERT INTO aihr_employees (
    employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary,
    commission_pct, manager_id, department_id, employment_status, employment_type, contract_end_date, deleted_at
)
SELECT
    123 + idx AS employee_id,
    first_name,
    last_name,
    lower(first_name || '.' || last_name || '@vertexsoftware.example'),
    '1.206.555.' || lpad((123 + idx)::text, 4, '0'),
    DATE '2017-01-15' + ((idx - 1) * 31),
    CASE
        WHEN 123 + idx BETWEEN 124 AND 129 THEN 'IT_PROG'
        WHEN 123 + idx BETWEEN 130 AND 132 THEN 'QA_ENG'
        WHEN 123 + idx BETWEEN 133 AND 134 THEN 'DEVOPS'
        WHEN 123 + idx = 135 THEN 'PROD_MGR'
        WHEN 123 + idx = 136 THEN 'UX_DES'
        WHEN 123 + idx BETWEEN 137 AND 139 THEN 'HR_REP'
        WHEN 123 + idx BETWEEN 140 AND 142 THEN 'FI_ACCOUNT'
        WHEN 123 + idx BETWEEN 143 AND 144 THEN 'AC_ACCOUNT'
        WHEN 123 + idx BETWEEN 145 AND 146 THEN 'MK_REP'
        WHEN 123 + idx BETWEEN 147 AND 148 THEN 'PU_CLERK'
        WHEN 123 + idx BETWEEN 149 AND 150 THEN 'ST_CLERK'
        WHEN 123 + idx = 151 THEN 'SH_CLERK'
        WHEN 123 + idx BETWEEN 152 AND 153 THEN 'SUP_ENG'
        WHEN 123 + idx BETWEEN 154 AND 156 THEN 'SA_REP'
        WHEN 123 + idx = 157 THEN 'PR_REP'
        WHEN 123 + idx = 158 THEN 'AD_ASST'
        ELSE 'FI_ACCOUNT'
    END,
    CASE
        WHEN 123 + idx BETWEEN 124 AND 129 THEN 9800 - ((123 + idx - 124) * 600)
        WHEN 123 + idx BETWEEN 130 AND 132 THEN 8300 - ((123 + idx - 130) * 400)
        WHEN 123 + idx BETWEEN 133 AND 134 THEN 9200 - ((123 + idx - 133) * 600)
        WHEN 123 + idx = 135 THEN 11900
        WHEN 123 + idx = 136 THEN 8800
        WHEN 123 + idx BETWEEN 137 AND 139 THEN 8400 - ((123 + idx - 137) * 600)
        WHEN 123 + idx BETWEEN 140 AND 142 THEN 8900 - ((123 + idx - 140) * 600)
        WHEN 123 + idx BETWEEN 143 AND 144 THEN 8200 - ((123 + idx - 143) * 600)
        WHEN 123 + idx BETWEEN 145 AND 146 THEN 7800 - ((123 + idx - 145) * 600)
        WHEN 123 + idx BETWEEN 147 AND 148 THEN 5200 - ((123 + idx - 147) * 600)
        WHEN 123 + idx BETWEEN 149 AND 150 THEN 4300 - ((123 + idx - 149) * 400)
        WHEN 123 + idx = 151 THEN 3500
        WHEN 123 + idx BETWEEN 152 AND 153 THEN 7800 - ((123 + idx - 152) * 600)
        WHEN 123 + idx BETWEEN 154 AND 156 THEN 9800 - ((123 + idx - 154) * 600)
        WHEN 123 + idx = 157 THEN 8300
        WHEN 123 + idx = 158 THEN 5600
        ELSE 9100
    END,
    CASE WHEN 123 + idx BETWEEN 154 AND 156 THEN 0.12 ELSE NULL END,
    CASE
        WHEN 123 + idx BETWEEN 124 AND 132 THEN 104
        WHEN 123 + idx BETWEEN 133 AND 134 THEN 110
        WHEN 123 + idx = 135 THEN 104
        WHEN 123 + idx = 136 THEN 135
        WHEN 123 + idx BETWEEN 137 AND 139 THEN 106
        WHEN 123 + idx BETWEEN 140 AND 142 THEN 105
        WHEN 123 + idx BETWEEN 143 AND 144 THEN 123
        WHEN 123 + idx BETWEEN 145 AND 146 THEN 122
        WHEN 123 + idx BETWEEN 147 AND 148 THEN 109
        WHEN 123 + idx BETWEEN 149 AND 151 THEN 108
        WHEN 123 + idx BETWEEN 152 AND 153 THEN 110
        WHEN 123 + idx BETWEEN 154 AND 156 THEN 107
        WHEN 123 + idx = 157 THEN 120
        WHEN 123 + idx = 158 THEN 101
        ELSE 105
    END,
    CASE
        WHEN 123 + idx BETWEEN 124 AND 132 THEN 60
        WHEN 123 + idx BETWEEN 133 AND 134 THEN 230
        WHEN 123 + idx = 135 THEN 60
        WHEN 123 + idx = 136 THEN 60
        WHEN 123 + idx BETWEEN 137 AND 139 THEN 40
        WHEN 123 + idx BETWEEN 140 AND 142 THEN 100
        WHEN 123 + idx BETWEEN 143 AND 144 THEN 110
        WHEN 123 + idx BETWEEN 145 AND 146 THEN 20
        WHEN 123 + idx BETWEEN 147 AND 148 THEN 30
        WHEN 123 + idx BETWEEN 149 AND 151 THEN 50
        WHEN 123 + idx BETWEEN 152 AND 153 THEN 230
        WHEN 123 + idx BETWEEN 154 AND 156 THEN 80
        WHEN 123 + idx = 157 THEN 70
        WHEN 123 + idx = 158 THEN 10
        ELSE 120
    END,
    'ACTIVE',
    'FULL_TIME',
    NULL,
    NULL
FROM first_names
JOIN last_names USING (idx);

WITH first_names AS (
    SELECT ord::int AS idx, first_name
    FROM unnest(ARRAY[
        'Anika','Varun','Ishita','Karthik','Lavanya','Mohan','Pooja','Siddharth','Tanvi','Yash',
        'Divya','Nitin','Bhavna','Harish','Jaya','Lokesh','Mitali','Naveen','Ojas','Pallavi',
        'Ritesh','Sneha','Tarun','Urvi','Vivek','Yamini','Zubin','Charvi','Dhruv','Ekta'
    ]::text[]) WITH ORDINALITY AS t(first_name, ord)
),
last_names AS (
    SELECT ord::int AS idx, last_name
    FROM unnest(ARRAY[
        'Chatterjee','Deshpande','Gokhale','Jain','Khanna','Lal','Mukherjee','Narayanan','Oberoi','Pandey',
        'Rathod','Sethi','Talwar','Upadhyay','Wagh','Yadav','Zaveri','Chakraborty','Dutta','Goswami',
        'Hiremath','Indurkar','Jindal','Kamat','Luthra','Mahajan','Narvekar','Oswal','Pradhan','Rastogi'
    ]::text[]) WITH ORDINALITY AS t(last_name, ord)
)
INSERT INTO aihr_employees (
    employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary,
    commission_pct, manager_id, department_id, employment_status, employment_type, contract_end_date, deleted_at
)
SELECT
    159 + idx AS employee_id,
    first_name,
    last_name,
    lower(first_name || '.' || last_name || '@vertexsoftware.example'),
    CASE
        WHEN 159 + idx BETWEEN 160 AND 169 THEN '91.80.555.' || lpad((159 + idx)::text, 4, '0')
        WHEN 159 + idx BETWEEN 170 AND 177 THEN '91.22.555.' || lpad((159 + idx)::text, 4, '0')
        WHEN 159 + idx BETWEEN 178 AND 183 THEN '91.124.555.' || lpad((159 + idx)::text, 4, '0')
        WHEN 159 + idx BETWEEN 184 AND 186 THEN '91.80.555.' || lpad((159 + idx)::text, 4, '0')
        ELSE '91.22.555.' || lpad((159 + idx)::text, 4, '0')
    END,
    DATE '2018-02-01' + ((idx - 1) * 28),
    CASE
        WHEN 159 + idx BETWEEN 160 AND 168 THEN 'IT_PROG'
        WHEN 159 + idx = 169 THEN 'PROD_MGR'
        WHEN 159 + idx = 170 THEN 'UX_DES'
        WHEN 159 + idx BETWEEN 171 AND 177 THEN 'QA_ENG'
        WHEN 159 + idx BETWEEN 178 AND 183 THEN 'DEVOPS'
        WHEN 159 + idx BETWEEN 184 AND 186 THEN 'SUP_ENG'
        ELSE 'DEVOPS'
    END,
    CASE
        WHEN 159 + idx BETWEEN 160 AND 168 THEN 9000 - ((159 + idx - 160) * 400)
        WHEN 159 + idx = 169 THEN 8800
        WHEN 159 + idx = 170 THEN 6200
        WHEN 159 + idx BETWEEN 171 AND 177 THEN 7800 - ((159 + idx - 171) * 350)
        WHEN 159 + idx BETWEEN 178 AND 183 THEN 8600 - ((159 + idx - 178) * 450)
        WHEN 159 + idx BETWEEN 184 AND 186 THEN 7200 - ((159 + idx - 184) * 500)
        ELSE 7900 - ((159 + idx - 187) * 500)
    END,
    NULL,
    CASE
        WHEN 159 + idx BETWEEN 160 AND 169 THEN 111
        WHEN 159 + idx = 170 THEN 169
        WHEN 159 + idx BETWEEN 171 AND 177 THEN 112
        WHEN 159 + idx BETWEEN 178 AND 183 THEN 113
        WHEN 159 + idx BETWEEN 184 AND 186 THEN 114
        ELSE 115
    END,
    CASE
        WHEN 159 + idx BETWEEN 160 AND 170 THEN 280
        WHEN 159 + idx BETWEEN 171 AND 177 THEN 290
        WHEN 159 + idx BETWEEN 178 AND 183 THEN 300
        WHEN 159 + idx BETWEEN 184 AND 186 THEN 210
        ELSE 220
    END,
    'ACTIVE',
    'FULL_TIME',
    NULL,
    NULL
FROM first_names
JOIN last_names USING (idx);

WITH first_names AS (
    SELECT ord::int AS idx, first_name
    FROM unnest(ARRAY[
        'Astrid','Benoit','Celine','Dario','Elodie','Frederik','Greta','Hugo','Ilse','Jasper',
        'Klara','Levente','Matilde','Nikolai','Oona','Pascale','Quentin','Rhea','Saskia','Thierry',
        'Una','Viktor','Wilma','Yann','Zofia','Alina','Bastien','Cosima','Dragan','Eira'
    ]::text[]) WITH ORDINALITY AS t(first_name, ord)
),
last_names AS (
    SELECT ord::int AS idx, last_name
    FROM unnest(ARRAY[
        'Adler','Bouchard','Cerny','Dimitrov','Estevez','Falkenberg','Gruber','Horvat','Ivankovic','Jorgensen',
        'Kowalska','Lindholm','Moreau','Novakova','Olofsson','Petrescu','Quist','Rinaldi','Schneider','Tedesco',
        'Urena','Varga','Wojcik','Xydas','Zelenka','Aubert','Bergstrom','Conti','Dalmasso','Eriksen'
    ]::text[]) WITH ORDINALITY AS t(last_name, ord)
)
INSERT INTO aihr_employees (
    employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary,
    commission_pct, manager_id, department_id, employment_status, employment_type, contract_end_date, deleted_at
)
SELECT
    189 + idx AS employee_id,
    first_name,
    last_name,
    lower(first_name || '.' || last_name || '@vertexsoftware.example'),
    CASE
        WHEN 189 + idx BETWEEN 190 AND 196 THEN '44.20.555.' || lpad((189 + idx)::text, 4, '0')
        WHEN 189 + idx BETWEEN 197 AND 202 THEN '31.10.555.' || lpad((189 + idx)::text, 4, '0')
        WHEN 189 + idx BETWEEN 203 AND 208 THEN '49.30.555.' || lpad((189 + idx)::text, 4, '0')
        WHEN 189 + idx BETWEEN 209 AND 214 THEN '353.1.555.' || lpad((189 + idx)::text, 4, '0')
        WHEN 189 + idx BETWEEN 215 AND 217 THEN '33.1.555.' || lpad((189 + idx)::text, 4, '0')
        ELSE '31.10.555.' || lpad((189 + idx)::text, 4, '0')
    END,
    DATE '2018-09-01' + ((idx - 1) * 26),
    CASE
        WHEN 189 + idx BETWEEN 190 AND 196 THEN 'SA_REP'
        WHEN 189 + idx BETWEEN 197 AND 202 THEN 'CS_SPEC'
        WHEN 189 + idx BETWEEN 203 AND 208 THEN 'SUP_ENG'
        WHEN 189 + idx BETWEEN 209 AND 214 THEN 'CS_SPEC'
        WHEN 189 + idx BETWEEN 215 AND 217 THEN 'MK_REP'
        ELSE 'IT_PROG'
    END,
    CASE
        WHEN 189 + idx BETWEEN 190 AND 196 THEN 9800 - ((189 + idx - 190) * 500)
        WHEN 189 + idx BETWEEN 197 AND 202 THEN 7200 - ((189 + idx - 197) * 300)
        WHEN 189 + idx BETWEEN 203 AND 208 THEN 8600 - ((189 + idx - 203) * 400)
        WHEN 189 + idx BETWEEN 209 AND 214 THEN 6900 - ((189 + idx - 209) * 300)
        WHEN 189 + idx BETWEEN 215 AND 217 THEN 7600 - ((189 + idx - 215) * 400)
        ELSE 9000 - ((189 + idx - 218) * 800)
    END,
    CASE WHEN 189 + idx BETWEEN 190 AND 196 THEN 0.10 ELSE NULL END,
    CASE
        WHEN 189 + idx BETWEEN 190 AND 196 THEN 116
        WHEN 189 + idx BETWEEN 197 AND 202 THEN 117
        WHEN 189 + idx BETWEEN 203 AND 208 THEN 118
        WHEN 189 + idx BETWEEN 209 AND 214 THEN 119
        WHEN 189 + idx BETWEEN 215 AND 217 THEN 120
        ELSE 121
    END,
    CASE
        WHEN 189 + idx BETWEEN 190 AND 196 THEN 240
        WHEN 189 + idx BETWEEN 197 AND 202 THEN 250
        WHEN 189 + idx BETWEEN 203 AND 208 THEN 310
        WHEN 189 + idx BETWEEN 209 AND 214 THEN 320
        WHEN 189 + idx BETWEEN 215 AND 217 THEN 330
        ELSE 340
    END,
    'ACTIVE',
    'FULL_TIME',
    NULL,
    NULL
FROM first_names
JOIN last_names USING (idx);

INSERT INTO aihr_job_history (employee_id, start_date, end_date, job_id, department_id) VALUES
    (104, DATE '2019-01-01', DATE '2023-12-31', 'ENG_MGR', 60),
    (106, DATE '2018-01-01', DATE '2022-12-31', 'HR_REP', 40),
    (111, DATE '2017-03-13', DATE '2023-12-31', 'IT_PROG', 280),
    (112, DATE '2017-05-08', DATE '2023-12-31', 'QA_ENG', 290),
    (113, DATE '2017-08-14', DATE '2023-12-31', 'DEVOPS', 300),
    (116, DATE '2018-01-01', DATE '2023-12-31', 'SA_REP', 240),
    (117, DATE '2019-01-01', DATE '2023-12-31', 'CS_SPEC', 250),
    (118, DATE '2018-01-01', DATE '2024-12-31', 'SUP_ENG', 310),
    (120, DATE '2019-01-01', DATE '2024-12-31', 'MK_REP', 330),
    (121, DATE '2019-01-01', DATE '2024-12-31', 'IT_PROG', 340),
    (135, DATE '2020-01-01', DATE '2024-12-31', 'IT_PROG', 60),
    (169, DATE '2021-01-01', DATE '2024-12-31', 'IT_PROG', 280);

UPDATE aihr_departments
SET manager_id = CASE department_id
    WHEN 10 THEN 101
    WHEN 20 THEN 122
    WHEN 30 THEN 109
    WHEN 40 THEN 106
    WHEN 50 THEN 108
    WHEN 60 THEN 104
    WHEN 70 THEN 122
    WHEN 80 THEN 103
    WHEN 90 THEN 100
    WHEN 100 THEN 105
    WHEN 110 THEN 123
    WHEN 120 THEN 105
    WHEN 160 THEN 106
    WHEN 200 THEN 101
    WHEN 210 THEN 114
    WHEN 220 THEN 115
    WHEN 230 THEN 110
    WHEN 240 THEN 116
    WHEN 250 THEN 117
    WHEN 260 THEN 106
    WHEN 270 THEN 106
    WHEN 280 THEN 111
    WHEN 290 THEN 112
    WHEN 300 THEN 113
    WHEN 310 THEN 118
    WHEN 320 THEN 119
    WHEN 330 THEN 120
    WHEN 340 THEN 121
    ELSE manager_id
END;

UPDATE aihr_departments
SET parent_department_id = CASE department_id
    WHEN 10 THEN 90
    WHEN 20 THEN NULL
    WHEN 30 THEN 200
    WHEN 40 THEN NULL
    WHEN 50 THEN 200
    WHEN 60 THEN NULL
    WHEN 70 THEN 20
    WHEN 80 THEN NULL
    WHEN 100 THEN NULL
    WHEN 110 THEN 100
    WHEN 120 THEN 100
    WHEN 130 THEN NULL
    WHEN 140 THEN 130
    WHEN 150 THEN 100
    WHEN 160 THEN 40
    WHEN 170 THEN 200
    WHEN 200 THEN NULL
    WHEN 210 THEN 60
    WHEN 220 THEN 60
    WHEN 230 THEN 60
    WHEN 240 THEN 80
    WHEN 250 THEN 80
    WHEN 260 THEN 40
    WHEN 270 THEN 40
    WHEN 280 THEN 60
    WHEN 290 THEN 60
    WHEN 300 THEN 60
    WHEN 310 THEN 80
    WHEN 320 THEN 80
    WHEN 330 THEN 20
    WHEN 340 THEN 60
    ELSE parent_department_id
END;

UPDATE aihr_employees SET employment_status = 'PROBATION' WHERE employee_id IN (158, 171, 186, 197, 209, 215);
UPDATE aihr_employees SET employment_status = 'ON_LEAVE' WHERE employee_id IN (141, 182);
UPDATE aihr_employees SET employment_type = 'CONTRACT', contract_end_date = DATE '2026-09-30' WHERE employee_id = 143;
UPDATE aihr_employees SET employment_type = 'CONTRACT', contract_end_date = DATE '2026-12-31' WHERE employee_id = 177;
UPDATE aihr_employees SET employment_type = 'CONTRACT', contract_end_date = DATE '2026-11-30' WHERE employee_id = 206;
UPDATE aihr_employees SET employment_type = 'CONTRACT', contract_end_date = DATE '2026-10-31' WHERE employee_id = 218;
UPDATE aihr_employees SET employment_type = 'PART_TIME' WHERE employee_id IN (154, 215);
UPDATE aihr_employees SET employment_type = 'INTERN', contract_end_date = DATE '2026-08-31' WHERE employee_id = 158;
UPDATE aihr_employees SET employment_type = 'INTERN', contract_end_date = DATE '2026-07-31' WHERE employee_id = 171;
UPDATE aihr_employees SET employment_status = 'TERMINATED', deleted_at = TIMESTAMP '2025-11-15 00:00:00' WHERE employee_id = 149;
UPDATE aihr_employees SET employment_status = 'TERMINATED', deleted_at = TIMESTAMP '2025-12-20 00:00:00' WHERE employee_id = 174;
UPDATE aihr_employees SET employment_status = 'TERMINATED', deleted_at = TIMESTAMP '2026-01-10 00:00:00' WHERE employee_id = 188;
UPDATE aihr_employees SET employment_status = 'TERMINATED', deleted_at = TIMESTAMP '2026-02-05 00:00:00' WHERE employee_id = 203;
UPDATE aihr_employees SET employment_status = 'TERMINATED', deleted_at = TIMESTAMP '2026-03-01 00:00:00' WHERE employee_id = 219;

INSERT INTO aihr_roles (role_id, role_name, description) VALUES
    (1, 'ROLE_ADMIN', 'Vertex Software platform administrator'),
    (2, 'ROLE_HR_SPECIALIST', 'People Team specialist'),
    (3, 'ROLE_MANAGER', 'Manager with team oversight privileges'),
    (4, 'ROLE_EMPLOYEE', 'Standard employee access');

WITH user_seed (user_id, employee_id) AS (
    VALUES
        (1, 100), (2, 101), (3, 102), (4, 103), (5, 104),
        (6, 105), (7, 106), (8, 107), (9, 108), (10, 109),
        (11, 110), (12, 111), (13, 112), (14, 113), (15, 114),
        (16, 115), (17, 116), (18, 117), (19, 118), (20, 119),
        (21, 120), (22, 121), (23, 122), (24, 123), (25, 190), (26, 229)
)
INSERT INTO aihr_users (user_id, employee_id, username, password_hash, is_active, last_login)
SELECT
    u.user_id,
    u.employee_id,
    lower(e.first_name || '.' || e.last_name),
    '$2a$12$AqPuyxrJ66LJDNnFfKSqXuE7Y48E4JZgfPy99/lojD/sMWjTi/tEO',
    1,
    TIMESTAMP '2026-03-25 08:15:00' + ((u.user_id - 1) * INTERVAL '10 minutes')
FROM user_seed u
JOIN aihr_employees e ON e.employee_id = u.employee_id;

INSERT INTO aihr_user_roles (user_id, role_id) VALUES (1, 1);

INSERT INTO aihr_user_roles (user_id, role_id)
SELECT user_id, 2
FROM aihr_users
WHERE employee_id IN (101, 106, 229);

INSERT INTO aihr_user_roles (user_id, role_id)
SELECT u.user_id, 3
FROM aihr_users u
JOIN aihr_employees e ON e.employee_id = u.employee_id
WHERE e.job_id IN ('AD_PRES', 'AD_VP', 'SALES_VP', 'TECH_VP', 'DIR_ENG', 'ENG_MGR', 'HR_DIR', 'FI_MGR', 'MK_MAN', 'PU_MAN', 'ST_MAN', 'SA_MAN', 'CS_MGR', 'AC_MGR', 'PROD_MGR');

INSERT INTO aihr_user_roles (user_id, role_id)
SELECT user_id, 4
FROM aihr_users
WHERE is_active = 1;

DELETE FROM aihr_employee_assessments
WHERE (employee_id, cycle_code) IN (
    (100, 'FY2024'),
    (100, 'FY2025'),
    (100, 'FY2026-H1'),
    (101, 'FY2026-H1'),
    (102, 'FY2026-H1'),
    (103, 'FY2026-H2'),
    (104, 'FY2026-H1'),
    (108, 'FY2026-H1'),
    (110, 'FY2026-H1'),
    (190, 'FY2025'),
    (229, 'FY2024'),
    (229, 'FY2025'),
    (229, 'FY2026-H1')
);

INSERT INTO aihr_employee_assessments (
    employee_id,
    cycle_code,
    review_status,
    goal_completion_pct,
    competency_score,
    manager_feedback,
    employee_reflection,
    next_cycle_plan,
    reviewer_user_id,
    submitted_at
)
SELECT
    seed.employee_id,
    seed.cycle_code,
    seed.review_status,
    seed.goal_completion_pct,
    seed.competency_score,
    seed.manager_feedback,
    seed.employee_reflection,
    seed.next_cycle_plan,
    reviewer.user_id,
    seed.submitted_at
FROM (
    VALUES
        (100, 'FY2024', 'FINAL', 93.00::numeric, 4.60::numeric,
            'Strengthened executive planning cadence and improved leadership coverage for critical programs.',
            'Wants earlier signals for leadership-capacity gaps and more structured succession checkpoints.',
            'Expand bench-planning reviews and formalize executive talent risk reporting.',
            101, TIMESTAMP '2024-12-18 11:00:00'),
        (100, 'FY2025', 'FINAL', 96.00::numeric, 4.80::numeric,
            'Drove cross-region operating discipline, improved executive reporting cadence, and kept executive hiring plans aligned.',
            'Wants stronger delegation support and more predictive metrics on hiring demand.',
            'Expand succession planning coverage and formalize quarterly talent reviews for executive leaders.',
            101, TIMESTAMP '2025-12-20 10:30:00'),
        (100, 'FY2026-H1', 'SUBMITTED', 89.00::numeric, 4.20::numeric,
            'Leadership planning remained steady, with stronger alignment between staffing priorities and business milestones.',
            'Would like clearer ownership on cross-functional actions and faster visibility into bottlenecks.',
            'Improve executive dashboard quality, tighten action follow-through, and reduce manual review overhead.',
            101, TIMESTAMP '2026-04-08 15:10:00'),
        (101, 'FY2026-H1', 'SUBMITTED', 88.50::numeric, 4.25::numeric,
            'Strong leadership across enterprise operations with better follow-through on cross-functional staffing plans.',
            'Asked for clearer prioritization between recruiting support and business process work.',
            'Improve executive dashboard automation and tighten review-loop handoffs with HR specialists.',
            100, TIMESTAMP '2026-03-15 14:15:00'),
        (102, 'FY2026-H1', 'SUBMITTED', 87.00::numeric, 4.10::numeric,
            'Provided steadier engineering leadership coverage and improved cross-team planning with downstream managers.',
            'Wants clearer staffing visibility for deeper engineering teams and faster escalation loops for hiring blockers.',
            'Tighten manager operating cadence, improve review readiness, and reduce manual status chasing across the engineering tree.',
            100, TIMESTAMP '2026-04-06 10:45:00'),
        (103, 'FY2026-H2', 'DRAFT', 79.00::numeric, 3.90::numeric,
            NULL,
            'Wants more time reserved for mentoring newer leads and documenting architecture decisions.',
            'Raise release-readiness transparency and convert manual engineering review checkpoints into repeatable workflows.',
            100, NULL::timestamp),
        (104, 'FY2026-H1', 'SUBMITTED', 85.00::numeric, 4.05::numeric,
            'Engineering delivery became more predictable and the manager cascade is now better aligned on release priorities.',
            'Would like earlier signals on resource risk and less fragmented follow-up for team reviews.',
            'Expand engineering review discipline, improve staffing risk flags, and standardize manager check-ins before cycle close.',
            102, TIMESTAMP '2026-04-05 11:25:00'),
        (108, 'FY2026-H1', 'SUBMITTED', 84.00::numeric, 4.10::numeric,
            'Operational planning has become more predictable and partner handoffs are cleaner across the quarter.',
            'Would like faster staffing visibility for open requests and clearer ownership on escalations.',
            'Tighten workflow SLAs, reduce manual follow-up, and improve staffing dashboards.',
            101, TIMESTAMP '2026-04-04 09:40:00'),
        (110, 'FY2026-H1', 'DRAFT', 81.00::numeric, 3.95::numeric,
            NULL,
            'Needs more room for mentoring senior engineers while still keeping delivery commitments on track.',
            'Improve sprint-level planning visibility, tighten architecture review checkpoints, and reduce context switching across squads.',
            102, NULL::timestamp),
        (190, 'FY2025', 'FINAL', 92.00::numeric, 4.55::numeric,
            'Strong regional execution with disciplined forecasting and consistent stakeholder communication.',
            'Wants a tighter connection between pipeline reporting and downstream hiring plans.',
            'Increase forecast transparency, improve territory handoffs, and formalize regional coaching reviews.',
            100, TIMESTAMP '2025-12-18 16:20:00'),
        (229, 'FY2024', 'FINAL', 90.00::numeric, 4.35::numeric,
            'Mantuvo una ejecución consistente en la región y mejoró la coordinación con ventas y operaciones.',
            'Quiere más visibilidad temprana sobre cambios de prioridades comerciales.',
            'Reforzar la planeación de territorio y estandarizar revisiones trimestrales con líderes regionales.',
            101, TIMESTAMP '2024-12-16 13:45:00'),
        (229, 'FY2025', 'FINAL', 94.00::numeric, 4.55::numeric,
            'Elevó la calidad del seguimiento comercial y mejoró la colaboración entre equipos regionales.',
            'Busca acelerar la alineación entre programas compartidos y necesidades locales.',
            'Profundizar el uso de contenido reutilizable, mejorar el seguimiento de cuentas y fortalecer la coordinación regional.',
            101, TIMESTAMP '2025-12-19 09:20:00'),
        (229, 'FY2026-H1', 'SUBMITTED', 86.00::numeric, 4.15::numeric,
            'Mostró mejor disciplina operativa y una comunicación más clara con equipos asociados.',
            'Quiere mayor anticipación sobre cambios de territorio y mejor coordinación con los programas compartidos de enablement.',
            'Fortalecer la planeación de cuentas, reutilizar más contenido multilingüe y mejorar el seguimiento con equipos asociados.',
            101, TIMESTAMP '2026-04-10 12:05:00')
) AS seed (
    employee_id,
    cycle_code,
    review_status,
    goal_completion_pct,
    competency_score,
    manager_feedback,
    employee_reflection,
    next_cycle_plan,
    reviewer_employee_id,
    submitted_at
)
JOIN aihr_users reviewer
    ON reviewer.employee_id = seed.reviewer_employee_id;

INSERT INTO aihr_user_preferences (user_id, language_code, timezone, date_format, currency_code, number_format)
SELECT
    u.user_id,
    CASE
        WHEN l.country_id = 'MX' THEN 'es-MX'
        WHEN l.country_id = 'FR' THEN 'fr-FR'
        WHEN l.country_id = 'IN' THEN 'hi-IN'
        ELSE 'en-US'
    END,
    CASE
        WHEN l.country_id = 'MX' THEN 'America/Mexico_City'
        WHEN l.country_id = 'IN' THEN 'Asia/Kolkata'
        WHEN l.country_id = 'GB' THEN 'Europe/London'
        WHEN l.country_id = 'DE' THEN 'Europe/Berlin'
        WHEN l.country_id = 'NL' THEN 'Europe/Amsterdam'
        WHEN l.country_id = 'FR' THEN 'Europe/Paris'
        WHEN l.country_id = 'IE' THEN 'Europe/Dublin'
        ELSE 'America/Los_Angeles'
    END,
    CASE
        WHEN l.country_id IN ('US', 'CA') THEN 'MM/DD/YYYY'
        WHEN l.country_id IN ('DE', 'NL') THEN 'DD.MM.YYYY'
        ELSE 'DD/MM/YYYY'
    END,
    CASE
        WHEN l.country_id = 'MX' THEN 'MXN'
        WHEN l.country_id = 'IN' THEN 'INR'
        WHEN l.country_id = 'GB' THEN 'GBP'
        WHEN l.country_id IN ('DE', 'NL', 'FR', 'IE', 'IT', 'ES', 'CH', 'DK', 'BE') THEN 'EUR'
        ELSE 'USD'
    END,
    CASE
        WHEN l.country_id = 'IN' THEN '1,00,000.00'
        WHEN l.country_id IN ('DE', 'NL') THEN '1.000,00'
        WHEN l.country_id = 'FR' THEN '1 000,00'
        ELSE '1,000.00'
    END
FROM aihr_users u
JOIN aihr_employees e ON e.employee_id = u.employee_id
JOIN aihr_departments d ON d.department_id = e.department_id
JOIN aihr_locations l ON l.location_id = d.location_id;

-- Keep the documented Mexico locale persona stable even though the employee sits
-- in the US-based Talent Acquisition department for reporting purposes.
UPDATE aihr_user_preferences preferences
SET language_code = 'es-MX',
    timezone = 'America/Mexico_City',
    date_format = 'DD/MM/YYYY',
    currency_code = 'MXN',
    number_format = '1,000.00'
FROM aihr_users users
WHERE preferences.user_id = users.user_id
  AND users.username = 'valeria.cruz';

WITH doc_seed (document_id, employee_id, suffix, document_category, file_slug, file_type, file_size_bytes, uploaded_by, uploaded_at) AS (
    VALUES
        (1, 100, 'Executive_Offer_Letter.pdf', 'Contract', 'executive_offer_letter.pdf', 'application/pdf', 212480, 2, DATE '2013-06-17'),
        (2, 104, 'Engineering_Leadership_Certification.pdf', 'Certificate', 'engineering_leadership_certification.pdf', 'application/pdf', 184320, 5, DATE '2022-06-15'),
        (3, 106, 'People_Ops_Playbook.pdf', 'Other', 'people_ops_playbook.pdf', 'application/pdf', 172032, 2, DATE '2023-03-12'),
        (4, 111, 'Product_Engineering_Strategy.pdf', 'Other', 'product_engineering_strategy.pdf', 'application/pdf', 153600, 5, DATE '2024-01-11'),
        (5, 113, 'Infrastructure_Automation_Certification.pdf', 'Certificate', 'infrastructure_automation_certification.pdf', 'application/pdf', 175104, 14, DATE '2022-09-20'),
        (6, 116, 'EMEA_Enterprise_Sales_Plan.pdf', 'Other', 'emea_enterprise_sales_plan.pdf', 'application/pdf', 188416, 4, DATE '2025-01-10'),
        (7, 118, 'Solutions_Engineering_Architecture_Review.pdf', 'Other', 'solutions_engineering_architecture_review.pdf', 'application/pdf', 196608, 5, DATE '2024-05-18'),
        (8, 120, 'Growth_Marketing_Launch_Calendar.pdf', 'Other', 'growth_marketing_launch_calendar.pdf', 'application/pdf', 165888, 23, DATE '2025-02-03'),
        (9, 121, 'Netherlands_Product_Engineering_Offer.pdf', 'Contract', 'netherlands_product_engineering_offer.pdf', 'application/pdf', 204800, 5, DATE '2018-01-08'),
        (10, 135, 'Product_Discovery_Workshop_Notes.pdf', 'Other', 'product_discovery_workshop_notes.pdf', 'application/pdf', 132096, 5, DATE '2025-03-04'),
        (11, 169, 'Lavanya_Khanna_Product_Rotation.pdf', 'Other', 'product_rotation.pdf', 'application/pdf', 144384, 12, DATE '2025-04-12'),
        (12, 190, 'Astrid_Adler_Emea_Sales_Contract.pdf', 'Contract', 'emea_sales_contract.pdf', 'application/pdf', 190464, 17, DATE '2018-09-01'),
        (13, 206, 'Quentin_Quist_Solution_Design_Portfolio.pdf', 'Certificate', 'solution_design_portfolio.pdf', 'application/pdf', 166912, 19, DATE '2023-07-14'),
        (14, 215, 'Alina_Aubert_Campaign_Brief.pdf', 'Other', 'campaign_brief.pdf', 'application/pdf', 118784, 21, DATE '2026-01-15'),
        (15, 218, 'Dragan_Dalmasso_Offer_Packet.pdf', 'Contract', 'offer_packet.pdf', 'application/pdf', 201728, 22, DATE '2025-11-20'),
        (16, 154, 'Keira_Merrick_Internship_Agreement.pdf', 'Contract', 'internship_agreement.pdf', 'application/pdf', 102400, 2, DATE '2026-02-01')
)
INSERT INTO aihr_employee_documents (
    document_id, employee_id, document_name, document_category, file_path, file_type, file_size_bytes, uploaded_by, uploaded_at
)
SELECT
    d.document_id,
    d.employee_id,
    replace(e.first_name || '_' || e.last_name || '_' || d.suffix, ' ', ''),
    d.document_category,
    '/uploads/employees/' || d.employee_id || '/' || d.file_slug,
    d.file_type,
    d.file_size_bytes,
    d.uploaded_by,
    d.uploaded_at
FROM doc_seed d
JOIN aihr_employees e ON e.employee_id = d.employee_id;

INSERT INTO aihr_audit_logs (audit_id, table_name, record_id, action, old_value, new_value, changed_by, changed_at) VALUES
    (1, 'aihr_employees', '104', 'UPDATE', '{"job_id":"ENG_MGR"}'::jsonb, '{"job_id":"DIR_ENG"}'::jsonb, 1, TIMESTAMP '2024-01-01 09:00:00'),
    (2, 'aihr_employees', '106', 'UPDATE', '{"job_id":"HR_REP"}'::jsonb, '{"job_id":"HR_DIR"}'::jsonb, 2, TIMESTAMP '2023-07-01 09:15:00'),
    (3, 'aihr_employees', '111', 'UPDATE', '{"job_id":"IT_PROG"}'::jsonb, '{"job_id":"ENG_MGR"}'::jsonb, 5, TIMESTAMP '2023-01-01 10:00:00'),
    (4, 'aihr_employees', '112', 'UPDATE', '{"job_id":"QA_ENG"}'::jsonb, '{"job_id":"ENG_MGR"}'::jsonb, 5, TIMESTAMP '2024-01-01 10:20:00'),
    (5, 'aihr_employees', '113', 'UPDATE', '{"job_id":"DEVOPS"}'::jsonb, '{"job_id":"ENG_MGR"}'::jsonb, 5, TIMESTAMP '2024-03-01 11:10:00'),
    (6, 'aihr_employees', '116', 'UPDATE', '{"job_id":"SA_REP"}'::jsonb, '{"job_id":"SA_MAN"}'::jsonb, 4, TIMESTAMP '2022-01-01 08:00:00'),
    (7, 'aihr_employees', '117', 'UPDATE', '{"job_id":"CS_SPEC"}'::jsonb, '{"job_id":"CS_MGR"}'::jsonb, 4, TIMESTAMP '2023-02-01 08:10:00'),
    (8, 'aihr_employees', '118', 'UPDATE', '{"job_id":"SUP_ENG"}'::jsonb, '{"job_id":"ENG_MGR"}'::jsonb, 5, TIMESTAMP '2024-04-15 08:15:00'),
    (9, 'aihr_employees', '120', 'UPDATE', '{"job_id":"MK_REP"}'::jsonb, '{"job_id":"MK_MAN"}'::jsonb, 2, TIMESTAMP '2024-06-10 07:30:00'),
    (10, 'aihr_employees', '121', 'UPDATE', '{"job_id":"IT_PROG"}'::jsonb, '{"job_id":"ENG_MGR"}'::jsonb, 5, TIMESTAMP '2024-07-12 07:45:00'),
    (11, 'aihr_employees', '135', 'UPDATE', '{"job_id":"IT_PROG"}'::jsonb, '{"job_id":"PROD_MGR"}'::jsonb, 5, TIMESTAMP '2025-01-20 09:25:00'),
    (12, 'aihr_employees', '149', 'UPDATE', '{"employment_status":"ACTIVE"}'::jsonb, '{"employment_status":"TERMINATED","reason":"Voluntary Resignation"}'::jsonb, 8, TIMESTAMP '2025-11-15 12:00:00'),
    (13, 'aihr_employees', '174', 'UPDATE', '{"employment_status":"ACTIVE"}'::jsonb, '{"employment_status":"TERMINATED","reason":"Performance"}'::jsonb, 13, TIMESTAMP '2025-12-20 12:10:00'),
    (14, 'aihr_employees', '203', 'UPDATE', '{"employment_status":"ACTIVE"}'::jsonb, '{"employment_status":"TERMINATED","reason":"Relocation"}'::jsonb, 19, TIMESTAMP '2026-02-05 12:20:00'),
    (15, 'aihr_employees', '218', 'UPDATE', '{"employment_status":"ACTIVE"}'::jsonb, '{"employment_status":"TERMINATED","reason":"Contract End"}'::jsonb, 22, TIMESTAMP '2026-03-01 12:30:00');

WITH employee_notices (
    recipient_user_id, employee_id, notification_type, due_date, note
) AS (
    VALUES
        (2, 158, 'PROBATION_ALERT', DATE '2026-04-30', 'requires executive review'),
        (7, 158, 'PROBATION_ALERT', DATE '2026-04-30', 'requires HR follow-up'),
        (13, 171, 'PROBATION_ALERT', DATE '2026-04-22', 'needs a quality coaching check-in'),
        (20, 209, 'PROBATION_ALERT', DATE '2026-04-25', 'needs a customer support readiness review'),
        (12, 177, 'CONTRACT_EXPIRY', DATE '2026-12-31', 'needs renewal planning'),
        (19, 206, 'CONTRACT_EXPIRY', DATE '2026-11-30', 'needs a solutions staffing decision'),
        (21, 215, 'PROBATION_ALERT', DATE '2026-04-18', 'needs a campaign onboarding review')
)
INSERT INTO aihr_notifications (
    recipient_user_id, notification_type, title, message, reference_table, reference_id, is_read, created_at
)
SELECT
    n.recipient_user_id,
    n.notification_type,
    CASE
        WHEN n.notification_type = 'CONTRACT_EXPIRY' THEN 'Contract expiring: ' || e.first_name || ' ' || e.last_name
        ELSE 'Probation ending: ' || e.first_name || ' ' || e.last_name
    END,
    CASE
        WHEN n.notification_type = 'CONTRACT_EXPIRY' THEN
            'Contract for ' || e.first_name || ' ' || e.last_name || ' (ID: ' || e.employee_id || ') in ' || d.department_name ||
            ' expires on ' || to_char(n.due_date, 'YYYY-MM-DD') || ' and ' || n.note || '.'
        ELSE
            'Employee ' || e.first_name || ' ' || e.last_name || ' (ID: ' || e.employee_id || ') in ' || d.department_name ||
            ' has a probation review due by ' || to_char(n.due_date, 'YYYY-MM-DD') || ' and ' || n.note || '.'
    END,
    'aihr_employees',
    e.employee_id::text,
    0,
    TIMESTAMP '2026-03-25 08:00:00' + ((row_number() OVER (ORDER BY n.employee_id)) * INTERVAL '15 minutes')
FROM employee_notices n
JOIN aihr_employees e ON e.employee_id = n.employee_id
JOIN aihr_departments d ON d.department_id = e.department_id;

INSERT INTO aihr_notifications (recipient_user_id, notification_type, title, message, reference_table, reference_id, is_read, created_at) VALUES
    (6, 'ACTION_COMPLETE', 'People review cycle published', 'Vertex Software has published the Q2 2026 people review calendar for all people managers.', NULL, NULL, 1, TIMESTAMP '2026-01-05 08:00:00'),
    (14, 'ACTION_COMPLETE', 'Infrastructure salary adjustment processed', 'Your Q1 2026 salary adjustment has been applied in Vertex Software payroll.', 'aihr_employees', '113', 1, TIMESTAMP '2026-01-12 08:15:00'),
    (17, 'ACTION_COMPLETE', 'EMEA quota update processed', 'Your FY26 territory and quota package has been approved in the Vertex Software sales workflow.', 'aihr_employees', '116', 1, TIMESTAMP '2026-01-19 08:20:00'),
    (1, 'SYSTEM', 'Vertex Software compensation window open', 'The Q2 2026 compensation review window is open. Final approvals are due by 2026-04-15.', NULL, NULL, 0, TIMESTAMP '2026-03-20 06:00:00'),
    (2, 'SYSTEM', 'Vertex Software workforce refresh applied', 'Demo workforce has been reseeded for a USA-headquartered software company with broader Europe representation and globally distributed management.', NULL, NULL, 1, TIMESTAMP '2026-03-25 07:00:00');

-- Seed compensation values are maintained in compact source numbers above and then
-- normalized here to annual USD amounts so the app's annual-salary UX matches the data.
UPDATE aihr_jobs
SET min_salary = min_salary * 12,
    max_salary = max_salary * 12;

UPDATE aihr_pay_grades
SET min_salary = min_salary * 12,
    max_salary = max_salary * 12;

UPDATE aihr_employees
SET salary = salary * 12
WHERE salary IS NOT NULL;

SELECT setval(pg_get_serial_sequence('aihr_employees', 'employee_id'), (SELECT max(employee_id) FROM aihr_employees), true);
SELECT setval(pg_get_serial_sequence('aihr_roles', 'role_id'), (SELECT max(role_id) FROM aihr_roles), true);
SELECT setval(pg_get_serial_sequence('aihr_users', 'user_id'), (SELECT max(user_id) FROM aihr_users), true);
SELECT setval(pg_get_serial_sequence('aihr_user_preferences', 'preference_id'), (SELECT max(preference_id) FROM aihr_user_preferences), true);
SELECT setval(pg_get_serial_sequence('aihr_employee_assessments', 'assessment_id'), (SELECT max(assessment_id) FROM aihr_employee_assessments), true);
SELECT setval(pg_get_serial_sequence('aihr_employee_documents', 'document_id'), (SELECT max(document_id) FROM aihr_employee_documents), true);
SELECT setval(pg_get_serial_sequence('aihr_audit_logs', 'audit_id'), (SELECT max(audit_id) FROM aihr_audit_logs), true);
SELECT setval(pg_get_serial_sequence('aihr_notifications', 'notification_id'), (SELECT max(notification_id) FROM aihr_notifications), true);
SELECT setval(pg_get_serial_sequence('aihr_pay_grades', 'pay_grade_id'), (SELECT max(pay_grade_id) FROM aihr_pay_grades), true);

COMMIT;
