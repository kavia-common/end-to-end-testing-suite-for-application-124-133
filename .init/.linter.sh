#!/bin/bash
cd /home/kavia/workspace/code-generation/end-to-end-testing-suite-for-application-124-133/playwright_test_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

