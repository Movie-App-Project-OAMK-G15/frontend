CREATE OR REPLACE FUNCTION get_requests_by_group(group_id_input INT)
RETURNS TABLE (
    request_id INT,
    user_email VARCHAR,
    request_time TIMESTAMP,
    firstname VARCHAR,
    familyname VARCHAR,
    phone VARCHAR,
    bio VARCHAR,
    user_photo VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gr.request_id,
        gr.user_email,
        gr.request_time,
        acc.firstname,
        acc.familyname,
        acc.phone,
        acc.bio,
        acc.user_photo
    FROM 
        group_requests gr
    INNER JOIN 
        account acc ON gr.user_email = acc.email
    WHERE 
        gr.group_id = group_id_input;
END;
$$ LANGUAGE plpgsql;
