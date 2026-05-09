@echo off

echo Starting Backend...
start cmd /k "cd backend && python -m uvicorn main:app --reload"

timeout /t 3

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Done!
pause