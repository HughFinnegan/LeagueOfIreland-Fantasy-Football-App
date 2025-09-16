from flask import Flask, jsonify
from flask_cors import CORS
from player import Player
from supabase import create_client

#for given match calculate scores for players involved

#assume Match object is passed with all stats we need to
#calculate the scores for the players involved
#can get lineups, subs, goals, assists, cards, penos
#from these stats can calculate scores of players with clean sheets, goals etc.

#for a given player need to calculate
#minutes played (up to 60) 1  (60 or more (excl. extra time)) 2
#goals scored  (forward) 4  (midfielder) 5  (defender) 6
#goals conceded  (goalkeeper and defenders, for every 2) -1
#own goals (all players) -2 (https://www.transfermarkt.us/premier-league/eigentorstatistik/wettbewerb/IR1)
#assists (all players) 3
#clean sheet (goalkeeper or defender) 4  (midfielder) 1
#yellow card(s) (all players, for each card) -1
#red card (all players) -3
#penalty save (goalkeeper) 5 (https://www.transfermarkt.co.uk/premier-league/elfmetertoeter/wettbewerb/IR1)
#penalty miss (taker) -2 (https://www.transfermarkt.co.uk/league-of-ireland-premier-division/elfmeterstatistik/wettbewerb/IR1/saison_id/2023/plus/1)
#number of shots saved by goalkeeper (goalkeeper, every 3) 1

#once all these are calculated for each player then can update Player objects

#do this for each match on the given gameday and the users players scores can be updated accordingly

def scoreCalculator (playerName, matchDate):
    url = 'https://apdimqnzelqdjglpmcqw.supabase.co'
    key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZGltcW56ZWxxZGpnbHBtY3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2Mzk3MjAsImV4cCI6MjAzMTIxNTcyMH0.6uCg8sWAd_KL9VG7aad_221tyKxjCWpFoJIx6IRWreQ'

    if not url or not key:
        raise ValueError("Supabase URL and Key must be set in environment variables")
    supabase = create_client(url,  key)

    response = supabase.table("Stats").select("Points").eq("Player", playerName).eq("Date", matchDate).execute()

    points = response.data
    
    totalPoints = 0

    for point in points:
        totalPoints += point.get("Points")  

    return totalPoints

def scoreCalculator (playerName):
    url = 'https://apdimqnzelqdjglpmcqw.supabase.co'
    key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZGltcW56ZWxxZGpnbHBtY3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2Mzk3MjAsImV4cCI6MjAzMTIxNTcyMH0.6uCg8sWAd_KL9VG7aad_221tyKxjCWpFoJIx6IRWreQ'

    if not url or not key:
        raise ValueError("Supabase URL and Key must be set in environment variables")
    supabase = create_client(url,  key)

    response = supabase.table("Stats").select("Points").eq("Player", playerName).execute()

    points = response.data
    
    totalPoints = 0

    for point in points:
        totalPoints += point.get("Points")  

    return totalPoints

scoreCalculator("Conor Kearns")