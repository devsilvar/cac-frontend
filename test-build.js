// Quick test script to check if the Vite React app is working
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Checking Vite React setup...');

// Check if essential files exist
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'index.html',
  'src/main.tsx',
  'src/App.tsx'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Try to check Vite build
try {
  console.log('\n📦 Checking build...');
  execSync('npm run build', { stdio: 'inherit', timeout: 30000 });
  console.log('✅ Build check passed!');
} catch (error) {
  console.log('❌ Build check failed:', error.message);
}

console.log('\n🌐 Server should be running on http://localhost:5173');
console.log('🔐 Admin portal: http://localhost:5173/admin/login');