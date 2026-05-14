# ARC Pay - Supabase Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project
5. Wait for it to initialize (2-3 minutes)

### Step 2: Get Your Credentials
1. In Supabase dashboard, go to **Settings** > **API**
2. Find these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: The long string under "Project API keys"

### Step 3: Create Payments Table
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Open `supabase-setup.sql` in a text editor
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click **Run**

### Step 4: Configure Your App
1. Create a file named `.env.local` in the `arc-pay` folder
2. Add your credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Restart Your App
```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

---

## What Is Supabase?

Supabase is a backend-as-a-service that provides:
- **PostgreSQL Database** - Stores your payment data
- **REST API** - Easy way to read/write data
- **Real-time** - Live updates (not used in MVP)
- **Auth** - User authentication (not used in MVP)

### Why Do We Need It?

Before Supabase:
- Payment links only worked in the SAME browser
- Data was stored in localStorage (browser only)
- Users couldn't share payment links across devices

After Supabase:
- Payment links work ANYWHERE (any browser, any device)
- Data is stored in the cloud
- Anyone with the link can pay

---

## Understanding Row Level Security (RLS)

**Problem**: By default, Supabase blocks ALL database access.

**Solution**: RLS policies let us define WHO can do WHAT.

Think of it like a club bouncer:
- Without policies = door is locked, no one gets in
- With policies = bouncer decides who can enter

### Our Policies (in supabase-setup.sql):

```sql
-- Policy 1: Anyone can READ (view) payments
CREATE POLICY "Allow anyone to read payments" ON payments
  FOR SELECT USING (true);

-- Policy 2: Anyone can INSERT (create) payments
CREATE POLICY "Allow anyone to insert payments" ON payments
  FOR INSERT WITH CHECK (true);

-- Policy 3: Anyone can UPDATE (change) payments
CREATE POLICY "Allow anyone to update payments" ON payments
  FOR UPDATE USING (true);
```

### Security Note
These "open" policies are fine for MVP because:
- Payments are public by design (anyone can pay)
- Only the smart contract can actually move USDC
- We're just storing metadata about payments

For production, you'd add:
- Auth checks (only authenticated users)
- Rate limiting (prevent spam)
- More specific rules

---

## Understanding Environment Variables

### What Are They?
Environment variables are configuration values that your app needs to run.

### Why Use Them?
- **Security**: API keys shouldn't be in code
- **Flexibility**: Change config without editing code
- **Different Environments**: Dev vs Production have different values

### Our Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

- `NEXT_PUBLIC_` prefix means "expose to browser"
- `SUPABASE_URL` = Your project address
- `SUPABASE_ANON_KEY` = Your public API key

### Files:
- `.env` - Default values (committed to git)
- `.env.local` - Local overrides (NOT committed)
- `.env.example` - Template showing what variables are needed

---

## Troubleshooting

### "Supabase not configured"
1. Check `.env.local` exists
2. Check credentials are correct
3. Restart the dev server
4. Check browser console for errors

### "Failed to create payment"
1. Check if table exists (run `SELECT * FROM payments LIMIT 1` in SQL Editor)
2. Check RLS is enabled
3. Check policies exist
4. Check browser console for specific error

### "Table payments not found"
1. Go to SQL Editor in Supabase
2. Run the `supabase-setup.sql` script
3. Wait for success message

### "RLS policy violated"
1. Go to Table Editor > payments
2. Click on "Policies"
3. Verify all 3 policies exist
4. Make sure they're enabled (toggle is ON)

---

## Database Schema Explained

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Unique ID like "arc_abc123" |
| recipient | TEXT | Wallet to pay |
| amount | TEXT | USDC amount (string for precision) |
| note | TEXT | Optional message |
| status | TEXT | pending/processing/completed/failed |
| tx_hash | TEXT | Blockchain transaction hash |
| payer_wallet | TEXT | Who paid |
| created_at | TIMESTAMPTZ | When created (auto) |
| paid_at | TIMESTAMPTZ | When paid (auto) |

### Why Is Amount a TEXT?
USDC has 6 decimal places. Using TEXT prevents floating-point math errors.

### Why Is created_at Auto?
We use `DEFAULT NOW()` so PostgreSQL sets it automatically.

---

## Next Steps After Setup

1. ✅ Create Supabase account
2. ✅ Get credentials
3. ✅ Run SQL setup
4. ✅ Create .env.local
5. ✅ Restart app

Now:
- Go to your app
- Fill in payment form
- Click "Create Payment Link"
- Should work!

If it doesn't:
- Check browser console (F12 > Console)
- Check Supabase SQL Editor
- Verify table exists