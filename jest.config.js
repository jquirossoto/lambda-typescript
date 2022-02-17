/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: false,
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.(ts)$': 'ts-jest'
    },
    testMatch: ['**/?(*.)+(spec).+(ts)'],
    collectCoverageFrom: ['src/**/*.ts*'],
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    coverageDirectory: 'jest/coverage',
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: 'jest/junit',
                outputName: 'junit.xml'
            }
        ]
    ],
    moduleDirectories: ['node_modules', 'src/layers/dependencies/nodejs/node_modules'],
    moduleNameMapper: {
        '^/opt/(.*)$': ['<rootDir>/src/layers/common/$1']
    }
};
