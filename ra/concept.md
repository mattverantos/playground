--- Basic Structure

```sql
WITH event1 (),
WITH event2 ()
SELECT p.*
FROM person p
WHERE
    p.id IN (event1)
    AND p.id in (event2);
```


-- Filter Selection

WITH event1 (
    SELECT
        d.*
    FROM
        drug d
    WHERE
        col = 'value'
),

-- Selecting through joins
WITH event2 (
    SELECT
        c.*
    FROM
        condition c
    JOIN
        drug d
    ON
        c.person_id = d.person_id
    WHERE
        d.concept = 'morphine'
)
-- there will be a subset of possible columns (related entities) when filtering

-- computed columns
WITH event1 (
    SELECT
        d.*,
        d.start_date - p.dob as AGE
    FROM
        drug d
    WHERE
        col = 'value'
)

SELECT
    p.*
FROM
    person p
WHERE
    -- inclusion
    p.id IN (event1)
    AND p.id IN (event2)
    -- exclusion
    p.id NOT IN (event3)
