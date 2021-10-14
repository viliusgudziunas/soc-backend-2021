export const StandingsQueries = {
  getAggregates: (): string => `
    SELECT 
      u.id as "userId",
      u.name,
      SUM(w."caloriesBurnt") as "caloriesBurnt",
      SUM(w."timeSpent") as "timeSpent"
    FROM workouts w
    INNER JOIN users u
      ON "userId" = u.id
    GROUP BY u.id
    ORDER BY "caloriesBurnt" DESC;
  `,
};
