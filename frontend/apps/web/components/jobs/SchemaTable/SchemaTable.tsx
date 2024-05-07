'use client';
import { SingleTableSchemaFormValues } from '@/app/(mgmt)/[account]/new/job/schema';
import DualListBox, {
  Action,
  Option,
} from '@/components/DualListBox/DualListBox';
import Spinner from '@/components/Spinner';
import { useAccount } from '@/components/providers/account-provider';
import SkeletonTable from '@/components/skeleton/SkeletonTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ConnectionSchemaMap } from '@/libs/hooks/useGetConnectionSchemaMap';
import { useGetTransformersHandler } from '@/libs/hooks/useGetTransformersHandler';
import { JobMappingFormValues, SchemaFormValues } from '@/yup-validations/jobs';
import { TableIcon } from '@radix-ui/react-icons';
import { ReactElement, useMemo } from 'react';
import { FieldErrors } from 'react-hook-form';
import FormErrorsCard, { FormError } from './FormErrorsCard';
import { getSchemaColumns } from './SchemaColumns';
import SchemaPageTable from './SchemaPageTable';
import { JobType, SchemaConstraintHandler } from './schema-constraint-handler';

interface Props {
  data: JobMappingFormValues[];
  jobType: JobType;
  schema: ConnectionSchemaMap;
  isSchemaDataReloading: boolean;
  constraintHandler: SchemaConstraintHandler;
  selectedTables: Set<string>;
  onSelectedTableToggle(items: Set<string>, action: Action): void;

  formErrors: FormError[];
}

export function SchemaTable(props: Props): ReactElement {
  const {
    data,
    constraintHandler,
    jobType,
    schema,
    selectedTables,
    onSelectedTableToggle,
    formErrors,
  } = props;

  const { account } = useAccount();
  const { handler, isLoading, isValidating } = useGetTransformersHandler(
    account?.id ?? ''
  );

  const columns = useMemo(() => {
    return getSchemaColumns({
      transformerHandler: handler,
      constraintHandler,
      jobType,
    });
  }, [handler, constraintHandler, jobType]);

  // it is imperative that this is stable to not cause infinite re-renders of the listbox(s)
  const dualListBoxOpts = useMemo(
    () => getDualListBoxOptions(schema, data),
    [schema, data]
  );

  if (isLoading || !data) {
    return <SkeletonTable />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col md:flex-row gap-3">
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <div className="flex">
                <TableIcon className="h-4 w-4" />
              </div>
              <CardTitle>Table Selection</CardTitle>
              <div>{isValidating ? <Spinner /> : null}</div>
            </div>
            <CardDescription>
              Select the tables that you want to transform and move them from
              the source to destination table.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DualListBox
              options={dualListBoxOpts}
              selected={selectedTables}
              onChange={onSelectedTableToggle}
              mode={jobType === 'generate' ? 'single' : 'many'}
            />
          </CardContent>
        </Card>
        <FormErrorsCard formErrors={formErrors} />
      </div>
      <SchemaPageTable
        columns={columns}
        data={data}
        transformerHandler={handler}
        constraintHandler={constraintHandler}
        jobType={jobType}
      />
    </div>
  );
}

function getDualListBoxOptions(
  schema: ConnectionSchemaMap,
  jobmappings: JobMappingFormValues[]
): Option[] {
  const tables = new Set(Object.keys(schema));
  jobmappings.forEach((jm) => tables.add(`${jm.schema}.${jm.table}`));
  return Array.from(tables).map((table): Option => ({ value: table }));
}

export function extractAllFormErrors(
  errors: FieldErrors<SchemaFormValues | SingleTableSchemaFormValues>,
  values: JobMappingFormValues[],
  path = ''
): FormError[] {
  let messages: FormError[] = [];

  for (const key in errors) {
    let newPath = path;

    if (!isNaN(Number(key))) {
      const index = Number(key);
      if (index < values.length) {
        const value = values[index];
        const column = `${value.schema}.${value.table}.${value.column}`;
        newPath = path ? `${path}.${column}` : column;
      }
    }
    const error = (errors as any)[key as unknown as any] as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!error) {
      continue;
    }
    if (error.message) {
      messages.push({
        path: newPath,
        message: error.message,
        type: error.type,
      });
    } else {
      messages = messages.concat(extractAllFormErrors(error, values, newPath));
    }
  }
  return messages;
}
