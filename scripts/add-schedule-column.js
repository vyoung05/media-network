const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lvacbxnjfeunouqaskvh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YWNieG5qZmV1bm91cWFza3ZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2NTk1MSwiZXhwIjoyMDg3NzQxOTUxfQ.nsqsW-ssYKOYaxrEK-AnY2QeoT6kAKusQR4PibY21Ns'
);

async function run() {
  // Test if column exists by querying it
  const { data, error } = await supabase
    .from('magazine_issues')
    .select('scheduled_publish_at')
    .limit(1);
  
  if (error && error.message.includes('scheduled_publish_at')) {
    console.log('Column does not exist yet — needs to be added via SQL Editor');
    console.log('SQL: ALTER TABLE magazine_issues ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ DEFAULT NULL;');
  } else {
    console.log('✅ scheduled_publish_at column already exists or table accessible');
    console.log('Test query result:', data);
  }
}

run().catch(console.error);
