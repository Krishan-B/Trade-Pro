CREATE OR REPLACE FUNCTION on_kyc_status_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM http_post(
    'https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/kyc-status-update-notification',
    json_build_object('record', NEW)::text,
    '{}'::jsonb,
    'application/json'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER kyc_status_update_trigger
AFTER UPDATE OF status ON kyc_documents
FOR EACH ROW
EXECUTE FUNCTION on_kyc_status_update();