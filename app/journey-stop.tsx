'use client';

import { JourneyStopChrome } from '@/components/journey-stop-chrome';
import { CalculationGroupLab } from '@/app/calculation-group-lab';
import { CompositeModelLab } from '@/app/composite-model-lab';
import { DataStoreLab } from '@/app/data-store-lab';
import { DaxMicroscope } from '@/app/dax-microscope';
import { DirectLakeLab } from '@/app/direct-lake-lab';
import { FabricAtlas } from '@/app/fabric-atlas';
import { FieldParameterExplorer } from '@/app/field-parameter-explorer';
import { PerformanceLab } from '@/app/performance-lab';
import { RelationshipLab } from '@/app/relationship-lab';
import { ScdTimeMachine } from '@/app/scd-time-machine';
import { SchemaLab } from '@/app/schema-lab';
import { SecurityLens } from '@/app/security-lens';
import { StorageModeLab } from '@/app/storage-mode-lab';
import { TransformationWorkbench } from '@/app/transformation-workbench';
import { journeys, journeyStops, type JourneyId } from '@/content/journeys';

const labComponents: Record<string, () => React.JSX.Element> = {
  '#explore': FabricAtlas,
  '#/lab/data-stores': DataStoreLab,
  '#/lab/transformation': TransformationWorkbench,
  '#/lab/schema': SchemaLab,
  '#/lab/relationships': RelationshipLab,
  '#/lab/dax': DaxMicroscope,
  '#/lab/storage-modes': StorageModeLab,
  '#/lab/security': SecurityLens,
  '#/lab/performance': PerformanceLab,
  '#/lab/scd': ScdTimeMachine,
  '#/lab/direct-lake': DirectLakeLab,
  '#/lab/calculation-groups': CalculationGroupLab,
  '#/lab/field-parameters': FieldParameterExplorer,
  '#/lab/composite-models': CompositeModelLab,
};

export function JourneyStopPage() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [, journeyId, stopId] = hash.split('/');
  const journey = journeys[journeyId as JourneyId];
  const stop = stopId ? journeyStops[stopId] : undefined;

  if (!journey || !stop) {
    return (
      <div className="journey-missing">
        <p>That field-trip stop couldn’t be found.</p>
        <a href="#/journeys">Back to Field Trips</a>
      </div>
    );
  }

  const LabComponent = labComponents[stop.labHref] ?? FabricAtlas;

  return (
    <JourneyStopChrome journey={journey} stop={stop}>
      <LabComponent />
    </JourneyStopChrome>
  );
}
