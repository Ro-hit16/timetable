// frontend/src/pages/Settings/InstitutionSettings.jsx
//
// Lets an admin configure timetable timings (working days, periods,
// start/end time, lunch break, lab duration, default theory duration)
// per department/academic-year scope (or institution-wide when no
// department is selected). Backed by:
//   GET  /api/institution/config/effective  (fetch — merged w/ defaults)
//   POST /api/institution/config            (create, if none saved yet)
//   PUT  /api/institution/config/:id        (update)
// via services/institutionConfigService.js.

import React, { useEffect, useState, useCallback } from 'react';
import institutionConfigService from '../../services/institutionConfigService';
import departmentService from '../../services/departmentService';
import { Button } from '../../components/ui/button';
import {
  Clock,
  Calendar,
  Coffee,
  FlaskConical,
  BookOpen,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const ACADEMIC_YEARS = ['2024-25', '2025-26', '2026-27'];

const DEFAULT_FORM = {
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  periodsPerDay: 6,
  periodStartTime: '09:00',
  periodEndTime: '16:00',
  periodDurationMinutes: 60,
  breakDurationMinutes: 0,
  lunchBreakEnabled: true,
  lunchBreakStart: '13:00',
  lunchBreakEnd: '13:45',
  labDurationPeriods: 2,
  defaultTheoryDurationPeriods: 1,
};

const messageStyles = {
  error: {
    wrap: 'bg-red-50 text-red-700 border border-red-200',
    icon: <AlertCircle className="h-4 w-4 shrink-0" />,
  },
  success: {
    wrap: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: <CheckCircle2 className="h-4 w-4 shrink-0" />,
  },
  info: {
    wrap: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    icon: <Info className="h-4 w-4 shrink-0" />,
  },
};

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600';

// Client-side mirror of the backend's timing-consistency checks
// (backend/modules/institution/utils/timeSlotBuilder.js#validateTimingConfig)
// so invalid input is caught before a round trip, with the same rules:
// valid ranges, positive durations, lunch inside working hours, and
// periods actually fitting between start/end time.
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const validateForm = (form) => {
  const errors = [];

  if (!form.workingDays.length) errors.push('Select at least one working day');
  if (!Number.isInteger(Number(form.periodsPerDay)) || Number(form.periodsPerDay) <= 0) {
    errors.push('Number of periods must be a positive whole number');
  }
  if (!Number.isFinite(Number(form.periodDurationMinutes)) || Number(form.periodDurationMinutes) <= 0) {
    errors.push('Period duration must be a positive number of minutes');
  }
  if (Number(form.breakDurationMinutes) < 0) {
    errors.push('Break duration cannot be negative');
  }
  if (!Number.isInteger(Number(form.labDurationPeriods)) || Number(form.labDurationPeriods) <= 0) {
    errors.push('Lab duration must be a positive whole number of periods');
  }
  if (!Number.isInteger(Number(form.defaultTheoryDurationPeriods)) || Number(form.defaultTheoryDurationPeriods) <= 0) {
    errors.push('Default theory duration must be a positive whole number of periods');
  }

  if (errors.length) return errors;

  const startMin = toMinutes(form.periodStartTime);
  const endMin = toMinutes(form.periodEndTime);
  if (startMin >= endMin) {
    errors.push('Period start time must be before period end time');
    return errors;
  }

  if (form.lunchBreakEnabled) {
    const lunchStartMin = toMinutes(form.lunchBreakStart);
    const lunchEndMin = toMinutes(form.lunchBreakEnd);
    if (lunchStartMin >= lunchEndMin) {
      errors.push('Lunch break start must be before lunch break end');
    } else if (lunchStartMin < startMin || lunchEndMin > endMin) {
      errors.push('Lunch break must fall within the period start/end window');
    }
  }

  // Simulate sequential period layout to catch overlap/overflow, same as
  // the backend's buildTimeSlotsFromConfig.
  const periodsPerDay = Number(form.periodsPerDay);
  const periodDurationMinutes = Number(form.periodDurationMinutes);
  const breakDurationMinutes = Number(form.breakDurationMinutes) || 0;
  let cursor = startMin;
  let lunchInserted = false;
  const lunchStartMin = form.lunchBreakEnabled ? toMinutes(form.lunchBreakStart) : null;
  const lunchEndMin = form.lunchBreakEnabled ? toMinutes(form.lunchBreakEnd) : null;

  for (let i = 0; i < periodsPerDay; i++) {
    if (lunchStartMin != null && !lunchInserted && cursor >= lunchStartMin) {
      cursor = lunchEndMin;
      lunchInserted = true;
    }
    cursor += periodDurationMinutes + breakDurationMinutes;
  }
  if (cursor - breakDurationMinutes > endMin) {
    errors.push(
      `Configured periods (${periodsPerDay} × ${periodDurationMinutes}min, plus breaks) do not fit between ${form.periodStartTime} and ${form.periodEndTime}`
    );
  }

  return errors;
};

const InstitutionSettings = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState(''); // '' = institution-wide
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[1]);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [formErrors, setFormErrors] = useState([]);
  const [source, setSource] = useState(null); // where the loaded values came from

  useEffect(() => {
    departmentService.getDepartmentsForSelect().then(setDepartments).catch(() => setDepartments([]));
  }, []);

  const loadConfig = useCallback(async () => {
    if (!academicYear) return;
    try {
      setLoading(true);
      setMessage('');
      const response = await institutionConfigService.getEffectiveConfig({
        departmentId: departmentId || undefined,
        academicYear,
      });
      const { institutionConfig, sources } = response.data || {};
      if (institutionConfig) {
        setForm({
          workingDays: institutionConfig.workingDays?.length ? institutionConfig.workingDays : DEFAULT_FORM.workingDays,
          periodsPerDay: institutionConfig.periodsPerDay ?? DEFAULT_FORM.periodsPerDay,
          periodStartTime: institutionConfig.periodStartTime || DEFAULT_FORM.periodStartTime,
          periodEndTime: institutionConfig.periodEndTime || DEFAULT_FORM.periodEndTime,
          periodDurationMinutes: institutionConfig.periodDurationMinutes ?? DEFAULT_FORM.periodDurationMinutes,
          breakDurationMinutes: institutionConfig.breakDurationMinutes ?? DEFAULT_FORM.breakDurationMinutes,
          lunchBreakEnabled: Boolean(institutionConfig.lunchBreakStart && institutionConfig.lunchBreakEnd),
          lunchBreakStart: institutionConfig.lunchBreakStart || DEFAULT_FORM.lunchBreakStart,
          lunchBreakEnd: institutionConfig.lunchBreakEnd || DEFAULT_FORM.lunchBreakEnd,
          labDurationPeriods: institutionConfig.defaultLabRules?.consecutiveBlockSize ?? DEFAULT_FORM.labDurationPeriods,
          defaultTheoryDurationPeriods:
            institutionConfig.defaultTheoryRules?.sessionDurationPeriods ?? DEFAULT_FORM.defaultTheoryDurationPeriods,
        });
      }
      setSource(sources?.[sources.length - 1] || null);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to load timetable settings');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, [departmentId, academicYear]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const toggleWorkingDay = (day) => {
    setForm((prev) => {
      const has = prev.workingDays.includes(day);
      const workingDays = has
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays };
    });
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = validateForm(form);
    setFormErrors(errors);
    if (errors.length) {
      setMessage('Please fix the highlighted issues before saving');
      setMessageType('error');
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      const payload = {
        workingDays: form.workingDays,
        periodsPerDay: Number(form.periodsPerDay),
        periodStartTime: form.periodStartTime,
        periodEndTime: form.periodEndTime,
        periodDurationMinutes: Number(form.periodDurationMinutes),
        breakDurationMinutes: Number(form.breakDurationMinutes) || 0,
        lunchBreakStart: form.lunchBreakEnabled ? form.lunchBreakStart : null,
        lunchBreakEnd: form.lunchBreakEnabled ? form.lunchBreakEnd : null,
        defaultLabRules: { consecutiveBlockSize: Number(form.labDurationPeriods) },
        defaultTheoryRules: { sessionDurationPeriods: Number(form.defaultTheoryDurationPeriods) },
      };

      await institutionConfigService.saveConfig({ departmentId: departmentId || null, academicYear }, payload);
      setMessage('Timetable settings saved. New generations will use these timings.');
      setMessageType('success');
      await loadConfig();
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length) {
        setFormErrors(apiErrors.map((d) => d.message || String(d)));
      }
      setMessage(error?.response?.data?.message || 'Failed to save timetable settings');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Academic Setup</p>
            <h1 className="text-2xl font-semibold text-slate-900 mt-1">Institution Settings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure timetable timings. These apply automatically the next time a timetable is generated.
            </p>
          </div>
          <Button onClick={loadConfig} variant="outline" className="flex items-center gap-2" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Reload
          </Button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${messageStyles[messageType]?.wrap}`}>
            <div className="flex items-start gap-2 text-sm font-medium">
              {messageStyles[messageType]?.icon}
              <div>
                <div>{message}</div>
                {formErrors.length > 0 && (
                  <ul className="mt-1 ml-1 list-disc list-inside text-xs font-normal space-y-0.5">
                    {formErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scope selector */}
        <div className="bg-white p-5 rounded-xl mb-6 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Department (optional — leave blank for institution-wide)</label>
              <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className={inputClass}>
                <option value="">Institution-wide default</option>
                {departments.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Academic year</label>
              <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className={inputClass}>
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {source && (
            <p className="text-xs text-slate-400 mt-3">
              Currently showing values resolved from: <span className="font-medium text-slate-500">{source}</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="bg-white p-10 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500">
            <RefreshCw className="animate-spin mx-auto mb-3 text-indigo-500" size={22} />
            Loading timetable settings…
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8">
            {/* Working days */}
            <div>
              <label className={labelClass}>
                <Calendar className="h-3.5 w-3.5" /> Working days
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {ALL_DAYS.map((day) => {
                  const active = form.workingDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleWorkingDay(day)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Periods */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>
                  <Clock className="h-3.5 w-3.5" /> Number of periods
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.periodsPerDay}
                  onChange={handleChange('periodsPerDay')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <Clock className="h-3.5 w-3.5" /> Period start time
                </label>
                <input
                  type="time"
                  value={form.periodStartTime}
                  onChange={handleChange('periodStartTime')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <Clock className="h-3.5 w-3.5" /> Period end time
                </label>
                <input
                  type="time"
                  value={form.periodEndTime}
                  onChange={handleChange('periodEndTime')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <Clock className="h-3.5 w-3.5" /> Period duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.periodDurationMinutes}
                  onChange={handleChange('periodDurationMinutes')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <Clock className="h-3.5 w-3.5" /> Break between periods (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.breakDurationMinutes}
                  onChange={handleChange('breakDurationMinutes')}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Lunch break */}
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={form.lunchBreakEnabled}
                  onChange={handleChange('lunchBreakEnabled')}
                  className="rounded border-slate-300"
                />
                <Coffee className="h-3.5 w-3.5" /> Lunch break
              </label>
              {form.lunchBreakEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Lunch break start</label>
                    <input
                      type="time"
                      value={form.lunchBreakStart}
                      onChange={handleChange('lunchBreakStart')}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Lunch break end</label>
                    <input
                      type="time"
                      value={form.lunchBreakEnd}
                      onChange={handleChange('lunchBreakEnd')}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lab / theory durations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <FlaskConical className="h-3.5 w-3.5" /> Lab duration (consecutive periods)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.labDurationPeriods}
                  onChange={handleChange('labDurationPeriods')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <BookOpen className="h-3.5 w-3.5" /> Default theory duration (periods)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.defaultTheoryDurationPeriods}
                  onChange={handleChange('defaultTheoryDurationPeriods')}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button type="submit" disabled={saving} className="flex items-center gap-2">
                <Save size={16} className={saving ? 'animate-pulse' : ''} />
                {saving ? 'Saving…' : 'Save Settings'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InstitutionSettings;
