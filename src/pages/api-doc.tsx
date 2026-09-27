import dynamic from 'next/dynamic'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import 'swagger-ui-react/swagger-ui.css'

import { getApiDocs } from '@/lib/swagger'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocPage({
  spec
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <SwaggerUI spec={spec} />
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: { spec: getApiDocs() }
})
