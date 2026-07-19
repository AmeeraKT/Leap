-- Allow Diploma/Other as a waitlist degree option.
ALTER TABLE public.waitlist_signups
  DROP CONSTRAINT IF EXISTS waitlist_signups_degree_check;

ALTER TABLE public.waitlist_signups
  ADD CONSTRAINT waitlist_signups_degree_check CHECK (
    degree in ('Bachelor', 'Master', 'PhD', 'Diploma/Other')
  );
