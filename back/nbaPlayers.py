from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


def fetch_nba_heights():
    url = "https://mach-eight.uc.r.appspot.com/"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error fetching player data")
    data = response.json()
    return data['values']

def find_pairs(target_height: int):
    players = fetch_nba_heights()
    height_map = {}
    found_pairs = []

    for player in players:
        player_name = f"{player['first_name']} {player['last_name']}"
        player_height = int(player['h_in'])
        complement = target_height - player_height
        
        if complement in height_map:
            found_pairs.append((player_name, height_map[complement]))
        
        height_map[player_height] = player_name

    return found_pairs

@app.get("/search/{target_height}")
def search_players(target_height: int):
    if target_height <= 0:
        raise HTTPException(status_code=400, detail="Height must be a positive integer")

    pairs = find_pairs(target_height)

    if not pairs:
        return {"message": "No matches found"}
    
    return {"pairs": [{"player1": p[0], "player2": p[1]} for p in pairs]}
