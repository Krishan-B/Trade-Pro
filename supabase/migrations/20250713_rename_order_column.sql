DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='order') THEN
    ALTER TABLE public.lessons RENAME COLUMN "order" TO lesson_order;
  END IF;
END $$;