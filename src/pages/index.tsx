import {
  CircularProgress,
  Collapse,
  Grid,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from 'mui-datatables';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import CardUser from 'src/components/cards/user';
import withAuthentication, {
  AuthenticationProps,
} from 'src/components/hoc/with-authentication';
import Layout from 'src/components/layout';
import { listUser } from 'src/libs/api-client';
import { UserWithoutPassword as User } from 'src/types';

const columns: MUIDataTableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    options: {
      display: 'false',
    },
  },
  {
    name: 'firstName',
    label: 'First name',
  },
  {
    name: 'lastName',
    label: 'Last name',
  },
  {
    name: 'username',
    label: 'User name',
  },
  {
    name: 'picture',
    options: {
      display: 'false',
    },
  },
  {
    name: 'bio',
    options: {
      display: 'false',
    },
  },
];
const IndexPage: NextPage<AuthenticationProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const options: Partial<MUIDataTableOptions> = {
    responsive: 'standard',
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow(rowData: Array<User[keyof User]>) {
      const colSpan = rowData.length + 1;

      return (
        <TableRow>
          <TableCell colSpan={colSpan}>
            <CardUser
              id={rowData[0]}
              firstName={rowData[1]}
              lastName={rowData[2]}
              username={rowData[3]}
              picture={rowData[4]}
              bio={rowData[5]}
            />
          </TableCell>
        </TableRow>
      );
    },
  };

  useEffect(() => {
    const abortController = new AbortController();
    let isCanceled = false;
    async function fetchUser() {
      try {
        setError(null);
        setIsLoading(true);
        const data = await listUser({
          limit: 100,
          signal: abortController.signal,
        });
        if (!isCanceled) setUsers(data);
      } catch (error) {
        if (!isCanceled) setError(error.message);
      } finally {
        if (!isCanceled) setIsLoading(false);
      }
    }
    fetchUser();

    return () => {
      isCanceled = true;
      abortController.abort();
    };
  }, []);

  return (
    <Layout>
      <Grid
        container
        spacing={3}
        direction="column"
        style={{ paddingTop: '2em' }}
      >
        <Grid item lg style={{ display: error ? 'block' : 'none' }}>
          <Collapse in={Boolean(error)}>
            <Alert severity="error">{error}</Alert>
          </Collapse>
        </Grid>
        <Grid item lg>
          <MUIDataTable
            title={
              <Typography variant="h6">
                User List
                {isLoading && (
                  <CircularProgress
                    size={24}
                    style={{ marginLeft: 15, position: 'relative', top: 4 }}
                  />
                )}
              </Typography>
            }
            columns={columns}
            options={options}
            data={users}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default withAuthentication(IndexPage);
