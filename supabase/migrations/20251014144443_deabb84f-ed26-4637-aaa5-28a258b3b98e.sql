-- Create user_metrics table for tracking assessment stats
CREATE TABLE IF NOT EXISTS public.user_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_assessments INTEGER DEFAULT 0,
  total_score DECIMAL DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  last_assessment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for user_metrics
CREATE POLICY "Users can view own metrics"
  ON public.user_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics"
  ON public.user_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics"
  ON public.user_metrics FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_user_metrics_updated_at
  BEFORE UPDATE ON public.user_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for user_metrics
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_metrics;