module.exports = {
    testEnvironment: 'node',
    testTimeout: 10000,
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: [
        '*.js',
        '!jest.config.js',
        '!coverage/**'
    ],
    coverageDirectory: 'coverage',
    verbose: true
};
