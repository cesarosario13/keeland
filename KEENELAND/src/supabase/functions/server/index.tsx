import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
// Use environment variables if available, otherwise fallback to hardcoded values
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? 'https://ezmxgjxdavjjuitdijxp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXhnanhkYXZqanVpdGRpanhwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjMzOTM0OSwiZXhwIjoyMDc3OTE1MzQ5fQ.xuAGhsxlyH10x_z9hYqDiWhrAEvdaBxoIT4yXlEa9Ho';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Signup route
app.post('/make-server-b1c23bba/signup', async () => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.log(`Signup error: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    // Store user data in KV store
    const userId = authData.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      balance: 1000, // Initial balance
      createdAt: new Date().toISOString()
    });

    console.log(`User created successfully: ${email}`);
    return c.json({ 
      success: true,
      user: {
        id: userId,
        email,
        name
      }
    });
  } catch (error) {
    console.log(`Error during signup: ${error}`);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Login route (returns access_token via Supabase client-side, this is just for reference)
app.post('/make-server-b1c23bba/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Note: Login is handled on the frontend using supabase.auth.signInWithPassword
    // This endpoint is for additional server-side validation if needed
    return c.json({ 
      success: true,
      message: 'Use frontend Supabase client for login'
    });
  } catch (error) {
    console.log(`Error during login: ${error}`);
    return c.json({ error: 'Internal server error during login' }, 500);
  }
});

// Get user profile (requires authentication)
app.get('/make-server-b1c23bba/user-profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Auth error while getting user profile: ${error?.message}`);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${user.id}`);
    
    if (!userData) {
      return c.json({ error: 'User data not found' }, 404);
    }

    return c.json({ 
      success: true,
      user: userData
    });
  } catch (error) {
    console.log(`Error getting user profile: ${error}`);
    return c.json({ error: 'Internal server error while getting profile' }, 500);
  }
});

// Update balance (requires authentication)
app.post('/make-server-b1c23bba/update-balance', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Auth error while updating balance: ${error?.message}`);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    const body = await c.req.json();
    const { amount, type } = body; // type: 'add' or 'subtract'

    if (amount === undefined || !type) {
      return c.json({ error: 'Amount and type are required' }, 400);
    }

    // Get current user data
    const userData = await kv.get(`user:${user.id}`);
    
    if (!userData) {
      return c.json({ error: 'User data not found' }, 404);
    }

    // Update balance
    let newBalance = userData.balance;
    if (type === 'add') {
      newBalance += amount;
    } else if (type === 'subtract') {
      newBalance = Math.max(0, newBalance - amount);
    }

    userData.balance = newBalance;
    await kv.set(`user:${user.id}`, userData);

    return c.json({ 
      success: true,
      balance: newBalance
    });
  } catch (error) {
    console.log(`Error updating balance: ${error}`);
    return c.json({ error: 'Internal server error while updating balance' }, 500);
  }
});

// Save betting history (requires authentication)
app.post('/make-server-b1c23bba/betting-history', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Auth error while saving betting history: ${error?.message}`);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    const body = await c.req.json();
    const { game, betAmount, result, payout } = body;

    if (!game || betAmount === undefined) {
      return c.json({ error: 'Game and bet amount are required' }, 400);
    }

    // Create bet record
    const betId = `bet:${user.id}:${Date.now()}`;
    const betRecord = {
      userId: user.id,
      game,
      betAmount,
      result,
      payout: payout || 0,
      timestamp: new Date().toISOString()
    };

    await kv.set(betId, betRecord);

    return c.json({ 
      success: true,
      bet: betRecord
    });
  } catch (error) {
    console.log(`Error saving betting history: ${error}`);
    return c.json({ error: 'Internal server error while saving bet' }, 500);
  }
});

// Get betting history (requires authentication)
app.get('/make-server-b1c23bba/betting-history', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Auth error while getting betting history: ${error?.message}`);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    // Get all bets for this user
    const bets = await kv.getByPrefix(`bet:${user.id}:`);

    return c.json({ 
      success: true,
      bets: bets || []
    });
  } catch (error) {
    console.log(`Error getting betting history: ${error}`);
    return c.json({ error: 'Internal server error while getting history' }, 500);
  }

});

Deno.serve(app.fetch);