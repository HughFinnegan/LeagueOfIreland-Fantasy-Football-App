class Event:
    def __init__(self, ID, date, homeTeam, awayTeam, player, club, eventType, points):
        self.ID = ID
        self.date = date
        self.homeTeam = homeTeam
        self.awayTeam = awayTeam
        self.player = player
        self.club = club
        self.eventType = eventType
        self.points = points

    def to_list(self):
        return [self.ID, self.date, self.homeTeam, self.awayTeam, self.player, self.club, self.eventType, self.points]