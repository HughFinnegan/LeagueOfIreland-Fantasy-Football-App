import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from team import *

driver = webdriver.Chrome()
driver.get('https://www.flashscore.com/football/ireland/premier-division/standings/#/dxrviyLi/table/overall')

try:
    WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, "onetrust-reject-all-handler"))).click()
    print("Clicked cookie button.")
except Exception as e:
    print("Cookie button not found or already handled:", str(e))

try:
    WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "tableWrapper")))
    print("Standings table loaded.")
except TimeoutException:
    print("Standings table did not load in time.")

try:
    standings_table = driver.find_element(By.CLASS_NAME, "tableWrapper")
    rows = standings_table.find_elements(By.CLASS_NAME, "ui-table__row")
    print(f"Found {len(rows)} rows in the standings table.")
except NoSuchElementException:
    print("Failed to locate standings table or rows.")
    rows = []

teams = []
for row in rows:
    name = "Unknown Team"
    try:
        position = row.find_elements(By.CLASS_NAME, "tableCellRank")
        if position:
            position_name = position[0].text.split('.', 1)
            position = int(position_name[0])

        name_elements = row.find_elements(By.CLASS_NAME, "tableCellParticipant__block")
        if name_elements:
            name = name_elements[0].text
        else:
            name = "Unknown Team"

        variety = row.find_elements(By.CLASS_NAME, "table__cell--value   ")
        if variety:
            gamesPlayed = variety[0].text
            wins = variety[1].text
            draws = variety[2].text
            losses = variety[3].text
            goals = variety[4].text
            goalDiff = variety[5].text
            points = variety[6].text

        
        formPast = row.find_elements(By.CLASS_NAME, "_webTypeSimpleText01_18bk2_8")
        form = formPast[0].text+ formPast[1].text+ formPast[2].text+ formPast[3].text+ formPast[4].text+ formPast[5].text

        team = Team(name, position, wins, draws, losses, gamesPlayed, goals, goalDiff, points, form)
        teams.append(team)
    except Exception as e:
        print(f"Error processing row: {str(e)}")

with open('league_standings.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Name', 'Position', 'Games Played', 'Wins', 'Draws', 'Losses', 'Goals', 'Goal Diff', 'Points', 'Form'])
    for team in teams:
        writer.writerow([team.name, team.position, team.gamesPlayed, team.wins, team.draws, team.losses, team.goals, team.goalDiff, team.points, team.form])

driver.quit()

