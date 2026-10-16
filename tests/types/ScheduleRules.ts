export interface ScheduleTestCase {
    scenarioName: string;
    rulesToType: string[];
    expectedAssertions: {
        // Time Rules
        noMatchesBefore?: string;
        noMatchesAfter?: string;
        noMatchesBetween?: { start: string; end: string }[];
        noMatchesBeforeAtLocation?: { location: string; time: string }[];
        noMatchesAfterAtLocation?: { location: string; time: string }[];
        noMatchesBetweenAtLocation?: { location: string; start: string; end: string }[];

        // Court Rules
        courtBlockedTimes?: { court: string; before?: string; after?: string; start?: string; end?: string }[];
        noMatchesOnCourt?: string[];
        noMatchesOnCourtAtLocation?: { court: string; location: string }[];

        // Team Rules
        teamMaxMatchesPerDay?: { team: string; max: number };
        teamMustPlayOnCourt?: { team: string; court: string };
        teamMustPlayAtLocation?: { team: string; location: string };
        teamBlockedTimes?: { team: string; location?: string; before?: string; after?: string }[];
        teamsCannotPlaySimultaneously?: string[];
        matchupMustBeFirstGame?: { teamA: string; teamB: string; location?: string };
        matchupCannotBeLastGame?: { teamA: string; teamB: string; location?: string };
    };
}
