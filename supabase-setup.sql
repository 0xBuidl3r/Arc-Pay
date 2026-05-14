-- ============================================
-- ARC Pay - Payments Table Setup
-- ============================================
-- Run this in: Supabase SQL Editor
-- ============================================

-- Step 1: Create the payments table
CREATE TABLE public.payments (
  id TEXT PRIMARY KEY,
  recipient TEXT NOT NULL,
  amount TEXT NOT NULL,
  note TEXT,
  status TEXT DEFAULT 'pending',
  tx_hash TEXT,
  payer_wallet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- Step 2: Disable RLS (remove this for production)
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;

-- Step 3: Verify table exists
SELECT * FROM public.payments LIMIT 0;

-- Step 4: Test insert
INSERT INTO public.payments (id, recipient, amount, note)
VALUES ('arc_test123', '0x1234567890123456789012345678901234567890', '100', 'Test')
RETURNING *;

-- Step 5: Clean up test
DELETE FROM public.payments WHERE id = 'arc_test123';