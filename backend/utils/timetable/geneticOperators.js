/**
 * Genetic Operators (Selection, Crossover, Mutation)
 */

export function selection(population, fitnessScores) {
  if (!population?.length || population.length !== fitnessScores?.length) {
    return population || [];
  }

  const TOURNAMENT_SIZE = 3;
  const selected = [];

  for (let i = 0; i < population.length; i++) {
    let bestIdx   = -1;
    let bestScore = -Infinity;

    for (let t = 0; t < TOURNAMENT_SIZE; t++) {
      const idx = Math.floor(Math.random() * population.length);
      if (fitnessScores[idx] > bestScore) {
        bestScore = fitnessScores[idx];
        bestIdx   = idx;
      }
    }

    selected.push(JSON.parse(JSON.stringify(population[bestIdx])));
  }

  return selected;
}

export function crossover(parent1, parent2, crossoverRate, periodsPerDay, days) {
  if (!parent1 || !parent2 || Math.random() > crossoverRate) {
    return parent1 ? JSON.parse(JSON.stringify(parent1)) : {};
  }

  const child = {};
  const divisions = Object.keys(parent1);

  for (const division of divisions) {
    child[division] = {};
    
    for (const day of days) {
      const crossoverPoint = Math.floor(Math.random() * periodsPerDay);
      const parent1Slots = parent1[division]?.[day] || new Array(periodsPerDay).fill(null);
      const parent2Slots = parent2[division]?.[day] || new Array(periodsPerDay).fill(null);

      child[division][day] = [
        ...parent1Slots.slice(0, crossoverPoint),
        ...parent2Slots.slice(crossoverPoint)
      ];
    }
  }

  return child;
}

export function mutate(schedule, mutationRate, periodsPerDay, days) {
  if (!schedule || Math.random() > mutationRate) {
    return JSON.parse(JSON.stringify(schedule));
  }

  const mutated   = JSON.parse(JSON.stringify(schedule));
  const divisions = Object.keys(mutated);
  if (!divisions.length) return mutated;

  const r      = Math.random();
  const isLab  = (slot) => slot?.subject?.type === 'practical' || slot?.subject?.type === 'lab';
  const pickRand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (r < 0.30) {
    // Type 1: Intra-day swap
    const division = pickRand(divisions);
    const day      = pickRand(days);
    const p1 = Math.floor(Math.random() * periodsPerDay);
    const p2 = Math.floor(Math.random() * periodsPerDay);
    if (mutated[division]?.[day] &&
        !isLab(mutated[division][day][p1]) &&
        !isLab(mutated[division][day][p2])) {
      const temp = mutated[division][day][p1];
      mutated[division][day][p1] = mutated[division][day][p2];
      mutated[division][day][p2] = temp;
    }

  } else if (r < 0.58) {
    // Type 2: Cross-day swap
    const division = pickRand(divisions);
    const day1 = pickRand(days);
    const day2 = pickRand(days);
    if (day1 !== day2) {
      const p1    = Math.floor(Math.random() * periodsPerDay);
      const p2    = Math.floor(Math.random() * periodsPerDay);
      const slot1 = mutated[division]?.[day1]?.[p1];
      const slot2 = mutated[division]?.[day2]?.[p2];
      if (slot1 && slot2 && !isLab(slot1) && !isLab(slot2)) {
        mutated[division][day1][p1] = { ...slot2, period: p1 + 1 };
        mutated[division][day2][p2] = { ...slot1, period: p2 + 1 };
      }
    }

  } else if (r < 0.78) {
    // Type 3: Cross-division room swap
    if (divisions.length >= 2) {
      const div1 = pickRand(divisions);
      let div2   = pickRand(divisions);
      if (div1 === div2) div2 = divisions[(divisions.indexOf(div1) + 1) % divisions.length];
      const day    = pickRand(days);
      const period = Math.floor(Math.random() * periodsPerDay);
      const slot1  = mutated[div1]?.[day]?.[period];
      const slot2  = mutated[div2]?.[day]?.[period];
      if (slot1 && slot2 && !isLab(slot1) && !isLab(slot2)) {
        const room1 = slot1.classroom;
        mutated[div1][day][period] = { ...slot1, classroom: slot2.classroom };
        mutated[div2][day][period] = { ...slot2, classroom: room1 };
      }
    }

  } else if (r < 0.90) {
    // Type 4: Subject spacing repair
    const division = pickRand(divisions);
    const subDays = {};
    for (let di = 0; di < days.length; di++) {
      const day     = days[di];
      const daySlots = mutated[division]?.[day] || [];
      daySlots.forEach((slot, pi) => {
        if (!slot?.subject?._id || isLab(slot)) return;
        const sId = String(slot.subject._id);
        if (!subDays[sId]) subDays[sId] = [];
        subDays[sId].push({ di, pi, day });
      });
    }

    for (const [sId, entries] of Object.entries(subDays)) {
      if (entries.length < 2) continue;
      const sorted = entries.sort((a, b) => a.di - b.di);
      for (let k = 0; k < sorted.length - 1; k++) {
        if (sorted[k + 1].di - sorted[k].di !== 1) continue;

        const victim     = sorted[k + 1];
        const usedDayIdx = new Set(entries.map(e => e.di));
        const freeDays   = days
          .map((d, idx) => ({ d, idx }))
          .filter(({ idx }) => !usedDayIdx.has(idx) ||
            (idx !== sorted[k].di && idx !== victim.di))
          .filter(({ d, idx }) => {
            return Math.abs(idx - sorted[k].di) > 1;
          });

        if (freeDays.length === 0) break;
        const target = pickRand(freeDays);

        const targetSlots = mutated[division]?.[target.d] || [];
        const freeSlot = targetSlots.findIndex(s => s === null);
        if (freeSlot === -1) break;

        mutated[division][target.d][freeSlot] = {
          ...mutated[division][victim.day][victim.pi],
          period: freeSlot + 1
        };
        mutated[division][victim.day][victim.pi] = null;
        break;
      }
      break; 
    }

  } else {
    // Type 5: Nullify
    const division = pickRand(divisions);
    const day      = pickRand(days);
    const period   = Math.floor(Math.random() * periodsPerDay);
    if (mutated[division]?.[day] && !isLab(mutated[division][day][period])) {
      mutated[division][day][period] = null;
    }
  }

  return mutated;
}
