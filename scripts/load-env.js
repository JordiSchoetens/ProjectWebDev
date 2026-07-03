const fs = require('fs');
const path = require('path');

// Load .env file
const envPath = path.join(__dirname, '../.env');
const envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
        process.env[key.trim()] = value.trim();
      }
    }
  });
  
  console.log('✓ Environment variables loaded from .env');
  
  // Replace placeholders in environment files
  const environmentFiles = [
    path.join(__dirname, '../src/environments/environment.ts'),
    path.join(__dirname, '../src/environments/environment.development.ts')
  ];
  
  environmentFiles.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      
      // Replace all placeholders
      Object.keys(envVars).forEach(key => {
        const placeholder = `<%${key}%>`;
        content = content.replace(new RegExp(placeholder, 'g'), envVars[key]);
      });
      
      fs.writeFileSync(file, content, 'utf8');
    }
  });
  
  console.log('✓ Environment variables injected into files');
} else {
  console.warn('⚠ .env file not found. Using existing environment configuration.');
}
