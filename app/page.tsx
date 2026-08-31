'use client';

import { useEffect, useState } from 'react';

import { DataStoreLab } from '@/app/data-store-lab';
import { SchemaLab } from '@/app/schema-lab';
import { RelationshipLab } from '@/app/relationship-lab';
import { DaxMicroscope } from '@/app/dax-microscope';
import { DirectLakeLab } from '@/app/direct-lake-lab';
import { ExamMap } from '@/app/exam-map';
import { FabricAtlas } from '@/app/fabric-atlas';
import { FoundationBridge } from '@/app/foundation-bridge';
import { HomePage } from '@/app/home';
import { JourneyIndex } from '@/app/journey-index';
import { JourneyStopPage } from '@/app/journey-stop';
import { TransformationWorkbench } from '@/app/transformation-workbench';
import { QueryRosetta } from '@/app/query-rosetta';
import { ScdTimeMachine } from '@/app/scd-time-machine';
import { StorageModeLab } from '@/app/storage-mode-lab';
import { IncrementalRefreshLab } from '@/app/incremental-refresh-lab';
import { SecurityLens } from '@/app/security-lens';
import { PerformanceLab } from '@/app/performance-lab';
import { FieldParameterExplorer } from '@/app/field-parameter-explorer';
import { CalculationGroupLab } from '@/app/calculation-group-lab';
import { CompositeModelLab } from '@/app/composite-model-lab';

export default function Home() {
  const [route, setRoute] = useState('home');

  useEffect(() => {
    const syncRoute = () => {
      const raw = window.location.hash;
      setRoute(raw ? raw.replace(/^#\/?/, '') : 'home');
    };
    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  if (route === 'lab/data-stores') return <DataStoreLab />;
  if (route === 'lab/schema') return <SchemaLab />;
  if (route === 'lab/relationships') return <RelationshipLab />;
  if (route === 'lab/dax') return <DaxMicroscope />;
  if (route === 'lab/direct-lake') return <DirectLakeLab />;
  if (route === 'exam' || route === 'map') return <ExamMap />;
  if (route === 'lab/transformation') return <TransformationWorkbench />;
  if (route === 'lab/query') return <QueryRosetta />;
  if (route === 'lab/scd') return <ScdTimeMachine />;
  if (route === 'lab/storage-modes') return <StorageModeLab />;
  if (route === 'lab/incremental-refresh') return <IncrementalRefreshLab />;
  if (route === 'lab/security') return <SecurityLens />;
  if (route === 'lab/performance') return <PerformanceLab />;
  if (route === 'lab/field-parameters') return <FieldParameterExplorer />;
  if (route === 'lab/calculation-groups') return <CalculationGroupLab />;
  if (route === 'lab/composite-models') return <CompositeModelLab />;
  if (route === 'journeys') return <JourneyIndex />;
  if (route.startsWith('journey/')) return <JourneyStopPage key={route} />;
  if (route === 'foundations' || route.startsWith('foundations/')) return <FoundationBridge key={route} />;
  if (route === 'explore') return <FabricAtlas />;

  return <HomePage />;
}
