const fs = require('fs');
const paths = [
  'app.js',
  'routes/patients.js',
  'routes/doctors.js',
  'routes/appointments.js',
  'routes/admin.js'
];

paths.forEach(path => {
  fs.writeFileSync(path, '', (err) => {
    if (err) throw err;
    console.log(`${path} created`);
  });
});

console.log('All files created successfully');
