/**
 * Genetic Algorithm Parameters and Penalty Configuration
 */
export const GA_CONFIG = {
  defaultPopulationSize: 150,
  defaultMaxGenerations: 800,
  defaultMutationRate: 0.15,
  defaultCrossoverRate: 0.8,
  defaultElitismRate: 0.1,
  periodsPerDay: 6,
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  
  penalties: {
    // ── Hard constraints (catastrophic — must never happen) ───────────────
    TEACHER_CLASH:     -15000,
    ROOM_CLASH:        -15000,
    UNAVAILABLE_SLOT:  -10000,

    // ── Soft constraint penalties ─────────────────────────────────────────
    TEACHER_OVERLOAD:       -1000,
    CAPACITY_CLASH:         -1000,
    WORKLOAD_DEVIATION:     -800,  // per missing/extra period vs target
    SUBJECT_OVERLOAD:       -60,   // >2 occurrences of same subject per day
    LAB_NOT_CONSECUTIVE:    -200,
    LAB_WRONG_SLOT:         -80,
    UNWANTED_FREE:          -20,   // internal gap between lectures

    // ── Spacing and Distribution Penalties ────────────────────────────────
    SUBJECT_CONSEC_DAY:     -150,  // same subject on back-to-back days
    TEACHER_CONSEC_LECTURE: -25,   // each consecutive lecture beyond 2 in a row
    TEACHER_IDLE_GAP:       -30,   // gap (null) between teacher's lectures same day
    LAB_SAME_WEEK_CLUSTER:  -80,   // lab scheduled on adjacent days same week
    ROOM_INCONSISTENCY:     -5,    // different room for same subject across days

    // ── Reward bonuses ────────────────────────────────────────────────────
    PREFERRED_SLOT:             15,
    FILLED_SLOT:                 5,
    BALANCED_DISTRIBUTION:      20,
    VARIETY_BONUS:              25,  // ≥4 distinct subjects per day
    LAB_PAIR_REWARD:            60,  // correctly placed consecutive lab pair
    TEACHER_UTILISATION_REWARD:  3,  // per period actively teaching
    ROOM_UTILISATION_REWARD:     2,  // unique room-period used without clash
    WORKLOAD_MATCH_BONUS:       80,  // exact weekly target hit per subject
    TEACHER_LOAD_BALANCE_BONUS: 30,  // teacher load 60–100% of weekly limit

    // ── Distribution & Spacing rewards ────────────────────────────────────
    SUBJECT_SPREAD_BONUS:       40,  // subject well-spread across week (no cluster)
    TEACHER_COMPACT_BONUS:      20,  // teacher's lectures are compact (no idle gaps)
    ROOM_CONSISTENT_BONUS:       8,  // same room used for same subject across days
    LAB_SPREAD_BONUS:           35,  // lab days are non-adjacent in the week
    DIVISION_FAIRNESS_BONUS:    50   // all divisions have similar schedule density
  }
};
