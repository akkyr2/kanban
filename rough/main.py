from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import Error
import uvicorn

app = FastAPI(title="Kanban Task API")

# --- CORS Configuration ---
# This allows your React frontend to communicate with this Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. In production, use your React URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection Details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '', 
    'database': 'kanban'
}

@app.get("/tasks")
def fetch_tasks():
    connection = None
    try:
        # Establishing the connection
        connection = mysql.connector.connect(**db_config)
        
        if connection.is_connected():
            # dictionary=True converts rows into key-value pairs automatically
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM task ORDER BY created_date DESC")
            rows = cursor.fetchall()
            return rows

    except Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
    # finally:
    #     if connection and connection.is_connected():
    #         cursor.close()
    #         connection.close()

if __name__ == "__main__":
    # Runs the server on http://127.0.0.1:8000
    uvicorn.run(app, host="127.0.0.1", port=8000)