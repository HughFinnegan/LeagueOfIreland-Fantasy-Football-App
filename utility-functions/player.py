class Player:
    def __init__(self, name, position, nationality, age, club, value):
        self.name = name
        self.position = position
        self.nationality = nationality
        self.age = age
        self.club = club
        self.value = value

    def __init__(self, name, position, nationality, age, club, value, games, goals, assists, yellows, reds, points):
        self.name = name
        self.position = position
        self.nationality = nationality
        self.age = age
        self.club = club
        self.value = value
        self.games = games
        self.goals = goals
        self.assists = assists
        self.yellows = yellows
        self.reds = reds
        self.points = points

    def to_list(self):
        return [self.name, self.position, self.nationality, self.age, self.club, self.value, self.games, self.goals, self.assists, self.yellows, self.reds, self.points]