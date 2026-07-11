// backend/modules/institution/service/gaAdapter.service.js
//
// GAAdapter converts a SchedulerContext (produced by
// institutionConfigResolver.service.js) into the plain configuration
// object that backend/utils/timetableGenerator.js's GeneticAlgorithm
// class constructor already accepts today.
//
// Design constraint: timetableGenerator.js must NOT know anything about
// MongoDB, Mongoose, or this module's models. This file honors that by
// only ever producing a plain JS object — it never imports
// timetableGenerator.js, never constructs a GeneticAlgorithm instance,
// and never calls .generateSchedule(). Constructing the GA and calling
// this adapter is left entirely to whichever controller wires them
// together in a future, separately-scoped integration task.
//
// IMPORTANT: this file is NOT imported by timetables.controller.js or
// timetableGenerator.js anywhere in this task. Nothing here changes
// current generation behavior.

/**
 * Builds the GA constructor config object (population size, generations,
 * rates, required identifiers) from a SchedulerContext. Every key here
 * already exists as an accepted constructor option today in
 * timetableGenerator.js — no new GA parameter is introduced. `null`/
 * `undefined` values are omitted so the GA's own internal
 * default/clamp logic (e.g. `config.populationSize || 150`) applies
 * exactly as it does today when a caller doesn't pass that key.
 *
 * @param {import('../../shared/schedulerContext.js').SchedulerContext} schedulerContext
 * @param {Object} params
 * @param {string} params.departmentId - required by the GA constructor today
 * @param {string} params.semester - required by the GA constructor today. NOTE:
 *   `semester` is deliberately NOT part of SchedulerContext.scope — a
 *   resolved InstitutionConfig/GAProfile applies across an entire
 *   academicYear regardless of semester, so semester is a per-generation-
 *   request parameter supplied by the caller here, not a config-scope
 *   dimension resolved earlier.
 * @param {string[]} params.divisions - required by the GA constructor today
 * @returns {Object} plain config object suitable for `new GeneticAlgorithm(config)`
 */
export const buildGAConstructorConfig = (
  schedulerContext,
  { departmentId, semester, divisions } = {}
) => {
  if (!schedulerContext) {
    throw new Error('buildGAConstructorConfig requires a SchedulerContext');
  }

  const { gaProfile, scope } = schedulerContext;

  const config = {
    departmentId: departmentId ?? scope.departmentId,
    semester,
    academicYear: scope.academicYear,
    divisions: divisions || [],
  };

  if (gaProfile?.populationSize != null) config.populationSize = gaProfile.populationSize;
  if (gaProfile?.maxGenerations != null) config.maxGenerations = gaProfile.maxGenerations;
  if (gaProfile?.mutationRate != null) config.mutationRate = gaProfile.mutationRate;
  if (gaProfile?.crossoverRate != null) config.crossoverRate = gaProfile.crossoverRate;
  if (gaProfile?.elitismRate != null) config.elitismRate = gaProfile.elitismRate;

  return config;
};

/**
 * Returns the sparse penalty-override map from a SchedulerContext's
 * GAProfile, e.g. `{ TEACHER_CLASH: -20000 }`. This is NOT applied to
 * anything in this file — a future integration step would apply it via
 * `Object.assign(gaInstance.penalties, penaltyOverrides)` on an already-
 * constructed GeneticAlgorithm instance, since `penalties` is a public
 * instance property. Exposed here only as a plain data getter.
 *
 * @param {import('../../shared/schedulerContext.js').SchedulerContext} schedulerContext
 * @returns {Object} sparse map of penalty-key -> numeric override
 */
export const getPenaltyOverrides = (schedulerContext) => {
  return schedulerContext?.gaProfile?.penaltyOverrides || {};
};

/**
 * Returns the resolved scheduling rules (working days, periods/day, slot
 * preferences, etc.) from a SchedulerContext, in the flattened shape
 * `resolvedRules` already provides. This is exposed here purely as a
 * convenience passthrough for a future Phase 2 integration that would
 * teach timetableGenerator.js to read `this.days` / `this.periodsPerDay`
 * from a passed-in config instead of the hardcoded constants it uses
 * today. Nothing calls this function anywhere in this task.
 *
 * @param {import('../../shared/schedulerContext.js').SchedulerContext} schedulerContext
 * @returns {Object}
 */
export const getResolvedSchedulingRules = (schedulerContext) => {
  return schedulerContext?.resolvedRules || {};
};

export default {
  buildGAConstructorConfig,
  getPenaltyOverrides,
  getResolvedSchedulingRules,
};