
// load dwapp library
import dwapp from './dwapp.mjs';
console.debug(`dwapp loaded version ${dwapp.version}`);

// launch tests
import dwappTests from './dwapp-tests.mjs';
dwappTests.run();