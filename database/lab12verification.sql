-- Quick verification query for the optional Lab 12 assessment capstone reference objects.

SELECT ea.employee_id,
       ec.cycle_code,
       ec.default_label,
       ec.cycle_status,
       ea.review_status,
       ea.goal_completion_pct,
       ea.competency_score,
       ea.submitted_at
  FROM aihr_employee_assessments ea
  JOIN aihr_assessment_cycles ec
    ON ec.cycle_code = ea.cycle_code
 ORDER BY ea.employee_id, ec.display_order;
