DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='kyc_documents' AND column_name='document_type' AND data_type='text') THEN
    ALTER TABLE public.kyc_documents ALTER COLUMN document_type TYPE VARCHAR(255);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='title' AND data_type='text') THEN
    ALTER TABLE public.courses ALTER COLUMN title TYPE VARCHAR(255);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='description' AND data_type='text') THEN
    ALTER TABLE public.courses ALTER COLUMN description TYPE VARCHAR(255);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='title' AND data_type='text') THEN
    ALTER TABLE public.lessons ALTER COLUMN title TYPE VARCHAR(255);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='content' AND data_type='text') THEN
    ALTER TABLE public.lessons ALTER COLUMN content TYPE VARCHAR(255);
  END IF;
END $$;