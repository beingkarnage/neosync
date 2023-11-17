'use client';
import { isConnectionNameAvailable } from '@/app/new/connection/postgres/PostgresForm';
import ButtonText from '@/components/ButtonText';
import FormError from '@/components/FormError';
import Spinner from '@/components/Spinner';
import RequiredLabel from '@/components/labels/RequiredLabel';
import { getAccount } from '@/components/providers/account-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckConnectionConfigResponse,
  ConnectionConfig,
  PostgresConnection,
  PostgresConnectionConfig,
  UpdateConnectionRequest,
  UpdateConnectionResponse,
} from '@/neosync-api-client/mgmt/v1alpha1/connection_pb';
import { SSL_MODES } from '@/yup-validations/connections';
import { yupResolver } from '@hookform/resolvers/yup';
import { ExclamationTriangleIcon, RocketIcon } from '@radix-ui/react-icons';
import { ReactElement, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

const FORM_SCHEMA = Yup.object({
  connectionName: Yup.string()
    .required('Connection Name is a required field')
    .test(
      'validConnectionName',
      'Connection Name must be at least 3 characters long and can only include lowercase letters, numbers, and hyphens.',
      async (value, context) => {
        if (!value || value.length < 3) {
          return false;
        }
        const regex = /^[a-z0-9-]+$/;
        if (!regex.test(value)) {
          return context.createError({
            message:
              'Connection Name can only include lowercase letters, numbers, and hyphens.',
          });
        }

        const account = getAccount();
        if (!account) {
          return false;
        }

        try {
          const res = await isConnectionNameAvailable(value, account.id);
          if (!res.isAvailable) {
            return context.createError({
              message: 'This Connection Name is already taken.',
            });
          }
          return true;
        } catch (error) {
          return context.createError({
            message: 'Error validating name availability.',
          });
        }
      }
    ),
  db: Yup.object({
    host: Yup.string().required(),
    name: Yup.string().required(),
    user: Yup.string().required(),
    pass: Yup.string().required(),
    port: Yup.number().integer().positive().required(),
    sslMode: Yup.string().optional(),
  }).required(),
});
type FormValues = Yup.InferType<typeof FORM_SCHEMA>;

interface Props {
  connectionId: string;
  defaultValues: FormValues;
  onSaved(updatedConnectionResp: UpdateConnectionResponse): void;
  onSaveFailed(err: unknown): void;
}

export default function PostgresForm(props: Props) {
  const { connectionId, defaultValues, onSaved, onSaveFailed } = props;
  const form = useForm<FormValues>({
    resolver: yupResolver(FORM_SCHEMA),
    defaultValues: {
      connectionName: '',
      db: {
        host: '',
        name: '',
        user: '',
        pass: '',
        port: 0,
        sslMode: '',
      },
    },
    values: defaultValues,
  });
  const [checkResp, setCheckResp] = useState<
    CheckConnectionConfigResponse | undefined
  >();

  const [isTesting, setIsTesting] = useState<boolean>(false);

  async function onSubmit(values: FormValues) {
    try {
      const checkResp = await checkPostgresConnection(values.db);
      setCheckResp(checkResp);

      if (!checkResp.isConnected) {
        return;
      }
      const connectionResp = await updatePostgresConnection(
        connectionId,
        values.db
      );
      onSaved(connectionResp);
    } catch (err) {
      console.error(err);
      onSaveFailed(err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Controller
          control={form.control}
          name="connectionName"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Connection Name
              </FormLabel>
              <FormDescription>
                The unique name of the connection
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="Connection Name"
                  {...field}
                  onChange={async ({ target: { value } }) => {
                    onChange(value);
                    await form.trigger('connectionName');
                  }}
                />
              </FormControl>
              <FormError
                errorMessage={
                  form.formState.errors.connectionName?.message ?? ''
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db.host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Host Name
              </FormLabel>
              <FormDescription>The host name</FormDescription>
              <FormControl>
                <Input placeholder="Host" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db.port"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Database Port
              </FormLabel>
              <FormDescription>The database port.</FormDescription>
              <FormControl>
                <Input placeholder="5432" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Database Name
              </FormLabel>
              <FormDescription>The database name</FormDescription>
              <FormControl>
                <Input placeholder="postgres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db.user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Database Username
              </FormLabel>
              <FormDescription>The database username</FormDescription>
              <FormControl>
                <Input placeholder="postgres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db.pass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Database Password
              </FormLabel>
              <FormDescription>The database password</FormDescription>
              <FormControl>
                <Input placeholder="postgres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="db.sslMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                SSL Mode
              </FormLabel>
              <FormDescription>
                Turn on SSL Mode to use TLS for client/server encryption.
              </FormDescription>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={defaultValues.db.sslMode ?? ''} />
                  </SelectTrigger>
                  <SelectContent>
                    {SSL_MODES.map((mode) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={mode}
                        value={mode}
                      >
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TestConnectionResult resp={checkResp} />
        <div className="flex flex-row gap-3 justify-between">
          <Button
            variant="outline"
            disabled={!form.formState.isValid}
            onClick={async () => {
              setIsTesting(true);
              try {
                const resp = await checkPostgresConnection(form.getValues().db);
                setCheckResp(resp);
                setIsTesting(false);
              } catch (err) {
                setCheckResp(
                  new CheckConnectionConfigResponse({
                    isConnected: false,
                    connectionError:
                      err instanceof Error ? err.message : 'unknown error',
                  })
                );
                setIsTesting(false);
              }
            }}
            type="button"
          >
            <ButtonText
              leftIcon={
                isTesting ? <Spinner className="text-black" /> : <div></div>
              }
              text="Test Connection"
            />
          </Button>

          <Button type="submit" disabled={!form.formState.isValid}>
            <ButtonText
              leftIcon={form.formState.isSubmitting ? <Spinner /> : <div></div>}
              text="submit"
            />
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface TestConnectionResultProps {
  resp: CheckConnectionConfigResponse | undefined;
}

function TestConnectionResult(props: TestConnectionResultProps): ReactElement {
  const { resp } = props;
  if (resp) {
    if (resp.isConnected) {
      return (
        <SuccessAlert
          title="Woohoo!"
          description="Successfully connected to database!"
        />
      );
    } else {
      return (
        <ErrorAlert
          title="Unable to connect"
          description={resp.connectionError ?? 'no error returned'}
        />
      );
    }
  }
  return <div />;
}

interface SuccessAlertProps {
  title: string;
  description: string;
}

function SuccessAlert(props: SuccessAlertProps): ReactElement {
  const { title, description } = props;
  return (
    <Alert>
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

interface ErrorAlertProps {
  title: string;
  description: string;
}

function ErrorAlert(props: ErrorAlertProps): ReactElement {
  const { title, description } = props;
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

async function updatePostgresConnection(
  connectionId: string,
  db: FormValues['db']
): Promise<UpdateConnectionResponse> {
  const res = await fetch(`/api/connections/${connectionId}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(
      new UpdateConnectionRequest({
        id: connectionId,
        connectionConfig: new ConnectionConfig({
          config: {
            case: 'pgConfig',
            value: new PostgresConnectionConfig({
              connectionConfig: {
                case: 'connection',
                value: new PostgresConnection({
                  host: db.host,
                  name: db.name,
                  user: db.user,
                  pass: db.pass,
                  port: db.port,
                  sslMode: db.sslMode,
                }),
              },
            }),
          },
        }),
      })
    ),
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return UpdateConnectionResponse.fromJson(await res.json());
}

async function checkPostgresConnection(
  db: FormValues['db']
): Promise<CheckConnectionConfigResponse> {
  const res = await fetch(`/api/connections/postgres/check`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(db),
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return CheckConnectionConfigResponse.fromJson(await res.json());
}
