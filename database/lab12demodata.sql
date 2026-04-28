-- PostgreSQL-only optional Lab 12 capstone demo data.
-- Requires database/lab12schema.sql to have been applied first.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
          FROM information_schema.tables
         WHERE table_schema = current_schema()
           AND table_name = 'aihr_employee_assessments'
    ) THEN
        RAISE EXCEPTION 'AIHR_EMPLOYEE_ASSESSMENTS does not exist. Run database/lab12schema.sql first.';
    END IF;
END $$;

DELETE FROM aihr_employee_assessments
 WHERE cycle_code IN ('FY2025', 'FY2026-H1', 'FY2026-H2')
   AND employee_id IN (100, 101, 103);

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
) VALUES (
    100,
    'FY2025',
    'FINAL',
    96.00,
    4.80,
    'Drove cross-region operating discipline, improved executive reporting cadence, and kept the organization aligned during a high-growth period.',
    'Wants stronger delegation support and more predictive metrics on hiring demand.',
    'Expand succession planning coverage and formalize quarterly talent reviews for executive leaders.',
    1,
    TIMESTAMP '2025-12-20 10:30:00'
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
) VALUES (
    101,
    'FY2026-H1',
    'SUBMITTED',
    88.50,
    4.25,
    'Strong leadership across enterprise operations with better follow-through on cross-functional staffing plans.',
    'Asked for clearer prioritization between recruiting support and business process work.',
    'Improve executive dashboard automation and tighten review-loop handoffs with HR specialists.',
    1,
    TIMESTAMP '2026-03-15 14:15:00'
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
) VALUES (
    103,
    'FY2026-H2',
    'DRAFT',
    79.00,
    3.90,
    'Solid delivery on platform reliability and engineering enablement, with room to improve communication of roadmap tradeoffs.',
    'Wants more time reserved for mentoring newer leads and documenting architecture decisions.',
    'Raise release readiness transparency and convert manual engineering review checkpoints into repeatable workflows.',
    1,
    NULL
);

SELECT assessment_id,
       employee_id,
       cycle_code,
       review_status,
       goal_completion_pct,
       competency_score
  FROM aihr_employee_assessments
 ORDER BY employee_id, cycle_code;
