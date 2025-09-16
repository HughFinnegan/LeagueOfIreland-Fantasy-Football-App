import math
from scraperFunctions import *
from player import *
from event import *
from multiprocessing.sharedctypes import Value
import datetime
from datetime import datetime
import time

OVER_60 = 2
UNDER_60 = 1
GOAL_FORWARD = 4
GOAL_MIDFIELDER = 5
GOAL_DEFENDER = 6
TWO_CONCEDED = -1
ASSIST = 3
CLEAN = 4
CLEAN_MIDFIELDER = 1
YELLOW = -1
RED = -3

year = datetime.now().year
SEASON_YEAR = year - 2000

start = time.time()

statsPath = 'stats_data.csv'
playerPath = 'player_data.csv'

def initCSV(filePath):
    with open(filePath, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        if filePath == 'stats_data.csv':
            writer.writerow(['ID', 'Date', 'Home Team', 'Away Team', 'Player', 'Club', 'Event Type', 'Points'])
        elif filePath == 'player_data.csv':
            writer.writerow(['Name', 'Position', 'Nationality', 'Age', 'Club', 'Value', 'Games', 'Goals', 'Assists', 'Yellows', 'Reds', 'Points'])

def writeCSV(filePath, row):
    with open(filePath, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(row)

initCSV(statsPath)
initCSV(playerPath)

driver.get('https://www.flashscore.com/football/ireland/premier-division/standings/#/dxrviyLi/table/overall')

time.sleep(1)

rejectCookies = waitAndFind(driver, 'onetrust-reject-all-handler', ID)
rejectCookies.click()

teamCounter = 0

while True:
    teamStart = time.time()

    time.sleep(2)

    teams = driver.find_elements(By.CLASS_NAME, 'tableCellParticipant__name')
    try:
        team = teams[teamCounter]
    except IndexError:
        break

    club = team.accessible_name
    team.click()

    squadTab = waitAndFind(driver, 'tabs__tab.squad', CLASS)
    squadTab.click()

    playerCounter = 0

    while True:
        playerStart = time.time()

        totalGames = 0
        totalGoals = 0
        totalAssists = 0
        totalYellows = 0
        totalReds = 0
        totalPoints = 0

        time.sleep(1)

        player = driver.find_elements(By.CLASS_NAME, 'lineupTable__cell--name')[playerCounter]
        try:
            player.click()
        except ElementNotInteractableException:
            break

        name = waitAndFind(driver, '_webTypeHeading02_wy92v_12', CLASS).text
        try:
            nationality = driver.find_elements(By.CLASS_NAME, '_overline_1bkps_4._webTypeOverline02_1bkps_16')[1].text
            playerInfo = driver.find_elements(By.CLASS_NAME, '_simpleText_18bk2_4._webTypeSimpleText01_18bk2_8')
            position = playerInfo[0].text
            age = playerInfo[2].text
            try:
                age = int(age)
            except:
                age = 18
            value = playerInfo[5].text
            if value[len(value) - 1] != 'k':
                value = 'N/A'
        except:
            print("INFO MISSING")

        try:
            showMoreMatches = driver.find_element(By.CLASS_NAME, 'lmTable__href')
            moreMatches = True
        except:
            moreMatches = False

        if moreMatches:
            showMoreMatches.click()

            time.sleep(1)

            matches = driver.find_elements(By.CLASS_NAME, 'lmTable__row.lmTable__row--ratings.lmTable__row--soccer')

            for match in matches:
                date = match.find_element(By.CLASS_NAME, 'lmTable__date').text
                dateYear = date[len(date) - 2 : len(date)]
                if int(dateYear) != SEASON_YEAR:
                    break
                
                teams = match.find_elements(By.CLASS_NAME, 'lmTable__teamName')

                if teams[0].text == club:
                    goalsConceded = int(match.find_element(By.CLASS_NAME, 'lmTable__result.lmTable__result--away').text)
                    opponent = teams[1].text

                    homeTeam = club
                    awayTeam = opponent
                elif teams[1].text == club:
                    goalsConceded = int(match.find_element(By.CLASS_NAME, 'lmTable__result.lmTable__result--home').text)
                    opponent = teams[0].text
                    homeTeam = opponent
                    awayTeam = club

                # rating = float(match.find_element(By.CLASS_NAME, 'playerRating.playerRating--high.lmTable__playerRating').text)

                stats = match.find_elements(By.CLASS_NAME, 'lmTable__iconText')
                try:
                    minutes = int(stats[0].text[0 : len(stats[0].text) - 1])
                    played = True
                except IndexError:
                    played = False
                if played:
                    if minutes >= 60:
                        minutesEvent = Event(name + " " + opponent + " " + date + " Minutes", date, homeTeam, awayTeam, name, club, 'over60', OVER_60)
                        writeCSV(statsPath, minutesEvent.to_list())
                        totalGames += 1
                        totalPoints += OVER_60
                    elif minutes < 60:
                        minutesEvent = Event(name + " " + opponent + " " + date + " Minutes", date, homeTeam, awayTeam, name, club, 'under60', UNDER_60)
                        writeCSV(statsPath, minutesEvent.to_list())
                        totalGames += 1
                        totalPoints += UNDER_60

                    try:
                        goals = int(stats[1].text)
                        dataMissing = False
                    except ValueError:
                        print("DATA MISSING")
                        dataMissing = True
                    if(not dataMissing):
                        for goal in range(goals):
                            totalGoals += 1
                            if position == "Goalkeeper " or position == "Defender ":
                                addedPoints = GOAL_DEFENDER
                            elif position == "Midfielder ":
                                addedPoints = GOAL_MIDFIELDER
                            elif position == "Forward ":
                                addedPoints = GOAL_FORWARD
                            else:
                                print("GOALS ERROR " + name)
                            goalEvent = Event(name + " " + opponent + " " + date + " Goal " + str(goal + 1), date, homeTeam, awayTeam, name, club, 'goal', addedPoints)
                            writeCSV(statsPath, goalEvent.to_list())
                            totalPoints += addedPoints
                            
                        assists = int(stats[2].text)
                        for assist in range(assists):
                            assistEvent = Event(name + " " + opponent + " " + date + " Assist " + str(assist + 1), date, homeTeam, awayTeam, name, club, 'assist', ASSIST)
                            writeCSV(statsPath, assistEvent.to_list())
                            totalAssists += 1
                            totalPoints += ASSIST

                        yellowCards = int(stats[3].text)
                        for card in range(yellowCards):
                            cardEvent = Event(name + " " + opponent + " " + date + " Yellow " + str(card + 1), date, homeTeam, awayTeam, name, club, 'yellow', YELLOW)
                            writeCSV(statsPath, cardEvent.to_list())
                            totalYellows += 1
                            totalPoints += YELLOW

                        redCards = int(stats[4].text)
                        for card in range(redCards):
                            cardEvent = Event(name + " " + opponent + " " + date + " Red " + str(card + 1), date, homeTeam, awayTeam, name, club, 'red', RED)
                            writeCSV(statsPath, cardEvent.to_list())
                            totalReds += 1
                            totalPoints += RED

                    if goalsConceded == 0 and (position != 'Forward '):
                        if position == "Goalkeeper " or position == "Defender ":
                            addedPoints = CLEAN
                        elif position == "Midfielder ":
                            addedPoints = CLEAN_MIDFIELDER
                        else:
                            print("CLEAN ERROR " + name)
                        cleanEvent =  Event(name + " " + opponent + " " + date + " Clean Sheet", date, homeTeam, awayTeam, name, club, 'clean', addedPoints)
                        writeCSV(statsPath, cleanEvent.to_list())
                        totalPoints += addedPoints
                    elif position != 'Forward' or position != 'Midfielder':
                        concededCounter = math.floor(goalsConceded / 2)
                        for goal in range(concededCounter):
                            concededEvent = Event(name + " " + opponent + " " + date + " Conceded " + str(2 * (goal + 1)), date, homeTeam, awayTeam, name, club, 'twoconceded', TWO_CONCEDED)
                            writeCSV(statsPath, concededEvent.to_list())
                            totalPoints += TWO_CONCEDED
        
        player = Player(name, position, nationality, age, club, value, totalGames, totalGoals, totalAssists, totalYellows, totalReds, totalPoints)
        writeCSV(playerPath, player.to_list())
            
        print("Player: " + name + " processed in " + str(time.time() - playerStart))

        playerCounter = playerCounter + 1
        driver.back()

    print("Team: " + club + " processed in " + str(time.time() - teamStart))

    teamCounter = teamCounter + 1
    driver.back()
    driver.back()

print("Whole process finished in " + str(time.time() - start))
driver.quit()



