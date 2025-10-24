#!/usr/bin/env node

/**
 * Simple script to check if required environment variables are set
 * Run with: node .env-check.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment configuration...\n');

// Check if .env.local exists
const envLocalPath = path.join(__dirname, '.env.local');
const envLocalExists = fs.existsSync(envLocalPath);

if (!envLocalExists) {
  console.error('❌ .env.local file not found!');
  console.log('\n📝 To fix this:');
  console.log('1. Copy .env.local.example to .env.local');
  console.log('   (or create a new .env.local file)\n');
  console.log('2. Get your Supabase credentials from:');
  console.log('   https://app.supabase.com/project/_/settings/api\n');
  console.log('3. Add these lines to .env.local:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n');
  process.exit(1);
}

// Read .env.local file
const envContent = fs.readFileSync(envLocalPath, 'utf-8');
const envLines = envContent.split('\n');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

let allSet = true;
let hasPlaceholders = false;
const foundVars = {};

console.log('📋 Checking .env.local file:\n');

// Parse the env file
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  
  const [key, ...valueParts] = trimmed.split('=');
  const value = valueParts.join('=').trim();
  
  if (requiredVars.includes(key)) {
    foundVars[key] = value;
  }
}

// Check each required variable
for (const varName of requiredVars) {
  const value = foundVars[varName];
  
  if (!value || value === '') {
    console.log(`❌ ${varName}: NOT SET`);
    allSet = false;
  } else if (value.includes('your-') || value.includes('xxxxx')) {
    console.log(`⚠️  ${varName}: SET (but appears to be a placeholder)`);
    hasPlaceholders = true;
  } else {
    console.log(`✅ ${varName}: SET`);
  }
}

console.log('\n');

if (!allSet) {
  console.error('❌ Some required environment variables are missing!');
  console.log('\n📝 Please update your .env.local file with the actual values from:');
  console.log('   https://app.supabase.com/project/_/settings/api\n');
  process.exit(1);
}

if (hasPlaceholders) {
  console.error('⚠️  Some environment variables appear to be placeholders!');
  console.log('\n📝 Please update your .env.local file with actual values from:');
  console.log('   https://app.supabase.com/project/_/settings/api\n');
  process.exit(1);
}

// Validate URL format
const url = foundVars['NEXT_PUBLIC_SUPABASE_URL'];
if (url && !url.startsWith('http')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL should start with https://');
  console.log('   Current value:', url);
  process.exit(1);
}

console.log('✅ All environment variables are properly configured!\n');
console.log('You can now run: npm run dev\n');

