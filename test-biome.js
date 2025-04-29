// This file has intentional formatting and linting issues to test Biome

function testFunction(param1, param2) {
  const unused = 'This variable is never used';
  console.log(`Hello${param1}`);

  // Missing semicolon
  return param1 + param2;
}
