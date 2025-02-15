/**
 * This module uses a greatly simplified apl to check for rune waste (e.g. bad Marrowrend or Death's Caress casts).
 * @module
 */

import SPELLS from 'common/SPELLS';
import talents from 'common/TALENTS/deathknight';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import ResourceLink from 'interface/ResourceLink';
import { Highlight } from 'interface/Highlight';

import SpellLink from 'interface/SpellLink';
import { useEvents, useInfo } from 'interface/guide';
import ViolationProblemList from 'interface/guide/components/Apl/violations';
import {
  ActualCastDescription,
  ViolationExplainer,
} from 'interface/guide/components/Apl/violations/claims';
import SuggestionBox from 'interface/suggestion-box/SuggestionBox';
import { AnyEvent } from 'parser/core/Events';
import aplCheck, { CheckResult, PlayerInfo, Violation, build } from 'parser/shared/metrics/apl';
import * as cnd from 'parser/shared/metrics/apl/conditions';
import { QualitativePerformance } from 'parser/ui/QualitativePerformance';
import { useMemo } from 'react';
import { runeRules } from './AplCheck';
const RunicPowerColor = 'hsl(191, 60%, 50%)';

const runePrio = build([
  // drw prio
  runeRules.drw.marrowrend,
  runeRules.drw.soulReaper,
  runeRules.drw.marrowrendMissing,
  {
    spell: talents.HEART_STRIKE_TALENT,
    condition: cnd.buffPresent(SPELLS.DANCING_RUNE_WEAPON_TALENT_BUFF),
  },
  // basic prio
  runeRules.deathsCaress,
  runeRules.marrowrend,
  runeRules.soulReaper,
  talents.HEART_STRIKE_TALENT,
  talents.DEATHS_CARESS_TALENT,
]);

const check = aplCheck(runePrio);
function useRuneWasteProblems(events: AnyEvent[], info?: PlayerInfo) {
  const { successes, violations } = useMemo(
    (): Partial<CheckResult> => (info ? check(events, info) : {}),
    [events, info],
  );
  if (!successes || !violations) {
    return null;
  }

  return {
    claimData: boneShieldViolations(violations),
    result: { successes, violations },
    apl: runePrio,
  };
}

function boneShieldViolations(violations: Violation[]) {
  const resultSet = new Set<Violation>();
  for (const violation of violations) {
    if (
      violation.actualCast.ability.guid === talents.MARROWREND_TALENT.id ||
      violation.actualCast.ability.guid === talents.DEATHS_CARESS_TALENT.id
    ) {
      resultSet.add(violation);
    }
  }

  return {
    claims: resultSet,
    data: null,
  };
}

const DescribeBoneShieldWaste: ViolationExplainer<any>['describe'] = ({ violation }) => {
  const isMarrowrend = violation.actualCast.ability.guid === talents.MARROWREND_TALENT.id;
  return (
    <>
      <p>
        <ActualCastDescription event={violation.actualCast} /> when{' '}
        <SpellLink spell={SPELLS.BONE_SHIELD} /> was present and did not need to be refreshed.
      </p>
      <p>
        You could have generated <strong>{isMarrowrend ? 10 : 5}+</strong> additional{' '}
        <ResourceLink id={RESOURCE_TYPES.RUNIC_POWER.id} /> by casting{' '}
        <SpellLink spell={talents.HEART_STRIKE_TALENT} /> {isMarrowrend ? 'twice' : ''} instead.
      </p>
    </>
  );
};

export function RuneWaste(): JSX.Element | null {
  const events = useEvents();
  const info = useInfo();
  const props = useRuneWasteProblems(events, info);

  const numSuccess = props?.result.successes.length;
  const numFailures = props?.result.violations.length;
  const boneShieldFailures = props?.claimData.claims.size;

  const perf = useMemo(() => {
    const ratio = (boneShieldFailures ?? 0) / ((numSuccess ?? 1) + (numFailures ?? 0));
    if (ratio < 0.05) {
      return QualitativePerformance.Good;
    } else if (ratio < 0.15) {
      return QualitativePerformance.Ok;
    } else {
      return QualitativePerformance.Fail;
    }
  }, [numSuccess, numFailures, boneShieldFailures]);

  if (!props) {
    return null;
  }

  return (
    <SuggestionBox
      performance={perf}
      title={
        <>
          <SpellLink spell={talents.HEART_STRIKE_TALENT} /> should be your primary source of RP.
        </>
      }
      description={
        <>
          Heart Strike generates a lot more{' '}
          <Highlight textColor="#111" color={RunicPowerColor}>
            Bonus
          </Highlight>{' '}
          RP than other abilities.
        </>
      }
    >
      <div>
        <p>
          Using <SpellLink spell={talents.MARROWREND_TALENT} /> too much is one of the most common
          problems. <SpellLink spell={talents.MARROWREND_TALENT} /> generates less{' '}
          <ResourceLink id={RESOURCE_TYPES.RUNIC_POWER.id} /> and does less damage per Rune than{' '}
          <SpellLink spell={talents.HEART_STRIKE_TALENT} />.{' '}
          <SpellLink spell={talents.MARROWREND_TALENT} /> should <em>only</em> be used to apply and
          refresh <SpellLink spell={SPELLS.BONE_SHIELD} />!
        </p>
        <ViolationProblemList
          describer={DescribeBoneShieldWaste}
          {...props}
          orientation="column"
          secondsShown={9}
        />
      </div>
    </SuggestionBox>
  );
}
