// backend/modules/shared/SchedulerContext.js
//
// SchedulerContext is the single, standard object produced by
// InstitutionConfigResolver and consumed by GAAdapter (and, in the
// future, by any Exam / Leave / Analytics module). It intentionally
// lives outside backend/modules/institution/ so it is not "owned" by the
// institution module — every future module reuses this exact shape,
// which is what keeps this monolith microservice-ready: a future
// extraction of any one module only needs to serialize/deserialize this
// object across a network boundary instead of an in-process call.
//
// This file exports:
//   - a factory function `createSchedulerContext(...)` that builds a
//     well-shaped, defaulted context object
//   - no database access, no Express, no dependency on any other module's
//     internals — pure data shaping only.

/**
 * @typedef {Object} SchedulerContext
 * @property {Object} scope                 - { departmentId, academicYear }
 * @property {Object} institutionConfig      - resolved InstitutionConfig (plain object, defaults applied)
 * @property {Object[]} teacherPreferences   - resolved TeacherPreference documents (plain objects)
 * @property {Object|null} departmentPreference - resolved DepartmentPreference document (plain object) or null
 * @property {Object} gaProfile              - resolved GAProfile (plain object, defaults applied)
 * @property {Object} resolvedRules          - flattened, ready-to-consume rules derived from the above
 *                                             (this is what a future GAAdapter-equivalent for any other
 *                                             module should read first, before reaching into the raw
 *                                             sub-objects above)
 * @property {Object} metadata               - { resolvedAt, sources } - provenance/debugging info
 */

/**
 * Builds a well-shaped SchedulerContext object. Every field is present
 * (never undefined) so downstream consumers never need defensive
 * optional-chaining just to read the shape itself — only the values
 * inside may be empty/default.
 *
 * @param {Object} params
 * @param {{ departmentId: (string|null), academicYear: string }} params.scope
 * @param {Object} [params.institutionConfig]
 * @param {Object[]} [params.teacherPreferences]
 * @param {Object|null} [params.departmentPreference]
 * @param {Object} [params.gaProfile]
 * @param {Object} [params.resolvedRules]
 * @param {Object} [params.metadata]
 * @returns {SchedulerContext}
 */
export const createSchedulerContext = ({
  scope,
  institutionConfig = {},
  teacherPreferences = [],
  departmentPreference = null,
  gaProfile = {},
  resolvedRules = {},
  metadata = {},
} = {}) => {
  if (!scope || !scope.academicYear) {
    throw new Error(
      'createSchedulerContext requires scope.academicYear to be set'
    );
  }

  return {
    scope: {
      departmentId: scope.departmentId || null,
      academicYear: scope.academicYear,
    },
    institutionConfig,
    teacherPreferences,
    departmentPreference,
    gaProfile,
    resolvedRules,
    metadata: {
      resolvedAt: metadata.resolvedAt || new Date().toISOString(),
      sources: metadata.sources || [],
      ...metadata,
    },
  };
};

export default { createSchedulerContext };