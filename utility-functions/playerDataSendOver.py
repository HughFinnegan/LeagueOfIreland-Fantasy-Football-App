from flask import Flask, jsonify, request
from flask_cors import CORS
from player import Player
from supabase import create_client
import traceback
import json

url = 'https://apdimqnzelqdjglpmcqw.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZGltcW56ZWxxZGpnbHBtY3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2Mzk3MjAsImV4cCI6MjAzMTIxNTcyMH0.6uCg8sWAd_KL9VG7aad_221tyKxjCWpFoJIx6IRWreQ'
if not url or not key:
    raise ValueError("Supabase URL and Key must be set in environment variables")
supabase = create_client(url,  key)

app = Flask(__name__)
CORS(app)

SQLPlayers = supabase.from_("Players").select("*").execute().data

def load_players_from_SQL():
    allPlayers = []
    for player in SQLPlayers:
        newPlayer = Player(player.get('Name'), player.get('Position'), player.get('Nationality'), player.get('Age'), player.get('Club'), player.get('Value'), \
                           player.get('Games'), player.get('Goals'), player.get('Assists'), player.get('Yellows'), player.get('Reds'), player.get('Points'))
        allPlayers.append(newPlayer)
    return allPlayers

def load_squad_from_SQL(user):
    SQLSquad = supabase.from_("Squads").select("*").eq("User", user).execute().data
    if SQLSquad:
        try:
            players_data = SQLSquad[0].get("Players")
            squad = {}  
            for position, player_details in players_data.items():
                squad[position] = player_details
            return squad
        except Exception as e:
            print("Error parsing squad data:", e)
            return None
    return None


@app.route('/scrape-players')
def scrape_players_endpoint():
    all_players = load_players_from_SQL()
    player_data = [vars(player) for player in all_players]
    return jsonify(player_data)

@app.route('/upload-players', methods=['POST'])
def upload_players_endpoint():
    try:
        data = request.json
        players = data.get('players')
        
        print('Received players:', players)

        #ADD CODE FOR USER HERE
        user = "sample user"

        squad_data = {'User': user, 'Players': players}
        supabase.from_("Squads").insert([squad_data]).execute()

        print('Squad data inserted successfully:', squad_data)
    except Exception as e:
        print("Error occurred during insertion:")
        print(traceback.format_exc())  
        return jsonify({'error': str(e)}), 500
    
@app.route('/download-players')
def download_players_endpoint():
    squad = load_squad_from_SQL("sample user")
    return jsonify(squad)

if __name__ == '__main__':
    app.run(debug=True)

