-- Allow Graduated as a waitlist year of study option.
ALTER TABLE public.waitlist_signups
  DROP CONSTRAINT IF EXISTS waitlist_signups_year_check;

ALTER TABLE public.waitlist_signups
  ADD CONSTRAINT waitlist_signups_year_check CHECK (
    year in ('First', 'Second', 'Third', 'Fourth', 'Fifth or above', 'Graduated')
  );
