SELECT u.id as user_id, u.name, cp.id as coach_id, cp.slug 
FROM users u 
INNER JOIN coach_profiles cp ON u.id = cp.userId 
WHERE cp.id IN (6, 7);
