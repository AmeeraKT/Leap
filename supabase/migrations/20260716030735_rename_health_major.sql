-- Rename major option: Health and Medicine → Health / Psychology / Medicine
ALTER TABLE public.waitlist_signups
  DROP CONSTRAINT IF EXISTS waitlist_signups_majors_check;

UPDATE public.waitlist_signups
SET majors = array_replace(majors, 'Health and Medicine', 'Health / Psychology / Medicine')
WHERE 'Health and Medicine' = ANY (majors);

ALTER TABLE public.waitlist_signups
  ADD CONSTRAINT waitlist_signups_majors_check CHECK (
    majors <@ array[
      'Agriculture / Animal Sciences',
      'Architecture / Design / Urban Planning',
      'Arts / Humanities / Social Sciences',
      'Business / Economics',
      'Computer Science / IT',
      'Education',
      'Engineering',
      'Environment',
      'Health / Psychology / Medicine',
      'Law',
      'Science / Mathematics'
    ]::text[]
  );
