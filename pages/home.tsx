import React from 'react';
import * as antd from 'antd';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { MainPage } from '../components/MainPage';
import { useRouter } from 'next/router';
import { ColumnsType } from 'antd/lib/table';
import { getSession } from 'next-auth/client';

import { Notification } from '../components/Notification';
import { prisma } from '../database/db';
import { AppContext } from '../components/AppContext';
import { DangerButton } from '../components/DangerButton';

const home = ({ error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const appCtx = React.useContext(AppContext);
  const [dataSource, setDataSource] = React.useState<Service[]>([]); //coulmns data

  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const pageSize = 10;

  interface Service {
    id: number;
    name: string;
  }

  const columns: ColumnsType<Service> = [
    {
      title: 'Name',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: 'ServiceType',
      align: 'center',
      dataIndex: 'serviceType',
    },
    {
      title: 'Host',
      align: 'center',
      dataIndex: 'host',
    },
    {
      title: 'SSH Username',
      align: 'center',
      dataIndex: 'username',
    },
    {
      align: 'center',
      render: (item) => (
        <DangerButton
          title="刪除"
          message="確認刪除"
          onClick={async () => {
            let data = await appCtx.fetch('delete', `/api/service?id=${item.id}`);
            if (data) {
              router.push('/home');
              Notification.add('success', 'Delete Success');
            }
          }}
        />
      ),
    },
  ];

  React.useEffect(() => {
    if (error) {
      Notification.add('error', error);
    }
    const temp = [{ id: 0, name: 'home' }].map((service: Service) => {
      return {
        key: service.name,
        title: service.name,
      };
    });
    appCtx.setMenus(temp);
  }, []);

  const content = (
    <>
      <div className="d-flex justify-content-end mb-2">
        <antd.Button type="primary" onClick={() => {}}>
          新增
        </antd.Button>
      </div>
      <antd.Table dataSource={dataSource} columns={columns} pagination={false} />
    </>
  );

  return <MainPage content={content} menuKey="home" />;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
        props: {},
      };
    }

    // const services = await prisma.service.findMany({
    //   select: { id: true, name: true, serviceType: true, host: true, username: true },
    // });
    return { props: {} };
  } catch (error) {
    return { props: { error: error.message } };
  }
};

export default home;
